"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Upload,
  Download,
  Search,
  Trash2,
  Mail,
  Globe,
  Tag,
  MapPin,
  Star,
  RefreshCw,
  Database,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Info,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import StoreIndexSearch from "@/components/StoreIndexSearch";

interface Lead {
  id: string;
  store_name: string;
  url: string;
  niche: string;
  country: string;
  email: string | null;
  quality_score: number;
  status: string;
  created_at: string;
  notes?: string;
}

const QUALITY_LABELS: Record<number, { label: string; color: string }> = {
  5: { label: "Hot Lead", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  4: { label: "Warm", color: "bg-blue-100 text-blue-800 border-blue-200" },
  3: { label: "Qualified", color: "bg-amber-100 text-amber-800 border-amber-200" },
  2: { label: "Cold", color: "bg-orange-100 text-orange-800 border-orange-200" },
  1: { label: "Unqualified", color: "bg-red-100 text-red-800 border-red-200" },
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const [findingEmail, setFindingEmail] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [sortField, setSortField] = useState<keyof Lead>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order(sortField, { ascending: sortDir === "asc" });
      if (error) throw error;
      setLeads(data || []);
    } catch (err: any) {
      console.error("Fetch leads error:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase, sortField, sortDir]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // ─── CSV IMPORT ───
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 4MB limit check
    const MAX_SIZE = 4 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setImportError("File exceeds 4MB limit. Please split into smaller files or compress.");
      setImportSuccess("");
      return;
    }

    setImporting(true);
    setImportError("");
    setImportSuccess("");

    try {
      const text = await file.text();
      const rows = parseCSV(text);

      if (rows.length === 0) {
        setImportError("No valid data rows found in CSV. Make sure it has a header row.");
        setImporting(false);
        return;
      }

      // Map various column names to our schema
      const mapped = rows.map((row: any) => ({
        store_name: row.store_name || row.storeName || row.name || row.store || row["Store Name"] || row["store name"] || "Unknown Store",
        url: normalizeUrl(row.url || row.website || row.site || row["Website URL"] || row["Store URL"] || ""),
        niche: row.niche || row.category || row.industry || row["Niche"] || row["Category"] || "General",
        country: row.country || row.location || row.region || row["Country"] || row["Location"] || "Unknown",
        email: row.email || row["Email Address"] || row["Contact Email"] || null,
        quality_score: parseInt(row.quality_score || row.quality || row.score || row["Quality Score"] || "3") || 3,
        status: row.status || "new",
      })).filter((r: any) => r.url); // Only keep rows with URLs

      if (mapped.length === 0) {
        setImportError("No valid leads found. CSV must have at least a 'url' or 'website' column.");
        setImporting(false);
        return;
      }

      const { error } = await supabase.from("leads").insert(mapped);
      if (error) throw error;

      setImportSuccess(`Successfully imported ${mapped.length} leads!`);
      fetchLeads();
    } catch (err: any) {
      console.error("Import error:", err);
      setImportError(err.message || "Failed to import CSV. Check the format and try again.");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Robust CSV parser
  const parseCSV = (text: string): any[] => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]).map((h) => h.trim().replace(/^["']|["']$/g, ""));
    const rows: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === 0) continue;
      const row: any = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx]?.trim().replace(/^["']|["']$/g, "") || "";
      });
      rows.push(row);
    }
    return rows;
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const normalizeUrl = (url: string): string => {
    if (!url) return "";
    let u = url.trim();
    if (!u.startsWith("http://") && !u.startsWith("https://")) {
      u = "https://" + u;
    }
    return u;
  };

  // ─── CSV EXPORT ───
  const exportCSV = () => {
    const headers = ["Store Name", "Website URL", "Niche", "Country", "Email", "Quality Score", "Status", "Created At"];
    const rows = filteredLeads.map((l) => [
      l.store_name,
      l.url,
      l.niche,
      l.country,
      l.email || "",
      l.quality_score,
      l.status,
      new Date(l.created_at).toLocaleDateString(),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ecomfind-leads-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  // ─── OSINT EMAIL FINDER ───
  const findEmail = async (leadId: string, url: string) => {
    setFindingEmail(leadId);
    try {
      const res = await fetch("/api/find-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.email) {
        await supabase.from("leads").update({ email: data.email }).eq("id", leadId);
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, email: data.email } : l))
        );
      } else {
        alert("No email found for this domain. Try manual search.");
      }
    } catch (err) {
      alert("Email finder failed. Please try again.");
    } finally {
      setFindingEmail(null);
    }
  };

  // ─── BULK DELETE ───
  const deleteSelected = async () => {
    if (selectedLeads.size === 0) return;
    if (!confirm(`Delete ${selectedLeads.size} selected leads? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const ids = Array.from(selectedLeads);
      const { error } = await supabase.from("leads").delete().in("id", ids);
      if (error) throw error;
      setSelectedLeads(new Set());
      fetchLeads();
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  // ─── SORTING ───
  const toggleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  // ─── FILTERING ───
  const filteredLeads = leads.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      l.store_name?.toLowerCase().includes(q) ||
      l.url?.toLowerCase().includes(q) ||
      l.niche?.toLowerCase().includes(q) ||
      l.country?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q)
    );
  });

  const toggleSelect = (id: string) => {
    const next = new Set(selectedLeads);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedLeads(next);
  };

  const toggleSelectAll = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filteredLeads.map((l) => l.id)));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Lead Management</h1>
          <p className="text-slate-600">
            Import, search, and manage your e-commerce leads. Use StoreIndex to discover new stores or upload your own lists.
          </p>
        </motion.div>

        {/* StoreIndex Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <StoreIndexSearch onImport={fetchLeads} />
        </motion.div>

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-12 gap-4 mb-6"
        >
          {/* Search */}
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search leads by name, URL, niche, country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Import / Export */}
          <div className="md:col-span-5 flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="flex-1"
            >
              {importing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
              {importing ? "Importing..." : "Import CSV"}
            </Button>
            <Button
              variant="outline"
              onClick={exportCSV}
              disabled={filteredLeads.length === 0}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Bulk Delete */}
          <div className="md:col-span-3 flex justify-end">
            {selectedLeads.size > 0 && (
              <Button
                variant="destructive"
                onClick={deleteSelected}
                disabled={deleting}
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                Delete {selectedLeads.size}
              </Button>
            )}
          </div>
        </motion.div>

        {/* 4MB Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4 flex items-center gap-2 text-sm text-slate-500 bg-blue-50 p-3 rounded-lg border border-blue-100"
        >
          <Info className="h-4 w-4 text-blue-500 shrink-0" />
          <span>
            CSV files are limited to <strong>4MB</strong> per upload. For larger lists, split into multiple files or use the StoreIndex database search above.
          </span>
        </motion.div>

        {/* Alerts */}
        <AnimatePresence>
          {importError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Import Failed</div>
                <div className="text-sm">{importError}</div>
              </div>
              <button onClick={() => setImportError("")} className="ml-auto text-red-400 hover:text-red-600">
                <XCircle className="h-5 w-5" />
              </button>
            </motion.div>
          )}
          {importSuccess && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 flex items-start gap-3"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Import Successful</div>
                <div className="text-sm">{importSuccess}</div>
              </div>
              <button onClick={() => setImportSuccess("")} className="ml-auto text-emerald-400 hover:text-emerald-600">
                <XCircle className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leads Table */}
        <Card className="border-0 shadow-md overflow-hidden">
          <CardHeader className="bg-white border-b pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5 text-slate-500" />
                Your Leads
                <Badge variant="secondary" className="ml-2">
                  {filteredLeads.length}
                </Badge>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={fetchLeads} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-slate-400 mb-4" />
                <p className="text-slate-500">Loading leads...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-12 text-center">
                <FileSpreadsheet className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">No leads yet</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-4">
                  Upload a CSV file, use the StoreIndex search above, or manually add leads to get started.
                </p>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-slate-900"
                        onClick={() => toggleSort("store_name")}
                      >
                        <div className="flex items-center gap-1">
                          Store
                          {sortField === "store_name" && (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-slate-900"
                        onClick={() => toggleSort("niche")}
                      >
                        <div className="flex items-center gap-1">
                          Niche
                          {sortField === "niche" && (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-slate-900"
                        onClick={() => toggleSort("country")}
                      >
                        <div className="flex items-center gap-1">
                          Country
                          {sortField === "country" && (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                        </div>
                      </TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-slate-900"
                        onClick={() => toggleSort("quality_score")}
                      >
                        <div className="flex items-center gap-1">
                          Quality
                          {sortField === "quality_score" && (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => {
                      const quality = QUALITY_LABELS[lead.quality_score] || QUALITY_LABELS[3];
                      return (
                        <TableRow key={lead.id} className="group">
                          <TableCell>
                            <Checkbox
                              checked={selectedLeads.has(lead.id)}
                              onCheckedChange={() => toggleSelect(lead.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-slate-900">{lead.store_name}</div>
                            <a
                              href={lead.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <Globe className="h-3 w-3" />
                              {lead.url.replace(/^https?:\/\//, "").substring(0, 35)}
                              {lead.url.replace(/^https?:\/\//, "").length > 35 ? "..." : ""}
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {lead.niche}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <MapPin className="h-3 w-3" />
                              {lead.country}
                            </div>
                          </TableCell>
                          <TableCell>
                            {lead.email ? (
                              <a
                                href={`mailto:${lead.email}`}
                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <Mail className="h-3 w-3" />
                                {lead.email.length > 25 ? lead.email.substring(0, 25) + "..." : lead.email}
                              </a>
                            ) : (
                              <span className="text-xs text-slate-400 italic">Not found</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${quality.color}`}>
                              <Star className="h-3 w-3 mr-1" />
                              {quality.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!lead.email && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => findEmail(lead.id, lead.url)}
                                  disabled={findingEmail === lead.id}
                                  className="h-8 text-xs"
                                >
                                  {findingEmail === lead.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                  ) : (
                                    <Mail className="h-3 w-3 mr-1" />
                                  )}
                                  Find Email
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm("Delete this lead?")) {
                                    supabase.from("leads").delete().eq("id", lead.id).then(() => fetchLeads());
                                  }
                                }}
                                className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}