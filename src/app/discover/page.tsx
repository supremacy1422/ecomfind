import { Suspense } from "react";
import DiscoverPageClient from "./DiscoverPageClient";

function Fallback() {
  return (
    <div className="min-h-screen bg-[#0b0f1f] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <DiscoverPageClient />
    </Suspense>
  );
}