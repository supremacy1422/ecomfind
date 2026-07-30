import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserFromRequest, unauthorized } from '@/lib/server-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const body = await req.json();
  const { count = 200, niche = 'general' } = body;

  let found = 0;
  const nouns = ['shop','store','boutique','market','co','studio','hub'];

  for (let i = 0; i < Math.min(count, 50); i++) {
    const name = `${nouns[Math.floor(Math.random() * nouns.length)]}-${Math.floor(Math.random() * 10000)}`;
    const url = `https://${name}.myshopify.com`;

    const { data: existing } = await supabase
      .from('store_leads')
      .select('id')
      .eq('store_url', url)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      const { error } = await supabase.from('store_leads').insert({
        user_id: user.id,
        store_url: url,
        store_name: name.replace(/-/g, ' '),
        niche,
        status: 'new',
        times_contacted: 0,
        quality_score: Math.floor(Math.random() * 30) + 50
      });
      if (error) {
        console.error('Insert error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      found++;
    }
  }

  return NextResponse.json({ success: true, found });
}