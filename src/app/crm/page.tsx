'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from '../components/Navbar';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const STAGES = [
  { key: 'new', label: 'New', color: 'border-slate-600 bg-slate-800/50' },
  { key: 'contacted', label: 'Contacted', color: 'border-amber-500/30 bg-amber-500/5' },
  { key: 'replied', label: 'Replied', color: 'border-blue-500/30 bg-blue-500/5' },
  { key: 'won', label: 'Won', color: 'border-emerald-500/30 bg-emerald-500/5' },
  { key: 'lost', label: 'Lost', color: 'border-rose-500/30 bg-rose-500/5' },
];

interface Lead {
  id: string;
  store_name: string;
  store_url: string;
  email: string;
  status: string;
  times_contacted: number;
  notes: string;
  quality_score: number;
}

export default function CrmPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const getToken = async () => {
    const { data: session } = await supabase.auth.getSession();
    return session?.session?.access_token || '';
  };

  const fetchLeads = async () => {
    setLoading(true);
    const token = await getToken();
    const res = await fetch('/api/leads/list', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setLeads(data.leads || []);
    setLoading(false);
  };

  const moveStatus = async (leadId: string, newStatus: string) => {
    setMoving(true);
    const token = await getToken();
    await fetch('/api/leads/status', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ leadId, status: newStatus }),
    });
    setMoving(false);
    fetchLeads();
  };

  const saveNotes = async () => {
    if (!selectedLead) return;
    const token = await getToken();
    await fetch('/api/leads/status', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ leadId: selectedLead.id, status: selectedLead.status, notes: noteDraft }),
    });
    setSelectedLead(null);
    fetchLeads();
  };

  const leadsByStage = (status: string) => leads.filter((l) => l.status === status);

  const getScoreClass = (score: number) => {
    if (score >= 70) return 'bg-emerald-500/10 text-emerald-400';
    if (score >= 40) return 'bg-amber-500/10 text-amber-400';
    return 'bg-rose-500/10 text-rose-400';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Sales Pipeline</h1>

          {loading ? (
            <div className="text-center py-16 text-slate-500">Loading pipeline...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {STAGES.map((stage) => (
                <div key={stage.key} className="flex flex-col gap-3">
                  <div className={`flex items-center justify-between p-3 rounded-xl border ${stage.color}`}>
                    <span className="text-sm font-semibold">{stage.label}</span>
                    <span className="text-xs bg-slate-900 px-2 py-0.5 rounded-full text-slate-400">
                      {leadsByStage(stage.key).length}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 min-h-[200px]">
                    {leadsByStage(stage.key).map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => {
                          setSelectedLead(lead);
                          setNoteDraft(lead.notes || '');
                        }}
                        className="cursor-pointer text-left bg-slate-900 border border-slate-800 hover:border-slate-600 p-3 rounded-xl transition-all"
                      >
                        <p className="font-medium text-sm text-slate-200 truncate">{lead.store_name || 'Unnamed'}</p>
                        <p className="text-xs text-slate-500 truncate">{lead.email || 'No email'}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                            {lead.times_contacted}x
                          </span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${getScoreClass(lead.quality_score)}`}>
                            {lead.quality_score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold mb-1">{selectedLead.store_name || 'Unnamed Store'}</h3>
            <a
              href={selectedLead.store_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-violet-400 hover:text-violet-300 mb-4 block"
            >
              {selectedLead.store_url}
            </a>

            <div className="mb-4">
              <label className="text-xs text-slate-500 uppercase font-medium mb-2 block">Move to Stage</label>
              <div className="flex flex-wrap gap-2">
                {STAGES.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => moveStatus(selectedLead.id, s.key)}
                    disabled={moving || selectedLead.status === s.key}
                    className={
                      selectedLead.status === s.key
                        ? 'text-xs px-3 py-1.5 rounded-lg border bg-violet-600 text-white border-violet-600'
                        : 'text-xs px-3 py-1.5 rounded-lg border bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs text-slate-500 uppercase font-medium mb-2 block">Notes</label>
              <textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none focus:border-violet-500 resize-none"
                placeholder="Add private notes about this lead..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveNotes}
                className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl py-2.5 text-sm transition-all"
              >
                Save Notes
              </button>
              <button
                onClick={() => setSelectedLead(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium rounded-xl py-2.5 text-sm transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}