"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface ContextMenuItem {
  label?: string;
  icon?: string;
  disabled?: boolean;
  separator?: boolean;
  children?: ContextMenuItem[];
  action?: () => void;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export default function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [subLabel, setSubLabel] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [close]);

  const handleItemClick = (item: ContextMenuItem) => {
    if (item.disabled || item.children) return;
    item.action?.();
    close();
  };

  const showSub = (label: string | null) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (label === null) {
      timerRef.current = setTimeout(() => setSubLabel(null), 200);
    } else {
      setSubLabel(label);
    }
  };

  const renderSubmenu = (children: ContextMenuItem[]) => (
    <div className="win98-context-submenu">
      {children.map((child, j) => {
        if (child.separator) return <div key={j} className="win98-context-separator" />;
        return (
          <div
            key={j}
            className={`win98-context-item${child.disabled ? " disabled" : ""}`}
            onClick={() => {
              if (child.disabled) return;
              child.action?.();
              close();
            }}
          >
            <span className="win98-context-icon">{child.icon || ""}</span>
            <span className="win98-context-label">{child.label || ""}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      ref={ref}
      className="win98-context-menu"
      style={{ left: x, top: y, position: "fixed", zIndex: 20000 }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {items.map((item, i) => {
        if (item.separator) return <div key={i} className="win98-context-separator" />;
        return (
          <div
            key={i}
            className={`win98-context-item${item.disabled ? " disabled" : ""}`}
            onMouseEnter={() => item.children && item.label && showSub(item.label)}
            onMouseLeave={() => item.children && showSub(null)}
            onClick={() => handleItemClick(item)}
          >
            <span className="win98-context-icon">{item.icon || ""}</span>
            <span className="win98-context-label">{item.label || ""}</span>
            {item.children && <span className="win98-context-arrow">▶</span>}
            {item.children && item.label && subLabel === item.label && renderSubmenu(item.children)}
          </div>
        );
      })}
    </div>
  );
}
