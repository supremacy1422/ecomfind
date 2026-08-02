import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const cookieStore = await cookies();

  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.split(".")[0]?.split("//")[1] || "";
  const authCookie = cookieStore.get(`sb-${projectRef}-auth-token`);

  let accessToken: string | null = null;
  let userId: string | null = null;

  if (authCookie) {
    try {
      const cookieValue = JSON.parse(authCookie.value);
      const token = Array.isArray(cookieValue) ? cookieValue[0] : cookieValue;

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data } = await supabase.auth.getUser(token);
      if (data?.user) {
        accessToken = token;
        userId = data.user.id;
      }
    } catch (e) {
      console.error("Cookie parse error:", e);
    }
  }

  if (!accessToken || !userId) {
    return NextResponse.redirect(`${origin}/login?redirect=/outreach`);
  }

  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${origin}/api/auth/gmail/callback`
  );

  const state = Buffer.from(JSON.stringify({
    access_token: accessToken,
  })).toString("base64url");

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.send"],
    prompt: "consent select_account",
    state,
  });

  return NextResponse.redirect(url);
}