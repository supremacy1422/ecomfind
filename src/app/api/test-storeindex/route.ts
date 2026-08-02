import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.STOREINDEX_API_KEY;
  if (!key) return NextResponse.json({ error: "KEY MISSING" }, { status: 500 });
  return NextResponse.json({ keyPrefix: key.substring(0, 8) + "..." });
}