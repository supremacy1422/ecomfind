'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
      checkGmail();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;
    fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setAvatar(d.profile?.avatar_url || null))
      .catch(() => {});
  };

  const checkGmail = async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;
    const res = await fetch('/api/gmail/status', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const d = await res.json();
    setGmailConnected(d.connected);
    setGmailEmail(d.email);
  };

  const connectGmail = async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;
    const res = await fetch('/api/gmail/connect', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const d = await res.json();
    if (d.url) window.location.href = d.url;
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/30">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">EcomFind</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-1">
                <Link href="/discover" className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all">Discover</Link>
                <Link href="/leads" className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all">Leads</Link>
                <Link href="/crm" className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all">Pipeline</Link>
                <Link href="/bulk" className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all">Bulk</Link>
                <Link href="/bulk-audit" className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all">Bulk Audit</Link>
                <Link href="/templates" className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all">Templates</Link>
                {user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                  <Link href="/admin" className="px-3 py-1.5 rounded-lg text-sm text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-all">Admin</Link>
                )}
              </div>
              <div className="h-4 w-px bg-slate-800 hidden md:block" />
              <div className="flex items-center gap-3">
                {!gmailConnected && (
                  <button
                    onClick={connectGmail}
                    className="hidden sm:block text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-all"
                  >
                    Connect Gmail
                  </button>
                )}
                {gmailConnected && (
                  <span className="hidden sm:block text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                    ✓ {gmailEmail}
                  </span>
                )}
                <Link href="/settings" className="flex items-center gap-2 group">
                  {avatar ? (
                    <img src={avatar} alt="" className="w-7 h-7 rounded-full border border-slate-700 object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-400">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs text-slate-500 hidden sm:block truncate max-w-[120px] group-hover:text-slate-300 transition-colors">{user.email}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-xs font-medium text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg px-3 py-1.5 transition-all"
                >
                  Sign Out
                </button>
              </div>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-slate-400 hover:text-white p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign In</Link>
              <Link href="/register" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl px-4 py-2 text-sm transition-all shadow-lg shadow-violet-900/25">Get Started</Link>
            </div>
          )}
        </div>
      </div>

      {mobileOpen && user && (
        <div className="md:hidden bg-slate-950/95 border-t border-slate-800 px-4 py-4 space-y-2">
          <Link href="/discover" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">Discover</Link>
          <Link href="/leads" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">Leads</Link>
          <Link href="/crm" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">Pipeline</Link>
          <Link href="/bulk" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">Bulk</Link>
          <Link href="/bulk-audit" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">Bulk Audit</Link>
          <Link href="/templates" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">Templates</Link>
          <Link href="/settings" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">Profile & Signature</Link>
          {!gmailConnected && (
            <button onClick={() => { connectGmail(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-blue-300 hover:bg-slate-800">Connect Gmail</button>
          )}
          {user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
            <Link href="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-amber-400 hover:bg-amber-500/10">Admin</Link>
          )}
        </div>
      )}
    </nav>
  );
}