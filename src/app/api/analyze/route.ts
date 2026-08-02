import { NextRequest, NextResponse } from 'next/server';

const PROBLEM_DB = {
  technical: [
    { id: 'slow_theme', name: 'slow load times', impact: 'High', revenue: 'Every extra second costs ~7% in conversions' },
    { id: 'mobile_responsive', name: 'mobile experience gaps', impact: 'Critical', revenue: 'Over 60% of traffic is mobile' },
    { id: 'no_ssl', name: 'security warnings', impact: 'High', revenue: 'Browsers flag insecure sites' },
  ],
  marketing: [
    { id: 'no_fb_pixel', name: 'Meta/Facebook tracking', impact: 'High', revenue: 'No retargeting = 97% of visitors lost forever' },
    { id: 'no_tiktok', name: 'TikTok ad tracking', impact: 'Medium', revenue: 'Missing the fastest-growing ad channel' },
    { id: 'no_google_ads', name: 'Google conversion tracking', impact: 'High', revenue: 'Ad spend flying blind' },
    { id: 'no_klaviyo', name: 'email marketing flows', impact: 'Critical', revenue: 'Email drives 20-30% of e-com revenue' },
    { id: 'no_reviews', name: 'product reviews', impact: 'High', revenue: 'Reviews lift conversion 15-270%' },
    { id: 'no_chat', name: 'live chat support', impact: 'Medium', revenue: 'Questions go unanswered = lost sales' },
    { id: 'no_popup', name: 'email list building', impact: 'High', revenue: '95% of visitors leave without a trace' },
    { id: 'no_urgency', name: 'urgency or scarcity', impact: 'Medium', revenue: 'No reason to buy now' },
  ],
  product: [
    { id: 'poor_images', name: 'product photography', impact: 'High', revenue: 'Images drive 90% of purchase decisions' },
    { id: 'no_video', name: 'product video', impact: 'High', revenue: 'Video lifts conversion 30-80%' },
    { id: 'no_size_guide', name: 'size guides', impact: 'Medium', revenue: 'Returns eat margins' },
  ],
  operations: [
    { id: 'high_abandon', name: 'cart abandonment recovery', impact: 'Critical', revenue: '70% of carts abandoned, 10-15% recoverable' },
    { id: 'complex_checkout', name: 'checkout friction', impact: 'High', revenue: 'Each extra step drops 10% completion' },
    { id: 'no_upsell', name: 'upsells', impact: 'Medium', revenue: 'AOV opportunity left on table' },
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateOutreach(storeName: string, problems: string[], revenueKillers: string[], niche: string) {
  const name = storeName || 'there';
  const firstName = name.split(' ')[0];
  const topIssue = problems[0] || 'conversion optimization';
  const secondIssue = problems[1] || '';
  const thirdIssue = problems[2] || '';

  const openers = [
    `Came across ${name} while researching ${niche} brands and wanted to reach out personally.`,
    `I've been spending time in the ${niche} space lately and ${name} stood out — but I noticed something that might be holding you back.`,
    `Quick note: I was analyzing ${niche} stores and found ${name}. Love the brand direction, but there's a gap I wanted to flag.`,
    `Been looking at ${niche} brands this week and ${name} caught my eye. Great positioning, but I spotted a few leaks in the funnel.`,
  ];

  const problemPhrases = [
    `I noticed you're missing ${topIssue}.${secondIssue ? ` Also no sign of ${secondIssue}.` : ''} ${thirdIssue ? ` And ${thirdIssue} seems to be absent too.` : ''}`,
    `From the outside, it looks like ${topIssue} isn't set up yet.${secondIssue ? ` Same with ${secondIssue}.` : ''}`,
    `One thing that stood out: no ${topIssue} in place.${secondIssue ? ` I also couldn't find ${secondIssue}.` : ''}`,
  ];

  const impactPhrases = [
    `Not a huge deal on day one, but over 3-6 months that adds up to real revenue walking out the door.`,
    `Most founders don't notice until they compare quarters. The stores fixing this usually see a 20-35% lift within 60 days.`,
    `In the ${niche} space specifically, that's often the difference between a 2% and a 3.5% conversion rate.`,
  ];

  const ctas = [
    `If you're curious, I can send over a quick 3-minute audit video showing exactly what I'd change first. No pitch — just figured it might be useful.`,
    `Worth a conversation? I help ${niche} brands plug these exact leaks. Happy to share a free audit if it's helpful.`,
    `I run a small CRO studio focused on ${niche} brands. I'd love to send you a short audit — purely value, no strings attached. Interested?`,
    `Not sure if you're actively optimizing right now, but if you ever want a second set of eyes on the funnel, I'm happy to take a look.`,
  ];

  const closers = [
    `Either way, keep building — the brand looks solid.`,
    `No pressure at all. Just thought it was worth mentioning.`,
    `Cheers, and good luck with the next quarter.`,
  ];

  const opener = pickRandom(openers);
  const problemPhrase = pickRandom(problemPhrases);
  const impactPhrase = pickRandom(impactPhrases);
  const cta = pickRandom(ctas);
  const closer = pickRandom(closers);

  return `${opener}

${problemPhrase} ${impactPhrases.length > 0 ? impactPhrase : ''}

${cta}

${closer}

Best,`;
}

function detectFromHtml(html: string, url: string, niche: string = 'general') {
  const lower = html.toLowerCase();
  const problems: string[] = [];
  const revenueKillers: string[] = [];
  const services: string[] = [];

  const isShopify = lower.includes('shopify') || lower.includes('cdn.shopify.com') || lower.includes('myshopify.com');
  
  let themeName = 'Unknown';
  const themeMatch = html.match(/theme_name["']?\s*:\s*["']([^"']+)/i);
  if (themeMatch) themeName = themeMatch[1];
  else if (lower.includes('dawn')) themeName = 'Dawn';
  else if (lower.includes('prestige')) themeName = 'Prestige';
  else if (lower.includes('impulse')) themeName = 'Impulse';

  const hasFacebookPixel = lower.includes('fbevents.js') || lower.includes('connect.facebook.net');
  const hasTikTokPixel = lower.includes('tiktok') && (lower.includes('pixel') || lower.includes('ttq'));
  const hasGoogleAds = lower.includes('gtag') || lower.includes('googletagmanager');
  const hasKlaviyo = lower.includes('klaviyo') || lower.includes('a.klaviyo.com');
  const hasReviews = lower.includes('reviews') || lower.includes('yotpo') || lower.includes('loox') || lower.includes('stamped') || lower.includes('judge.me');
  const hasChat = lower.includes('tidio') || lower.includes('gorgias') || lower.includes('zendesk') || lower.includes('intercom') || lower.includes('chat-widget');
  const hasEmailPopup = lower.includes('klaviyo') && (lower.includes('popup') || lower.includes('signup'));
  const hasUrgency = lower.includes('countdown') || lower.includes('timer') || lower.includes('limited') || lower.includes('selling fast');
  const hasSSL = url.startsWith('https');
  const hasViewport = lower.includes('viewport');
  const pageSizeKB = Math.round(html.length / 1024);
  const isSlow = pageSizeKB > 1500;
  const hasVideo = lower.includes('<video') || lower.includes('youtube.com/embed') || lower.includes('vimeo.com');
  const hasSizeGuide = lower.includes('size guide') || lower.includes('size-chart');

  if (isSlow) { problems.push('speed optimization'); revenueKillers.push('Slow themes bleed conversions on mobile'); services.push('Speed Optimization'); }
  if (!hasFacebookPixel) { problems.push('Meta/Facebook tracking'); revenueKillers.push('No retargeting = 97% of visitors lost'); services.push('Facebook Ads'); }
  if (!hasTikTokPixel) { problems.push('TikTok ad tracking'); revenueKillers.push('Missing Gen Z acquisition channel'); services.push('TikTok Ads'); }
  if (!hasGoogleAds) { problems.push('Google conversion tracking'); revenueKillers.push('Google Ads running blind'); services.push('Google Ads'); }
  if (!hasKlaviyo) { problems.push('email marketing flows'); revenueKillers.push('Email revenue left on table'); services.push('Email Marketing'); }
  if (!hasReviews) { problems.push('product reviews'); revenueKillers.push('Social proof gap'); services.push('Review System'); }
  if (!hasChat) { problems.push('live chat'); revenueKillers.push('Questions unanswered'); services.push('Live Chat'); }
  if (!hasEmailPopup) { problems.push('email list building'); revenueKillers.push('95% visitors leave forever'); services.push('List Building'); }
  if (!hasUrgency) { problems.push('urgency/scarcity'); revenueKillers.push('No reason to buy now'); services.push('CRO'); }
  if (!hasVideo) { problems.push('product video'); revenueKillers.push('Static images underperform'); services.push('Video'); }
  if (!hasSizeGuide) { problems.push('size guides'); revenueKillers.push('Returns eating margin'); services.push('UX Design'); }
  if (!hasViewport) { problems.push('mobile optimization'); revenueKillers.push('Broken mobile experience'); services.push('Mobile Optimization'); }

  let score = 100;
  score -= problems.length * 6;
  if (isSlow) score -= 10;
  if (!hasSSL) score -= 15;
  score = Math.max(15, Math.min(98, score));

  let revenueImpact = 'Low';
  const criticalCount = problems.filter((_, i) => revenueKillers[i]?.includes('bleed') || revenueKillers[i]?.includes('left on table')).length;
  if (criticalCount >= 2) revenueImpact = '$5,000-12,000/mo';
  else if (problems.length >= 4) revenueImpact = '$3,000-8,000/mo';
  else if (problems.length >= 2) revenueImpact = '$1,500-4,000/mo';
  else if (problems.length > 0) revenueImpact = '$500-2,000/mo';

  const domain = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const displayName = domain.replace(/^www\./, '').split('.')[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const outreach = generateOutreach(displayName, problems, revenueKillers, niche);

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const foundEmails = [...html.matchAll(emailRegex)].map(m => m[0]).filter((e: string) => 
    !e.includes('example') && !e.includes('test@') && !e.includes('noreply') && !e.includes('no-reply')
  );
  const uniqueEmails = [...new Set(foundEmails)].slice(0, 5);
  const guessedEmails = [`contact@${domain}`, `support@${domain}`, `hello@${domain}`];
  const discoveredEmails = uniqueEmails.length > 0 ? uniqueEmails : guessedEmails;

  return {
    name: displayName,
    url,
    isShopify,
    themeName,
    pageSize: `${pageSizeKB} KB`,
    score,
    revenueImpact,
    priorityFix: problems[0] || 'No critical issues detected',
    problems: problems.map((p, i) => `${p} — ${revenueKillers[i]}`),
    revenueKillers,
    opportunities: `Found ${problems.length} gaps. ${!hasKlaviyo ? 'Email flows alone typically recover 10-15% of abandoned revenue. ' : ''}${isSlow ? 'Speed fixes usually lift mobile conversion 15-20%. ' : ''}${!hasReviews ? 'Reviews are the highest-ROI trust signal. ' : ''}`,
    services: [...new Set(services)],
    socialCommerce: { hasFacebookPixel, hasTikTokPixel, hasGoogleAds, hasSnapchat: lower.includes('snapchat') },
    technical: { hasSSL, isMobileResponsive: hasViewport, hasSitemap: lower.includes('sitemap'), hasRobotsTxt: lower.includes('robots.txt') },
    uxConversion: { hasReviews, hasUrgencyTimers: hasUrgency, hasEmailPopup, hasLiveChat: hasChat },
    primaryEmail: discoveredEmails[0] || `contact@${domain}`,
    discoveredEmails,
    outreach,
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { url, niche = 'general' } = body;
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

  let targetUrl = url;
  if (!targetUrl.startsWith('http')) targetUrl = `https://${targetUrl}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return NextResponse.json({ error: `Failed to fetch: ${res.status}` }, { status: 502 });
    const html = await res.text();
    const result = detectFromHtml(html, targetUrl, niche);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to analyze store' }, { status: 500 });
  }
}