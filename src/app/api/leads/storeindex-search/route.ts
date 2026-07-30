import { NextRequest, NextResponse } from "next/server";

const STOREINDEX_API_URL = "https://api.storeindex.io/v1/search";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.STOREINDEX_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "STOREINDEX_API_KEY not configured. Add it to your Vercel environment variables." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { country, industry, productRange, limit = 20, page = 1 } = body;

    // Build StoreIndex query
    const query: any = {
      limit: Math.min(parseInt(limit) || 20, 50),
      page: parseInt(page) || 1,
    };

    if (country && country !== "all") {
      query.country = country;
    }
    if (industry && industry !== "all") {
      query.industry = industry;
    }
    if (productRange && productRange !== "all") {
      query.product_range = productRange;
    }

    const response = await fetch(STOREINDEX_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey, // Raw key, no Bearer prefix
      },
      body: JSON.stringify(query),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("StoreIndex API error:", response.status, errorText);
      return NextResponse.json(
        { error: `StoreIndex API returned ${response.status}. ${errorText || "Check your API key and plan status."}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("StoreIndex search error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}