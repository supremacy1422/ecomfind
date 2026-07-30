import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserFromRequest, unauthorized } from '@/lib/server-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const body = await req.json();
  const { niche, limit = 15 } = body;

  const { data: available } = await supabase
    .from('store_pool')
    .select('*')
    .eq('niche', niche.toLowerCase())
    .not('id', 'in', (
      supabase.from('store_leads').select('pool_id').eq('user_id', user.id).not('pool_id', 'is', null)
    ))
    .limit(limit * 2);

  if (!available || available.length === 0) {
    return NextResponse.json({ 
      success: true, 
      valid_leads: 0,
      message: 'No new stores available for this niche right now. Check back after the next rotation or try another niche.'
    });
  }

  let assigned = 0;
  for (const store of available.slice(0, limit)) {
    const { data: existing } = await supabase
      .from('store_leads')
      .select('id')
      .eq('store_url', store.store_url)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      const { error } = await supabase.from('store_leads').insert({
        user_id: user.id,
        pool_id: store.id,
        store_url: store.store_url,
        store_name: store.store_name,
        email: store.email,
        email_valid: store.email_valid,
        niche: store.niche,
        quality_score: store.quality_score || 50,
        status: 'new',
        times_contacted: 0,
        discovered_at: new Date().toISOString(),
      });
      if (!error) assigned++;
    }
  }

  return NextResponse.json({ success: true, valid_leads: assigned });
}