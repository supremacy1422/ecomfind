"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Loader2,
  Search,
  Database,
  Globe,
  Tag,
  MapPin,
  Star,
  Download,
  CheckCircle2,
  AlertCircle,
  Layers,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StoreIndexResult {
  id: string;
  name: string;
  domain: string;
  url: string;
  country: string;
  industry: string;
  product_range?: string;
  revenue?: number;
  employees?: number;
  tech_stack?: string[];
  email?: string;
  score?: number;
}

const COUNTRIES = [
  { value: "all", label: "All Countries" },
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "NL", label: "Netherlands" },
  { value: "SE", label: "Sweden" },
  { value: "NO", label: "Norway" },
  { value: "DK", label: "Denmark" },
  { value: "FI", label: "Finland" },
  { value: "ES", label: "Spain" },
  { value: "IT", label: "Italy" },
  { value: "JP", label: "Japan" },
  { value: "SG", label: "Singapore" },
  { value: "BR", label: "Brazil" },
  { value: "MX", label: "Mexico" },
];

const INDUSTRIES = [
  { value: "all", label: "All Industries" },
  { value: "fashion", label: "Fashion & Apparel" },
  { value: "beauty", label: "Beauty & Cosmetics" },
  { value: "health", label: "Health & Wellness" },
  { value: "food", label: "Food & Beverage" },
  { value: "home", label: "Home & Garden" },
  { value: "electronics", label: "Electronics" },
  { value: "sports", label: "Sports & Outdoors" },
  { value: "pets", label: "Pet Supplies" },
  { value: "toys", label: "Toys & Games" },
  { value: "jewelry", label: "Jewelry & Accessories" },
  { value: "baby", label: "Baby & Kids" },
  { value: "automotive", label: "Automotive" },
  { value: "arts", label: "Arts & Crafts" },
];

export default function StoreIndexSearch({ onImport }: { onImport: () => void }) {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("all");
  const [industry, setIndustry] = useState("all");
  const [productRange, setProductRange] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<StoreIndexResult[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const search = async () => {
    setSearching(true);
    setError("");
    setSuccess("");
    setResults([]);
    setSelected(new Set());

    try {
      const res = await fetch("/api/leads/storeindex-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: country === "all" ? undefined : country,
          industry: industry === "all" ? undefined : industry,
          productRange: productRange || undefined,
          limit: 20,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Search failed with status ${res.status}`);
      }

      // Handle different response structures
      const stores = data.stores || data.results || data.data || data;
      if (!Array.isArray(stores)) {
        throw new Error("Unexpected response format from StoreIndex API");
      }

      setResults(stores);
      if (stores.length === 0) {
        setError("No stores found matching your criteria. Try broadening your search.");
      }
    } catch (err: any) {
      console.error("StoreIndex search error:", err);
      setError(err.message || "Failed to search StoreIndex. Check your API key and try again.");
    } finally {
      setSearching(false);
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const importSelected = async () => {
    if (selected.size === 0) return;
    setImporting(true);
    setError("");
    setSuccess("");

    try {
      const storesToImport = results.filter((r) => selected.has(r.id));
      const res = await fetch("/api/leads/storeindex-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stores: storesToImport }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");

      setSuccess(`Successfully imported ${data.imported} stores into your leads!`);
      setSelected(new Set());
      onImport();
    } catch (err: any) {
      setError(err.message || "Import failed. Please try again.");
    } finally {
      setImporting(false);
    }
  };

  const formatRevenue = (val?: number) => {
    if (!val) return "N/A";
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  return (
    <>
      {/* Trigger Card */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Database className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Search StoreIndex Database</h3>
                <p className="text-slate-400 text-sm">
                  Discover real Shopify stores by country, industry, and tech stack.
                </p>
              </div>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-500 text-white">
                  <Search className="h-4 w-4 mr-2" />
                  Search StoreIndex
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <Database className="h-5 w-5 text-blue-600" />
                    StoreIndex Database Search
                  </DialogTitle>
                </DialogHeader>

                {/* Filters */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 block">
                      Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 block">
                      Industry
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {INDUSTRIES.map((i) => (
                        <option key={i.value} value={i.value}>{i.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 block">
                      Product Range (optional)
                    </label>
                    <Input
                      placeholder="e.g. skincare, supplements"
                      value={productRange}
                      onChange={(e) => setProductRange(e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>

                <Button
                  onClick={search}
                  disabled={searching}
                  className="w-full mb-4 bg-slate-900 hover:bg-slate-800"
                >
                  {searching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                  {searching ? "Searching StoreIndex..." : "Search Database"}
                </Button>

                {/* Alerts */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start gap-2 text-sm"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      {error}
                      <button onClick={() => setError("")} className="ml-auto">
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 flex items-start gap-2 text-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                      {success}
                      <button onClick={() => setSuccess("")} className="ml-auto">
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Results */}
                {results.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        Found <strong>{results.length}</strong> stores
                        {selected.size > 0 && (
                          <span className="ml-2 text-blue-600">({selected.size} selected)</span>
                        )}
                      </div>
                      {selected.size > 0 && (
                        <Button
                          onClick={importSelected}
                          disabled={importing}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-500"
                        >
                          {importing ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          {importing ? "Importing..." : `Import ${selected.size} Selected`}
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                      {results.map((store) => (
                        <motion.div
                          key={store.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                            selected.has(store.id)
                              ? "border-blue-500 bg-blue-50"
                              : "border-slate-100 bg-white hover:border-slate-200"
                          }`}
                          onClick={() => toggleSelect(store.id)}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={selected.has(store.id)}
                              onCheckedChange={() => toggleSelect(store.id)}
                              className="mt-1"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-slate-900 truncate">{store.name}</h4>
                                {store.score && (
                                  <Badge className="bg-amber-100 text-amber-800">
                                    <Star className="h-3 w-3 mr-1" />
                                    {store.score}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-2">
                                <span className="flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  {store.domain || store.url?.replace(/^https?:\/\//, "")}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {store.country}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  {store.industry}
                                </span>
                                {store.revenue && (
                                  <span className="flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    {formatRevenue(store.revenue)}
                                  </span>
                                )}
                                {store.employees && (
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {store.employees} employees
                                  </span>
                                )}
                              </div>
                              {store.tech_stack && store.tech_stack.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  <Layers className="h-3 w-3 text-slate-400 mt-0.5" />
                                  {store.tech_stack.slice(0, 6).map((tech, i) => (
                                    <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                                      {tech}
                                    </Badge>
                                  ))}
                                  {store.tech_stack.length > 6 && (
                                    <span className="text-[10px] text-slate-400">+{store.tech_stack.length - 6}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
}