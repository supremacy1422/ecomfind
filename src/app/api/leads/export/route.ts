import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserFromRequest, unauthorized } from '@/lib/server-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const niche = searchParams.get('niche');
  const q = searchParams.get('q');

  let query = supabase
    .from('store_leads')
    .select('*')
    .eq('user_id', user.id)
    .order('quality_score', { ascending: false });

  if (niche && niche !== 'all') query = query.eq('niche', niche);
  if (q) query = query.or(`store_name.ilike.%${q}%,store_url.ilike.%${q}%,email.ilike.%${q}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const headers = ['Store Name','Store URL','Email','Niche','Quality Score','Status','Times Contacted','Discovered At'];
  const rows = (data || []).map((l: any) => [
    l.store_name, l.store_url, l.email, l.niche,
    l.quality_score, l.status, l.times_contacted, l.discovered_at
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((r: any[]) => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="leads.csv"'
    }
  });
}