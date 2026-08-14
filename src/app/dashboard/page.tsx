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
const IconSearch = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const IconGlobe = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const IconMail = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconBarChart = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
);
const IconTrending = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);
const IconUsers = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IconClock = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const IconChevronRight = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
);
const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconAlert = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
const IconSparkles = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);
const IconStore = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const IconTrash = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
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

interface Campaign {
  id: string;
  name: string;
  sent: number;
  opened: number;
  clicked: number;
  date: string;
  status: "sent" | "sending" | "draft";
}

interface ActivityItem {
  id: string;
  type: "audit" | "lead" | "email" | "campaign";
  message: string;
  time: string;
  meta?: string;
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

function scoreBg(score?: number) {
  if (!score) return "bg-slate-800/40 border-slate-700/40";
  if (score >= 80) return "bg-emerald-500/10 border-emerald-500/20";
  if (score >= 60) return "bg-amber-500/10 border-amber-500/20";
  if (score >= 40) return "bg-orange-500/10 border-orange-500/20";
  return "bg-rose-500/10 border-rose-500/20";
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / (1000 * 60));
  const hrs = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ─── Main Dashboard ─── */
export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [audits, setAudits] = useState<SavedAudit[]>([]);
  const [leads, setLeads] = useState<SavedLead[]>([]);
  const [outreach, setOutreach] = useState<OutreachLog[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "audits" | "leads" | "outreach">("overview");

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
    emailsSent: outreach.filter((o) => o.status === "sent" || o.status === "opened" || o.status === "replied").length,
    replies: outreach.filter((o) => o.status === "replied").length,
  };

  const campaigns: Campaign[] = [
    { id: "1", name: "Agency Intro — US Fashion", sent: 89, opened: 23, clicked: 7, date: "Today", status: "sent" },
    { id: "2", name: "Speed Audit Offer — UK Stores", sent: 45, opened: 12, clicked: 4, date: "Yesterday", status: "sent" },
    { id: "3", name: "Follow-up — No Response", sent: 120, opened: 34, clicked: 9, date: "Aug 10", status: "sent" },
    { id: "4", name: "New Store Outreach", sent: 0, opened: 0, clicked: 0, date: "—", status: "draft" },
  ];

  const activities: ActivityItem[] = [
    ...audits.slice(0, 2).map((a, i) => ({
      id: `a-${i}`,
      type: "audit" as const,
      message: `Audited ${a.domain} — Score ${a.score}`,
      time: formatDate(a.created_at),
      meta: a.score < 60 ? "High priority" : undefined,
    })),
    ...leads.slice(0, 2).map((l, i) => ({
      id: `l-${i}`,
      type: "lead" as const,
      message: `Saved lead: ${l.domain}`,
      time: formatDate(l.created_at),
      meta: l.email ? "Has email" : "No email",
    })),
    ...outreach.slice(0, 2).map((o, i) => ({
      id: `o-${i}`,
      type: "email" as const,
      message: `Email ${o.status} to ${o.lead_domain}`,
      time: formatDate(o.created_at),
      meta: o.template_type,
    })),
  ];

