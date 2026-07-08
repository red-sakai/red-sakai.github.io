"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useWindowManager } from "../hooks/useWindowManager";
import { useDesktopSounds } from "../hooks/useDesktopSounds";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";
import DesktopIcon from "./DesktopIcon";
import WindowShell from "./Window";
import AboutMeWindow from "./programs/AboutMeWindow";
import FileExplorer from "./programs/FileExplorer";
import PaintClone from "./programs/PaintClone";
import ControlPanel from "./programs/ControlPanel";
import { JH_LOGO } from "../data/jhered-os-logo";
import "../desktop.css";

const programList = [
  { id: "about", icon: "📄", label: "About Me" },
  { id: "explorer", icon: "📁", label: "File Explorer" },
  { id: "paint", icon: "🎨", label: "Paint" },
  { id: "controlpanel", icon: "⚙️", label: "Control Panel" },
];

const desktopIcons = [
  { id: "explorer", icon: "💻", label: "My Computer" },
  { id: "explorer", icon: "📁", label: "Projects" },
  { id: "about", icon: "📄", label: "About Me" },
  { id: "paint", icon: "🎨", label: "Paint" },
  { id: "controlpanel", icon: "⚙️", label: "Control Panel" },
];

const iconPositions = [
  { top: 20, left: 20 },
  { top: 20, left: 120 },
  { top: 20, left: 220 },
  { top: 20, left: 320 },
  { top: 20, left: 420 },
];

