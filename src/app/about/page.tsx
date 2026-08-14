"use client";

import React from "react";

/* ─── Icons ─── */
const IconGlobe = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const IconShield = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const IconBarChart = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
);
const IconUsers = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IconTrending = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);
const IconChevronRight = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
);

const values = [
  {
    icon: IconGlobe,
    title: "Global Reach",
    desc: "We index Shopify stores across 80+ countries so agencies can find high-intent clients anywhere on earth.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: IconBarChart,
    title: "Data-First",
    desc: "Every insight is backed by live Google PageSpeed data, real revenue projections, and competitive benchmarking.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: IconShield,
    title: "Privacy by Design",
    desc: "256-bit encryption, zero third-party tracking pixels, and full GDPR compliance out of the box.",
    color: "text-sky-400",
    bg: "bg-sky-500/10 border-sky-500/20",
  },
  {
    icon: IconUsers,
    title: "Built for Agencies",
    desc: "We don't sell to store owners — we arm agencies with the intelligence they need to close more retainers.",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
];

const stats = [
  { label: "Countries Covered", value: "80+" },
  { label: "Audit Factors", value: "200+" },
  { label: "Avg. Audit Time", value: "60s" },
  { label: "Uptime", value: "99.9%" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0b0f1f] text-slate-200">
      {/* Nav */}
      <header className="border-b border-slate-800/60 bg-[#0b0f1e]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img 
              src="/ecomfind_logo_light.png" 
              alt="EcomFind" 
              className="h-8 w-auto"
            />
          </a>
          <nav className="hidden md:flex items-center gap-1">
            <a href="/discover" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Audit</a>
            <a href="/leads" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Leads</a>
            <a href="/outreach" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Outreach</a>
            <a href="/bulk-outreach" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Bulk</a>
            <a href="/gmail-connections" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Gmail</a>
            <a href="/follow-ups" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Follow-ups</a>
            <a href="/dashboard" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Dashboard</a>
            <a href="/about" className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 text-sm font-medium border border-violet-500/20">About</a>
            <a href="/founder" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Founder</a>
          </nav>
          <a href="/login" className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-lg transition-colors">
            Sign In
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-6">
              <IconTrending className="w-3 h-3" /> About EcomFind
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Revenue Intelligence <br />
              <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">for E-Commerce Agencies</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              EcomFind helps agencies discover high-intent Shopify stores, audit their revenue health with live Google data, and close deals faster with automated outreach.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-slate-800/60 bg-slate-900/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Most e-commerce agencies waste hours manually prospecting on Google, guessing which stores need help, and writing cold emails into the void. We built EcomFind to eliminate that friction — giving every agency instant access to store intelligence that used to require expensive tools and manual research.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed">
              Whether you run a solo consultancy or a 50-person growth team, EcomFind turns raw store data into actionable pipeline in under 60 seconds.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 lg:py-28 border-t border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">What we believe</h2>
              <p className="text-slate-400">The principles that guide every feature we ship.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((v) => (
                <div key={v.title} className="rounded-2xl bg-slate-900/40 border border-slate-800 p-8 hover:border-slate-700 transition-colors">
                  <div className={`w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center mb-6`}>
                    <v.icon className={`w-6 h-6 ${v.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{v.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 lg:py-28 border-t border-slate-800/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How EcomFind works</h2>
              <p className="text-slate-400">Three simple steps from discovery to closed deal.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { num: "01", title: "Discover", desc: "Search our global index of Shopify stores across 80+ countries. Filter by industry, product count, and launch date." },
                { num: "02", title: "Audit", desc: "Run a live PageSpeed + tech audit on any store. Get a 200-factor executive report with revenue impact and competitor benchmarks." },
                { num: "03", title: "Close", desc: "Import leads, track outreach in the activity log, and move prospects from new → contacted → won with AI templates." },
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="text-5xl font-bold text-slate-800 mb-4">{step.num}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28 border-t border-slate-800/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Start finding clients today</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">Join agencies using EcomFind to discover high-intent Shopify stores and close them with data-driven audits.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/discover" className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                Run Free Audit <IconChevronRight className="w-4 h-4" />
              </a>
              <a href="/leads" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                Browse Lead Database <IconGlobe className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-[#0b0f1e] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img src="/ecomfind_logo_light.png" alt="EcomFind" className="h-6 w-auto" />
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
                <li><a href="/founder" className="text-sm text-slate-400 hover:text-white transition-colors">Founder</a></li>
                <li><a href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Sign In</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-sm text-slate-500 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><span className="text-sm text-slate-500">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">© 2026 EcomFind. All rights reserved.</p>
            <span className="text-xs text-slate-600 flex items-center gap-1.5">
              <IconTrending className="w-3 h-3" /> Built for agency growth
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}