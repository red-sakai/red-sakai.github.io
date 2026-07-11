"use client";

import { useEffect, useRef, useCallback, useState } from "react";

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
  const [hoveredParent, setHoveredParent] = useState<number | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleItemMouseEnter = (index: number, hasChildren: boolean) => {
    if (!hasChildren) return;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setHoveredParent(index);
    }, 150);
  };

  const handleItemMouseLeave = (index: number) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setHoveredParent((current) => current === index ? null : current);
    }, 200);
  };

  const handleItemClick = (item: ContextMenuItem) => {
    if (item.disabled) return;
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
          <div key={i} style={{ position: "relative" }}>
            <div
              className={`win98-context-item${item.disabled ? " disabled" : ""}`}
              onMouseEnter={() => handleItemMouseEnter(i, !!item.children)}
              onMouseLeave={() => handleItemMouseLeave(i)}
              onClick={() => handleItemClick(item)}
            >
              {item.icon && <span className="win98-context-icon">{item.icon}</span>}
              {item.label && <span className="win98-context-label">{item.label}</span>}
              {item.children && <span className="win98-context-arrow">▸</span>}
            </div>
            {item.children && hoveredParent === i && (
              <div
                className="win98-context-submenu"
                onMouseEnter={() => {
                  if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
                }}
                onMouseLeave={() => {
                  if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
                  hoverTimerRef.current = setTimeout(() => {
                    setHoveredParent(null);
                  }, 200);
                }}
              >
                {item.children.map((child, ci) => {
                  if (child.separator) return <div key={ci} className="win98-context-separator" />;
                  return (
                    <div
                      key={ci}
                      className={`win98-context-item${child.disabled ? " disabled" : ""}`}
                      onClick={() => handleItemClick(child)}
                    >
                      {child.icon && <span className="win98-context-icon">{child.icon}</span>}
                      {child.label && <span className="win98-context-label">{child.label}</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
