"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const IconMail = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconTrash = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
);
const IconPlus = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

interface Connection {
  id: string;
  email: string;
  daily_limit: number;
  is_active: boolean;
  sent_today: number;
  reset_date: string;
}

export default function GmailConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchConnections = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/gmail-connections", {
      headers: { "x-supabase-token": session?.access_token || "" },
    });
    const data = await res.json();
    setConnections(data.connections || []);
    setLoading(false);
  };

  useEffect(() => { fetchConnections(); }, []);

  const updateLimit = async (id: string, limit: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    await fetch("/api/gmail-connections", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-supabase-token": session?.access_token || "",
      },
      body: JSON.stringify({ id, daily_limit: limit }),
    });
    fetchConnections();
  };

  const toggleActive = async (id: string, active: boolean) => {
    const { data: { session } } = await supabase.auth.getSession();
    await fetch("/api/gmail-connections", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-supabase-token": session?.access_token || "",
      },
      body: JSON.stringify({ id, is_active: !active }),
    });
    fetchConnections();
  };

  const removeConnection = async (id: string) => {
    if (!confirm("Remove this Gmail account?")) return;
    const { data: { session } } = await supabase.auth.getSession();
    await fetch(`/api/gmail-connections?id=${id}`, {
      method: "DELETE",
      headers: { "x-supabase-token": session?.access_token || "" },
    });
    fetchConnections();
  };

  const connectGmail = () => {
    // Redirect to your existing Gmail OAuth flow
    window.location.href = "/api/auth/gmail"; // Adjust to your actual OAuth URL
  };

  return (
    <div className="min-h-screen bg-[#0b0f1f] text-slate-200">
      <header className="border-b border-slate-800/60 bg-[#0b0f1e]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <img src="/ecomfind_logo.png" alt="EcomFind" className="h-8 w-auto" />
          </a>
          <nav className="hidden md:flex items-center gap-1">
            <a href="/discover" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Audit</a>
            <a href="/leads" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Leads</a>
            <a href="/bulk-campaigns" className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">Campaigns</a>
            <a href="/gmail-connections" className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-sm transition-colors">Gmail</a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Gmail Connections</h1>
            <p className="text-sm text-slate-400">Connect multiple Gmail accounts and set daily send limits.</p>
          </div>
          <button onClick={connectGmail} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2">
            <IconPlus className="w-4 h-4" /> Connect Gmail
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading...</div>
        ) : connections.length === 0 ? (
          <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-12 text-center">
            <IconMail className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">No Gmail accounts connected</p>
            <p className="text-sm text-slate-500 mb-6">Connect your first Gmail to start sending campaigns.</p>
            <button onClick={connectGmail} className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg transition-colors">
              Connect Gmail
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {connections.map((conn) => (
              <div key={conn.id} className="rounded-xl bg-slate-900/40 border border-slate-800 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <IconMail className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{conn.email}</p>
                      <p className="text-xs text-slate-500">
                        {conn.sent_today} / {conn.daily_limit} sent today · Resets {conn.reset_date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Daily Limit:</span>
                      <input
                        type="number"
                        value={conn.daily_limit}
                        onChange={(e) => updateLimit(conn.id, parseInt(e.target.value))}
                        min={1}
                        max={500}
                        className="w-20 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-sm text-white text-center focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                      />
                    </div>

                    <button
                      onClick={() => toggleActive(conn.id, conn.is_active)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        conn.is_active
                          ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          : "bg-slate-800 text-slate-500 hover:bg-slate-700"
                      }`}
                    >
                      {conn.is_active ? "Active" : "Paused"}
                    </button>

                    <button
                      onClick={() => removeConnection(conn.id)}
                      className="p-2 text-slate-600 hover:text-rose-400 transition-colors"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        conn.sent_today >= conn.daily_limit ? "bg-rose-500" : "bg-violet-500"
                      }`}
                      style={{ width: `${Math.min((conn.sent_today / conn.daily_limit) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}