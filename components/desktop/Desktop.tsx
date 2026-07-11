"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./windows98.module.css";
import { BootScreen } from "./BootScreen";
import { DesktopIcon } from "./DesktopIcon";
import { StartMenu } from "./StartMenu";
import { Taskbar } from "./Taskbar";
import { Window, WindowState } from "./Window";
import { ContactWindow } from "./windows/ContactWindow";
import { RecycleBinWindow } from "./windows/RecycleBinWindow";
import { ResumeWindow } from "./windows/ResumeWindow";

const TASKBAR_HEIGHT = 40;
const PORTFOLIO_MIN_SIZE = { width: 1100, height: 720 };

type WindowType = "portfolio" | "resume" | "contact" | "recycle";

type DesktopWindow = WindowState & {
  type: WindowType;
  isMinimized: boolean;
};

const defaultWindowConfig: Record<WindowType, { title: string; size: { width: number; height: number } }>= {
  portfolio: { title: "My Portfolio -- Jhered Miguel Republica", size: { width: 960, height: 680 } },
  resume: { title: "Resume.doc", size: { width: 720, height: 640 } },
  contact: { title: "Contact.exe", size: { width: 520, height: 500 } },
  recycle: { title: "Recycle Bin", size: { width: 420, height: 300 } },
};

const iconConfig = [
  { label: "My Portfolio", glyph: "P", type: "portfolio" as WindowType },
  { label: "Resume.doc", glyph: "R", type: "resume" as WindowType },
  { label: "Contact.exe", glyph: "C", type: "contact" as WindowType },
  { label: "Recycle Bin", glyph: "B", type: "recycle" as WindowType },
];

