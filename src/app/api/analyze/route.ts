import { NextRequest, NextResponse } from 'next/server';

// Shopify problem database (extracted from your research)
const PROBLEM_DB = {
  technical: [
    { id: 'slow_theme', name: 'Slow-loading theme', impact: 'High', revenue: '10-15% conversion drop per second of load time' },
    { id: 'mobile_responsive', name: 'Poor mobile responsiveness', impact: 'Critical', revenue: '60%+ of traffic is mobile; poor UX = immediate bounce' },
    { id: 'js_errors', name: 'JavaScript errors breaking functionality', impact: 'High', revenue: 'Broken checkout = 100% revenue loss on affected users' },
    { id: 'theme_conflicts', name: 'Theme conflicts after update', impact: 'Medium', revenue: 'Broken layouts reduce trust and conversions' },
    { id: 'accessibility', name: 'Accessibility issues', impact: 'Medium', revenue: 'Excludes 15-20% of potential customers' },
    { id: 'ssl_mixed', name: 'Mixed-content warnings', impact: 'Medium', revenue: 'Browser security warnings scare buyers away' },
    { id: 'broken_redirects', name: 'Broken redirects', impact: 'High', revenue: 'SEO traffic lost, customers hit 404s' },
    { id: 'search_broken', name: 'Search function issues', impact: 'Medium', revenue: '30% of users use search; broken = lost sales' },
    { id: 'collection_filter', name: 'Collection filtering bugs', impact: 'Medium', revenue: 'Poor product discovery reduces AOV' },
    { id: 'checkout_custom', name: 'Broken checkout customization', impact: 'Critical', revenue: 'Checkout errors = abandoned purchases' },
  ],
  marketing: [
    { id: 'no_fb_pixel', name: 'Missing Facebook Pixel', impact: 'High', revenue: 'Cannot retarget 97% of visitors; 20-30% ROAS loss' },
    { id: 'no_tiktok', name: 'Missing TikTok Pixel', impact: 'Medium', revenue: 'Missing fastest-growing ad channel for Gen Z' },
    { id: 'no_google_ads', name: 'Missing Google Ads conversion tracking', impact: 'High', revenue: 'Wasted ad spend, no optimization data' },
    { id: 'no_klaviyo', name: 'Missing email marketing flows', impact: 'Critical', revenue: 'Email drives 20-30% of revenue; flows = automated sales' },
    { id: 'no_reviews', name: 'Missing product reviews', impact: 'High', revenue: 'Reviews increase conversion 15-270%; none = trust gap' },
    { id: 'no_chat', name: 'Missing live chat', impact: 'Medium', revenue: 'Chat increases conversion 20%; questions go unanswered' },
    { id: 'no_popup', name: 'Missing email capture popup', impact: 'High', revenue: '95% visitors leave; no capture = lost leads forever' },
    { id: 'no_urgency', name: 'Missing urgency timers/scarcity', impact: 'Medium', revenue: 'Urgency increases conversion 10-15%' },
    { id: 'no_social_proof', name: 'Weak social proof', impact: 'High', revenue: 'No trust signals = high bounce rate' },
    { id: 'poor_seo', name: 'Poor on-page SEO', impact: 'Medium', revenue: 'Organic traffic is free; poor SEO = paying for every visitor' },
  ],
  product: [
    { id: 'poor_images', name: 'Low-quality product images', impact: 'High', revenue: 'Images drive 90% of purchase decisions' },
    { id: 'poor_desc', name: 'Poor product descriptions', impact: 'High', revenue: 'Weak copy = no emotional connection to buy' },
    { id: 'missing_variants', name: 'Missing product variants', impact: 'Medium', revenue: 'Customers want options; missing = lost sales' },
    { id: 'no_video', name: 'Product pages missing video', impact: 'High', revenue: 'Video increases conversion 30-80%' },
    { id: 'no_size_guide', name: 'Missing size guides', impact: 'Medium', revenue: 'High return rate from wrong sizing' },
    { id: 'duplicate_products', name: 'Duplicate products', impact: 'Low', revenue: 'SEO cannibalization, customer confusion' },
  ],
  operations: [
    { id: 'high_abandon', name: 'High cart abandonment', impact: 'Critical', revenue: '70% of carts abandoned; $4 trillion lost annually industry-wide' },
    { id: 'no_abandoned_flow', name: 'No abandoned cart recovery', impact: 'Critical', revenue: '10-15% of abandoned carts recoverable via email' },
    { id: 'high_shipping', name: 'Expensive shipping costs', impact: 'High', revenue: '#1 reason for cart abandonment' },
    { id: 'complex_checkout', name: 'Too many checkout steps', impact: 'High', revenue: 'Each extra step = 10% drop in completion' },
    { id: 'no_upsell', name: 'Poor upselling/cross-selling', impact: 'Medium', revenue: 'AOV increase of 10-30% possible' },
    { id: 'weak_cta', name: 'Weak call-to-action buttons', impact: 'Medium', revenue: 'Strong CTAs can double click-through rates' },
  ],
};

