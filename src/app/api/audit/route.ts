import { NextRequest, NextResponse } from "next/server";

interface StoreIndexStore {
  shopifyId: string;
  domain: string;
  title?: string;
  installedAppsName?: string[];
  companySize?: string;
  activeProductsRange?: string;
  revenueRange?: string;
  country?: string;
  industry?: string;
  email?: string;
  phone?: string;
  socialLinks?: Record<string, string>;
}

async function fetchStoreIndexData(domain: string): Promise<StoreIndexStore | null> {
  try {
    const apiKey = process.env.STOREINDEX_API_KEY;
    if (!apiKey) return null;

    // Clean domain
    const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");

    const res = await fetch("https://api.storeindex.io/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        filter: {
          domain: cleanDomain,
        },
        limit: 1,
      }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.[0] || null;
  } catch {
    return null;
  }
}

function generateIssues(storeData: StoreIndexStore | null, html: string, url: string): any[] {
  const issues: any[] = [];
  const apps = storeData?.installedAppsName || [];
  const lowerApps = apps.map((a) => a.toLowerCase());
  const lowerHtml = html.toLowerCase();

  // ── Email Marketing ──
  if (!lowerApps.some((a) => a.includes("klaviyo"))) {
    issues.push({
      title: "No Klaviyo Email Marketing Detected",
      description: "Klaviyo is the industry standard for Shopify email marketing. Stores without it typically recover 15-25% less abandoned cart revenue.",
      severity: "high",
      category: "Email Marketing",
      service: "Klaviyo Setup & Flows",
    });
  }
  if (!lowerApps.some((a) => a.includes("privy") || a.includes("justuno") || a.includes("optimonk"))) {
    issues.push({
      title: "No Pop-up / Lead Capture Tool",
      description: "No exit-intent or lead capture pop-up detected. The average store captures only 1.7% of visitors without a pop-up vs. 5-8% with one.",
      severity: "high",
      category: "Email Marketing",
      service: "Lead Capture System",
    });
  }

  // ── Retention / Subscriptions ──
  if (!lowerApps.some((a) => a.includes("recharge") || a.includes("bold") || a.includes("seal"))) {
    issues.push({
      title: "No Subscription / Recharge Model",
      description: "Subscription programs increase LTV by 2-3x. If your products are consumable or repeatable, you're missing predictable recurring revenue.",
      severity: "medium",
      category: "Retention",
      service: "Subscription Program Setup",
    });
  }
  if (!lowerApps.some((a) => a.includes("loyalty") || a.includes("smile") || a.includes("yotpo"))) {
    issues.push({
      title: "No Loyalty / Rewards Program",
      description: "Loyalty programs increase repeat purchase rate by 20-40%. No rewards system detected on this store.",
      severity: "medium",
      category: "Retention",
      service: "Loyalty Program",
    });
  }

  // ── Reviews & Social Proof ──
  if (!lowerApps.some((a) => a.includes("yotpo") || a.includes("loox") || a.includes("judge") || a.includes("stamped"))) {
    issues.push({
      title: "No Review / UGC App Detected",
      description: "Products with reviews convert 270% better. No dedicated review app was found in the tech stack.",
      severity: "high",
      category: "Social Proof",
      service: "Review & UGC System",
    });
  }

  // ── SEO & AI Visibility ──
  if (!lowerHtml.includes('application/ld+json') && !lowerHtml.includes('"@type":')) {
    issues.push({
      title: "Missing Structured Data / Schema Markup",
      description: "No JSON-LD schema detected. This hurts Google rich snippets and AI shopping assistant visibility (ChatGPT, Gemini, Perplexity).",
      severity: "critical",
      category: "SEO & AI Visibility",
      service: "Schema & AI Optimization",
    });
  }
  if (!lowerHtml.includes('rel="canonical"')) {
    issues.push({
      title: "Missing Canonical Tags",
      description: "Canonical tags prevent duplicate content penalties. Not detected in the page source.",
      severity: "high",
      category: "SEO & AI Visibility",
      service: "Technical SEO Fix",
    });
  }

  // ── Performance ──
  if (lowerHtml.includes("shopify") && html.length > 800_000) {
    issues.push({
      title: "Heavy Page Payload",
      description: `Page HTML is ~${Math.round(html.length / 1024)}KB. Large payloads slow mobile load times and increase bounce rates by 32% per extra second.`,
      severity: "high",
      category: "Performance",
      service: "Speed Optimization",
    });
  }

  // ── Conversion ──
  if (!lowerHtml.includes('type="search"') && !lowerHtml.includes('role="search"')) {
    issues.push({
      title: "Search Bar Not Prominently Detected",
      description: "On-site search users convert 2.4x higher. The search functionality was not clearly detected in the DOM.",
      severity: "medium",
      category: "Conversion",
      service: "Search & Discovery",
    });
  }
  if (!lowerApps.some((a) => a.includes("upsell") || a.includes("reconvert") || a.includes("one-click"))) {
    issues.push({
      title: "No Post-Purchase Upsell Detected",
      description: "Post-purchase upsells add 10-15% to AOV with zero friction. No upsell app found in the tech stack.",
      severity: "medium",
      category: "Conversion",
      service: "Upsell Funnel",
    });
  }

  // ── StoreIndex-specific enrichment ──
  if (storeData) {
    if (!storeData.email) {
      issues.push({
        title: "No Public Email Found",
        description: "StoreIndex shows no verified email for this domain. Outreach and partnership opportunities are harder.",
        severity: "low",
        category: "Contact",
        service: "Email Discovery",
      });
    }
    if (storeData.activeProductsRange === "0-10" || storeData.activeProductsRange === "10-50") {
      issues.push({
        title: "Small Product Catalog",
        description: `Only ${storeData.activeProductsRange} active products detected. Expanding SKU count or bundling can increase AOV and SEO footprint.`,
        severity: "low",
        category: "Catalog",
        service: "Product Strategy",
      });
    }
  }

  return issues;
}

