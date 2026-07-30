import { NextRequest, NextResponse } from "next/server";

const DISPOSABLE_DOMAINS = new Set([
  "tempmail.com","throwaway.com","mailinator.com","guerrillamail.com",
  "yopmail.com","sharklasers.com","getairmail.com","burnermail.io",
  "temp-mail.org","fakeinbox.com","mailnesia.com","tempinbox.com",
  "10minutemail.com","maildrop.cc","harakirimail.com"
]);

const ROLE_PREFIXES = [
  "noreply","no-reply","support","help","sales","marketing","team",
  "press","media","privacy","legal","abuse","webmaster","admin",
  "billing","careers","jobs","newsletter","updates","notifications",
  "alerts","feedback","service","orders","shipping","returns",
  "customerservice","enquiries","general","office","contactus",
  "getintouch","affiliates","partnerships","wholesale","advertising",
  "sponsorship","donotreply","user","name","first.last","john.doe",
  "root","system","robot","bot","auto","reply","bounces","list",
  "mailinglist","unsubscribe","subscribe","confirm","verify",
  "security","spam","junk","sitemap","cdn","assets","static",
  "img","images","css","js","script","dev","staging","github",
  "hostmaster","postmaster","usenet","news","www","mail"
];

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ valid: false, reason: "missing" }, { status: 400 });
    }

    const lower = email.toLowerCase().trim();

    // Format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(lower)) {
      return NextResponse.json({ valid: false, reason: "format" });
    }

    const parts = lower.split("@");
    const local = parts[0];
    const domain = parts[1];

    if (!domain) {
      return NextResponse.json({ valid: false, reason: "domain" });
    }

    // Disposable domain check
    if (DISPOSABLE_DOMAINS.has(domain)) {
      return NextResponse.json({ valid: false, reason: "disposable" });
    }

    // Role-based check
    if (ROLE_PREFIXES.some((p) => local === p || local.startsWith(p + "."))) {
      return NextResponse.json({ valid: false, reason: "role-based" });
    }

    // MX record check via Google DNS
    try {
      const res = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`, {
        signal: AbortSignal.timeout(5000)
      });
      const data = await res.json();
      if (!data.Answer || data.Answer.length === 0) {
        return NextResponse.json({ valid: false, reason: "no-mx" });
      }
    } catch {
      return NextResponse.json({ valid: false, reason: "dns-error" });
    }

    return NextResponse.json({ valid: true, reason: "ok" });
  } catch {
    return NextResponse.json({ valid: false, reason: "error" }, { status: 500 });
  }
}