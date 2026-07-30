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

  const { data } = await supabase
    .from("user_gmail_tokens")
    .select("email, expires_at")
    .eq("user_id", user.id)
    .single();

  if (!data) {
    return NextResponse.json({ connected: false, email: null });
  }

  const expired = data.expires_at && data.expires_at < Math.floor(Date.now() / 1000);
  return NextResponse.json({ connected: !expired, email: data.email });
}