export default function DesktopShell() {
  const router = useRouter();
  const {
    windows, openWindow, closeWindow, focusWindow,
    minimizeWindow, toggleMaximize, moveWindow, resizeWindow, topWindow,
  } = useWindowManager();
  const sounds = useDesktopSounds();
  const [startOpen, setStartOpen] = useState(false);
  const [wallpaper, setWallpaper] = useState("#008080");
  const [showBoot, setShowBoot] = useState(true);
  const [biosLine, setBiosLine] = useState(0);
  const [memCount, setMemCount] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setBiosLine(1), 150),
      setTimeout(() => setBiosLine(2), 400),
      setTimeout(() => setBiosLine(3), 700),
      setTimeout(() => setBiosLine(4), 1400),
      setTimeout(() => setBiosLine(5), 1700),
      setTimeout(() => { setBiosLine(6); }, 2000),
    ];
    sounds.play("startup");
    const bootTimer = setTimeout(() => setShowBoot(false), 2500);
    return () => { timers.forEach(clearTimeout); clearTimeout(bootTimer); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (biosLine < 3 || biosLine >= 4) return;
    const t = setInterval(() => {
      setMemCount((p) => {
        const n = p + Math.floor(Math.random() * 12288) + 4096;
        if (n >= 65536) { clearInterval(t); return 65536; }
        return n;
      });
    }, 70);
    return () => clearInterval(t);
  }, [biosLine]);

  useEffect(() => {
    if (!startOpen) return;
    const handler = () => setStartOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [startOpen]);

  const handleOpenProgram = useCallback(
    (id: string) => {
      sounds.play("open");
      openWindow(id as "about" | "explorer" | "paint" | "controlpanel");
      setStartOpen(false);
    },
    [sounds, openWindow],
  );

  const handleShutDown = useCallback(() => {
    router.push("/grub-bootloader");
  }, [router]);

  const handleIconOpen = useCallback(
    (id: string) => {
      sounds.play("open");
      openWindow(id as "about" | "explorer" | "paint" | "controlpanel");
    },
    [sounds, openWindow],
  );

  const handleTaskbarClick = useCallback(
    (id: string) => {
      const win = windows.find((w) => w.id === id);
      if (!win) return;
      if (win.minimized) {
        focusWindow(id);
        minimizeWindow(id);
      } else {
        focusWindow(id);
      }
    },
    [windows, focusWindow, minimizeWindow],
  );

  const handleCloseWindow = useCallback(
    (id: string) => {
      sounds.play("close");
      closeWindow(id);
    },
    [sounds, closeWindow],
  );

  const handleSoundToggle = useCallback(() => {
    return sounds.toggle();
  }, [sounds]);

  const wallpaperColor =
    wallpaper === "teal" ? "#008080" :
    wallpaper === "black" ? "#000000" :
    wallpaper === "maroon" ? "#800000" :
    wallpaper === "navy" ? "#000080" : "#008080";

  const renderProgram = (component: string): ReactNode => {
    switch (component) {
      case "about": return <AboutMeWindow />;
      case "explorer": return <FileExplorer />;
      case "paint": return <PaintClone />;
      case "controlpanel": return (
        <ControlPanel
          soundToggle={handleSoundToggle}
          onClose={() => {
            const w = windows.find((win) => win.component === "controlpanel");
            if (w) closeWindow(w.id);
          }}
          onWallpaperChange={setWallpaper}
          currentWallpaper={wallpaper}
        />
      );
      default: return null;
    }
  };

  if (showBoot) {
    return (
      <main
        className="crt-curve"
        style={{
          minHeight: "100dvh", background: "#000", color: "#00ff41",
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          fontSize: 14, display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
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
            {biosLine >= 1 && (
              <div style={{ marginBottom: 8, opacity: 0.9, animation: "boot-fade-in 0.15s ease-out" }}>
                <span style={{ color: "#008800" }}>&gt; </span>Jhered OS Shell v1.0 initializing...
              </div>
            )}
            {biosLine >= 2 && (
              <div style={{ marginBottom: 8, opacity: 0.9, animation: "boot-fade-in 0.15s ease-out" }}>
                <span style={{ color: "#008800" }}>&gt; </span>Memory Test: {memCount.toLocaleString()}K{memCount >= 65536 ? " OK" : ""}
                {memCount < 65536 && <span style={{ animation: "grub-blink 0.5s step-end infinite" }}>_</span>}
              </div>
            )}
            {biosLine >= 3 && (
              <div style={{ marginBottom: 8, opacity: 0.9, animation: "boot-fade-in 0.15s ease-out" }}>
                <span style={{ color: "#008800" }}>&gt; </span>Loading desktop environment...
              </div>
            )}
            {biosLine >= 4 && (
              <div style={{ marginBottom: 8, opacity: 0.9, animation: "boot-fade-in 0.15s ease-out" }}>
                <span style={{ color: "#008800" }}>&gt; </span>Starting taskbar services...
              </div>
            )}
            {biosLine >= 5 && (
              <div style={{ marginBottom: 8, opacity: 0.9, animation: "boot-fade-in 0.15s ease-out" }}>
                <span style={{ color: "#008800" }}>&gt; </span>Initializing window manager...
              </div>
            )}
            {biosLine >= 6 && (
              <div style={{ marginTop: 12, animation: "boot-fade-in 0.3s ease-out" }}>
                <span style={{ color: "#00ff41" }}>&gt; </span>Desktop ready.
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="desktop-scanlines"
      style={{
        minHeight: "100dvh", background: wallpaperColor, position: "relative",
        overflow: "hidden", paddingBottom: 30, animation: "boot-fade-in 0.3s ease-out",
        fontFamily: '"MS Sans Serif", "Chicago", "Segoe UI", sans-serif',
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {desktopIcons.map((icon, idx) => (
        <div key={icon.id + idx} style={{ position: "absolute", ...iconPositions[idx] }}>
          <DesktopIcon
            icon={icon.icon}
            label={icon.label}
            onOpen={() => handleIconOpen(icon.id)}
          />
        </div>
      ))}

      <Taskbar
        windows={windows}
        onStartClick={() => setStartOpen((prev) => !prev)}
        startOpen={startOpen}
        onTaskbarClick={handleTaskbarClick}
        sounds={sounds}
      />

      {startOpen && (
        <StartMenu
          programs={programList}
          onOpen={handleOpenProgram}
          onShutDown={handleShutDown}
          sounds={sounds}
        />
      )}

      {windows
        .filter((w) => !w.minimized)
        .map((win) => (
          <WindowShell
            key={win.id}
            win={win}
            onFocus={focusWindow}
            onClose={handleCloseWindow}
            onMinimize={minimizeWindow}
            onMaximize={toggleMaximize}
            onMove={moveWindow}
            onResize={resizeWindow}
            isTop={topWindow?.id === win.id}
          >
            {renderProgram(win.component)}
          </WindowShell>
        ))}
    </main>
  );
}
