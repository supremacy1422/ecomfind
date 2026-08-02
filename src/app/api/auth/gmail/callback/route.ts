import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { createClient } from "@supabase/supabase-js";

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/gmail/callback`
);

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const stateB64 = req.nextUrl.searchParams.get("state");

  if (!code || !stateB64) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/outreach?error=oauth_failed`);
  }

  let accessToken: string;
  try {
    const state = JSON.parse(Buffer.from(stateB64, "base64url").toString());
    accessToken = state.access_token;
  } catch {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/outreach?error=invalid_state`);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/outreach?error=not_logged_in`);
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens.refresh_token || !tokens.access_token) {
      throw new Error("No refresh token received");
    }

    const gmail = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    gmail.setCredentials({ access_token: tokens.access_token });
    const userInfoRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${tokens.access_token}` } }
    );
    const userInfo = await userInfoRes.json();

    await supabase.from("gmail_connections").upsert({
      user_id: user.id,
      email: userInfo.email,
      refresh_token: tokens.refresh_token,
    }, { onConflict: "user_id" });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/outreach?gmail=connected`);
  } catch (err: any) {
    console.error("Gmail OAuth error:", err);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/outreach?error=gmail_connect_failed`);
  }
}