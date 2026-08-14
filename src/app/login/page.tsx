import { Suspense } from "react";
import LoginPageClient from "./LoginPageClient";

function Fallback() {
  return (
    <div className="min-h-screen bg-[#0b0f1f] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <LoginPageClient />
    </Suspense>
  );
}