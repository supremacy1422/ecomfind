"use client";

import React, { useState, useEffect } from "react";

const IconZap = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconMail = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconSend = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);
const IconRefresh = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
);
const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconTrash = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);
const IconEye = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const IconMouse = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="3" width="12" height="18" rx="6"/><line x1="12" y1="7" x2="12" y2="11"/></svg>
);
const IconClock = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const IconDuplicate = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
);
const IconX = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

interface Campaign {
  id: string;
  name: string;
  subject: string;
  fromAccount: string;
  sent: number;
  opened: number;
  clicked: number;
  failed: number;
  date: string;
  status: "sent" | "sending" | "draft" | "scheduled";
  recipients: { email: string; name?: string; store?: string; status: "sent" | "opened" | "clicked" | "bounced" | "failed" }[];
}

const STORAGE_KEY = "ecomfind_campaigns";

const DEFAULT_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-1",
    name: "Agency Intro — US Fashion",
    subject: "Quick question about {store}",
    fromAccount: "abolajitosin962@gmail.com",
    sent: 89,
    opened: 23,
    clicked: 7,
    failed: 2,
    date: "2026-08-11T14:30:00",
    status: "sent",
    recipients: [
      { email: "john@store1.com", name: "John", store: "Store1", status: "clicked" },
      { email: "jane@store2.com", name: "Jane", store: "Store2", status: "opened" },
      { email: "mike@store3.com", name: "Mike", store: "Store3", status: "sent" },
    ],
  },
  {
    id: "camp-2",
    name: "Speed Audit Offer — UK Stores",
    subject: "{store} is losing customers to slow load times",
    fromAccount: "team@myagency.com",
    sent: 45,
    opened: 12,
    clicked: 4,
    failed: 0,
    date: "2026-08-10T09:15:00",
    status: "sent",
    recipients: [
      { email: "sarah@ukstore.com", name: "Sarah", store: "UKStore", status: "clicked" },
      { email: "tom@britbrand.com", name: "Tom", store: "BritBrand", status: "opened" },
    ],
  },
  {
    id: "camp-3",
    name: "Follow-up — No Response",
    subject: "Re: {store} optimization",
    fromAccount: "abolajitosin962@gmail.com",
    sent: 120,
    opened: 34,
    clicked: 9,
    failed: 5,
    date: "2026-08-08T16:00:00",
    status: "sent",
    recipients: [],
  },
  {
    id: "camp-4",
    name: "New Store Outreach",
    subject: "Hi {name}, quick question about {store}",
    fromAccount: "team@myagency.com",
    sent: 0,
    opened: 0,
    clicked: 0,
    failed: 0,
    date: "",
    status: "draft",
    recipients: [],
  },
];

