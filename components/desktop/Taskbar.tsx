"use client";

import { useState, useEffect, useCallback, type MouseEvent } from "react";
import type { WindowState } from "@/hooks/useWindowManager";

interface Props {
  windows: WindowState[];
  onStartClick: () => void;
  startOpen: boolean;
  onTaskbarClick: (id: string) => void;
  sounds: { play: (name: "click") => void };
}

export default function Taskbar({ windows, onStartClick, startOpen, onTaskbarClick, sounds }: Props) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  const handleStart = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      sounds.play("click");
      onStartClick();
    },
    [onStartClick, sounds],
  );

  return (
    <div className="win98-taskbar" onMouseDown={(e) => e.stopPropagation()}>
      <button
        className={`win98-start-btn ${startOpen ? "pressed" : ""}`}
        onClick={handleStart}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>🪟</span>
        <span>Start</span>
      </button>
      {windows.map((w) => (
        <button
          key={w.id}
          className={`win98-taskbar-btn ${!w.minimized ? "active" : ""}`}
          onClick={() => onTaskbarClick(w.id)}
        >
          {w.icon} {w.title}
        </button>
      ))}
      <div className="win98-tray">
        <span>{time}</span>
      </div>
    </div>
  );
}
