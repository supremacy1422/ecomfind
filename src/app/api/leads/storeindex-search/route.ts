import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.STOREINDEX_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "STOREINDEX_API_KEY not configured" }, { status: 500 });
    }

    const { country, industry, minProducts, maxProducts, limit = 20 } = await req.json();

    // Build filters the way StoreIndex expects them
    const filters: Record<string, any> = {};
    if (country) filters.country = country;
    if (industry) filters.industry = industry;
    if (minProducts) filters.minProducts = minProducts;
    if (maxProducts) filters.maxProducts = maxProducts;

    // Try multiple request formats that StoreIndex might accept
    const attempts = [
      // Format 1: Simple flat body
      {
        url: "https://api.storeindex.io/v1/search",
        body: { ...filters, limit },
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      },
      // Format 2: With query wrapper
      {
        url: "https://api.storeindex.io/v1/search",
        body: { query: filters, limit },
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      },
      // Format 3: With filter wrapper
      {
        url: "https://api.storeindex.io/v1/search",
        body: { filter: filters, limit },
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      },
      // Format 4: x-api-key header instead of Bearer
      {
        url: "https://api.storeindex.io/v1/search",
        body: { ...filters, limit },
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      },
      // Format 5: POST to /stores endpoint
      {
        url: "https://api.storeindex.io/v1/stores",
        body: { ...filters, limit },
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      },
      // Format 6: GET with query params
      {
        url: `https://api.storeindex.io/v1/stores?country=${country || ""}&industry=${industry || ""}&limit=${limit}`,
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      },
    ];

    let lastError = "";

    for (const attempt of attempts) {
      try {
        const res = await fetch(attempt.url, {
          method: attempt.method || "POST",
          headers: attempt.headers,
          body: attempt.method === "GET" ? undefined : JSON.stringify(attempt.body),
        });

        const text = await res.text();
        console.log(`StoreIndex ${attempt.url} (${attempt.method || "POST"}): ${res.status} - ${text.substring(0, 300)}`);

        if (res.ok) {
          const json = JSON.parse(text);
          // Handle various response shapes
          const stores = json.data || json.stores || json.results || json;
          const storeArray = Array.isArray(stores) ? stores : [];
          return NextResponse.json({ stores: storeArray, total: json.total || storeArray.length });
        }

        lastError = `${attempt.url}: ${res.status} - ${text.substring(0, 200)}`;
      } catch (e: any) {
        lastError = `${attempt.url}: ${e.message}`;
      }
    }

    return NextResponse.json(
      { error: `StoreIndex API error. Debug info: ${lastError}` },
      { status: 502 }
    );

  } catch (err: any) {
    return NextResponse.json({ error: `Server error: ${err.message}` }, { status: 500 });
  }
}