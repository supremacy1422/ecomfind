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

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, company_name, created_at, is_admin')
    .order('created_at', { ascending: false });

  return NextResponse.json({ users: profiles || [] });
}