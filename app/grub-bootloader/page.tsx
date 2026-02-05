"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function GrubBootloaderPage() {
  const [selection, setSelection] = useState<"GUI" | "Shell">("GUI");
  const [countdown, setCountdown] = useState(5);
  const [hasInteracted, setHasInteracted] = useState(false);
  const router = useRouter();

  const handleSelect = (mode: "GUI" | "Shell") => {
    setHasInteracted(true);
    if (mode === selection) {
      router.push(mode === "GUI" ? "/gui-loading" : "/shell");
      return;
    }
    setSelection(mode);
  };

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
            onClick={() => handleSelect("GUI")}
            className={
              "flex w-full items-center px-2 py-1 text-sm " +
              (selection === "GUI" ? "bg-white text-black" : "text-white/70")
            }
          >
            * GUI Mode
          </button>
          <button
            type="button"
            onClick={() => handleSelect("Shell")}
            className={
              "flex w-full items-center px-2 py-1 text-sm " +
              (selection === "Shell" ? "bg-white text-black" : "text-white/70")
            }
          >
            * Shell Mode
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setHasInteracted(true);
            router.push(selectedHref);
          }}
          className="mt-3 w-full border border-white/20 bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:bg-white/20"
        >
          Boot selected entry
        </button>

        <div className="mt-4 text-xs text-white/50">
          {hasInteracted
            ? "Tap the selected entry or press Enter to boot."
            : `The highlighted entry will be booted automatically in ${countdown} seconds.`}
        </div>

        <div className="mt-8 text-xs text-white/45">
          Use the ↑ and ↓ keys to select which entry is highlighted.
        </div>
        <div className="text-xs text-white/45">
          Tap the highlighted entry to boot, press Enter to boot, &#39;e&#39; to edit, or &#39;c&#39; for a
          command line.
        </div>
      </div>
    </main>
  );
}