export function Desktop() {
  const [windows, setWindows] = useState<DesktopWindow[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [zCounter, setZCounter] = useState(10);
  const [startOpen, setStartOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [showBoot, setShowBoot] = useState(false);

  const desktopRef = useRef<HTMLDivElement | null>(null);
  const [desktopSize, setDesktopSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const visited = window.localStorage.getItem("desktopBooted") === "true";
    setShowBoot(!visited);
  }, []);

  const updateDesktopSize = useCallback(() => {
    if (!desktopRef.current) return;
    const rect = desktopRef.current.getBoundingClientRect();
    setDesktopSize({ width: rect.width, height: rect.height });
  }, []);

  useEffect(() => {
    updateDesktopSize();
    window.addEventListener("resize", updateDesktopSize);
    return () => window.removeEventListener("resize", updateDesktopSize);
  }, [updateDesktopSize]);

  const bringToFront = useCallback((id: string) => {
    setZCounter((prev) => {
      const nextZ = prev + 1;
      setWindows((current) =>
        current.map((win) =>
          win.id === id
            ? { ...win, zIndex: nextZ, isMinimized: false }
            : win
        )
      );
      return nextZ;
    });
    setActiveId(id);
  }, []);

  const openWindow = useCallback(
    (type: WindowType) => {
      setStartOpen(false);
      const existing = windows.find((win) => win.type === type);
      if (existing) {
        bringToFront(existing.id);
        setWindows((prev) =>
          prev.map((win) =>
            win.type === type ? { ...win, isMinimized: false } : win
          )
        );
        return;
      }

      setWindows((prev) => {
        const id = `${type}-${Date.now()}`;
        const config = defaultWindowConfig[type];
        const fallbackWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
        const fallbackHeight = typeof window !== "undefined" ? window.innerHeight : 800;
        const desktopWidth = desktopSize.width || fallbackWidth;
        const desktopHeight = desktopSize.height || fallbackHeight;
        const minSize = type === "portfolio" ? PORTFOLIO_MIN_SIZE : null;
        let width = Math.min(config.size.width, desktopWidth - 40);
        let height = Math.min(config.size.height, desktopHeight - TASKBAR_HEIGHT - 40);
        if (minSize) {
          width = Math.max(width, minSize.width);
          height = Math.max(height, minSize.height);
        }
        const x = Math.max(20, (desktopWidth - width) / 2);
        const y = Math.max(20, (desktopHeight - TASKBAR_HEIGHT - height) / 2);
        const forceMaximized =
          type === "portfolio" &&
          (desktopWidth < PORTFOLIO_MIN_SIZE.width || desktopHeight - TASKBAR_HEIGHT < PORTFOLIO_MIN_SIZE.height);

        const nextZ = zCounter + 1;
        const newWindow: DesktopWindow = {
          id,
          type,
          title: config.title,
          position: { x, y },
          size: { width, height },
          isMaximized: forceMaximized,
          isMinimized: false,
          zIndex: nextZ,
        };

        setActiveId(id);
        setZCounter((prevZ) => prevZ + 1);
        return [...prev, newWindow];
      });
    },
    [bringToFront, desktopSize.height, desktopSize.width, windows, zCounter]
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((win) => win.id !== id));
    setActiveId((prev) => (prev === id ? null : prev));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((win) => (win.id === id ? { ...win, isMinimized: true } : win)));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((win) => {
        if (win.id !== id) return win;
        if (win.type !== "portfolio") return { ...win, isMaximized: !win.isMaximized };
        if (desktopSize.width < PORTFOLIO_MIN_SIZE.width || desktopSize.height - TASKBAR_HEIGHT < PORTFOLIO_MIN_SIZE.height) {
          return { ...win, isMaximized: true };
        }
        return { ...win, isMaximized: !win.isMaximized };
      })
    );
  }, [desktopSize.height, desktopSize.width]);

  const moveWindow = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows((prev) => prev.map((win) => (win.id === id ? { ...win, position } : win)));
  }, []);

  const handleTaskClick = useCallback(
    (id: string) => {
      const target = windows.find((win) => win.id === id);
      if (!target) return;
      if (target.isMinimized) {
        bringToFront(id);
        return;
      }
      if (activeId === id) {
        minimizeWindow(id);
      } else {
        bringToFront(id);
      }
    },
    [activeId, bringToFront, minimizeWindow, windows]
  );

  const taskbarWindows = useMemo(
    () =>
      windows.map((win) => ({
        id: win.id,
        title: win.title,
        isActive: win.id === activeId,
        isMinimized: win.isMinimized,
      })),
    [activeId, windows]
  );

  const handleBootFinish = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("desktopBooted", "true");
    }
    setShowBoot(false);
  }, []);

  return (
    <div
      className={styles.desktopRoot}
      ref={desktopRef}
      onClick={() => {
        setStartOpen(false);
        setContextMenu(null);
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        setContextMenu({ x: event.clientX, y: event.clientY });
      }}
    >
      <div className={styles.desktopTexture} />

      {showBoot && <BootScreen onFinish={handleBootFinish} />}

      <div className={styles.desktopIcons}>
        {iconConfig.map((icon) => (
          <DesktopIcon
            key={icon.type}
            label={icon.label}
            glyph={icon.glyph}
            onOpen={() => openWindow(icon.type)}
          />
        ))}
      </div>

      {windows.map((win) => {
        if (win.isMinimized) return null;

        let content: React.ReactNode = null;
        if (win.type === "portfolio") {
          content = (
            <div className={styles.iframeWrap}>
              <iframe
                title="Portfolio"
                src="/portfolio"
                className={styles.portfolioFrame}
                scrolling="yes"
              />
            </div>
          );
        }
        if (win.type === "resume") content = <ResumeWindow />;
        if (win.type === "contact") content = <ContactWindow />;
        if (win.type === "recycle") content = <RecycleBinWindow />;

        return (
          <Window
            key={win.id}
            state={win}
            isActive={win.id === activeId}
            onFocus={bringToFront}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onMove={moveWindow}
            maximizedSize={{ width: desktopSize.width, height: desktopSize.height - TASKBAR_HEIGHT }}
            minSize={win.type === "portfolio" ? PORTFOLIO_MIN_SIZE : undefined}
          >
            {content}
          </Window>
        );
      })}

      <StartMenu open={startOpen} />

      {contextMenu && (
        <div
          className={styles.contextMenu}
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {[
            "View",
            "Sort By",
            "Refresh",
            "New",
            "Properties",
          ].map((item) => (
            <div key={item} className={styles.contextMenuItem}>
              {item}
            </div>
          ))}
        </div>
      )}

      <Taskbar
        windows={taskbarWindows}
        onToggleStart={() => setStartOpen((prev) => !prev)}
        startOpen={startOpen}
        onTaskClick={handleTaskClick}
      />
    </div>
  );
}
