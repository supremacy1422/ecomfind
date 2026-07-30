import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserFromRequest, unauthorized } from '@/lib/server-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const body = await req.json();
  const { toEmail, subject, message, fromName, storeUrl } = body;

  // Get user's Gmail token
  const { data: tokenData, error: tokenError } = await supabase
    .from('gmail_tokens')
    .select('access_token, email')
    .eq('user_id', user.id)
    .single();

  if (tokenError || !tokenData) {
    return NextResponse.json({ error: 'Gmail not connected' }, { status: 400 });
  }

  // Build raw email
  const emailLines = [
    `From: ${fromName || 'Your Name'} <${tokenData.email}>`,
    `To: ${toEmail}`,
    `Subject: ${subject}`,
    '',
    message
  ];
  const rawEmail = Buffer.from(emailLines.join('\r\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  // Send via Gmail API
  const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: rawEmail })
  });

  if (!sendRes.ok) {
    const err = await sendRes.json().catch(() => ({}));
    return NextResponse.json({ error: 'Failed to send', detail: err }, { status: 500 });
  }

  // Increment contact count
  const { data: lead } = await supabase
    .from('store_leads')
    .select('id, times_contacted')
    .eq('store_url', storeUrl)
    .eq('user_id', user.id)
    .single();

  if (lead) {
    await supabase
      .from('store_leads')
      .update({ times_contacted: (lead.times_contacted || 0) + 1 })
      .eq('id', lead.id)
      .eq('user_id', user.id);
  }

  return NextResponse.json({ success: true });
}