import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.replace('Bearer ', '');
  return supabase.auth.getUser(token).then(({ data }) => data.user);
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { userId } = body;
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  await supabase.auth.admin.deleteUser(userId);
  await supabase.from('profiles').delete().eq('id', userId);
  await supabase.from('store_leads').delete().eq('user_id', userId);
  await supabase.from('gmail_tokens').delete().eq('user_id', userId);

  return NextResponse.json({ success: true });
}