'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from '../components/Navbar';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const getToken = async () => {
    const { data: session } = await supabase.auth.getSession();
    return session?.session?.access_token || '';
  };

  const fetchTemplates = async () => {
    setLoading(true);
    const token = await getToken();
    const res = await fetch('/api/templates', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTemplates(data.templates || []);
    setLoading(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSubject('');
    setBody('');
  };

  const saveTemplate = async () => {
    if (!name.trim() || !subject.trim() || !body.trim()) return;
    setSaving(true);
    const token = await getToken();

    const method = editingId ? 'PUT' : 'POST';

    await fetch('/api/templates', {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: editingId, name, subject, body }),
    });

    setSaving(false);
    resetForm();
    fetchTemplates();
  };

  const startEdit = (t: Template) => {
    setEditingId(t.id);
    setName(t.name);
    setSubject(t.subject);
    setBody(t.body);
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm('Delete this template?')) return;
    const token = await getToken();
    await fetch(`/api/templates?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTemplates();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Email Templates</h1>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              {editingId ? 'Edit Template' : 'New Template'}
            </h2>
            <div className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Template name (e.g. Cold Outreach v1)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition-all"
              />
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject line — use [STORE_NAME], [STORE_URL]"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition-all"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                placeholder={`Hi [STORE_NAME] team,\n\nI came across [STORE_URL] and wanted to reach out...\n\nBest,`}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition-all resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={saveTemplate}
                  disabled={saving}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl px-5 py-2.5 text-sm transition-all disabled:opacity-40"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Template' : 'Save Template'}
                </button>
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl px-5 py-2.5 text-sm transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading templates...</div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500">
              No templates yet. Create your first one above.
            </div>
          ) : (
            <div className="grid gap-4">
              {templates.map((t) => (
                <div
                  key={t.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-200">{t.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{t.subject}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(t)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTemplate(t.id)}
                        className="text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-lg transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 mt-3">
                    <p className="text-sm text-slate-400 whitespace-pre-wrap">{t.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}