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
        if (nextChar === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(cell.trim());
        cell = "";
      } else if (char === '\n') {
        row.push(cell.trim());
        if (row.some((c) => c.length > 0)) result.push(row);
        row = [];
        cell = "";
      } else if (char !== '\r') {
        cell += char;
      }
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell.trim());
    if (row.some((c) => c.length > 0)) result.push(row);
  }
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
const IconChevronLeft = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
);
const IconChevronRight = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
);
const IconMessage = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const IconWorld = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const IconStar = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
const IconX = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const IconPencil = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
);
const IconHistory = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>
);

interface Lead {
  id: string;
  store_name: string;
  store_url: string;
  email?: string;
  score?: number;
  status?: string;
  notes?: string;
  outreach_text?: string;
  created_at?: string;
}

interface StoreResult {
  domain: string;
  shopifyDomain?: string;
  email?: string;
  country?: string;
  industry?: string;
  createdAt?: string;
}

interface Activity {
  id: string;
  type: "draft" | "sent" | "scheduled" | "opened" | "replied";
  to: string;
  subject: string;
  body: string;
  scheduledFor?: string;
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const [siCountry, setSiCountry] = useState("US");
  const [siIndustry, setSiIndustry] = useState("");
  const [siProducts, setSiProducts] = useState("10-50");
  const [siYear, setSiYear] = useState("");
  const [siMonth, setSiMonth] = useState("");
  const [siDay, setSiDay] = useState("");
  const [siResults, setSiResults] = useState<StoreResult[]>([]);
  const [siLoading, setSiLoading] = useState(false);
  const [siError, setSiError] = useState("");
  const [siImporting, setSiImporting] = useState(false);
  const [siImportCount, setSiImportCount] = useState(0);

