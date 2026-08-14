"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

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
const IconClipboard = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
);
const IconSave = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);
const IconFolder = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
);
const IconX = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const IconZap = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconShield = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const IconDuplicate = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
);

interface Lead {
  email: string;
  name?: string;
  store?: string;
  url?: string;
  [key: string]: string | undefined;
}

interface TemplatePreset {
  id: string;
  name: string;
  subject: string;
  body: string;
  fromName: string;
}

const ACCEPTED_TYPES = ".csv,.txt,.tsv,.json,.xlsx,.xls";
const ACCEPTED_EXTS = [".csv", ".txt", ".tsv", ".json", ".xlsx", ".xls"];
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
const STORAGE_KEY = "ecomfind_templates";

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/^["\']|["\']$/g, "");
}

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

function extractEmailsFromText(text: string): Lead[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = [...text.matchAll(emailRegex)];
  const seen = new Set<string>();
  const leads: Lead[] = [];
  matches.forEach((m) => {
    const email = m[0].toLowerCase();
    if (!seen.has(email)) {
      seen.add(email);
      leads.push({ email });
    }
  });
  return leads;
}

function parseCSV(text: string, delimiter = ","): Lead[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 1) return [];
  const headers = lines[0].split(delimiter).map(normalizeHeader);
  const emailIndex = headers.findIndex((h) => h === "email");
  const nameIndex = headers.findIndex((h) => h === "name");
  const storeIndex = headers.findIndex((h) => h === "store");
  const urlIndex = headers.findIndex((h) => h === "url");

  if (emailIndex === -1) {
    return lines
      .map((l) => l.trim())
      .filter((l) => l && l.includes("@"))
      .map((email) => ({ email }));
  }

  return lines
    .slice(1)
    .map((line) => {
      const values = line.split(delimiter).map((v) => v.trim().replace(/^["\']|["\']$/g, ""));
      const lead: Lead = { email: values[emailIndex] || "" };
      if (nameIndex !== -1) lead.name = values[nameIndex];
      if (storeIndex !== -1) lead.store = values[storeIndex];
      if (urlIndex !== -1) lead.url = values[urlIndex];
      headers.forEach((h, i) => {
        if (!["email", "name", "store", "url"].includes(h)) {
          lead[h] = values[i];
        }
      });
      return lead;
    })
    .filter((l) => l.email && l.email.includes("@"));
}

function parseTSV(text: string): Lead[] {
  return parseCSV(text, "\t");
}

function parseTXT(text: string): Lead[] {
  const lines = text.trim().split(/\r?\n/);
  const firstLine = lines[0] || "";
  if (firstLine.includes(",") && firstLine.toLowerCase().includes("email")) {
    return parseCSV(text, ",");
  }
  if (firstLine.includes("\t")) {
    return parseTSV(text);
  }
  return lines
    .map((l) => l.trim())
    .filter((l) => l && l.includes("@"))
    .map((email) => ({ email }));
}

function parseJSON(text: string): Lead[] {
  try {
    const data = JSON.parse(text);
    const arr = Array.isArray(data) ? data : [data];
    return arr
      .map((item: any) => {
        if (typeof item === "string" && item.includes("@")) return { email: item };
        if (item && typeof item === "object") {
          const lead: Lead = { email: item.email || item.Email || item.EMAIL || "" };
          if (item.name || item.Name) lead.name = item.name || item.Name;
          if (item.store || item.Store) lead.store = item.store || item.Store;
          if (item.url || item.URL || item.Url) lead.url = item.url || item.URL || item.Url;
          return lead;
        }
        return { email: "" };
      })
      .filter((l) => l.email && l.email.includes("@"));
  } catch {
    return [];
  }
}

function parseExcel(buffer: ArrayBuffer): Lead[] {
  try {
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
    if (!rows.length) return [];

    const headers = (rows[0] as any[]).map((h: any) => normalizeHeader(String(h || "")));
    const emailIndex = headers.findIndex((h) => h === "email");
    const nameIndex = headers.findIndex((h) => h === "name");
    const storeIndex = headers.findIndex((h) => h === "store");
    const urlIndex = headers.findIndex((h) => h === "url");

    let useIndex = emailIndex;
    if (useIndex === -1) {
      useIndex = headers.findIndex((h) => h.includes("mail") || h.includes("email"));
    }

    if (useIndex === -1) {
      const seen = new Set<string>();
      const leads: Lead[] = [];
      rows.flat().forEach((cell: any) => {
        const val = String(cell || "").trim();
        if (val.includes("@") && !seen.has(val.toLowerCase())) {
          seen.add(val.toLowerCase());
          leads.push({ email: val });
        }
      });
      return leads;
    }

    return rows
      .slice(1)
      .map((row: any[]) => {
        const values = row.map((v: any) => String(v || "").trim());
        const lead: Lead = { email: values[useIndex] || "" };
        if (nameIndex !== -1) lead.name = values[nameIndex];
        if (storeIndex !== -1) lead.store = values[storeIndex];
        if (urlIndex !== -1) lead.url = values[urlIndex];
        headers.forEach((h, i) => {
          if (!["email", "name", "store", "url"].includes(h)) {
            lead[h] = values[i];
          }
        });
        return lead;
      })
      .filter((l) => l.email && l.email.includes("@"));
  } catch {
    return [];
  }
}

function parseFileContent(fileName: string, text: string, buffer?: ArrayBuffer): Lead[] {
  const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  switch (ext) {
    case ".csv":
      return parseCSV(text, ",");
    case ".tsv":
      return parseTSV(text);
    case ".txt":
      return parseTXT(text);
    case ".json":
      return parseJSON(text);
    case ".xlsx":
    case ".xls":
      if (buffer) return parseExcel(buffer);
      return extractEmailsFromText(text);
    default:
      return parseTXT(text) || extractEmailsFromText(text);
  }
}

function parsePastedText(text: string): Lead[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) return [];

  const first = lines[0];
  if (first.includes(",") && (first.toLowerCase().includes("email") || lines.length > 1)) {
    return parseCSV(text, ",");
  }
  if (first.includes("\t")) {
    return parseTSV(text);
  }
  const leads: Lead[] = [];
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (trimmed.includes(",")) {
      const parts = trimmed.split(",").map((p) => p.trim());
      const email = parts.find((p) => isValidEmail(p)) || "";
      if (email) {
        const lead: Lead = { email };
        if (parts[1]) lead.name = parts[1];
        if (parts[2]) lead.store = parts[2];
        if (parts[3]) lead.url = parts[3];
        leads.push(lead);
      }
    } else if (isValidEmail(trimmed)) {
      leads.push({ email: trimmed });
    } else {
      const extracted = extractEmailsFromText(trimmed);
      leads.push(...extracted);
    }
  });
  return leads;
}

