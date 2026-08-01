"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ─── Icons ─── */
const IconZap = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconSearch = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const IconGlobe = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const IconMail = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconBarChart = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
);
const IconShield = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconChevronRight = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
);
const IconUsers = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IconTrending = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);
const IconClock = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const IconMessage = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const IconStore = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const IconSparkles = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

/* ─── Animated Counter ─── */
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function HomePage() {
  const router = useRouter();
  const [auditUrl, setAuditUrl] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const features = [
    {
      icon: IconSearch,
      title: "AI Store Audit",
      desc: "Run live PageSpeed + tech analysis on any Shopify store. Get a 200-factor executive report with revenue impact in 60 seconds.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      href: "/discover",
    },
    {
      icon: IconGlobe,
      title: "Global Lead Engine",
      desc: "Search 80+ profitable countries. Filter by industry, product count, and launch date. Import validated leads with one click.",
      color: "text-violet-400",
      bg: "bg-violet-500/10 border-violet-500/20",
      href: "/leads",
    },
    {
      icon: IconMessage,
      title: "Outreach Studio",
      desc: "AI templates, scheduled sends, and activity tracking. Pre-fill emails from any lead card and close deals faster.",
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
      href: "/outreach",
    },
  ];

  const steps = [
    { num: "01", title: "Audit Any Store", desc: "Paste a domain and get a real-time PageSpeed + revenue health report with actionable fixes." },
    { num: "02", title: "Discover Leads", desc: "Search our curated index of 80+ countries. Filter by industry, size, and date to find high-intent stores." },
    { num: "03", title: "Close Deals", desc: "Import leads, track outreach in the activity log, and move prospects from new → contacted → won." },
  ];

  const stats = [
    { label: "Stores Audited", value: 1247, suffix: "+" },
    { label: "Countries Covered", value: 80, suffix: "" },
    { label: "Avg Revenue Uplift", value: 236, suffix: "%" },
    { label: "Leads Generated", value: 8900, suffix: "+" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f1f] text-slate-200 overflow-x-hidden">
      {/* ─── Nav ─── */}
      <header className="border-b border-slate-800/60 bg-[#0b0f1e]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <IconZap className="w-5 h-5 text-violet-400" />
            </div>
            <span className="font-bold text-white tracking-tight text-lg">EcomFind</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <a href="/discover" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Audit</a>
            <a href="/leads" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Leads</a>
            <a href="/outreach" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Outreach</a>
            <a href="/about" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">About</a>
            <a href="/founder" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Founder</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href="/login" className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">Sign In</a>
            <a href="/discover" className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-lg transition-colors">
              Start Auditing
            </a>
          </div>

          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>

        {mobileMenu && (
          <div className="md:hidden border-t border-slate-800 bg-[#0b0f1e]/95 px-4 py-4 space-y-2">
            <a href="/discover" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 text-sm">Audit</a>
            <a href="/leads" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 text-sm">Leads</a>
            <a href="/outreach" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 text-sm">Outreach</a>
            <a href="/about" className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 text-sm">About</a>
            <div className="pt-2 border-t border-slate-800 flex gap-3">
              <a href="/login" className="flex-1 text-center py-2 text-sm text-slate-300 border border-slate-700 rounded-lg">Sign In</a>
              <a href="/discover" className="flex-1 text-center py-2 text-sm bg-violet-600 text-white rounded-lg font-semibold">Start Auditing</a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* ─── Hero ─── */}
        <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-6">
                <IconSparkles className="w-3 h-3" /> Now with live Google PageSpeed integration
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                Find & Convert <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-emerald-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">High-Intent Shopify Stores</span>
              </h1>
              <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                AI-powered audits, global lead discovery across 80+ markets, and automated outreach — all in one platform built for e-commerce agencies.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto mb-8">
                <div className="relative flex-1">
                  <IconGlobe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    value={auditUrl}
                    onChange={(e) => setAuditUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && auditUrl && router.push(`/discover?url=${encodeURIComponent(auditUrl)}`)}
                    placeholder="Enter a store domain to audit..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  />
                </div>
                <button
                  onClick={() => auditUrl && router.push(`/discover?url=${encodeURIComponent(auditUrl)}`)}
                  className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  Audit Now <IconChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><IconShield className="w-3.5 h-3.5 text-emerald-500/60" /> 256-bit encrypted</span>
                <span className="flex items-center gap-1.5"><IconBarChart className="w-3.5 h-3.5 text-emerald-500/60" /> Real Google data</span>
                <span className="flex items-center gap-1.5"><IconClock className="w-3.5 h-3.5 text-emerald-500/60" /> 60s analysis</span>
              </div>
            </div>

            {/* Hero visual / mockup */}
            <div className="max-w-5xl mx-auto">
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-1 shadow-2xl shadow-violet-500/5">
                <div className="rounded-xl bg-[#0f1429] border border-slate-800 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-950/50">
                    <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                    <span className="ml-3 text-[10px] text-slate-600 font-mono">ecomfind.com/discover</span>
                  </div>
                  <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-emerald-400">72</span>
                          <span className="text-[10px] text-slate-500 uppercase">Score</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">fashionnova.com</p>
                          <p className="text-xs text-slate-500">Shopify · Plus · 2.3s mobile load</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">WebP</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">Cloudflare</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">Klaviyo</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { label: "Perf", val: 68, color: "text-amber-400" },
                          { label: "A11y", val: 82, color: "text-emerald-400" },
                          { label: "BP", val: 79, color: "text-emerald-400" },
                          { label: "SEO", val: 91, color: "text-emerald-400" },
                        ].map((m) => (
                          <div key={m.label} className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 text-center">
                            <p className="text-[10px] text-slate-500 uppercase">{m.label}</p>
                            <p className={`text-sm font-bold ${m.color}`}>{m.val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                        <p className="text-[10px] text-slate-500 uppercase mb-1">Revenue Potential</p>
                        <p className="text-lg font-bold text-emerald-400">+$34K/mo</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                        <p className="text-[10px] text-slate-500 uppercase mb-1">Conversion Uplift</p>
                        <p className="text-lg font-bold text-violet-400">+133%</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                        <p className="text-[10px] text-slate-500 uppercase mb-1">Load Time Fix</p>
                        <p className="text-lg font-bold text-white">4.2s → 1.1s</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Stats Bar ─── */}
        <section className="border-y border-slate-800/60 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                    <Counter end={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features ─── */}
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything you need to find and close deals</h2>
              <p className="text-slate-400">From first audit to final outreach, EcomFind gives agencies a complete pipeline for e-commerce client acquisition.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f) => (
                <a
                  key={f.title}
                  href={f.href}
                  className="group rounded-2xl bg-slate-900/40 border border-slate-800 p-8 hover:border-slate-700 hover:bg-slate-900/60 transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-6`}>
                    <f.icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-violet-400 transition-colors">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">{f.desc}</p>
                  <span className="text-sm text-violet-400 font-medium flex items-center gap-1">
                    Explore <IconChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How It Works ─── */}
        <section className="py-24 lg:py-32 border-t border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">How it works</h2>
                <p className="text-slate-400 mb-10">Three steps from discovery to closed deal. No complicated setup, no credit card required to start.</p>

                <div className="space-y-8">
                  {steps.map((s, i) => (
                    <div key={i} className="flex gap-5">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-violet-500/10 text-violet-400 text-sm font-bold flex items-center justify-center border border-violet-500/20 shrink-0">
                          {s.num}
                        </div>
                        {i < steps.length - 1 && <div className="w-px flex-1 bg-slate-800 my-3" />}
                      </div>
                      <div className="pb-2">
                        <h4 className="text-base font-bold text-white mb-1">{s.title}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <a href="/discover" className="inline-flex items-center gap-2 mt-10 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-sm transition-colors">
                  Run Your First Audit <IconChevronRight className="w-4 h-4" />
                </a>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-violet-500/5 rounded-3xl blur-2xl" />
                <div className="relative rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <IconCheck className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Audit Complete</p>
                        <p className="text-xs text-slate-500">fashionnova.com — Score 72</p>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold">+$34K potential</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                        <IconUsers className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">12 Leads Imported</p>
                        <p className="text-xs text-slate-500">US · Fashion · 10-50 products</p>
                      </div>
                    </div>
                    <span className="text-xs text-violet-400 font-semibold">8 have emails</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <IconMail className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Outreach Scheduled</p>
                        <p className="text-xs text-slate-500">3 emails queued for tomorrow</p>
                      </div>
                    </div>
                    <span className="text-xs text-amber-400 font-semibold">Draft saved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-24 lg:py-32 border-t border-slate-800/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Ready to find your next client?</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">Join agencies using EcomFind to discover high-intent Shopify stores and close them with data-driven audits.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/discover" className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                Start Free Audit <IconChevronRight className="w-4 h-4" />
              </a>
              <a href="/leads" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                Browse Lead Database <IconGlobe className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-800/60 bg-[#0b0f1e] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <IconZap className="w-4 h-4 text-violet-400" />
                </div>
                <span className="font-bold text-white">EcomFind</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">AI-powered revenue intelligence for e-commerce agencies. Audit, discover, and close more Shopify clients.</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="/discover" className="text-sm text-slate-400 hover:text-white transition-colors">Audit</a></li>
                <li><a href="/leads" className="text-sm text-slate-400 hover:text-white transition-colors">Leads</a></li>
                <li><a href="/outreach" className="text-sm text-slate-400 hover:text-white transition-colors">Outreach</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">About</a></li>
                <li><a href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Sign In</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><span className="text-sm text-slate-500">Privacy Policy</span></li>
                <li><span className="text-sm text-slate-500">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">© 2026 EcomFind. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-600 flex items-center gap-1.5">
                <IconTrending className="w-3 h-3" /> Built for agency growth
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}