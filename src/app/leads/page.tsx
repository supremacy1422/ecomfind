"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ─── CSV Parser ─── */
function parseCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') { cell += '"'; i++; } else { inQuotes = false; }
      } else { cell += char; }
    } else {
      if (char === '"') { inQuotes = true; }
      else if (char === ',') { row.push(cell.trim()); cell = ""; }
      else if (char === '\n') { row.push(cell.trim()); if (row.some(c => c.length > 0)) result.push(row); row = []; cell = ""; }
      else if (char !== '\r') { cell += char; }
    }
  }
  if (cell.length > 0 || row.length > 0) { row.push(cell.trim()); if (row.some(c => c.length > 0)) result.push(row); }
  return result;
}

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
const IconFilter = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
);
const IconChevronLeft = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
);
const IconChevronRight = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
);
const IconUsers = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IconStar = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
const IconMessage = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const IconWorld = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
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
  quality_score?: number;
  status?: string;
  source?: string;
  created_at?: string;
}

interface StoreResult {
  domain: string;
  shopifyDomain?: string;
  email?: string;
  country?: string;
  industry?: string;
}

const QUICK_FILTERS = ["fashion", "jewelry", "home", "beauty", "fitness", "electronics", "pets"];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [nicheFilter, setNicheFilter] = useState("all");
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const [osintLoading, setOsintLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  /* ─── StoreIndex State ─── */
  const [siCountry, setSiCountry] = useState("US");
  const [siIndustry, setSiIndustry] = useState("");
  const [siProducts, setSiProducts] = useState("10-50");
  const [siResults, setSiResults] = useState<StoreResult[]>([]);
  const [siLoading, setSiLoading] = useState(false);
  const [siError, setSiError] = useState("");
  const [siImporting, setSiImporting] = useState(false);
  const [siImportCount, setSiImportCount] = useState(0);

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (!error && data) setLeads(data);
    setLoading(false);
  }, []);

  /* ─── StoreIndex Search ─── */
  const searchStoreIndex = async () => {
    setSiLoading(true);
    setSiError("");
    setSiResults([]);
    try {
      const res = await fetch("/api/leads/storeindex-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: siCountry || undefined,
          industry: siIndustry || undefined,
          minProducts: parseInt(siProducts.split("-")[0]) || undefined,
          maxProducts: siProducts.includes("+") ? undefined : parseInt(siProducts.split("-")[1]) || undefined,
          limit: 20,
          page: 1,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSiError(json.error || `API error: ${res.status}`);
        return;
      }
      if (!json.stores || json.stores.length === 0) {
        setSiError("No stores found. Try broader filters (Any country, All Industries).");
        return;
      }
      setSiResults(json.stores);
    } catch (err: any) {
      setSiError(err.message || "Network error.");
    } finally {
      setSiLoading(false);
    }
  };

  const importStoreIndex = async () => {
    if (siResults.length === 0) return;
    setSiImporting(true);
    setSiError("");
    try {
      const res = await fetch("/api/leads/storeindex-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stores: siResults }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSiError(json.error || "Import failed");
      } else {
        setSiImportCount(json.imported || 0);
        setSiResults([]);
        fetchLeads();
      }
    } catch (err: any) {
      setSiError(err.message || "Import error");
    } finally {
      setSiImporting(false);
    }
  };

  /* ─── Filtering ─── */
  const filteredLeads = useMemo(() => {
    let result = leads;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(l => l.domain?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.country?.toLowerCase().includes(q) || l.industry?.toLowerCase().includes(q));
    }
    if (activeQuickFilter) result = result.filter(l => l.industry?.toLowerCase().includes(activeQuickFilter.toLowerCase()));
    if (nicheFilter !== "all") result = result.filter(l => l.industry?.toLowerCase().includes(nicheFilter.toLowerCase()));
    return result;
  }, [leads, search, activeQuickFilter, nicheFilter]);

  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  useEffect(() => { setCurrentPage(1); }, [search, activeQuickFilter, nicheFilter]);

  const stats = useMemo(() => ({
    total: leads.length,
    validEmails: leads.filter(l => l.email && l.email.length > 3).length,
    highQuality: leads.filter(l => (l.quality_score || 0) >= 70).length,
    uncontacted: leads.filter(l => !l.status || l.status === "new").length,
  }), [leads]);

  const toggleSelect = (id: string) => {
    setSelected(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  const selectAllOnPage = () => {
    const pageIds = paginatedLeads.map(l => l.id);
    const allSelected = pageIds.every(id => selected.has(id));
    setSelected(prev => { const next = new Set(prev); if (allSelected) pageIds.forEach(id => next.delete(id)); else pageIds.forEach(id => next.add(id)); return next; });
  };

  const selectAllWithEmail = () => {
    const emailIds = filteredLeads.filter(l => l.email).map(l => l.id);
    setSelected(prev => { const next = new Set(prev); emailIds.forEach(id => next.add(id)); return next; });
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected leads?`)) return;
    await supabase.from("leads").delete().in("id", Array.from(selected));
    setSelected(new Set());
    fetchLeads();
  };

  /* ─── CSV Import ─── */
  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { setImportError("File exceeds 4MB."); return; }
    const text = await file.text();
    parseAndImport(text);
  };

  const parseAndImport = async (text: string) => {
    setImportError("");
    const parsed = parseCSV(text);
    if (parsed.length < 2) { setImportError("CSV needs header + data row."); return; }
    const headers = parsed[0].map(h => h.toLowerCase().trim().replace(/^["']|["']$/g, ""));
    const getCol = (names: string[]) => { for (const n of names) { const i = headers.indexOf(n.toLowerCase()); if (i !== -1) return i; } return -1; };
    const domainIdx = getCol(["domain","store_name","store name","name","url","website","site"]);
    const emailIdx = getCol(["email","e-mail","contact_email","contact email"]);
    if (domainIdx === -1 && emailIdx === -1) { setImportError("Need domain or email column."); return; }

    const rows: any[] = [];
    for (let i = 1; i < parsed.length; i++) {
      const vals = parsed[i];
      const row: any = { source: "csv_import", created_at: new Date().toISOString() };
      const domain = domainIdx !== -1 ? vals[domainIdx]?.trim() : "";
      const email = emailIdx !== -1 ? vals[emailIdx]?.trim() : "";
      if (!domain && !email) continue;
      if (domain) row.domain = domain;
      if (email) row.email = email;
      rows.push(row);
    }
    if (rows.length === 0) { setImportError("No valid rows."); return; }
    const { error } = await supabase.from("leads").upsert(rows, { onConflict: "domain" });
    if (error) setImportError(error.message);
    else { setShowImport(false); setImportText(""); fetchLeads(); }
  };

  const downloadCSV = () => {
    const headers = ["domain","email","first_name","last_name","country","industry","company_size","revenue_range","quality_score","status"];
    const rows = filteredLeads.map(l => [l.domain||"",l.email||"",l.first_name||"",l.last_name||"",l.country||"",l.industry||"",l.company_size||"",l.revenue_range||"",l.quality_score||"",l.status||""].map(v => `"${String(v).replace(/"/g,'""')}"`).join(","));
    const csv = [headers.join(","),...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `ecomfind-leads-${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const findEmailOSINT = async (lead: Lead) => {
    if (!lead.domain) return;
    setOsintLoading(lead.id);
    try {
      const res = await fetch("/api/leads/discover", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ domain: lead.domain }) });
      const json = await res.json();
      if (json.emails?.length > 0) { await supabase.from("leads").update({ email: json.emails[0] }).eq("id", lead.id); fetchLeads(); }
    } catch {} finally { setOsintLoading(null); }
  };

  const qualityColor = (score?: number) => {
    if (!score) return "bg-slate-800 text-slate-400 border-slate-700";
    if (score >= 80) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (score >= 60) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    if (score >= 40) return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  };
  const qualityLabel = (score?: number) => { if (!score) return "—"; if (score >= 80) return "Excellent"; if (score >= 60) return "Good"; if (score >= 40) return "Fair"; return "Poor"; };

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
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center"><IconZap className="w-5 h-5 text-violet-400" /></div>
            <span className="font-bold text-white tracking-tight">EcomFind</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <a href="/discover" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Audit</a>
            <a href="/leads" className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 text-sm font-medium border border-violet-500/20">Leads</a>
            <a href="/outreach" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Outreach</a>
            <a href="/about" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">About</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Lead Discovery Engine</h1>
          <p className="text-slate-400">Find Shopify stores with validated owner emails and high-intent signals.</p>
        </div>

        {/* ─── StoreIndex Search (Inline, no modal) ─── */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <IconWorld className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">StoreIndex Search</h3>
            {siImportCount > 0 && <span className="ml-auto text-xs text-emerald-400">✓ {siImportCount} imported</span>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Country</label>
              <select value={siCountry} onChange={e => setSiCountry(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white">
                <option value="US">United States</option><option value="GB">United Kingdom</option><option value="CA">Canada</option>
                <option value="AU">Australia</option><option value="DE">Germany</option><option value="FR">France</option>
                <option value="SE">Sweden</option><option value="NL">Netherlands</option><option value="">Any</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Industry</label>
              <select value={siIndustry} onChange={e => setSiIndustry(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white">
                <option value="">All Industries</option>
                {QUICK_FILTERS.map(f => <option key={f} value={f.charAt(0).toUpperCase()+f.slice(1)}>{f.charAt(0).toUpperCase()+f.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Products</label>
              <select value={siProducts} onChange={e => setSiProducts(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white">
                <option value="1-10">1-10</option><option value="10-50">10-50</option><option value="50-100">50-100</option>
                <option value="100-500">100-500</option><option value="500-99999">500+</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={searchStoreIndex} disabled={siLoading} className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-sm disabled:opacity-50">
                {siLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
          {siError && (
  <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
    {siError}
    <button 
      onClick={() => {
        const demoStores = [
          { domain: "fashionnova.com", country: "US", industry: "Fashion", email: "contact@fashionnova.com" },
          { domain: "gymshark.com", country: "GB", industry: "Fitness", email: "support@gymshark.com" },
          { domain: "allbirds.com", country: "US", industry: "Fashion", email: "hello@allbirds.com" },
          { domain: "glossier.com", country: "US", industry: "Beauty", email: "press@glossier.com" },
          { domain: "mvmt.com", country: "US", industry: "Jewelry", email: "hello@mvmt.com" },
          { domain: "bombas.com", country: "US", industry: "Fashion", email: "help@bombas.com" },
          { domain: "brooklinen.com", country: "US", industry: "Home", email: "hello@brooklinen.com" },
          { domain: "mejuri.com", country: "CA", industry: "Jewelry", email: "care@mejuri.com" },
        ];
        setSiResults(demoStores);
        setSiError("");
      }}
      className="ml-2 underline hover:text-rose-300 cursor-pointer"
    >
      Load demo data instead
    </button>
  </div>
)}
          {siResults.length > 0 && (
            <div className="border-t border-slate-800 pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400">{siResults.length} stores found</span>
                <button onClick={importStoreIndex} disabled={siImporting} className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold disabled:opacity-50">
                  {siImporting ? "Importing..." : "Import All to Leads"}
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {siResults.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{s.domain || s.shopifyDomain || "Unknown"}</p>
                      <p className="text-xs text-slate-500">{s.country} {s.industry && `· ${s.industry}`} {s.email && `· ${s.email}`}</p>
                    </div>
                    {s.email && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">Has Email</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {!siLoading && !siError && siResults.length === 0 && (
            <div className="text-center py-6 text-slate-600"><p className="text-xs">No results yet. Use filters and click Search.</p></div>
          )}
        </div>

        {/* Search & Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by domain, email, country, or niche..." className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
            </div>
            <select value={nicheFilter} onChange={e => setNicheFilter(e.target.value)} className="px-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-slate-300">
              <option value="all">All Niches</option>
              {QUICK_FILTERS.map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase()+f.slice(1)}</option>)}
            </select>
            <button onClick={() => { setSearch(""); setNicheFilter("all"); setActiveQuickFilter(null); }} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm text-slate-300">Clear</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowImport(!showImport)} className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-sm flex items-center gap-2"><IconUpload className="w-4 h-4" /> Import CSV</button>
            <button onClick={downloadCSV} disabled={filteredLeads.length===0} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm disabled:opacity-50 flex items-center gap-2"><IconDownload className="w-4 h-4" /> Export</button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {QUICK_FILTERS.map(filter => (
            <button key={filter} onClick={() => setActiveQuickFilter(activeQuickFilter===filter?null:filter)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${activeQuickFilter===filter?"bg-violet-500/20 text-violet-300 border-violet-500/30":"bg-slate-900/60 text-slate-400 border-slate-700 hover:border-slate-600"}`}>
              {filter.charAt(0).toUpperCase()+filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5"><div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Leads</div><div className="text-2xl font-bold text-white">{stats.total}</div></div>
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5"><div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Valid Emails</div><div className="text-2xl font-bold text-emerald-400">{stats.validEmails}</div></div>
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5"><div className="text-xs text-slate-500 uppercase tracking-wider mb-1">High Quality</div><div className="text-2xl font-bold text-violet-400">{stats.highQuality}</div></div>
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5"><div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Uncontacted</div><div className="text-2xl font-bold text-amber-400">{stats.uncontacted}</div></div>
        </div>

        {/* Import Panel */}
        {showImport && (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 mb-8">
            <div className="flex items-start gap-3 mb-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
              <IconAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div><p className="text-sm text-amber-400 font-medium">File Size Limit: 4MB</p><p className="text-xs text-slate-400">Upload CSV with columns: domain, email, first_name, last_name, country, industry, etc.</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Upload CSV</label>
                <input type="file" accept=".csv" onChange={handleCSVUpload} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-violet-600 file:text-white file:text-xs file:font-semibold" />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Or Paste CSV</label>
                <textarea value={importText} onChange={e => setImportText(e.target.value)} rows={3} placeholder="domain,email,first_name..." className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-600 resize-none mb-2" />
                <button onClick={() => parseAndImport(importText)} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg text-xs">Import Pasted Data</button>
              </div>
            </div>
            {importError && <p className="text-rose-400 text-sm mt-3 flex items-center gap-1"><IconAlert className="w-4 h-4" /> {importError}</p>}
          </div>
        )}

        {/* Bulk Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <button onClick={selectAllOnPage} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-300">Select All on Page</button>
            <button onClick={selectAllWithEmail} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-300">Select All With Email</button>
            {selected.size > 0 && <button onClick={deleteSelected} className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-medium flex items-center gap-1.5"><IconTrash className="w-3 h-3" /> Delete ({selected.size})</button>}
          </div>
          <span className="text-xs text-slate-500">Showing {paginatedLeads.length} of {filteredLeads.length} leads · Page {currentPage} of {totalPages}</span>
        </div>

        {/* Lead Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({length:6}).map((_,i) => <div key={i} className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5 animate-pulse"><div className="h-4 bg-slate-800 rounded w-3/4 mb-3"></div><div className="h-3 bg-slate-800 rounded w-1/2 mb-2"></div><div className="h-3 bg-slate-800 rounded w-2/3"></div></div>)}
          </div>
        ) : paginatedLeads.length === 0 ? (
          <div className="text-center py-20 text-slate-600"><IconGlobe className="w-12 h-12 mx-auto mb-4 opacity-30" /><p className="text-sm mb-2">No leads found.</p><p className="text-xs">Import a CSV or search StoreIndex to get started.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            {paginatedLeads.map(lead => (
              <div key={lead.id} className={`group rounded-2xl border p-5 transition-all hover:scale-[1.01] ${selected.has(lead.id)?"bg-violet-500/5 border-violet-500/30":"bg-slate-900/40 border-slate-800 hover:border-slate-700"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={selected.has(lead.id)} onChange={() => toggleSelect(lead.id)} className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-violet-500" />
                    <div>
                      <a href={`https://${lead.domain}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white hover:text-violet-400 transition-colors">{lead.domain}</a>
                      <p className="text-xs text-slate-500">{lead.country || "Unknown location"}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${qualityColor(lead.quality_score)}`}>{qualityLabel(lead.quality_score)}</span>
                </div>
                <div className="space-y-2 mb-4">
                  {lead.industry && <div className="flex items-center gap-2 text-xs text-slate-400"><IconFilter className="w-3 h-3" /><span className="capitalize">{lead.industry}</span></div>}
                  {lead.email ? <div className="flex items-center gap-2 text-xs text-emerald-400"><IconCheck className="w-3 h-3" /><span className="truncate">{lead.email}</span></div> : <div className="flex items-center gap-2 text-xs text-slate-500"><IconMail className="w-3 h-3" /><span>No email</span></div>}
                  {lead.company_size && <div className="flex items-center gap-2 text-xs text-slate-400"><IconUsers className="w-3 h-3" /><span>{lead.company_size}</span></div>}
                  {lead.revenue_range && <div className="flex items-center gap-2 text-xs text-slate-400"><IconStar className="w-3 h-3" /><span>{lead.revenue_range}</span></div>}
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                  {lead.email ? (
                    <a href={`/outreach?email=${encodeURIComponent(lead.email)}&domain=${encodeURIComponent(lead.domain)}`} className="flex-1 px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"><IconMessage className="w-3 h-3" /> Audit & Outreach</a>
                  ) : (
                    <button onClick={() => findEmailOSINT(lead)} disabled={osintLoading===lead.id} className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 border border-slate-700">
                      {osintLoading===lead.id ? <span className="animate-spin w-3 h-3 border-2 border-slate-500 border-t-transparent rounded-full" /> : <IconSearch className="w-3 h-3" />}
                      Find Email
                    </button>
                  )}
                  <button onClick={async () => { if(!confirm("Delete this lead?"))return; await supabase.from("leads").delete().eq("id",lead.id); fetchLeads(); }} className="p-2 text-slate-500 hover:text-rose-400 transition-colors"><IconTrash className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1,p-1))} disabled={currentPage===1} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 disabled:opacity-40"><IconChevronLeft className="w-4 h-4" /></button>
            {Array.from({length:totalPages},(_,i)=>i+1).map(page => <button key={page} onClick={() => setCurrentPage(page)} className={`w-9 h-9 rounded-lg text-sm font-medium ${currentPage===page?"bg-violet-600 text-white":"bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300"}`}>{page}</button>)}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages,p+1))} disabled={currentPage===totalPages} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 disabled:opacity-40"><IconChevronRight className="w-4 h-4" /></button>
          </div>
        )}
      </main>
    </div>
  );
}