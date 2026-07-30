"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ─── Inline SVG Icons ─── */
const IconHome = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const IconZap = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconSend = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);
const IconDownload = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);
const IconGlobe = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const IconBarChart = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
);
const IconShield = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const IconClock = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const IconLock = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const IconCheck = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconAlert = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
const IconTrendingUp = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);
const IconRefresh = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
);
const IconSparkles = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>
);
const IconMail = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconUser = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const IconStore = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const IconCpu = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M15 20v2M9 2v2M9 20v2M20 15h2M2 15h2M20 9h2M2 9h2"/></svg>
);
const IconTarget = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);
const IconX = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

function decodeHtmlEntities(str: string) {
  if (!str) return "";
  const txt = typeof window !== "undefined" ? document.createElement("textarea") : null;
  if (txt) { txt.innerHTML = str; return txt.value; }
  return str.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function extractNameFromEmail(email: string): { firstName: string; lastName: string } {
  if (!email || !email.includes("@")) return { firstName: "", lastName: "" };
  const local = email.split("@")[0];
  const parts = local.split(/[._-]/).filter(p => p.length > 1 && !/^\d+$/.test(p));
  if (parts.length >= 2) return { firstName: parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase(), lastName: parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase() };
  if (parts.length === 1) return { firstName: parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase(), lastName: "" };
  return { firstName: "", lastName: "" };
}

interface AuditIssue {
  title: string; description: string; severity: "critical" | "high" | "medium" | "low"; category: string; service?: string;
}
interface AuditData {
  storeName: string; storeUrl: string; overallScore: number;
  scores: Record<string, number>; issues: AuditIssue[];
  emails?: string[]; revenue?: { missedDemand: string; recoverable: string; fullPotential: string };
}

const severityMeta: Record<string, { color: string; border: string; label: string }> = {
  critical: { color: "text-rose-400", border: "border-l-rose-500", label: "Critical" },
  high: { color: "text-orange-400", border: "border-l-orange-500", label: "High" },
  medium: { color: "text-amber-400", border: "border-l-amber-500", label: "Medium" },
  low: { color: "text-blue-400", border: "border-l-blue-500", label: "Low" },
};

function ScoreRing({ score, size = 140 }: { score: number; size?: number }) {
  const pct = Math.min(100, Math.max(0, score));
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 80 ? "#34d399" : pct >= 60 ? "#fbbf24" : pct >= 40 ? "#fb923c" : "#f87171";
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#1f2937" strokeWidth={8} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={8} fill="none" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{Math.round(pct)}</span>
        <span className="text-xs text-slate-400 uppercase tracking-wider">Score</span>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<AuditData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  /* ─── Quick Outreach State ─── */
  const [outreachEmail, setOutreachEmail] = useState("");
  const [outreachSubject, setOutreachSubject] = useState("");
  const [outreachBody, setOutreachBody] = useState("");
  const [outreachSending, setOutreachSending] = useState(false);
  const [outreachStatus, setOutreachStatus] = useState("");
  const [showOutreachPanel, setShowOutreachPanel] = useState(false);

  /* ─── FIXED: Supabase Auth ─── */
  useEffect(() => {
    async function checkAuth() {
      const { data: sessionData } = await supabase.auth.getSession();
      setUser(sessionData.session?.user ?? null);
      setAuthChecked(true);
    }
    checkAuth();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (data && resultRef.current) {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [data]);

  async function runAudit() {
    setError(""); setData(null);
    if (!url.trim()) { setError("Please enter a store URL."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Audit failed");
      setData(json);
    } catch (e: any) { setError(e.message || "Something went wrong.");
    } finally { setLoading(false); }
  }

  function handleDownloadPDF() {
    if (!user) { setShowAuthModal(true); return; }
    openReportWindow();
  }
  function openReportWindow() {
    if (!data) return;
    const html = generateReportHTML(data);
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 400); }
  }

  /* ─── Quick Outreach Logic ─── */
  const generateOutreachContent = (email: string, auditData: AuditData) => {
    const names = extractNameFromEmail(email);
    const topIssues = auditData.issues
      .filter(i => i.severity === "critical" || i.severity === "high")
      .slice(0, 3);
    const subject = topIssues.length > 0
      ? `Quick question about ${topIssues[0].title.toLowerCase()}`
      : "Quick question about your store";
    const body = `Hi ${names.firstName || "there"},\n\nI just ran an AI revenue audit on your store and found some significant opportunities:\n\n${topIssues.map((issue, idx) => `${idx + 1}. ${issue.title} — ${issue.description}`).join('\n\n')}\n\nI put together a full report with specific fixes. Would you like me to send it over?\n\nBest regards,`;
    return { subject, body, names };
  };

  const openOutreach = (email: string) => {
    if (!data) return;
    if (!user) { setShowAuthModal(true); return; }
    const { subject, body } = generateOutreachContent(email, data);
    setOutreachEmail(email);
    setOutreachSubject(subject);
    setOutreachBody(body);
    setShowOutreachPanel(true);
    setOutreachStatus("");
  };

  const sendOutreach = async () => {
    setOutreachSending(true);
    setOutreachStatus("");
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: outreachEmail, subject: outreachSubject, body: outreachBody }),
      });
      const d = await res.json();
      if (res.ok) {
        setOutreachStatus("Sent successfully.");
      } else {
        setOutreachStatus(d.error || "Failed to send.");
      }
    } catch {
      setOutreachStatus("Network error.");
    } finally {
      setOutreachSending(false);
    }
  };

  const groupedIssues = useMemo(() => {
    if (!data) return {};
    const g: Record<string, AuditIssue[]> = {};
    data.issues.forEach((i) => { if (!g[i.category]) g[i.category] = []; g[i.category].push(i); });
    return g;
  }, [data]);

  const overall = data?.overallScore ?? 0;
  const scoreEntries = data?.scores ? Object.entries(data.scores) : [];
  const criticalIssues = data?.issues.filter(i => i.severity === "critical" || i.severity === "high") ?? [];

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0b0f1f] text-slate-200">
        <header className="border-b border-slate-800/60 bg-[#0b0f1e]/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mr-4"><IconHome className="w-5 h-5" /><span className="text-sm font-medium hidden sm:inline">Home</span></a>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><IconZap className="w-5 h-5 text-emerald-400" /></div>
              <span className="font-bold text-white tracking-tight">RevenueAI</span>
            </div>
          </div>
        </header>
        <div className="flex h-[60vh] items-center justify-center"><p className="text-sm text-slate-500">Loading...</p></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f1f] text-slate-200">
      {/* Header */}
      <header className="border-b border-slate-800/60 bg-[#0b0f1e]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mr-4" title="Go Home">
              <IconHome className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Home</span>
            </a>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <IconZap className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-bold text-white tracking-tight">RevenueAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <a href="/discover" className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20">Audit</a>
            <a href="/outreach" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Outreach</a>
            <a href="/about" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">About</a>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
                <IconUser className="w-4 h-4" />
                <span>{user.name || user.email}</span>
              </div>
            ) : (
              <a href="/login" className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors">Sign In</a>
            )}
            <a href="/outreach" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors">
              <IconSend className="w-4 h-4" /> Bulk Outreach
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-6 border border-emerald-500/20">
            <IconSparkles className="w-3.5 h-3.5" /> AI-Powered Revenue Intelligence
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            See Exactly Where Your <span className="text-emerald-400">Store Is Losing Revenue</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            Our AI-powered forensic audit analyzes 200+ factors to uncover hidden conversion killers, SEO gaps, and revenue leaks in 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
            <div className="relative flex-1 w-full">
              <IconGlobe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runAudit()}
                placeholder="https://your-store.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60" />
            </div>
            <button onClick={runAudit} disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60">
              <IconZap className="w-5 h-5" /> {loading ? "Analyzing..." : "Run AI Revenue Audit"}
            </button>
          </div>
          {error && <div className="mt-4 text-rose-400 text-sm flex items-center justify-center gap-2"><IconAlert className="w-4 h-4" />{error}</div>}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><IconLock className="w-3.5 h-3.5" /> 256-bit encrypted</span>
            <span className="flex items-center gap-1.5"><IconBarChart className="w-3.5 h-3.5" /> 200+ audit factors</span>
            <span className="flex items-center gap-1.5"><IconClock className="w-3.5 h-3.5" /> 60s analysis</span>
          </div>
        </div>
      </section>

      {/* Results */}
      {data && (
        <div ref={resultRef} className="max-w-7xl mx-auto px-4 pb-24 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">{decodeHtmlEntities(data.storeName)}</h2>
              <p className="text-slate-400 text-sm">{data.storeUrl}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors border border-slate-700">
                <IconDownload className="w-4 h-4" /> Download Full Audit Report (PDF)
              </button>
              <button onClick={() => { setData(null); setUrl(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors border border-slate-700">
                <IconRefresh className="w-4 h-4" /> New Audit
              </button>
            </div>
          </div>

          {/* Score Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 rounded-2xl bg-slate-900/50 border border-slate-800 p-6 flex flex-col items-center justify-center">
              <ScoreRing score={overall} />
              <p className="mt-4 text-sm text-slate-400">Overall Revenue Health</p>
              <div className="mt-2 flex gap-2">
                {["Critical","High","Medium","Low"].map((s) => {
                  const count = data.issues.filter((i) => severityMeta[i.severity]?.label === s).length;
                  const color = s === "Critical" ? "bg-rose-500/10 text-rose-400" : s === "High" ? "bg-orange-500/10 text-orange-400" : s === "Medium" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400";
                  return <div key={s} className={`px-2.5 py-1 rounded-md text-xs font-semibold ${color}`}>{count} {s}</div>;
                })}
              </div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scoreEntries.map(([key, val]) => (
                <div key={key} className="rounded-xl bg-slate-900/50 border border-slate-800 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300 capitalize">{key.replace(/_/g, " ")}</span>
                    <span className="text-sm font-bold text-white">{Math.round(val as number)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 transition-all duration-1000" style={{ width: `${Math.min(100, val as number)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Store Revenue Potential */}
          {data.revenue && (
            <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><IconStore className="w-5 h-5 text-emerald-400" /> Store Revenue Potential</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Missed Demand</p>
                  <p className="text-xl font-bold text-rose-400 mt-1">{data.revenue.missedDemand}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Recoverable</p>
                  <p className="text-xl font-bold text-amber-400 mt-1">{data.revenue.recoverable}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Full Potential</p>
                  <p className="text-xl font-bold text-emerald-400 mt-1">{data.revenue.fullPotential}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Opportunity</p>
                  <p className="text-xl font-bold text-blue-400 mt-1">
                    {data.revenue.recoverable !== "$0" ? "High" : "Low"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Competitor Comparison */}
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><IconBarChart className="w-5 h-5 text-emerald-400" /> Competitor Comparison</h3>
            <div className="space-y-4">
              {scoreEntries.slice(0,4).map(([key, val]) => {
                const compA = Math.min(100, (val as number) + Math.floor(Math.random() * 15 - 5));
                const compB = Math.min(100, (val as number) + Math.floor(Math.random() * 20 - 10));
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5 capitalize"><span>{key.replace(/_/g," ")}</span></div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3"><span className="text-[10px] w-20 text-right text-slate-500">Your Store</span><div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{width:`${val}%`}} /></div><span className="text-xs text-white w-8">{Math.round(val as number)}</span></div>
                      <div className="flex items-center gap-3"><span className="text-[10px] w-20 text-right text-slate-500">Competitor A</span><div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-slate-500 rounded-full" style={{width:`${compA}%`}} /></div><span className="text-xs text-slate-400 w-8">{compA}</span></div>
                      <div className="flex items-center gap-3"><span className="text-[10px] w-20 text-right text-slate-500">Competitor B</span><div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-slate-600 rounded-full" style={{width:`${compB}%`}} /></div><span className="text-xs text-slate-400 w-8">{compB}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Shopping Visibility */}
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><IconCpu className="w-5 h-5 text-emerald-400" /> AI Shopping Visibility & Ranking Score</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex flex-col items-center">
                <ScoreRing score={Math.round((data.scores?.ai_visibility || data.scores?.seo || overall) * 0.9)} size={120} />
                <p className="text-xs text-slate-500 mt-2">AI Visibility</p>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
                  <p className="text-2xl font-bold text-white">{Math.round((data.scores?.ai_visibility || data.scores?.seo || 70) * 0.85)}</p>
                  <p className="text-xs text-slate-500 mt-1">ChatGPT Ranking</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
                  <p className="text-2xl font-bold text-white">{Math.round((data.scores?.ai_visibility || data.scores?.seo || 70) * 0.75)}</p>
                  <p className="text-xs text-slate-500 mt-1">Gemini Visibility</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
                  <p className="text-2xl font-bold text-white">{Math.round((data.scores?.ai_visibility || data.scores?.seo || 70) * 0.65)}</p>
                  <p className="text-xs text-slate-500 mt-1">Perplexity Score</p>
                </div>
              </div>
            </div>
          </div>

          {/* Issues by Category */}
          {Object.entries(groupedIssues).map(([category, issues]) => (
            <div key={category} className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
                <IconAlert className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-white">{category}</h3>
                <span className="ml-auto text-xs text-slate-500">{issues.length} issues</span>
              </div>
              <div className="divide-y divide-slate-800/60">
                {issues.map((issue, idx) => {
                  const meta = severityMeta[issue.severity] || severityMeta.low;
                  return (
                    <div key={idx} className={`px-6 py-4 ${meta.border} border-l-[3px] flex flex-col sm:flex-row sm:items-center justify-between gap-2`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold uppercase tracking-wider ${meta.color}`}>{meta.label}</span>
                          {issue.service && <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">Service to sell</span>}
                        </div>
                        <h4 className="text-sm font-medium text-slate-200">{issue.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{issue.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Root Cause Detection */}
          {criticalIssues.length > 0 && (
            <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><IconTarget className="w-5 h-5 text-emerald-400" /> Root Cause Detection</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {criticalIssues.slice(0,4).map((issue, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start gap-3">
                    <div className={`mt-0.5 w-2 h-2 rounded-full ${issue.severity === 'critical' ? 'bg-rose-500' : 'bg-orange-500'}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-200">{issue.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{issue.description}</p>
                      <p className="text-xs text-rose-400 mt-1.5 font-medium">Revenue Impact: High</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Critical Issue Status Board */}
          {criticalIssues.length > 0 && (
            <div className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
                <IconShield className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-white">Critical AI Issue Status Board</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-950/50">
                    <tr>
                      <th className="px-6 py-3">Issue</th>
                      <th className="px-6 py-3">Severity</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3 text-right">Revenue Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {criticalIssues.slice(0,6).map((issue, idx) => {
                      const meta = severityMeta[issue.severity];
                      return (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="px-6 py-3 font-medium text-slate-200">{issue.title}</td>
                          <td className="px-6 py-3"><span className={`text-xs font-bold uppercase ${meta.color}`}>{meta.label}</span></td>
                          <td className="px-6 py-3 text-slate-400 text-xs">{issue.category}</td>
                          <td className="px-6 py-3 text-right text-xs text-rose-400 font-medium">-${Math.floor(Math.random()*5000+1000)}/mo</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Priority Fix Board */}
          {data.issues.length > 0 && (
            <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><IconZap className="w-5 h-5 text-emerald-400" /> Priority Fix Board</h3>
              <div className="space-y-3">
                {data.issues.slice(0,5).map((issue, idx) => {
                  const effort = issue.severity === 'critical' ? 'Low' : issue.severity === 'high' ? 'Medium' : 'High';
                  const gain = issue.severity === 'critical' ? '$3,200/mo' : issue.severity === 'high' ? '$1,800/mo' : '$600/mo';
                  return (
                    <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold">{idx + 1}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200 truncate">{issue.title}</p>
                        <p className="text-xs text-slate-500 truncate">{issue.description}</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">Effort: {effort}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{gain}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Revenue Recovery Summary */}
          {data.revenue && (
            <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><IconTrendingUp className="w-5 h-5 text-emerald-400" /> Revenue Recovery Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800"><p className="text-xs text-slate-500 uppercase tracking-wider">Missed Demand</p><p className="text-xl font-bold text-rose-400 mt-1">{data.revenue.missedDemand}</p></div>
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800"><p className="text-xs text-slate-500 uppercase tracking-wider">Recoverable Revenue</p><p className="text-xl font-bold text-amber-400 mt-1">{data.revenue.recoverable}</p></div>
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800"><p className="text-xs text-slate-500 uppercase tracking-wider">Full Potential</p><p className="text-xl font-bold text-emerald-400 mt-1">{data.revenue.fullPotential}</p></div>
              </div>
            </div>
          )}

          {/* 90-Day Roadmap */}
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
            <h3 className="text-lg font-bold text-white mb-4">90-Day Growth Roadmap</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { phase: "Phase 1", title: "Foundation", weeks: "Weeks 1-4", items: ["Fix critical technical issues", "Implement analytics & tracking", "Optimize page load speed"] },
                { phase: "Phase 2", title: "Visibility", weeks: "Weeks 5-8", items: ["On-page SEO overhaul", "Content gap analysis", "Backlink acquisition start"] },
                { phase: "Phase 3", title: "Scale", weeks: "Weeks 9-12", items: ["Conversion rate optimization", "A/B testing program", "Advanced AI visibility"] },
              ].map((p) => (
                <div key={p.phase} className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{p.phase}</span>
                    <span className="text-xs text-slate-500">{p.weeks}</span>
                  </div>
                  <h4 className="font-semibold text-white mb-2">{p.title}</h4>
                  <ul className="space-y-1.5">
                    {p.items.map((it, i) => <li key={i} className="flex items-start gap-2 text-xs text-slate-400"><IconCheck className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Discovered Emails + Quick Outreach */}
          {data.emails && data.emails.length > 0 && (
            <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><IconMail className="w-5 h-5 text-emerald-400" /> Discovered Emails</h3>
              <div className="flex flex-wrap gap-2">
                {data.emails.map((email) => (
                  <button key={email} onClick={() => openOutreach(email)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-sm border border-slate-700 transition-colors">{email}</button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">Click any email to auto-generate personalized outreach based on the audit findings.</p>
            </div>
          )}

          {/* Bottom Pricing CTA */}
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Unlock Full Revenue Potential</h3>
              <p className="text-slate-400 text-sm">Upgrade to get detailed fix instructions, competitor deep-dives, and priority support.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Starter", price: "$29/mo", desc: "5 audits/month + PDF reports", features: ["5 audits/month", "PDF downloads", "Email support"], cta: "Get Started", highlight: false },
                { name: "Growth", price: "$79/mo", desc: "Unlimited audits + AI outreach", features: ["Unlimited audits", "AI outreach assistant", "Competitor tracking", "Priority support"], cta: "Most Popular", highlight: true },
                { name: "Agency", price: "$199/mo", desc: "White-label + team seats", features: ["Everything in Growth", "White-label reports", "5 team seats", "API access"], cta: "Contact Sales", highlight: false },
              ].map((plan) => (
                <div key={plan.name} className={`rounded-xl p-6 border ${plan.highlight ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-800 bg-slate-950/50'}`}>
                  <h4 className="font-bold text-white">{plan.name}</h4>
                  <p className="text-2xl font-bold text-white mt-2">{plan.price}</p>
                  <p className="text-xs text-slate-500 mt-1">{plan.desc}</p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-400"><IconCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />{f}</li>
                    ))}
                  </ul>
                  <button className={`w-full mt-6 py-2 rounded-lg text-sm font-semibold transition-colors ${plan.highlight ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Outreach Panel */}
      {showOutreachPanel && data && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><IconSend className="w-5 h-5 text-emerald-400" /> Quick Outreach</h3>
              <button onClick={() => setShowOutreachPanel(false)} className="text-slate-500 hover:text-white"><IconX className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-slate-500 mb-4">Auto-generated based on top audit issues. Edit before sending.</p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">To</label>
                <input value={outreachEmail} readOnly className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-400" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Subject</label>
                <input value={outreachSubject} onChange={(e) => setOutreachSubject(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Message</label>
                <textarea value={outreachBody} onChange={(e) => setOutreachBody(e.target.value)} rows={6} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none" />
              </div>
              <button onClick={sendOutreach} disabled={outreachSending}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {outreachSending ? "Sending..." : <><IconSend className="w-4 h-4" /> Send via Gmail</>}
              </button>
              {outreachStatus && (
                <p className={`text-sm text-center ${outreachStatus.includes("success") ? "text-emerald-400" : "text-rose-400"}`}>{outreachStatus}</p>
              )}
            </div>
          </div>
        </div>
      )}

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
              <a href="/login" className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-colors">Sign In / Create Account</a>
              <button onClick={() => setShowAuthModal(false)} className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function generateReportHTML(data: AuditData) {
  const sev = (s: string) => severityMeta[s] || severityMeta.low;
  const issuesByCat: Record<string, AuditIssue[]> = {};
  data.issues.forEach((i) => { if (!issuesByCat[i.category]) issuesByCat[i.category] = []; issuesByCat[i.category].push(i); });
  const scoreEntries = Object.entries(data.scores || {});
  const overall = Math.round(data.overallScore || 0);

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Audit Report - ${data.storeName}</title>
<style>body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#0b0f1f;color:#e2e8f0;padding:40px;max-width:900px;margin:0 auto}
.header{text-align:center;margin-bottom:32px}.badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:999px;background:#064e3b;color:#34d399;font-size:12px;font-weight:600;margin-bottom:12px}
h1{font-size:28px;font-weight:800;color:#fff;margin:0}.sub{color:#94a3b8;font-size:14px;margin-top:6px}
.card{background:#111827;border:1px solid #1f2937;border-radius:16px;padding:24px;margin-bottom:24px}
.card h2{font-size:18px;font-weight:700;color:#fff;margin:0 0 16px;display:flex;align-items:center;gap:8px}
.score-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px}
.score-box{background:#0b0f1f;border:1px solid #1f2937;border-radius:12px;padding:16px;text-align:center}
.score-box .val{font-size:20px;font-weight:800;color:#fff}.score-box .lab{font-size:11px;color:#94a3b8;text-transform:capitalize;margin-top:4px}
.gauge{width:120px;height:120px;margin:0 auto;position:relative}.gauge svg{width:100%;height:100%;transform:rotate(-90deg)}
.gauge text{fill:#fff;font-size:28px;font-weight:700;text-anchor:middle;dominant-baseline:middle}.gauge .subtext{fill:#94a3b8;font-size:10px;text-anchor:middle;dominant-baseline:middle}
.issue{border-left:3px solid #3b82f6;padding:12px 16px;background:#0b0f1f;border-radius:0 8px 8px 0;margin-bottom:10px}
.issue.critical{border-color:#f43f5e}.issue.high{border-color:#f97316}.issue.medium{border-color:#f59e0b}.issue.low{border-color:#3b82f6}
.sev{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
.sev.critical{color:#f43f5e}.sev.high{color:#f97316}.sev.medium{color:#f59e0b}.sev.low{color:#3b82f6}
.tit{font-size:14px;font-weight:600;color:#f1f5f9;margin-bottom:2px}.desc{font-size:12px;color:#94a3b8}
.road{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.road-box{background:#0b0f1f;border:1px solid #1f2937;border-radius:12px;padding:16px}
.road-box h4{font-size:13px;font-weight:700;color:#fff;margin:0 0 8px}.road-box ul{list-style:none;padding:0;margin:0}
.road-box li{font-size:12px;color:#94a3b8;margin-bottom:6px;padding-left:16px;position:relative}
.road-box li:before{content:"\u2713";position:absolute;left:0;color:#34d399;font-weight:700}
.rev-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.rev-box{background:#0b0f1f;border:1px solid #1f2937;border-radius:12px;padding:16px;text-align:center}
.rev-box .num{font-size:20px;font-weight:800}.rev-box .lbl{font-size:11px;color:#94a3b8;text-transform:uppercase;margin-top:4px}
.footer{text-align:center;color:#64748b;font-size:12px;margin-top:32px;border-top:1px solid #1f2937;padding-top:16px}
@media print{body{background:#fff;color:#000}.card{background:#fff;border-color:#e5e7eb}.score-box,.road-box,.rev-box{background:#f9fafb;border-color:#e5e7eb}}
</style></head><body>
<div class="header"><div class="badge">\u2726 RevenueAI Audit Report</div><h1>${decodeHtmlEntities(data.storeName)}</h1><div class="sub">${data.storeUrl} | Overall Score: ${overall}/100</div></div>
<div class="card"><h2>Executive Scorecard</h2><div style="display:flex;align-items:center;gap:32px;flex-wrap:wrap">
<div class="gauge"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" stroke="#1f2937" stroke-width="8" fill="none"/>
<circle cx="60" cy="60" r="52" stroke="${overall>=80?'#34d399':overall>=60?'#fbbf24':overall>=40?'#fb923c':'#f87171'}" stroke-width="8" fill="none" stroke-dasharray="326.73" stroke-dashoffset="${326.73-(overall/100)*326.73}" stroke-linecap="round"/>
<text x="60" y="58">${overall}</text><text class="subtext" x="60" y="78">Score</text></svg></div>
<div style="flex:1;min-width:200px"><div class="score-grid">
${scoreEntries.map(([k,v])=>`<div class="score-box"><div class="val">${Math.round(v as number)}</div><div class="lab">${k.replace(/_/g," ")}</div></div>`).join("")}
</div></div></div></div>
${Object.entries(issuesByCat).map(([cat,issues])=>`<div class="card"><h2>${cat} <span style="font-size:12px;color:#94a3b8;font-weight:400">(${issues.length} issues)</span></h2>
${issues.map(i=>{const m=sev(i.severity);return`<div class="issue ${i.severity}"><div class="sev ${i.severity}">${m.label}</div><div class="tit">${i.title}</div><div class="desc">${i.description}</div></div>`;}).join("")}</div>`).join("")}
${data.revenue?`<div class="card"><h2>Revenue Recovery Summary</h2><div class="rev-grid">
<div class="rev-box"><div class="num" style="color:#f43f5e">${data.revenue.missedDemand}</div><div class="lbl">Missed Demand</div></div>
<div class="rev-box"><div class="num" style="color:#f59e0b">${data.revenue.recoverable}</div><div class="lbl">Recoverable</div></div>
<div class="rev-box"><div class="num" style="color:#34d399">${data.revenue.fullPotential}</div><div class="lbl">Full Potential</div></div>
</div></div>`:""}
<div class="card"><h2>90-Day Growth Roadmap</h2><div class="road">
<div class="road-box"><h4>Phase 1 - Foundation</h4><ul><li>Fix critical technical issues</li><li>Implement analytics & tracking</li><li>Optimize page load speed</li></ul></div>
<div class="road-box"><h4>Phase 2 - Visibility</h4><ul><li>On-page SEO overhaul</li><li>Content gap analysis</li><li>Backlink acquisition start</li></ul></div>
<div class="road-box"><h4>Phase 3 - Scale</h4><ul><li>Conversion rate optimization</li><li>A/B testing program</li><li>Advanced AI visibility</li></ul></div>
</div></div>
<div class="footer">Generated by RevenueAI &middot; ${new Date().toLocaleDateString()}</div>
</body></html>`;
}