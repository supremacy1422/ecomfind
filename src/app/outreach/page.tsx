"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* Types */
interface OutreachLog {
  id: string;
  recipient: string;
  domain: string;
  subject: string;
  template: string;
  status: "draft" | "sent" | "opened" | "replied" | "scheduled";
  sentAt?: string;
  scheduledFor?: string;
}

/* Icons */
const IconZap = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconStore = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const IconMail = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconSend = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);
const IconClock = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconEye = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const IconReply = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
);
const IconTrash = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);
const IconSparkles = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);
const IconCopy = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
);

/* Templates */
const TEMPLATES: Record<string, { name: string; subject: string; body: string }> = {
  audit: {
    name: "Cold Audit Outreach",
    subject: "I audited {{domain}} — found ${{amount}} in recoverable revenue",
    body: `Hi there,

I just ran a forensic revenue audit on {{domain}} and found some significant leaks that are likely costing you sales every month.

Key findings:
- Mobile load time is 4.2s (industry best: 1.1s)
- No abandoned cart recovery flow
- Missing structured data for Google rich snippets
- Weak meta descriptions reducing CTR by ~22%

The good news: most of these are quick fixes. I put together a short priority list ranked by effort vs. revenue impact.

Worth a 10-minute chat this week?

Best,
[Your Name]`,
  },
  value: {
    name: "Value-First Tip",
    subject: "Quick win for {{domain}} (1-hour fix)",
    body: `Hi,

I was browsing {{domain}} and noticed one small thing that's probably costing you conversions:

Your product pages load in 4+ seconds on mobile. Every 1-second delay drops conversions by ~7%. That's a lot of lost revenue from a fixable problem.

The quickest win: compress your images to WebP and enable lazy loading. Most Shopify stores see a 1-2 second improvement within an hour.

I help Shopify stores fix exactly this kind of thing. If you'd like, I can send over a free 5-minute audit report with the full breakdown.

No pitch — just thought it might help.

Cheers,
[Your Name]`,
  },
  followup: {
    name: "Follow-Up",
    subject: "Re: {{domain}} audit — one question",
    body: `Hi,

I reached out last week about the revenue audit I ran on {{domain}}. Totally understand if it got buried.

Quick question: are you currently tracking cart abandonment rates? Most stores I audit are losing 15-20% of checkouts to fixable friction, and they don't even realize it.

If that's something on your radar, happy to share the audit report — no strings attached.

Either way, keep up the great work with the store.

Best,
[Your Name]`,
  },
  partnership: {
    name: "Partnership",
    subject: "Collaboration idea for {{domain}}",
    body: `Hi,

I've been following {{domain}} for a while — love what you're building.

I run a small CRO studio focused on Shopify brands. We specialize in turning more visitors into buyers through speed optimization, checkout flows, and email recovery.

I think there's a natural fit here. Would you be open to a quick 15-minute call to explore how we might help {{domain}} scale?

I can share some case studies from similar brands in the {{industry}} space.

Talk soon,
[Your Name]`,
  },
};

