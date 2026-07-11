"use client";

import { useState, useCallback, useRef, useEffect } from "react";

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

interface Props {
  soundToggle: () => boolean;
  onClose: () => void;
  // Legacy wallpaper props (backward compat with DesktopShell — will be replaced when DesktopShell uses WallpaperState)
  onWallpaperChange?: (wallpaper: string) => void;
  currentWallpaper?: string;
  // New wallpaper props (WallpaperState-based)
  wallpaperConfig?: WallpaperState;
  onWallpaperConfigChange?: (config: WallpaperState) => void;
  // Appearance / Color scheme
  colorScheme?: string;
  onColorSchemeChange?: (id: string) => void;
  // Mouse settings
  doubleClickSpeed?: number;
  onMouseSpeedChange?: (ms: number) => void;
  swapButtons?: boolean;
  onSwapButtonsChange?: (swap: boolean) => void;
  // Icon visibility
  visibleIcons?: string[];
  onIconVisibilityChange?: (ids: string[]) => void;
  // Faux resolution
  fauxResolution?: string;
  onResolutionChange?: (res: string) => void;
}

const COLOR_SCHEMES: ColorSchemeDef[] = [
  { id: "standard", label: "Windows Standard", vars: { "--titlebar-start": "#000080", "--titlebar-end": "#1084d0", "--taskbar-bg": "#c0c0c0" } },
  { id: "rose", label: "Rose", vars: { "--titlebar-start": "#800000", "--titlebar-end": "#d04848", "--taskbar-bg": "#c0c0c0" } },
  { id: "eggplant", label: "Eggplant", vars: { "--titlebar-start": "#400040", "--titlebar-end": "#804080", "--taskbar-bg": "#c0c0c0" } },
  { id: "marine", label: "Marine", vars: { "--titlebar-start": "#000080", "--titlebar-end": "#008080", "--taskbar-bg": "#c0c0c0" } },
  { id: "pumpkin", label: "Pumpkin", vars: { "--titlebar-start": "#804000", "--titlebar-end": "#d08040", "--taskbar-bg": "#c0c0c0" } },
];

const SOLID_WALLPAPERS = [
  { id: "teal", label: "Classic Teal", color: "#008080" },
  { id: "black", label: "Black", color: "#000000" },
  { id: "maroon", label: "Maroon", color: "#800000" },
  { id: "navy", label: "Navy", color: "#000080" },
];

const PRESET_WALLPAPERS = [
  { id: "preset-1", label: "Wallpaper 1", path: "/wallpapers/wallpaper1.jpg" },
  { id: "preset-2", label: "Wallpaper 2", path: "/wallpapers/wallpaper2.jpg" },
];

const ICON_DEFS = [
  { id: "portfolio", label: "My Portfolio" },
  { id: "explorer", label: "My Computer" },
  { id: "paint", label: "Paint" },
  { id: "controlpanel", label: "Control Panel" },
];

const RESOLUTIONS = ["640x480", "800x600", "1024x768"];

