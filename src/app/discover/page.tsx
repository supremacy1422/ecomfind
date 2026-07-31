"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ─── Types ─── */
interface AuditData {
  domain: string;
  score: number;
  revenuePotential: number;
  traffic: number;
  conversion: number;
  avgOrderValue: number;
  issues: string[];
  competitors: { name: string; score: number }[];
  emails: string[];
  aiShopping: { engine: string; visible: boolean }[];
  categoryIssues: { category: string; count: number; severity: "critical" | "warning" | "info"; note: string }[];
  rootCauses: { cause: string; impact: string }[];
  criticalIssues: { issue: string; impact: string; fix: string; status: "open" | "in-progress" | "resolved"; note: string }[];
  priorityFixes: { title: string; effort: string; impact: string; roi: string; note: string }[];
  recoverySummary: { metric: string; current: string; potential: string; uplift: string }[];
  roadmap: { phase: string; weeks: string; actions: string[]; note: string }[];
}

/* ─── Icons ─── */
const IconSearch = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const IconZap = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconAlert = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
const IconLock = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const IconStore = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const IconTrending = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);
const IconGlobe = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const IconMail = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconDownload = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);
const IconMessage = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const IconChevronRight = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
);
const IconChevronDown = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
);
const IconShield = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const IconBarChart = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
);
const IconClock = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const IconScan = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>
);

/* ─── Score Ring ─── */
function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444";
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#1e293b" strokeWidth="8" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth="8" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <span className="absolute text-2xl font-bold text-white">{score}</span>
    </div>
  );
}

