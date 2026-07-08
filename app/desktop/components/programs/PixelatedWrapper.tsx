"use client";

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PixelatedWrapper({ children }: Props) {
  return (
    <div className="pixelated-wrapper" style={{
      position: "relative",
      width: "100%",
      minHeight: "100%",
    }}>
      <div style={{
        position: "fixed",
        inset: 0,
        background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(128, 128, 128, 0.03) 3px, rgba(128, 128, 128, 0.03) 4px)",
        pointerEvents: "none",
        zIndex: 9999,
      }} />
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: "linear-gradient(rgba(128, 128, 128, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(128, 128, 128, 0.03) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        pointerEvents: "none",
        zIndex: 9998,
      }} />
      <div style={{ position: "relative", zIndex: 1, padding: 8 }}>
        {children}
      </div>
    </div>
  );
}
