"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

interface Recipient {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  sent_at: string;
  opened_at: string;
  open_count: number;
}

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: string;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  opened_count: number;
  campaign_recipients: Recipient[];
}

export default function CampaignDetailPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [filter, setFilter] = useState("all");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => { fetchCampaign(); }, [id]);

  const fetchCampaign = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`/api/campaigns/${id}`, {
      headers: { "x-supabase-token": session?.access_token || "" },
    });
    const data = await res.json();
    setCampaign(data.campaign);
  };

  if (!campaign) return <div className="min-h-screen bg-[#0b0f1f] flex items-center justify-center text-slate-500">Loading...</div>;

  const filtered = campaign.campaign_recipients?.filter((r) => {
    if (filter === "sent") return r.status === "sent";
    if (filter === "opened") return r.open_count > 0;
    if (filter === "failed") return r.status === "failed";
    return true;
  }) || [];

  const openRate = campaign.sent_count ? Math.round((campaign.opened_count / campaign.sent_count) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0b0f1f] text-slate-200">
      <header className="border-b border-slate-800/60 bg-[#0b0f1e]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <img src="/ecomfind_logo.png" alt="EcomFind" className="h-8 w-auto" />
          </a>
          <a href="/bulk-campaigns" className="text-sm text-slate-400 hover:text-white transition-colors">← Back to Campaigns</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">{campaign.name}</h1>
          <p className="text-sm text-slate-400 mb-4">{campaign.subject}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-4 text-center">
              <p className="text-2xl font-bold text-white">{campaign.total_recipients.toLocaleString()}</p>
              <p className="text-xs text-slate-500 uppercase">Total</p>
            </div>
            <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">{campaign.sent_count.toLocaleString()}</p>
              <p className="text-xs text-slate-500 uppercase">Sent</p>
            </div>
            <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-4 text-center">
              <p className="text-2xl font-bold text-violet-400">{campaign.opened_count.toLocaleString()}</p>
              <p className="text-xs text-slate-500 uppercase">Opened</p>
            </div>
            <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">{openRate}%</p>
              <p className="text-xs text-slate-500 uppercase">Open Rate</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {["all", "sent", "opened", "failed"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-slate-700 text-white" : "text-slate-500 hover:text-white"}`}>
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="rounded-xl bg-slate-900/40 border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/50 text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Sent</th>
                <th className="px-4 py-3">Opens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.slice(0, 100).map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-3 text-slate-300">{r.email}</td>
                  <td className="px-4 py-3 text-slate-400">{r.first_name} {r.last_name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      r.status === "sent" ? "bg-emerald-500/10 text-emerald-400" :
                      r.status === "failed" ? "bg-rose-500/10 text-rose-400" :
                      "bg-slate-800 text-slate-500"
                    }`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{r.sent_at ? new Date(r.sent_at).toLocaleDateString() : "-"}</td>
                  <td className="px-4 py-3">
                    {r.open_count > 0 ? <span className="text-violet-400">{r.open_count} opens</span> : <span className="text-slate-600">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 100 && (
            <div className="px-4 py-3 text-xs text-slate-600 text-center border-t border-slate-800">
              Showing first 100 of {filtered.length} recipients
            </div>
          )}
        </div>
      </main>
    </div>
  );
}