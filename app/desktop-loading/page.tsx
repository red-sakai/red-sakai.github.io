"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "../desktop/desktop.css";

export default function DesktopLoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.push("/desktop");
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className="desktop-booting-page" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <div style={{ fontSize: 48, animation: "logo-glow 0.8s ease-in-out infinite alternate" }}>🪟</div>
      <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>Windows 98</div>
      <div style={{ width: 200, height: 16, background: "#000", border: "2px solid #fff", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg, #000080, #1084d0)", width: "0%", animation: "boot-progress 1.8s ease-in-out forwards" }} />
      </div>
      <div style={{ fontSize: 11, opacity: 0.8 }}>Starting Retro Desktop Mode...</div>
    </main>
  );
}
