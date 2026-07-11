"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { JH_LOGO } from "@/data/jhered-os-logo";
import "@/components/desktop/desktop.css";

export default function DesktopLoadingPage() {
  const router = useRouter();
  const [visibleLines, setVisibleLines] = useState(0);
  const [memCount, setMemCount] = useState(0);
  const [fadedIn, setFadedIn] = useState(false);
  const navigated = useRef(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setFadedIn(true), 50),
      setTimeout(() => setVisibleLines(1), 300),
      setTimeout(() => setVisibleLines(2), 600),
      setTimeout(() => setVisibleLines(3), 900),
      setTimeout(() => setVisibleLines(4), 1600),
      setTimeout(() => setVisibleLines(5), 1800),
      setTimeout(() => setVisibleLines(6), 2100),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (visibleLines < 3 || visibleLines >= 4) return;
    const t = setInterval(() => {
      setMemCount((p) => {
        const n = p + Math.floor(Math.random() * 12288) + 4096;
        if (n >= 65536) { clearInterval(t); return 65536; }
        return n;
      });
    }, 70);
    return () => clearInterval(t);
  }, [visibleLines]);

  const showFinal = visibleLines >= 6;

  useEffect(() => {
    if (showFinal && !navigated.current) {
      navigated.current = true;
      const t = setTimeout(() => router.push("/desktop"), 600);
      return () => clearTimeout(t);
    }
  }, [showFinal, router]);

  return (
    <main
      className="crt-curve"
      style={{
        minHeight: "100dvh", background: "#000", color: "#00ff41",
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        fontSize: 14, display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        opacity: fadedIn ? 1 : 0, transition: "opacity 0.3s",
      }}
    >
      <div
        style={{
          position: "fixed", inset: 0,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.03) 2px, rgba(0,255,65,0.03) 4px)",
          pointerEvents: "none", zIndex: 1,
        }}
      />
      <div style={{ position: "relative", zIndex: 2, width: 520, maxWidth: "90vw" }}>
        <pre style={{ fontSize: 10, lineHeight: 1.25, marginBottom: 20, color: "#00cc33", textAlign: "center" }}>
          {JH_LOGO}
        </pre>

        <div style={{ border: "1px solid rgba(0,255,65,0.15)", padding: "16px 20px", background: "rgba(0,255,65,0.02)" }}>
          {visibleLines >= 1 && (
            <div style={{ marginBottom: 8, opacity: 0.9, animation: "boot-fade-in 0.15s ease-out" }}>
              <span style={{ color: "#008800" }}>&gt; </span>Jhered BIOS v1.0.0 (build 2026)
            </div>
          )}
          {visibleLines >= 2 && (
            <div style={{ marginBottom: 8, opacity: 0.9, animation: "boot-fade-in 0.15s ease-out" }}>
              <span style={{ color: "#008800" }}>&gt; </span>CPU: x86 compatible processor @ 2.4GHz
            </div>
          )}
          {visibleLines >= 3 && (
            <div style={{ marginBottom: 8, opacity: 0.9, animation: "boot-fade-in 0.15s ease-out" }}>
              <span style={{ color: "#008800" }}>&gt; </span>
              Memory Test: {memCount.toLocaleString()}K{memCount >= 65536 ? " OK" : ""}
              {memCount < 65536 && <span style={{ animation: "grub-blink 0.5s step-end infinite" }}>_</span>}
            </div>
          )}
          {visibleLines >= 4 && (
            <div style={{ marginBottom: 8, opacity: 0.9, animation: "boot-fade-in 0.15s ease-out" }}>
              <span style={{ color: "#008800" }}>&gt; </span>Primary IDE: Detected
            </div>
          )}
          {visibleLines >= 5 && (
            <div style={{ marginBottom: 8, opacity: 0.9, animation: "boot-fade-in 0.15s ease-out" }}>
              <span style={{ color: "#008800" }}>&gt; </span>Secondary IDE: Detected
            </div>
          )}
          {showFinal && (
            <div style={{ marginTop: 12, animation: "boot-fade-in 0.3s ease-out" }}>
              <span style={{ color: "#00ff41" }}>&gt; </span>Starting Jhered OS...
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
