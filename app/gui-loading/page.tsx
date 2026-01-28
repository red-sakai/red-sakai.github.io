"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GuiLoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.push("/");
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen bg-[#0b0f14] text-white">
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 font-sans">
        <div className="text-sm uppercase tracking-[0.35em] text-white/70">Starting GUI Mode</div>
        <div className="relative h-10 w-10">
          <span className="absolute inset-0 rounded-full border-2 border-white/30" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-white" />
        </div>
        <div className="text-xs text-white/40">Please wait…</div>
      </div>
    </main>
  );
}
