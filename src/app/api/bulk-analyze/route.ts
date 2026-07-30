import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUserFromRequest, unauthorized } from '@/lib/server-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fetchHtml(url: string, timeout = 5000) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeout);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });
    clearTimeout(t);
    if (!res.ok) return null;
    return await res.text();
  } catch { return null; }
}

function extractEmails(html: string): string[] {
  const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const found = [...html.matchAll(regex)].map(m => m[0]).filter((e: string) => {
    const lower = e.toLowerCase();
    return lower.includes('@')
      && !lower.includes('example')
      && !lower.includes('test@')
      && !lower.includes('noreply')
      && !lower.includes('no-reply')
      && !lower.includes('support@')
      && !lower.includes('help@')
      && !lower.includes('info@');
  });
  return [...new Set(found)].slice(0, 3);
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const body = await req.json();
  const { urls } = body;
  if (!urls?.length) return NextResponse.json({ error: 'No URLs provided' }, { status: 400 });

  const results: any[] = [];
  let saved = 0;

  for (const rawUrl of urls.slice(0, 50)) {
    const storeUrl = rawUrl.trim();
    if (!storeUrl || !storeUrl.includes('.')) {
      results.push({ url: storeUrl, success: false, error: 'Invalid URL' });
      continue;
    }

    const cleanUrl = storeUrl.startsWith('http') ? storeUrl : `https://${storeUrl}`;
    const base = cleanUrl.replace(/\/$/, '');
    const paths = ['', '/pages/contact', '/contact', '/about', '/pages/about-us'];
    let allEmails: string[] = [];

    for (const path of paths) {
      const html = await fetchHtml(base + path, 4000);
      if (html) {
        const emails = extractEmails(html);
        allEmails = [...allEmails, ...emails];
        if (allEmails.length >= 2) break;
      }
    }

    const unique = [...new Set(allEmails)];
    const bestEmail = unique[0] || null;

    if (bestEmail) {
      const { data: existing } = await supabase
        .from('store_leads')
        .select('id')
        .eq('store_url', cleanUrl)
        .eq('user_id', user.id)
        .single();

      if (!existing) {
        await supabase.from('store_leads').insert({
          user_id: user.id,
          store_url: cleanUrl,
          store_name: cleanUrl.replace(/^https?:\/\//, '').split('/')[0],
          email: bestEmail,
          email_valid: true,
          niche: 'general',
          status: 'new',
          times_contacted: 0,
          quality_score: 75,
        });
        saved++;
      }

      results.push({
        url: cleanUrl,
        success: true,
        email: bestEmail,
        confidence: Math.min(95, 60 + unique.length * 10),
        found: unique,
      });
    } else {
      results.push({ url: cleanUrl, success: false, error: 'No email found' });
    }
  }

  return NextResponse.json({ success: true, results, saved });
}