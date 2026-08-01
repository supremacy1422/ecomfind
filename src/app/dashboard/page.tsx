"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ─── Icons ─── */
const IconZap = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconStore = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const IconBarChart = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
);
const IconMail = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconTrash = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);
const IconClock = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const IconGlobe = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const IconReply = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
);

/* ─── Types ─── */
interface SavedAudit {
  id: string;
  url: string;
  domain: string;
  score: number;
  created_at: string;
}

interface SavedLead {
  id: string;
  domain: string;
  email?: string;
  country?: string;
  industry?: string;
  score?: number;
  created_at: string;
}

interface OutreachLog {
  id: string;
  lead_domain: string;
  template_type: string;
  subject: string;
  status: string;
  sent_at?: string;
  created_at: string;
}

/* ─── Helpers ─── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    sent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    scheduled: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    opened: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    replied: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    draft: "bg-slate-800 text-slate-400 border-slate-700",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase ${map[status] || map.draft}`}>
      {status}
    </span>
  );
}

function scoreColor(score?: number) {
  if (!score) return "text-slate-400";
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  if (score >= 40) return "text-orange-400";
  return "text-rose-400";
}

/* ─── Main Dashboard ─── */
export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [audits, setAudits] = useState<SavedAudit[]>([]);
  const [leads, setLeads] = useState<SavedLead[]>([]);
  const [outreach, setOutreach] = useState<OutreachLog[]>([]);
  const [activeTab, setActiveTab] = useState<"audits" | "leads" | "outreach">("audits");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) loadData(session.user.id);
      else setLoading(false);
    });
  }, []);

  const loadData = async (userId: string) => {
    setLoading(true);
    const [{ data: a }, { data: l }, { data: o }] = await Promise.all([
      supabase.from("saved_audits").select("id,url,domain,score,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(50),
      supabase.from("saved_leads").select("id,domain,email,country,industry,score,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(50),
      supabase.from("outreach_logs").select("id,lead_domain,template_type,subject,status,sent_at,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(50),
    ]);
    if (a) setAudits(a);
    if (l) setLeads(l);
    if (o) setOutreach(o);
    setLoading(false);
  };

  const deleteAudit = async (id: string) => {
    if (!confirm("Delete this audit?")) return;
    await supabase.from("saved_audits").delete().eq("id", id);
    setAudits((prev) => prev.filter((x) => x.id !== id));
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    await supabase.from("saved_leads").delete().eq("id", id);
    setLeads((prev) => prev.filter((x) => x.id !== id));
  };

  const deleteOutreach = async (id: string) => {
    if (!confirm("Delete this log?")) return;
    await supabase.from("outreach_logs").delete().eq("id", id);
    setOutreach((prev) => prev.filter((x) => x.id !== id));
  };

  const stats = {
    audits: audits.length,
    leads: leads.length,
    outreach: outreach.length,
    replies: outreach.filter((o) => o.status === "replied").length,
  };

  const tabs = [
    { key: "audits" as const, label: "Saved Audits", icon: IconBarChart, count: stats.audits },
    { key: "leads" as const, label: "Saved Leads", icon: IconStore, count: stats.leads },
    { key: "outreach" as const, label: "Outreach", icon: IconMail, count: stats.outreach },
  ];

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-[#0b0f1f] text-slate-200 flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
            <IconZap className="w-7 h-7 text-violet-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-sm text-slate-400 mb-6">Log in to view your saved audits, leads, and outreach history.</p>
          <a href="/login" className="w-full inline-block py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f1f] text-slate-200">
      {/* Nav */}
      <header className="border-b border-slate-800/60 bg-[#0b0f1e]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <IconZap className="w-5 h-5 text-violet-400" />
            </div>
            <span className="font-bold text-white tracking-tight text-lg">EcomFind</span>
          </a>
          <nav className="hidden md:flex items-center gap-1">
            <a href="/discover" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Audit</a>
            <a href="/leads" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Leads</a>
            <a href="/outreach" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Outreach</a>
            <a href="/dashboard" className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 text-sm font-medium border border-violet-500/20">Dashboard</a>
            <a href="/about" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">About</a>
            <a href="/founder" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Founder</a>
          </nav>
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs text-emerald-400 font-bold border border-emerald-500/30">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Everything you've saved and tracked in one place.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <IconBarChart className="w-4 h-4 text-violet-400" />
              </div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Audits</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.audits}</div>
          </div>
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <IconStore className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Leads</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.leads}</div>
          </div>
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                <IconMail className="w-4 h-4 text-sky-400" />
              </div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Emails</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.outreach}</div>
          </div>
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <IconReply className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Replies</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.replies}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-800 pb-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-colors border-b-2 ${
                activeTab === t.key
                  ? "text-violet-400 border-violet-400 bg-violet-500/5"
                  : "text-slate-500 border-transparent hover:text-slate-300"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === t.key ? "bg-violet-500/20 text-violet-400" : "bg-slate-800 text-slate-500"}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {/* ─── Audits Tab ─── */}
            {activeTab === "audits" && (
              <>
                {audits.length === 0 ? (
                  <div className="text-center py-16 rounded-2xl bg-slate-900/30 border border-slate-800 border-dashed">
                    <IconBarChart className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No saved audits yet.</p>
                    <a href="/discover" className="inline-block mt-3 text-sm text-violet-400 hover:text-violet-300 font-medium">Run your first audit →</a>
                  </div>
                ) : (
                  audits.map((a) => (
                    <div key={a.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-medium text-white truncate">{a.domain}</span>
                          <span className={`text-sm font-bold ${scoreColor(a.score)}`}>{a.score}/100</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <IconClock className="w-3 h-3" />
                          {new Date(a.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <a href={`/discover?url=${encodeURIComponent(a.url)}`} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors">
                          Re-audit
                        </a>
                        <button onClick={() => deleteAudit(a.id)} className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* ─── Leads Tab ─── */}
            {activeTab === "leads" && (
              <>
                {leads.length === 0 ? (
                  <div className="text-center py-16 rounded-2xl bg-slate-900/30 border border-slate-800 border-dashed">
                    <IconStore className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No saved leads yet.</p>
                    <a href="/leads" className="inline-block mt-3 text-sm text-violet-400 hover:text-violet-300 font-medium">Browse leads →</a>
                  </div>
                ) : (
                  leads.map((l) => (
                    <div key={l.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-medium text-white truncate">{l.domain}</span>
                          {l.score !== undefined && <span className={`text-sm font-bold ${scoreColor(l.score)}`}>{l.score}/100</span>}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          {l.country && <span className="flex items-center gap-1"><IconGlobe className="w-3 h-3" /> {l.country}</span>}
                          {l.industry && <span>{l.industry}</span>}
                          {l.email && <span className="text-emerald-400">{l.email}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <a href={`/outreach?domain=${encodeURIComponent(l.domain)}`} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors">
                          Outreach
                        </a>
                        <button onClick={() => deleteLead(l.id)} className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* ─── Outreach Tab ─── */}
            {activeTab === "outreach" && (
              <>
                {outreach.length === 0 ? (
                  <div className="text-center py-16 rounded-2xl bg-slate-900/30 border border-slate-800 border-dashed">
                    <IconMail className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No outreach history yet.</p>
                    <a href="/outreach" className="inline-block mt-3 text-sm text-violet-400 hover:text-violet-300 font-medium">Start outreach →</a>
                  </div>
                ) : (
                  outreach.map((o) => (
                    <div key={o.id} className="flex items-start justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-medium text-white">{o.lead_domain}</span>
                          <StatusBadge status={o.status} />
                        </div>
                        <p className="text-xs text-slate-400 mb-1 truncate max-w-md">{o.subject}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-600">
                          <span>{o.template_type}</span>
                          <span>·</span>
                          <span>{new Date(o.created_at).toLocaleDateString()}</span>
                          {o.sent_at && <span>· Sent {new Date(o.sent_at).toLocaleDateString()}</span>}
                        </div>
                      </div>
                      <button onClick={() => deleteOutreach(o.id)} className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-4">
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-[#0b0f1e] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <p className="text-xs text-slate-600">© 2026 EcomFind. All rights reserved.</p>
          <span className="text-xs text-slate-600 flex items-center gap-1.5">
            <IconZap className="w-3 h-3" /> Built by agencies, for agencies
          </span>
        </div>
      </footer>
    </div>
  );
}