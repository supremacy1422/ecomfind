"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ─── Icons ─── */
const IconZap = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconClock = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const IconSend = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);
const IconSave = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);
const IconMail = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconEye = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);
const IconReply = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
);
const IconTrash = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);

interface Activity {
  id: string;
  type: "draft" | "sent" | "scheduled" | "opened" | "replied";
  to: string;
  subject: string;
  body: string;
  scheduledFor?: string;
  createdAt: string;
}

const TEMPLATES = [
  {
    id: "intro",
    name: "Cold Intro",
    subject: "Quick wins for {{domain}}",
    body: `Hi there,

I just ran a quick audit on {{domain}} and spotted 3 opportunities that could boost conversions this week:

1. Mobile checkout friction — 34% of carts are abandoned on the payment step
2. Above-the-fold CTA clarity — the hero section lacks a single clear action
3. Trust signals — no reviews visible on product pages

Want me to send the full report? It takes 2 minutes to read and is completely free.

Best,
[Your Name]`,
  },
  {
    id: "followup",
    name: "Follow-Up",
    subject: "Re: {{domain}} audit",
    body: `Hi,

Following up on the audit I shared for {{domain}}.

I know inboxes are crowded, so I'll keep this short: the checkout fix alone is worth an estimated 15–20% revenue lift based on similar stores we've worked with.

Happy to jump on a 5-min call to walk through the findings, or I can send the written report — whichever you prefer.

Best,
[Your Name]`,
  },
  {
    id: "casestudy",
    name: "Case Study",
    subject: "How a similar brand to {{domain}} grew 40%",
    body: `Hi,

We recently helped a {{industry}} brand fix their checkout flow and saw a 40% lift in completed orders within 60 days.

I ran the same analysis on {{domain}} and see a nearly identical pattern — specifically around mobile payment friction and trust signals.

Worth a 10-min chat to compare notes? No pitch, just data.

Best,
[Your Name]`,
  },
  {
    id: "breakup",
    name: "Breakup",
    subject: "Last call — {{domain}} audit expires",
    body: `Hi,

This is my last email about the free audit for {{domain}}.

I've held a slot open this week, but if you're not interested, no worries at all — just reply STOP and I'll close the loop.

If you do want the report, it's still free and takes 2 minutes to read: [link]

Best,
[Your Name]`,
  },
];

