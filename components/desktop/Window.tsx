"use client";

import { useRef, useCallback, useState, type ReactNode, type MouseEvent } from "react";
import type { WindowState } from "@/hooks/useWindowManager";

interface Props {
  win: WindowState;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, w: number, h: number) => void;
  children: ReactNode;
  isTop: boolean;
}

export default function WindowShell({
  win,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onMove,
  onResize,
  children,
  isTop,
}: Props) {
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; w: number; h: number } | null>(null);
  const [animatingOut, setAnimatingOut] = useState(false);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      onFocus(win.id);
      e.stopPropagation();
    },
    [onFocus, win.id],
  );

  const handleTitleMouseDown = useCallback(
    (e: MouseEvent) => {
      onFocus(win.id);
      if (win.maximized) return;
      e.preventDefault();
      dragRef.current = { startX: e.clientX, startY: e.clientY, winX: win.x, winY: win.y };
      const handleMouseMove = (ev: globalThis.MouseEvent) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startX;
        const dy = ev.clientY - dragRef.current.startY;
        onMove(win.id, dragRef.current.winX + dx, dragRef.current.winY + dy);
      };
      const handleMouseUp = () => {
        dragRef.current = null;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [onFocus, win.id, win.x, win.y, win.maximized, onMove],
  );

  const handleResizeMouseDown = useCallback(
    (e: MouseEvent) => {
      if (win.maximized) return;
      e.preventDefault();
      e.stopPropagation();
      resizeRef.current = { startX: e.clientX, startY: e.clientY, w: win.width, h: win.height };
      const handleMouseMove = (ev: globalThis.MouseEvent) => {
        if (!resizeRef.current) return;
        const dw = ev.clientX - resizeRef.current.startX;
        const dh = ev.clientY - resizeRef.current.startY;
        onResize(win.id, Math.max(200, resizeRef.current.w + dw), Math.max(100, resizeRef.current.h + dh));
      };
      const handleMouseUp = () => {
        resizeRef.current = null;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [win.id, win.width, win.height, win.maximized, onResize],
  );

  const handleClose = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      setAnimatingOut(true);
      setTimeout(() => onClose(win.id), 150);
    },
    [onClose, win.id],
  );

  const style: React.CSSProperties = win.maximized
    ? { top: 0, left: 0, width: "100%", height: "calc(100% - 30px)" }
    : { top: win.y, left: win.x, width: win.width, height: win.height };

  return (
    <div
      className="win98-window"
      style={{
        ...style,
        zIndex: win.zIndex,
        opacity: animatingOut ? 0 : 1,
        transition: animatingOut ? "opacity 0.15s" : undefined,
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className={`win98-titlebar ${isTop ? "" : "win98-titlebar-inactive"}`}
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={() => onMaximize(win.id)}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          <span>{win.icon}</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{win.title}</span>
        </span>
        <div className="win98-title-buttons">
          <button className="win98-title-btn" onMouseDown={(e) => { e.stopPropagation(); onMinimize(win.id); }} aria-label="Minimize">_</button>
          <button className="win98-title-btn" onMouseDown={(e) => { e.stopPropagation(); onMaximize(win.id); }} aria-label="Maximize">
            {win.maximized ? "❐" : "□"}
          </button>
          <button className="win98-title-btn" onMouseDown={handleClose} aria-label="Close">✕</button>
        </div>
      </div>
      <div data-lenis-prevent style={{ padding: 2, height: "calc(100% - 22px)", overflow: "auto", background: "#fff" }}>
        {children}
      </div>
      <div className="win98-resize-handle" onMouseDown={handleResizeMouseDown}>
        <svg width="14" height="14" viewBox="0 0 14 14">
          <line x1="10" y1="0" x2="14" y2="4" stroke="#808080" strokeWidth="1" />
          <line x1="10" y1="0" x2="14" y2="4" stroke="#fff" strokeWidth="1" transform="translate(0,1)" />
          <line x1="7" y1="3" x2="14" y2="10" stroke="#808080" strokeWidth="1" />
          <line x1="7" y1="3" x2="14" y2="10" stroke="#fff" strokeWidth="1" transform="translate(0,1)" />
          <line x1="4" y1="6" x2="14" y2="16" stroke="#808080" strokeWidth="1" />
          <line x1="4" y1="6" x2="14" y2="16" stroke="#fff" strokeWidth="1" transform="translate(0,1)" />
        </svg>
      </div>
    </div>
  );
}
