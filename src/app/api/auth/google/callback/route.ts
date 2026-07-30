import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ecomfind.vercel.app';

  if (!code || !state) {
    return NextResponse.redirect(`${appUrl}/settings?error=gmail_auth_failed`);
  }

  let userId: string;
  try {
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString('utf8'));
    userId = stateData.userId;
  } catch {
    return NextResponse.redirect(`${appUrl}/settings?error=invalid_state`);
  }

  const redirectUri = `${appUrl}/api/auth/google/callback`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return NextResponse.redirect(`${appUrl}/settings?error=gmail_auth_failed`);
  }

  const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userInfo = await userInfoRes.json();

  await supabase.from('gmail_tokens').upsert({
    user_id: userId,
    email: userInfo.email,
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token || null,
    expires_at: new Date(Date.now() + (tokenData.expires_in || 3600) * 1000).toISOString(),
  }, { onConflict: 'user_id' });

  return NextResponse.redirect(`${appUrl}/settings?gmail=connected`);
}