function generateScores(issues: any[]): Record<string, number> {
  const categories = ["Email Marketing", "Retention", "Social Proof", "SEO & AI Visibility", "Performance", "Conversion", "Contact", "Catalog"];
  const scores: Record<string, number> = {};
  categories.forEach((cat) => {
    const catIssues = issues.filter((i) => i.category === cat);
    const critical = catIssues.filter((i) => i.severity === "critical").length;
    const high = catIssues.filter((i) => i.severity === "high").length;
    const medium = catIssues.filter((i) => i.severity === "medium").length;
    let score = 100 - critical * 25 - high * 15 - medium * 8;
    scores[cat.replace(/\s+/g, "_").toLowerCase()] = Math.max(0, Math.min(100, score));
  });
  return scores;
}

function generateRevenue(issues: any[]) {
  const critical = issues.filter((i) => i.severity === "critical").length;
  const high = issues.filter((i) => i.severity === "high").length;
  const medium = issues.filter((i) => i.severity === "medium").length;
  const monthly = (critical * 3500 + high * 1800 + medium * 600);
  return {
    missedDemand: `$${(monthly * 1.5).toLocaleString()}`,
    recoverable: `$${monthly.toLocaleString()}`,
    fullPotential: `$${(monthly * 2.5).toLocaleString()}`,
  };
}

function extractEmails(html: string, url: string): string[] {
  const found = new Set<string>();
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = html.match(emailRegex) || [];
  const domain = url.replace(/^https?:\/\//, "").split("/")[0];
  matches.forEach((e) => {
    const clean = e.toLowerCase().trim();
    if (!clean.includes("example") && !clean.includes("domain") && !clean.includes("yourdomain")) {
      found.add(clean);
    }
  });
  return Array.from(found).slice(0, 8);
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ message: "URL is required" }, { status: 400 });
    }

    // Fetch HTML
    let html = "";
    let storeName = url.replace(/^https?:\/\//, "").split("/")[0];
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      html = await res.text();
      const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
      if (titleMatch?.[1]) storeName = titleMatch[1].trim();
    } catch {
      // proceed with empty html
    }

    // Fetch StoreIndex data
    const storeData = await fetchStoreIndexData(url);

    // Generate issues
    const issues = generateIssues(storeData, html, url);
    const scores = generateScores(issues);
    const overallScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length);
    const revenue = generateRevenue(issues);
    const emails = extractEmails(html, url);

    // Add StoreIndex email if found
    if (storeData?.email && !emails.includes(storeData.email)) {
      emails.unshift(storeData.email);
    }

    return NextResponse.json({
      storeName,
      storeUrl: url,
      overallScore,
      scores,
      issues,
      emails,
      revenue,
      storeIndex: storeData
        ? {
            shopifyId: storeData.shopifyId,
            domain: storeData.domain,
            installedApps: storeData.installedAppsName || [],
            companySize: storeData.companySize,
            activeProducts: storeData.activeProductsRange,
            revenueRange: storeData.revenueRange,
            country: storeData.country,
            industry: storeData.industry,
          }
        : null,
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Audit failed" }, { status: 500 });
  }
}