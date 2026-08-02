import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { createClient } from "@supabase/supabase-js";

const rateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxPerMinute = 10;

  const existing = rateLimits.get(userId);
  if (!existing || now > existing.resetAt) {
    rateLimits.set(userId, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (existing.count >= maxPerMinute) return false;
  existing.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body, fromName } = await req.json();
    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const token = req.headers.get("x-supabase-token");
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: "Rate limit: 10 emails per minute max." },
        { status: 429 }
      );
    }

    const today = new Date().toISOString().split("T")[0];
    const { count: sentToday } = await supabase
      .from("email_send_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("sent_at", `${today}T00:00:00`)
      .lte("sent_at", `${today}T23:59:59`);

    if ((sentToday || 0) >= 450) {
      return NextResponse.json(
        { error: "Daily limit reached (450/500). Try again tomorrow or use a different Gmail." },
        { status: 429 }
      );
    }

    const { data: conn } = await supabase
      .from("gmail_connections")
      .select("email, refresh_token")
      .eq("user_id", user.id)
      .single();

    if (!conn) {
      return NextResponse.json(
        { error: "Connect your Gmail first" },
        { status: 400 }
      );
    }

    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ refresh_token: conn.refresh_token });
    const { token: accessToken } = await oauth2Client.getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Gmail token expired. Please reconnect your Gmail." },
        { status: 500 }
      );
    }

    const emailLines = [
      `From: ${fromName || "EcomFind"} <${conn.email}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "",
      body,
    ];
    const rawEmail = Buffer.from(emailLines.join("\r\n"))
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const sendRes = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw: rawEmail }),
      }
    );

    if (!sendRes.ok) {
      const err = await sendRes.json().catch(() => ({}));
      console.error("Gmail API error:", err);
      return NextResponse.json(
        { error: "Gmail rejected the send. You may have hit your daily limit.", detail: err },
        { status: 500 }
      );
    }

    await supabase.from("email_send_logs").insert({
      user_id: user.id,
      recipient: to,
      subject,
      sent_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, sentToday: (sentToday || 0) + 1 });
  } catch (err: any) {
    console.error("Send error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to send" },
      { status: 500 }
    );
  }
}