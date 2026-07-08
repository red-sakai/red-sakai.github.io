"use client";

import { useState, useCallback } from "react";

interface Props {
  soundToggle: () => boolean;
  onClose: () => void;
  onWallpaperChange?: (wallpaper: string) => void;
  currentWallpaper?: string;
}

export default function ControlPanel({ soundToggle, onClose, onWallpaperChange, currentWallpaper = "teal" }: Props) {
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [wallpaper, setWallpaper] = useState(currentWallpaper);
  const [fontSize, setFontSize] = useState(12);

  const handleWallpaperChange = (id: string) => {
    setWallpaper(id);
    onWallpaperChange?.(id);
  };

  const handleSoundToggle = useCallback(() => {
    const enabled = soundToggle();
    setSoundsEnabled(enabled);
  }, [soundToggle]);

  const wallpapers = [
    { id: "teal", label: "Classic Teal", color: "#008080" },
    { id: "black", label: "Black", color: "#000000" },
    { id: "maroon", label: "Maroon", color: "#800000" },
    { id: "navy", label: "Navy", color: "#000080" },
  ];

  return (
    <div style={{ padding: 12, fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif', color: "#000", fontSize }}>
      <h2 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px", color: "#000" }}>Control Panel</h2>

      <div style={{ borderTop: "2px solid #808080", borderLeft: "2px solid #808080", borderRight: "2px solid #fff", borderBottom: "2px solid #fff", padding: 8, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8 }}>Sound</div>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer" }}>
          <input type="checkbox" checked={soundsEnabled} onChange={handleSoundToggle} />
          Enable retro sound effects
        </label>
      </div>

      <div style={{ borderTop: "2px solid #808080", borderLeft: "2px solid #808080", borderRight: "2px solid #fff", borderBottom: "2px solid #fff", padding: 8, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8 }}>Display</div>
        <div style={{ fontSize: 12, marginBottom: 6 }}>Desktop Wallpaper:</div>
        <div style={{ display: "flex", gap: 8 }}>
          {wallpapers.map((w) => (
            <button
              key={w.id}
              style={{
                width: 60, height: 40, background: w.color,
                border: wallpaper === w.id ? "3px solid #000080" : "2px solid #808080",
                cursor: "pointer", display: "flex", alignItems: "flex-end", justifyContent: "center",
                padding: 0,
              }}
              onClick={() => handleWallpaperChange(w.id)}
              title={w.label}
              aria-label={w.label}
            >
              <span style={{ fontSize: 9, color: "#fff", textShadow: "0 0 2px #000", background: "rgba(0,0,0,0.4)", width: "100%", textAlign: "center" }}>
                {w.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "2px solid #808080", borderLeft: "2px solid #808080", borderRight: "2px solid #fff", borderBottom: "2px solid #fff", padding: 8, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8 }}>Accessibility</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
          <span>Font Size:</span>
          <input
            type="range"
            min={10}
            max={18}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <span>{fontSize}px</span>
        </div>
      </div>

      <button
        style={{
          background: "#c0c0c0", borderTop: "2px solid #fff", borderLeft: "2px solid #fff",
          borderRight: "2px solid #808080", borderBottom: "2px solid #808080", outline: "1px solid #000",
          padding: "4px 20px", fontSize: 12, cursor: "pointer", color: "#000",
        }}
        onClick={onClose}
      >
        OK
      </button>
    </div>
  );
}

export type { Props as ControlPanelProps };
