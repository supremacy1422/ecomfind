import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;

  try {
    const code = req.nextUrl.searchParams.get("code");
    const state = req.nextUrl.searchParams.get("state");
    const googleError = req.nextUrl.searchParams.get("error");

    if (googleError) {
      return NextResponse.redirect(`${origin}/gmail-connections?error=google_denied`);
    }
    if (!code || !state) {
      return NextResponse.redirect(`${origin}/gmail-connections?error=missing_params`);
    }

    let parsedState: { access_token: string };
    try {
      parsedState = JSON.parse(Buffer.from(state, "base64url").toString());
    } catch {
      return NextResponse.redirect(`${origin}/gmail-connections?error=bad_state`);
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: userData, error: userErr } = await supabase.auth.getUser(parsedState.access_token);
    if (userErr || !userData?.user) {
      return NextResponse.redirect(`${origin}/gmail-connections?error=invalid_session`);
    }

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.redirect(`${origin}/gmail-connections?error=missing_env`);
    }

    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${origin}/api/auth/gmail/callback`
    );

    let tokens;
    try {
      const tokenRes = await oauth2Client.getToken(code);
      tokens = tokenRes.tokens;
    } catch (tokenErr: any) {
      console.error("Token exchange failed:", tokenErr.message);
      return NextResponse.redirect(`${origin}/gmail-connections?error=token_exchange`);
    }

    if (!tokens.refresh_token) {
      return NextResponse.redirect(`${origin}/gmail-connections?error=no_refresh_token`);
    }

    // Get email from ID token
    let email = "unknown";
    let displayName = "Unknown";
    try {
      if (tokens.id_token) {
        const ticket = await oauth2Client.verifyIdToken({
          idToken: tokens.id_token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        email = payload?.email || "unknown";
        displayName = payload?.name || email.split("@")[0];
      }
    } catch (idErr: any) {
      console.error("ID token verify failed:", idErr.message);
      // Non-fatal — continue with "unknown"
    }

    // Save to Supabase
    try {
      const { error: dbErr } = await supabase.from("gmail_accounts").upsert({
        user_id: userData.user.id,
        email,
        refresh_token: tokens.refresh_token,
        access_token: tokens.access_token || null,
        expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
        display_name: displayName,
        is_active: true,
        is_default: false,
      }, { onConflict: "user_id,email" });

      if (dbErr) {
        console.error("DB upsert failed:", dbErr.message);
        return NextResponse.redirect(`${origin}/gmail-connections?error=db_error&message=${encodeURIComponent(dbErr.message)}`);
      }
    } catch (dbCatch: any) {
      console.error("DB exception:", dbCatch.message);
      return NextResponse.redirect(`${origin}/gmail-connections?error=db_exception&message=${encodeURIComponent(dbCatch.message)}`);
    }

    return NextResponse.redirect(`${origin}/gmail-connections?success=connected`);
  } catch (err: any) {
    console.error("Unhandled callback error:", err.message);
    return NextResponse.redirect(`${origin}/gmail-connections?error=unknown&message=${encodeURIComponent(err.message)}`);
  }
}