"use client";

import React, { useState } from "react";

interface StoreIndexStore {
  shopifyId: string;
  domain: string;
  title?: string;
  email?: string;
  phone?: string;
  country?: string;
  industry?: string;
  companySize?: string;
  activeProductsRange?: string;
  revenueRange?: string;
  installedAppsName?: string[];
  socialLinks?: Record<string, string>;
}

const IconSearch = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const IconGlobe = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const IconStore = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const IconPackage = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
);
const IconDollar = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);
const IconMail = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconPlus = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const IconCheck = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconX = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const IconLoader = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.22-8.56"/></svg>
);

const COUNTRIES = ["US", "UK", "CA", "AU", "DE", "FR", "NL", "SE", "NO", "DK", "FI", "ES", "IT", "JP", "SG", "AE"];
const INDUSTRIES = ["Fashion", "Beauty", "Health", "Food", "Home", "Electronics", "Sports", "Toys", "Jewelry", "Pets"];
const PRODUCT_RANGES = ["0-10", "10-50", "50-100", "100-500", "500-1000", "1000+"];

export default function StoreIndexSearch({ onImport }: { onImport?: () => void }) {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");
  const [productRange, setProductRange] = useState("");
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<StoreIndexStore[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);

  async function search() {
    setLoading(true);
    setImported(false);
    try {
      const body: any = {};
      if (country) body.country = country;
      if (industry) body.industry = industry;
      if (productRange) {
        const [min, max] = productRange.split("-").map((s) => (s.endsWith("+") ? parseInt(s) : parseInt(s)));
        if (!isNaN(min)) body.minProducts = min;
        if (productRange.includes("-") && !productRange.endsWith("+")) {
          const maxVal = parseInt(productRange.split("-")[1]);
          if (!isNaN(maxVal)) body.maxProducts = maxVal;
        }
      }

      const res = await fetch("/api/leads/storeindex-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      setStores(json.stores || []);
      setSelected(new Set());
    } catch {
      setStores([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(domain: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) next.delete(domain);
      else next.add(domain);
      return next;
    });
  }

  async function importSelected() {
    const toImport = stores.filter((s) => selected.has(s.domain));
    if (toImport.length === 0) return;
    setImporting(true);
    try {
      const res = await fetch("/api/leads/storeindex-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stores: toImport }),
      });
      if (res.ok) {
        setImported(true);
        setSelected(new Set());
        onImport?.();
      }
    } catch {
      // ignore
    } finally {
      setImporting(false);
    }
  }

  return (
    <>
      {/* Trigger Card */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <IconGlobe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Search StoreIndex Database</h3>
              <p className="text-xs text-slate-400">Find verified Shopify stores by country, industry, and size.</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <IconSearch className="w-4 h-4" /> Search StoreIndex
          </button>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <IconGlobe className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white">StoreIndex Search</h3>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <IconX className="w-5 h-5" />
              </button>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                >
                  <option value="">All Countries</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                >
                  <option value="">All Industries</option>
                  {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Products</label>
                <select
                  value={productRange}
                  onChange={(e) => setProductRange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                >
                  <option value="">Any Size</option>
                  {PRODUCT_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={search}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-semibold rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <span className="animate-spin"><IconLoader className="w-4 h-4" /></span> : <IconSearch className="w-4 h-4" />}
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {stores.length === 0 && !loading && (
                <div className="text-center py-12 text-slate-500">
                  <IconStore className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No results yet. Use the filters above and click Search.</p>
                </div>
              )}

              <div className="space-y-3">
                {stores.map((store) => {
                  const isSelected = selected.has(store.domain);
                  return (
                    <div
                      key={store.shopifyId}
                      onClick={() => toggleSelect(store.domain)}
                      className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-emerald-500/5 border-emerald-500/40"
                          : "bg-slate-950/50 border-slate-800 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          isSelected ? "bg-emerald-500 border-emerald-500" : "border-slate-600"
                        }`}>
                          {isSelected && <IconCheck className="w-3.5 h-3.5 text-slate-950" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-white text-sm truncate">{store.title || store.domain}</h4>
                            {store.country && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">{store.country}</span>
                            )}
                            {store.industry && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">{store.industry}</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mb-2">{store.domain}</p>
                          <div className="flex flex-wrap gap-2">
                            {store.companySize && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                                <IconStore className="w-3 h-3" /> {store.companySize}
                              </span>
                            )}
                            {store.activeProductsRange && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                                <IconPackage className="w-3 h-3" /> {store.activeProductsRange} products
                              </span>
                            )}
                            {store.revenueRange && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                                <IconDollar className="w-3 h-3" /> {store.revenueRange}
                              </span>
                            )}
                            {store.email && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                <IconMail className="w-3 h-3" /> Has email
                              </span>
                            )}
                          </div>
                          {store.installedAppsName && store.installedAppsName.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {store.installedAppsName.slice(0, 6).map((app) => (
                                <span key={app} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">{app}</span>
                              ))}
                              {store.installedAppsName.length > 6 && (
                                <span className="text-[10px] px-1.5 py-0.5 text-slate-600">+{store.installedAppsName.length - 6} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            {stores.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  {selected.size} of {stores.length} selected
                </p>
                <div className="flex items-center gap-3">
                  {imported && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <IconCheck className="w-3.5 h-3.5" /> Imported successfully
                    </span>
                  )}
                  <button
                    onClick={importSelected}
                    disabled={importing || selected.size === 0}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-semibold rounded-lg text-sm transition-all flex items-center gap-2"
                  >
                    {importing ? <span className="animate-spin"><IconLoader className="w-4 h-4" /></span> : <IconPlus className="w-4 h-4" />}
                    {importing ? "Importing..." : `Import ${selected.size} to Leads`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}