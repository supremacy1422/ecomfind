import { NextRequest, NextResponse } from "next/server";
import { searchStores } from "@/lib/shopify-stores";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { country, industry, minProducts, maxProducts, createdYear, createdMonth, createdDay, limit = 20, page = 1 } = body;

    // Try StoreIndex API first
    const apiKey = process.env.STOREINDEX_API_KEY;
    let storeIndexResults: any[] = [];
    let usedFallback = true;

    if (apiKey) {
      try {
        const res = await fetch("https://api.storeindex.com/v1/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            filters: {
              country: country || undefined,
              industry: industry || undefined,
              activeProductsRange: minProducts || maxProducts ? {
                gte: minProducts || 0,
                lte: maxProducts || 99999,
              } : undefined,
            },
            limit: Math.min(limit, 50),
            page,
          }),
          signal: AbortSignal.timeout(5000),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            storeIndexResults = json.data;
            usedFallback = false;
          }
        }
      } catch {
        // StoreIndex failed
      }
    }

    // Fallback to curated database
    if (usedFallback) {
      const fallback = searchStores(country, industry, minProducts, maxProducts, createdYear, createdMonth, createdDay, limit);
      storeIndexResults = fallback.map((s) => ({
        domain: s.domain,
        shopifyDomain: `${s.domain.split(".")[0]}.myshopify.com`,
        email: s.email,
        country: s.countryCode,
        industry: s.industry,
        products: s.products,
        score: s.score,
        createdAt: s.createdAt,
      }));
    }

    if (storeIndexResults.length === 0) {
      return NextResponse.json({
        stores: [],
        total: 0,
        page,
        limit,
        source: usedFallback ? "fallback" : "storeindex",
        message: "No stores found for these filters. Try broader criteria.",
      });
    }

    return NextResponse.json({
      stores: storeIndexResults,
      total: storeIndexResults.length,
      page,
      limit,
      source: usedFallback ? "fallback" : "storeindex",
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        stores: [],
        total: 0,
        page: 1,
        limit: 20,
        source: "error",
        message: `Search error: ${err.message || "Unknown error"}`,
      },
      { status: 200 }
    );
  }
}