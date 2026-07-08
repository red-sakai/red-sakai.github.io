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

  useEffect(() => {
    const timer = setTimeout(() => setShowBoot(false), 2000);
    sounds.play("startup");
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        className="desktop-booting-page"
        style={{
          minHeight: "100dvh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 24,
        }}
      >
        <div style={{ fontSize: 48, animation: "logo-glow 0.8s ease-in-out infinite alternate" }}>🪟</div>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>Windows 98</div>
        <div
          style={{
            width: 200, height: 16, background: "#000", border: "2px solid #fff",
            borderRadius: 2, overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%", background: "linear-gradient(90deg, #000080, #1084d0)",
              width: "0%", animation: "boot-progress 1.8s ease-in-out forwards",
            }}
          />
        </div>
        <div style={{ fontSize: 11, opacity: 0.8 }}>Starting your desktop...</div>
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
