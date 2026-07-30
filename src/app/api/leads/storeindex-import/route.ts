import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { stores } = body;

    if (!Array.isArray(stores) || stores.length === 0) {
      return NextResponse.json(
        { error: "No stores provided for import" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Map StoreIndex data to your leads schema
    const leads = stores.map((store: any) => ({
      store_name: store.name || store.store_name || store.domain || "Unknown Store",
      url: store.url || store.website || store.domain ? `https://${store.domain}` : "",
      niche: store.industry || store.niche || store.category || "General",
      country: store.country || store.location || "Unknown",
      email: store.email || store.contact_email || null,
      quality_score: calculateQualityScore(store),
      status: "new",
      notes: store.tech_stack ? `Tech: ${Array.isArray(store.tech_stack) ? store.tech_stack.join(", ") : store.tech_stack}` : null,
    })).filter((l: any) => l.url); // Must have URL

    if (leads.length === 0) {
      return NextResponse.json(
        { error: "No valid leads could be mapped from StoreIndex data" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.from("leads").insert(leads).select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imported: data?.length || leads.length,
      leads: data,
    });
  } catch (err: any) {
    console.error("StoreIndex import error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

function calculateQualityScore(store: any): number {
  let score = 3;
  if (store.revenue && store.revenue > 100000) score = 5;
  else if (store.revenue && store.revenue > 50000) score = 4;
  else if (store.employees && store.employees > 10) score = 4;
  else if (store.tech_stack && Array.isArray(store.tech_stack) && store.tech_stack.length > 5) score = 4;
  if (!store.email && !store.contact_email) score = Math.max(1, score - 1);
  return Math.min(5, Math.max(1, score));
}