function formatDate(iso: string): string {
  if (!iso) return "Draft";
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function statusBadge(status: Campaign["status"]) {
  const map = {
    sent: { text: "Sent", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    sending: { text: "Sending", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    draft: { text: "Draft", className: "bg-slate-700/30 text-slate-400 border-slate-600/30" },
    scheduled: { text: "Scheduled", className: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  };
  const s = map[status];
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${s.className}`}>{s.text}</span>;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [filter, setFilter] = useState<"all" | "sent" | "draft">("all");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCampaigns(JSON.parse(saved));
      } catch {
        setCampaigns(DEFAULT_CAMPAIGNS);
      }
    } else {
      setCampaigns(DEFAULT_CAMPAIGNS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CAMPAIGNS));
    }
  }, []);

  const saveCampaigns = (updated: Campaign[]) => {
    setCampaigns(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteCampaign = (id: string) => {
    if (!confirm("Delete this campaign?")) return;
    saveCampaigns(campaigns.filter((c) => c.id !== id));
  };

  const cloneCampaign = (camp: Campaign) => {
    const cloned: Campaign = {
      ...camp,
      id: `camp-${Date.now()}`,
      name: `${camp.name} (Copy)`,
      status: "draft",
      sent: 0,
      opened: 0,
      clicked: 0,
      failed: 0,
      date: "",
      recipients: camp.recipients.map((r) => ({ ...r, status: "sent" as const })),
    };
    saveCampaigns([cloned, ...campaigns]);
  };

  const filtered = campaigns.filter((c) => {
    if (filter === "all") return true;
    if (filter === "sent") return c.status === "sent" || c.status === "sending" || c.status === "scheduled";
    return c.status === "draft";
  });

  const totalSent = campaigns.reduce((s, c) => s + c.sent, 0);
  const totalOpened = campaigns.reduce((s, c) => s + c.opened, 0);
  const totalClicked = campaigns.reduce((s, c) => s + c.clicked, 0);
  const openRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : "0";
  const clickRate = totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-[#0b0f1f] text-slate-200">
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
            <a href="/gmail-connections" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Gmail</a>
            <a href="/dashboard" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Dashboard</a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Campaigns</h1>
            <p className="text-sm text-slate-400">View, clone, and track all your outreach campaigns.</p>
          </div>
          <a href="/bulk-outreach" className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 shrink-0">
            <IconSend className="w-4 h-4" /> New Campaign
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Sent", value: totalSent.toLocaleString(), icon: IconMail, color: "text-violet-400", bg: "bg-violet-500/10" },
            { label: "Opened", value: totalOpened.toLocaleString(), icon: IconEye, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "Clicked", value: totalClicked.toLocaleString(), icon: IconMouse, color: "text-cyan-400", bg: "bg-cyan-500/10" },
            { label: "Open Rate", value: `${openRate}%`, icon: IconCheck, color: "text-amber-400", bg: "bg-amber-500/10" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-slate-900/40 border border-slate-800 p-5">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 mb-6">
          {(["all", "sent", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-slate-800 text-white"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/40"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Campaign List */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="rounded-xl bg-slate-900/40 border border-slate-800 border-dashed p-12 text-center">
              <IconMail className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No campaigns found.</p>
            </div>
          )}

          {filtered.map((camp) => {
            const openRate = camp.sent > 0 ? ((camp.opened / camp.sent) * 100).toFixed(1) : "0";
            const clickRate = camp.sent > 0 ? ((camp.clicked / camp.sent) * 100).toFixed(1) : "0";

            return (
              <div key={camp.id} className="rounded-xl bg-slate-900/40 border border-slate-800 p-5 hover:border-slate-700 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm font-bold text-white">{camp.name}</h3>
                      {statusBadge(camp.status)}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{camp.subject}</p>
                    <p className="text-[11px] text-slate-600 mt-1">From: {camp.fromAccount} · {formatDate(camp.date)}</p>
                  </div>

                  {camp.status !== "draft" && (
                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-center">
                        <p className="font-bold text-white">{camp.sent}</p>
                        <p className="text-[10px] text-slate-500">Sent</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-emerald-400">{camp.opened}</p>
                        <p className="text-[10px] text-slate-500">{openRate}% open</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-cyan-400">{camp.clicked}</p>
                        <p className="text-[10px] text-slate-500">{clickRate}% click</p>
                      </div>
                      {camp.failed > 0 && (
                        <div className="text-center">
                          <p className="font-bold text-rose-400">{camp.failed}</p>
                          <p className="text-[10px] text-slate-500">Failed</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 shrink-0">
                    {camp.status === "draft" ? (
                      <a href="/bulk-outreach" className="px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors">
                        Continue
                      </a>
                    ) : (
                      <button
                        onClick={() => setSelectedCampaign(camp)}
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
                      >
                        Details
                      </button>
                    )}
                    <button
                      onClick={() => cloneCampaign(camp)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="Clone campaign"
                    >
                      <IconDuplicate className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCampaign(camp.id)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/10 border border-slate-700 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete campaign"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCampaign(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0f1429] border border-slate-700 shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-white">{selectedCampaign.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{formatDate(selectedCampaign.date)} · {selectedCampaign.fromAccount}</p>
              </div>
              <button onClick={() => setSelectedCampaign(null)} className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors">
                <IconX className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { label: "Sent", val: selectedCampaign.sent, color: "text-white" },
                { label: "Opened", val: selectedCampaign.opened, color: "text-emerald-400" },
                { label: "Clicked", val: selectedCampaign.clicked, color: "text-cyan-400" },
                { label: "Failed", val: selectedCampaign.failed, color: "text-rose-400" },
              ].map((s) => (
                <div key={s.label} className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 text-center">
                  <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
                  <p className="text-[10px] text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-medium">Subject</p>
            <p className="text-sm text-slate-300 mb-4 p-3 rounded-lg bg-slate-950/50 border border-slate-800">{selectedCampaign.subject}</p>

            {selectedCampaign.recipients.length > 0 && (
              <>
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-medium">Recipients</p>
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {selectedCampaign.recipients.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-950/30 border border-slate-800/40 text-xs">
                      <span className={`w-2 h-2 rounded-full ${
                        r.status === "clicked" ? "bg-cyan-400" : r.status === "opened" ? "bg-emerald-400" : r.status === "bounced" ? "bg-rose-400" : "bg-slate-600"
                      }`} />
                      <span className="text-slate-300 flex-1 truncate">{r.email}</span>
                      {r.name && <span className="text-slate-500 truncate max-w-[80px]">{r.name}</span>}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        r.status === "clicked" ? "bg-cyan-500/10 text-cyan-400" : r.status === "opened" ? "bg-emerald-500/10 text-emerald-400" : r.status === "bounced" ? "bg-rose-500/10 text-rose-400" : "bg-slate-700/30 text-slate-500"
                      }`}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-2 mt-5">
              <button onClick={() => { cloneCampaign(selectedCampaign); setSelectedCampaign(null); }} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                <IconDuplicate className="w-3.5 h-3.5" /> Clone & Edit
              </button>
              <button onClick={() => { deleteCampaign(selectedCampaign.id); setSelectedCampaign(null); }} className="flex-1 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                <IconTrash className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}