/* ─── Default Templates ─── */
const DEFAULT_TEMPLATES: TemplatePreset[] = [
  {
    id: "intro-agency",
    name: "Agency Intro",
    fromName: "",
    subject: "Quick question about {store}",
    body: `Hi {name},

I came across {store} and noticed a few things that could boost conversions — especially on mobile.

I help e-commerce brands like yours increase revenue by optimizing their Shopify stores. Would you be open to a quick 5-minute audit? No strings attached.

Best,`,
  },
  {
    id: "speed-audit",
    name: "Speed Audit Offer",
    fromName: "",
    subject: "{store} is losing customers to slow load times",
    body: `Hi {name},

I ran a quick speed test on {store} and found some easy wins that could improve load time by 40%+.

Slow stores = lost revenue. Happy to share the full report — takes 2 minutes to read.

Want me to send it over?

Best,`,
  },
  {
    id: "follow-up",
    name: "Follow-up",
    fromName: "",
    subject: "Re: {store} optimization",
    body: `Hi {name},

Just following up on my last email about {store}. I know inboxes get busy.

If improving conversions is on your radar this quarter, I'd love to show you what we've done for similar stores.

Worth a 10-minute call?

Best,`,
  },
];

export default function BulkOutreachPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [invalidEmails, setInvalidEmails] = useState<string[]>([]);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [fromName, setFromName] = useState("");
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState({ sent: 0, failed: 0, total: 0 });
  const [logs, setLogs] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [showPaste, setShowPaste] = useState(false);

  const [templates, setTemplates] = useState<TemplatePreset[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as TemplatePreset[];
        setTemplates(parsed);
      }
    } catch {
      setTemplates([]);
    }
  }, []);

  const allTemplates = useMemo(() => [...DEFAULT_TEMPLATES, ...templates], [templates]);

  const saveTemplates = (updated: TemplatePreset[]) => {
    setTemplates(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const loadTemplate = (id: string) => {
    const t = allTemplates.find((x) => x.id === id);
    if (!t) return;
    setSubject(t.subject);
    setBody(t.body);
    setFromName(t.fromName);
    setSelectedTemplateId(id);
  };

  const saveCurrentTemplate = () => {
    if (!newTemplateName.trim() || !subject || !body) return;
    const newT: TemplatePreset = {
      id: `custom-${Date.now()}`,
      name: newTemplateName.trim(),
      subject,
      body,
      fromName,
    };
    saveTemplates([...templates, newT]);
    setNewTemplateName("");
    setShowSaveModal(false);
    setSelectedTemplateId(newT.id);
  };

  const deleteTemplate = (id: string) => {
    if (!confirm("Delete this template?")) return;
    const updated = templates.filter((t) => t.id !== id);
    saveTemplates(updated);
    if (selectedTemplateId === id) setSelectedTemplateId("");
  };

  const validateAndSetLeads = (rawLeads: Lead[], source: string) => {
    const valid: Lead[] = [];
    const invalid: string[] = [];
    const seen = new Set<string>();
    let dups = 0;

    rawLeads.forEach((lead) => {
      const email = lead.email.trim().toLowerCase();
      if (!email) return;
      if (!isValidEmail(email)) {
        invalid.push(lead.email);
        return;
      }
      if (seen.has(email)) {
        dups++;
        return;
      }
      seen.add(email);
      valid.push({ ...lead, email });
    });

    setLeads(valid);
    setInvalidEmails(invalid);
    setDuplicateCount(dups);
    setLogs((prev) => [
      ...prev,
      `Loaded ${valid.length} valid leads from ${source}${dups > 0 ? ` (${dups} duplicates removed)` : ""}${invalid.length > 0 ? ` — ${invalid.length} invalid emails skipped` : ""}`,
    ]);
  };

  const handleFile = (file: File) => {
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ACCEPTED_EXTS.includes(ext)) {
      alert(`Please upload a supported file: ${ACCEPTED_TYPES}`);
      return;
    }
    const isExcel = ext === ".xlsx" || ext === ".xls";
    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target?.result as ArrayBuffer;
        const parsed = parseFileContent(file.name, "", buffer);
        validateAndSetLeads(parsed, file.name);
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const parsed = parseFileContent(file.name, text);
        validateAndSetLeads(parsed, file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handlePaste = () => {
    if (!pasteText.trim()) return;
    const parsed = parsePastedText(pasteText);
    validateAndSetLeads(parsed, "pasted text");
    setPasteText("");
    setShowPaste(false);
  };

  const replaceVars = (text: string, lead: Lead): string => {
    return text
      .replace(/{name}/gi, lead.name || "there")
      .replace(/{store}/gi, lead.store || "your store")
      .replace(/{url}/gi, lead.url || "")
      .replace(/{email}/gi, lead.email);
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const sendBulk = async () => {
    if (!leads.length) return alert("Upload or paste leads first");
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

      if (i < leads.length - 1) await sleep(2000);
    }

    setSending(false);
    setLogs((prev) => [...prev, `Done! ${progress.sent + (progress.failed > 0 ? 0 : 1)} sent, ${progress.failed} failed.`]);
  };

  const clearAll = () => {
    setLeads([]);
    setInvalidEmails([]);
    setDuplicateCount(0);
    setLogs([]);
    setProgress({ sent: 0, failed: 0, total: 0 });
  };

  return (
    <div className="min-h-screen bg-[#0b0f1f] text-slate-200">
      {/* ─── Header ─── */}
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
            <a href="/leads" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Leads</a>
            <a href="/outreach" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Outreach</a>
            <a href="/bulk-outreach" className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 text-sm font-medium border border-violet-500/20">Bulk</a>
            <a href="/gmail-connections" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Gmail</a>
            <a href="/follow-ups" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Follow-ups</a>
            <a href="/dashboard" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Dashboard</a>
            <a href="/about" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">About</a>
            <a href="/founder" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Founder</a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Bulk Outreach</h1>
          <p className="text-sm text-slate-400">Upload a file, paste a list, or use saved templates — then send personalized emails at scale.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ─── Left: Upload & Leads ─── */}
          <div className="space-y-6">
            {/* Upload Area */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragOver ? "border-violet-500 bg-violet-500/5" : "border-slate-700 bg-slate-900/40"
              }`}
            >
              <IconUpload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
              <p className="text-sm text-slate-400 mb-2">Drag & drop a file here</p>
              <p className="text-xs text-slate-600 mb-4">or</p>
              <label className="inline-block px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors">
                Browse Files
                <input type="file" accept={ACCEPTED_TYPES} className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </label>
              <p className="text-[10px] text-slate-600 mt-4">
                Supports <span className="text-slate-400">CSV, TXT, TSV, JSON, XLSX, XLS</span>
              </p>
            </div>

            {/* Paste Emails Toggle */}
            <div className="rounded-xl bg-slate-900/40 border border-slate-800 overflow-hidden">
              <button
                onClick={() => setShowPaste(!showPaste)}
                className="w-full px-4 py-3 flex items-center justify-between text-sm text-slate-300 hover:bg-slate-800/40 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <IconClipboard className="w-4 h-4 text-slate-500" />
                  Or paste emails directly
                </span>
                <span className="text-xs text-slate-500">{showPaste ? "Hide" : "Show"}</span>
              </button>

              {showPaste && (
                <div className="px-4 pb-4 pt-1 space-y-3">
                  <textarea
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    rows={6}
                    placeholder={`john@store.com
jane@shop.com, Jane, CoolShop
mike@brand.io, Mike, BrandCo, https://brand.io`}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none font-mono"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-600">
                      One per line, or <code className="text-slate-500">email, name, store, url</code>
                    </p>
                    <button
                      onClick={handlePaste}
                      disabled={!pasteText.trim()}
                      className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      Parse List
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Validation Warnings */}
            {(invalidEmails.length > 0 || duplicateCount > 0) && (
              <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4 space-y-2">
                {invalidEmails.length > 0 && (
                  <div className="flex items-start gap-2">
                    <IconAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-400">{invalidEmails.length} invalid email{invalidEmails.length > 1 ? "s" : ""} skipped</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{invalidEmails.slice(0, 5).join(", ")}{invalidEmails.length > 5 ? ` +${invalidEmails.length - 5} more` : ""}</p>
                    </div>
                  </div>
                )}
                {duplicateCount > 0 && (
                  <div className="flex items-start gap-2">
                    <IconDuplicate className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-400">{duplicateCount} duplicate{duplicateCount > 1 ? "s" : ""} removed</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Only unique emails are kept.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Leads List */}
            {leads.length > 0 && (
              <div className="rounded-xl bg-slate-900/40 border border-slate-800 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconShield className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-white">{leads.length} valid lead{leads.length !== 1 ? "s" : ""} ready</span>
                  </div>
                  <button onClick={clearAll} className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors">
                    <IconTrash className="w-3 h-3" /> Clear
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {leads.slice(0, 50).map((lead, i) => (
                    <div key={i} className="px-4 py-2 border-b border-slate-800/50 text-xs flex items-center gap-2">
                      <span className="text-slate-600 w-6 shrink-0">{i + 1}</span>
                      <span className="text-slate-300 flex-1 truncate">{lead.email}</span>
                      {lead.name && <span className="text-slate-500 truncate max-w-[80px]">{lead.name}</span>}
                      {lead.store && <span className="text-slate-600 truncate max-w-[80px]">{lead.store}</span>}
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
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Email Template</h3>

                {/* Template Preset Selector */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => loadTemplate(e.target.value)}
                      className="appearance-none pl-8 pr-7 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 cursor-pointer"
                    >
                      <option value="">Load preset...</option>
                      <optgroup label="Built-in">
                        {DEFAULT_TEMPLATES.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </optgroup>
                      {templates.length > 0 && (
                        <optgroup label="Your Templates">
                          {templates.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                    <IconFolder className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <button
                    onClick={() => setShowSaveModal(true)}
                    disabled={!subject || !body}
                    title="Save as preset"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white disabled:text-slate-600 disabled:hover:bg-slate-800 transition-colors"
                  >
                    <IconSave className="w-4 h-4" />
                  </button>
                  {selectedTemplateId && templates.find((t) => t.id === selectedTemplateId) && (
                    <button
                      onClick={() => deleteTemplate(selectedTemplateId)}
                      title="Delete preset"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/10 border border-slate-700 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

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

      {/* ─── Save Template Modal ─── */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSaveModal(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-[#0f1429] border border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-white">Save Template</h3>
              <button onClick={() => setShowSaveModal(false)} className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors">
                <IconX className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">Template Name</label>
                <input
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g. Cold Outreach v2"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
              <button
                onClick={saveCurrentTemplate}
                disabled={!newTemplateName.trim()}
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                <IconSave className="w-4 h-4" /> Save Preset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}