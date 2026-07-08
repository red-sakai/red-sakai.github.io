"use client";

import { useCallback, type MouseEvent } from "react";

interface ProgramEntry {
  id: string;
  icon: string;
  label: string;
}

interface Props {
  programs: ProgramEntry[];
  onOpen: (id: string) => void;
  onShutDown: () => void;
  sounds: { play: (name: "click") => void };
}

export default function StartMenu({ programs, onOpen, onShutDown, sounds }: Props) {
  const handleClick = useCallback(
    (id: string) => (e: MouseEvent) => {
      e.stopPropagation();
      sounds.play("click");
      onOpen(id);
    },
    [onOpen, sounds],
  );

  const handleShutDown = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      sounds.play("click");
      onShutDown();
    },
    [onShutDown, sounds],
  );

  return (
    <div className="win98-start-menu" onMouseDown={(e) => e.stopPropagation()}>
      <div className="win98-start-sidebar">
        <span>Windows 98</span>
      </div>
      <div className="win98-start-items">
        {programs.map((p) => (
          <button key={p.id} className="win98-start-item" onClick={handleClick(p.id)}>
            <span style={{ fontSize: 18 }}>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
        <div className="win98-start-divider" />
        <button className="win98-start-item" onClick={handleShutDown}>
          <span style={{ fontSize: 18 }}>⏻</span>
          <span>Shut Down...</span>
        </button>
      </div>
    </div>
  );
}
