import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { OAuth2Client } from "google-auth-library";

// This runs every minute via Vercel Cron
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role for background jobs
  );

  // Find campaigns that are sending
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*, campaign_recipients(*)")
    .eq("status", "sending")
    .limit(5);

  if (!campaigns?.length) return NextResponse.json({ ok: true, message: "No active campaigns" });

  for (const campaign of campaigns) {
    await processCampaign(supabase, campaign);
  }

  return NextResponse.json({ ok: true, processed: campaigns.length });
}

async function processCampaign(supabase: any, campaign: any) {
  // Get active Gmail connections for this user
  const { data: connections } = await supabase
    .from("gmail_connections")
    .select("*")
    .eq("user_id", campaign.user_id)
    .eq("is_active", true);

  if (!connections?.length) {
    await supabase.from("campaigns").update({ status: "paused" }).eq("id", campaign.id);
    return;
  }

  // Reset daily counters if it's a new day
  const today = new Date().toISOString().split("T")[0];
  for (const conn of connections) {
    if (conn.reset_date !== today) {
      await supabase.from("gmail_connections").update({ sent_today: 0, reset_date: today }).eq("id", conn.id);
      conn.sent_today = 0;
    }
  }

  // Find available connections (under daily limit)
  const available = connections.filter((c: any) => c.sent_today < c.daily_limit);
  if (!available.length) return; // All accounts hit limit, wait for next day

  // Get next batch of pending recipients (max 5 per minute to stay safe)
  const pending = campaign.campaign_recipients
    .filter((r: any) => r.status === "pending")
    .slice(0, 5);

  if (!pending.length) {
    // Campaign complete
    await supabase.from("campaigns").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", campaign.id);
    return;
  }

  // Rotate through available Gmail accounts
  let connIndex = 0;

  for (const recipient of pending) {
    const conn = available[connIndex % available.length];
    if (conn.sent_today >= conn.daily_limit) continue;

    const success = await sendEmail(supabase, conn, recipient, campaign);
    
    if (success) {
      conn.sent_today++;
      await supabase.from("gmail_connections").update({ sent_today: conn.sent_today }).eq("id", conn.id);
      await supabase.from("campaigns").update({ sent_count: campaign.sent_count + 1 }).eq("id", campaign.id);
      campaign.sent_count++;
    } else {
      await supabase.from("campaigns").update({ failed_count: campaign.failed_count + 1 }).eq("id", campaign.id);
      campaign.failed_count++;
    }

    connIndex++;
  }
}

async function sendEmail(supabase: any, conn: any, recipient: any, campaign: any): Promise<boolean> {
  try {
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ refresh_token: conn.refresh_token });
    const { token: accessToken } = await oauth2Client.getAccessToken();
    if (!accessToken) return false;

    // Replace variables
    let subject = campaign.subject
      .replace(/{firstName}/gi, recipient.first_name || "there")
      .replace(/{lastName}/gi, recipient.last_name || "")
      .replace(/{name}/gi, `${recipient.first_name} ${recipient.last_name}`.trim() || "there")
      .replace(/{email}/gi, recipient.email);

    let body = campaign.body
      .replace(/{firstName}/gi, recipient.first_name || "there")
      .replace(/{lastName}/gi, recipient.last_name || "")
      .replace(/{name}/gi, `${recipient.first_name} ${recipient.last_name}`.trim() || "there")
      .replace(/{email}/gi, recipient.email);

    // Add tracking pixel
    const trackingPixel = `<img src="https://ecomfind.vercel.app/api/track?id=${recipient.id}" width="1" height="1" alt="" />`;
    body += `\n\n${trackingPixel}`;

    const utf8Subject = `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;
    const rawMessage = [
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=UTF-8",
      "Content-Transfer-Encoding: 8bit",
      `From: ${campaign.from_name || "EcomFind"} <${conn.email}>`,
      `To: ${recipient.email}`,
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

    if (!sendRes.ok) return false;

    await supabase.from("campaign_recipients").update({
      status: "sent",
      sent_at: new Date().toISOString(),
      gmail_connection_id: conn.id,
    }).eq("id", recipient.id);

    return true;
  } catch (e) {
    console.error("Send error:", e);
    await supabase.from("campaign_recipients").update({
      status: "failed",
      error_message: String(e),
    }).eq("id", recipient.id);
    return false;
  }
}