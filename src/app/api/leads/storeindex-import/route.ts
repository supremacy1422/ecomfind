import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { stores } = await req.json();
    if (!Array.isArray(stores) || stores.length === 0) {
      return NextResponse.json({ error: "No stores provided" }, { status: 400 });
    }

    const rows = stores.map((s: any) => ({
      store_url: s.domain ? `https://${s.domain}` : "",
      store_name: s.domain || s.shopifyDomain || "Unknown",
      email: s.email || null,
      score: s.quality_score || s.score || 70,
      status: "new",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("leads").upsert(rows, { onConflict: "store_url" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ imported: rows.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Import failed" }, { status: 500 });
  }
}