import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.STOREINDEX_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "STOREINDEX_API_KEY not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    console.log("StoreIndex request body:", JSON.stringify(body));

    // Try the most common StoreIndex endpoint patterns
    const endpoints = [
      "https://api.storeindex.io/v1/search",
      "https://api.storeindex.io/search",
      "https://api.storeindex.io/v1/stores/search",
    ];

    let lastError = "";
    
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "x-api-key": apiKey,
          },
          body: JSON.stringify(body),
        });

        console.log(`StoreIndex ${endpoint} status:`, res.status);

        if (res.ok) {
          const json = await res.json();
          console.log("StoreIndex response:", JSON.stringify(json).substring(0, 500));
          
          // Handle different response structures
          const stores = json.data || json.stores || json.results || [];
          return NextResponse.json({ stores, total: json.total || stores.length });
        }
        
        lastError = await res.text();
        console.log(`StoreIndex ${endpoint} error:`, lastError.substring(0, 200));
      } catch (e: any) {
        lastError = e.message;
        console.log(`StoreIndex ${endpoint} exception:`, e.message);
      }
    }

    // If all endpoints failed, return the last error
    return NextResponse.json(
      { error: `All StoreIndex endpoints failed. Last error: ${lastError.substring(0, 200)}` },
      { status: 502 }
    );

  } catch (err: any) {
    console.error("StoreIndex route error:", err);
    return NextResponse.json(
      { error: `Server error: ${err.message}` },
      { status: 500 }
    );
  }
}