"use client";

import React, { useState, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ─── Icons ─── */
const IconPlus = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const IconMail = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconTrash = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);
const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconAlert = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
const IconStar = ({ className = "w-4 h-4", filled = false }: { className?: string; filled?: boolean }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
const IconEdit = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);
const IconSend = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);
const IconRefresh = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
);
const IconClose = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const IconZap = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconInbox = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
);

interface GmailAccount {
  id: string;
  email: string;
  displayName: string;
  type: "gmail" | "workspace";
  limit: number;
  sentToday: number;
  isActive: boolean;
  isDefault: boolean;
  lastSyncedAt: string;
  tokenExpiresAt: string;
  history: number[];
}

/* ─── Sparkline Component ─── */
function Sparkline({ data, color = "#8b5cf6" }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (v / max) * 100;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-10 overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        vectorEffect="non-scaling-stroke"
      />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (v / max) * 100;
        return (
          <circle key={i} cx={x} cy={y} r="2.5" fill={color} className="opacity-80" />
        );
      })}
    </svg>
  );
}

/* ─── Progress Bar ─── */
function ProgressBar({ current, max }: { current: number; max: number }) {
  const pct = Math.min((current / max) * 100, 100);
  const color = pct > 90 ? "bg-rose-500" : pct > 70 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: "healthy" | "warning" | "expired" | "revoked" }) {
  const map = {
    healthy: { text: "Active", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    warning: { text: "Token Expires Soon", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    expired: { text: "Token Expired", className: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
    revoked: { text: "Auth Revoked", className: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${s.className}`}>
      {status === "healthy" ? <IconCheck className="w-3 h-3" /> : <IconAlert className="w-3 h-3" />}
      {s.text}
    </span>
  );
}

/* ─── Main Page ─── */
export default function GmailConnectionsPage() {
  const [accounts, setAccounts] = useState<GmailAccount[]>([
    {
      id: "1",
      email: "abolajitosin962@gmail.com",
      displayName: "Abolaji Agency",
      type: "gmail",
      limit: 300,
      sentToday: 0,
      isActive: true,
      isDefault: true,
      lastSyncedAt: "2 min ago",
      tokenExpiresAt: "2026-09-10",
      history: [45, 120, 80, 200, 150, 90, 0],
    },
    {
      id: "2",
      email: "team@myagency.com",
      displayName: "My Agency Team",
      type: "workspace",
      limit: 500,
      sentToday: 412,
      isActive: true,
      isDefault: false,
      lastSyncedAt: "15 min ago",
      tokenExpiresAt: "2026-08-20",
      history: [300, 420, 380, 450, 410, 390, 412],
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLimit, setEditLimit] = useState<number>(0);
  const [editName, setEditName] = useState<string>("");
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testTarget, setTestTarget] = useState<GmailAccount | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [testSending, setTestSending] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const activeCount = accounts.filter((a) => a.isActive).length;
  const totalSentToday = accounts.reduce((sum, a) => sum + a.sentToday, 0);
  const totalLimit = accounts.reduce((sum, a) => sum + (a.isActive ? a.limit : 0), 0);

  const startEdit = (acc: GmailAccount) => {
    setEditingId(acc.id);
    setEditLimit(acc.limit);
    setEditName(acc.displayName);
  };

  const saveEdit = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, limit: editLimit, displayName: editName } : a))
    );
    setEditingId(null);
  };

  const toggleDefault = (id: string) => {
    setAccounts((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const deleteAccount = (id: string) => {
    if (!confirm("Disconnect this Gmail account?")) return;
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleActive = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const openTest = (acc: GmailAccount) => {
    setTestTarget(acc);
    setTestEmail("");
    setTestSent(false);
    setTestModalOpen(true);
  };

  const sendTest = async () => {
    if (!testEmail.includes("@")) return;
    setTestSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setTestSending(false);
    setTestSent(true);
    setTimeout(() => setTestModalOpen(false), 1200);
  };

  /* ─── FIXED: Real Gmail OAuth redirect ─── */
  const connectGmail = async () => {
    setConnecting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        window.location.href = "/login?redirect=/gmail-connections";
        return;
      }
      window.location.href = `/api/auth/gmail?token=${encodeURIComponent(session.access_token)}`;
    } catch (err) {
      console.error("Failed to start Gmail OAuth:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setConnecting(false);
    }
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="min-h-screen bg-[#0b0f1f] text-slate-200">
      {/* ─── Header ─── */}
      <header className="border-b border-slate-800/60 bg-[#0b0f1e]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <IconZap className="w-5 h-5 text-violet-400" />
            </div>
            <span className="font-bold text-white tracking-tight text-lg">EcomFind</span>
          </a>
          <nav className="hidden md:flex items-center gap-1">
            <a href="/discover" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Audit</a>
            <a href="/leads" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Leads</a>
            <a href="/outreach" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Outreach</a>
            <a href="/bulk-outreach" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Bulk</a>
            <a href="/gmail-connections" className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-sm transition-colors">Gmail</a>
            <a href="/dashboard" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Dashboard</a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* ─── Top Bar ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Gmail Connections</h1>
            <p className="text-sm text-slate-400">Connect multiple Gmail accounts, set daily send limits, and monitor deliverability.</p>
          </div>
          <button
            onClick={connectGmail}
            disabled={connecting}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            {connecting ? (
              <><IconRefresh className="w-4 h-4 animate-spin" /> Connecting...</>
            ) : (
              <><IconPlus className="w-4 h-4" /> Connect Gmail</>
            )}
          </button>
        </div>

        {/* ─── Summary Cards ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <IconMail className="w-4 h-4 text-violet-400" />
              </div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Connected</span>
            </div>
            <p className="text-2xl font-bold text-white">{accounts.length}</p>
            <p className="text-xs text-slate-500 mt-1">{activeCount} active · {accounts.length - activeCount} paused</p>
          </div>
          <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <IconSend className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Sent Today</span>
            </div>
            <p className="text-2xl font-bold text-white">{totalSentToday.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">of {totalLimit.toLocaleString()} daily limit</p>
          </div>
          <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <IconInbox className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Default Sender</span>
            </div>
            <p className="text-sm font-bold text-white truncate">
              {accounts.find((a) => a.isDefault)?.displayName || "None set"}
            </p>
            <p className="text-xs text-slate-500 mt-1 truncate">
              {accounts.find((a) => a.isDefault)?.email || "—"}
            </p>
          </div>
        </div>

        {/* ─── Account Cards ─── */}
        <div className="space-y-4">
          {accounts.length === 0 && (
            <div className="rounded-xl bg-slate-900/40 border border-slate-800 border-dashed p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/60 flex items-center justify-center mx-auto mb-4">
                <IconMail className="w-7 h-7 text-slate-600" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">No accounts connected</h3>
              <p className="text-sm text-slate-500 mb-5 max-w-sm mx-auto">Connect your first Gmail account to start sending outreach campaigns.</p>
              <button
                onClick={connectGmail}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <IconPlus className="w-4 h-4" /> Connect Gmail
              </button>
            </div>
          )}

          {accounts.map((acc) => {
            const pct = Math.min((acc.sentToday / acc.limit) * 100, 100);
            const status: "healthy" | "warning" | "expired" =
              new Date(acc.tokenExpiresAt) < new Date()
                ? "expired"
                : new Date(acc.tokenExpiresAt).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000
                ? "warning"
                : "healthy";

            return (
              <div
                key={acc.id}
                className={`rounded-2xl border p-6 transition-all ${
                  acc.isActive
                    ? "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    : "bg-slate-900/20 border-slate-800/40 opacity-70"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Left: Identity */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        acc.type === "workspace" ? "bg-amber-500/10" : "bg-violet-500/10"
                      }`}>
                        <IconMail className={`w-6 h-6 ${acc.type === "workspace" ? "text-amber-400" : "text-violet-400"}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-white">{acc.email}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                            acc.type === "workspace"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-slate-700/50 text-slate-400 border border-slate-600/30"
                          }`}>
                            {acc.type === "workspace" ? "Workspace" : "Gmail"}
                          </span>
                          {acc.isDefault && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-semibold">
                              Default
                            </span>
                          )}
                        </div>

                        {editingId === acc.id ? (
                          <div className="mt-2 flex items-center gap-2">
                            <input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="px-2 py-1 bg-slate-950 border border-slate-700 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                              placeholder="Display name"
                            />
                            <button onClick={() => saveEdit(acc.id)} className="p-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                              <IconCheck className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                            Send as: <span className="text-slate-300">{acc.displayName}</span>
                            <button onClick={() => startEdit(acc)} className="text-slate-600 hover:text-slate-400 transition-colors">
                              <IconEdit className="w-3 h-3" />
                            </button>
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <IconRefresh className="w-3 h-3" /> Synced {acc.lastSyncedAt}
                          </span>
                          <span>Token expires {acc.tokenExpiresAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Usage + Sparkline */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-500">
                        {acc.sentToday} / {acc.limit} sent today
                      </span>
                      {editingId === acc.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Limit:</span>
                          <input
                            type="number"
                            value={editLimit}
                            onChange={(e) => setEditLimit(Number(e.target.value))}
                            className="w-16 px-2 py-0.5 bg-slate-950 border border-slate-700 rounded text-xs text-white text-center focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                          />
                          <button onClick={() => saveEdit(acc.id)} className="p-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                            <IconCheck className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(acc)} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors">
                          Limit: {acc.limit} <IconEdit className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <ProgressBar current={acc.sentToday} max={acc.limit} />
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-600 uppercase tracking-wider font-medium">7-Day Activity</span>
                        <span className="text-[10px] text-slate-600">{acc.history.reduce((a, b) => a + b, 0)} total</span>
                      </div>
                      <Sparkline data={acc.history} color={acc.type === "workspace" ? "#f59e0b" : "#8b5cf6"} />
                      <div className="flex justify-between mt-1">
                        {days.map((d, i) => (
                          <span key={i} className="text-[9px] text-slate-600 w-full text-center">{d}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex lg:flex-col items-center lg:items-end gap-2 shrink-0">
                    <StatusBadge status={status} />
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => toggleDefault(acc.id)}
                        title={acc.isDefault ? "Default sender" : "Set as default"}
                        className={`p-2 rounded-lg border transition-colors ${
                          acc.isDefault
                            ? "bg-violet-500/10 border-violet-500/30 text-violet-400"
                            : "bg-slate-800/40 border-slate-700 text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        <IconStar className="w-4 h-4" filled={acc.isDefault} />
                      </button>
                      <button
                        onClick={() => openTest(acc)}
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                      >
                        <IconSend className="w-3.5 h-3.5" /> Test
                      </button>
                      <button
                        onClick={() => toggleActive(acc.id)}
                        className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                          acc.isActive
                            ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300"
                            : "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {acc.isActive ? "Pause" : "Resume"}
                      </button>
                      <button
                        onClick={() => deleteAccount(acc.id)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/10 border border-slate-700 hover:border-rose-500/30 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Tips Footer ─── */}
        <div className="mt-10 rounded-xl bg-slate-900/30 border border-slate-800/60 p-5">
          <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <IconAlert className="w-4 h-4 text-amber-400" /> Sending Limits & Best Practices
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li className="flex items-start gap-2"><span className="text-slate-600 mt-0.5">•</span> Gmail accounts: ~300 emails/day. Google Workspace: ~500-1,500/day depending on plan.</li>
            <li className="flex items-start gap-2"><span className="text-slate-600 mt-0.5">•</span> Pausing an account stops it from being used in bulk campaigns but keeps the connection alive.</li>
            <li className="flex items-start gap-2"><span className="text-slate-600 mt-0.5">•</span> Tokens auto-refresh, but if you change your Google password you will need to reconnect.</li>
          </ul>
        </div>
      </main>

      {/* ─── Test Send Modal ─── */}
      {testModalOpen && testTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setTestModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-[#0f1429] border border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-white">Send Test Email</h3>
              <button onClick={() => setTestModalOpen(false)} className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors">
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">From</p>
                <p className="text-sm text-white font-medium">{testTarget.displayName} &lt;{testTarget.email}&gt;</p>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1.5">To</label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Subject</p>
                <p className="text-sm text-slate-300">EcomFind — Gmail connection test</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Body</p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Hi there,<br /><br />
                  This is a test email from your EcomFind Gmail connection ({testTarget.email}). If you received this, your account is working correctly.<br /><br />
                  — EcomFind
                </p>
              </div>

              <button
                onClick={sendTest}
                disabled={testSending || !testEmail.includes("@") || testSent}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                {testSent ? (
                  <><IconCheck className="w-4 h-4" /> Sent!</>
                ) : testSending ? (
                  <><IconRefresh className="w-4 h-4 animate-spin" /> Sending...</>
                ) : (
                  <><IconSend className="w-4 h-4" /> Send Test Email</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}