import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function GET(req: NextRequest) {
  const supabase = getSupabase();
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("follow_up_sequences")
    .select("*, steps:follow_up_steps(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ sequences: data || [] });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description, steps } = body;

  const { data: seq, error: seqErr } = await supabase
    .from("follow_up_sequences")
    .insert({ user_id: user.id, name, description })
    .select()
    .single();

  if (seqErr) return NextResponse.json({ error: seqErr.message }, { status: 500 });

  const stepsInsert = steps.map((s: any, i: number) => ({
    sequence_id: seq.id,
    step_order: i,
    delay_days: s.delay_days,
    subject: s.subject,
    body: s.body,
  }));

  const { error: stepErr } = await supabase.from("follow_up_steps").insert(stepsInsert);
  if (stepErr) return NextResponse.json({ error: stepErr.message }, { status: 500 });

  return NextResponse.json({ sequence: seq });
}

export async function DELETE(req: NextRequest) {
  const supabase = getSupabase();
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await supabase.from("follow_up_sequences").delete().eq("id", id).eq("user_id", user.id);
  return NextResponse.json({ success: true });
}