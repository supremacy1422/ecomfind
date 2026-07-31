import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.STOREINDEX_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "STOREINDEX_API_KEY not configured" }, { status: 500 });
    }

    const { country, industry, minProducts, maxProducts, limit = 20 } = await req.json();

    // Build filters
    const filters: Record<string, any> = {};
    if (country) filters.country = country;
    if (industry) filters.industry = industry;
    if (minProducts) filters.minProducts = minProducts;
    if (maxProducts) filters.maxProducts = maxProducts;

    // Try multiple request formats
    const attempts: { url: string; method: string; headers: Record<string, string>; body?: string }[] = [
      {
        url: "https://api.storeindex.io/v1/search",
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({ ...filters, limit }),
      },
      {
        url: "https://api.storeindex.io/v1/search",
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({ query: filters, limit }),
      },
      {
        url: "https://api.storeindex.io/v1/search",
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({ filter: filters, limit }),
      },
      {
        url: "https://api.storeindex.io/v1/search",
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body: JSON.stringify({ ...filters, limit }),
      },
      {
        url: "https://api.storeindex.io/v1/stores",
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({ ...filters, limit }),
      },
      {
        url: `https://api.storeindex.io/v1/stores?country=${encodeURIComponent(country || "")}&industry=${encodeURIComponent(industry || "")}&limit=${limit}`,
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      },
    ];

    let lastError = "";

    for (const attempt of attempts) {
      try {
        const res = await fetch(attempt.url, {
          method: attempt.method,
          headers: attempt.headers,
          body: attempt.body,
        });

        const text = await res.text();
        console.log(`StoreIndex ${attempt.method} ${attempt.url}: ${res.status} - ${text.substring(0, 300)}`);

        if (res.ok) {
          const json = JSON.parse(text);
          const stores = json.data || json.stores || json.results || [];
          const storeArray = Array.isArray(stores) ? stores : [];
          return NextResponse.json({ stores: storeArray, total: json.total || storeArray.length });
        }

        lastError = `${attempt.method} ${attempt.url}: ${res.status} - ${text.substring(0, 200)}`;
      } catch (e: any) {
        lastError = `${attempt.method} ${attempt.url}: ${e.message}`;
      }
    }

    return NextResponse.json(
      { error: `StoreIndex API error. Debug: ${lastError}` },
      { status: 502 }
    );

  } catch (err: any) {
    return NextResponse.json({ error: `Server error: ${err.message}` }, { status: 500 });
  }
}