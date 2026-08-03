"use client";

import React, { useState, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

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
const IconX = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const IconTrash = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);
const IconRefresh = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
);
const IconUser = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const IconMail = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

interface Lead {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  valid: boolean | null;
  status: "pending" | "sending" | "sent" | "failed";
}

export default function BulkOutreachPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [fromName, setFromName] = useState("");
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState({ sent: 0, failed: 0, total: 0 });
  const [logs, setLogs] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [filter, setFilter] = useState<"all" | "valid" | "invalid">("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // ─── Email Validation ───
  const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // ─── Extract Name from Email ───
  const extractName = (email: string): { first: string; last: string } => {
    const local = email.split("@")[0] || "";
    // Remove numbers and dots, split by common separators
    const clean = local.replace(/[0-9]/g, "").replace(/[._-]/g, " ").trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    
    if (parts.length >= 2) {
      return {
        first: parts[0].charAt(0).toUpperCase() + parts[0].slice(1),
        last: parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1),
      };
    }
    if (parts.length === 1) {
      return {
        first: parts[0].charAt(0).toUpperCase() + parts[0].slice(1),
        last: "",
      };
    }
    return { first: "", last: "" };
  };

  // ─── Parse CSV ───
  const parseCSV = (text: string): Lead[] => {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 1) return [];
    
    // Detect if first line is header
    const firstLine = lines[0].toLowerCase();
    const hasHeader = firstLine.includes("email") || firstLine.includes("name");
    const startIdx = hasHeader ? 1 : 0;
    
    const parsed: Lead[] = [];
    let id = 0;
    
    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      const email = cols[0] || "";
      if (!email.includes("@")) continue;
      
      const valid = isValidEmail(email);
      const extracted = extractName(email);
      
      // If CSV has name columns, use those instead
      let firstName = extracted.first;
      let lastName = extracted.last;
      
      if (cols[1] && !cols[1].includes("@")) firstName = cols[1];
      if (cols[2] && !cols[2].includes("@")) lastName = cols[2];
      
      parsed.push({
        id: id++,
        email,
        firstName,
        lastName,
        valid,
        status: "pending",
      });
    }
    
    return parsed;
  };

  // ─── Handle File ───
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
      const validCount = parsed.filter((l) => l.valid).length;
      setLogs((prev) => [
        ...prev,
        `📁 Loaded ${parsed.length.toLocaleString()} leads from ${file.name}`,
        `✅ ${validCount.toLocaleString()} valid emails | ❌ ${(parsed.length - validCount).toLocaleString()} invalid`,
      ]);
    };
    reader.readAsText(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  // ─── Update Lead Name ───
  const updateLeadName = (id: number, field: "firstName" | "lastName", value: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  // ─── Delete Lead ───
  const deleteLead = (id: number) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  // ─── Verify All ───
  const verifyAll = () => {
    setLeads((prev) => prev.map((l) => ({ ...l, valid: isValidEmail(l.email) })));
    const valid = leads.filter((l) => isValidEmail(l.email)).length;
    setLogs((prev) => [...prev, `🔍 Re-verified: ${valid.toLocaleString()} valid, ${(leads.length - valid).toLocaleString()} invalid`]);
  };

  // ─── Replace Template Vars ───
  const replaceVars = (text: string, lead: Lead): string => {
    return text
      .replace(/{firstName}/gi, lead.firstName || "there")
      .replace(/{lastName}/gi, lead.lastName || "")
      .replace(/{name}/gi, `${lead.firstName} ${lead.lastName}`.trim() || "there")
      .replace(/{email}/gi, lead.email);
  };

  // ─── Send Bulk ───
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const sendBulk = async () => {
    const toSend = filteredLeads.filter((l) => l.valid !== false && l.status === "pending");
    if (!toSend.length) return alert("No valid leads to send");
    if (!subject || !body) return alert("Enter subject and body");
    if (!confirm(`Send to ${toSend.length} leads?`)) return;

    setSending(true);
    setProgress({ sent: 0, failed: 0, total: toSend.length });
    setLogs((prev) => [...prev, `🚀 Starting bulk send to ${toSend.length} leads...`]);

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || "";

    for (let i = 0; i < toSend.length; i++) {
      const lead = toSend[i];
      const personalizedSubject = replaceVars(subject, lead);
      const personalizedBody = replaceVars(body, lead);

      // Mark as sending
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: "sending" } : l)));

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
          setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: "sent" } : l)));
          setProgress((p) => ({ ...p, sent: p.sent + 1 }));
          setLogs((prev) => [...prev, `✅ ${lead.email}`]);
        } else {
          const err = await res.json().catch(() => ({}));
          setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: "failed" } : l)));
          setProgress((p) => ({ ...p, failed: p.failed + 1 }));
          setLogs((prev) => [...prev, `❌ ${lead.email}: ${err.error || "Failed"}`]);
        }
      } catch (e: any) {
        setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: "failed" } : l)));
        setProgress((p) => ({ ...p, failed: p.failed + 1 }));
        setLogs((prev) => [...prev, `❌ ${lead.email}: ${e.message}`]);
      }

      // Rate limit: 1 email every 2 seconds
      if (i < toSend.length - 1) await sleep(2000);
    }

    setSending(false);
    setLogs((prev) => [...prev, `🎉 Done! ${progress.sent} sent, ${progress.failed} failed.`]);
  };

  // ─── Filtered Leads ───
  const filteredLeads = leads.filter((l) => {
    if (filter === "valid") return l.valid !== false;
    if (filter === "invalid") return l.valid === false;
    return true;
  });

  const validCount = leads.filter((l) => l.valid !== false).length;
  const pendingCount = leads.filter((l) => l.valid !== false && l.status === "pending").length;
  const sentCount = leads.filter((l) => l.status === "sent").length;

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

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ─── Top Bar ─── */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Bulk Outreach</h1>
            <p className="text-sm text-slate-400">Import up to 10,000 leads. Auto-verify emails. Blast 50+ with one click.</p>
          </div>
          {leads.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-sm">
                <span className="text-slate-500">Total:</span> <span className="text-white font-bold">{leads.length.toLocaleString()}</span>
                <span className="text-slate-600 mx-2">|</span>
                <span className="text-emerald-400">{validCount.toLocaleString()} valid</span>
                <span className="text-slate-600 mx-2">|</span>
                <span className="text-violet-400">{sentCount.toLocaleString()} sent</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* ─── Left: Upload & Leads Table ─── */}
          <div className="xl:col-span-2 space-y-6">
            {/* Upload Zone */}
            {leads.length === 0 && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
                  dragOver ? "border-violet-500 bg-violet-500/5" : "border-slate-700 bg-slate-900/30"
                }`}
              >
                <IconUpload className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-lg text-white font-medium mb-2">Drop your CSV here</p>
                <p className="text-sm text-slate-500 mb-6">or click to browse</p>
                <label className="inline-block px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl cursor-pointer transition-colors">
                  Choose File
                  <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                </label>
                <p className="text-xs text-slate-600 mt-6 max-w-md mx-auto">
                  CSV format: <code className="text-slate-400">email</code> (required), 
                  <code className="text-slate-400">firstName</code>, 
                  <code className="text-slate-400">lastName</code> (optional). 
                  We'll auto-extract names from Gmail addresses.
                </p>
              </div>
            )}

            {/* Leads Table */}
            {leads.length > 0 && (
              <div className="rounded-xl bg-slate-900/40 border border-slate-800 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setFilter("all")} className={`px-3 py-1 rounded-lg text-xs font-medium transition ${filter === "all" ? "bg-slate-700 text-white" : "text-slate-500 hover:text-white"}`}>All</button>
                    <button onClick={() => setFilter("valid")} className={`px-3 py-1 rounded-lg text-xs font-medium transition ${filter === "valid" ? "bg-emerald-500/20 text-emerald-400" : "text-slate-500 hover:text-white"}`}>Valid</button>
                    <button onClick={() => setFilter("invalid")} className={`px-3 py-1 rounded-lg text-xs font-medium transition ${filter === "invalid" ? "bg-rose-500/20 text-rose-400" : "text-slate-500 hover:text-white"}`}>Invalid</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={verifyAll} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
                      <IconRefresh className="w-3 h-3" /> Re-verify
                    </button>
                    <button onClick={() => { setLeads([]); setLogs([]); setProgress({ sent: 0, failed: 0, total: 0 }); fileInputRef.current && (fileInputRef.current.value = ""); }} className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors">
                      <IconTrash className="w-3 h-3" /> Clear All
                    </button>
                  </div>
                </div>

                <div className="max-h-[500px] overflow-y-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-950/50 sticky top-0">
                      <tr className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">
                        <th className="px-4 py-2">#</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">First Name</th>
                        <th className="px-4 py-2">Last Name</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {filteredLeads.slice(0, 100).map((lead, idx) => (
                        <tr key={lead.id} className="text-xs group hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-2.5 text-slate-600">{idx + 1}</td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <IconMail className="w-3 h-3 text-slate-600" />
                              <span className="text-slate-300">{lead.email}</span>
                              {lead.valid === false && <span className="text-[9px] px-1.5 py-0.5 bg-rose-500/10 text-rose-400 rounded">Invalid</span>}
                              {lead.valid === true && <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">Valid</span>}
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            <input
                              value={lead.firstName}
                              onChange={(e) => updateLeadName(lead.id, "firstName", e.target.value)}
                              className="w-full bg-transparent text-slate-300 text-xs focus:outline-none focus:text-white border-b border-transparent focus:border-violet-500/50 pb-0.5"
                              placeholder="First"
                            />
                          </td>
                          <td className="px-4 py-2.5">
                            <input
                              value={lead.lastName}
                              onChange={(e) => updateLeadName(lead.id, "lastName", e.target.value)}
                              className="w-full bg-transparent text-slate-300 text-xs focus:outline-none focus:text-white border-b border-transparent focus:border-violet-500/50 pb-0.5"
                              placeholder="Last"
                            />
                          </td>
                          <td className="px-4 py-2.5">
                            {lead.status === "pending" && <span className="text-slate-500">Ready</span>}
                            {lead.status === "sending" && <span className="text-amber-400">Sending...</span>}
                            {lead.status === "sent" && <span className="text-emerald-400 flex items-center gap-1"><IconCheck className="w-3 h-3" /> Sent</span>}
                            {lead.status === "failed" && <span className="text-rose-400">Failed</span>}
                          </td>
                          <td className="px-4 py-2.5">
                            <button onClick={() => deleteLead(lead.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 transition-all">
                              <IconX className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredLeads.length > 100 && (
                    <div className="px-4 py-3 text-xs text-slate-600 text-center border-t border-slate-800">
                      ...and {filteredLeads.length - 100} more (showing first 100)
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ─── Right: Template & Send ─── */}
          <div className="space-y-6">
            {/* Template Card */}
            <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <IconSend className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Email Template</h3>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1.5">From Name</label>
                <input
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1.5">Subject</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Hi {firstName}, quick question..."
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1.5">Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={8}
                  placeholder={`Hi {firstName},\n\nI came across your store and wanted to reach out...\n\nBest,\n${fromName || "Your Name"}`}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] text-slate-600">Variables:</span>
                {["{firstName}", "{lastName}", "{name}", "{email}"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setBody((prev) => prev + v)}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-400 hover:text-white transition-colors"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Send Card */}
            <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-white">Ready to Send</span>
                <span className="text-xs text-slate-500">{pendingCount} pending</span>
              </div>

              {progress.total > 0 && (
                <div className="mb-4">
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-violet-500 transition-all"
                      style={{ width: `${((progress.sent + progress.failed) / progress.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400">{progress.sent} sent</span>
                    {progress.failed > 0 && <span className="text-rose-400">{progress.failed} failed</span>}
                    <span className="text-slate-500">{progress.total} total</span>
                  </div>
                </div>
              )}

              <button
                onClick={sendBulk}
                disabled={sending || pendingCount === 0 || !subject || !body}
                className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>Sending {progress.sent + progress.failed}/{progress.total}...</>
                ) : (
                  <><IconSend className="w-4 h-4" /> Send to {pendingCount} Leads</>
                )}
              </button>

              <p className="text-[10px] text-slate-600 text-center mt-3">
                1 email every 2 seconds. Respects Gmail's 500/day limit.
              </p>
            </div>

            {/* Logs */}
            {logs.length > 0 && (
              <div className="rounded-xl bg-slate-900/40 border border-slate-800 overflow-hidden">
                <div className="px-4 py-2 border-b border-slate-800 text-xs font-medium text-slate-400 flex items-center gap-2">
                  <IconRefresh className="w-3 h-3" /> Activity Log
                </div>
                <div className="max-h-40 overflow-y-auto p-3 space-y-1">
                  {logs.slice(-30).map((log, i) => (
                    <div key={i} className="text-[10px] text-slate-500 font-mono leading-tight">{log}</div>
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