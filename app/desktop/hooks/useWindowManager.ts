"use client";

import { useState, useCallback, useRef } from "react";

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  component: "about" | "portfolio" | "explorer" | "paint" | "controlpanel" | "browser";
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
}

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const zCounter = useRef(1);
  const idCounter = useRef(0);

  const openWindow = useCallback(
    (component: WindowState["component"]) => {
      const id = `win-${++idCounter.current}`;
      const offsets: Record<string, number> = { about: 0, portfolio: 15, explorer: 30, paint: 60, controlpanel: 90, browser: 45 };
      const offset = offsets[component];
      const titleMap: Record<string, string> = {
        about: "About Me - Notepad",
        portfolio: "My Portfolio",
        explorer: "File Explorer",
        paint: "Paint",
        controlpanel: "Control Panel",
        browser: "Internet Explorer",
      };
      const iconMap: Record<string, string> = {
        about: "📄",
        portfolio: "🏠",
        explorer: "📁",
        paint: "🎨",
        controlpanel: "⚙️",
        browser: "🌐",
      };
      const newWin: WindowState = {
        id,
        title: titleMap[component] || component,
        icon: iconMap[component] || "📄",
        component,
        width: component === "portfolio" ? Math.round(window.innerWidth * 0.8) : 500,
        height: component === "portfolio" ? Math.round(window.innerHeight * 0.8) : 380,
        x: component === "portfolio" ? Math.round((window.innerWidth - Math.round(window.innerWidth * 0.8)) / 2) : 50 + offset,
        y: component === "portfolio" ? Math.round((window.innerHeight - Math.round(window.innerHeight * 0.8)) / 2) + 15 : 30 + offset,
        zIndex: zCounter.current++,
        minimized: false,
        maximized: false,
      };
      setWindows((prev) => [...prev, newWin]);
      return id;
    },
    [],
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: zCounter.current++ } : w)),
    );
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w)),
    );
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, maximized: !w.maximized, minimized: false } : w,
      ),
    );
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w)),
    );
  }, []);

  const resizeWindow = useCallback(
    (id: string, width: number, height: number) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, width, height } : w)),
      );
    },
    [],
  );

  const topWindow = windows.reduce<WindowState | null>(
    (max, w) => (!w.minimized && (!max || w.zIndex > max.zIndex) ? w : max),
    null,
  );

  return {
    windows,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    toggleMaximize,
    moveWindow,
    resizeWindow,
    topWindow,
  };
}
