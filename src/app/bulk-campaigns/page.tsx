"use client";

import React, { useState, useCallback, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const IconUpload = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);
const IconPlay = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
);
const IconPause = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
);
const IconEye = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const IconUsers = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: string;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  opened_count: number;
  created_at: string;
}

interface Lead {
  email: string;
  firstName?: string;
  lastName?: string;
}

export default function BulkCampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [creating, setCreating] = useState(false);

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [fromName, setFromName] = useState("");
  const [followUpSubject, setFollowUpSubject] = useState("");
  const [followUpBody, setFollowUpBody] = useState("");
  const [followUpDays, setFollowUpDays] = useState(3);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchCampaigns = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/campaigns", {
      headers: { "x-supabase-token": session?.access_token || "" },
    });
    const data = await res.json();
    setCampaigns(data.campaigns || []);
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const parseCSV = (text: string): Lead[] => {
    const lines = text.trim().split(/\r?\n/);
    if (!lines.length) return [];
    const hasHeader = lines[0].toLowerCase().includes("email");
    const start = hasHeader ? 1 : 0;
    const parsed: Lead[] = [];
    
    for (let i = start; i < lines.length; i++) {
      const cols = lines[i].split(",").map(c => c.trim().replace(/^"|"$/g, ""));
      if (!cols[0]?.includes("@")) continue;
      
      const local = cols[0].split("@")[0];
      const clean = local.replace(/[0-9]/g, "").replace(/[._-]/g, " ").trim();
      const parts = clean.split(/\s+/).filter(Boolean);
      
      parsed.push({
        email: cols[0],
        firstName: cols[1] || (parts[0] ? parts[0][0].toUpperCase() + parts[0].slice(1) : ""),
        lastName: cols[2] || (parts[1] ? parts[1][0].toUpperCase() + parts[1].slice(1) : ""),
      });
    }
    return parsed;
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".csv")) return alert("Please upload a .csv file");
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length > 20000) return alert("Max 20,000 recipients allowed");
      setLeads(parsed);
    };
    reader.readAsText(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const createCampaign = async () => {
    if (!name || !subject || !body || !leads.length) return alert("Fill all fields and upload a list");
    setCreating(true);
    
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-supabase-token": session?.access_token || "",
      },
      body: JSON.stringify({
        name, subject, body,
        from_name: fromName,
        recipients: leads,
        follow_up_subject: followUpSubject,
        follow_up_body: followUpBody,
        follow_up_days: followUpDays,
      }),
    });

    if (res.ok) {
      setShowCreate(false);
      setLeads([]);
      setName(""); setSubject(""); setBody(""); setFromName("");
      setFollowUpSubject(""); setFollowUpBody(""); setFollowUpDays(3);
      fetchCampaigns();
    } else {
      const err = await res.json();
      alert(err.error || "Failed to create campaign");
    }
    setCreating(false);
  };

  const controlCampaign = async (id: string, action: "start" | "pause") => {
    const { data: { session } } = await supabase.auth.getSession();
    await fetch(`/api/campaigns/${id}/${action}`, {
      method: "POST",
      headers: { "x-supabase-token": session?.access_token || "" },
    });
    fetchCampaigns();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sending": return "text-amber-400 bg-amber-500/10";
      case "completed": return "text-emerald-400 bg-emerald-500/10";
      case "paused": return "text-rose-400 bg-rose-500/10";
      default: return "text-slate-400 bg-slate-800";
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1f] text-slate-200">
      <header className="border-b border-slate-800/60 bg-[#0b0f1e]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <img src="/ecomfind_logo.png" alt="EcomFind" className="h-8 w-auto" />
          </a>
          <nav className="hidden md:flex items-center gap-1">
            <a href="/discover" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Audit</a>
            <a href="/leads" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Leads</a>
            <a href="/bulk-campaigns" className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-sm transition-colors">Campaigns</a>
            <a href="/gmail-connections" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Gmail</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Bulk Campaigns</h1>
            <p className="text-sm text-slate-400">Upload up to 20K contacts and send with multiple Gmail accounts.</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-lg transition-colors">
            + New Campaign
          </button>
        </div>

        {campaigns.length === 0 ? (
          <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-12 text-center">
            <IconUsers className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">No campaigns yet</p>
            <p className="text-sm text-slate-500">Create your first bulk email campaign.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((camp) => (
              <div key={camp.id} className="rounded-xl bg-slate-900/40 border border-slate-800 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-bold">{camp.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(camp.status)}`}>
                        {camp.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{camp.subject}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{camp.total_recipients.toLocaleString()} recipients</span>
                      <span>{camp.sent_count.toLocaleString()} sent</span>
                      <span>{camp.opened_count.toLocaleString()} opened</span>
                      {camp.failed_count > 0 && <span className="text-rose-400">{camp.failed_count} failed</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {camp.status === "draft" && (
                      <button onClick={() => controlCampaign(camp.id, "start")} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5">
                        <IconPlay className="w-3 h-3" /> Start
                      </button>
                    )}
                    {camp.status === "sending" && (
                      <button onClick={() => controlCampaign(camp.id, "pause")} className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5">
                        <IconPause className="w-3 h-3" /> Pause
                      </button>
                    )}
                    {camp.status === "paused" && (
                      <button onClick={() => controlCampaign(camp.id, "start")} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5">
                        <IconPlay className="w-3 h-3" /> Resume
                      </button>
                    )}
                    <button onClick={() => router.push(`/bulk-campaigns/${camp.id}`)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5">
                      <IconEye className="w-3 h-3" /> Details
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 transition-all" style={{ width: `${camp.total_recipients ? (camp.sent_count / camp.total_recipients) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1429] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">New Campaign</h2>
              <button onClick={() => setShowCreate(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>

            <div className="p-6 space-y-4">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Campaign name" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
              <input value={fromName} onChange={e => setFromName(e.target.value)} placeholder="From name (e.g., John from EcomFind)" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject line... use {firstName}, {name}, {email}" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
              <textarea value={body} onChange={e => setBody(e.target.value)} rows={6} placeholder="Email body... use {firstName}, {lastName}, {name}, {email}" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none" />

              {!leads.length ? (
                <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragOver ? "border-violet-500 bg-violet-500/5" : "border-slate-700 bg-slate-950"}`}>
                  <IconUpload className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 mb-2">Drop CSV here or click to browse</p>
                  <label className="inline-block px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors">
                    Choose File
                    <input type="file" accept=".csv" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                  </label>
                  <p className="text-[10px] text-slate-600 mt-3">Max 20,000 contacts. Columns: email, firstName, lastName</p>
                </div>
              ) : (
                <div className="rounded-lg bg-slate-950 border border-slate-800 p-4 flex items-center justify-between">
                  <span className="text-sm text-white">{leads.length.toLocaleString()} contacts loaded</span>
                  <button onClick={() => setLeads([])} className="text-xs text-rose-400 hover:text-rose-300">Remove</button>
                </div>
              )}

              <div className="border-t border-slate-800 pt-4">
                <p className="text-xs font-bold text-white uppercase tracking-wider mb-3">Auto Follow-up</p>
                <input value={followUpSubject} onChange={e => setFollowUpSubject(e.target.value)} placeholder="Follow-up subject (optional)" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 mb-3" />
                <textarea value={followUpBody} onChange={e => setFollowUpBody(e.target.value)} rows={3} placeholder="Follow-up body (optional)" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none mb-3" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Send after</span>
                  <input type="number" value={followUpDays} onChange={e => setFollowUpDays(parseInt(e.target.value))} min={1} max={30} className="w-16 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-sm text-white text-center" />
                  <span className="text-xs text-slate-500">days if no reply</span>
                </div>
              </div>

              <button onClick={createCampaign} disabled={creating} className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors">
                {creating ? "Creating..." : "Create Campaign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}