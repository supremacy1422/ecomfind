import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { createClient } from "@supabase/supabase-js";

function decodeJwtPayload(token: string): any {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const stateB64 = req.nextUrl.searchParams.get("state");
  const origin = req.nextUrl.origin;

  if (!code || !stateB64) {
    return NextResponse.redirect(`${origin}/outreach?error=oauth_failed`);
  }

  let accessToken: string;
  try {
    const state = JSON.parse(Buffer.from(stateB64, "base64url").toString());
    accessToken = state.access_token;
  } catch {
    return NextResponse.redirect(`${origin}/outreach?error=invalid_state`);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    }
  );

  const { data, error: userError } = await supabase.auth.getUser();
  if (!data?.user || userError) {
    console.error("Auth error:", userError);
    return NextResponse.redirect(`${origin}/outreach?error=not_logged_in`);
  }

  const user = data.user;

  try {
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${origin}/api/auth/gmail/callback`
    );

    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens.refresh_token || !tokens.access_token) {
      throw new Error("No refresh token received");
    }

    // Get email from userinfo API
    const userInfoRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${tokens.access_token}` } }
    );
    const userInfo = await userInfoRes.json();

    // Fallback: extract email from ID token JWT payload
    let email = userInfo?.email || null;
    if (!email && tokens.id_token) {
      const payload = decodeJwtPayload(tokens.id_token);
      email = payload?.email || null;
    }

    if (!email) {
      console.error("No email from Google. userInfo:", userInfo, "id_token exists:", !!tokens.id_token);
      return NextResponse.redirect(`${origin}/outreach?error=no_email&message=Google+did+not+return+email`);
    }

    const { error: upsertError } = await supabase.from("gmail_connections").upsert({
      user_id: user.id,
      email,
      refresh_token: tokens.refresh_token,
    }, { onConflict: "user_id" });

    if (upsertError) {
      console.error("Upsert error:", upsertError);
      return NextResponse.redirect(`${origin}/outreach?error=db_error&message=${encodeURIComponent(upsertError.message)}`);
    }

    return NextResponse.redirect(`${origin}/outreach?gmail=connected`);
  } catch (err: any) {
    console.error("Gmail OAuth error:", err);
    return NextResponse.redirect(`${origin}/outreach?error=gmail_connect_failed&message=${encodeURIComponent(err.message)}`);
  }
}