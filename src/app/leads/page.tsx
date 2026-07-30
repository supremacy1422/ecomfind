"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import StoreIndexSearch from "@/components/StoreIndexSearch";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ─── Icons ─── */
const IconSearch = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const IconUpload = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);
const IconDownload = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);
const IconMail = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconTrash = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);
const IconGlobe = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
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
const IconPlus = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

interface Lead {
  id: string;
  domain: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  country?: string;
  industry?: string;
  company_size?: string;
  revenue_range?: string;
  active_products?: string;
  installed_apps?: string[];
  quality_score?: number;
  status?: string;
  source?: string;
  created_at?: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const [osintLoading, setOsintLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    fetchLeads();
  }, []);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (!error && data) setLeads(data);
    setLoading(false);
  }, []);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === filteredLeads.length) setSelected(new Set());
    else setSelected(new Set(filteredLeads.map(l => l.id)));
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    await supabase.from("leads").delete().in("id", ids);
    setSelected(new Set());
    fetchLeads();
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setImportError("File exceeds 4MB limit.");
      return;
    }
    const text = await file.text();
    parseAndImport(text);
  };

  const parseAndImport = async (text: string) => {
    setImportError("");
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) { setImportError("CSV must have a header row and at least one data row."); return; }
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const rows: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(",");
      const row: any = { source: "csv_import", created_at: new Date().toISOString() };
      headers.forEach((h, idx) => {
        if (h === "email") row.email = vals[idx]?.trim();
        if (h === "domain") row.domain = vals[idx]?.trim();
        if (h === "first_name") row.first_name = vals[idx]?.trim();
        if (h === "last_name") row.last_name = vals[idx]?.trim();
        if (h === "country") row.country = vals[idx]?.trim();
        if (h === "industry") row.industry = vals[idx]?.trim();
      });
      if (row.domain || row.email) rows.push(row);
    }
    if (rows.length === 0) { setImportError("No valid rows found."); return; }
    const { error } = await supabase.from("leads").upsert(rows, { onConflict: "domain" });
    if (error) setImportError(error.message);
    else { setShowImport(false); setImportText(""); fetchLeads(); }
  };

  const handlePasteImport = () => {
    parseAndImport(importText);
  };

  const downloadCSV = () => {
    const headers = ["domain", "email", "first_name", "last_name", "country", "industry", "company_size", "revenue_range", "quality_score", "status"];
    const rows = filteredLeads.map(l => [
      l.domain || "", l.email || "", l.first_name || "", l.last_name || "",
      l.country || "", l.industry || "", l.company_size || "", l.revenue_range || "",
      l.quality_score || "", l.status || ""
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenueai-leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const findEmailOSINT = async (lead: Lead) => {
    if (!lead.domain) return;
    setOsintLoading(lead.id);
    try {
      const res = await fetch("/api/leads/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: lead.domain }),
      });
      const json = await res.json();
      if (json.emails && json.emails.length > 0) {
        await supabase.from("leads").update({ email: json.emails[0] }).eq("id", lead.id);
        fetchLeads();
      }
    } catch {
      // ignore
    } finally {
      setOsintLoading(null);
    }
  };

  const filteredLeads = leads.filter(l => {
    const q = search.toLowerCase();
    return (l.domain?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.country?.toLowerCase().includes(q) || l.industry?.toLowerCase().includes(q));
  });

  const qualityColor = (score?: number) => {
    if (!score) return "text-slate-500";
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    if (score >= 40) return "text-orange-400";
    return "text-rose-400";
  };

  return (
    <div className="min-h-screen bg-[#0b0f1f] text-slate-200">
      {/* Nav */}
      <header className="border-b border-slate-800/60 bg-[#0b0f1e]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mr-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span className="text-sm font-medium hidden sm:inline">Home</span>
            </a>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <IconZap className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-bold text-white tracking-tight">RevenueAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <a href="/discover" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Audit</a>
            <a href="/leads" className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20">Leads</a>
            <a href="/outreach" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Outreach</a>
            <a href="/about" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">About</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Lead Management</h1>
            <p className="text-sm text-slate-400 mt-1">Import, discover, and manage your outreach targets.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{leads.length} total leads</span>
          </div>
        </div>

        {/* StoreIndex Search */}
        <StoreIndexSearch onImport={fetchLeads} />

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button onClick={() => setShowImport(!showImport)} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-sm transition-all flex items-center gap-1.5">
            <IconUpload className="w-4 h-4" /> Import CSV
          </button>
          <button onClick={downloadCSV} disabled={filteredLeads.length === 0} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50">
            <IconDownload className="w-4 h-4" /> Export CSV
          </button>
          {selected.size > 0 && (
            <button onClick={deleteSelected} className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5">
              <IconTrash className="w-4 h-4" /> Delete ({selected.size})
            </button>
          )}
          <div className="relative flex-1 min-w-[200px] ml-auto">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40" />
          </div>
        </div>

        {/* Import Panel */}
        {showImport && (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 mb-6">
            <div className="flex items-start gap-3 mb-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
              <IconAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-400 font-medium">File Size Limit: 4MB</p>
                <p className="text-xs text-slate-400">Upload CSV files only. Max 4MB per file. Supported columns: domain, email, first_name, last_name, country, industry.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Upload CSV File</label>
                <input type="file" accept=".csv" onChange={handleCSVUpload}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-emerald-500 file:text-slate-950 file:text-xs file:font-semibold hover:file:bg-emerald-400" />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Or Paste CSV Content</label>
                <textarea value={importText} onChange={(e) => setImportText(e.target.value)} rows={3} placeholder="domain,email,first_name..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none mb-2" />
                <button onClick={handlePasteImport} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-xs transition-all">Import Pasted Data</button>
              </div>
            </div>
            {importError && <p className="text-rose-400 text-sm mt-3 flex items-center gap-1"><IconAlert className="w-4 h-4" /> {importError}</p>}
          </div>
        )}

        {/* Leads Table */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-950/50">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input type="checkbox" checked={filteredLeads.length > 0 && selected.size === filteredLeads.length} onChange={selectAll}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500/50" />
                  </th>
                  <th className="px-4 py-3">Domain</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Industry</th>
                  <th className="px-4 py-3">Quality</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(lead.id)} onChange={() => toggleSelect(lead.id)}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500/50" />
                    </td>
                    <td className="px-4 py-3">
                      <a href={`https://${lead.domain}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-medium">{lead.domain}</a>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {lead.email ? (
                        <span className="flex items-center gap-1"><IconMail className="w-3 h-3 text-slate-500" /> {lead.email}</span>
                      ) : (
                        <button onClick={() => findEmailOSINT(lead)} disabled={osintLoading === lead.id}
                          className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 transition-colors flex items-center gap-1">
                          {osintLoading === lead.id ? <span className="animate-spin w-3 h-3 border-2 border-slate-500 border-t-transparent rounded-full" /> : <IconSearch className="w-3 h-3" />}
                          Find Email
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400">{lead.country || "—"}</td>
                    <td className="px-4 py-3 text-slate-400">{lead.industry || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${qualityColor(lead.quality_score)}`}>{lead.quality_score ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${lead.status === "contacted" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : lead.status === "replied" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-slate-800 text-slate-400 border-slate-700"}`}>
                        {lead.status || "new"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {lead.email && (
                          <a href={`/outreach?email=${encodeURIComponent(lead.email)}`}
                            className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded text-xs border border-emerald-500/20 transition-colors flex items-center gap-1">
                            <IconMail className="w-3 h-3" /> Outreach
                          </a>
                        )}
                        <button onClick={async () => { await supabase.from("leads").delete().eq("id", lead.id); fetchLeads(); }}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors">
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredLeads.length === 0 && !loading && (
            <div className="text-center py-16 text-slate-600">
              <IconGlobe className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No leads yet. Import a CSV or search StoreIndex above.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}