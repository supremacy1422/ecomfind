'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from '../components/Navbar';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const getToken = async () => {
    const { data: session } = await supabase.auth.getSession();
    return session?.session?.access_token || '';
  };

  const fetchProfile = async () => {
    const token = await getToken();
    if (!token) return;
    const res = await fetch('/api/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const d = await res.json();
    setProfile(d.profile || {});
    setLoading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    const token = await getToken();
    await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: profile.full_name,
        company_name: profile.company_name,
        job_title: profile.job_title,
        email_signature: profile.email_signature,
      }),
    });
    setSaving(false);
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Max 2MB.');
      return;
    }
    setUploading(true);
    setUploadError('');
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload/avatar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setProfile({ ...profile, avatar_url: data.avatar_url });
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-slate-400 p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Profile & Signature</h1>

          {/* Avatar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl text-slate-500">{profile.full_name?.charAt(0) || '?'}</span>
                )}
              </div>
              <div>
                <input ref={fileRef} type="file" accept="image/*" onChange={uploadAvatar} className="hidden" />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2 rounded-xl text-sm transition-all disabled:opacity-40"
                >
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </button>
                {uploadError && <p className="text-xs text-rose-400 mt-1">{uploadError}</p>}
                <p className="text-xs text-slate-500 mt-1">JPG, PNG. Max 2MB.</p>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 space-y-4">
            <h2 className="text-lg font-semibold mb-2">Account Info</h2>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Full Name</label>
              <input
                value={profile.full_name || ''}
                onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Company Name</label>
              <input
                value={profile.company_name || ''}
                onChange={e => setProfile({ ...profile, company_name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Job Title</label>
              <input
                value={profile.job_title || ''}
                onChange={e => setProfile({ ...profile, job_title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition-all"
              />
            </div>
          </div>

          {/* Email Signature */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">Email Signature</h2>
            <p className="text-xs text-slate-500 mb-3">Appended to every outreach email. Use line breaks.</p>
            <textarea
              value={profile.email_signature || ''}
              onChange={e => setProfile({ ...profile, email_signature: e.target.value })}
              rows={5}
              placeholder={`Best,\nJohn Doe\nFounder | Acme Agency\nwww.acme.com`}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition-all resize-none font-mono"
            />
            <div className="mt-3 p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <p className="text-xs text-slate-500 mb-2">Preview:</p>
              <div className="text-sm text-slate-300 whitespace-pre-wrap">{profile.email_signature || 'No signature set'}</div>
            </div>
          </div>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl py-3 transition-all shadow-lg shadow-violet-900/25 disabled:opacity-40"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </main>
    </div>
  );
}