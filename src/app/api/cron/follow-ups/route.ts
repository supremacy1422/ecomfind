import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { google } from "googleapis";

export async function GET(req: NextRequest) {
  // Secure cron
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const now = new Date().toISOString();
  const { data: due } = await supabase
    .from("follow_up_enrollments")
    .select("*, sequence:follow_up_sequences(name)")
    .eq("status", "active")
    .lte("next_send_at", now);

  if (!due || due.length === 0) {
    return NextResponse.json({ processed: 0, sent: 0, skipped: 0 });
  }

  let sent = 0;
  let skipped = 0;

  for (const e of due) {
    try {
      // Get sender account
      const { data: sender } = await supabase
        .from("gmail_accounts")
        .select("*")
        .eq("user_id", e.user_id)
        .eq("email", e.sender_email)
        .single();

      if (!sender) {
        await pause(supabase, e.id, "Sender account not found");
        continue;
      }

      // Check replies if we have a thread
      if (e.thread_id) {
        const replied = await checkReply(sender, e.thread_id, e.lead_email);
        if (replied) {
          await supabase.from("follow_up_enrollments")
            .update({ status: "replied", completed_at: now })
            .eq("id", e.id);
          skipped++;
          continue;
        }
      }

      // Get steps
      const { data: steps } = await supabase
        .from("follow_up_steps")
        .select("*")
        .eq("sequence_id", e.sequence_id)
        .order("step_order", { ascending: true });

      if (!steps || !steps[e.current_step_index]) {
        await complete(supabase, e.id);
        continue;
      }

      const step = steps[e.current_step_index];

      // Send
      const result = await sendEmail(sender, e, step);
      if (result.success) {
        await supabase.from("follow_up_logs").insert({
          enrollment_id: e.id,
          step_id: step.id,
          status: "sent",
          sent_at: now,
        });

        const nextIdx = e.current_step_index + 1;
        if (nextIdx >= steps.length) {
          await complete(supabase, e.id);
        } else {
          const nextStep = steps[nextIdx];
          const nextSend = new Date();
          nextSend.setDate(nextSend.getDate() + nextStep.delay_days);
          await supabase.from("follow_up_enrollments").update({
            current_step_index: nextIdx,
            next_send_at: nextSend.toISOString(),
            thread_id: result.threadId || e.thread_id,
            last_message_id: result.messageId,
          }).eq("id", e.id);
        }
        sent++;
      } else {
        await pause(supabase, e.id, result.error);
      }
    } catch (err: any) {
      await pause(supabase, e.id, err.message);
    }
  }

  return NextResponse.json({ processed: due.length, sent, skipped });
}

async function checkReply(sender: any, threadId: string, leadEmail: string) {
  try {
    const oauth2 = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2.setCredentials({ refresh_token: sender.refresh_token });
    const gmail = google.gmail({ version: "v1", auth: oauth2 });
    const res = await gmail.users.threads.get({ userId: "me", id: threadId });

    for (const msg of res.data.messages || []) {
      const from = msg.payload?.headers?.find((h: any) => h.name === "From")?.value || "";
      if (from.toLowerCase().includes(leadEmail.toLowerCase())) return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function sendEmail(sender: any, enrollment: any, step: any) {
  try {
    const oauth2 = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2.setCredentials({ refresh_token: sender.refresh_token });
    const access = await oauth2.getAccessToken();
    oauth2.setCredentials({ access_token: access.token });

    const gmail = google.gmail({ version: "v1", auth: oauth2 });
    const subject = step.subject.replace(/{{domain}}/g, enrollment.lead_domain);
    const body = step.body
      .replace(/{{domain}}/g, enrollment.lead_domain)
      .replace(/{{email}}/g, enrollment.lead_email);

    const raw = Buffer.from(
      `From: ${sender.email}\nTo: ${enrollment.lead_email}\nSubject: ${subject}\nContent-Type: text/html; charset=utf-8\n\n${body}`
    ).toString("base64url");

    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw, threadId: enrollment.thread_id || undefined },
    });

    return { success: true, messageId: res.data.id, threadId: res.data.threadId };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

async function complete(supabase: any, id: string) {
  await supabase.from("follow_up_enrollments").update({
    status: "completed",
    completed_at: new Date().toISOString(),
  }).eq("id", id);
}

async function pause(supabase: any, id: string, reason: string) {
  await supabase.from("follow_up_enrollments").update({ status: "paused" }).eq("id", id);
  await supabase.from("follow_up_logs").insert({
    enrollment_id: id,
    status: "failed",
    error: reason,
  });
}