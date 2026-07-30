// Legal email discovery: public pages, WHOIS, patterns, homepage scraping
export async function findStoreEmail(domain: string, html: string): Promise<string[]> {
  const emails: string[] = [];
  const domainClean = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  // 1. Extract emails from homepage HTML
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const homepageEmails = html.match(emailRegex) || [];
  emails.push(...homepageEmails.filter(e => !e.includes('example.com') && !e.includes('domain.com')));
  
  // 2. Scrape common contact pages
  const contactPaths = ['/contact', '/about', '/pages/contact-us', '/pages/about-us', '/contact-us'];
  for (const path of contactPaths) {
    try {
      const res = await fetch(`https://${domainClean}${path}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        next: { revalidate: 0 }
      });
      if (res.ok) {
        const pageHtml = await res.text();
        const pageEmails = pageHtml.match(emailRegex) || [];
        emails.push(...pageEmails);
      }
    } catch (e) { /* ignore */ }
  }
  
  // 3. WHOIS lookup (free API)
  try {
    const whoisRes = await fetch(`https://api.whoapi.com/?domain=${domainClean}&r=whois&apikey=demo`, {
      next: { revalidate: 0 }
    });
    if (whoisRes.ok) {
      const whoisData = await whoisRes.json();
      if (whoisData.emails) {
        const whoisEmails = Array.isArray(whoisData.emails) ? whoisData.emails : [whoisData.emails];
        emails.push(...whoisEmails);
      }
    }
  } catch (e) { /* fallback to pattern guessing */ }
  
  // 4. Pattern guessing (common business emails)
  const commonPatterns = [
    `hello@${domainClean}`,
    `support@${domainClean}`,
    `info@${domainClean}`,
    `contact@${domainClean}`,
    `sales@${domainClean}`,
    `team@${domainClean}`,
    `help@${domainClean}`,
  ];
  
  // Basic validation: check if domain has MX records by trying a simple DNS approach
  // We'll just include patterns as "likely" emails - user can verify
  emails.push(...commonPatterns);
  
  // 5. Clean and deduplicate
  const uniqueEmails = [...new Set(emails.map(e => e.toLowerCase().trim()))];
  
  // Filter out suspicious/common false positives
  const filtered = uniqueEmails.filter(e => {
    const badPatterns = ['noreply', 'no-reply', 'donotreply', 'example', 'domain', 'test@', 'admin@localhost'];
    return !badPatterns.some(bad => e.includes(bad)) && e.includes('@') && e.includes('.');
  });
  
  return filtered.slice(0, 10); // Return top 10
}

// Verify email format (basic regex)
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}