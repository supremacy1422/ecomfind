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
    const { to, subject, body, fromName, connectionId } = await req.json();
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

    // ─── Find Gmail connection ───
    let query = supabase
      .from("gmail_connections")
      .select("id, email, refresh_token, daily_limit, sent_today, reset_date, is_active")
      .eq("user_id", user.id)
      .eq("is_active", true);

    // If connectionId provided (from campaign system), use that specific one
    if (connectionId) {
      query = query.eq("id", connectionId);
    }

    const { data: connections } = await query;
    
    if (!connections?.length) {
      return NextResponse.json(
        { error: "No active Gmail connections found. Connect Gmail first." },
        { status: 400 }
      );
    }

    // Pick first available connection (or the specific one requested)
    const conn = connections[0];

    // ─── Check daily limit ───
    const today = new Date().toISOString().split("T")[0];
    
    // Reset counter if it's a new day
    if (conn.reset_date !== today) {
      await supabase
        .from("gmail_connections")
        .update({ sent_today: 0, reset_date: today })
        .eq("id", conn.id);
      conn.sent_today = 0;
    }

    if ((conn.sent_today || 0) >= (conn.daily_limit || 100)) {
      return NextResponse.json(
        { error: `Daily limit reached (${conn.sent_today}/${conn.daily_limit}) for ${conn.email}. Try another Gmail or wait until tomorrow.` },
        { status: 429 }
      );
    }

    // ─── Send via Gmail API ───
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

    // Build UTF-8 email with proper MIME headers
    const utf8Subject = `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;

    const rawMessage = [
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=UTF-8",
      "Content-Transfer-Encoding: 8bit",
      `From: ${fromName || "EcomFind"} <${conn.email}>`,
      `To: ${to}`,
      `Subject: ${utf8Subject}`,
      "",
      body,
    ].join("\r\n");

    const rawEmail = Buffer.from(rawMessage)
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

    // ─── Update sent counter ───
    await supabase
      .from("gmail_connections")
      .update({ sent_today: (conn.sent_today || 0) + 1 })
      .eq("id", conn.id);

    // ─── Log to email_send_logs ───
    await supabase.from("email_send_logs").insert({
      user_id: user.id,
      recipient: to,
      subject,
      sent_at: new Date().toISOString(),
    });

    return NextResponse.json({ 
      success: true, 
      sentToday: (conn.sent_today || 0) + 1,
      fromEmail: conn.email 
    });
  } catch (err: any) {
    console.error("Send error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to send" },
      { status: 500 }
    );
  }
}