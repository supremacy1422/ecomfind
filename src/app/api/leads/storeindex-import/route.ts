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

    let imported = 0;
    for (const s of stores) {
      const storeUrl = s.domain ? `https://${s.domain}` : "";
      const storeName = s.domain || s.shopifyDomain || "Unknown";
      const email = s.email || null;
      const score = s.quality_score || s.score || 70;

      const { data: existing } = await supabase
        .from("leads")
        .select("id")
        .eq("store_url", storeUrl)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("leads")
          .update({
            store_name: storeName,
            email,
            score,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
        imported++;
      } else {
        const { error } = await supabase.from("leads").insert({
          store_url: storeUrl,
          store_name: storeName,
          email,
          score,
          status: "new",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        if (!error) imported++;
      }
    }

    return NextResponse.json({ imported });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Import failed" }, { status: 500 });
  }
}