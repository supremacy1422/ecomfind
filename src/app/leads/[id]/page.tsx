'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Navbar from '../../components/Navbar';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Lead {
  id: string;
  store_url: string;
  store_name: string;
  email: string;
  niche: string;
  status: string;
  notes: string;
  times_contacted: number;
  quality_score: number;
  email_valid: boolean;
  email_confidence: number;
  discovered_at: string;
}

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
}

const STATUSES = ['new', 'contacted', 'replied', 'won', 'lost'];

function scoreClass(score: number) {
  if (score >= 70) return 'bg-emerald-500/10 text-emerald-400';
  if (score >= 40) return 'bg-amber-500/10 text-amber-400';
  return 'bg-rose-500/10 text-rose-400';
}

function statusBtnClass(current: string, target: string) {
  if (current === target) return 'bg-violet-600 text-white border-violet-600';
  return 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700';
}

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState('');

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (leadId) {
      fetchLead();
      fetchTemplates();
    }
  }, [leadId]);

  const getToken = async () => {
    const { data: session } = await supabase.auth.getSession();
    return session?.session?.access_token || '';
  };

  const fetchLead = async () => {
    setLoading(true);
    const token = await getToken();
    const res = await fetch('/api/leads/' + leadId, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      router.push('/leads');
      return;
    }
    const data = await res.json();
    setLead(data.lead);
    setNotes(data.lead.notes || '');
    setLoading(false);
  };

  const fetchTemplates = async () => {
    const token = await getToken();
    const res = await fetch('/api/templates', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTemplates(data.templates || []);
  };

  const applyTemplate = (templateId: string) => {
    const t = templates.find((x) => x.id === templateId);
    if (!t || !lead) return;
    setSubject(
      t.subject
        .replace(/\[STORE_NAME\]/g, lead.store_name || 'there')
        .replace(/\[STORE_URL\]/g, lead.store_url || '')
    );
    setMessage(
      t.body
        .replace(/\[STORE_NAME\]/g, lead.store_name || 'there')
        .replace(/\[STORE_URL\]/g, lead.store_url || '')
    );
  };

  const updateStatus = async (newStatus: string) => {
    if (!lead) return;
    setSaving(true);
    const token = await getToken();
    await fetch('/api/leads/status', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ leadId: lead.id, status: newStatus }),
    });
    setSaving(false);
    fetchLead();
  };

  const saveNotes = async () => {
    if (!lead) return;
    setSaving(true);
    const token = await getToken();
    await fetch('/api/leads/status', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ leadId: lead.id, status: lead.status, notes }),
    });
    setSaving(false);
    fetchLead();
  };

  const sendEmail = async () => {
    if (!lead || !subject || !message) {
      setSendResult('❌ Subject and message required');
      return;
    }
    if (!lead.email) {
      setSendResult('❌ No email for this lead');
      return;
    }
    setSending(true);
    setSendResult('⏳ Sending...');

    try {
      const token = await getToken();
      const res = await fetch('/api/gmail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: lead.email,
          subject,
          message,
          leadId: lead.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSendResult('✅ Email sent!');
        setSubject('');
        setMessage('');
        fetchLead();
      } else {
        setSendResult('❌ ' + (data.error || 'Failed to send'));
      }
    } catch {
      setSendResult('❌ Network error');
    }
    setSending(false);
  };

  const findEmail = async () => {
    if (!lead) return;
    setSendResult('🔍 Finding email...');
    const token = await getToken();
    const res = await fetch('/api/discover/email-osint', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ storeUrl: lead.store_url, storeId: lead.id }),
    });
    const data = await res.json();
    if (data.success && data.bestEmail) {
      setSendResult('✅ Found: ' + data.bestEmail);
      fetchLead();
    } else {
      setSendResult('❌ No email found');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <div className="p-8 text-center text-slate-500">Loading lead...</div>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/leads" className="text-sm text-violet-400 hover:text-violet-300">
              ← Back to Leads
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-6">{lead.store_name || 'Unnamed Store'}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Info Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Store Info</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">URL</span>
                  <a href={lead.store_url} target="_blank" rel="noreferrer" className="text-violet-400 hover:text-violet-300 truncate max-w-[200px]">
                    {lead.store_url}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Niche</span>
                  <span className="text-slate-300 capitalize">{lead.niche || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email</span>
                  {lead.email ? (
                    <span className="text-slate-300">{lead.email}</span>
                  ) : (
                    <button onClick={findEmail} className="text-xs bg-amber-500/10 text-amber-300 px-2 py-1 rounded hover:bg-amber-500/20 transition-all">
                      Find Email
                    </button>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Quality</span>
                  <span className={'text-xs px-2 py-0.5 rounded ' + scoreClass(lead.quality_score)}>
                    {lead.quality_score}/100
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contacted</span>
                  <span className="text-slate-300">{lead.times_contacted}x</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <label className="text-xs text-slate-500 uppercase font-medium mb-2 block">Pipeline Stage</label>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(s)}
                      disabled={saving}
                      className={'text-xs px-3 py-1.5 rounded-lg border transition-all ' + statusBtnClass(lead.status, s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <label className="text-xs text-slate-500 uppercase font-medium mb-2 block">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-violet-500 resize-none"
                  placeholder="Add notes about this lead..."
                />
                <button
                  onClick={saveNotes}
                  disabled={saving}
                  className="mt-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs px-4 py-2 rounded-lg transition-all"
                >
                  {saving ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>

            {/* Email Composer */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Outreach</h2>

              {templates.length > 0 && (
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Use Template</label>
                  <select
                    onChange={(e) => applyTemplate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-violet-500 transition-all"
                  >
                    <option value="">— Select a template —</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs text-slate-500 block mb-1">Subject</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-violet-500 transition-all"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 block mb-1">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={10}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-violet-500 transition-all resize-none"
                />
              </div>

              {sendResult && (
                <p className={'text-sm ' + (sendResult.includes('❌') ? 'text-rose-400' : 'text-emerald-400')}>
                  {sendResult}
                </p>
              )}

              <button
                onClick={sendEmail}
                disabled={sending || !lead.email}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl py-2.5 text-sm transition-all shadow-lg shadow-violet-900/25 disabled:opacity-30"
              >
                {sending ? 'Sending...' : lead.email ? '🚀 Send Email' : 'No Email — Find One First'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}