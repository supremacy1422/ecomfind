import { NextRequest, NextResponse } from "next/server";
import { searchStores } from "@/lib/shopify-stores";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      country,
      industry,
      minProducts,
      maxProducts,
      createdYear,
      createdMonth,
      createdDay,
      limit = 20,
      page = 1,
    } = body;

    const safeLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 50);
    const safePage = Math.max(parseInt(page) || 1, 1);

    const apiKey = process.env.STOREINDEX_API_KEY;
    let results: any[] = [];
    let usedFallback = true;

    /* Try StoreIndex API first */
    if (apiKey) {
      try {
        const filters: any = {};
        if (country) filters.country = country;
        if (industry) filters.industry = industry;
        if (minProducts !== undefined || maxProducts !== undefined) {
          filters.activeProductsRange = {
            gte: minProducts ?? 0,
            lte: maxProducts ?? 99999,
          };
        }
        if (createdYear) filters.createdYear = parseInt(createdYear);
        if (createdMonth) filters.createdMonth = parseInt(createdMonth);
        if (createdDay) filters.createdDay = parseInt(createdDay);

        const res = await fetch("https://api.storeindex.com/v1/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            filters,
            limit: safeLimit,
            page: safePage,
          }),
          signal: AbortSignal.timeout(5000),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            results = json.data.map((s: any) => ({
              domain: s.domain || s.shopifyDomain?.replace(".myshopify.com", "") || "unknown.com",
              shopifyDomain:
                s.shopifyDomain ||
                `${(s.domain || "unknown").split(".")[0]}.myshopify.com`,
              email: s.email || null,
              country: s.country || s.countryCode || country || null,
              industry: s.industry || null,
              products: s.products || s.activeProducts || null,
              score: s.score || null,
              createdAt: s.createdAt || s.created_at || s.foundedDate || null,
            }));
            usedFallback = false;
          }
        }
      } catch {
        /* StoreIndex failed — will use fallback */
      }
    }

    /* Fallback to curated database */
    if (usedFallback) {
      let fromDate: string | undefined;
      let toDate: string | undefined;

      if (createdYear) {
        const year = parseInt(createdYear);
        const month = createdMonth ? parseInt(createdMonth) : 1;
        const day = createdDay ? parseInt(createdDay) : 1;
        fromDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00Z`;

        const endMonth = createdMonth ? parseInt(createdMonth) : 12;
        const endDay = createdDay ? parseInt(createdDay) : 28;
        const daysInMonth = new Date(year, endMonth, 0).getDate();
        toDate = `${year}-${String(endMonth).padStart(2, "0")}-${String(Math.min(endDay, daysInMonth)).padStart(2, "0")}T23:59:59Z`;
      }

      const fallback = searchStores(
        "",
        country || undefined,
        industry || undefined,
        minProducts,
        maxProducts,
        fromDate,
        toDate,
        safeLimit
      );

      results = fallback.map((s) => ({
        domain: s.domain,
        shopifyDomain:
          s.shopifyDomain || `${s.domain.split(".")[0]}.myshopify.com`,
        email: s.email,
        country: s.countryCode || s.country,
        industry: s.industry,
        products: s.products,
        score: s.score,
        createdAt: s.createdAt,
      }));
    }

    if (results.length === 0) {
      return NextResponse.json({
        stores: [],
        total: 0,
        page: safePage,
        limit: safeLimit,
        source: usedFallback ? "fallback" : "storeindex",
        message:
          "No stores found for these filters. Try broader criteria (e.g. Any Country, All Industries).",
      });
    }

    return NextResponse.json({
      stores: results,
      total: results.length,
      page: safePage,
      limit: safeLimit,
      source: usedFallback ? "fallback" : "storeindex",
    });
  } catch (err: any) {
    console.error("StoreIndex search error:", err);
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