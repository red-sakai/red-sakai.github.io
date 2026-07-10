"use client";

import { useEffect, useRef, useCallback } from "react";

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
            onClick={() => {
              if (item.disabled) return;
              item.action?.();
              close();
            }}
          >
            {item.icon && <span className="win98-context-icon">{item.icon}</span>}
            {item.label && <span className="win98-context-label">{item.label}</span>}
          </div>
        );
      })}
    </div>
  );
}