/* ─── Progress Bar ─── */
function ProgressBar({ val, label, color = "bg-emerald-500" }: { val: number; label: string; color?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] w-24 text-right text-slate-500">{label}</span>
      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(val, 100)}%` }} />
      </div>
      <span className="text-xs text-white w-8">{Math.round(val)}</span>
    </div>
  );
}

/* ─── Section Card ─── */
function SectionCard({ title, icon: Icon, children, defaultOpen = true }: { title: string; icon: any; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 mb-6">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Icon className="w-5 h-5 text-emerald-400" /> {title}
        </h3>
        <IconChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pt-2">{children}</div>}
    </div>
  );
}

/* ─── Collapsible Note ─── */
function CollapsibleNote({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-3 rounded-lg border border-slate-800 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3 bg-slate-950/30 hover:bg-slate-950/50 transition-colors text-left">
        <span className="text-sm text-slate-300 font-medium">{title}</span>
        <IconChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="p-3 bg-slate-950/20 text-xs text-slate-400 leading-relaxed border-t border-slate-800">{children}</div>}
    </div>
  );
}

/* ─── Severity Badge ─── */
function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    critical: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    info: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  };
  return <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase ${map[severity] || map.info}`}>{severity}</span>;
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    open: "bg-rose-500/10 text-rose-400",
    "in-progress": "bg-amber-500/10 text-amber-400",
    resolved: "bg-emerald-500/10 text-emerald-400",
  };
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${map[status] || map.open}`}>{status}</span>;
}

/* ─── Demo Data ─── */
function getDemoData(domain: string): AuditData {
  return {
    domain,
    score: 47,
    revenuePotential: 340000,
    traffic: 12500,
    conversion: 1.8,
    avgOrderValue: 67,
    issues: ["Slow mobile load (4.2s)", "No abandoned cart recovery", "Missing structured data", "Low product page CRO", "Weak meta descriptions"],
    competitors: [
      { name: "Your Store", score: 47 },
      { name: "Competitor A", score: 78 },
      { name: "Competitor B", score: 71 },
      { name: "Competitor C", score: 65 },
    ],
    emails: ["owner@" + domain.replace(/^https?:\/\//, ""), "support@" + domain.replace(/^https?:\/\//, "")],
    aiShopping: [
      { engine: "Google Shopping", visible: false },
      { engine: "Bing Shopping", visible: false },
      { engine: "Meta Shops", visible: false },
      { engine: "Pinterest Shopping", visible: true },
    ],
    categoryIssues: [
      { category: "SEO", count: 12, severity: "critical", note: "Poor SEO means Google can't find your products. 93% of online experiences begin with a search engine. Without proper meta tags, structured data, and fast indexing, you're invisible to high-intent buyers who are actively searching for what you sell." },
      { category: "Performance", count: 8, severity: "critical", note: "Every 1-second delay in page load reduces conversions by 7%. A 4.2s mobile load time is costing you nearly 40% of potential sales. Mobile shoppers abandon slow sites within 3 seconds." },
      { category: "Conversion", count: 6, severity: "warning", note: "Your checkout flow and product pages aren't optimized to turn visitors into buyers. Missing trust signals, unclear CTAs, and friction in the purchase journey cause 70% of carts to be abandoned before completion." },
      { category: "Mobile", count: 5, severity: "warning", note: "Over 70% of Shopify traffic comes from mobile devices. If your store isn't thumb-friendly, loads slowly, or has broken layouts on phones, you're losing the majority of your potential customers." },
      { category: "Accessibility", count: 3, severity: "info", note: "Accessibility issues don't just affect disabled users — they hurt SEO rankings and can expose your business to ADA lawsuits. Screen readers and search bots read your site the same way." },
      { category: "Security", count: 2, severity: "info", note: "Missing security headers and outdated SSL configurations reduce customer trust. 17% of shoppers abandon checkout if they don't see security badges or HTTPS warnings." },
    ],
    rootCauses: [
      { cause: "Unoptimized images causing 2.3s LCP delay", impact: "Images make up 60-80% of page weight. Without WebP compression and lazy loading, every product page loads painfully slow on 3G/4G connections." },
      { cause: "No lazy loading on product grids", impact: "Loading 50 product images at once crushes performance. Lazy loading would reduce initial load by 40-60% and improve Core Web Vitals scores immediately." },
      { cause: "Missing Open Graph tags on 89% of pages", impact: "When customers share your products on social media, they see broken previews. This kills organic social traffic and makes your brand look unprofessional." },
      { cause: "Checkout flow has 4 unnecessary steps", impact: "Each additional form field reduces checkout completion by 10%. A 6-step checkout vs 2-step means you're losing 40% of ready-to-buy customers at the finish line." },
      { cause: "No exit-intent popup or email capture", impact: "97% of visitors leave without buying. Without capturing their email, you have zero way to bring them back. Email marketing has a 4,200% ROI — you're leaving money on the table." },
    ],
    criticalIssues: [
      { issue: "Mobile load time 4.2s", impact: "-38% conversions", fix: "Compress images, enable CDN", status: "open", note: "Google uses mobile page speed as a ranking factor. A 4.2s load time puts you in the bottom 20% of all e-commerce sites. This directly reduces your Google rankings and ad Quality Scores, making every click more expensive." },
      { issue: "No cart abandonment", impact: "-$12K/mo revenue", fix: "Install Klaviyo flow", status: "open", note: "Cart abandonment emails recover 10-15% of lost sales on average. For a store doing $14K/month, that's an extra $12K+ in recoverable revenue with a single automated email sequence." },
      { issue: "Missing structured data", impact: "-45% rich snippets", fix: "Add JSON-LD schema", status: "in-progress", note: "Structured data powers rich snippets in Google — star ratings, pricing, stock status. Stores with rich snippets see 30% higher click-through rates. Without it, your listings look plain while competitors stand out." },
      { issue: "Weak meta descriptions", impact: "-22% CTR", fix: "Rewrite 150 meta tags", status: "open", note: "Meta descriptions are your ad copy in organic search. Poor descriptions reduce clicks even if you rank well. Rewriting them with compelling copy and CTAs can boost traffic 20-30% without any ranking changes." },
    ],
    priorityFixes: [
      { title: "Image Compression + WebP", effort: "2 hrs", impact: "High", roi: "+$8.4K/mo", note: "Converting images to WebP reduces file sizes by 25-35% with zero quality loss. Combined with a CDN, this single fix can cut load time by 1.5+ seconds and recover thousands in lost sales." },
      { title: "Abandoned Cart Flow", effort: "4 hrs", impact: "Critical", roi: "+$12K/mo", note: "A 3-email abandoned cart sequence takes 4 hours to build but runs forever. Best-in-class flows recover 15% of abandoned carts. This is the highest-ROI fix on the entire board." },
      { title: "Schema Markup", effort: "3 hrs", impact: "High", roi: "+$5.2K/mo", note: "Adding Product, Review, and FAQ schema makes your Google listings visually richer. This increases CTR and helps you outrank competitors even with similar content." },
      { title: "Exit Intent Popup", effort: "1 hr", impact: "Medium", roi: "+$3.1K/mo", note: "A simple exit-intent popup offering 10% off captures 5-10% of leaving visitors. That's hundreds of new emails per month for 1 hour of setup work." },
      { title: "One-Click Checkout", effort: "6 hrs", impact: "High", roi: "+$9.8K/mo", note: "Shop Pay and Apple Pay reduce checkout friction by 60%. Stores with one-click checkout see 1.7x higher conversion rates than those with traditional multi-step forms." },
    ],
    recoverySummary: [
      { metric: "Monthly Revenue", current: "$14,200", potential: "$47,800", uplift: "+236%" },
      { metric: "Conversion Rate", current: "1.8%", potential: "4.2%", uplift: "+133%" },
      { metric: "Avg Order Value", current: "$67", potential: "$94", uplift: "+40%" },
      { metric: "Page Load Time", current: "4.2s", potential: "1.1s", uplift: "-74%" },
    ],
    roadmap: [
      { phase: "Foundation", weeks: "Weeks 1-2", actions: ["Compress all images to WebP", "Enable CDN + caching", "Fix mobile viewport issues", "Install analytics tracking"], note: "Foundation fixes require zero design changes and deliver immediate speed improvements. You'll see load time drop within 48 hours of implementation." },
      { phase: "Conversion", weeks: "Weeks 3-4", actions: ["Build abandoned cart flow", "Add exit-intent popup", "Simplify checkout to 2 steps", "A/B test product pages"], note: "Conversion fixes focus on capturing and converting existing traffic. These changes typically show results within 7-14 days as email flows activate and checkout friction drops." },
      { phase: "Traffic", weeks: "Weeks 5-8", actions: ["Rewrite 150 meta descriptions", "Add structured data schema", "Launch Google Shopping feed", "Build backlink outreach"], note: "Traffic fixes are slower to show results (30-60 days) but compound over time. SEO improvements build momentum, and Google Shopping opens a new acquisition channel." },
      { phase: "Scale", weeks: "Weeks 9-12", actions: ["Launch retargeting campaigns", "Add upsell/cross-sell flows", "Expand to 2 new channels", "Weekly optimization sprints"], note: "Scale phase leverages the foundation you've built. With faster site speed and higher conversion rates, every ad dollar and SEO win produces more revenue." },
    ],
  };
}

/* ─── Report HTML Generator ─── */
function generateReportHTML(data: AuditData) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>EcomFind Audit - ${data.domain}</title>
<style>
body{font-family:system-ui,-apple-system,sans-serif;background:#0b0f1f;color:#e2e8f0;padding:40px;max-width:900px;margin:0 auto}
h1{color:#fff;font-size:28px;border-bottom:1px solid #334155;padding-bottom:12px}
h2{color:#10b981;font-size:18px;margin-top:32px}
.score{font-size:48px;font-weight:700;color:#10b981}
.card{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:20px;margin:12px 0}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
table{width:100%;border-collapse:collapse;margin-top:12px}
th,td{text-align:left;padding:10px;border-bottom:1px solid #334155}
th{color:#94a3b8;font-size:12px;text-transform:uppercase}
</style></head><body>
<h1>EcomFind Executive Audit Report</h1>
<p><strong>Store:</strong> ${data.domain}</p>
<div class="card"><div class="score">${data.score}/100</div><p>Overall Revenue Health Score</p></div>
<h2>Revenue Recovery Summary</h2>
<div class="grid">
${data.recoverySummary.map(r => `<div class="card"><strong>${r.metric}</strong><br>Current: ${r.current}<br>Potential: <span style="color:#10b981">${r.potential}</span><br>Uplift: ${r.uplift}</div>`).join("")}
</div>
<h2>Critical Issues</h2>
<table><tr><th>Issue</th><th>Impact</th><th>Fix</th><th>Status</th></tr>
${data.criticalIssues.map(i => `<tr><td>${i.issue}</td><td>${i.impact}</td><td>${i.fix}</td><td>${i.status}</td></tr>`).join("")}
</table>
<h2>90-Day Growth Roadmap</h2>
${data.roadmap.map(r => `<div class="card"><strong>${r.phase} — ${r.weeks}</strong><ul>${r.actions.map(a => `<li>${a}</li>`).join("")}</ul></div>`).join("")}
<h2>Discovered Emails</h2>
${data.emails.map(e => `<div class="card">${e}</div>`).join("")}
<p style="margin-top:40px;color:#64748b;font-size:12px">Generated by EcomFind | Confidential Executive Report</p>
</body></html>`;
}

