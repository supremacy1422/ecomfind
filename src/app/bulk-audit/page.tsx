'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from '../components/Navbar';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BulkAuditPage() {
  const [urls, setUrls] = useState('');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [savedCount, setSavedCount] = useState(0);

  const getToken = async () => {
    const { data: session } = await supabase.auth.getSession();
    return session?.session?.access_token || '';
  };

  const runAudit = async () => {
    const lines = urls.split('\n').map(u => u.trim()).filter(u => u);
    if (lines.length === 0) return;

    setRunning(true);
    setResults([]);
    setSavedCount(0);

    const token = await getToken();
    const res = await fetch('/api/bulk-analyze', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls: lines }),
    });
    const data = await res.json();

    if (data.success) {
      setResults(data.results || []);
      setSavedCount(data.saved || 0);
    }
    setRunning(false);
  };

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Bulk Audit</h1>
          <p className="text-slate-400 text-sm mb-6">
            Paste up to 50 store URLs (one per line). We'll scrape emails from all of them and save valid ones to your leads.
          </p>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              rows={10}
              placeholder={`https://store1.com
https://store2.com
https://store3.com`}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition-all resize-none font-mono"
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-slate-500">
                {urls.split('\n').filter(u => u.trim()).length} URLs • Max 50
              </span>
              <button
                onClick={runAudit}
                disabled={running || !urls.trim()}
                className="bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl px-6 py-2.5 text-sm transition-all disabled:opacity-40"
              >
                {running ? 'Auditing...' : '🔍 Run Bulk Audit'}
              </button>
            </div>
          </div>

          {results.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Results</h2>
                <div className="flex gap-3 text-xs">
                  <span className="text-emerald-400">✓ {successCount} found</span>
                  <span className="text-rose-400">✗ {failCount} failed</span>
                  <span className="text-violet-400">💾 {savedCount} saved</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800 text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Store</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Confidence</th>
                      <th className="px-4 py-3 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {results.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-800/50">
                        <td className="px-4 py-3">
                          <a href={r.url} target="_blank" rel="noreferrer" className="text-violet-400 hover:text-violet-300 truncate max-w-[200px] block">
                            {r.url.replace(/^https?:\/\//, '')}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {r.email || '—'}
                        </td>
                        <td className="px-4 py-3">
                          {r.confidence ? (
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              r.confidence >= 80 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {r.confidence}%
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {r.success ? (
                            <span className="text-xs text-emerald-400">✓ Found</span>
                          ) : (
                            <span className="text-xs text-rose-400">{r.error || 'Failed'}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {savedCount > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
                  <Link
                    href="/leads"
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm px-5 py-2 rounded-xl transition-all"
                  >
                    → View Saved Leads
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}