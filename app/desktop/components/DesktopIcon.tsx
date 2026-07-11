"use client";

import { useCallback, useEffect, useState, type MouseEvent, type ReactNode } from "react";

interface Props {
  icon: ReactNode;
  label: string;
  onOpen: () => void;
  iconSize?: "large" | "small";
  refreshTick?: number;
  swapButtons?: boolean;
}

export default function DesktopIcon({ icon, label, onOpen, iconSize = "large", refreshTick = 0, swapButtons = false }: Props) {
  const [selected, setSelected] = useState(false);
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (refreshTick === 0) return;
    const raf = requestAnimationFrame(() => setBlinking(true));
    const t = setTimeout(() => setBlinking(false), 600);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [refreshTick]);

  const handleClick = useCallback(() => {
    setSelected(true);
    setTimeout(() => setSelected(false), 300);
    onOpen();
  }, [onOpen]);

  const px = iconSize === "large" ? 36 : 24;

  return (
    <button
      className="flex flex-col items-center gap-1 p-1 cursor-pointer border-none bg-transparent"
      style={{ width: 80, outline: "none", color: "#000" }}
      onClick={handleClick}
      onBlur={() => setSelected(false)}
      onContextMenu={(e) => {
        e.preventDefault();
        if (swapButtons) handleClick();
      }}
      tabIndex={0}
    >
      <div
        className={blinking ? "desktop-icon-blink" : ""}
        style={{
          fontSize: px, lineHeight: 1, filter: selected ? "brightness(0.7) sepia(1) hue-rotate(180deg) saturate(3)" : undefined,
          background: selected ? "rgba(0,0,128,0.3)" : undefined,
          borderRadius: 4, padding: 4,
        }}
      >
        {icon}
      </div>
      <span
        className="win98-icon-label"
        style={{
          fontSize: iconSize === "large" ? 11 : 10,
          background: selected ? "rgba(0,0,128,0.4)" : undefined,
          borderRadius: 2, padding: "0 2px",
        }}
      >
        {label}
      </span>
    </button>
  );
}