function OutreachComposer() {
  const searchParams = useSearchParams();
  const urlEmail = searchParams.get("email") || "";
  const urlDomain = searchParams.get("domain") || "";

  const [recipient, setRecipient] = useState(urlEmail);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [templateId, setTemplateId] = useState("intro");
  const [scheduledDate, setScheduledDate] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState("");

  // Load activities
  useEffect(() => {
    const saved = localStorage.getItem("ecomfind_outreach_log");
    if (saved) {
      try {
        setActivities(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Update recipient when URL changes
  useEffect(() => {
    if (urlEmail) setRecipient(urlEmail);
  }, [urlEmail]);

  // Apply template with variable substitution
  useEffect(() => {
    const t = TEMPLATES.find((x) => x.id === templateId);
    if (!t) return;
    const domain = urlDomain || "their store";
    const industry = "Fashion"; // Could be extended via URL param
    setSubject(t.subject.replace(/{{domain}}/g, domain));
    setBody(t.body.replace(/{{domain}}/g, domain).replace(/{{industry}}/g, industry));
  }, [templateId, urlDomain]);

  const persistActivities = (next: Activity[]) => {
    setActivities(next);
    localStorage.setItem("ecomfind_outreach_log", JSON.stringify(next));
  };

  const addActivity = (type: Activity["type"], subj: string, b: string, sched?: string) => {
    const act: Activity = {
      id: Math.random().toString(36).slice(2),
      type,
      to: recipient,
      subject: subj,
      body: b,
      scheduledFor: sched,
      createdAt: new Date().toISOString(),
    };
    persistActivities([act, ...activities]);
  };

  const updateLeadStatus = async (newStatus: string) => {
    if (!urlDomain) return;
    try {
      await supabase
        .from("leads")
        .update({ status: newStatus, outreach_text: body, updated_at: new Date().toISOString() })
        .eq("store_name", urlDomain);
    } catch {
      // Silently fail — local log is the source of truth for now
    }
  };

  const handleSend = async () => {
    if (!recipient || !subject || !body) {
      setToast("Please fill in all fields.");
      setTimeout(() => setToast(""), 3000);
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    const type = scheduledDate ? "scheduled" : "sent";
    addActivity(type, subject, body, scheduledDate || undefined);
    await updateLeadStatus(type === "scheduled" ? "scheduled" : "contacted");
    setSending(false);
    setToast(type === "scheduled" ? "Email scheduled." : "Email sent.");
    setScheduledDate("");
    setTimeout(() => setToast(""), 3000);
  };

  const handleSaveDraft = () => {
    if (!subject && !body) return;
    addActivity("draft", subject, body);
    setToast("Draft saved.");
    setTimeout(() => setToast(""), 3000);
  };

  const clearLog = () => {
    if (!confirm("Clear all outreach history?")) return;
    persistActivities([]);
  };

  const statusIcon = (type: Activity["type"]) => {
    switch (type) {
      case "sent": return <IconSend className="w-3 h-3 text-emerald-400" />;
      case "scheduled": return <IconClock className="w-3 h-3 text-amber-400" />;
      case "draft": return <IconSave className="w-3 h-3 text-slate-400" />;
      case "opened": return <IconEye className="w-3 h-3 text-violet-400" />;
      case "replied": return <IconReply className="w-3 h-3 text-blue-400" />;
    }
  };

  const statusColor = (type: Activity["type"]) => {
    switch (type) {
      case "sent": return "text-emerald-400";
      case "scheduled": return "text-amber-400";
      case "draft": return "text-slate-400";
      case "opened": return "text-violet-400";
      case "replied": return "text-blue-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1f] text-slate-200">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-2">
          <IconCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-white">{toast}</span>
        </div>
      )}

      {/* Nav */}
      <header className="border-b border-slate-800/60 bg-[#0b0f1e]/80 backdrop-blur sticky top-0 z-40">
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
            <a href="/leads" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Leads</a>
            <a href="/outreach" className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 text-sm font-medium border border-violet-500/20">Outreach</a>
            <a href="/about" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">About</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Outreach Studio</h1>
          <p className="text-slate-400">Compose, schedule, and track emails to your leads.</p>
          {urlDomain && (
            <p className="text-xs text-violet-400 mt-2 flex items-center gap-1.5">
              <IconMail className="w-3 h-3" />
              Pre-filled from lead: <span className="font-medium">{urlDomain}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar: Templates + Log */}
          <div className="lg:col-span-4 space-y-6">
            {/* Templates */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">AI Templates</h3>
              <div className="space-y-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplateId(t.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${
                      templateId === t.id
                        ? "bg-violet-500/10 border-violet-500/30 text-violet-300"
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    <span className="font-medium">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Log */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Activity Log</h3>
                {activities.length > 0 && (
                  <button onClick={clearLog} className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1">
                    <IconTrash className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {activities.length === 0 && (
                  <div className="text-center py-6 text-slate-600">
                    <IconMail className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-xs">No outreach yet.</p>
                    <p className="text-[10px] mt-1">Send an email or save a draft to see it here.</p>
                  </div>
                )}
                {activities.map((a) => (
                  <div key={a.id} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        {statusIcon(a.type)}
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${statusColor(a.type)}`}>{a.type}</span>
                      </div>
                      <span className="text-[10px] text-slate-600">
                        {new Date(a.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 truncate font-medium">{a.subject}</p>
                    <p className="text-[10px] text-slate-500 truncate">To: {a.to}</p>
                    {a.scheduledFor && (
                      <p className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
                        <IconClock className="w-3 h-3" /> {new Date(a.scheduledFor).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Composer */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">To</label>
                  <input
                    type="email"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="founder@store.com"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject line..."
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Message</label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={14}
                    placeholder="Write your email..."
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <IconClock className="w-4 h-4 text-slate-500" />
                    <input
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                    />
                  </div>

                  <div className="flex items-center gap-2 sm:ml-auto">
                    <button
                      onClick={handleSaveDraft}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <IconSave className="w-4 h-4" /> Save Draft
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={sending || !recipient}
                      className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <IconSend className="w-4 h-4" />
                      {sending ? "Sending..." : scheduledDate ? "Schedule Send" : "Send Now"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OutreachPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0b0f1f] text-slate-200 flex items-center justify-center">
          <div className="animate-pulse flex items-center gap-2 text-slate-500 text-sm">
            <IconZap className="w-4 h-4" /> Loading composer...
          </div>
        </div>
      }
    >
      <OutreachComposer />
    </Suspense>
  );
}