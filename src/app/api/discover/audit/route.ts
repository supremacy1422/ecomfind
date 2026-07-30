import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/* ───────── HELPERS ───────── */
function decodeHtmlEntities(text: string): string {
  if (!text) return "";
  return text
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#38;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&#60;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#62;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

async function fetchHtml(url: string, timeout = 5000) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeout);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    clearTimeout(t);
    if (!res.ok) return null;
    return await res.text();
  } catch { return null; }
}

function extractEmails(html: string) {
  if (!html) return [];
  let text = html
    .replace(/&#64;/g, "@").replace(/&#46;/g, ".")
    .replace(/&commat;/g, "@").replace(/&period;/g, ".")
    .replace(/&amp;/g, "&")
    .replace(/\[\s*at\s*\]/gi, "@").replace(/\(\s*at\s*\)/gi, "@")
    .replace(/\{\s*at\s*\}/gi, "@").replace(/\s+at\s+/gi, "@")
    .replace(/\[\s*dot\s*\]/gi, ".").replace(/\(\s*dot\s*\)/gi, ".");

  const mailto = [...text.matchAll(/mailto:([^"'\s<>]+)/gi)].map((m) => m[1].split("?")[0]);
  const regex = [...text.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)].map((m) => m[0]);
  const all = [...mailto, ...regex];

  const badPrefixes = ["noreply","no-reply","support","help","sales","marketing","team","press","media","privacy","legal","abuse","webmaster","admin","billing","careers","jobs","newsletter","updates","notifications","alerts","feedback","service","orders","shipping","returns","customerservice","enquiries","general","office","contactus","getintouch","instagram","facebook","twitter","tiktok","affiliates","partnerships","wholesale","advertising","sponsorship","donotreply","user","name","first.last","john.doe","root","system","robot","bot","auto","reply","bounces","list","mailinglist","unsubscribe","subscribe","confirm","verify","security","spam","junk","sitemap","cdn","assets","static","img","images","css","js","script","dev","staging","github","hostmaster","postmaster","usenet","news","www","mail"];
  
  const badDomains = ["example.com","test.com","localhost","domain.com","email.com","yourdomain.com","sample.com","demo.com","test.io","example.io"];

  const seen = new Set<string>();
  return all
    .filter((e) => {
      const lower = e.toLowerCase().trim();
      if (!lower.includes("@") || lower.length > 60) return false;
      const local = lower.split("@")[0];
      const domain = lower.split("@")[1];
      if (local.length < 2) return false;
      if (badPrefixes.some((p) => lower.startsWith(p + "@"))) return false;
      if (badDomains.some((d) => domain === d)) return false;
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    })
    .map((e) => e.toLowerCase().trim());
}

function detectEvidence(html: string, url: string) {
  const lower = html.toLowerCase();
  const full = html;

  const platform = lower.includes("shopify") ? "Shopify" : lower.includes("woocommerce") ? "WooCommerce" : lower.includes("bigcommerce") ? "BigCommerce" : "Unknown";

  const themeMatch = full.match(/theme_store_id["']?\s*:\s*["']?(\d+)/i) || full.match(/Shopify\.theme\s*=\s*\{[^}]*"name"\s*:\s*"([^"]+)"/i);
  const theme = themeMatch ? `Shopify Theme #${themeMatch[1]}` : lower.includes("debut") ? "Debut" : lower.includes("dawn") ? "Dawn" : "Custom / Undetected";

  const apps: string[] = [];
  if (lower.includes("klaviyo")) apps.push("Klaviyo");
  if (lower.includes("mailchimp")) apps.push("Mailchimp");
  if (lower.includes("omnisend")) apps.push("Omnisend");
  if (lower.includes("loox")) apps.push("Loox");
  if (lower.includes("yotpo")) apps.push("Yotpo");
  if (lower.includes("judge.me")) apps.push("Judge.me");
  if (lower.includes("okendo")) apps.push("Okendo");
  if (lower.includes("tidio")) apps.push("Tidio");
  if (lower.includes("gorgias")) apps.push("Gorgias");
  if (lower.includes("zendesk")) apps.push("Zendesk");
  if (lower.includes("recharge")) apps.push("Recharge");
  if (lower.includes("bold")) apps.push("Bold Apps");
  if (lower.includes("pagefly")) apps.push("PageFly");
  if (lower.includes("gempages")) apps.push("GemPages");
  if (lower.includes("shogun")) apps.push("Shogun");
  if (lower.includes("hotjar")) apps.push("Hotjar");
  if (lower.includes("clarity.ms")) apps.push("Microsoft Clarity");
  if (lower.includes("crazyegg")) apps.push("Crazy Egg");
  if (lower.includes("aftership")) apps.push("AfterShip");
  if (lower.includes("smile.io")) apps.push("Smile.io");
  if (lower.includes("friendbuy")) apps.push("Friendbuy");
  if (lower.includes("attentive")) apps.push("Attentive");
  if (lower.includes("postscript")) apps.push("Postscript");

  const productCount = (full.match(/\/products\//g) || []).length;
  const collectionCount = (full.match(/\/collections\//g) || []).length;

  const currencyMatch = full.match(/["']currency["']?\s*[:=]\s*["']([A-Z]{3})["']/i) || full.match(/\\u003cspan\\u003e\\u003cspan\\u003e([A-Z]{3})/);
  const currency = currencyMatch ? currencyMatch[1] : "Unknown";

  const langMatch = full.match(/<html[^>]+lang=["']([a-zA-Z-]+)["']/i);
  const language = langMatch ? langMatch[1] : "Unknown";

  const titleMatch = full.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = decodeHtmlEntities(titleMatch ? titleMatch[1].trim() : "");
  const descMatch = full.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  const description = decodeHtmlEntities(descMatch ? descMatch[1] : "");
  const h1s = [...full.matchAll(/<h1[^>]*>([^<]+)<\/h1>/gi)].map((m) => decodeHtmlEntities(m[1].trim())).filter(Boolean);
  const h2s = [...full.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi)].map((m) => decodeHtmlEntities(m[1].trim())).filter(Boolean);

  const hasSchema = lower.includes("application/ld+json") || lower.includes("schema.org");
  const hasFAQSchema = hasSchema && lower.includes("faqpage");
  const hasProductSchema = hasSchema && lower.includes("product");

  const hasGTM = lower.includes("googletagmanager") || lower.includes("gtm-");
  const hasFBPixel = lower.includes("fbq(") || lower.includes("connect.facebook.net");
  const hasTikTok = lower.includes("tiktok") || lower.includes("ttq");
  const hasGA4 = lower.includes("gtag") || lower.includes("google-analytics") || lower.includes("googleanalytics");
  const hasEmailCapture = lower.includes("newsletter") || lower.includes("subscribe") || lower.includes("email") || lower.includes("klaviyo");
  const hasReviews = lower.includes("review") || apps.some((a) => ["Loox","Yotpo","Judge.me","Okendo"].includes(a));
  const hasLiveChat = lower.includes("tidio") || lower.includes("gorgias") || lower.includes("zendesk") || lower.includes("intercom");

  const social: Record<string, string> = {};
  const ig = full.match(/https?:\/\/(www\.)?instagram\.com\/([A-Za-z0-9_.]+)/i);
  if (ig) social.instagram = ig[0];
  const fb = full.match(/https?:\/\/(www\.)?facebook\.com\/([A-Za-z0-9.]+)/i);
  if (fb) social.facebook = fb[0];
  const tt = full.match(/https?:\/\/(www\.)?tiktok\.com\/(@[A-Za-z0-9_.]+)/i);
  if (tt) social.tiktok = tt[0];
  const pt = full.match(/https?:\/\/(www\.)?pinterest\.com\/([A-Za-z0-9_.]+)/i);
  if (pt) social.pinterest = pt[0];
  const yt = full.match(/https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/([A-Za-z0-9_\-]+)/i);
  if (yt) social.youtube = yt[0];

  const hasSSL = url.startsWith("https");
  const hasGuarantee = lower.includes("guarantee") || lower.includes("money back") || lower.includes("satisfaction");

  const hasBlog = lower.includes("/blogs/") || lower.includes("/articles/") || lower.includes("blog");
  const hasFAQ = lower.includes("/faq") || lower.includes("/pages/faq");
  const hasAbout = lower.includes("/about") || lower.includes("/pages/about");
  const hasContact = lower.includes("/contact") || lower.includes("/pages/contact");

  const policies = {
    privacy: lower.includes("/privacy") || lower.includes("/policies/privacy"),
    terms: lower.includes("/terms") || lower.includes("/policies/terms"),
    refund: lower.includes("/refund") || lower.includes("/return") || lower.includes("/policies/refund"),
    shipping: lower.includes("/shipping") || lower.includes("/policies/shipping"),
  };

  const scriptCount = (full.match(/<script/gi) || []).length;
  const imgCount = (full.match(/<img/gi) || []).length;
  const hasLazyLoad = lower.includes('loading="lazy"') || lower.includes("data-src");
  const hasViewport = lower.includes("viewport");
  const hasHreflang = lower.includes("hreflang");
  const hasMultiCurrency = lower.includes("currency") && lower.includes("switch");

  return {
    platform, theme, apps, productCount, collectionCount, currency, language,
    seo: { title, description, h1s, h2s, hasSchema, hasFAQSchema, hasProductSchema },
    marketing: { hasGTM, hasFBPixel, hasTikTok, hasGA4, hasEmailCapture, hasReviews, hasLiveChat },
    social,
    trust: { hasSSL, hasGuarantee, hasReviews, hasLiveChat },
    content: { hasBlog, hasFAQ, hasAbout, hasContact },
    policies,
    performance: { scriptCount, imgCount, hasLazyLoad, hasViewport },
    international: { hasHreflang, hasMultiCurrency },
  };
}

function runAudit(html: string) {
  const lower = html.toLowerCase();
  const issues: any[] = [];
  const add = (title: string, severity: "high" | "medium" | "low", service: string, category: string) =>
    issues.push({ title, severity, service, category });

  if (!lower.includes("klaviyo") && !lower.includes("mailchimp") && !lower.includes("omnisend")) {
    add("No email marketing platform detected", "high", "Klaviyo / Omnisend Setup", "Marketing");
  }
  if (!lower.includes("tidio") && !lower.includes("gorgias") && !lower.includes("zendesk") && !lower.includes("intercom")) {
    add("No live chat or helpdesk installed", "medium", "Live Chat & Support", "Conversion");
  }
  if (!lower.includes("loox") && !lower.includes("yotpo") && !lower.includes("judge.me") && !lower.includes("okendo")) {
    add("No review app detected", "high", "Review & UGC System", "Marketing");
  }
  if (!lower.includes("recharge") && !lower.includes("bold subscriptions") && !lower.includes("seal")) {
    add("No subscription / recurring revenue model", "medium", "Subscription Program", "Marketing");
  }
  if (!lower.includes("google tag manager") && !lower.includes("gtm-")) {
    add("GTM not detected — tracking likely broken", "high", "Analytics & Tracking Audit", "SEO & Technical");
  }
  if (!lower.includes("facebook") && !lower.includes("fbq(") && !lower.includes("connect.facebook.net")) {
    add("Facebook Pixel not detected", "high", "Meta Ads & Retargeting", "Marketing");
  }
  if (!lower.includes("hotjar") && !lower.includes("clarity.ms") && !lower.includes("crazyegg")) {
    add("No heatmap or session recording", "medium", "CRO & Heatmap Setup", "Conversion");
  }
  if (!lower.includes("schema.org") && !lower.includes("application/ld+json")) {
    add("No structured data / rich snippets", "medium", "Technical SEO & Schema Markup", "SEO & Technical");
  }
  if (!lower.includes("hreflang")) {
    add("No hreflang tags — missing international SEO", "low", "International SEO", "SEO & Technical");
  }
  if (!lower.includes("pagefly") && !lower.includes("gempages") && !lower.includes("shogun") && !lower.includes("zipify")) {
    add("Using default Shopify pages — low conversion design", "medium", "Landing Page Design", "Conversion");
  }
  if (!lower.includes("aftership") && !lower.includes("tracking")) {
    add("No branded order tracking page", "low", "Post-Purchase Experience", "Operations");
  }
  if (!lower.includes("one-click") && !lower.includes("post purchase") && !lower.includes("upsell")) {
    add("No post-purchase upsell funnel", "high", "Upsell & AOV Optimization", "Conversion");
  }
  if (!lower.includes("/blogs/") && !lower.includes("/articles/") && !lower.includes("content=")) {
    add("No content marketing / blog detected", "medium", "Content Strategy & SEO Blog", "Marketing");
  }
  if (!lower.includes("loyalty") && !lower.includes("rewards") && !lower.includes("smile.io")) {
    add("No loyalty or rewards program", "medium", "Loyalty & Retention Program", "Marketing");
  }
  if (!lower.includes("wishlist") && !lower.includes("favorites")) {
    add("No wishlist functionality", "low", "Wishlist & Save-for-Later", "Conversion");
  }
  if (!lower.includes("size guide") && !lower.includes("size chart") && !lower.includes("fit finder")) {
    add("No size guide or fit finder", "medium", "Size Guide & Fit Technology", "Conversion");
  }
  if (!lower.includes("gift card") && !lower.includes("giftcard")) {
    add("Gift cards not prominently offered", "low", "Gift Card Program", "Marketing");
  }
  if (!lower.includes("referral") && !lower.includes("refer a friend") && !lower.includes("friendbuy")) {
    add("No referral program detected", "medium", "Referral Marketing System", "Marketing");
  }
  if (!lower.includes("sms") && !lower.includes("attentive") && !lower.includes("postscript") && !lower.includes("klaviyo")) {
    add("No SMS marketing platform", "high", "SMS Marketing & Attentive", "Marketing");
  }
  if (!lower.includes("bundle") && !lower.includes("frequently bought") && !lower.includes("cross sell")) {
    add("No product bundling or cross-sell", "medium", "Bundle & Cross-Sell Setup", "Conversion");
  }

  return {
    platform: lower.includes("shopify") ? "Shopify" : lower.includes("woocommerce") ? "WooCommerce" : lower.includes("bigcommerce") ? "BigCommerce" : "Unknown",
    issues: issues.slice(0, 15),
    score: Math.max(0, 100 - issues.filter((i) => i.severity === "high").length * 8 - issues.filter((i) => i.severity === "medium").length * 4 - issues.filter((i) => i.severity === "low").length * 2),
  };
}

async function whoisLookup(domain: string): Promise<string | null> {
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`, { signal: AbortSignal.timeout(5000), headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = await res.json();
    const search = (entities: any[]): string | null => {
      for (const e of entities || []) {
        if (e.vcardArray?.[1]) {
          for (const prop of e.vcardArray[1]) {
            if (prop[0] === "email") {
              const email = prop[3];
              if (email && !email.includes("privacy") && !email.includes("whois") && !email.includes("proxy")) return email.toLowerCase().trim();
            }
          }
        }
        if (e.entities) { const found = search(e.entities); if (found) return found; }
      }
      return null;
    };
    return search(data.entities || []);
  } catch { return null; }
}

function guessEmails(domain: string, isGerman: boolean) {
  const d = domain.toLowerCase().replace(/^www\./, "");
  const guesses = [`info@${d}`,`hello@${d}`,`contact@${d}`,`kontakt@${d}`,`founder@${d}`,`owner@${d}`,`team@${d}`,`office@${d}`];
  if (isGerman) guesses.push(`geschaeftsfuehrer@${d}`, `impressum@${d}`);
  return [...new Set(guesses)];
}

function getUserFromRequest(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.replace("Bearer ", "");
  return supabase.auth.getUser(token).then(({ data, error }) => (error ? null : data.user));
}

/* ───────── MAIN HANDLER ───────── */
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { storeUrl, save, overrideEmail } = body;
    if (!storeUrl) return NextResponse.json({ error: "Missing URL" }, { status: 400 });

    let cleanUrl: string;
    try {
      cleanUrl = storeUrl.startsWith("http") ? storeUrl : `https://${storeUrl}`;
      new URL(cleanUrl);
    } catch { return NextResponse.json({ error: "Invalid URL" }, { status: 400 }); }

    const domain = new URL(cleanUrl).hostname;
    const base = cleanUrl.replace(/\/$/, "");
    const isGerman = domain.endsWith(".de");

    const paths = ["", "/pages/contact", "/contact", "/about", "/pages/about-us", "/impressum", "/pages/impressum"];
    const fetches = await Promise.allSettled(paths.map((p) => fetchHtml(base + p, 4000)));

    let allHtml = "";
    let scrapedEmails: string[] = [];
    fetches.forEach((r) => {
      if (r.status === "fulfilled" && r.value) {
        allHtml += r.value + " ";
        scrapedEmails = [...scrapedEmails, ...extractEmails(r.value)];
      }
    });

    const homeHtml = fetches[0].status === "fulfilled" ? fetches[0].value || "" : "";
    const rawStoreName = homeHtml.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || cleanUrl.replace(/^https?:\/\//, "").split("/")[0];
    const storeName = decodeHtmlEntities(rawStoreName);

    const uniqueScraped = [...new Set(scrapedEmails)];
    let whoisEmail: string | null = null;
    if (uniqueScraped.length === 0) whoisEmail = await whoisLookup(domain);

    const allEmails = [...uniqueScraped, ...(whoisEmail ? [whoisEmail] : [])];
    let bestEmail = allEmails.find((e) => !e.startsWith("info@")) || allEmails[0] || null;
    if (overrideEmail?.includes("@")) bestEmail = overrideEmail.toLowerCase().trim();

    const confidence = bestEmail ? (uniqueScraped.includes(bestEmail) ? Math.min(95, 75 + allEmails.length * 5) : whoisEmail === bestEmail ? 70 : 60) : 0;
    const guesses = bestEmail ? [] : guessEmails(domain, isGerman);

    const audit = runAudit(homeHtml);
    const evidence = detectEvidence(homeHtml, cleanUrl);

    let leadId = null;
    if (save && bestEmail) {
      const { data: existing } = await supabase.from("store_leads").select("id").eq("store_url", cleanUrl).eq("user_id", user.id).single();
      if (!existing) {
        const { data: newLead } = await supabase.from("store_leads").insert({
          user_id: user.id, store_url: cleanUrl, store_name: storeName, email: bestEmail,
          email_valid: true, niche: "general", status: "new", times_contacted: 0,
          quality_score: confidence >= 80 ? 85 : confidence >= 60 ? 75 : 65,
        }).select().single();
        leadId = newLead?.id;
      } else {
        leadId = existing.id;
        await supabase.from("store_leads").update({ email: bestEmail, email_valid: true, quality_score: confidence >= 80 ? 85 : confidence >= 60 ? 75 : 65 }).eq("id", existing.id);
      }
    }

    return NextResponse.json({
      success: true, storeUrl: cleanUrl, storeName, bestEmail, confidence,
      found: allEmails, guesses, source: bestEmail && uniqueScraped.includes(bestEmail) ? "scraped" : whoisEmail === bestEmail ? "whois" : "manual",
      leadId, audit, evidence,
    });
  } catch (err: any) {
    console.error("AUDIT ERROR:", err);
    return NextResponse.json({ error: err.message || "Audit failed" }, { status: 500 });
  }
}