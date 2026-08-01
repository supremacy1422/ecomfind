"use client";

import React from "react";

/* ─── Icons ─── */
const IconZap = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconGlobe = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const IconMail = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconBriefcase = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);
const IconUsers = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IconTrending = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);
const IconTarget = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);
const IconAward = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
);
const IconChevronRight = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
);
const IconHeart = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
);
const IconShield = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

const stats = [
  { label: "Stores Audited", value: "2,400+" },
  { label: "Agencies Served", value: "180+" },
  { label: "Countries Reached", value: "40+" },
  { label: "Revenue Identified", value: "$14M+" },
];

const milestones = [
  { year: "2025", title: "Founded Supremacy Digital Marketing Agency", desc: "Started as a one-person consultancy helping businesses improve their online presence, generate leads, and increase sales through digital marketing." },
  { year: "2026", title: "Launched First AI-Powered SaaS Platform", desc: "Built and released our first software product focused on helping businesses improve their online visibility, automate processes, and scale faster." },
  { year: "2026", title: "Expanded Into AI Automation & Software Development", desc: "Grew the team and expanded services into AI automation, custom software development, and digital business solutions for companies worldwide." },
  { year: "Future", title: "Building the Future of Business Technology", desc: "Continuing to develop innovative SaaS products that simplify business operations, reduce manual work, and help entrepreneurs scale with confidence." },
];

