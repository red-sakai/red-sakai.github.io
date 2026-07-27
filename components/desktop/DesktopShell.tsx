"use client";

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useWindowManager } from "@/hooks/useWindowManager";
import { useDesktopSounds } from "@/hooks/useDesktopSounds";
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
import GameStation from "./programs/GameStation";
import Favorites from "./programs/Favorites";
import LoginModal from "./LoginModal";
import "./desktop.css";

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
  { id: "portfolio", icon: "🏠", label: "My Portfolio" },
  { id: "explorer", icon: "📁", label: "File Explorer" },
  { id: "paint", icon: "🎨", label: "Paint" },
  { id: "controlpanel", icon: "⚙️", label: "Control Panel" },
  { id: "browser", icon: "🌐", label: "Internet Explorer" },
  { id: "games", icon: "🎮", label: "Game Station" },
  { id: "favorites", icon: "⭐", label: "My Favorites" },
];

const IE_ICON = (
  <svg width="36" height="36" viewBox="0 0 36 36" style={{ display: "block" }}>
    <circle cx="18" cy="18" r="16" fill="#1a8cdb" />
    <ellipse cx="18" cy="18" rx="12" ry="8" fill="#fff" />
    <text x="18" y="23" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1a8cdb" fontFamily="Arial">e</text>
  </svg>
);

const DESKTOP_ICONS = [
  { id: "portfolio", icon: "🏠", label: "My Portfolio" },
  { id: "explorer", icon: "💻", label: "My Computer" },
  { id: "paint", icon: "🎨", label: "Paint" },
  { id: "controlpanel", icon: "⚙️", label: "Control Panel" },
  { id: "browser", icon: IE_ICON, label: "Internet Explorer" },
  { id: "games", icon: "🎮", label: "Game Station" },
  { id: "favorites", icon: "⭐", label: "My Favorites" },
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
  const [showBoot, setShowBoot] = useState(false);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [showShutDownDialog, setShowShutDownDialog] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loginAnimating, setLoginAnimating] = useState(false);

  // Wallpaper state with localStorage
  const [wallpaperConfig, setWallpaperConfig] = useState<WallpaperState>({ type: "color", value: "#008080", fit: "center" });

  // Color scheme state with localStorage
  const [colorScheme, setColorScheme] = useState<string>("standard");

  // Icon visibility with localStorage
  const [visibleIcons, setVisibleIcons] = useState<string[]>(() => DESKTOP_ICONS.map((i) => i.id));

  const [iconSize, setIconSize] = useState<"large" | "small">("large");

  // Mouse settings from localStorage
  const [doubleClickSpeed, setDoubleClickSpeed] = useState<number>(400);
  const [swapButtons, setSwapButtons] = useState<boolean>(false);

  // Faux resolution
  const [fauxResolution, setFauxResolution] = useState<string>("1024x768");

  // Hydration-safe localStorage loader — runs once on mount (client only)
  useEffect(() => {
    try {
      const wp = localStorage.getItem("desktop-wallpaper");
      if (wp) setWallpaperConfig(JSON.parse(wp));
    } catch {}
    try {
      const cs = localStorage.getItem("desktop-colorscheme");
      if (cs) setColorScheme(cs);
    } catch {}
    try {
      const iv = localStorage.getItem("desktop-icons-vis");
      if (iv) {
        const parsed: string[] = JSON.parse(iv);
        const allIds = DESKTOP_ICONS.map((i) => i.id);
        setVisibleIcons([...new Set([...parsed, ...allIds])]);
      }
    } catch {}
    try {
      const ms = localStorage.getItem("desktop-mousespeed");
      if (ms) setDoubleClickSpeed(parseInt(ms, 10));
    } catch {}
    try {
      const sb = localStorage.getItem("desktop-swapbuttons");
      if (sb) setSwapButtons(sb === "true");
    } catch {}
    try {
      const fr = localStorage.getItem("desktop-resolution");
      if (fr) setFauxResolution(fr);
    } catch {}
  }, []);

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
      openWindow(id as "about" | "portfolio" | "explorer" | "paint" | "controlpanel" | "browser" | "games" | "favorites");
      setStartOpen(false);
    },
    [sounds, openWindow],
  );

  const handleShutDown = useCallback(() => {
    setShowShutDownDialog(true);
  }, []);

  const handleShutDownConfirm = useCallback(() => {
    setShowShutDownDialog(false);
    router.push("/grub-bootloader");
  }, [router]);

  const handleShutDownCancel = useCallback(() => {
    setShowShutDownDialog(false);
  }, []);

  const handleLoginCancel = useCallback(() => {
    router.push("/grub-bootloader");
  }, [router]);

  const handleLoginSuccess = useCallback(() => {
    setLoginAnimating(true);
    setTimeout(() => {
      setShowLogin(false);
    }, 3200);
  }, []);

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
    {
      label: "View", icon: "▼",
      children: [
        { label: "Large Icons", action: () => setIconSize("large") },
        { label: "Small Icons", action: () => setIconSize("small") },
        { label: "List", action: () => {} },
        { label: "Details", action: () => {} },
      ],
    },
    { separator: true },
    { label: "Refresh", icon: "⟳", action: handleRefresh },
    { label: "Paste", icon: "📋", disabled: true },
    {
      label: "New", icon: "✨",
      children: [
        { label: "Folder", icon: "📁", action: () => {} },
        { label: "Text Document", icon: "📄", action: () => {} },
      ],
    },
    { separator: true },
    { label: "Properties", icon: "🔍", action: () => {} },
    { label: "Display Settings", icon: "🖥️", action: () => { handleCloseCtxMenu(); sounds.play("open"); openWindow("controlpanel"); } },
  ];

  const handleIconOpen = useCallback(
    (id: string) => {
      sounds.play("open");
      openWindow(id as "about" | "portfolio" | "explorer" | "paint" | "controlpanel" | "browser" | "games" | "favorites");
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
      case "games": return <GameStation />;
      case "favorites": return <Favorites />;
      default: return null;
    }
  };

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

      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 8, position: "relative", zIndex: 1, width: "fit-content" }}>
        {DESKTOP_ICONS
          .filter((icon) => visibleIcons.includes(icon.id))
          .map((icon) => (
          <DesktopIcon
            key={icon.id}
            icon={icon.icon}
            label={icon.label}
            onOpen={() => handleIconOpen(icon.id)}
            refreshTick={refreshTick}
            swapButtons={swapButtons}
            iconSize={iconSize}
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

      {showShutDownDialog && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 99999,
        }}>
          <div className="win98-window" style={{ width: 320, position: "relative" }}>
            <div className="win98-titlebar">
              <span>Shut Down</span>
            </div>
            <div style={{ padding: 16, textAlign: "center", color: "#000", fontSize: 11 }}>
              <p>Are you sure you want to shut down?</p>
              <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center" }}>
                <button className="win98-title-btn" style={{ padding: "4px 16px" }} onClick={handleShutDownConfirm}>OK</button>
                <button className="win98-title-btn" style={{ padding: "4px 16px" }} onClick={handleShutDownCancel}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLogin && (
        <div className={`login-overlay${loginAnimating ? " overlay-fade" : ""}`}>
          <LoginModal
            animating={loginAnimating}
            onSuccess={handleLoginSuccess}
            onCancel={handleLoginCancel}
          />
        </div>
      )}
    </main>
  );
}
