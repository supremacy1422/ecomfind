import { NextRequest, NextResponse } from "next/server";

const STORELEADS_API_KEY = process.env.STORELEADS_API_KEY || "";
const STORELEADS_BASE = "https://api.storeleads.app/v1";

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "NL", name: "Netherlands" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "IE", name: "Ireland" },
  { code: "NZ", name: "New Zealand" },
  { code: "SG", name: "Singapore" },
  { code: "JP", name: "Japan" },
];

const NICHES = [
  "Apparel", "Beauty", "Electronics", "Food & Beverage", "Health & Wellness",
  "Home & Garden", "Jewelry", "Pet Supplies", "Sports & Outdoors", "Toys & Games",
  "Automotive", "Baby & Kids", "Books & Media", "Footwear", "Furniture",
  "Luxury Goods", "Office Supplies", "Software", "Tools & Hardware", "Wine & Spirits"
];

const PLATFORMS = ["Shopify", "WooCommerce", "Magento", "BigCommerce", "Squarespace", "Wix", "PrestaShop", "OpenCart"];

export async function GET(req: NextRequest) {
  if (!STORELEADS_API_KEY) {
    return NextResponse.json({ error: "STORELEADS_API_KEY not configured" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") || "";
  const niche = searchParams.get("niche") || "";
  const platform = searchParams.get("platform") || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

  try {
    const params = new URLSearchParams();
    if (country) params.append("country", country);
    if (niche) params.append("category", niche);
    if (platform) params.append("platform", platform);
    params.append("limit", String(limit));

    const res = await fetch(`${STORELEADS_BASE}/domains?${params.toString()}`, {
      headers: { Authorization: `Bearer ${STORELEADS_API_KEY}` },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `StoreLeads error: ${err}` }, { status: res.status });
    }

    const json = await res.json();
    const stores = (json.data || []).map((s: any) => ({
      name: s.name || s.domain,
      domain: s.domain,
      platform: s.platform || "Unknown",
      country: s.country || "N/A",
      city: s.city || "N/A",
      category: s.category || niche || "General",
      revenue_estimate: s.revenue_estimate || "N/A",
      employee_count: s.employee_count || "N/A",
      language: s.language || "N/A",
      installed_apps: s.installed_apps || [],
      emails: s.emails || [],
      social_links: s.social_links || {},
      traffic_estimate: s.traffic_estimate || "N/A",
    }));

    return NextResponse.json({ stores, filters: { countries: COUNTRIES, niches: NICHES, platforms: PLATFORMS } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Search failed" }, { status: 500 });
  }
}