  /* ─── Drawer State ─── */
  const [drawerLead, setDrawerLead] = useState<Lead | null>(null);
  const [drawerNotes, setDrawerNotes] = useState("");
  const [drawerStatus, setDrawerStatus] = useState("new");
  const [drawerScore, setDrawerScore] = useState<number | undefined>(undefined);
  const [drawerSaving, setDrawerSaving] = useState(false);
  const [drawerActivities, setDrawerActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("id,store_name,store_url,email,score,status,notes,outreach_text,created_at")
      .order("created_at", { ascending: false });
    if (!error && data) setLeads(data as Lead[]);
    setLoading(false);
  }, []);

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
          createdYear: siYear ? parseInt(siYear) : undefined,
          createdMonth: siMonth ? parseInt(siMonth) : undefined,
          createdDay: siDay ? parseInt(siDay) : undefined,
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

  const filteredLeads = useMemo(() => {
    let result = leads;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.store_name?.toLowerCase().includes(q) ||
          l.store_url?.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.notes?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [leads, search]);

  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const stats = useMemo(
    () => ({
      total: leads.length,
      validEmails: leads.filter((l) => l.email && l.email.length > 3).length,
      highQuality: leads.filter((l) => (l.score || 0) >= 70).length,
      uncontacted: leads.filter((l) => !l.status || l.status === "new").length,
    }),
    [leads]
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllOnPage = () => {
    const pageIds = paginatedLeads.map((l) => l.id);
    const allSelected = pageIds.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const selectAllWithEmail = () => {
    const emailIds = filteredLeads.filter((l) => l.email).map((l) => l.id);
    setSelected((prev) => {
      const next = new Set(prev);
      emailIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected leads?`)) return;
    await supabase.from("leads").delete().in("id", Array.from(selected));
    setSelected(new Set());
    fetchLeads();
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setImportError("File exceeds 4MB.");
      return;
    }
    const text = await file.text();
    parseAndImport(text);
  };

  const parseAndImport = async (text: string) => {
    setImportError("");
    const parsed = parseCSV(text);
    if (parsed.length < 2) {
      setImportError("CSV needs header + data row.");
      return;
    }
    const headers = parsed[0].map((h) => h.toLowerCase().trim().replace(/^["']|["']$/g, ""));
    const getCol = (names: string[]) => {
      for (const n of names) {
        const i = headers.indexOf(n.toLowerCase());
        if (i !== -1) return i;
      }
      return -1;
    };
    const domainIdx = getCol(["domain", "store_name", "store name", "name", "url", "website", "site", "store_url"]);
    const emailIdx = getCol(["email", "e-mail", "contact_email", "contact email"]);
    if (domainIdx === -1 && emailIdx === -1) {
      setImportError("Need domain/store_name or email column.");
      return;
    }

    let imported = 0;
    for (let i = 1; i < parsed.length; i++) {
      const vals = parsed[i];
      const domain = domainIdx !== -1 ? vals[domainIdx]?.trim() : "";
      const email = emailIdx !== -1 ? vals[emailIdx]?.trim() : "";
      if (!domain && !email) continue;

      const row = {
        store_name: domain || "Unknown",
        store_url: domain ? `https://${domain}` : "",
        email: email || null,
        status: "new",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: existing } = await supabase.from("leads").select("id").eq("store_url", row.store_url).maybeSingle();
      if (existing) {
        await supabase.from("leads").update({ ...row, updated_at: new Date().toISOString() }).eq("id", existing.id);
        imported++;
      } else {
        const { error } = await supabase.from("leads").insert(row);
        if (!error) imported++;
      }
    }
    if (imported === 0) {
      setImportError("No valid rows imported.");
      return;
    }
    setShowImport(false);
    setImportText("");
    fetchLeads();
  };

  const downloadCSV = () => {
    const headers = ["store_name", "store_url", "email", "score", "status", "notes", "created_at"];
    const rows = filteredLeads.map((l) =>
      [l.store_name || "", l.store_url || "", l.email || "", l.score || "", l.status || "", l.notes || "", l.created_at || ""]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ecomfind-leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const qualityColor = (score?: number) => {
    if (!score) return "bg-slate-800 text-slate-400 border-slate-700";
    if (score >= 80) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (score >= 60) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    if (score >= 40) return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  };
  const qualityLabel = (score?: number) => {
    if (!score) return "—";
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  /* ─── Drawer Logic ─── */
  const openDrawer = (lead: Lead) => {
    setDrawerLead(lead);
    setDrawerNotes(lead.notes || "");
    setDrawerStatus(lead.status || "new");
    setDrawerScore(lead.score);
    // Load outreach activities for this lead
    const saved = localStorage.getItem("ecomfind_outreach_log");
    let acts: Activity[] = [];
    if (saved) {
      try {
        acts = JSON.parse(saved);
      } catch {}
    }
    const match = lead.email || lead.store_name.toLowerCase();
    const filtered = acts.filter(
      (a) =>
        a.to?.toLowerCase() === match ||
        a.subject?.toLowerCase().includes(match) ||
        a.body?.toLowerCase().includes(match)
    );
    setDrawerActivities(filtered);
  };

  const closeDrawer = () => setDrawerLead(null);

  const saveDrawer = async () => {
    if (!drawerLead) return;
    setDrawerSaving(true);
    await supabase
      .from("leads")
      .update({
        notes: drawerNotes,
        status: drawerStatus,
        score: drawerScore,
        updated_at: new Date().toISOString(),
      })
      .eq("id", drawerLead.id);
    setDrawerSaving(false);
    closeDrawer();
    fetchLeads();
  };

  const statusOptions = [
    { value: "new", label: "New", color: "text-slate-400" },
    { value: "contacted", label: "Contacted", color: "text-amber-400" },
    { value: "replied", label: "Replied", color: "text-blue-400" },
    { value: "won", label: "Won", color: "text-emerald-400" },
    { value: "lost", label: "Lost", color: "text-rose-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f1f] text-slate-200">
      {/* Nav */}
      <header className="border-b border-slate-800/60 bg-[#0b0f1e]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mr-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span className="text-sm font-medium hidden sm:inline">Home</span>
            </a>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <IconZap className="w-5 h-5 text-violet-400" />
            </div>
            <span className="font-bold text-white tracking-tight">EcomFind</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <a href="/discover" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Audit</a>
            <a href="/leads" className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 text-sm font-medium border border-violet-500/20">Leads</a>
            <a href="/outreach" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Outreach</a>
            <a href="/dashboard" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Dashboard</a>
            <a href="/about" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">About</a>
            <a href="/founder" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Founder</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Lead Discovery Engine</h1>
          <p className="text-slate-400">Find Shopify stores with validated owner emails and high-intent signals.</p>
        </div>

        {/* StoreIndex Search */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <IconWorld className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">StoreIndex Search</h3>
            {siImportCount > 0 && <span className="ml-auto text-xs text-emerald-400">✓ {siImportCount} imported</span>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
            {/* ─── 80 PROFITABLE COUNTRIES ─── */}
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Country</label>
              <select
                value={siCountry}
                onChange={(e) => setSiCountry(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
              >
                <optgroup label="North America">
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="MX">Mexico</option>
                </optgroup>

                <optgroup label="Western Europe">
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="NL">Netherlands</option>
                  <option value="IT">Italy</option>
                  <option value="ES">Spain</option>
                  <option value="SE">Sweden</option>
                  <option value="CH">Switzerland</option>
                  <option value="BE">Belgium</option>
                  <option value="AT">Austria</option>
                  <option value="NO">Norway</option>
                  <option value="DK">Denmark</option>
                  <option value="FI">Finland</option>
                  <option value="IE">Ireland</option>
                  <option value="PT">Portugal</option>
                  <option value="LU">Luxembourg</option>
                  <option value="IS">Iceland</option>
                  <option value="MC">Monaco</option>
                  <option value="LI">Liechtenstein</option>
                  <option value="MT">Malta</option>
                  <option value="CY">Cyprus</option>
                </optgroup>

                <optgroup label="Central & Eastern Europe">
                  <option value="PL">Poland</option>
                  <option value="CZ">Czech Republic</option>
                  <option value="HU">Hungary</option>
                  <option value="RO">Romania</option>
                  <option value="GR">Greece</option>
                  <option value="SK">Slovakia</option>
                  <option value="SI">Slovenia</option>
                  <option value="HR">Croatia</option>
                  <option value="BG">Bulgaria</option>
                  <option value="LT">Lithuania</option>
                  <option value="LV">Latvia</option>
                  <option value="EE">Estonia</option>
                </optgroup>

                <optgroup label="Asia-Pacific">
                  <option value="JP">Japan</option>
                  <option value="KR">South Korea</option>
                  <option value="SG">Singapore</option>
                  <option value="HK">Hong Kong</option>
                  <option value="AU">Australia</option>
                  <option value="NZ">New Zealand</option>
                  <option value="TW">Taiwan</option>
                  <option value="MY">Malaysia</option>
                  <option value="TH">Thailand</option>
                  <option value="ID">Indonesia</option>
                  <option value="PH">Philippines</option>
                  <option value="VN">Vietnam</option>
                  <option value="BN">Brunei</option>
                  <option value="IN">India</option>
                </optgroup>

                <optgroup label="Middle East">
                  <option value="AE">United Arab Emirates</option>
                  <option value="SA">Saudi Arabia</option>
                  <option value="IL">Israel</option>
                  <option value="QA">Qatar</option>
                  <option value="KW">Kuwait</option>
                  <option value="BH">Bahrain</option>
                  <option value="OM">Oman</option>
                  <option value="JO">Jordan</option>
                  <option value="LB">Lebanon</option>
                  <option value="TR">Turkey</option>
                </optgroup>

                <optgroup label="Latin America">
                  <option value="BR">Brazil</option>
                  <option value="AR">Argentina</option>
                  <option value="CL">Chile</option>
                  <option value="CO">Colombia</option>
                  <option value="PE">Peru</option>
                  <option value="UY">Uruguay</option>
                  <option value="CR">Costa Rica</option>
                  <option value="PA">Panama</option>
                  <option value="GT">Guatemala</option>
                  <option value="DO">Dominican Republic</option>
                  <option value="JM">Jamaica</option>
                  <option value="TT">Trinidad & Tobago</option>
                </optgroup>

                <optgroup label="Africa">
                  <option value="ZA">South Africa</option>
                  <option value="NG">Nigeria</option>
                  <option value="KE">Kenya</option>
                  <option value="GH">Ghana</option>
                  <option value="EG">Egypt</option>
                  <option value="MA">Morocco</option>
                  <option value="TN">Tunisia</option>
                  <option value="MU">Mauritius</option>
                </optgroup>

                <option value="">Any Country</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Industry</label>
              <select value={siIndustry} onChange={(e) => setSiIndustry(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white">
                <option value="">All Industries</option>
                <option value="Fashion">Fashion</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Home">Home</option>
                <option value="Beauty">Beauty</option>
                <option value="Fitness">Fitness</option>
                <option value="Electronics">Electronics</option>
                <option value="Pets">Pets</option>
                <option value="Food">Food</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Products</label>
              <select value={siProducts} onChange={(e) => setSiProducts(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white">
                <option value="1-10">1-10</option>
                <option value="10-50">10-50</option>
                <option value="50-100">50-100</option>
                <option value="100-500">100-500</option>
                <option value="500-99999">500+</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Year Created</label>
                <select value={siYear} onChange={e => setSiYear(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white">
              <option value="">Any Year</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
              <option value="2018">2018</option>
              <option value="2017">2017</option>
              <option value="2016">2016</option>
              <option value="2015">2015</option>
              <option value="2014">2014</option>
              <option value="2013">2013</option>
              <option value="2012">2012</option>
              <option value="2011">2011</option>
              <option value="2010">2010</option>
              <option value="2009">2009</option>
              <option value="2008">2008</option>
              <option value="2007">2007</option>
              <option value="2006">2006</option>
              <option value="2005">2005</option>
              <option value="2000">2000s</option>
              <option value="1990">1990s</option>
              <option value="1980">1980s</option>
              <option value="1970">1970s</option>
              <option value="1960">1960s</option>
              <option value="1950">1950s</option>
              <option value="1940">1940s</option>
              <option value="1930">1930s</option>
              <option value="1900">1900s</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Month</label>
              <select value={siMonth} onChange={(e) => setSiMonth(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white">
                <option value="">Any Month</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Day</label>
              <select value={siDay} onChange={(e) => setSiDay(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white">
                <option value="">Any Day</option>
                {Array.from({length: 31}, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={searchStoreIndex} disabled={siLoading} className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-sm disabled:opacity-50">
                {siLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          {siError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center justify-between">
              <span>{siError}</span>
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
                className="ml-3 px-2 py-1 rounded bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-semibold transition-colors"
              >
                Load Demo Data
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
                      <p className="text-xs text-slate-500">
                        {s.country} {s.industry && `· ${s.industry}`} {s.createdAt && `· Est. ${new Date(s.createdAt).getFullYear()}`} {s.email && `· ${s.email}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {s.email && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Has Email</span>}
                      <button
                        onClick={async () => {
                          const { data: { session } } = await supabase.auth.getSession();
                          if (!session?.user) { alert("Sign in to save leads"); return; }
                          const { error } = await supabase.from("saved_leads").insert({
                            user_id: session.user.id,
                            domain: s.domain,
                            shopify_domain: s.shopifyDomain || null,
                            email: s.email || null,
                            country: s.country || null,
                            industry: s.industry || null,
                            products: (s as any).products || null,
                            score: (s as any).score || null,
                          });
                          if (error) alert("Already saved or error");
                          else alert("Lead saved!");
                        }}
                        className="text-[10px] px-2 py-1 rounded bg-violet-600 hover:bg-violet-500 text-white font-medium"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!siLoading && !siError && siResults.length === 0 && (
            <div className="text-center py-6 text-slate-600">
              <p className="text-xs">No results yet. Use filters and click Search.</p>
            </div>
          )}
        </div>

        {/* Search & Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by store name, URL, email, or notes..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
            </div>
            <button onClick={() => setSearch("")} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm text-slate-300">
              Clear
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowImport(!showImport)} className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-sm flex items-center gap-2">
              <IconUpload className="w-4 h-4" /> Import CSV
            </button>
            <button onClick={downloadCSV} disabled={filteredLeads.length === 0} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm disabled:opacity-50 flex items-center gap-2">
              <IconDownload className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Leads</div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Valid Emails</div>
            <div className="text-2xl font-bold text-emerald-400">{stats.validEmails}</div>
          </div>
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">High Quality</div>
            <div className="text-2xl font-bold text-violet-400">{stats.highQuality}</div>
          </div>
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Uncontacted</div>
            <div className="text-2xl font-bold text-amber-400">{stats.uncontacted}</div>
          </div>
        </div>

        {/* Import Panel */}
        {showImport && (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 mb-8">
            <div className="flex items-start gap-3 mb-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
              <IconAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-400 font-medium">File Size Limit: 4MB</p>
                <p className="text-xs text-slate-400">Upload CSV with columns: store_name, store_url, email, etc.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Upload CSV</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-violet-600 file:text-white file:text-xs file:font-semibold"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Or Paste CSV</label>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  rows={3}
                  placeholder="store_name,store_url,email..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-600 resize-none mb-2"
                />
                <button onClick={() => parseAndImport(importText)} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg text-xs">
                  Import Pasted Data
                </button>
              </div>
            </div>
            {importError && (
              <p className="text-rose-400 text-sm mt-3 flex items-center gap-1">
                <IconAlert className="w-4 h-4" /> {importError}
              </p>
            )}
          </div>
        )}

        {/* Bulk Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <button onClick={selectAllOnPage} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-300">
              Select All on Page
            </button>
            <button onClick={selectAllWithEmail} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-300">
              Select All With Email
            </button>
            {selected.size > 0 && (
              <button onClick={deleteSelected} className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-medium flex items-center gap-1.5">
                <IconTrash className="w-3 h-3" /> Delete ({selected.size})
              </button>
            )}
          </div>
          <span className="text-xs text-slate-500">
            Showing {paginatedLeads.length} of {filteredLeads.length} leads · Page {currentPage} of {totalPages}
          </span>
        </div>

        {/* Lead Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-slate-800 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-slate-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : paginatedLeads.length === 0 ? (
          <div className="text-center py-20 text-slate-600">
            <IconGlobe className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm mb-2">No leads found.</p>
            <p className="text-xs">Import a CSV, load demo data, or search StoreIndex to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            {paginatedLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => openDrawer(lead)}
                className={`group rounded-2xl border p-5 transition-all hover:scale-[1.01] cursor-pointer ${
                  selected.has(lead.id) ? "bg-violet-500/5 border-violet-500/30" : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selected.has(lead.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSelect(lead.id);
                      }}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-violet-500"
                    />
                    <div>
                      <a
                        href={lead.store_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-semibold text-white hover:text-violet-400 transition-colors"
                      >
                        {lead.store_name}
                      </a>
                      <p className="text-xs text-slate-500 truncate max-w-[200px]">{lead.store_url}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${qualityColor(lead.score)}`}>
                    {qualityLabel(lead.score)}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  {lead.email ? (
                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                      <IconCheck className="w-3 h-3" />
                      <span className="truncate">{lead.email}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <IconMail className="w-3 h-3" />
                      <span>No email</span>
                    </div>
                  )}
                  {lead.notes && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <IconStar className="w-3 h-3" />
                      <span className="truncate">{lead.notes}</span>
                    </div>
                  )}
                  {lead.status && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="capitalize">{lead.status}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                  {lead.email ? (
                    <a
                      href={`/outreach?email=${encodeURIComponent(lead.email)}&domain=${encodeURIComponent(lead.store_name)}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <IconMessage className="w-3 h-3" /> Audit & Outreach
                    </a>
                  ) : (
                    <span className="flex-1 px-3 py-2 bg-slate-800 text-slate-500 rounded-lg text-xs font-medium text-center border border-slate-700">
                      No email
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!confirm("Delete this lead?")) return;
                      supabase.from("leads").delete().eq("id", lead.id).then(() => fetchLeads());
                    }}
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 disabled:opacity-40"
            >
              <IconChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg text-sm font-medium ${
                  currentPage === page ? "bg-violet-600 text-white" : "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 disabled:opacity-40"
            >
              <IconChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* ─── Lead Detail Drawer ─── */}
      {drawerLead && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={closeDrawer}
          />
          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#0f1429] border-l border-slate-800 z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <IconPencil className="w-4 h-4 text-violet-400" />
                <h2 className="text-sm font-bold text-white">Lead Details</h2>
              </div>
              <button onClick={closeDrawer} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors">
                <IconX className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Store Info */}
              <div>
                <a
                  href={drawerLead.store_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-white hover:text-violet-400 transition-colors"
                >
                  {drawerLead.store_name}
                </a>
                <p className="text-xs text-slate-500 mt-1">{drawerLead.store_url}</p>
                {drawerLead.email && (
                  <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5">
                    <IconCheck className="w-3 h-3" /> {drawerLead.email}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 block">Status</label>
                <select
                  value={drawerStatus}
                  onChange={(e) => setDrawerStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                >
                  {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Score */}
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 block">Quality Score</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={drawerScore || 0}
                    onChange={(e) => setDrawerScore(parseInt(e.target.value))}
                    className="flex-1 accent-violet-500"
                  />
                  <span className={`text-sm font-bold w-12 text-right ${qualityColor(drawerScore).split(" ")[1]}`}>
                    {drawerScore || 0}
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 mt-1">{qualityLabel(drawerScore)}</p>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 block">Notes</label>
                <textarea
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  rows={4}
                  placeholder="Add private notes about this lead..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>

              {/* Outreach History */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <IconHistory className="w-4 h-4 text-slate-500" />
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Outreach History</h3>
                </div>
                {drawerActivities.length === 0 ? (
                  <div className="text-center py-6 rounded-xl bg-slate-950/50 border border-slate-800">
                    <IconMail className="w-6 h-6 mx-auto mb-2 text-slate-700" />
                    <p className="text-xs text-slate-600">No outreach yet.</p>
                    {drawerLead.email && (
                      <a
                        href={`/outreach?email=${encodeURIComponent(drawerLead.email)}&domain=${encodeURIComponent(drawerLead.store_name)}`}
                        className="inline-block mt-2 text-xs text-violet-400 hover:text-violet-300 font-medium"
                      >
                        Send first email →
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {drawerActivities.map((a) => (
                      <div key={a.id} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${
                            a.type === "sent" ? "text-emerald-400" :
                            a.type === "scheduled" ? "text-amber-400" :
                            a.type === "draft" ? "text-slate-400" :
                            a.type === "opened" ? "text-violet-400" :
                            "text-blue-400"
                          }`}>{a.type}</span>
                          <span className="text-[10px] text-slate-600">
                            {new Date(a.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium truncate">{a.subject}</p>
                        {a.scheduledFor && (
                          <p className="text-[10px] text-amber-400 mt-1">Scheduled: {new Date(a.scheduledFor).toLocaleString()}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-slate-800 flex items-center gap-3">
              <button
                onClick={closeDrawer}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveDrawer}
                disabled={drawerSaving}
                className="flex-1 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <IconCheck className="w-4 h-4" />
                {drawerSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}