import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body } = await req.json();
    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized — please sign in" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get saved Gmail token
    const { data: tokenRow, error: tokenError } = await supabase
      .from("user_gmail_tokens")
      .select("access_token, refresh_token, expires_at")
      .eq("user_id", userId)
      .single();

    if (tokenError || !tokenRow) {
      return NextResponse.json(
        { error: "Gmail not connected. Please go to Settings and reconnect your Google account." },
        { status: 401 }
      );
    }

    let accessToken = tokenRow.access_token;

    // Check if token is expired and refresh if needed
    const now = Math.floor(Date.now() / 1000);
    if (tokenRow.expires_at && now >= tokenRow.expires_at && tokenRow.refresh_token) {
      try {
        const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID || "",
            client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
            refresh_token: tokenRow.refresh_token,
            grant_type: "refresh_token",
          }),
        });
        const refreshData = await refreshRes.json();
        if (refreshData.access_token) {
          accessToken = refreshData.access_token;
          // Update token in DB
          await supabase.from("user_gmail_tokens").upsert({
            user_id: userId,
            access_token: accessToken,
            expires_at: now + (refreshData.expires_in || 3600),
            updated_at: new Date().toISOString(),
          }, { onConflict: "user_id" });
        }
      } catch {
        // fallback to existing token
      }
    }

    // Send email via Gmail API
    const emailContent = [
      "From: me",
      `To: ${to}`,
      `Subject: ${subject}`,
      "",
      body,
    ].join("\r\n");

    const encodedEmail = Buffer.from(emailContent)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const sendRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: encodedEmail }),
    });

    if (!sendRes.ok) {
      const errText = await sendRes.text();
      // If token is invalid, tell user to reconnect
      if (sendRes.status === 401) {
        return NextResponse.json(
          { error: "Gmail session expired. Please disconnect and reconnect your Google account." },
          { status: 401 }
        );
      }
      return NextResponse.json({ error: `Gmail API error: ${errText}` }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "Email sent successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to send email" }, { status: 500 });
  }
}