'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Navbar from '../components/Navbar';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [rotating, setRotating] = useState(false);
  const [rotateStatus, setRotateStatus] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkAdmin();
  }, []);

  const getToken = async () => {
    const { data: session } = await supabase.auth.getSession();
    return session?.session?.access_token || '';
  };

  const checkAdmin = async () => {
    const token = await getToken();
    if (!token) { router.push('/'); return; }
    
    const res = await fetch('/api/admin/check', { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) { router.push('/'); return; }
    
    setIsAdmin(true);
    fetchStats();
    fetchUsers();
    setLoading(false);
  };

  const fetchStats = async () => {
    const token = await getToken();
    const res = await fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setStats(data);
  };

  const fetchUsers = async () => {
    const token = await getToken();
    const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setUsers(data.users || []);
  };

  const uploadCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadStatus('');
    
    const token = await getToken();
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    
    if (res.ok) {
      setUploadStatus(`✅ Uploaded & split into ${data.chunks} chunks (${data.totalRows.toLocaleString()} rows)`);
      fetchStats();
    } else {
      setUploadStatus(`❌ ${data.error}`);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const triggerRotation = async () => {
    setRotating(true);
    setRotateStatus('Rotating batch...');
    const token = await getToken();
    
    const res = await fetch('/api/admin/rotate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    
    if (data.success) {
      setRotateStatus(`✅ Rotated to ${data.batch} — ${data.inserted.toLocaleString()} stores loaded`);
      fetchStats();
    } else {
      setRotateStatus(`❌ ${data.error}`);
    }
    setRotating(false);
  };

  const revokeUser = async (userId: string) => {
    if (!confirm('Delete this user and ALL their data permanently?')) return;
    const token = await getToken();
    
    await fetch('/api/admin/revoke', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    fetchUsers();
    fetchStats();
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-slate-400 p-8">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Developer Control Panel</h1>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-xs text-slate-500 uppercase">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-xs text-slate-500 uppercase">Total Leads</p>
              <p className="text-2xl font-bold">{stats.totalLeads?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-xs text-slate-500 uppercase">Pool Size</p>
              <p className="text-2xl font-bold">{stats.poolSize?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-xs text-slate-500 uppercase">Active Batch</p>
              <p className="text-2xl font-bold">{stats.currentBatch || '—'}</p>
            </div>
          </div>

          {/* Upload & Rotation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-2">Upload Store CSV</h2>
              <p className="text-xs text-slate-500 mb-4">Upload one large CSV. Server auto-splits into 20K-row chunks.</p>
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={uploadCSV} />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
              >
                {uploading ? 'Uploading & Splitting...' : 'Select CSV File'}
              </button>
              {uploadStatus && <p className="text-sm mt-3 text-slate-300">{uploadStatus}</p>}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-2">Pool Rotation</h2>
              <p className="text-xs text-slate-500 mb-4">
                Last rotated: {stats.lastRotated ? new Date(stats.lastRotated).toLocaleString() : 'Never'}
                {' • '}{stats.totalBatches || 0} total chunks in storage
              </p>
              <button
                onClick={triggerRotation}
                disabled={rotating}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
              >
                {rotating ? 'Rotating...' : '🔄 Rotate to Next Batch'}
              </button>
              {rotateStatus && <p className="text-sm mt-3 text-slate-300">{rotateStatus}</p>}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800">
              <h2 className="text-lg font-semibold">Active Users ({users.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800 text-slate-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">User</th>
                    <th className="px-5 py-3 font-medium">Company</th>
                    <th className="px-5 py-3 font-medium">Joined</th>
                    <th className="px-5 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {u.avatar_url ? (
                            <img src={u.avatar_url} className="w-8 h-8 rounded-full object-cover" alt="" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">{u.full_name?.[0] || '?'}</div>
                          )}
                          <div>
                            <p className="font-medium text-slate-200">{u.full_name || '—'}</p>
                            <p className="text-xs text-slate-500">{u.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-400">{u.company_name || '—'}</td>
                      <td className="px-5 py-3 text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => revokeUser(u.id)}
                          className="text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-lg transition-all"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}