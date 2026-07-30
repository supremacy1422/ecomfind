import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserFromRequest, unauthorized } from '@/lib/server-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const body = await req.json();
  const { leadId, status, notes, outreach_text } = body;

  if (!leadId || !status) {
    return NextResponse.json({ error: 'Missing leadId or status' }, { status: 400 });
  }

  const update: any = { status, updated_at: new Date().toISOString() };
  if (notes !== undefined) update.notes = notes;
  if (outreach_text !== undefined) update.outreach_text = outreach_text;

  const { error } = await supabase
    .from('store_leads')
    .update(update)
    .eq('id', leadId)
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}