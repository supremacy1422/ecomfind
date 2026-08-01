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
const IconMail = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconCopy = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
);
const IconSend = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);
const IconEye = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const IconClock = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const IconTrash = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);
const IconGlobe = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const IconAlert = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
const IconChevronDown = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
);

/* ─── Templates ─── */
const TEMPLATES: Record<string, { name: string; subject: string; body: string }> = {
  "cro-audit": {
    name: "CRO Audit Offer",
    subject: "Quick win for {{domain}} — free CRO audit inside",
    body: `Hi there,

I was looking at {{domain}} and noticed a few quick wins that could boost conversion rate by 15–20%.

I put together a 2-minute video audit showing exactly what I'd change and why.

Worth a look? I can send it over — no pitch, just value.

Best,
Oladoja`,
  },
  "performance": {
    name: "Speed & Performance",
    subject: "{{domain}} is losing mobile shoppers to load time",
    body: `Hi,

I ran {{domain}} through our performance scanner. Your mobile load time is costing you roughly 12% of potential revenue.

I built a 5-point fix list that most Shopify stores overlook. Happy to share it — takes 10 minutes to implement and usually lifts mobile conversion 8–10%.

Want me to send it over?

Cheers,
Oladoja`,
  },
  "seo-gap": {
    name: "SEO Gap Analysis",
    subject: "{{domain}} vs. competitors — the SEO gap",
    body: `Hi,

I compared {{domain}}'s organic footprint to two of your closest competitors. There are 3 content gaps driving ~2,400 monthly visits to their sites instead of yours.

I put the findings into a one-page brief. No charge — just thought you'd find it useful.

Send it over?

Best,
Oladoja`,
  },
  "custom": {
    name: "Custom Message",
    subject: "",
    body: "",
  },
};

/* ─── Types ─── */
interface SavedLead {
  id: string;
  domain: string;
  shopify_domain?: string;
  email?: string;
  country?: string;
  industry?: string;
  products?: number;
  score?: number;
}

/* ─── Variable Replacer ─── */
function replaceVars(template: string, lead: SavedLead) {
  return template
    .replace(/{{domain}}/g, lead.domain)
    .replace(/{{industry}}/g, lead.industry || "e-commerce")
    .replace(/{{country}}/g, lead.country || "your market")
    .replace(/{{score}}/g, lead.score?.toString() || "—")
    .replace(/{{products}}/g, lead.products?.toLocaleString() || "—")
    .replace(/{{shopify_domain}}/g, lead.shopify_domain || lead.domain);
}

