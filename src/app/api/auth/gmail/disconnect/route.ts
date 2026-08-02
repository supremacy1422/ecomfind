import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  
  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.split(".")[0]?.split("//")[1] || "";
  const authCookie = cookieStore.get(`sb-${projectRef}-auth-token`);
  
  let accessToken: string | null = null;
  
  if (authCookie) {
    try {
      const cookieValue = JSON.parse(authCookie.value);
      accessToken = Array.isArray(cookieValue) ? cookieValue[0] : cookieValue;
    } catch {
      return NextResponse.json({ error: "Invalid auth cookie" }, { status: 401 });
    }
  }
  
  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
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
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  await supabase.from("gmail_connections").delete().eq("user_id", user.id);
  return NextResponse.json({ success: true });
}