function detectFromHtml(html: string, url: string) {
  const lower = html.toLowerCase();
  const findings: any[] = [];
  const services: string[] = [];
  
  // Shopify detection
  const isShopify = lower.includes('shopify') || 
    lower.includes('cdn.shopify.com') || 
    lower.includes('myshopify.com') ||
    lower.includes('shopify-checkout') ||
    lower.includes('//shopify.');
  
  // Theme detection (basic)
  let themeName = 'Unknown';
  const themeMatch = html.match(/theme_name["']?\s*:\s*["']([^"']+)/i) || 
    html.match(/id=["']shopify-theme["'][^>]*data-theme-name=["']([^"']+)/i);
  if (themeMatch) themeName = themeMatch[1];
  else if (lower.includes('dawn')) themeName = 'Dawn';
  else if (lower.includes('prestige')) themeName = 'Prestige';
  else if (lower.includes('impulse')) themeName = 'Impulse';
  else if (lower.includes('debut')) themeName = 'Debut';
  
  // Tracking pixels
  const hasFacebookPixel = lower.includes('fbevents.js') || lower.includes('facebook-pixel') || lower.includes('connect.facebook.net');
  const hasTikTokPixel = lower.includes('tiktok') && (lower.includes('pixel') || lower.includes('ttq'));
  const hasGoogleAds = lower.includes('gtag') || lower.includes('googletagmanager') || lower.includes('google-analytics');
  const hasKlaviyo = lower.includes('klaviyo') || lower.includes('a.klaviyo.com');
  
  // UX elements
  const hasReviews = lower.includes('reviews') || lower.includes('yotpo') || lower.includes('loox') || lower.includes('stamped') || lower.includes('judge.me');
  const hasChat = lower.includes('tidio') || lower.includes('gorgias') || lower.includes('zendesk') || lower.includes('intercom') || lower.includes('live chat') || lower.includes('chat-widget');
  const hasEmailPopup = lower.includes('klaviyo') && (lower.includes('popup') || lower.includes('signup') || lower.includes('newsletter'));
  const hasUrgency = lower.includes('countdown') || lower.includes('timer') || lower.includes('limited') || lower.includes('selling fast') || lower.includes('only left');
  
  // Technical
  const hasSSL = url.startsWith('https');
  const hasViewport = lower.includes('viewport');
  const pageSizeKB = Math.round(html.length / 1024);
  const isSlow = pageSizeKB > 1500; // >1.5MB is heavy
  
  // SEO basics
  const hasTitle = html.includes('<title>') && html.match(/<title>(.+?)<\/title>/);
  const hasMetaDesc = lower.includes('name="description"') || lower.includes('name=\'description\'');
  const hasAltText = lower.includes('alt=');
  const hasH1 = lower.includes('<h1');
  
  // Product signals
  const hasVideo = lower.includes('<video') || lower.includes('youtube.com/embed') || lower.includes('vimeo.com');
  const hasSizeGuide = lower.includes('size guide') || lower.includes('size-chart') || lower.includes('sizing');
  
  // Build problems list
  const problems: string[] = [];
  const revenueKillers: string[] = [];
  
  if (isSlow) {
    findings.push(PROBLEM_DB.technical[0]);
    problems.push('Theme loads slowly (>1.5MB page size detected)');
    revenueKillers.push('Every 1s delay = 7% conversion loss. Estimated $2,000-5,000/mo in lost sales for avg store.');
    services.push('Speed Optimization');
  }
  
  if (!hasFacebookPixel) {
    findings.push(PROBLEM_DB.marketing[0]);
    problems.push('No Facebook/Meta Pixel detected');
    revenueKillers.push('Cannot retarget 97% of visitors. Estimated 20-30% ROAS loss on ad spend.');
    services.push('Facebook Ads Setup');
  }
  
  if (!hasTikTokPixel) {
    findings.push(PROBLEM_DB.marketing[1]);
    problems.push('No TikTok Pixel detected');
    revenueKillers.push('Missing Gen Z ad channel. Competitors with TikTok tracking get 15-25% cheaper CAC.');
    services.push('TikTok Ads');
  }
  
  if (!hasGoogleAds) {
    findings.push(PROBLEM_DB.marketing[2]);
    problems.push('No Google Analytics/Ads conversion tracking');
    revenueKillers.push('Flying blind on Google Ads. Wasted budget with no attribution data.');
    services.push('Google Ads & Analytics');
  }
  
  if (!hasKlaviyo) {
    findings.push(PROBLEM_DB.marketing[3]);
    problems.push('No email marketing platform detected (Klaviyo)');
    revenueKillers.push('Email drives 20-30% of e-com revenue. No flows = $3,000-8,000/mo left on table.');
    services.push('Email Marketing Setup');
  }
  
  if (!hasReviews) {
    findings.push(PROBLEM_DB.marketing[4]);
    problems.push('No product review system detected');
    revenueKillers.push('Reviews increase conversion 15-270%. No reviews = customers buy from competitor instead.');
    services.push('Review System Install');
  }
  
  if (!hasChat) {
    findings.push(PROBLEM_DB.marketing[5]);
    problems.push('No live chat widget detected');
    revenueKillers.push('Questions go unanswered. 20% of visitors with questions abandon without buying.');
    services.push('Live Chat Setup');
  }
  
  if (!hasEmailPopup) {
    findings.push(PROBLEM_DB.marketing[6]);
    problems.push('No email capture mechanism detected');
    revenueKillers.push('95% of visitors leave forever. Industry avg: 10% email capture rate = massive list growth lost.');
    services.push('Email Capture Popup');
  }
  
  if (!hasUrgency) {
    findings.push(PROBLEM_DB.marketing[7]);
    problems.push('No urgency/scarcity elements detected');
    revenueKillers.push('No reason to buy NOW. Urgency increases conversion 10-15% on average.');
    services.push('CRO & Urgency Elements');
  }
  
  if (!hasVideo) {
    findings.push(PROBLEM_DB.product[3]);
    problems.push('Product pages missing video content');
    revenueKillers.push('Video increases conversion 30-80%. Static images alone are losing sales.');
    services.push('Product Video Production');
  }
  
  if (!hasSizeGuide) {
    findings.push(PROBLEM_DB.product[5]);
    problems.push('No size guide detected');
    revenueKillers.push('High return rate from wrong sizing = margin erosion + unhappy customers.');
    services.push('Size Guide Design');
  }
  
  if (!hasViewport) {
    findings.push(PROBLEM_DB.technical[1]);
    problems.push('Missing mobile viewport meta tag');
    revenueKillers.push('60%+ traffic is mobile. Broken mobile experience = instant 40%+ bounce rate.');
    services.push('Mobile Optimization');
  }
  
  if (pageSizeKB > 800 && !isSlow) {
    findings.push(PROBLEM_DB.technical[0]);
    problems.push('Above-average page weight detected');
    revenueKillers.push('Heavy pages slow down on 3G/4G. Mobile users bounce before page loads.');
    services.push('Performance Audit');
  }
  
  if (!hasTitle || !hasMetaDesc) {
    findings.push(PROBLEM_DB.marketing[9]);
    problems.push('Incomplete on-page SEO (missing title or meta description)');
    revenueKillers.push('Organic traffic is free. Poor SEO = paying for every visitor via ads.');
    services.push('SEO Optimization');
  }
  
  // Always add abandoned cart if no Klaviyo
  if (!hasKlaviyo) {
    findings.push(PROBLEM_DB.operations[1]);
    problems.push('No abandoned cart recovery email flow');
    revenueKillers.push('70% of carts abandoned. Recoverable: 10-15% = $2,000-6,000/mo for avg store.');
    if (!services.includes('Email Marketing Setup')) services.push('Abandoned Cart Flow');
  }
  
  // Score calculation
  let score = 100;
  score -= problems.length * 7; // -7 per major problem
  if (isSlow) score -= 10;
  if (!hasSSL) score -= 15;
  score = Math.max(15, Math.min(98, score));
  
  // Revenue estimate
  let revenueImpact = 'Low';
  if (findings.filter(f => f.impact === 'Critical').length >= 2) revenueImpact = '$5,000-12,000/mo';
  else if (findings.filter(f => f.impact === 'High').length >= 3) revenueImpact = '$3,000-8,000/mo';
  else if (findings.filter(f => f.impact === 'High').length >= 1) revenueImpact = '$1,500-4,000/mo';
  else if (findings.length > 0) revenueImpact = '$500-2,000/mo';
  
  const priorityFix = problems[0] || 'No critical issues detected';
  
  // Generate outreach
  const topProblem = problems[0] || 'conversion optimization';
  const outreach = `Hi there,

I was analyzing your store and noticed ${problems.length > 0 ? `a few things that could be costing you sales:

${problems.slice(0, 3).map((p, i) => `${i + 1}. ${p}`).join('\n')}

The biggest one: ${priorityFix}. ${revenueKillers[0] || ''}

I help Shopify stores fix exactly these issues. Would you be open to a quick audit of your store — no cost, just actionable fixes you can implement this week?

Best regards` : 'your store looks solid, but there are always optimization opportunities. Would you be open to a quick audit?'}`
  
  // Extract emails from page
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const foundEmails = [...html.matchAll(emailRegex)].map(m => m[0]).filter((e: string) => 
    !e.includes('example') && 
    !e.includes('test@') && 
    !e.includes('noreply') &&
    !e.includes('no-reply')
  );
  const uniqueEmails = [...new Set(foundEmails)].slice(0, 5);
  
  const domain = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const guessedEmails = [
    `contact@${domain}`,
    `support@${domain}`,
    `info@${domain}`,
    `hello@${domain}`,
  ];
  const discoveredEmails = uniqueEmails.length > 0 ? uniqueEmails : guessedEmails;
  
  return {
    name: domain.replace(/^www\./, '').split('.')[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    url,
    isShopify,
    themeName,
    pageSize: `${pageSizeKB} KB`,
    score,
    revenueImpact,
    priorityFix,
    problems,
    revenueKillers,
    opportunities: `This store has ${problems.length} detectable gaps. ${!hasKlaviyo ? 'Email marketing alone could recover 20-30% of revenue.' : ''} ${!hasReviews ? 'Adding reviews could double conversion on product pages.' : ''} ${isSlow ? 'Speed optimization typically yields 10-20% conversion lift.' : ''}`,
    services: [...new Set(services)],
    socialCommerce: {
      hasFacebookPixel,
      hasTikTokPixel,
      hasGoogleAds,
      hasSnapchat: lower.includes('snapchat') || lower.includes('sc.pixel'),
    },
    technical: {
      hasSSL,
      isMobileResponsive: hasViewport,
      hasSitemap: lower.includes('sitemap'),
      hasRobotsTxt: lower.includes('robots.txt'),
    },
    uxConversion: {
      hasReviews,
      hasUrgencyTimers: hasUrgency,
      hasEmailPopup,
      hasLiveChat: hasChat,
    },
    primaryEmail: discoveredEmails[0] || `contact@${domain}`,
    discoveredEmails,
    outreach,
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { url } = body;

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
    
    if (!res.ok && res.status !== 200) {
      return NextResponse.json({ error: `Failed to fetch: ${res.status}` }, { status: 502 });
    }
    
    const html = await res.text();
    const result = detectFromHtml(html, targetUrl);
    
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to analyze store' }, { status: 500 });
  }
}