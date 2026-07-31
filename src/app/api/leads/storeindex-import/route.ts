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

    // ONLY use columns that exist in your leads table
    const rows = stores.map((s: any) => ({
      domain: s.domain || "",
      email: s.email || null,
      country: s.country || null,
      industry: s.industry || null,
      source: "storeindex",
      status: "new",
      created_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("leads").upsert(rows, { onConflict: "domain" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ imported: rows.length });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Import failed" },
      { status: 500 }
    );
  }
}