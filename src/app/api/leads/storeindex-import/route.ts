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

    // Map StoreIndex fields to your leads table schema
    const rows = stores.map((s: any) => ({
      domain: s.domain || s.shopifyDomain || "",
      email: s.email || null,
      phone: s.phone || null,
      country: s.country || null,
      industry: s.industry || null,
      company_size: s.companySize || null,
      revenue_range: s.revenueRange || null,
      active_products: s.activeProductsRange || null,
      installed_apps: s.installedAppsName || [],
      shopify_id: s.shopifyId || null,
      social_links: s.socialLinks || {},
      source: "storeindex",
      created_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase.from("leads").upsert(rows, { onConflict: "domain" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ imported: rows.length, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Import failed" }, { status: 500 });
  }
}