"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const IconZap = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconPlus = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const IconTrash = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);
const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconClock = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const IconMail = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconClose = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

interface StepInput {
  delay_days: number;
  subject: string;
  body: string;
}

export default function FollowUpsPage() {
  const [sequences, setSequences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [steps, setSteps] = useState<StepInput[]>([
    { delay_days: 0, subject: "", body: "" },
    { delay_days: 2, subject: "", body: "" },
    { delay_days: 5, subject: "", body: "" },
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSequences();
  }, []);

  const loadSequences = async () => {
    setLoading(true);
    const { data: session } = await supabase.auth.getSession();
    const res = await fetch("/api/follow-ups/sequences", {
      headers: { Authorization: `Bearer ${session?.session?.access_token}` },
    });
    const json = await res.json();
    setSequences(json.sequences || []);
    setLoading(false);
  };

  const createSequence = async () => {
    if (!name || steps.some((s) => !s.subject || !s.body)) return;
    setSaving(true);
    const { data: session } = await supabase.auth.getSession();
    const res = await fetch("/api/follow-ups/sequences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.session?.access_token}`,
      },
      body: JSON.stringify({ name, description: desc, steps }),
    });
    setSaving(false);
    if (res.ok) {
      setShowCreate(false);
      setName("");
      setDesc("");
      setSteps([
        { delay_days: 0, subject: "", body: "" },
        { delay_days: 2, subject: "", body: "" },
        { delay_days: 5, subject: "", body: "" },
      ]);
      loadSequences();
    }
  };

  const deleteSequence = async (id: string) => {
    if (!confirm("Delete this sequence?")) return;
    const { data: session } = await supabase.auth.getSession();
    await fetch(`/api/follow-ups/sequences?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session?.session?.access_token}` },
    });
    loadSequences();
  };

  const updateStep = (i: number, field: keyof StepInput, val: string | number) => {
    setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));
  };

  const addStep = () => setSteps((prev) => [...prev, { delay_days: 3, subject: "", body: "" }]);
  const removeStep = (i: number) => setSteps((prev) => prev.filter((_, idx) => idx !== i));

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
            <a href="/follow-ups" className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-sm transition-colors">Follow-ups</a>
            <a href="/dashboard" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Dashboard</a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Follow-up Sequences</h1>
            <p className="text-sm text-slate-400">Build automated email sequences. Day 0 → Day 2 → Day 5.</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            <IconPlus className="w-4 h-4" /> New Sequence
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sequences.length === 0 ? (
          <div className="rounded-xl bg-slate-900/40 border border-slate-800 border-dashed p-12 text-center">
            <IconMail className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No sequences yet</h3>
            <p className="text-sm text-slate-500 mb-5">Create your first follow-up sequence to automate outreach.</p>
            <button onClick={() => setShowCreate(true)} className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-colors inline-flex items-center gap-2">
              <IconPlus className="w-4 h-4" /> Create Sequence
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sequences.map((seq) => (
              <div key={seq.id} className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">{seq.name}</h3>
                    {seq.description && <p className="text-xs text-slate-500 mt-0.5">{seq.description}</p>}
                  </div>
                  <button onClick={() => deleteSequence(seq.id)} className="p-2 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {seq.steps?.sort((a: any, b: any) => a.step_order - b.step_order).map((step: any, i: number) => (
                    <div key={step.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/50 border border-slate-800">
                      <div className="w-7 h-7 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 text-xs font-bold text-violet-400">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-slate-400">Day {step.delay_days}</span>
                          <span className="text-[10px] text-slate-600">·</span>
                          <span className="text-xs text-slate-300 truncate">{step.subject}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{step.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#0f1429] border border-slate-700 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-white">New Follow-up Sequence</h3>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors">
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">Sequence Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Agency Intro — 3 Touch" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">Description</label>
                <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Optional" className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40" />
              </div>

              <div className="border-t border-slate-800 pt-4">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Steps</h4>
                <div className="space-y-3">
                  {steps.map((s, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-violet-400 w-6">#{i + 1}</span>
                        <div className="flex-1">
                          <label className="text-[10px] text-slate-600 uppercase">Delay (days)</label>
                          <input type="number" min={0} value={s.delay_days} onChange={(e) => updateStep(i, "delay_days", Number(e.target.value))} className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-sm text-white text-center" />
                        </div>
                        {steps.length > 1 && (
                          <button onClick={() => removeStep(i)} className="text-slate-600 hover:text-rose-400 transition-colors">
                            <IconTrash className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <input value={s.subject} onChange={(e) => updateStep(i, "subject", e.target.value)} placeholder="Subject line" className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-white placeholder-slate-600" />
                      <textarea value={s.body} onChange={(e) => updateStep(i, "body", e.target.value)} placeholder="Email body... Use {{domain}} and {{email}}" rows={3} className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-white placeholder-slate-600 resize-none" />
                    </div>
                  ))}
                </div>
                <button onClick={addStep} className="mt-2 text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1">
                  <IconPlus className="w-3 h-3" /> Add step
                </button>
              </div>

              <button
                onClick={createSequence}
                disabled={saving || !name || steps.some((s) => !s.subject || !s.body)}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><IconClock className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                  <><IconCheck className="w-4 h-4" /> Create Sequence</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}