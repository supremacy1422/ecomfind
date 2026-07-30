import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getUserFromRequest(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.replace("Bearer ", "");
  return supabase.auth.getUser(token).then(({ data, error }) => (error ? null : data.user));
}

/* ───────── TOKEN REFRESH ───────── */
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });
    const data = await res.json();
    return data.access_token || null;
  } catch {
    return null;
  }
}

async function getValidAccessToken(userId: string): Promise<string | null> {
  const { data: tokenData } = await supabase
    .from("user_gmail_tokens")
    .select("access_token, refresh_token, expires_at")
    .eq("user_id", userId)
    .single();

  if (!tokenData) return null;

  const now = Math.floor(Date.now() / 1000);
  let accessToken = tokenData.access_token;

  // Refresh if expires in < 5 minutes or no expiry tracked
  if (!tokenData.expires_at || tokenData.expires_at < now + 300) {
    if (!tokenData.refresh_token) return null;
    const refreshed = await refreshAccessToken(tokenData.refresh_token);
    if (!refreshed) return null;
    accessToken = refreshed;
    await supabase
      .from("user_gmail_tokens")
      .update({ access_token: refreshed, expires_at: now + 3600 })
      .eq("user_id", userId);
  }

  return accessToken;
}

/* ───────── MIME BUILDER ───────── */
function makeMimeMessage(to: string, subject: string, body: string, from?: string) {
  const boundary = `ecomfind_${Math.random().toString(36).slice(2)}`;
  const utf8Subject = `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;

  const mime = [
    `MIME-Version: 1.0`,
    `To: ${to}`,
    from ? `From: ${from}` : ``,
    `Subject: ${utf8Subject}`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    Buffer.from(body, "utf8").toString("base64"),
  ]
    .filter(Boolean)
    .join("\r\n");

  return Buffer.from(mime)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/* ───────── RATE-LIMITED SEND ───────── */
async function sendGmailWithBackoff(
  accessToken: string,
  to: string,
  subject: string,
  body: string,
  fromEmail?: string,
  maxRetries = 3
): Promise<{ success: boolean; error?: string; retryAfter?: number }> {
  const raw = makeMimeMessage(to, subject, body, fromEmail);

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw }),
      });

      if (res.ok) {
        return { success: true };
      }

      const errorData = await res.json().catch(() => ({}));
      const errorMsg = errorData?.error?.message || errorData?.error?.errors?.[0]?.message || "";
      const status = res.status;

      // Rate limit detected
      if (status === 429 || errorMsg.toLowerCase().includes("rate limit") || errorMsg.toLowerCase().includes("user-rate")) {
        const retryAfter = parseInt(res.headers.get("Retry-After") || "0", 10) || Math.pow(2, attempt) * 2;
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, retryAfter * 1000));
          continue;
        }
        return { success: false, error: `Gmail rate limit exceeded. Retry after ${retryAfter}s.`, retryAfter };
      }

      // Auth errors
      if (status === 401) {
        return { success: false, error: "Gmail auth expired. Please reconnect." };
      }

      // Daily send limit
      if (errorMsg.toLowerCase().includes("daily") || errorMsg.toLowerCase().includes("quota")) {
        return { success: false, error: "Gmail daily send limit reached. Try again tomorrow." };
      }

      return { success: false, error: errorMsg || `Gmail API error (${status})` };
    } catch (err: any) {
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000));
        continue;
      }
      return { success: false, error: err.message || "Network error sending email" };
    }
  }

  return { success: false, error: "Max retries exceeded" };
}

/* ───────── MAIN HANDLER ───────── */
export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { to, subject, message, leadId } = body;

  if (!to || !subject || !message) {
    return NextResponse.json({ error: "Missing to, subject, or message" }, { status: 400 });
  }

  const accessToken = await getValidAccessToken(user.id);
  if (!accessToken) {
    return NextResponse.json({ error: "Gmail not connected or refresh failed" }, { status: 400 });
  }

  // Get sender email for From header
  const { data: gmailStatus } = await supabase
    .from("user_gmail_tokens")
    .select("email")
    .eq("user_id", user.id)
    .single();
  const fromEmail = gmailStatus?.email || undefined;

  const result = await sendGmailWithBackoff(accessToken, to, subject, message, fromEmail);

  if (result.success && leadId) {
    await supabase
      .from("store_leads")
      .update({
        status: "contacted",
        last_contacted_at: new Date().toISOString(),
        times_contacted: supabase.rpc("increment", { x: 1 }), // or handle client-side
      })
      .eq("id", leadId);
  }

  if (result.success) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { success: false, error: result.error, retryAfter: result.retryAfter },
    { status: 429 }
  );
}