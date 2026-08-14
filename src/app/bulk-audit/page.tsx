"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const API_KEY = process.env.NEXT_PUBLIC_PAGESPEED_API_KEY || "";

/* ─── Icons ─── */
const IconZap = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconPlay = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
);
const IconDownload = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);
const IconSave = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);
const IconTrash = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);
const IconRefresh = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
);
const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconAlert = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

/* ─── Types ─── */
interface AuditResult {
  id: string;
  url: string;
  domain: string;
  status: "pending" | "running" | "done" | "error";
  score?: number;
  performance?: number;
  accessibility?: number;
  bestPractices?: number;
  seo?: number;
  lcp?: number;
  cls?: number;
  inp?: number;
  error?: string;
  report?: any;
}

/* ─── Helpers ─── */
function extractDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function scoreColor(score?: number) {
  if (!score) return "text-slate-400";
  if (score >= 90) return "text-emerald-400";
  if (score >= 70) return "text-amber-400";
  return "text-rose-400";
}

function scoreBg(score?: number) {
  if (!score) return "bg-slate-800";
  if (score >= 90) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (score >= 70) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  return "bg-rose-500/10 text-rose-400 border-rose-500/20";
}

/* ─── Main Page ─── */
export default function BulkAuditPage() {
  const [user, setUser] = useState<any>(null);
  const [urls, setUrls] = useState("");
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [results, setResults] = useState<AuditResult[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
  }, []);

  const parseUrls = () =>
    urls
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0)
      .map((u) => (u.startsWith("http") ? u : `https://${u}`));

  const runBulkAudit = async () => {
    const urlList = parseUrls();
    if (urlList.length === 0) return;
    if (urlList.length > 20) {
      alert("Max 20 URLs at once to avoid API limits.");
      return;
    }

    const initial: AuditResult[] = urlList.map((url, i) => ({
      id: `audit-${i}`,
      url,
      domain: extractDomain(url),
      status: "pending",
    }));

    setResults(initial);
    setRunning(true);
    setProgress(0);
    setSaveMsg("");

    for (let i = 0; i < urlList.length; i++) {
      setResults((prev) =>
        prev.map((r, idx) => (idx === i ? { ...r, status: "running" } : r))
      );

      try {
        const res = await fetch(
          `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
            urlList[i]
          )}&key=${API_KEY}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO&strategy=${strategy.toUpperCase()}`
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const cats = data.lighthouseResult?.categories || {};
        const audits = data.lighthouseResult?.audits || {};

        const perf = Math.round((cats.performance?.score || 0) * 100);
        const a11y = Math.round((cats.accessibility?.score || 0) * 100);
        const bp = Math.round((cats["best-practices"]?.score || 0) * 100);
        const seo = Math.round((cats.seo?.score || 0) * 100);
        const overall = Math.round((perf + a11y + bp + seo) / 4);

        const lcp = audits["largest-contentful-paint"]?.numericValue
          ? Math.round(audits["largest-contentful-paint"].numericValue / 10) / 100
          : undefined;
        const cls = audits["cumulative-layout-shift"]?.numericValue
          ? Math.round(audits["cumulative-layout-shift"].numericValue * 100) / 100
          : undefined;
        const inp = audits["interaction-to-next-paint"]?.numericValue
          ? Math.round(audits["interaction-to-next-paint"].numericValue / 10) / 100
          : undefined;

        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i
              ? {
                  ...r,
                  status: "done",
                  score: overall,
                  performance: perf,
                  accessibility: a11y,
                  bestPractices: bp,
                  seo,
                  lcp,
                  cls,
                  inp,
                  report: data,
                }
              : r
          )
        );
      } catch (err: any) {
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: "error", error: err.message } : r
          )
        );
      }

      setProgress(Math.round(((i + 1) / urlList.length) * 100));
      if (i < urlList.length - 1) await new Promise((r) => setTimeout(r, 1200));
    }

    setRunning(false);
  };

  const exportCSV = () => {
    const done = results.filter((r) => r.status === "done");
    if (done.length === 0) return;

    const rows = [
      ["Domain", "URL", "Overall", "Performance", "Accessibility", "Best Practices", "SEO", "LCP (s)", "CLS", "INP (ms)"],
      ...done.map((r) => [
        r.domain,
        r.url,
        r.score,
        r.performance,
        r.accessibility,
        r.bestPractices,
        r.seo,
        r.lcp ?? "—",
        r.cls ?? "—",
        r.inp ?? "—",
      ]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `bulk-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const saveAll = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setSaveMsg("Sign in to save audits");
      setTimeout(() => setSaveMsg(""), 3000);
      return;
    }

    const done = results.filter((r) => r.status === "done");
    if (done.length === 0) return;

    const inserts = done.map((r) => ({
      user_id: session.user.id,
      url: r.url,
      domain: r.domain,
      score: r.score || 0,
      report_json: r.report,
    }));

    const { error } = await supabase.from("saved_audits").insert(inserts);
    if (error) {
      setSaveMsg("Error saving");
    } else {
      setSaveMsg(`${done.length} audits saved!`);
    }
    setTimeout(() => setSaveMsg(""), 4000);
  };

  const clearAll = () => {
    if (!confirm("Clear all results?")) return;
    setResults([]);
    setProgress(0);
    setSaveMsg("");
  };

  const rerunOne = async (index: number) => {
    if (running) return;
    const url = results[index].url;
    setResults((prev) => prev.map((r, i) => (i === index ? { ...r, status: "running" } : r)));

    try {
      const res = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
          url
        )}&key=${API_KEY}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO&strategy=${strategy.toUpperCase()}`
      );
      const data = await res.json();
      const cats = data.lighthouseResult?.categories || {};
      const audits = data.lighthouseResult?.audits || {};

      const perf = Math.round((cats.performance?.score || 0) * 100);
      const a11y = Math.round((cats.accessibility?.score || 0) * 100);
      const bp = Math.round((cats["best-practices"]?.score || 0) * 100);
      const seo = Math.round((cats.seo?.score || 0) * 100);
      const overall = Math.round((perf + a11y + bp + seo) / 4);

      setResults((prev) =>
        prev.map((r, i) =>
          i === index
            ? {
                ...r,
                status: "done",
                score: overall,
                performance: perf,
                accessibility: a11y,
                bestPractices: bp,
                seo,
                lcp: audits["largest-contentful-paint"]?.numericValue
                  ? Math.round(audits["largest-contentful-paint"].numericValue / 10) / 100
                  : undefined,
                cls: audits["cumulative-layout-shift"]?.numericValue
                  ? Math.round(audits["cumulative-layout-shift"].numericValue * 100) / 100
                  : undefined,
                inp: audits["interaction-to-next-paint"]?.numericValue
                  ? Math.round(audits["interaction-to-next-paint"].numericValue / 10) / 100
                  : undefined,
                report: data,
              }
            : r
        )
      );
    } catch {
      setResults((prev) => prev.map((r, i) => (i === index ? { ...r, status: "error", error: "Failed" } : r)));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b0f1f] text-slate-200 flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
            <IconZap className="w-7 h-7 text-violet-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-sm text-slate-400 mb-6">Log in to run bulk audits and save results.</p>
          <a href="/login" className="w-full inline-block py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const doneCount = results.filter((r) => r.status === "done").length;
  const errorCount = results.filter((r) => r.status === "error").length;

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
            <a href="/bulk-audit" className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 text-sm font-medium border border-violet-500/20">Bulk Audit</a>
            <a href="/leads" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Leads</a>
            <a href="/outreach" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Outreach</a>
            <a href="/bulk-outreach" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Bulk</a>
            <a href="/gmail-connections" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Gmail</a>
            <a href="/follow-ups" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Follow-ups</a>
            <a href="/dashboard" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Dashboard</a>
            <a href="/about" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">About</a>
            <a href="/founder" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Founder</a>
          </nav>
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs text-emerald-400 font-bold border border-emerald-500/30">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Bulk Audit</h1>
          <p className="text-slate-400">Paste up to 20 store URLs and run PageSpeed audits on all of them at once.</p>
        </div>

        {/* Input */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Store URLs (one per line)</label>
              <textarea
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                placeholder="fashionnova.com&#10;gymshark.com&#10;allbirds.com"
                rows={5}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none font-mono"
              />
            </div>
            <div className="sm:w-48 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Device</label>
                <div className="flex rounded-lg bg-slate-950/50 border border-slate-700 p-1">
                  <button
                    onClick={() => setStrategy("mobile")}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      strategy === "mobile" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Mobile
                  </button>
                  <button
                    onClick={() => setStrategy("desktop")}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      strategy === "desktop" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Desktop
                  </button>
                </div>
              </div>
              <button
                onClick={runBulkAudit}
                disabled={running || urls.trim().length === 0}
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                {running ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {progress}%
                  </>
                ) : (
                  <>
                    <IconPlay className="w-4 h-4" /> Run Audit
                  </>
                )}
              </button>
              {results.length > 0 && (
                <button
                  onClick={clearAll}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-slate-700"
                >
                  <IconTrash className="w-4 h-4" /> Clear
                </button>
              )}
            </div>
          </div>
          <p className="text-[10px] text-slate-600">Max 20 URLs. Auto-adds https:// if missing. 1.2s delay between requests to respect API limits.</p>
        </div>

        {/* Progress */}
        {running && (
          <div className="mb-8">
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-violet-500 transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Auditing {results.filter((r) => r.status === "done" || r.status === "error").length} of {results.length} stores...
            </p>
          </div>
        )}

        {/* Actions */}
        {doneCount > 0 && !running && (
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={exportCSV}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium transition-colors flex items-center gap-2"
            >
              <IconDownload className="w-4 h-4" /> Export CSV
            </button>
            <button
              onClick={saveAll}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <IconSave className="w-4 h-4" /> Save All to Dashboard
            </button>
            {saveMsg && (
              <span className={`text-sm self-center ${saveMsg.includes("Error") || saveMsg.includes("Sign in") ? "text-rose-400" : "text-emerald-400"}`}>
                {saveMsg}
              </span>
            )}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-800">
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Domain</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Overall</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Perf</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">A11y</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">BP</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">SEO</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">LCP</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">CLS</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">INP</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {results.map((r, i) => (
                    <tr key={r.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-white">{r.domain}</div>
                        <div className="text-[10px] text-slate-600 truncate max-w-[180px]">{r.url}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {r.status === "done" ? (
                          <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border ${scoreBg(r.score)}`}>
                            {r.score}
                          </span>
                        ) : r.status === "running" ? (
                          <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
                        ) : r.status === "error" ? (
                          <IconAlert className="w-4 h-4 text-rose-400 mx-auto" />
                        ) : (
                          <span className="text-xs text-slate-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-xs font-medium text-slate-400">{r.performance ?? "—"}</td>
                      <td className="px-4 py-3 text-center text-xs font-medium text-slate-400">{r.accessibility ?? "—"}</td>
                      <td className="px-4 py-3 text-center text-xs font-medium text-slate-400">{r.bestPractices ?? "—"}</td>
                      <td className="px-4 py-3 text-center text-xs font-medium text-slate-400">{r.seo ?? "—"}</td>
                      <td className="px-4 py-3 text-center text-xs font-medium text-slate-400">{r.lcp ?? "—"}</td>
                      <td className="px-4 py-3 text-center text-xs font-medium text-slate-400">{r.cls ?? "—"}</td>
                      <td className="px-4 py-3 text-center text-xs font-medium text-slate-400">{r.inp ?? "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {r.status === "error" && (
                            <button
                              onClick={() => rerunOne(i)}
                              disabled={running}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
                              title="Retry"
                            >
                              <IconRefresh className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {r.status === "done" && (
                            <a
                              href={`/discover?url=${encodeURIComponent(r.url)}`}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                              title="Full Report"
                            >
                              <IconZap className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {doneCount > 0 && (
              <div className="px-4 py-3 bg-slate-900/40 border-t border-slate-800 text-xs text-slate-500">
                {doneCount} completed{errorCount > 0 ? ` · ${errorCount} failed` : ""} · Avg score:{" "}
                {Math.round(
                  results.filter((r) => r.status === "done" && r.score).reduce((a, r) => a + (r.score || 0), 0) /
                    (doneCount || 1)
                )}
                /100
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}