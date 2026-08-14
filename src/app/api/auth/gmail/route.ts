import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${origin}/login?redirect=/gmail-connections`);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase.auth.getUser(token);
  if (!data?.user) {
    return NextResponse.redirect(`${origin}/login?redirect=/gmail-connections`);
  }

  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${origin}/api/auth/gmail/callback`
  );

  const state = Buffer.from(JSON.stringify({
    access_token: token,
  })).toString("base64url");

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.readonly",
    ],
    prompt: "consent select_account",
    state,
  });

  return NextResponse.redirect(url);
}