"use client";

import { useEffect, useState } from "react";
import styles from "./windows98.module.css";

export type TaskbarWindow = {
  id: string;
  title: string;
  isActive: boolean;
  isMinimized: boolean;
};

type TaskbarProps = {
  windows: TaskbarWindow[];
  onToggleStart: () => void;
  startOpen: boolean;
  onTaskClick: (id: string) => void;
};

export function Taskbar({ windows, onToggleStart, startOpen, onTaskClick }: TaskbarProps) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, "0");
      const suffix = hours >= 12 ? "PM" : "AM";
      setTime(`${displayHours}:${displayMinutes} ${suffix}`);
    };

    updateTime();
    const timer = window.setInterval(updateTime, 1000 * 30);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={styles.taskbar}>
      <button
        type="button"
        className={`${styles.startButton} ${startOpen ? styles.startButtonActive : ""}`}
        onClick={onToggleStart}
      >
        Start
      </button>
      <div className={styles.taskbarButtons}>
        {windows.map((win) => (
          <button
            key={win.id}
            type="button"
            className={`${styles.taskbarButton} ${win.isActive ? styles.taskbarButtonActive : ""}`}
            onClick={() => onTaskClick(win.id)}
          >
            {win.title}
          </button>
        ))}
      </div>
      <div className={styles.tray}>
        <span role="status" aria-live="polite">
          {time}
        </span>
      </div>
    </div>
  );
}
