"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Connecting your Google account...");

  useEffect(() => {
    async function handleCallback() {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        console.error("Auth callback error:", error);
        router.replace("/login?error=auth_failed");
        return;
      }

      const providerToken = session.provider_token;
      const providerRefreshToken = session.provider_refresh_token;
      const user = session.user;

      if (!providerToken) {
        setStatus("No Gmail token received. Redirecting...");
        router.replace("/login?error=no_gmail_token");
        return;
      }

      const now = Math.floor(Date.now() / 1000);
      const expiresAt = now + 3600;

      const { error: upsertError } = await supabase
        .from("user_gmail_tokens")
        .upsert(
          {
            user_id: user.id,
            email: user.email,
            access_token: providerToken,
            refresh_token: providerRefreshToken || null,
            expires_at: expiresAt,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (upsertError) {
        console.error("Failed to save Gmail token:", upsertError);
        setStatus("Saved session but Gmail token may need reconnect.");
      } else {
        setStatus("Connected successfully! Redirecting...");
      }

      router.replace("/discover");
    }

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0b0f1f] flex items-center justify-center text-slate-300">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm">{status}</p>
      </div>
    </div>
  );
}