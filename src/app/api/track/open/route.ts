import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Transparent 1x1 GIF
const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const trackingId = searchParams.get('id');
  
  if (trackingId) {
    const { data: record } = await supabase
      .from('email_tracking')
      .select('open_count')
      .eq('id', trackingId)
      .single();
      
    if (record) {
      await supabase.from('email_tracking').update({
        opened_at: new Date().toISOString(),
        open_count: (record.open_count || 0) + 1
      }).eq('id', trackingId);
    }
  }
  
  return new NextResponse(PIXEL, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}