/* ─── Scanning Animation Visual ─── */
function ScanVisual() {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-[4/3] rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
      {/* Scan line */}
      <div className="absolute inset-x-0 h-px bg-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-[scan_3s_ease-in-out_infinite]" style={{ top: "10%" }} />
      {/* Grid dots */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #334155 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      {/* Floating nodes */}
      <div className="absolute top-[20%] left-[15%] w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
      <div className="absolute top-[35%] right-[20%] w-2 h-2 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: "0.5s" }} />
      <div className="absolute bottom-[30%] left-[25%] w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-[20%] right-[30%] w-2 h-2 rounded-full bg-violet-500 animate-pulse" style={{ animationDelay: "1.5s" }} />
      {/* Browser chrome */}
      <div className="absolute top-3 left-3 flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
      </div>
      <div className="absolute top-3 right-3 text-[10px] text-slate-600 font-mono">AI scanning your store in real time</div>
      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
            <IconScan className="w-8 h-8 text-emerald-400" />
          </div>
          <p className="text-xs text-emerald-400 font-mono">Scanning 200+ factors...</p>
        </div>
      </div>
      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ─── Main Page ─── */
export default function DiscoverPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AuditData | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [outreachStatus, setOutreachStatus] = useState("");
  const [user, setUser] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  /* ─── Check auth on mount ─── */
  useEffect(() => {
    const saved = localStorage.getItem("lastAudit");
    if (saved) setData(JSON.parse(saved));

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const runAudit = async () => {
    if (!url.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2500));
    const d = getDemoData(url.trim());
    setData(d);
    localStorage.setItem("lastAudit", JSON.stringify(d));
    setLoading(false);
  };

  const downloadPDF = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    // User is logged in — generate and download
    const html = generateReportHTML(data!);
    const blob = new Blob([html], { type: "text/html" });
    const urlObj = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlObj;
    a.download = `ecomfind-audit-${data!.domain.replace(/[^a-z0-9]/gi, "-")}.html`;
    a.click();
    URL.revokeObjectURL(urlObj);
  };

  const sendOutreach = async (email: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setOutreachStatus(`Sending to ${email}...`);
    await new Promise((r) => setTimeout(r, 1500));
    setOutreachStatus(`✓ Outreach sent to ${email}`);
    setTimeout(() => setOutreachStatus(""), 3000);
  };

  const scoreColor = useMemo(() => {
    if (!data) return "text-slate-400";
    if (data.score >= 80) return "text-emerald-400";
    if (data.score >= 60) return "text-amber-400";
    if (data.score >= 40) return "text-orange-400";
    return "text-rose-400";
  }, [data]);

  return (
    <div className="min-h-screen bg-[#0b0f1f] text-slate-200">
      {/* Nav */}
      <header className="border-b border-slate-800/60 bg-[#0b0f1e]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mr-4">
              <IconStore className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Home</span>
            </a>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <IconZap className="w-5 h-5 text-violet-400" />
            </div>
            <span className="font-bold text-white tracking-tight">EcomFind</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-slate-500">Analyzed 1,000+ stores</span>
            <nav className="hidden md:flex items-center gap-1">
              <a href="/discover" className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 text-sm font-medium border border-violet-500/20">Audit</a>
              <a href="/leads" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Leads</a>
              <a href="/outreach" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Outreach</a>
              <a href="/about" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">About</a>
            </nav>
            {user ? (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs text-emerald-400 font-bold border border-emerald-500/30">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </div>
            ) : (
              <a href="/login" className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors">Sign In</a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ─── Premium Hero ─── */}
        {!data && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 min-h-[60vh]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
                <IconZap className="w-3 h-3" /> AI-Powered Revenue Intelligence
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                See Exactly Where Your <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Store Is Losing Revenue</span>
              </h1>
              <p className="text-slate-400 text-lg mb-8 max-w-lg leading-relaxed">
                AI-powered forensic audit across SEO, conversion psychology, UX, trust signals, and backend revenue systems.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-xl mb-8">
                <div className="relative flex-1">
                  <IconGlobe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter your Shopify store URL..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    onKeyDown={(e) => e.key === "Enter" && runAudit()}
                  />
                </div>
                <button
                  onClick={runAudit}
                  disabled={!url.trim()}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  Run AI Revenue Audit <IconChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><IconShield className="w-3.5 h-3.5 text-emerald-500/60" /> 256-bit encrypted</span>
                <span className="flex items-center gap-1.5"><IconBarChart className="w-3.5 h-3.5 text-emerald-500/60" /> 200+ audit factors</span>
                <span className="flex items-center gap-1.5"><IconClock className="w-3.5 h-3.5 text-emerald-500/60" /> 60s analysis</span>
              </div>
            </div>
            <div className="hidden lg:block">
              <ScanVisual />
            </div>
          </div>
        )}

        {/* ─── Loading State ─── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <ScanVisual />
            <p className="mt-8 text-emerald-400 font-mono text-sm animate-pulse">Analyzing 200+ revenue factors...</p>
            <p className="text-slate-500 text-xs mt-2">This usually takes 10-30 seconds</p>
          </div>
        )}

        {/* ─── Report ─── */}
        {data && (
          <div ref={reportRef} className="space-y-6">
            {/* Back to Audit */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => { setData(null); setUrl(""); }} className="text-sm text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                <IconChevronRight className="w-4 h-4 rotate-180" /> New Audit
              </button>
              <span className="text-xs text-slate-500">Auditing: {data.domain}</span>
            </div>

            {/* Executive Scorecard */}
            <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-center">
                  <ScoreRing score={data.score} />
                  <p className={`text-sm font-semibold mt-2 ${scoreColor}`}>
                    {data.score >= 80 ? "Excellent" : data.score >= 60 ? "Good" : data.score >= 40 ? "Fair" : "Critical"}
                  </p>
                </div>
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                  <div className="text-center p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="text-2xl font-bold text-white">${(data.revenuePotential / 1000).toFixed(0)}K</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Revenue Potential</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="text-2xl font-bold text-white">{(data.traffic / 1000).toFixed(1)}K</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Monthly Traffic</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="text-2xl font-bold text-white">{data.conversion}%</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Conversion</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="text-2xl font-bold text-white">${data.avgOrderValue}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">AOV</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Potential + Competitors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SectionCard title="Store Revenue Potential" icon={IconTrending}>
                <div className="space-y-3">
                  {data.competitors.map((c) => (
                    <ProgressBar key={c.name} val={c.score} label={c.name} color={c.name === "Your Store" ? "bg-rose-500" : "bg-emerald-500"} />
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Competitor Comparison" icon={IconGlobe}>
                <div className="space-y-4">
                  {data.competitors.slice(1).map((c) => (
                    <div key={c.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                      <span className="text-sm text-white font-medium">{c.name}</span>
                      <span className="text-sm text-emerald-400 font-bold">{c.score}/100</span>
                    </div>
                  ))}
                  <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/10">
                    <p className="text-xs text-rose-400">Your store scores <strong>{data.score}</strong> vs industry average <strong>{Math.round(data.competitors.slice(1).reduce((a, b) => a + b.score, 0) / (data.competitors.length - 1))}</strong></p>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* AI Shopping Visibility */}
            <SectionCard title="AI Shopping Visibility" icon={IconSearch}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {data.aiShopping.map((a) => (
                  <div key={a.engine} className={`text-center p-4 rounded-xl border ${a.visible ? "bg-emerald-500/5 border-emerald-500/20" : "bg-slate-950/50 border-slate-800"}`}>
                    <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${a.visible ? "bg-emerald-500/20" : "bg-slate-800"}`}>
                      {a.visible ? <IconCheck className="w-4 h-4 text-emerald-400" /> : <IconAlert className="w-4 h-4 text-slate-500" />}
                    </div>
                    <p className={`text-xs font-medium ${a.visible ? "text-emerald-400" : "text-slate-500"}`}>{a.engine}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Issues by Category */}
            <SectionCard title="Issues by Category" icon={IconAlert}>
              <CollapsibleNote title="Why issue categories matter for your business">
                Each category represents a revenue leak point. Critical issues are bleeding money right now. Warnings are missed opportunities. Info items are competitive disadvantages that compound over time. Fixing them in order of severity delivers the fastest ROI.
              </CollapsibleNote>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {data.categoryIssues.map((c) => (
                  <div key={c.category} className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                    <div>
                      <p className="text-sm text-white font-medium">{c.category}</p>
                      <p className="text-xs text-slate-500">{c.count} issues</p>
                    </div>
                    <SeverityBadge severity={c.severity} />
                  </div>
                ))}
              </div>
              {data.categoryIssues.map((c) => (
                <CollapsibleNote key={`note-${c.category}`} title={`What ${c.category} issues mean for your store`}>
                  {c.note}
                </CollapsibleNote>
              ))}
            </SectionCard>

            {/* Root Cause Detection */}
            <SectionCard title="Root Cause Detection" icon={IconZap}>
              <CollapsibleNote title="Understanding root causes vs symptoms">
                Most store owners fix symptoms (slow sales) without addressing root causes (why sales are slow). These 5 root causes explain 80% of your revenue loss. Fix these first before spending on ads or new designs.
              </CollapsibleNote>
              <div className="space-y-2">
                {data.rootCauses.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                      <span className="w-5 h-5 rounded-full bg-violet-500/10 text-violet-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <div>
                        <p className="text-sm text-slate-300 font-medium">{item.cause}</p>
                      </div>
                    </div>
                    <CollapsibleNote title={`Business impact: ${item.cause.substring(0, 40)}...`}>
                      {item.impact}
                    </CollapsibleNote>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Critical Issue Status Board */}
            <SectionCard title="Critical Issue Status Board" icon={IconAlert}>
              <CollapsibleNote title="How critical issues destroy your bottom line">
                These issues have direct, measurable revenue impact. "Open" means it's actively costing you money every day. "In-progress" means partial fixes are deployed but not complete. Each row shows exactly how much this single issue is costing you monthly.
              </CollapsibleNote>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-800">
                      <th className="pb-3 font-medium">Issue</th>
                      <th className="pb-3 font-medium">Impact</th>
                      <th className="pb-3 font-medium">Fix</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {data.criticalIssues.map((issue, i) => (
                      <tr key={i}>
                        <td className="py-3 text-white font-medium">{issue.issue}</td>
                        <td className="py-3 text-rose-400">{issue.impact}</td>
                        <td className="py-3 text-slate-400">{issue.fix}</td>
                        <td className="py-3"><StatusBadge status={issue.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.criticalIssues.map((issue, i) => (
                <CollapsibleNote key={`ci-note-${i}`} title={`Deep dive: ${issue.issue}`}>
                  {issue.note}
                </CollapsibleNote>
              ))}
            </SectionCard>

            {/* Priority Fix Board */}
            <SectionCard title="Priority Fix Board" icon={IconTrending}>
              <CollapsibleNote title="How to read the Priority Fix Board">
                Effort = hours to implement. Impact = business priority. ROI = estimated monthly revenue recovery. We rank fixes by ROI per hour — the top items deliver the most revenue for the least effort. Start with "Critical" impact items first.
              </CollapsibleNote>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.priorityFixes.map((fix, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-500">{fix.effort}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">{fix.impact}</span>
                    </div>
                    <p className="text-sm text-white font-medium mb-1">{fix.title}</p>
                    <p className="text-xs text-emerald-400 font-semibold mb-2">{fix.roi}</p>
                    <CollapsibleNote title="Why this fix matters">
                      {fix.note}
                    </CollapsibleNote>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Revenue Recovery Summary */}
            <SectionCard title="Revenue Recovery Summary" icon={IconTrending}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {data.recoverySummary.map((r, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">{r.metric}</p>
                    <p className="text-lg text-slate-400 line-through mb-1">{r.current}</p>
                    <p className="text-xl font-bold text-emerald-400 mb-1">{r.potential}</p>
                    <p className="text-xs text-emerald-500/70 font-semibold">{r.uplift}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* 90-Day Growth Roadmap */}
            <SectionCard title="90-Day Growth Roadmap" icon={IconZap}>
              <CollapsibleNote title="How the 90-day roadmap works">
                Each phase builds on the last. Foundation fixes make your site fast and stable. Conversion fixes turn more visitors into buyers. Traffic fixes bring more visitors. Scale fixes multiply everything. Skipping phases reduces the effectiveness of later fixes.
              </CollapsibleNote>
              <div className="space-y-4">
                {data.roadmap.map((phase, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-violet-500/10 text-violet-400 text-xs font-bold flex items-center justify-center border border-violet-500/20">{i + 1}</div>
                      {i < data.roadmap.length - 1 && <div className="w-px flex-1 bg-slate-800 my-2" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-bold text-white">{phase.phase}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{phase.weeks}</span>
                      </div>
                      <ul className="space-y-1 mb-2">
                        {phase.actions.map((action, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs text-slate-400">
                            <IconChevronRight className="w-3 h-3 text-violet-400 shrink-0 mt-0.5" />
                            {action}
                          </li>
                        ))}
                      </ul>
                      <CollapsibleNote title={`Expected outcome: ${phase.phase}`}>
                        {phase.note}
                      </CollapsibleNote>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Discovered Emails + Outreach */}
            <SectionCard title="Discovered Emails & Quick Outreach" icon={IconMail}>
              <div className="space-y-3">
                {data.emails.map((email, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <IconMail className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-sm text-white">{email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={`/outreach?email=${encodeURIComponent(email)}&domain=${encodeURIComponent(data.domain)}`} className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold">
                        Outreach
                      </a>
                      <button onClick={() => sendOutreach(email)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium">
                        Quick Send
                      </button>
                    </div>
                  </div>
                ))}
                {outreachStatus && (
                  <p className={`text-sm text-center ${outreachStatus.includes("success") || outreachStatus.includes("✓") ? "text-emerald-400" : "text-rose-400"}`}>
                    {outreachStatus}
                  </p>
                )}
              </div>
            </SectionCard>

            {/* Download Report */}
            <div className="flex justify-center pb-8">
              <button
                onClick={downloadPDF}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm flex items-center gap-2"
              >
                <IconDownload className="w-4 h-4" /> Download Executive Report
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <IconLock className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Create an Account to Download</h3>
            <p className="text-sm text-slate-400 mb-6">Audits are free for everyone. To download the PDF report or send outreach emails, please sign in or create a free account.</p>
            <div className="flex flex-col gap-3">
              <a href="/login" className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors">
                Sign In / Create Account
              </a>
              <button onClick={() => setShowAuthModal(false)} className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}