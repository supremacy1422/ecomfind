import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ─── Types ─── */
export interface SavedAudit {
  id?: string;
  user_id: string;
  url: string;
  domain: string;
  score: number;
  report_json: any;
  created_at?: string;
}

export interface SavedLead {
  id?: string;
  user_id: string;
  domain: string;
  shopify_domain: string;
  email?: string;
  country?: string;
  industry?: string;
  products?: number;
  score?: number;
  created_at?: string;
}

export interface OutreachLog {
  id?: string;
  user_id: string;
  lead_domain: string;
  template_type: string;
  subject: string;
  body: string;
  status: "draft" | "sent" | "opened" | "replied";
  sent_at?: string;
  created_at?: string;
}