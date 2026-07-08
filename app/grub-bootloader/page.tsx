"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const MODES = [
  { id: "normal" as const, label: "Normal Mode (Portfolio)", href: "/gui-loading" },
  { id: "desktop" as const, label: "Retro Desktop Mode", href: "/desktop-loading" },
];

export default function GrubBootloaderPage() {
  const [selection, setSelection] = useState<"normal" | "desktop">("normal");
  const [countdown, setCountdown] = useState(5);
  const [hasInteracted, setHasInteracted] = useState(false);
  const router = useRouter();

  const handleSelect = (mode: "normal" | "desktop") => {
    setHasInteracted(true);
    if (mode === selection) {
      router.push(mode === "normal" ? "/gui-loading" : "/desktop-loading");
      return;
    }
    setSelection(mode);
  };

  const selectedHref = useMemo(
    () => (selection === "normal" ? "/gui-loading" : "/desktop-loading"),
    [selection],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        setHasInteracted(true);
        setSelection((current) => (current === "normal" ? "desktop" : "normal"));
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
    const timer = window.setTimeout(() => setCountdown((v) => v - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown, hasInteracted, router, selectedHref]);

  return (
    <main
      className="crt-curve"
      style={{
        minHeight: "100dvh",
        background: "#0a0a0a",
        color: "#00ff41",
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        position: "relative",
      }}
    >
      <div
        style={{
          position: "fixed", inset: 0,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 65, 0.03) 2px, rgba(0, 255, 65, 0.03) 4px)",
          pointerEvents: "none", zIndex: 1,
        }}
      />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 700, margin: "0 auto", padding: "40px 24px", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 40, opacity: 0.7, display: "flex", justifyContent: "space-between", fontSize: 12 }}>
          <span>GNU GRUB version 2.12</span>
          <span>{new Date().getFullYear()}</span>
        </div>

        <div style={{ marginBottom: 16, fontSize: 13, opacity: 0.8 }}>
          Select an entry to boot:
        </div>

        <div style={{ border: "1px solid rgba(0,255,65,0.3)", background: "rgba(0,255,65,0.03)", padding: 4, marginBottom: 16 }}>
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleSelect(mode.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%",
                padding: "6px 10px", fontSize: 13, cursor: "pointer",
                background: selection === mode.id ? "#00ff41" : "transparent",
                color: selection === mode.id ? "#000" : "#00ff41",
                border: "none", textAlign: "left",
                fontFamily: "inherit",
              }}
            >
              <span style={{ visibility: selection === mode.id ? "visible" : "hidden" }}>{">"}</span>
              <span>{mode.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => { setHasInteracted(true); router.push(selectedHref); }}
          style={{
            background: "transparent", border: "1px solid rgba(0,255,65,0.4)",
            color: "#00ff41", padding: "8px 16px", fontSize: 12, cursor: "pointer",
            fontFamily: "inherit", textTransform: "uppercase", letterSpacing: "0.3em",
            marginBottom: 16, transition: "background 0.2s",
          }}
          onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = "rgba(0,255,65,0.1)"; }}
          onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = "transparent"; }}
        >
          Boot selected entry
        </button>

        <div style={{ fontSize: 12, opacity: 0.5, lineHeight: 1.8 }}>
          {hasInteracted ? (
            "Tap the selected entry or press Enter to boot."
          ) : (
            <>
              The highlighted entry will be booted automatically in{" "}
              <span style={{ fontWeight: 700, opacity: 0.8 }}>{countdown}</span> seconds.
            </>
          )}
        </div>

        <div style={{ marginTop: "auto", paddingTop: 40, fontSize: 11, opacity: 0.4, lineHeight: 1.6 }}>
          <div>Use the ↑ and ↓ keys to select which entry is highlighted.</div>
          <div>Press Enter to boot, &apos;e&apos; to edit, or &apos;c&apos; for a command line.</div>
          <div style={{ marginTop: 8, animation: "grub-blink 1s step-end infinite" }}>_</div>
        </div>
      </div>
    </main>
  );
}
