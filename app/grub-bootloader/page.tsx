"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function GrubBootloaderPage() {
  const [selection, setSelection] = useState<"GUI" | "Shell">("GUI");
  const [countdown, setCountdown] = useState(5);
  const [hasInteracted, setHasInteracted] = useState(false);
  const router = useRouter();

  const selectedHref = useMemo(() => {
    return selection === "GUI" ? "/gui-loading" : "/shell";
  }, [selection]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        setHasInteracted(true);
        setSelection((current) => (current === "GUI" ? "Shell" : "GUI"));
      }

      if (event.key === "Enter") {
        event.preventDefault();
        router.push(selectedHref);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router, selectedHref]);

  useEffect(() => {
    if (hasInteracted) return;
    if (countdown <= 0) {
      router.push(selectedHref);
      return;
    }
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown, hasInteracted, router, selectedHref]);

  return (
    <main className="min-h-screen bg-black text-[#d1d5db]">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-12 font-mono">
        <div className="mb-6 flex items-center justify-between text-[11px] uppercase tracking-[0.4em] text-white/60">
          <span>GNU GRUB</span>
          <span>2.12</span>
        </div>

        <div className="mb-3 text-sm text-white/70">Select an entry to boot:</div>

        <div className="border border-white/20 bg-black/60 p-2">
          <button
            type="button"
            onClick={() => {
              setHasInteracted(true);
              setSelection("GUI");
            }}
            className={
              "flex w-full items-center px-2 py-1 text-sm " +
              (selection === "GUI" ? "bg-white text-black" : "text-white/70")
            }
          >
            * GUI Mode
          </button>
          <button
            type="button"
            onClick={() => {
              setHasInteracted(true);
              setSelection("Shell");
            }}
            className={
              "flex w-full items-center px-2 py-1 text-sm " +
              (selection === "Shell" ? "bg-white text-black" : "text-white/70")
            }
          >
            * Shell Mode
          </button>
        </div>

        <div className="mt-4 text-xs text-white/50">
          {hasInteracted
            ? "Press Enter to boot selected entry."
            : `The highlighted entry will be booted automatically in ${countdown} seconds.`}
        </div>

        <div className="mt-8 text-xs text-white/45">
          Use the ↑ and ↓ keys to select which entry is highlighted.
        </div>
        <div className="text-xs text-white/45">
          Press Enter to boot the selected OS, &#39;e&#39; to edit, or &#39;c&#39; for a command line.
        </div>
      </div>
    </main>
  );
}
