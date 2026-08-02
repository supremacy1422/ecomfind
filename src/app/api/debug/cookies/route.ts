import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  return NextResponse.json({
    cookieCount: allCookies.length,
    cookieNames: allCookies.map(c => c.name),
    projectRef: process.env.NEXT_PUBLIC_SUPABASE_URL?.split(".")[0]?.split("//")[1] || "unknown",
  });
}