/* ─── Main Page ─── */
export default function BulkOutreachPage() {
  const [user, setUser] = useState<any>(null);
  const [leads, setLeads] = useState<SavedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [templateKey, setTemplateKey] = useState("cro-audit");
  const [customSubject, setCustomSubject] = useState("");
  const [customBody, setCustomBody] = useState("");
  const [previewLead, setPreviewLead] = useState<SavedLead | null>(null);
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<{ sent: number; failed: number; copied: number } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) loadLeads(session.user.id);
      else setLoading(false);
    });
  }, []);

  const loadLeads = async (userId: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("saved_leads")
      .select("id,domain,shopify_domain,email,country,industry,products,score")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setLeads(data);
    setLoading(false);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === leads.length) setSelected(new Set());
    else setSelected(new Set(leads.map((l) => l.id)));
  };

  const selectedLeads = leads.filter((l) => selected.has(l.id));

  const currentTemplate = TEMPLATES[templateKey];
  const subjectFor = (lead: SavedLead) =>
    templateKey === "custom" ? replaceVars(customSubject, lead) : replaceVars(currentTemplate.subject, lead);
  const bodyFor = (lead: SavedLead) =>
    templateKey === "custom" ? replaceVars(customBody, lead) : replaceVars(currentTemplate.body, lead);

  const copyAll = async () => {
    const text = selectedLeads
      .map((l) => `To: ${l.email || l.domain}\nSubject: ${subjectFor(l)}\n\n${bodyFor(l)}\n---`)
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    setResults({ sent: 0, failed: 0, copied: selectedLeads.length });
    setTimeout(() => setResults(null), 4000);
  };

  const sendBatch = async () => {
    if (!user || selectedLeads.length === 0) return;
    setSending(true);
    let sent = 0;
    let failed = 0;

    for (const lead of selectedLeads) {
      const { error } = await supabase.from("outreach_logs").insert({
        user_id: user.id,
        lead_domain: lead.domain,
        template_type: TEMPLATES[templateKey].name,
        subject: subjectFor(lead),
        body: bodyFor(lead),
        status: "sent",
        sent_at: new Date().toISOString(),
      });
      if (error) failed++;
      else sent++;
    }

    setSending(false);
    setResults({ sent, failed, copied: 0 });
    setSelected(new Set());
    setTimeout(() => setResults(null), 5000);
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Remove this lead from saved?")) return;
    await supabase.from("saved_leads").delete().eq("id", id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-[#0b0f1f] text-slate-200 flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
            <IconMail className="w-7 h-7 text-violet-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-sm text-slate-400 mb-6">Log in to access bulk outreach and your saved leads.</p>
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
            <a href="/bulk-outreach" className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 text-sm font-medium border border-violet-500/20">Bulk</a>
            <a href="/dashboard" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Dashboard</a>
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
          <h1 className="text-3xl font-bold text-white mb-2">Bulk Outreach</h1>
          <p className="text-slate-400">Select leads, pick a template, and send personalized emails at scale.</p>
        </div>

        {/* Results Banner */}
        {results && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${results.failed > 0 ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
            <IconCheck className="w-5 h-5" />
            <div className="text-sm font-medium">
              {results.copied > 0
                ? `${results.copied} emails copied to clipboard. Paste into your email client.`
                : `${results.sent} sent · ${results.failed} failed`}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ─── Left: Lead Selector ─── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Saved Leads ({leads.length})</h2>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.size === leads.length && leads.length > 0}
                    onChange={selectAll}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-violet-500 focus:ring-violet-500/40"
                  />
                  Select All
                </label>
                {selected.size > 0 && (
                  <span className="text-xs text-violet-400 font-medium bg-violet-500/10 px-2 py-1 rounded-full border border-violet-500/20">
                    {selected.size} selected
                  </span>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-16 rounded-2xl bg-slate-900/30 border border-slate-800 border-dashed">
                <IconGlobe className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No saved leads yet.</p>
                <a href="/leads" className="inline-block mt-3 text-sm text-violet-400 hover:text-violet-300 font-medium">Browse leads →</a>
              </div>
            ) : (
              <div className="space-y-2">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                      selected.has(lead.id)
                        ? "bg-violet-500/5 border-violet-500/30"
                        : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(lead.id)}
                      onChange={() => toggleSelect(lead.id)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-violet-500 focus:ring-violet-500/40 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white truncate">{lead.domain}</span>
                        {lead.email && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                            Has Email
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        {lead.country && <span>{lead.country}</span>}
                        {lead.industry && <span>{lead.industry}</span>}
                        {lead.score !== undefined && <span className={lead.score >= 80 ? "text-emerald-400" : lead.score >= 60 ? "text-amber-400" : "text-rose-400"}>{lead.score}/100</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => setPreviewLead(lead)}
                      className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
                      title="Preview"
                    >
                      <IconEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="p-2 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                      title="Remove"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── Right: Template & Actions ─── */}
          <div className="space-y-6">
            {/* Template Picker */}
            <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Template</h3>
              <div className="space-y-2">
                {Object.entries(TEMPLATES).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => setTemplateKey(key)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${
                      templateKey === key
                        ? "bg-violet-500/10 text-violet-400 border-violet-500/30"
                        : "bg-slate-950/30 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>

              {templateKey === "custom" && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Subject</label>
                    <input
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      placeholder="Subject line..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-950/50 border border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Body</label>
                    <textarea
                      value={customBody}
                      onChange={(e) => setCustomBody(e.target.value)}
                      placeholder="Email body..."
                      rows={6}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950/50 border border-slate-700 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none"
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 p-3 rounded-lg bg-slate-950/30 border border-slate-800">
                <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Variables</p>
                <div className="flex flex-wrap gap-1.5">
                  {["{{domain}}", "{{industry}}", "{{country}}", "{{score}}", "{{products}}"].map((v) => (
                    <span key={v} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">{v}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  disabled={selectedLeads.length === 0}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-sm font-medium transition-colors border border-slate-700"
                >
                  <IconEye className="w-4 h-4" /> {showPreview ? "Hide Preview" : "Show Preview"}
                </button>

                <button
                  onClick={copyAll}
                  disabled={selectedLeads.length === 0}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-sm font-medium transition-colors border border-slate-700"
                >
                  <IconCopy className="w-4 h-4" /> Copy All to Clipboard
                </button>

                <button
                  onClick={sendBatch}
                  disabled={sending || selectedLeads.length === 0}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending {selectedLeads.length}...
                    </>
                  ) : (
                    <>
                      <IconSend className="w-4 h-4" /> Log {selectedLeads.length} to Outreach
                    </>
                  )}
                </button>
              </div>

              <p className="mt-4 text-[10px] text-slate-600 leading-relaxed">
                Emails are saved to your outreach log. Connect SendGrid or Resend in settings to send for real.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Preview Panel ─── */}
        {showPreview && selectedLeads.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-bold text-white">Preview ({selectedLeads.length} emails)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedLeads.slice(0, 6).map((lead) => (
                <div key={lead.id} className="rounded-xl bg-slate-900/40 border border-slate-800 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-violet-400">{lead.domain}</span>
                    <span className="text-[10px] text-slate-600">{lead.email || "No email on file"}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Subject</span>
                    <p className="text-sm text-white font-medium mt-0.5">{subjectFor(lead)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Body</span>
                    <p className="text-sm text-slate-300 mt-0.5 whitespace-pre-line leading-relaxed">{bodyFor(lead)}</p>
                  </div>
                </div>
              ))}
              {selectedLeads.length > 6 && (
                <div className="rounded-xl bg-slate-900/20 border border-dashed border-slate-800 flex items-center justify-center p-5">
                  <p className="text-sm text-slate-500">+{selectedLeads.length - 6} more</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Single Preview Modal ─── */}
        {previewLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewLead(null)}>
            <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Preview: {previewLead.domain}</h3>
                <button onClick={() => setPreviewLead(null)} className="text-slate-500 hover:text-white">✕</button>
              </div>
              <div className="mb-3">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Subject</span>
                <p className="text-sm text-white font-medium mt-1">{subjectFor(previewLead)}</p>
              </div>
              <div className="mb-6">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Body</span>
                <p className="text-sm text-slate-300 mt-1 whitespace-pre-line leading-relaxed bg-slate-950/50 p-4 rounded-lg border border-slate-800">{bodyFor(previewLead)}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    toggleSelect(previewLead.id);
                    setPreviewLead(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    selected.has(previewLead.id)
                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                      : "bg-violet-600 hover:bg-violet-500 text-white"
                  }`}
                >
                  {selected.has(previewLead.id) ? "Deselect" : "Select for Batch"}
                </button>
                <button onClick={() => setPreviewLead(null)} className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}