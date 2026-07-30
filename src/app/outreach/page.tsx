"use client";

import React, { useState, useEffect } from "react";
import NavHeader from "@/components/NavHeader";

// ─── Inline SVG Icons ───
const Icon = ({ d, className = "w-4 h-4" }: { d: string; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

const Icons = {
  Send: <Icon d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />,
  Loader2: <Icon d="M21 12a9 9 0 11-6.22-8.56" />,
  CheckCircle2: <Icon d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-2-6l4-4 4 4M9 12l3 3" />,
  X: <Icon d="M18 6L6 18M6 6l12 12" />,
  Plus: <Icon d="M12 5v14M5 12h14" />,
  Trash2: <Icon d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />,
  RefreshCw: <Icon d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />,
  Mail: <Icon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" />,
  User: <Icon d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />,
  Globe: <Icon d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 0v20m-6.5-8h13" />,
  AlertTriangle: <Icon d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />,
};

type OutreachStatus = "new" | "contacted" | "responded" | "closed";

interface OutreachRow {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  storeUrl: string;
  subject: string;
  body: string;
  status: OutreachStatus;
  sending: boolean;
  sent: boolean;
  error?: string;
}

const templates = [
  { name: "T1 — Quick Question", subject: "Quick question about your store", body: `Hi {{firstName}},\n\nI came across your store and noticed a few opportunities to boost conversions and organic traffic.\n\nWould you be open to a 5-minute audit overview? No pitch — just insights.\n\nBest,` },
  { name: "T2 — Three Wins", subject: "3 quick wins I spotted on your store", body: `Hi {{firstName}},\n\nI run growth audits for e-commerce stores and found 3 high-impact fixes that could move the needle this month.\n\nHappy to share the findings — takes 2 mins to read.\n\nCheers,` },
  { name: "T3 — Revenue Leak", subject: "Is your store leaving revenue on the table?", body: `Hi {{firstName}},\n\nI analyzed your store against 200+ e-commerce benchmarks. There are a few gaps that typically cost stores 15-30% in lost revenue.\n\nI put together a quick summary. Want me to send it over?\n\nBest,` },
  { name: "T4 — AI Visibility", subject: "Your store's AI visibility score", body: `Hi {{firstName}},\n\nI checked how visible your store is to AI shopping assistants like ChatGPT and Gemini. Most stores in your niche are invisible — and it's costing them thousands.\n\nI have a quick fix list. Interested?\n\nBest,` },
  { name: "T5 — Competitor Gap", subject: "The gap between you and your competitors", body: `Hi {{firstName}},\n\nI ran a competitive analysis in your niche and found specific areas where top performers are pulling ahead. The good news: every gap is fixable.\n\nWant the breakdown?\n\nBest,` },
];

function extractNameFromEmail(email: string): { firstName: string; lastName: string } {
  if (!email || !email.includes("@")) return { firstName: "", lastName: "" };
  const local = email.split("@")[0];
  if (local.includes(".")) {
    const parts = local.split(".").filter(p => p.length > 1 && !/^\d+$/.test(p));
    if (parts.length >= 2) return { firstName: capitalize(parts[0]), lastName: capitalize(parts[1]) };
    if (parts.length === 1) return { firstName: capitalize(parts[0]), lastName: "" };
  }
  if (local.includes("_")) {
    const parts = local.split("_").filter(p => p.length > 1 && !/^\d+$/.test(p));
    if (parts.length >= 2) return { firstName: capitalize(parts[0]), lastName: capitalize(parts[1]) };
    if (parts.length === 1) return { firstName: capitalize(parts[0]), lastName: "" };
  }
  const camelMatch = local.match(/^([a-z]+)([A-Z][a-z]+)$/);
  if (camelMatch) return { firstName: capitalize(camelMatch[1]), lastName: camelMatch[2] };
  if (local.includes("-")) {
    const parts = local.split("-").filter(p => p.length > 1 && !/^\d+$/.test(p));
    if (parts.length >= 2) return { firstName: capitalize(parts[0]), lastName: capitalize(parts[1]) };
  }
  const generic = ["info", "hello", "contact", "support", "admin", "sales", "marketing", "team", "office", "help", "noreply", "no-reply", "founder", "owner", "ceo", "manager"];
  if (local.length > 2 && !generic.includes(local.toLowerCase())) return { firstName: capitalize(local), lastName: "" };
  return { firstName: "", lastName: "" };
}

function capitalize(s: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function fillTemplate(template: string, row: OutreachRow) {
  return template
    .replace(/{{firstName}}/g, row.firstName || "there")
    .replace(/{{lastName}}/g, row.lastName || "")
    .replace(/{{email}}/g, row.email)
    .replace(/{{storeUrl}}/g, row.storeUrl || "your store");
}

export default function OutreachPage() {
  const [rows, setRows] = useState<OutreachRow[]>([]);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState("");
  const [bulkSending, setBulkSending] = useState(false);
  const [pasteInput, setPasteInput] = useState("");
  const [showPaste, setShowPaste] = useState(false);

  useEffect(() => {
    fetch("/api/gmail/status")
      .then((r) => r.json())
      .then((d) => { if (d.connected) { setGmailConnected(true); setGmailEmail(d.email); } })
      .catch(() => {});
  }, []);

  const addRow = (email = "", storeUrl = "") => {
    const names = extractNameFromEmail(email);
    const t = templates[0];
    const newRow: OutreachRow = {
      id: Math.random().toString(36).slice(2),
      email, firstName: names.firstName, lastName: names.lastName, storeUrl,
      subject: t.subject,
      body: fillTemplate(t.body, { ...names, email, storeUrl, firstName: names.firstName, lastName: names.lastName } as any),
      status: "new" as OutreachStatus, sending: false, sent: false,
    };
    setRows((prev) => [...prev, newRow]);
  };

  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));

  const updateRow = (id: string, patch: Partial<OutreachRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const applyTemplate = (rowId: string, templateIdx: number) => {
    const t = templates[templateIdx];
    setRows((prev) => prev.map((r) => r.id === rowId ? { ...r, subject: t.subject, body: fillTemplate(t.body, r) } : r));
  };

  const handlePasteEmails = () => {
    const lines = pasteInput.split(/\n|,/).map((l) => l.trim()).filter((l) => l.length > 0);
    lines.forEach((line) => {
      const parts = line.split(/\s+|,/).filter(Boolean);
      const email = parts.find((p) => p.includes("@")) || "";
      const url = parts.find((p) => p.includes(".") && !p.includes("@")) || "";
      if (email) addRow(email, url);
    });
    setPasteInput("");
    setShowPaste(false);
  };

  const sendRow = async (row: OutreachRow) => {
    if (!row.email) return;
    updateRow(row.id, { sending: true, error: undefined });
    try {
      const r = await fetch("/api/gmail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: row.email, subject: row.subject, body: row.body, storeUrl: row.storeUrl }),
      });
      const d = await r.json();
      if (r.ok) {
        updateRow(row.id, { sending: false, sent: true, status: "contacted" as OutreachStatus });
      } else {
        updateRow(row.id, { sending: false, error: d.error || "Failed" });
      }
    } catch {
      updateRow(row.id, { sending: false, error: "Network error" });
    }
  };

  const sendAll = async () => {
    if (!gmailConnected) return alert("Connect Gmail first");
    const toSend = rows.filter((r) => !r.sent && r.email);
    if (toSend.length === 0) return;
    setBulkSending(true);
    for (const row of toSend) {
      await sendRow(row);
      await new Promise((res) => setTimeout(res, 1500));
    }
    setBulkSending(false);
  };

  const verifyEmails = async () => {
    const toVerify = rows.filter((r) => r.email);
    for (const row of toVerify) {
      try {
        const r = await fetch("/api/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: row.email }),
        });
        const d = await r.json();
        updateRow(row.id, { status: d.valid ? ("new" as OutreachStatus) : ("closed" as OutreachStatus) });
      } catch {}
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page title + Gmail status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">{Icons.Send}</div>
            <h1 className="font-bold text-lg tracking-tight">Bulk<span className="text-emerald-400">Outreach</span></h1>
          </div>
          <div className="flex items-center gap-3">
            {!gmailConnected ? (
              <a href="/api/gmail/connect" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium transition-colors">Connect Gmail</a>
            ) : (
              <span className="text-xs text-emerald-400 flex items-center gap-1">{Icons.CheckCircle2} {gmailEmail}</span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button onClick={() => addRow()} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-sm transition-all flex items-center gap-1.5">
            {Icons.Plus} Add Row
          </button>
          <button onClick={() => setShowPaste(!showPaste)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium transition-colors">
            Paste Emails
          </button>
          <button onClick={verifyEmails} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5">
            {Icons.CheckCircle2} Verify All
          </button>
          <button onClick={sendAll} disabled={bulkSending || rows.length === 0}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-sm transition-all disabled:opacity-50 flex items-center gap-1.5 ml-auto">
            {bulkSending ? <span className="animate-spin">{Icons.RefreshCw}</span> : Icons.Send}
            {bulkSending ? "Sending..." : `Send All (${rows.filter((r) => !r.sent).length})`}
          </button>
        </div>

        {/* Paste Area */}
        {showPaste && (
          <div className="overflow-hidden mb-6" style={{ animation: "slideDown 0.2s ease" }}>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">Paste emails (one per line, optional URL after comma or space)</p>
              <textarea value={pasteInput} onChange={(e) => setPasteInput(e.target.value)} rows={4}
                placeholder="john@example.com, https://store.com\nhello@brand.co"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none mb-3" />
              <div className="flex gap-2">
                <button onClick={handlePasteEmails} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-xs transition-all">Add to List</button>
                <button onClick={() => setShowPaste(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Rows */}
        <div className="space-y-4">
          {rows.map((row) => (
            <div key={row.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4" style={{ animation: "fadeIn 0.2s ease" }}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
                <div className="md:col-span-3">
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span className="w-3 h-3">{Icons.Mail}</span> Email
                  </label>
                  <input value={row.email} onChange={(e) => {
                    const email = e.target.value;
                    const names = extractNameFromEmail(email);
                    updateRow(row.id, { email, firstName: names.firstName, lastName: names.lastName, body: fillTemplate(row.body, { ...row, email, firstName: names.firstName, lastName: names.lastName }) });
                  }} placeholder="founder@store.com"
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span className="w-3 h-3">{Icons.User}</span> First Name
                  </label>
                  <input value={row.firstName} onChange={(e) => {
                    const firstName = e.target.value;
                    updateRow(row.id, { firstName, body: fillTemplate(row.body, { ...row, firstName }) });
                  }} placeholder="John"
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span className="w-3 h-3">{Icons.User}</span> Last Name
                  </label>
                  <input value={row.lastName} onChange={(e) => {
                    const lastName = e.target.value;
                    updateRow(row.id, { lastName, body: fillTemplate(row.body, { ...row, lastName }) });
                  }} placeholder="Doe"
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50" />
                </div>
                <div className="md:col-span-3">
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span className="w-3 h-3">{Icons.Globe}</span> Store URL <span className="text-slate-600">(optional)</span>
                  </label>
                  <input value={row.storeUrl} onChange={(e) => updateRow(row.id, { storeUrl: e.target.value })} placeholder="https://store.com"
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50" />
                </div>
                <div className="md:col-span-2 flex items-end gap-2">
                  <button onClick={() => sendRow(row)} disabled={row.sending || !row.email || row.sent}
                    className="flex-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-semibold rounded-lg text-xs transition-all flex items-center justify-center gap-1">
                    {row.sending ? <span className="animate-spin">{Icons.RefreshCw}</span> : row.sent ? <span className="w-3 h-3">{Icons.CheckCircle2}</span> : <span className="w-3 h-3">{Icons.Send}</span>}
                    {row.sending ? "..." : row.sent ? "Sent" : "Send"}
                  </button>
                  <button onClick={() => removeRow(row.id)} className="px-2 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg transition-colors">
                    <span className="w-3 h-3">{Icons.Trash2}</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {templates.map((t, i) => (
                  <button key={i} onClick={() => applyTemplate(row.id, i)} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[10px] font-medium transition-colors">{t.name}</button>
                ))}
              </div>

              <input value={row.subject} onChange={(e) => updateRow(row.id, { subject: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 mb-2" />
              <textarea value={row.body} onChange={(e) => updateRow(row.id, { body: e.target.value })} rows={3}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none" />

              {row.error && (
                <p className="text-rose-400 text-xs mt-2 flex items-center gap-1">
                  <span className="w-3 h-3">{Icons.AlertTriangle}</span> {row.error}
                </p>
              )}
            </div>
          ))}
        </div>

        {rows.length === 0 && (
          <div className="text-center py-16 text-slate-600">
            <div className="w-10 h-10 mx-auto mb-3 opacity-30">{Icons.Send}</div>
            <p className="text-sm">No outreach rows yet. Add one or paste emails above.</p>
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 500px; } }
      `}</style>
    </div>
  );
}