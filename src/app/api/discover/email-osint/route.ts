import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserFromRequest, unauthorized } from '@/lib/server-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const HUNTER_API_KEY = process.env.HUNTER_API_KEY || null;

async function fetchHtml(url: string, timeout = 6000) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeout);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    clearTimeout(t);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function extractEmails(html: string, domain: string): string[] {
  if (!html) return [];

  // Decode common obfuscations
  let text = html
    .replace(/&#64;/g, '@')
    .replace(/&#46;/g, '.')
    .replace(/&commat;/g, '@')
    .replace(/&period;/g, '.')
    .replace(/&amp;/g, '&')
    .replace(/\[\s*at\s*\]/gi, '@')
    .replace(/\(\s*at\s*\)/gi, '@')
    .replace(/\{\s*at\s*\}/gi, '@')
    .replace(/\s+at\s+/gi, '@')
    .replace(/\[\s*dot\s*\]/gi, '.')
    .replace(/\(\s*dot\s*\)/gi, '.')
    .replace(/\{\s*dot\s*\}/gi, '.');

  // mailto: links
  const mailtoMatches = [...text.matchAll(/mailto:([^"'\s<>]+)/gi)].map(m => m[1].split('?')[0]);

  // Standard emails
  const regexMatches = [...text.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)].map(m => m[0]);

  const all = [...mailtoMatches, ...regexMatches];

  const excludePrefixes = [
    'noreply', 'no-reply', 'support', 'help', 'info', 'sales', 'marketing',
    'team', 'press', 'media', 'privacy', 'legal', 'abuse', 'webmaster',
    'postmaster', 'admin', 'billing', 'careers', 'jobs', 'newsletter',
    'updates', 'notifications', 'alerts', 'feedback', 'service', 'orders',
    'shipping', 'returns', 'customerservice', 'enquiries', 'general',
    'office', 'contactus', 'getintouch', 'social', 'instagram', 'facebook',
    'twitter', 'tiktok', 'affiliates', 'partnerships', 'wholesale', 'advertising',
    'sponsorship', 'donotreply', 'mailer-daemon', 'localhost', 'example',
    'test', 'demo', 'user', 'name', 'first.last', 'john.doe', 'jane.doe',
    'root', 'system', 'robot', 'bot', 'automated', 'auto', 'reply', 'bounces',
    'list', 'mailinglist', 'unsubscribe', 'subscribe', 'confirm', 'verify',
    'security', 'spam', 'junk', 'sitemap', 'cdn', 'assets', 'static', 'img',
    'images', 'css', 'js', 'script', 'dev', 'staging', 'prod', 'github',
  ];

  const excludeDomains = ['shopify.com', 'zendesk.com', 'freshdesk.com', 'google.com', 'facebook.com'];

  const filtered = all.filter((e: string) => {
    const lower = e.toLowerCase().trim();
    if (!lower.includes('@') || lower.length > 60) return false;
    const local = lower.split('@')[0];
    if (local.length < 2) return false;
    if (excludePrefixes.some(p => lower.startsWith(p + '@'))) return false;
    const emailDomain = lower.split('@')[1];
    if (excludeDomains.some(d => emailDomain?.includes(d))) return false;
    return true;
  });

  return [...new Set(filtered)];
}

async function hunterLookup(domain: string): Promise<string | null> {
  if (!HUNTER_API_KEY) return null;
  try {
    const res = await fetch(
      `https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${HUNTER_API_KEY}&limit=1&type=personal`,
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    if (data.data?.emails?.[0]?.value) {
      return data.data.emails[0].value;
    }
  } catch {}
  return null;
}

async function whoisLookup(domain: string): Promise<string | null> {
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`, {
      signal: AbortSignal.timeout(6000),
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();

    const searchVcard = (entities: any[]): string | null => {
      for (const entity of entities || []) {
        if (entity.vcardArray?.[1]) {
          for (const prop of entity.vcardArray[1]) {
            if (prop[0] === 'email') {
              const email = prop[3];
              if (email && !email.includes('privacy') && !email.includes('whois') && !email.includes('proxy')) {
                return email;
              }
            }
          }
        }
        if (entity.entities) {
          const found = searchVcard(entity.entities);
          if (found) return found;
        }
      }
      return null;
    };

    return searchVcard(data.entities || []);
  } catch {}
  return null;
}

function guessEmails(domain: string, storeName: string): string[] {
  const base = domain.replace(/^www\./, '').toLowerCase();
  const guesses: string[] = [
    `owner@${base}`,
    `founder@${base}`,
    `hello@${base}`,
    `contact@${base}`,
  ];
  const parts = storeName.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);
  if (parts.length >= 1) {
    guesses.unshift(`${parts[0]}@${base}`);
    if (parts.length >= 2) {
      guesses.unshift(`${parts[0]}.${parts[parts.length - 1]}@${base}`);
      guesses.unshift(`${parts[0]}${parts[parts.length - 1]}@${base}`);
    }
  }
  return [...new Set(guesses)];
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const body = await req.json();
  const { storeUrl, storeId } = body;
  if (!storeUrl) return NextResponse.json({ error: 'Missing URL' }, { status: 400 });

  let cleanUrl: string;
  try {
    cleanUrl = storeUrl.startsWith('http') ? storeUrl : `https://${storeUrl}`;
    new URL(cleanUrl); // validate
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  const domain = new URL(cleanUrl).hostname;
  const base = cleanUrl.replace(/\/$/, '');

  // LAYER 1: Aggressive scraping (17 pages)
  const paths = [
    '', '/pages/contact', '/contact', '/about', '/pages/about-us', '/pages/about',
    '/privacy-policy', '/privacy', '/terms', '/terms-of-service', '/pages/terms',
    '/pages/privacy', '/team', '/pages/team', '/careers', '/pages/careers',
    '/wholesale', '/pages/wholesale', '/stockists', '/faq', '/help', '/support',
  ];

  let allEmails: string[] = [];
  for (const path of paths) {
    const html = await fetchHtml(base + path, 5000);
    if (html) {
      const emails = extractEmails(html, domain);
      allEmails = [...allEmails, ...emails];
      if (allEmails.length >= 3) break;
    }
  }

  const unique = [...new Set(allEmails)];
  let bestEmail: string | null = null;
  let confidence = 0;
  let source = 'none';

  // Prefer domain-matching emails from scraping
  const domainEmails = unique.filter(e => {
    const d = e.toLowerCase().split('@')[1];
    return d === domain.toLowerCase() || d === `www.${domain.toLowerCase()}`;
  });

  if (domainEmails.length > 0) {
    bestEmail = domainEmails[0];
    confidence = Math.min(95, 70 + domainEmails.length * 5);
    source = 'scraping';
  } else if (unique.length > 0) {
    // Personal email (gmail, outlook) — often the real owner
    bestEmail = unique[0];
    confidence = Math.min(80, 50 + unique.length * 5);
    source = 'scraping-personal';
  }

  // LAYER 2: Hunter.io (professional finder)
  if (!bestEmail && HUNTER_API_KEY) {
    const hunterEmail = await hunterLookup(domain);
    if (hunterEmail) {
      bestEmail = hunterEmail;
      confidence = 85;
      source = 'hunter.io';
    }
  }

  // LAYER 3: WHOIS (free, no key)
  if (!bestEmail) {
    const whoisEmail = await whoisLookup(domain);
    if (whoisEmail) {
      bestEmail = whoisEmail;
      confidence = 65;
      source = 'whois';
    }
  }

  // LAYER 4: Guessed patterns (low confidence, don't auto-save)
  const guesses = guessEmails(domain, base.replace(/^https?:\/\//, '').split('/')[0]);

  // Save to DB
  if (storeId && bestEmail) {
    await supabase
      .from('store_leads')
      .update({
        email: bestEmail,
        email_valid: true,
        email_confidence: confidence,
        quality_score: confidence >= 80 ? 85 : confidence >= 60 ? 75 : 65,
        updated_at: new Date().toISOString(),
      })
      .eq('id', storeId)
      .eq('user_id', user.id);
  }

  return NextResponse.json({
    success: !!bestEmail,
    bestEmail,
    confidence,
    found: unique.slice(0, 5),
    guesses: bestEmail ? [] : guesses.slice(0, 5),
    source,
  });
}