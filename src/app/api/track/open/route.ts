import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Update recipient open stats
    const { data: recipient } = await supabase
      .from("campaign_recipients")
      .select("open_count, campaign_id")
      .eq("id", id)
      .single();

    if (recipient) {
      await supabase
        .from("campaign_recipients")
        .update({
          opened_at: new Date().toISOString(),
          open_count: (recipient.open_count || 0) + 1,
        })
        .eq("id", id);

      // Increment campaign opened_count if first open
      if (!recipient.open_count) {
        await supabase.rpc("increment_campaign_opens", { campaign_uuid: recipient.campaign_id });
      }
    }
  }

  // Return 1x1 transparent GIF
  const pixel = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");
  return new NextResponse(pixel, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}