  const quickActions = [
    { icon: IconSearch, label: "Audit Store", desc: "Run a live analysis", href: "/discover", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { icon: IconGlobe, label: "Browse Leads", desc: "Search 80+ countries", href: "/leads", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
    { icon: IconMail, label: "Start Outreach", desc: "Send bulk emails", href: "/bulk-outreach", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    { icon: IconZap, label: "Connect Gmail", desc: "Add sender accounts", href: "/gmail-connections", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "audit": return <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><IconSearch className="w-4 h-4 text-emerald-400" /></div>;
      case "lead": return <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center"><IconUsers className="w-4 h-4 text-violet-400" /></div>;
      case "email": return <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center"><IconMail className="w-4 h-4 text-amber-400" /></div>;
      case "campaign": return <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center"><IconBarChart className="w-4 h-4 text-cyan-400" /></div>;
      default: return <div className="w-8 h-8 rounded-lg bg-slate-700/30 flex items-center justify-center"><IconClock className="w-4 h-4 text-slate-400" /></div>;
    }
  };

  const tabs = [
    { key: "overview" as const, label: "Overview", icon: IconBarChart },
    { key: "audits" as const, label: "Audits", icon: IconSearch, count: stats.audits },
    { key: "leads" as const, label: "Leads", icon: IconStore, count: stats.leads },
    { key: "outreach" as const, label: "Outreach", icon: IconMail, count: outreach.length },
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
            <a href="/bulk-outreach" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Bulk</a>
            <a href="/gmail-connections" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Gmail</a>
            <a href="/follow-ups" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Follow-ups</a>
            <a href="/dashboard" className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 text-sm font-medium border border-violet-500/20">Dashboard</a>
            <a href="/about" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">About</a>
            <a href="/founder" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Founder</a>
          </nav>
          {user && (
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs text-emerald-400 font-bold border border-emerald-500/30">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* ─── Top Bar ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-sm text-slate-400">Your e-commerce agency pipeline at a glance.</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <IconSparkles className="w-3 h-3" /> Pro Plan — Unlimited audits
          </div>
        </div>

        {/* ─── Stats Grid ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Stores Audited", value: stats.audits.toString(), icon: IconSearch, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "Leads Imported", value: stats.leads.toString(), icon: IconUsers, color: "text-violet-400", bg: "bg-violet-500/10" },
            { label: "Emails Sent", value: stats.emailsSent.toLocaleString(), icon: IconMail, color: "text-amber-400", bg: "bg-amber-500/10" },
            { label: "Replies", value: stats.replies.toString(), icon: IconReply, color: "text-cyan-400", bg: "bg-cyan-500/10" },
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

        {/* ─── Tabs ─── */}
        <div className="flex gap-1 mb-8 border-b border-slate-800 pb-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === t.key
                  ? "text-violet-400 border-violet-400 bg-violet-500/5"
                  : "text-slate-500 border-transparent hover:text-slate-300"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === t.key ? "bg-violet-500/20 text-violet-400" : "bg-slate-800 text-slate-500"}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ═══ OVERVIEW TAB ═══ */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quickActions.map((a) => (
                      <a
                        key={a.label}
                        href={a.href}
                        className="group flex items-center gap-4 rounded-xl bg-slate-900/40 border border-slate-800 p-5 hover:border-slate-700 hover:bg-slate-900/60 transition-all"
                      >
                        <div className={`w-12 h-12 rounded-xl ${a.bg} flex items-center justify-center shrink-0`}>
                          <a.icon className={`w-6 h-6 ${a.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">{a.label}</p>
                          <p className="text-xs text-slate-500">{a.desc}</p>
                        </div>
                        <IconChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                      </a>
                    ))}
                  </div>

                  {/* Recent Campaigns */}
                  <div className="rounded-xl bg-slate-900/40 border border-slate-800 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Campaigns</h3>
                      <a href="/bulk-outreach" className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors">View all</a>
                    </div>
                    <div className="divide-y divide-slate-800/50">
                      {campaigns.map((c) => (
                        <div key={c.id} className="px-5 py-4 flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${c.status === "sent" ? "bg-emerald-500" : c.status === "sending" ? "bg-amber-500 animate-pulse" : "bg-slate-600"}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{c.name}</p>
                            <p className="text-xs text-slate-500">{c.date} · {c.status === "draft" ? "Draft" : `${c.sent} sent`}</p>
                          </div>
                          {c.status !== "draft" && (
                            <div className="flex items-center gap-3 text-xs">
                              <span className="text-slate-400">{c.sent} sent</span>
                              <div className="w-px h-3 bg-slate-700" />
                              <span className="text-emerald-400">{c.opened} opened</span>
                              <div className="w-px h-3 bg-slate-700" />
                              <span className="text-violet-400">{c.clicked} clicked</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance Chart */}
                  <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Email Performance</h3>
                      <span className="text-xs text-slate-500">Last 7 days</span>
                    </div>
                    <div className="flex items-end gap-2 h-32">
                      {[35, 52, 28, 65, 48, 72, 58].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                          <div className="w-full bg-violet-500/20 rounded-t-sm relative group" style={{ height: "100%" }}>
                            <div
                              className="absolute bottom-0 left-0 right-0 bg-violet-500 rounded-t-sm transition-all hover:bg-violet-400"
                              style={{ height: `${h}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-600">{["M","T","W","T","F","S","S"][i]}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-500" /> Sent</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Opened</span>
                    </div>
                  </div>

                  {/* Recent Audits Preview */}
                  {audits.length > 0 && (
                    <div className="rounded-xl bg-slate-900/40 border border-slate-800 overflow-hidden">
                      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Audits</h3>
                        <button onClick={() => setActiveTab("audits")} className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors">View all</button>
                      </div>
                      <div className="divide-y divide-slate-800/50">
                        {audits.slice(0, 3).map((a) => (
                          <div key={a.id} className="px-5 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg ${scoreBg(a.score)} flex items-center justify-center border`}>
                                <span className={`text-xs font-bold ${scoreColor(a.score)}`}>{a.score}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{a.domain}</p>
                                <p className="text-[10px] text-slate-500">{formatDate(a.created_at)}</p>
                              </div>
                            </div>
                            <a href={`/discover?url=${encodeURIComponent(a.url)}`} className="text-xs text-violet-400 hover:text-violet-300 font-medium">Re-audit →</a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Activity Feed */}
                  <div className="rounded-xl bg-slate-900/40 border border-slate-800 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-800">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Activity</h3>
                    </div>
                    <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                      {activities.length === 0 ? (
                        <p className="text-xs text-slate-600 text-center py-4">No recent activity</p>
                      ) : (
                        activities.map((a) => (
                          <div key={a.id} className="flex gap-3">
                            {getActivityIcon(a.type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-slate-300 leading-relaxed">{a.message}</p>
                              {a.meta && <p className="text-[10px] text-slate-500 mt-0.5">{a.meta}</p>}
                              <p className="text-[10px] text-slate-600 mt-1 flex items-center gap-1"><IconClock className="w-3 h-3" /> {a.time}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Connected Accounts */}
                  <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-5">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Gmail Accounts</h3>
                    <div className="space-y-3">
                      {[
                        { email: "abolajitosin962@gmail.com", sent: 0, limit: 300, status: "active" },
                        { email: "team@myagency.com", sent: 412, limit: 500, status: "active" },
                      ].map((acc) => (
                        <div key={acc.email} className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${acc.status === "active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-300 truncate">{acc.email}</p>
                            <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                              <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(acc.sent / acc.limit) * 100}%` }} />
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-500 shrink-0">{acc.sent}/{acc.limit}</span>
                        </div>
                      ))}
                    </div>
                    <a href="/gmail-connections" className="mt-4 block text-center text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors">
                      Manage accounts →
                    </a>
                  </div>

                  {/* Tips */}
                  <div className="rounded-xl bg-amber-500/5 border border-amber-500/15 p-4">
                    <div className="flex items-start gap-2">
                      <IconAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-amber-400 mb-1">Daily tip</p>
                        <p className="text-[11px] text-slate-400 leading-relaxed">Stores with PageSpeed scores below 50 convert 32% less. Lead with the revenue impact in your outreach subject line.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ AUDITS TAB ═══ */}
            {activeTab === "audits" && (
              <div className="space-y-3">
                {audits.length === 0 ? (
                  <div className="text-center py-16 rounded-2xl bg-slate-900/30 border border-slate-800 border-dashed">
                    <IconSearch className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No saved audits yet.</p>
                    <a href="/discover" className="inline-block mt-3 text-sm text-violet-400 hover:text-violet-300 font-medium">Run your first audit →</a>
                  </div>
                ) : (
                  audits.map((a) => (
                    <div key={a.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors">
                      <div className="min-w-0 flex-1 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${scoreBg(a.score)} flex items-center justify-center border`}>
                          <span className={`text-lg font-bold ${scoreColor(a.score)}`}>{a.score}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{a.domain}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1"><IconClock className="w-3 h-3" /> {formatDate(a.created_at)}</p>
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
              </div>
            )}

            {/* ═══ LEADS TAB ═══ */}
            {activeTab === "leads" && (
              <div className="space-y-3">
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
              </div>
            )}

            {/* ═══ OUTREACH TAB ═══ */}
            {activeTab === "outreach" && (
              <div className="space-y-3">
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
                          <span>{formatDate(o.created_at)}</span>
                          {o.sent_at && <span>· Sent {formatDate(o.sent_at)}</span>}
                        </div>
                      </div>
                      <button onClick={() => deleteOutreach(o.id)} className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-4">
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* ─── Footer ─── */}
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