export default function ControlPanel({
  soundToggle, onClose,
  onWallpaperChange, currentWallpaper: legacyWallpaper,
  wallpaperConfig: configProp, onWallpaperConfigChange,
  colorScheme = "standard", onColorSchemeChange,
  doubleClickSpeed = 400, onMouseSpeedChange,
  swapButtons = false, onSwapButtonsChange,
  visibleIcons: visibleProp, onIconVisibilityChange,
  fauxResolution = "800x600", onResolutionChange,
}: Props) {
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localPresets] = useState<{id: string, label: string, path: string}[]>(PRESET_WALLPAPERS);
  const [localImported, setLocalImported] = useState<{id: string, label: string, dataUri: string}[]>([]);

  // Initialize wallpaper state from props
  const [wallpaper, setWallpaper] = useState<WallpaperState>(() =>
    configProp ?? { type: "color", value: "#008080", fit: "center" }
  );

  const handleSoundToggle = useCallback(() => {
    const enabled = soundToggle();
    setSoundsEnabled(enabled);
  }, [soundToggle]);

  // Scan localStorage for imported wallpapers on mount
  useEffect(() => {
    const imported: {id: string, label: string, dataUri: string}[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("imported-wallpaper-")) {
        try {
          const val = localStorage.getItem(key);
          if (val) imported.push({ id: key, label: `Imported ${key.replace("imported-wallpaper-", "")}`, dataUri: val });
        } catch {
          // skip malformed entries
        }
      }
    }
    setLocalImported(imported);
  }, []);

  // Wallpaper import handler
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUri = reader.result as string;
      try {
        const key = `imported-wallpaper-${Date.now()}`;
        localStorage.setItem(key, dataUri);
        setLocalImported(prev => [...prev, { id: key, label: `Imported ${file.name}`, dataUri }]);
        const newWallpaper: WallpaperState = { type: "imported", value: dataUri, fit: wallpaper.fit };
        setWallpaper(newWallpaper);
        onWallpaperConfigChange?.(newWallpaper);
      } catch (err) {
        if (err instanceof DOMException && err.name === "QuotaExceededError") {
          alert("Storage full — remove some wallpapers first.");
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Solid color wallpaper click
  const handleColorClick = (color: string) => {
    const newWallpaper: WallpaperState = { type: "color", value: color, fit: wallpaper.fit };
    setWallpaper(newWallpaper);
    onWallpaperConfigChange?.(newWallpaper);
    onWallpaperChange?.(color);
  };

  // Preset wallpaper click
  const handlePresetClick = (path: string) => {
    const newWallpaper: WallpaperState = { type: "preset", value: path, fit: wallpaper.fit };
    setWallpaper(newWallpaper);
    onWallpaperConfigChange?.(newWallpaper);
  };

  // Imported wallpaper click
  const handleImportedClick = (dataUri: string) => {
    const newWallpaper: WallpaperState = { type: "imported", value: dataUri, fit: wallpaper.fit };
    setWallpaper(newWallpaper);
    onWallpaperConfigChange?.(newWallpaper);
  };

  // Fit mode change
  const handleFitChange = (fit: "tile" | "center" | "stretch") => {
    const newWallpaper: WallpaperState = { ...wallpaper, fit };
    setWallpaper(newWallpaper);
    onWallpaperConfigChange?.(newWallpaper);
  };

  // Color scheme change
  const handleColorSchemeChange = (id: string) => {
    onColorSchemeChange?.(id);
  };

  // Mouse swap buttons
  const handleSwapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSwapButtonsChange?.(e.target.checked);
  };

  // Mouse double-click speed
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onMouseSpeedChange?.(Number(e.target.value));
  };

  // Icon visibility toggle
  const handleIconToggle = (iconId: string) => {
    const currentVisible = visibleProp ?? ICON_DEFS.map(i => i.id);
    const updated = currentVisible.includes(iconId)
      ? currentVisible.filter(id => id !== iconId)
      : [...currentVisible, iconId];
    onIconVisibilityChange?.(updated);
  };

  // Resolution change
  const handleResolutionChange = (res: string) => {
    onResolutionChange?.(res);
  };

  const sectionBox: React.CSSProperties = {
    borderTop: "2px solid #808080", borderLeft: "2px solid #808080",
    borderRight: "2px solid #fff", borderBottom: "2px solid #fff",
    padding: 8, marginBottom: 12,
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, marginBottom: 8,
  };

  const win98Btn: React.CSSProperties = {
    background: "#c0c0c0",
    borderTop: "2px solid #fff", borderLeft: "2px solid #fff",
    borderRight: "2px solid #808080", borderBottom: "2px solid #808080",
    outline: "1px solid #000",
    padding: "4px 20px", fontSize: 12, cursor: "pointer", color: "#000",
  };

  const currentVisible = visibleProp ?? ICON_DEFS.map(i => i.id);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: 12, fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif', color: "#000" }}>
      <h2 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px", color: "#000" }}>Control Panel</h2>

      <div style={{ overflowY: "auto", flex: 1, padding: "0 4px" }}>
        {/* ── Sound ── */}
        <div style={sectionBox}>
          <div style={sectionTitle}>Sound</div>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer" }}>
            <input type="checkbox" checked={soundsEnabled} onChange={handleSoundToggle} />
            Enable retro sound effects
          </label>
        </div>

        {/* ── Desktop Wallpaper ── */}
        <div style={sectionBox}>
          <div style={sectionTitle}>Desktop Wallpaper</div>

          {/* Color swatches gallery */}
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Colors</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
            {SOLID_WALLPAPERS.map((w) => (
              <button
                key={w.id}
                onClick={() => handleColorClick(w.color)}
                style={{
                  width: 60, height: 40, background: w.color,
                  border: wallpaper.value === w.color ? "3px solid #000080" : "2px solid #808080",
                  cursor: "pointer", display: "flex", alignItems: "flex-end", justifyContent: "center",
                  padding: 0,
                }}
                title={w.label}
                aria-label={w.label}
              >
                <span style={{ fontSize: 9, color: "#fff", textShadow: "0 0 2px #000", background: "rgba(0,0,0,0.4)", width: "100%", textAlign: "center" }}>
                  {w.label}
                </span>
              </button>
            ))}
          </div>

          {/* Preset images gallery */}
          {localPresets.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Presets</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                {localPresets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePresetClick(p.path)}
                    style={{
                      width: 60, height: 40,
                      border: wallpaper.value === p.path ? "3px solid #000080" : "2px solid #808080",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      padding: 0, background: "#e0e0e0", fontSize: 10, color: "#000",
                    }}
                    title={p.label}
                    aria-label={p.label}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Imported wallpapers */}
          {localImported.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Imported</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                {localImported.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => handleImportedClick(img.dataUri)}
                    style={{
                      width: 60, height: 40,
                      border: wallpaper.value === img.dataUri ? "3px solid #000080" : "2px solid #808080",
                      cursor: "pointer", padding: 0, background: `url(${img.dataUri}) center/cover`,
                    }}
                    title={img.label}
                    aria-label={img.label}
                  />
                ))}
              </div>
            </>
          )}

          {/* Import button */}
          <button onClick={() => fileInputRef.current?.click()} style={{ ...win98Btn, marginBottom: 8 }}>
            Import...
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImport}
          />

          {/* Fit mode radio buttons */}
          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Fit</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {(["tile", "center", "stretch"] as const).map((fit) => (
              <label key={fit} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, cursor: "pointer" }}>
                <input
                  type="radio"
                  name="wallpaper-fit"
                  checked={wallpaper.fit === fit}
                  onChange={() => handleFitChange(fit)}
                />
                {fit.charAt(0).toUpperCase() + fit.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* ── Appearance ── */}
        <div style={sectionBox}>
          <div style={sectionTitle}>Appearance</div>
          <div style={{ fontSize: 11, marginBottom: 6 }}>Color scheme:</div>
          {COLOR_SCHEMES.map((scheme) => (
            <label key={scheme.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer", marginBottom: 4 }}>
              <input
                type="radio"
                name="color-scheme"
                checked={colorScheme === scheme.id}
                onChange={() => handleColorSchemeChange(scheme.id)}
              />
              {scheme.label}
            </label>
          ))}
        </div>

        {/* ── Screen Resolution ── */}
        <div style={sectionBox}>
          <div style={sectionTitle}>Screen Resolution</div>
          {RESOLUTIONS.map((res) => (
            <label key={res} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer", marginBottom: 4 }}>
              <input
                type="radio"
                name="screen-resolution"
                checked={fauxResolution === res}
                onChange={() => handleResolutionChange(res)}
              />
              {res.replace("x", " × ")}
            </label>
          ))}
          <div style={{ fontSize: 10, color: "#808080", marginTop: 4, fontStyle: "italic" }}>
            Changes take effect after restart.
          </div>
        </div>

        {/* ── Mouse ── */}
        <div style={sectionBox}>
          <div style={sectionTitle}>Mouse</div>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer", marginBottom: 10 }}>
            <input type="checkbox" checked={swapButtons} onChange={handleSwapChange} />
            Swap primary mouse button
          </label>
          <div style={{ fontSize: 11, marginBottom: 4 }}>Double-click speed:</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="range"
              min={200}
              max={800}
              step={200}
              value={doubleClickSpeed}
              onChange={handleSpeedChange}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: 11, minWidth: 30 }}>{doubleClickSpeed}ms</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#808080", marginTop: 2 }}>
            <span>200 (Fast)</span>
            <span>400</span>
            <span>600</span>
            <span>800 (Slow)</span>
          </div>
        </div>

        {/* ── Desktop Icons ── */}
        <div style={sectionBox}>
          <div style={sectionTitle}>Desktop Icons</div>
          {ICON_DEFS.map((iconDef) => (
            <label key={iconDef.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer", marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={currentVisible.includes(iconDef.id)}
                onChange={() => handleIconToggle(iconDef.id)}
              />
              {iconDef.label}
            </label>
          ))}
        </div>
      </div>

      {/* OK button */}
      <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
        <button style={win98Btn} onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}

export type { Props as ControlPanelProps };
