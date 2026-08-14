import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { lead_ids, sequence_id, sender_email } = body;

  // Get steps
  const { data: steps } = await supabase
    .from("follow_up_steps")
    .select("*")
    .eq("sequence_id", sequence_id)
    .order("step_order", { ascending: true });

  if (!steps || steps.length === 0) {
    return NextResponse.json({ error: "Sequence has no steps" }, { status: 400 });
  }

  // Get leads
  const { data: leads } = await supabase
    .from("saved_leads")
    .select("id, domain, email")
    .in("id", lead_ids)
    .eq("user_id", user.id);

  if (!leads || leads.length === 0) {
    return NextResponse.json({ error: "No leads found" }, { status: 400 });
  }

  const firstDelay = steps[0].delay_days;
  const nextSend = new Date();
  nextSend.setDate(nextSend.getDate() + firstDelay);

  const enrollments = leads.map((lead) => ({
    user_id: user.id,
    sequence_id,
    lead_id: lead.id,
    lead_email: lead.email || `contact@${lead.domain}`,
    lead_domain: lead.domain,
    sender_email: sender_email,
    status: "active",
    current_step_index: 0,
    next_send_at: nextSend.toISOString(),
  }));

  const { data: enrolled, error } = await supabase
    .from("follow_up_enrollments")
    .insert(enrollments)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log scheduled
  const logs = (enrolled || []).map((e) => ({
    enrollment_id: e.id,
    step_id: steps[0].id,
    status: "scheduled",
  }));
  await supabase.from("follow_up_logs").insert(logs);

  return NextResponse.json({ enrolled: enrolled?.length || 0 });
}