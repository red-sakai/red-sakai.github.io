"use client";

import { useCallback, useRef, useState, type MouseEvent } from "react";

interface Props {
  icon: string;
  label: string;
  onOpen: () => void;
}

export default function DesktopIcon({ icon, label, onOpen }: Props) {
  const [selected, setSelected] = useState(false);
  const lastClick = useRef(0);

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
        style={{
          fontSize: 36, lineHeight: 1, filter: selected ? "brightness(0.7) sepia(1) hue-rotate(180deg) saturate(3)" : undefined,
          background: selected ? "rgba(0,0,128,0.3)" : undefined,
          borderRadius: 4, padding: 4,
        }}
      >
        {icon}
      </div>
      <span
        className="win98-icon-label"
        style={{
          background: selected ? "rgba(0,0,128,0.4)" : undefined,
          borderRadius: 2, padding: "0 2px",
        }}
      >
        {label}
      </span>
    </button>
  );
}
