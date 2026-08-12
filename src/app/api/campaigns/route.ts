import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const token = req.headers.get("x-supabase-token");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ campaigns: campaigns || [] });
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-supabase-token");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, subject, body, from_name, recipients, follow_up_subject, follow_up_body, follow_up_days } = await req.json();

  if (!name || !subject || !body || !recipients?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (recipients.length > 20000) {
    return NextResponse.json({ error: "Max 20,000 recipients per campaign" }, { status: 400 });
  }

  // Create campaign
  const { data: campaign, error: campError } = await supabase
    .from("campaigns")
    .insert({
      user_id: user.id,
      name,
      subject,
      body,
      from_name: from_name || "EcomFind",
      total_recipients: recipients.length,
      follow_up_subject,
      follow_up_body,
      follow_up_days: follow_up_days || 3,
    })
    .select()
    .single();

  if (campError || !campaign) {
    return NextResponse.json({ error: campError?.message || "Failed to create campaign" }, { status: 500 });
  }

  // Insert recipients in batches of 1000
  const batchSize = 1000;
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize).map((r: any) => ({
      campaign_id: campaign.id,
      email: r.email,
      first_name: r.firstName || "",
      last_name: r.lastName || "",
    }));
    await supabase.from("campaign_recipients").insert(batch);
  }

  return NextResponse.json({ campaign });
}