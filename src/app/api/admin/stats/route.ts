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

  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: totalLeads } = await supabase.from('store_leads').select('*', { count: 'exact', head: true });
  const { count: poolSize } = await supabase.from('store_pool').select('*', { count: 'exact', head: true });
  const { data: rotation } = await supabase.from('rotation_state').select('*').single();

  return NextResponse.json({
    totalUsers: totalUsers || 0,
    totalLeads: totalLeads || 0,
    poolSize: poolSize || 0,
    currentBatch: rotation?.current_batch || 'none',
    lastRotated: rotation?.last_rotated,
  });
}