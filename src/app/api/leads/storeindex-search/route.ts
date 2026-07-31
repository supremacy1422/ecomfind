import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.STOREINDEX_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "STOREINDEX_API_KEY not configured" }, { status: 500 });
    }

    const body = await req.json();
    const { country, industry, minProducts, maxProducts, limit = 20, page = 1 } = body;

    const filter: Record<string, any> = {};
    if (country) filter.country = country;
    if (industry) filter.industry = industry;
    if (minProducts || maxProducts) {
      filter.activeProductsRange = {};
      if (minProducts) filter.activeProductsRange.gte = minProducts;
      if (maxProducts) filter.activeProductsRange.lte = maxProducts;
    }

    const res = await fetch("https://api.storeindex.io/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        filter,
        limit: Math.min(limit, 50),
        page,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `StoreIndex error (${res.status}): ${text.substring(0, 200)}`, stores: [] },
        { status: 200 }
      );
    }

    const json = await res.json();
    return NextResponse.json({
      stores: json.data || [],
      total: json.total || 0,
      page: json.page || page,
      limit: json.limit || limit,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `StoreIndex error: ${err.message || "Unknown error"}`, stores: [] },
      { status: 200 }
    );
  }
}