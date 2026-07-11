"use client";

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useWindowManager } from "../hooks/useWindowManager";
import { useDesktopSounds } from "../hooks/useDesktopSounds";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";
import DesktopIcon from "./DesktopIcon";
import WindowShell from "./Window";
import ContextMenu from "./ContextMenu";
import type { ContextMenuItem } from "./ContextMenu";
import FileExplorer from "./programs/FileExplorer";
import PaintClone from "./programs/PaintClone";
import ControlPanel from "./programs/ControlPanel";
import PortfolioViewer from "./programs/PortfolioViewer";
import InternetExplorer from "./programs/InternetExplorer";
import { JH_LOGO } from "../data/jhered-os-logo";
import "../desktop.css";

interface WallpaperState {
  type: "color" | "preset" | "imported";
  value: string;
  fit: "tile" | "center" | "stretch";
}

interface ColorSchemeDef {
  id: string;
  label: string;
  vars: Record<string, string>;
}

const COLOR_SCHEMES: ColorSchemeDef[] = [
  { id: "standard", label: "Windows Standard", vars: { "--titlebar-start": "#000080", "--titlebar-end": "#1084d0", "--taskbar-bg": "#c0c0c0" } },
  { id: "rose", label: "Rose", vars: { "--titlebar-start": "#800000", "--titlebar-end": "#d04848", "--taskbar-bg": "#c0c0c0" } },
  { id: "eggplant", label: "Eggplant", vars: { "--titlebar-start": "#400040", "--titlebar-end": "#804080", "--taskbar-bg": "#c0c0c0" } },
  { id: "marine", label: "Marine", vars: { "--titlebar-start": "#000080", "--titlebar-end": "#008080", "--taskbar-bg": "#c0c0c0" } },
  { id: "pumpkin", label: "Pumpkin", vars: { "--titlebar-start": "#804000", "--titlebar-end": "#d08040", "--taskbar-bg": "#c0c0c0" } },
];

const FIT_STYLES: Record<string, React.CSSProperties> = {
  tile:    { backgroundRepeat: "repeat", backgroundSize: "auto", backgroundPosition: "0 0" },
  center:  { backgroundRepeat: "no-repeat", backgroundSize: "auto", backgroundPosition: "center center" },
  stretch: { backgroundRepeat: "no-repeat", backgroundSize: "100% 100%", backgroundPosition: "0 0" },
};

const programList = [
  { id: "about", icon: "📄", label: "About Me" },
  { id: "portfolio", icon: "🏠", label: "My Portfolio" },
  { id: "explorer", icon: "📁", label: "File Explorer" },
  { id: "paint", icon: "🎨", label: "Paint" },
  { id: "controlpanel", icon: "⚙️", label: "Control Panel" },
  { id: "browser", icon: "🌐", label: "Internet Explorer" },
];

const DESKTOP_ICONS = [
  { id: "portfolio", icon: "🏠", label: "My Portfolio" },
  { id: "explorer", icon: "💻", label: "My Computer" },
  { id: "paint", icon: "🎨", label: "Paint" },
  { id: "controlpanel", icon: "⚙️", label: "Control Panel" },
];

