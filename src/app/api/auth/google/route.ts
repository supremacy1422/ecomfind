import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, unauthorized } from '@/lib/server-auth';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'https://ecomfind.vercel.app'}/api/auth/google/callback`;
  const state = Buffer.from(JSON.stringify({ userId: user.id })).toString('base64');

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email',
    access_type: 'offline',
    prompt: 'consent',
    state,
  });

  return NextResponse.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
}