export default function FounderPage() {
  return (
    <div className="min-h-screen bg-[#0b0f1f] text-slate-200">
      {/* ─── Nav ─── */}
      <header className="border-b border-slate-800/60 bg-[#0b0f1e]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <IconZap className="w-5 h-5 text-violet-400" />
            </div>
            <span className="font-bold text-white tracking-tight text-lg">EcomFind</span>
          </a>
          <nav className="hidden md:flex items-center gap-1">
            <a href="/discover" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Audit</a>
            <a href="/leads" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Leads</a>
            <a href="/outreach" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Outreach</a>
            <a href="/about" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">About</a>
            <a href="/founder" className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 text-sm font-medium border border-violet-500/20">Founder</a>
          </nav>
          <a href="/login" className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-lg transition-colors">Sign In</a>
        </div>
      </header>

      <main>
        {/* ─── Hero ─── */}
        <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
              <div className="lg:col-span-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-6">
                  <IconBriefcase className="w-3 h-3" /> The Agency Behind EcomFind
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  We Built the Tool <br />
                  <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">We Needed</span>
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-xl">
                  EcomFind was born inside a Shopify growth agency that was tired of manual prospecting. We built it to solve our own pain — then realized every agency had the same problem.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="mailto:supremacy1422@gmail.com" className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                    <IconMail className="w-4 h-4" /> Work With Us
                  </a>
                  <a href="/discover" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                    Try the Tool <IconChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="relative">
                  <div className="w-56 h-72 sm:w-64 sm:h-80 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/20 to-emerald-500/20 border border-slate-700 overflow-hidden">
                    <img 
                      src="/founder.jpg" 
                      alt="Oladoja Paul William" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 shadow-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs text-slate-300 font-medium">Available for projects</span>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <p className="text-base font-bold text-white">Oladoja Paul William</p>
                  <p className="text-xs text-slate-500">Founder & CEO</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Stats ─── */}
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

        {/* ─── Story ─── */}
        <section className="py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Why We Built This</h2>
                <div className="space-y-4 text-slate-400 leading-relaxed">
                  <p className="text-white font-medium">Every great product starts with a problem.</p>
                  <p>
                    As a software developer and digital marketer, I spent years helping businesses improve their online presence, generate leads, and increase sales. During that journey, I noticed that many businesses struggled not because they had poor products or services, but because they lacked the right technology, automation, and digital tools to grow efficiently.
                  </p>
                  <p>
                    I created this platform to bridge that gap.
                  </p>
                  <p>
                    Our mission is to build practical, AI-powered software that helps businesses work smarter, save time, and make better decisions. Rather than creating technology for the sake of innovation, we focus on solving real business challenges with simple, scalable solutions.
                  </p>
                  <p className="text-white font-medium">
                    Every feature is designed with one goal in mind: helping businesses grow through smarter technology.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <IconTarget className="w-5 h-5 text-violet-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Our Mission</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    To give every e-commerce agency — from solo freelancers to 50-person teams — the intelligence they need to find high-intent clients, prove their value with data, and close retainers faster.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <IconAward className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">What We Believe</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>Agencies deserve better than guessing which stores need help</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>Data beats intuition every time when pitching clients</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>Outreach should be personal, not spammy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>The best tools are built by people who actually use them</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Timeline ─── */}
        <section className="py-20 lg:py-28 border-t border-slate-800/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Our Journey</h2>
              <p className="text-slate-400">From a one-person consultancy to a product used by agencies worldwide.</p>
            </div>
            <div className="relative border-l border-slate-800 ml-4 sm:ml-0 sm:pl-0 space-y-12">
              {milestones.map((m, i) => (
                <div key={i} className="relative pl-8 sm:pl-12">
                  <div className="absolute left-0 sm:left-0 top-0 w-3 h-3 rounded-full bg-violet-500 -translate-x-[5px] ring-4 ring-[#0b0f1f]" />
                  <div className="text-xs font-bold text-violet-400 mb-1">{m.year}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{m.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Services ─── */}
        <section className="py-20 lg:py-28 border-t border-slate-800/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">What We Do</h2>
              <p className="text-slate-400">Beyond EcomFind, our agency helps Shopify stores scale.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: IconZap, title: "CRO Audits", desc: "Deep-dive conversion rate optimization audits that identify revenue leaks and prioritize fixes by impact.", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
                { icon: IconGlobe, title: "Store Development", desc: "Custom Shopify theme development, app integrations, and headless builds for high-growth brands.", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                { icon: IconTrending, title: "Growth Strategy", desc: "End-to-end e-commerce strategy: traffic acquisition, retention, email flows, and paid media optimization.", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
              ].map((s) => (
                <div key={s.title} className="rounded-2xl bg-slate-900/40 border border-slate-800 p-8 hover:border-slate-700 transition-colors">
                  <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mb-6`}>
                    <s.icon className={`w-6 h-6 ${s.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Our Commitment ─── */}
        <section className="py-20 lg:py-28 border-t border-slate-800/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
              <IconHeart className="w-3 h-3" /> Our Promise
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Our Commitment</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
              We're committed to building software that solves real business problems, delivers measurable value, and continuously evolves based on customer feedback. Every update, feature, and improvement is driven by one goal: helping businesses grow with confidence.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                  <IconTarget className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">Problem-First Design</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Every feature starts with a real business problem, not a technology trend.</p>
              </div>
              <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                  <IconTrending className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">Measurable Value</h3>
                <p className="text-xs text-slate-400 leading-relaxed">If it doesn't save time or make money, we don't build it.</p>
              </div>
              <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                  <IconShield className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">Continuous Evolution</h3>
                <p className="text-xs text-slate-400 leading-relaxed">We listen, iterate, and improve based on what our users actually need.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-20 lg:py-28 border-t border-slate-800/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Let's Build Something Together</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Whether you want to use EcomFind, hire our agency, or just talk shop — we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:supremacy1422@gmail.com" className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                <IconMail className="w-4 h-4" /> Get in Touch
              </a>
              <a href="/discover" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                Run a Free Audit <IconZap className="w-4 h-4" />
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
              <p className="text-xs text-slate-500 leading-relaxed">AI-powered revenue intelligence for e-commerce agencies. Built by agency people, for agency people.</p>
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
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="mailto:supremacy1422@gmail.com" className="text-sm text-slate-400 hover:text-white transition-colors">Email Us</a></li>
                <li><span className="text-sm text-slate-500">Twitter / X</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">© 2026 EcomFind. All rights reserved.</p>
            <span className="text-xs text-slate-600 flex items-center gap-1.5">
              <IconTrending className="w-3 h-3" /> Built by agencies, for agencies
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}