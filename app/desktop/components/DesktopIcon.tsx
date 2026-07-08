"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";

interface Props {
  icon: string;
  label: string;
  onOpen: () => void;
  iconSize?: "large" | "small";
  refreshTick?: number;
}

export default function DesktopIcon({ icon, label, onOpen, iconSize = "large", refreshTick = 0 }: Props) {
  const [selected, setSelected] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const lastClick = useRef(0);

  useEffect(() => {
    if (refreshTick === 0) return;
    const raf = requestAnimationFrame(() => setBlinking(true));
    const t = setTimeout(() => setBlinking(false), 600);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [refreshTick]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      const now = Date.now();
      if (now - lastClick.current < 400 && lastClick.current > 0) {
        onOpen();
        lastClick.current = 0;
      } else {
        lastClick.current = now;
        setSelected(true);
      }
    },
    [onOpen],
  );

  const handleBlur = useCallback(() => setSelected(false), []);

  const px = iconSize === "large" ? 36 : 24;

  return (
    <button
      className="flex flex-col items-center gap-1 p-1 cursor-pointer border-none bg-transparent"
      style={{ width: 80, outline: "none" }}
      onClick={handleClick}
      onBlur={handleBlur}
      onContextMenu={(e) => e.preventDefault()}
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
