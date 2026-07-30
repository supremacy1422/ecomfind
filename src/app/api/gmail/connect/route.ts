import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getUserFromRequest(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.replace("Bearer ", "");
  return supabase.auth.getUser(token).then(({ data, error }) => (error ? null : data.user));
}

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/gmail/callback`;

  // Use gmail.compose (less restricted) + userinfo.email
  // NOTE: For sending emails you NEED gmail.send, but that requires Google verification.
  // For testing, add your email as a "Test user" in Google Cloud Console > OAuth consent screen.
  const scopes = [
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];
  const scope = encodeURIComponent(scopes.join(" "));

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID!);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scope);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("state", user.id);

  return NextResponse.json({ url: url.toString() });
}