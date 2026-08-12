"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ─── Icons ─── */
const IconUpload = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);
const IconSend = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);
const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconAlert = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
const IconTrash = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);

interface Lead {
  email: string;
  name?: string;
  store?: string;
  url?: string;
  [key: string]: string | undefined;
}

export default function BulkOutreachPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [fromName, setFromName] = useState("");
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState({ sent: 0, failed: 0, total: 0 });
  const [logs, setLogs] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const parseCSV = (text: string): Lead[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const lead: Lead = { email: values[0] || "" };
      headers.forEach((h, i) => {
        if (h !== "email") lead[h] = values[i];
      });
      return lead;
    }).filter((l) => l.email && l.email.includes("@"));
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      alert("Please upload a .csv file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      setLeads(parsed);
      setLogs((prev) => [...prev, `Loaded ${parsed.length} leads from ${file.name}`]);
    };
    reader.readAsText(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const replaceVars = (text: string, lead: Lead): string => {
    return text
      .replace(/{name}/gi, lead.name || "there")
      .replace(/{store}/gi, lead.store || "your store")
      .replace(/{url}/gi, lead.url || "")
      .replace(/{email}/gi, lead.email);
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const sendBulk = async () => {
    if (!leads.length) return alert("Upload leads first");
    if (!subject || !body) return alert("Enter subject and body");
    if (!confirm(`Send to ${leads.length} leads? Gmail limit: ~500/day.`)) return;

    setSending(true);
    setProgress({ sent: 0, failed: 0, total: leads.length });
    setLogs((prev) => [...prev, `Starting bulk send to ${leads.length} leads...`]);

    const token = localStorage.getItem("sb-access-token") || "";

    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      const personalizedSubject = replaceVars(subject, lead);
      const personalizedBody = replaceVars(body, lead);

      try {
        const res = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-supabase-token": token,
          },
          body: JSON.stringify({
            to: lead.email,
            subject: personalizedSubject,
            body: personalizedBody,
            fromName: fromName || undefined,
          }),
        });

        if (res.ok) {
          setProgress((p) => ({ ...p, sent: p.sent + 1 }));
          setLogs((prev) => [...prev, `✅ ${lead.email}`]);
        } else {
          const err = await res.json().catch(() => ({}));
          setProgress((p) => ({ ...p, failed: p.failed + 1 }));
          setLogs((prev) => [...prev, `❌ ${lead.email}: ${err.error || "Failed"}`]);
        }
      } catch (e: any) {
        setProgress((p) => ({ ...p, failed: p.failed + 1 }));
        setLogs((prev) => [...prev, `❌ ${lead.email}: ${e.message}`]);
      }

      // Gmail rate limit: max 1 email per 2 seconds to be safe
      if (i < leads.length - 1) await sleep(2000);
    }

    setSending(false);
    setLogs((prev) => [...prev, `Done! ${progress.sent + (progress.failed > 0 ? 0 : 1)} sent, ${progress.failed} failed.`]);
  };

  const clearAll = () => {
    setLeads([]);
    setLogs([]);
    setProgress({ sent: 0, failed: 0, total: 0 });
  };

  return (
    <div className="min-h-screen bg-[#0b0f1f] text-slate-200">
      {/* ─── Header ─── */}
      <header className="border-b border-slate-800/60 bg-[#0b0f1e]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <img src="/ecomfind_logo.png" alt="EcomFind" className="h-8 w-auto" />
          </a>
          <nav className="hidden md:flex items-center gap-1">
            <a href="/discover" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Audit</a>
            <a href="/leads" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Leads</a>
            <a href="/outreach" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Outreach</a>
            <a href="/bulk-outreach" className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-sm transition-colors">Bulk</a>
            <a href="/dashboard" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Dashboard</a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Bulk Outreach</h1>
          <p className="text-sm text-slate-400">Upload a CSV of leads, compose a template, and send personalized emails via your connected Gmail.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ─── Left: Upload & Leads ─── */}
          <div className="space-y-6">
            {/* Upload */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragOver ? "border-violet-500 bg-violet-500/5" : "border-slate-700 bg-slate-900/40"
              }`}
            >
              <IconUpload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
              <p className="text-sm text-slate-400 mb-2">Drag & drop a CSV file here</p>
              <p className="text-xs text-slate-600 mb-4">or</p>
              <label className="inline-block px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors">
                Browse Files
                <input type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </label>
              <p className="text-[10px] text-slate-600 mt-4">CSV must have an <code className="text-slate-400">email</code> column. Optional: <code className="text-slate-400">name</code>, <code className="text-slate-400">store</code>, <code className="text-slate-400">url</code></p>
            </div>

            {/* Leads List */}
            {leads.length > 0 && (
              <div className="rounded-xl bg-slate-900/40 border border-slate-800 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{leads.length} leads loaded</span>
                  <button onClick={clearAll} className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1">
                    <IconTrash className="w-3 h-3" /> Clear
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {leads.slice(0, 50).map((lead, i) => (
                    <div key={i} className="px-4 py-2 border-b border-slate-800/50 text-xs text-slate-400 flex items-center gap-2">
                      <span className="text-slate-500 w-6">{i + 1}</span>
                      <span className="text-slate-300 flex-1">{lead.email}</span>
                      {lead.name && <span className="text-slate-500">{lead.name}</span>}
                    </div>
                  ))}
                  {leads.length > 50 && (
                    <div className="px-4 py-2 text-xs text-slate-600 text-center">...and {leads.length - 50} more</div>
                  )}
                </div>
              </div>
            )}

            {/* Progress */}
            {progress.total > 0 && (
              <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-white font-medium">Progress</span>
                  <span className="text-slate-400">{progress.sent + progress.failed} / {progress.total}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 transition-all"
                    style={{ width: `${((progress.sent + progress.failed) / progress.total) * 100}%` }}
                  />
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <span className="text-emerald-400 flex items-center gap-1"><IconCheck className="w-3 h-3" /> {progress.sent} sent</span>
                  {progress.failed > 0 && <span className="text-rose-400 flex items-center gap-1"><IconAlert className="w-3 h-3" /> {progress.failed} failed</span>}
                </div>
              </div>
            )}
          </div>

          {/* ─── Right: Template ─── */}
          <div className="space-y-6">
            <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Email Template</h3>
              
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">From Name</label>
                <input
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  placeholder="Your name or agency"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1.5">Subject</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Hi {name}, quick question about {store}"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1.5">Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={10}
                  placeholder={`Hi {name},\n\nI came across {store} and noticed a few things that could boost conversions...\n\nBest,\nYour Name`}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <span>Variables:</span>
                <code className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">{`{name}`}</code>
                <code className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">{`{store}`}</code>
                <code className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">{`{url}`}</code>
                <code className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">{`{email}`}</code>
              </div>

              <button
                onClick={sendBulk}
                disabled={sending || !leads.length || !subject || !body}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>Sending... {progress.sent + progress.failed}/{progress.total}</>
                ) : (
                  <><IconSend className="w-4 h-4" /> Send to {leads.length} Leads</>
                )}
              </button>

              <p className="text-[10px] text-slate-600 text-center">
                Sends 1 email every 2 seconds to stay within Gmail limits. Max ~500/day per account.
              </p>
            </div>

            {/* Logs */}
            {logs.length > 0 && (
              <div className="rounded-xl bg-slate-900/40 border border-slate-800 overflow-hidden">
                <div className="px-4 py-2 border-b border-slate-800 text-xs font-medium text-slate-400">Activity Log</div>
                <div className="max-h-48 overflow-y-auto p-2 space-y-1">
                  {logs.slice(-20).map((log, i) => (
                    <div key={i} className="text-[11px] text-slate-500 font-mono">{log}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}