/* Status Badge */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: "bg-slate-800 text-slate-400",
    scheduled: "bg-amber-500/10 text-amber-400",
    sent: "bg-emerald-500/10 text-emerald-400",
    opened: "bg-sky-500/10 text-sky-400",
    replied: "bg-violet-500/10 text-violet-400",
  };
  const icons: Record<string, React.ReactNode> = {
    draft: <IconMail className="w-3 h-3" />,
    scheduled: <IconClock className="w-3 h-3" />,
    sent: <IconCheck className="w-3 h-3" />,
    opened: <IconEye className="w-3 h-3" />,
    replied: <IconReply className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full font-semibold ${map[status] || map.draft}`}>
      {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

/* Inner Component */
function OutreachComposer() {
  const searchParams = useSearchParams();
  const paramEmail = searchParams.get("email") || "";
  const paramDomain = searchParams.get("domain") || "";

  const [recipient, setRecipient] = useState(paramEmail);
  const [domain, setDomain] = useState(paramDomain);
  const [templateKey, setTemplateKey] = useState("audit");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState("");
  const [sendStatus, setSendStatus] = useState("");
  const [scheduleMode, setScheduleMode] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [logs, setLogs] = useState<OutreachLog[]>([]);
  const [user, setUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const checkGmailConnection = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    if (session?.user?.email) setFromEmail(session.user.email);

    if (session?.user) {
      const { data } = await supabase
        .from("gmail_connections")
        .select("email")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (data?.email) {
        setGmailConnected(true);
        setGmailEmail(data.email);
      } else {
        setGmailConnected(false);
        setGmailEmail("");
      }
    }
  };

  useEffect(() => {
    checkGmailConnection();
    const saved = localStorage.getItem("outreachLogs");
    if (saved) setLogs(JSON.parse(saved));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchParams.get("gmail") === "connected") {
      checkGmailConnection();
      setSendStatus("OK Gmail connected successfully");
      setTimeout(() => setSendStatus(""), 4000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const t = TEMPLATES[templateKey];
    if (!t) return;
    const vars: Record<string, string> = {
      domain: domain || "their-store.com",
      amount: "12K",
      industry: "Fashion",
    };
    let sub = t.subject;
    let bod = t.body;
    Object.entries(vars).forEach(([k, v]) => {
      sub = sub.replace(new RegExp(`{{${k}}}`, "g"), v);
      bod = bod.replace(new RegExp(`{{${k}}}`, "g"), v);
    });
    setSubject(sub);
    setBody(bod);
  }, [templateKey, domain]);

  const persistLogs = (newLogs: OutreachLog[]) => {
    setLogs(newLogs);
    localStorage.setItem("outreachLogs", JSON.stringify(newLogs));
  };

  const handleSend = async () => {
    if (!recipient || !subject || !body) {
      setSendStatus("Please fill in recipient, subject, and body.");
      return;
    }

    if (!gmailConnected) {
      setSendStatus("Connect your Gmail first");
      return;
    }

    setSending(true);
    setSendStatus("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipient,
          subject,
          body,
          fromName: fromName || user?.email?.split("@")[0] || "EcomFind",
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to send");

      const newLog: OutreachLog = {
        id: Math.random().toString(36).substring(2, 10),
        recipient,
        domain: domain || "—",
        subject,
        template: TEMPLATES[templateKey].name,
        status: scheduleMode ? "scheduled" : "sent",
        sentAt: scheduleMode ? undefined : new Date().toISOString(),
        scheduledFor: scheduleMode ? scheduleDate : undefined,
      };

      persistLogs([newLog, ...logs]);

      if (user) {
        await supabase.from("outreach_logs").insert({
          user_id: user.id,
          lead_domain: domain || "—",
          template_type: TEMPLATES[templateKey].name,
          subject,
          body,
          status: scheduleMode ? "scheduled" : "sent",
          sent_at: scheduleMode ? null : new Date().toISOString(),
        });
      }

      setSendStatus(scheduleMode ? "OK Email scheduled" : "OK Email sent successfully");
      if (!scheduleMode) {
        setSubject("");
        setBody("");
      }
    } catch (err: any) {
      setSendStatus("Error: " + err.message);
    } finally {
      setSending(false);
      setTimeout(() => setSendStatus(""), 4000);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteLog = (id: string) => {
    persistLogs(logs.filter((l) => l.id !== id));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Composer */}
      <div className="xl:col-span-2 space-y-6">
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <IconSparkles className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-bold text-white">Email Composer</h2>
          </div>

          {/* Template Selector */}
          <div className="mb-6">
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">AI Template</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(TEMPLATES).map(([key, t]) => (
                <button
                  key={key}
                  onClick={() => setTemplateKey(key)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors text-left ${
                    templateKey === key
                      ? "bg-violet-500/10 text-violet-400 border-violet-500/30"
                      : "bg-slate-950/50 text-slate-400 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* From / To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">From Name</label>
              <input
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">From Email</label>
              <input
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">To (Recipient)</label>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="owner@store.com"
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
          </div>

          <div className="mb-4">
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">Store Domain</label>
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="store.com"
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
          </div>

          <div className="mb-4">
            <label className="text-xs text-slate-500 uppercase tracking-wider mb-1 block">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-500 uppercase tracking-wider">Body</label>
              <button onClick={copyToClipboard} className="text-[10px] text-slate-500 hover:text-violet-400 flex items-center gap-1 transition-colors">
                {copied ? <IconCheck className="w-3 h-3" /> : <IconCopy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none font-mono leading-relaxed"
            />
            <p className="text-[10px] text-slate-600 mt-1">Tip: Personalize the bracketed sections before sending.</p>
          </div>

          {/* Schedule Toggle */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setScheduleMode(!scheduleMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                scheduleMode ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              <IconClock className="w-3.5 h-3.5" />
              {scheduleMode ? "Scheduling On" : "Schedule Send"}
            </button>
            {scheduleMode && (
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              />
            )}
          </div>

          {/* Gmail Connection */}
          {!gmailConnected ? (
            <button
              onClick={async () => {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.access_token) {
                  window.location.href = `/api/auth/gmail?token=${session.access_token}`;
                } else {
                  window.location.href = "/login?redirect=/outreach";
                }
              }}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-sm transition-colors mb-4 block text-center"
            >
              Connect Your Gmail to Send
            </button>
          ) : (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <span className="text-xs text-emerald-400">Sending via: {gmailEmail}</span>
              <button
                onClick={async () => {
                  const { data: { session } } = await supabase.auth.getSession();
                  await fetch("/api/auth/gmail/disconnect", {
                    method: "POST",
                    headers: { "x-supabase-token": session?.access_token || "" },
                  });
                  setGmailConnected(false);
                  setGmailEmail("");
                  setSendStatus("Gmail disconnected");
                  setTimeout(() => setSendStatus(""), 3000);
                }}
                className="text-xs text-emerald-400 hover:text-rose-400 underline transition-colors"
              >
                Disconnect
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSend}
              disabled={sending || !recipient || !gmailConnected}
              className="flex-1 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <IconSend className="w-4 h-4" />
              )}
              {scheduleMode ? "Schedule Email" : "Send Now"}
            </button>
          </div>

          {sendStatus && (
            <p className={`mt-3 text-sm ${sendStatus.startsWith("OK") ? "text-emerald-400" : "text-rose-400"}`}>
              {sendStatus}
            </p>
          )}
        </div>

        {/* Tips */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
          <h3 className="text-sm font-bold text-white mb-3">Outreach Tips</h3>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">-</span> Personalize the first line with something specific about their store.</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">-</span> Keep subject lines under 50 characters for better open rates.</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">-</span> Follow up 3-4 days after the first email if no reply.</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">-</span> Send between 8-10 AM in the recipient's timezone.</li>
          </ul>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Stats */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
          <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">This Month</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
              <div className="text-xl font-bold text-white">{logs.length}</div>
              <div className="text-[10px] text-slate-500 mt-1">Total Sent</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
              <div className="text-xl font-bold text-emerald-400">{logs.filter((l) => l.status === "sent" || l.status === "opened" || l.status === "replied").length}</div>
              <div className="text-[10px] text-slate-500 mt-1">Delivered</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
              <div className="text-xl font-bold text-sky-400">{logs.filter((l) => l.status === "opened").length}</div>
              <div className="text-[10px] text-slate-500 mt-1">Opened</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
              <div className="text-xl font-bold text-violet-400">{logs.filter((l) => l.status === "replied").length}</div>
              <div className="text-[10px] text-slate-500 mt-1">Replied</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
          <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Recent Activity</h3>
          {logs.length === 0 ? (
            <div className="text-center py-6 text-slate-600">
              <IconMail className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">No outreach yet.</p>
              <p className="text-[10px] mt-1">Send your first email from the composer.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white font-medium truncate max-w-[140px]">{log.recipient}</span>
                    <StatusBadge status={log.status} />
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mb-1">{log.subject}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-600">
                      {log.sentAt ? new Date(log.sentAt).toLocaleDateString() : log.scheduledFor ? `Scheduled ${new Date(log.scheduledFor).toLocaleDateString()}` : "Draft"}
                    </span>
                    <button onClick={() => deleteLog(log.id)} className="text-slate-600 hover:text-rose-400 transition-colors">
                      <IconTrash className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Loading fallback */
function OutreachSkeleton() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-pulse">
      <div className="xl:col-span-2 space-y-6">
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 h-[600px]">
          <div className="h-6 bg-slate-800 rounded w-1/3 mb-6"></div>
          <div className="h-10 bg-slate-800 rounded mb-4"></div>
          <div className="h-10 bg-slate-800 rounded mb-4"></div>
          <div className="h-32 bg-slate-800 rounded mb-4"></div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5 h-48">
          <div className="h-4 bg-slate-800 rounded w-1/2 mb-3"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 bg-slate-800 rounded"></div>
            <div className="h-16 bg-slate-800 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Page Wrapper */
export default function OutreachPage() {
  return (
    <div className="min-h-screen bg-[#0b0f1f] text-slate-200">
      <header className="border-b border-slate-800/60 bg-[#0b0f1e]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mr-4">
              <IconStore className="w-5 h-5" />
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
            <a href="/founder" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Founder</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Outreach Center</h1>
          <p className="text-slate-400">AI-generated email templates personalized for every lead.</p>
        </div>

        <Suspense fallback={<OutreachSkeleton />}>
          <OutreachComposer />
        </Suspense>
      </main>
    </div>
  );
}