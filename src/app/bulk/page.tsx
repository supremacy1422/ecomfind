'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from '../components/Navbar';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Lead {
  id: string;
  store_name: string;
  store_url: string;
  email: string;
  niche: string;
  status: string;
  times_contacted: number;
}

export default function BulkPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [fromName, setFromName] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState('');

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
    const all = data.leads || [];
    setLeads(all);
    // Auto-select all leads that have emails
    const withEmail = all.filter((l: Lead) => l.email && l.email.includes('@'));
    setSelected(new Set(withEmail.map((l: Lead) => l.id)));
    setLoading(false);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const selectedLeads = leads.filter((l) => selected.has(l.id) && l.email && l.email.includes('@'));

  const sendBulk = async () => {
    if (!subject || !message) {
      setResult('❌ Subject and message required');
      return;
    }
    if (selectedLeads.length === 0) {
      setResult('❌ No leads with emails selected');
      return;
    }

    setSending(true);
    setResult('⏳ Sending...');

    try {
      const token = await getToken();
      const res = await fetch('/api/leads/bulk-email', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadIds: Array.from(selected),
          subject,
          message,
          fromName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(`✅ Sent ${data.sent} emails${data.failed > 0 ? `, ${data.failed} failed` : ''}`);
        fetchLeads();
      } else {
        setResult(`❌ ${data.error}`);
      }
    } catch {
      setResult('❌ Network error');
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Bulk Outreach</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Compose Panel */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sticky top-24">
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Compose</h2>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Your Name</label>
                    <input
                      value={fromName}
                      onChange={(e) => setFromName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-violet-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Subject</label>
                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Quick question about your store"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-violet-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">
                      Message <span className="text-slate-600">[STORE_NAME] [STORE_URL]</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={10}
                      placeholder={`Hi [STORE_NAME] team,\n\nI came across [STORE_URL] and wanted to reach out...\n\nBest,\n${fromName || 'Your Name'}`}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-violet-500 transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800">
                  <p className="text-xs text-slate-400 mb-3">
                    Sending to <span className="text-emerald-400 font-bold">{selectedLeads.length}</span> leads
                  </p>
                  {result && (
                    <p className={`text-xs mb-3 ${result.includes('❌') ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {result}
                    </p>
                  )}
                  <button
                    onClick={sendBulk}
                    disabled={sending || selectedLeads.length === 0}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl py-2.5 text-sm transition-all shadow-lg shadow-violet-900/25 disabled:opacity-30"
                  >
                    {sending ? 'Sending...' : `🚀 Send to ${selectedLeads.length} Leads`}
                  </button>
                </div>
              </div>
            </div>

            {/* Leads Table */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-300">
                    Leads with Emails ({leads.filter((l) => l.email).length})
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelected(new Set(leads.filter((l) => l.email).map((l) => l.id)))}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-all"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => setSelected(new Set())}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-all"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="p-8 text-center text-slate-500">Loading...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-800 text-slate-400">
                        <tr>
                          <th className="px-4 py-3 w-10">
                            <input
                              type="checkbox"
                              checked={selected.size === leads.filter((l) => l.email).length && leads.filter((l) => l.email).length > 0}
                              onChange={() =>
                                selected.size === leads.filter((l) => l.email).length
                                  ? setSelected(new Set())
                                  : setSelected(new Set(leads.filter((l) => l.email).map((l) => l.id)))
                              }
                              className="accent-violet-600"
                            />
                          </th>
                          <th className="px-4 py-3 font-medium">Store</th>
                          <th className="px-4 py-3 font-medium">Email</th>
                          <th className="px-4 py-3 font-medium">Niche</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {leads
                          .filter((l) => l.email)
                          .map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-800/50">
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={selected.has(lead.id)}
                                  onChange={() => toggleSelect(lead.id)}
                                  className="accent-violet-600"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <p className="font-medium text-slate-200">{lead.store_name || 'Unnamed'}</p>
                                <a
                                  href={lead.store_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-violet-400 hover:text-violet-300"
                                >
                                  {lead.store_url?.replace(/^https?:\/\//, '')}
                                </a>
                              </td>
                              <td className="px-4 py-3 text-slate-300 text-xs">{lead.email}</td>
                              <td className="px-4 py-3">
                                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                                  {lead.niche}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    lead.status === 'contacted'
                                      ? 'bg-amber-500/10 text-amber-400'
                                      : lead.status === 'replied'
                                      ? 'bg-blue-500/10 text-blue-400'
                                      : lead.status === 'won'
                                      ? 'bg-emerald-500/10 text-emerald-400'
                                      : 'bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  {lead.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        {leads.filter((l) => l.email).length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                              No leads with emails found. Go to Discover to find stores.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}