export default function DesktopShell() {
  const router = useRouter();
  const {
    windows, openWindow, closeWindow, focusWindow,
    minimizeWindow, toggleMaximize, moveWindow, resizeWindow, topWindow,
  } = useWindowManager();
  const sounds = useDesktopSounds();

  const desktopRef = useRef<HTMLDivElement>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [showBoot, setShowBoot] = useState(true);
  const [biosLine, setBiosLine] = useState(0);
  const [memCount, setMemCount] = useState(0);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  // Wallpaper state with localStorage
  const [wallpaperConfig, setWallpaperConfig] = useState<WallpaperState>(() => {
    try {
      const stored = localStorage.getItem("desktop-wallpaper");
      return stored ? JSON.parse(stored) : { type: "color", value: "#008080", fit: "center" };
    } catch { return { type: "color", value: "#008080", fit: "center" }; }
  });

  // Color scheme state with localStorage
  const [colorScheme, setColorScheme] = useState<string>(() => {
    try { return localStorage.getItem("desktop-colorscheme") || "standard"; }
    catch { return "standard"; }
  });

  // Icon visibility with localStorage
  const [visibleIcons, setVisibleIcons] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("desktop-icons-vis");
      return stored ? JSON.parse(stored) : DESKTOP_ICONS.map((i) => i.id);
    } catch { return DESKTOP_ICONS.map((i) => i.id); }
  });

  // Mouse settings from localStorage
  const [doubleClickSpeed, setDoubleClickSpeed] = useState<number>(() => {
    try { return parseInt(localStorage.getItem("desktop-mousespeed") || "400", 10); }
    catch { return 400; }
  });
  const [swapButtons, setSwapButtons] = useState<boolean>(() => {
    try { return localStorage.getItem("desktop-swapbuttons") === "true"; }
    catch { return false; }
  });

  // Faux resolution
  const [fauxResolution, setFauxResolution] = useState<string>(() => {
    try { return localStorage.getItem("desktop-resolution") || "1024x768"; }
    catch { return "1024x768"; }
  });

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

  // Persist wallpaper config
  useEffect(() => {
    try { localStorage.setItem("desktop-wallpaper", JSON.stringify(wallpaperConfig)); }
    catch { /* quota exceeded — silently degrade */ }
  }, [wallpaperConfig]);

  // Persist color scheme + inject CSS variables
  useEffect(() => {
    try { localStorage.setItem("desktop-colorscheme", colorScheme); }
    catch { /* ignore */ }
    const el = desktopRef.current;
    if (!el) return;
    const scheme = COLOR_SCHEMES.find((s) => s.id === colorScheme);
    if (scheme) {
      Object.entries(scheme.vars).forEach(([key, val]) => {
        el.style.setProperty(key, val);
      });
    }
  }, [colorScheme]);

  // Persist icon visibility
  useEffect(() => {
    try { localStorage.setItem("desktop-icons-vis", JSON.stringify(visibleIcons)); }
    catch { /* ignore */ }
  }, [visibleIcons]);

  // Persist mouse settings
  useEffect(() => {
    try { localStorage.setItem("desktop-mousespeed", String(doubleClickSpeed)); }
    catch { /* ignore */ }
  }, [doubleClickSpeed]);

  useEffect(() => {
    try { localStorage.setItem("desktop-swapbuttons", String(swapButtons)); }
    catch { /* ignore */ }
  }, [swapButtons]);

  useEffect(() => {
    if (!startOpen) return;
    const handler = () => setStartOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [startOpen]);

  const handleOpenProgram = useCallback(
    (id: string) => {
      sounds.play("open");
      openWindow(id as "about" | "portfolio" | "explorer" | "paint" | "controlpanel" | "browser");
      setStartOpen(false);
    },
    [sounds, openWindow],
  );

  const handleShutDown = useCallback(() => {
    router.push("/grub-bootloader");
  }, [router]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshTick((t) => t + 1);
  }, []);

  const handleCloseCtxMenu = useCallback(() => {
    setCtxMenu(null);
  }, []);

  const contextItems: ContextMenuItem[] = [
    { label: "Refresh", icon: "⟳", action: handleRefresh },
  ];

  const handleIconOpen = useCallback(
    (id: string) => {
      sounds.play("open");
      openWindow(id as "about" | "portfolio" | "explorer" | "paint" | "controlpanel" | "browser");
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

  const renderProgram = (component: string): ReactNode => {
    switch (component) {
      case "explorer": return <FileExplorer />;
      case "paint": return <PaintClone />;
      case "controlpanel": return (
        <ControlPanel
          soundToggle={handleSoundToggle}
          onClose={() => {
            const w = windows.find((win) => win.component === "controlpanel");
            if (w) closeWindow(w.id);
          }}
          wallpaperConfig={wallpaperConfig}
          onWallpaperConfigChange={setWallpaperConfig}
          colorScheme={colorScheme}
          onColorSchemeChange={setColorScheme}
          doubleClickSpeed={doubleClickSpeed}
          onMouseSpeedChange={setDoubleClickSpeed}
          swapButtons={swapButtons}
          onSwapButtonsChange={setSwapButtons}
          visibleIcons={visibleIcons}
          onIconVisibilityChange={setVisibleIcons}
          fauxResolution={fauxResolution}
          onResolutionChange={setFauxResolution}
        />
      );
      case "portfolio": return <PortfolioViewer />;
      case "browser": return <InternetExplorer />;
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
      ref={desktopRef}
      style={{
        minHeight: "100dvh", position: "relative",
        overflow: "hidden", paddingBottom: 30, animation: "boot-fade-in 0.3s ease-out",
        fontFamily: '"MS Sans Serif", "Chicago", "Segoe UI", sans-serif',
        ...(wallpaperConfig.type === "color"
          ? { background: wallpaperConfig.value }
          : {
              backgroundImage: `url(${wallpaperConfig.value})`,
              ...FIT_STYLES[wallpaperConfig.fit],
            }),
      }}
      onContextMenu={handleContextMenu}
    >
      {ctxMenu && (
        <ContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          items={contextItems}
          onClose={handleCloseCtxMenu}
        />
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: 8, position: "relative", zIndex: 1 }}>
        {DESKTOP_ICONS
          .filter((icon) => visibleIcons.includes(icon.id))
          .map((icon) => (
          <DesktopIcon
            key={icon.id}
            icon={icon.icon}
            label={icon.label}
            onOpen={() => handleIconOpen(icon.id)}
            refreshTick={refreshTick}
            doubleClickSpeed={doubleClickSpeed}
            swapButtons={swapButtons}
          />
        ))}
      </div>

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
