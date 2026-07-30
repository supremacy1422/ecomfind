import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserFromRequest, unauthorized } from '@/lib/server-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function makeEmailBody(to: string, from: string, subject: string, message: string, signature: string, avatarUrl?: string) {
  const sigHtml = signature.replace(/\n/g, '<br>');
  const avatarHtml = avatarUrl
    ? `<br><img src="${avatarUrl}" width="64" height="64" style="border-radius:50%;margin-top:12px;object-fit:cover;" />`
    : '';

  const htmlContent = `<!DOCTYPE html>
<html>
<body style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1a1a1a;line-height:1.6;">
  <div>${message.replace(/\n/g, '<br>')}</div>
  <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e5e5;color:#555;font-size:13px;">
    ${sigHtml}${avatarHtml}
  </div>
</body>
</html>`;

  const boundary = 'part_' + Math.random().toString(36).substring(2, 15);
  const textBody = message + '\n\n---\n' + signature;

  const emailLines = [
    `MIME-Version: 1.0`,
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${subject}`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    '',
    textBody,
    '',
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    '',
    htmlContent,
    `--${boundary}--`,
  ];

  return Buffer.from(emailLines.join('\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const body = await req.json();
  const { leadIds, subject, message, fromName } = body;

  if (!leadIds?.length || !subject || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data: leads } = await supabase
    .from('store_leads')
    .select('id, store_url, store_name, email, times_contacted')
    .in('id', leadIds)
    .eq('user_id', user.id);

  if (!leads?.length) {
    return NextResponse.json({ error: 'No valid leads found' }, { status: 400 });
  }

  const { data: tokenData } = await supabase
    .from('gmail_tokens')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!tokenData) {
    return NextResponse.json({ error: 'Gmail not connected' }, { status: 403 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('email_signature, avatar_url, full_name')
    .eq('id', user.id)
    .single();

  const signature = profile?.email_signature || `Best,\n${profile?.full_name || fromName || ''}`;
  let accessToken = tokenData.access_token;

  const sendViaGmail = async (token: string, to: string, personalizedMessage: string) => {
    const raw = makeEmailBody(to, tokenData.email, subject, personalizedMessage, signature, profile?.avatar_url);
    return fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });
  };

  let sent = 0;
  let failed = 0;

  for (const lead of leads) {
    if (!lead.email || !lead.email.includes('@')) {
      failed++;
      continue;
    }

    const personalized = message
      .replace(/\[STORE_NAME\]/g, lead.store_name || 'there')
      .replace(/\[STORE_URL\]/g, lead.store_url || '');

    try {
      let res = await sendViaGmail(accessToken, lead.email, personalized);

      if (res.status === 401 && tokenData.refresh_token) {
        const refreshRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            refresh_token: tokenData.refresh_token,
            grant_type: 'refresh_token',
          }),
        });
        const refreshData = await refreshRes.json();
        if (refreshData.access_token) {
          accessToken = refreshData.access_token;
          await supabase.from('gmail_tokens').update({
            access_token: accessToken,
            expires_at: new Date(Date.now() + (refreshData.expires_in || 3600) * 1000).toISOString(),
          }).eq('user_id', user.id);
          res = await sendViaGmail(accessToken, lead.email, personalized);
        }
      }

      if (res.ok) {
        sent++;
        await supabase
          .from('store_leads')
          .update({
            times_contacted: (lead.times_contacted || 0) + 1,
            status: 'contacted',
            updated_at: new Date().toISOString(),
          })
          .eq('id', lead.id);
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  return NextResponse.json({ success: true, sent, failed });
}