"use client";

import { useCallback } from "react";
import styles from "./windows98.module.css";

export type WindowState = {
  id: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMaximized: boolean;
  zIndex: number;
};

type WindowProps = {
  state: WindowState;
  isActive: boolean;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
  maximizedSize: { width: number; height: number };
  minSize?: { width: number; height: number };
  children: React.ReactNode;
};

export function Window({
  state,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onMove,
  maximizedSize,
  minSize,
  children,
}: WindowProps) {
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      if (state.isMaximized) return;

      onFocus(state.id);
      event.preventDefault();

      const startX = event.clientX;
      const startY = event.clientY;
      const startPos = { ...state.position };

      const handleMove = (moveEvent: MouseEvent) => {
        const nextX = startPos.x + (moveEvent.clientX - startX);
        const nextY = startPos.y + (moveEvent.clientY - startY);
        onMove(state.id, { x: nextX, y: nextY });
      };

      const handleUp = () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [onFocus, onMove, state.id, state.isMaximized, state.position]
  );

  const style = state.isMaximized
    ? {
        width: maximizedSize.width,
        height: maximizedSize.height,
        top: 0,
        left: 0,
      }
    : {
        width: state.size.width,
        height: state.size.height,
        top: state.position.y,
        left: state.position.x,
      };

  return (
    <div
      className={`${styles.window} ${isActive ? styles.windowActive : ""}`}
      style={{
        ...style,
        zIndex: state.zIndex,
        minWidth: minSize?.width,
        minHeight: minSize?.height,
      }}
      onMouseDown={() => onFocus(state.id)}
    >
      <div className={styles.titleBar} onMouseDown={handleMouseDown}>
        <span className={styles.titleText}>{state.title}</span>
        <div className={styles.titleButtons}>
          <button
            type="button"
            className={styles.titleButton}
            onClick={(event) => {
              event.stopPropagation();
              onMinimize(state.id);
            }}
            aria-label="Minimize"
          >
            _
          </button>
          <button
            type="button"
            className={styles.titleButton}
            onClick={(event) => {
              event.stopPropagation();
              onMaximize(state.id);
            }}
            aria-label="Maximize"
          >
            []
          </button>
          <button
            type="button"
            className={styles.titleButton}
            onClick={(event) => {
              event.stopPropagation();
              onClose(state.id);
            }}
            aria-label="Close"
          >
            X
          </button>
        </div>
      </div>
      <div className={styles.windowContent}>{children}</div>
    </div>
  );
}
