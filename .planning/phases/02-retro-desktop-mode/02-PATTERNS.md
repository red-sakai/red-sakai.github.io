# Phase 02: Retro Desktop Mode — Pattern Map

**Mapped:** 2026-07-10
**Files analyzed:** 8 new/modified
**Analogs found:** 8 / 8

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `app/desktop/hooks/useWindowManager.ts` | hook (state) | event-driven | `app/desktop/hooks/useWindowManager.ts` (itself) | exact — type union extension |
| `app/desktop/components/DesktopShell.tsx` | component (orchestrator) | event-driven | `app/desktop/components/DesktopShell.tsx` (itself) | exact — super-set of changes |
| `app/desktop/components/ContextMenu.tsx` | component | event-driven | `app/desktop/components/ContextMenu.tsx` (itself) | exact — simplification |
| `app/desktop/components/DesktopIcon.tsx` | component | event-driven | `app/desktop/components/DesktopIcon.tsx` (itself) | exact — parameter addition |
| `app/desktop/components/programs/ControlPanel.tsx` | component | CRUD | `app/desktop/components/programs/ControlPanel.tsx` (itself) | exact — expansion |
| `app/desktop/components/programs/InternetExplorer.tsx` | component | request-response | `app/desktop/components/programs/FileExplorer.tsx` | role-match |
| `app/desktop/desktop.css` | stylesheet | — | `app/desktop/desktop.css` (itself) | exact — variable injection |
| `public/wallpapers/` | static asset dir | file-I/O | — | no analog (new directory) |

## Pattern Assignments

### `app/desktop/hooks/useWindowManager.ts` (hook, event-driven)

**Analog:** `app/desktop/hooks/useWindowManager.ts` (lines 1–121, existing file)

**Nature of change:** Extend the `component` union type to include `"browser"`, add title/icon mapping entries.

**Existing type union pattern** (lines 5–17):
```typescript
export interface WindowState {
  id: string;
  title: string;
  icon: string;
  component: "about" | "portfolio" | "explorer" | "paint" | "controlpanel"; // ADD "browser"
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
}
```

**Existing title/icon mapping pattern** (lines 27–50) — REPLACE the if/else chain with a Record lookup:
```typescript
// CURRENT: if-else chain (lines 31–50)
const newWin: WindowState = {
  id,
  title:
    component === "about"
      ? "About Me - Notepad"
      : /* ... 5 more ternary branches */,
  icon:
    component === "about"
      ? "📄"
      : /* ... 5 more ternary branches */,
  // ...
};
```
**Refactored pattern** (replace if-else chain with Record maps):
```typescript
const titleMap: Record<string, string> = {
  about: "About Me - Notepad",
  portfolio: "My Portfolio",
  explorer: "File Explorer",
  paint: "Paint",
  controlpanel: "Control Panel",
  browser: "Internet Explorer",
};

const iconMap: Record<string, string> = {
  about: "📄",
  portfolio: "🏠",
  explorer: "📁",
  paint: "🎨",
  controlpanel: "⚙️",
  browser: "🌐",
};
```

**openWindow function signature** (line 25) — no change needed, already uses `WindowState["component"]`.

**openWindow call sites in DesktopShell** (lines 100, 157) — the cast `as "about" | "portfolio" | "explorer" | "paint" | "controlpanel"` will need `"browser"` added.

---

### `app/desktop/components/DesktopShell.tsx` (component, event-driven)

**Analog:** `app/desktop/components/DesktopShell.tsx` (lines 1–347, existing file)

**Nature of change:** Multiple coordinated changes — wallpaper system, color scheme, icon filtering, context menu, browser program. This is the single largest change in the phase.

#### Change A: Wallpaper State (replace simple color with WallpaperState)

**Current pattern** (lines 55, 188–192):
```typescript
const [wallpaper, setWallpaper] = useState("#008080");
// ...
const wallpaperColor =
  wallpaper === "teal" ? "#008080" :
  wallpaper === "black" ? "#000000" :
  wallpaper === "maroon" ? "#800000" :
  wallpaper === "navy" ? "#000080" : "#008080";
```

**New pattern** (replace with WallpaperState + localStorage init):
```typescript
interface WallpaperState {
  type: "color" | "preset" | "imported";
  value: string;
  fit: "tile" | "center" | "stretch";
}

const FIT_STYLES: Record<string, React.CSSProperties> = {
  tile:    { backgroundRepeat: "repeat", backgroundSize: "auto", backgroundPosition: "0 0" },
  center:  { backgroundRepeat: "no-repeat", backgroundSize: "auto", backgroundPosition: "center center" },
  stretch: { backgroundRepeat: "no-repeat", backgroundSize: "100% 100%", backgroundPosition: "0 0" },
};

const DEFAULT_WALLPAPER: WallpaperState = {
  type: "color",
  value: "#008080",
  fit: "center",
};

// In component:
const [wallpaperConfig, setWallpaperConfig] = useState<WallpaperState>(() => {
  try {
    const stored = localStorage.getItem("desktop-wallpaper");
    return stored ? JSON.parse(stored) : DEFAULT_WALLPAPER;
  } catch {
    return DEFAULT_WALLPAPER;
  }
});

// Persist on change:
useEffect(() => {
  try {
    localStorage.setItem("desktop-wallpaper", JSON.stringify(wallpaperConfig));
  } catch { /* quota exceeded — silently degrade */ }
}, [wallpaperConfig]);
```

**Apply wallpaper style on `<main>`** (replace lines 276–283):
```typescript
const wallpaperStyle: React.CSSProperties = {
  minHeight: "100dvh",
  position: "relative",
  overflow: "hidden",
  paddingBottom: 30,
  ...(wallpaperConfig.type === "color"
    ? { background: wallpaperConfig.value }
    : {
        backgroundImage: `url(${wallpaperConfig.value})`,
        ...FIT_STYLES[wallpaperConfig.fit],
      }),
};
```

#### Change B: Color Scheme via CSS Custom Properties

**New pattern** — add ref and useEffect to inject CSS variables:
```typescript
const desktopRef = useRef<HTMLDivElement>(null);

// In component:
const [colorScheme, setColorScheme] = useState<string>(() => {
  try { return localStorage.getItem("desktop-colorscheme") || "standard"; }
  catch { return "standard"; }
});

useEffect(() => {
  const el = desktopRef.current;
  if (!el) return;
  const scheme = COLOR_SCHEMES.find((s) => s.id === colorScheme);
  if (!scheme) return;
  Object.entries(scheme.vars).forEach(([key, val]) => {
    el.style.setProperty(key, val);
  });
  try { localStorage.setItem("desktop-colorscheme", colorScheme); }
  catch { /* ignore */ }
}, [colorScheme]);
```

**Scheme definitions (can live in same file or a constants file):**
```typescript
interface ColorScheme {
  id: string;
  label: string;
  vars: Record<string, string>;
}

const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: "standard",
    label: "Windows Standard",
    vars: {
      "--titlebar-start": "#000080",
      "--titlebar-end": "#1084d0",
      "--taskbar-bg": "#c0c0c0",
    },
  },
  {
    id: "rose",
    label: "Rose",
    vars: {
      "--titlebar-start": "#800000",
      "--titlebar-end": "#d04848",
      "--taskbar-bg": "#c0c0c0",
    },
  },
  {
    id: "eggplant",
    label: "Eggplant",
    vars: {
      "--titlebar-start": "#400040",
      "--titlebar-end": "#804080",
      "--taskbar-bg": "#c0c0c0",
    },
  },
];
```

#### Change C: Desktop Icon List Cleanup

**Current pattern** (lines 29–36):
```typescript
const desktopIcons = [
  { id: "portfolio", icon: "🏠", label: "My Portfolio" },
  { id: "explorer", icon: "💻", label: "My Computer" },
  { id: "explorer", icon: "📁", label: "Projects" },        // REMOVE
  { id: "about", icon: "📄", label: "About Me" },            // REMOVE
  { id: "paint", icon: "🎨", label: "Paint" },
  { id: "controlpanel", icon: "⚙️", label: "Control Panel" },
];
```

**New pattern** — remove Projects and About Me, add reorder + visibility filtering:
```typescript
// Static icon definitions (visibility-independent)
const DESKTOP_ICONS = [
  { id: "portfolio", icon: "🏠", label: "My Portfolio" },
  { id: "explorer", icon: "💻", label: "My Computer" },
  { id: "paint", icon: "🎨", label: "Paint" },
  { id: "controlpanel", icon: "⚙️", label: "Control Panel" },
];

// In component — read visible icon IDs from localStorage:
const [visibleIcons, setVisibleIcons] = useState<string[]>(() => {
  try {
    const stored = localStorage.getItem("desktop-icons-vis");
    return stored ? JSON.parse(stored) : DESKTOP_ICONS.map((i) => i.id);
  } catch {
    return DESKTOP_ICONS.map((i) => i.id);
  }
});

// Filter icons before rendering:
const shownIcons = DESKTOP_ICONS.filter((icon) => visibleIcons.includes(icon.id));
```

**Icon position rendering** — replace absolute positioning with flex-wrap/grid:
```typescript
// Currently uses iconPositions array (lines 38–45) + position:absolute (line 300)
// Switch to flex-wrap layout:
<div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: 8 }}>
  {shownIcons.map((icon) => (
    <DesktopIcon
      key={icon.id}
      icon={icon.icon}
      label={icon.label}
      onOpen={() => handleIconOpen(icon.id)}
    />
  ))}
</div>
```

#### Change D: Context Menu Simplification

**Current pattern** (lines 123–152):
```typescript
const contextItems: ContextMenuItem[] = [
  {
    label: "View",
    children: [ /* Large/Small Icons */ ],
  },
  {
    label: "Sort By",
    children: [ /* Name/Size/Type/Date */ ],
  },
  { label: "Refresh", icon: "⟳", action: handleRefresh },
  { separator: true },
  { label: "Paste", icon: "📋", disabled: true, action: () => {} },
  { separator: true },
  { label: "Properties", icon: "⚙️", action: () => { /* ... */ } },
];
```

**New pattern** — single item, no submenus, no separators:
```typescript
const contextItems: ContextMenuItem[] = [
  { label: "Refresh", icon: "⟳", action: handleRefresh },
];
```

**Remove stale state** — these state variables are no longer needed:
```typescript
// REMOVE these lines:
const [iconSize, setIconSize] = useState<"large" | "small">("large");
const [iconSortBy, setIconSortBy] = useState<"name" | "size" | "type" | "date">("name");
const [refreshTick, setRefreshTick] = useState(0); // May keep if DesktopIcon still uses it
```

#### Change E: Browser Program Switch Case

**Current switch** (lines 194–212):
```typescript
const renderProgram = (component: string): ReactNode => {
  switch (component) {
    case "about": return <AboutMeWindow />;
    case "explorer": return <FileExplorer />;
    case "paint": return <PaintClone />;
    case "controlpanel": return ( /* ... */ );
    case "portfolio": return <PortfolioViewer />;
    default: return null;
  }
};
```

**New case added:**
```typescript
case "browser": return <InternetExplorer />;
```

Also add import: `import InternetExplorer from "./programs/InternetExplorer";`

**handleOpenProgram** (lines 97–104) — cast needs `"browser"` added:
```typescript
openWindow(id as "about" | "portfolio" | "explorer" | "paint" | "controlpanel" | "browser");
```
Same for `handleIconOpen` (line 157).

---

### `app/desktop/components/ContextMenu.tsx` (component, event-driven)

**Analog:** `app/desktop/components/ContextMenu.tsx` (lines 1–101, existing file)

**Nature of change:** Simplify the component to render a flat list of items with no submenus. Remove submenu state, submenu rendering, hover-timer logic, and submenu CSS classes.

**Current imports and state** (lines 3, 23–24):
```typescript
import { useEffect, useRef, useState, useCallback } from "react";
// ...
const [subLabel, setSubLabel] = useState<string | null>(null);
const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
```

**Simplified core** — remove `subLabel`, `timerRef`, `renderSubmenu`, `showSub` entirely. Keep the interface, click-outside handler, and flat item rendering.

**Flat render** (replace lines 53–73 and 82–96):
```typescript
return (
  <div
    ref={ref}
    className="win98-context-menu"
    style={{ left: x, top: y, position: "fixed", zIndex: 20000 }}
    onMouseDown={(e) => e.stopPropagation()}
  >
    {items.map((item, i) => {
      if (item.separator) return <div key={i} className="win98-context-separator" />;
      if (item.children) return null; // ignore submenu items — not needed in simplified menu
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
          <span className="win98-context-icon">{item.icon || ""}</span>
          <span className="win98-context-label">{item.label || ""}</span>
        </div>
      );
    })}
  </div>
);
```

**ContextMenuItem interface** (line 5 — can keep for backward compat, planner may simplify):
```typescript
export interface ContextMenuItem {
  label?: string;
  icon?: string;
  disabled?: boolean;
  separator?: boolean;
  children?: ContextMenuItem[];  // Keep for type compat, but ignore in render
  action?: () => void;
}
```

---

### `app/desktop/components/DesktopIcon.tsx` (component, event-driven)

**Analog:** `app/desktop/components/DesktopIcon.tsx` (lines 1–75, existing file)

**Nature of change:** Make the double-click speed threshold configurable via a prop or localStorage, rather than the hardcoded `400`.

**Current double-click speed** (line 29):
```typescript
if (now - lastClick.current < 400 && lastClick.current > 0) { // 400 is hardcoded
```

**New pattern** — accept a `doubleClickSpeed` prop or read from localStorage:
```typescript
interface Props {
  icon: string;
  label: string;
  onOpen: () => void;
  iconSize?: "large" | "small";
  refreshTick?: number;
  doubleClickSpeed?: number;  // NEW — ms threshold, default 400
}

export default function DesktopIcon({
  icon, label, onOpen, iconSize = "large", refreshTick = 0, doubleClickSpeed = 400
}: Props) {
  // ...
  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      const now = Date.now();
      if (now - lastClick.current < doubleClickSpeed && lastClick.current > 0) {
        onOpen();
        lastClick.current = 0;
      } else {
        lastClick.current = now;
        setSelected(true);
      }
    },
    [onOpen, doubleClickSpeed],
  );
}
```

**DesktopShell can read mouse speed from localStorage and pass as prop:**
```typescript
const doubleClickSpeed = /* read from localStorage "desktop-mousespeed", parse int, default 400 */;
```

---

### `app/desktop/components/programs/ControlPanel.tsx` (component, CRUD)

**Analog:** `app/desktop/components/programs/ControlPanel.tsx` (lines 1–101, existing file)

**Nature of change:** Major expansion from 3 sections (Sound, Display, Accessibility) to 6 sections (Sound, Wallpaper Gallery, Color Scheme, Faux Resolution, Mouse Settings, Desktop Icons).

**Existing section pattern** (lines 38–44 — Win98 raised-border group box):
```typescript
<div style={{
  borderTop: "2px solid #808080",
  borderLeft: "2px solid #808080",
  borderRight: "2px solid #fff",
  borderBottom: "2px solid #fff",
  padding: 8, marginBottom: 12
}}>
  <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8 }}>Section Title</div>
  {/* section content */}
</div>
```

**Existing OK button** (lines 87–96):
```typescript
<button
  style={{
    background: "#c0c0c0",
    borderTop: "2px solid #fff", borderLeft: "2px solid #fff",
    borderRight: "2px solid #808080", borderBottom: "2px solid #808080",
    outline: "1px solid #000",
    padding: "4px 20px", fontSize: 12, cursor: "pointer", color: "#000",
  }}
  onClick={onClose}
>
  OK
</button>
```

**New Props interface** (extend current):
```typescript
interface Props {
  soundToggle: () => boolean;
  onClose: () => void;
  onWallpaperChange: (config: WallpaperState) => void;
  currentWallpaper: WallpaperState;
  colorScheme: string;
  onColorSchemeChange: (id: string) => void;
  doubleClickSpeed: number;
  onMouseSpeedChange: (ms: number) => void;
  visibleIcons: string[];
  onIconVisibilityChange: (ids: string[]) => void;
  // Plus faux resolution (purely display)
}
```

**Wallpaper import button pattern** (uses FileReader API):
```typescript
const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onloadend = () => {
    const dataUri = reader.result as string;
    try {
      localStorage.setItem(`imported-wallpaper-${Date.now()}`, dataUri);
      // Refresh wallpaper list to include new import
    } catch (err) {
      alert("Storage full. Remove some wallpapers first.");
    }
  };
  reader.readAsDataURL(file);
};
```

**Hidden file input pattern** (triggered by Import button):
```typescript
const fileInputRef = useRef<HTMLInputElement>(null);
// ...
<button onClick={() => fileInputRef.current?.click()}>Import...</button>
<input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  style={{ display: "none" }}
  onChange={handleImport}
/>
```

---

### `app/desktop/components/programs/InternetExplorer.tsx` (component, request-response) — NEW

**Analog:** `app/desktop/components/programs/FileExplorer.tsx` (lines 1–108) for structure, `PaintClone.tsx` for UI chrome pattern.

**Nature of change:** Create a new IE5/6-style browser component. This is a new file with no direct analog for the browser behavior, but the _component structure_ follows the existing program pattern.

**Component structure pattern** (from FileExplorer.tsx, lines 1–3, 48):
```typescript
"use client";

// imports

export default function InternetExplorer() {
  // state + handlers
  return (
    <div style={{ /* container fills window content area */ }}>
      {/* IE chrome: title area, address bar, iframe */}
    </div>
  );
}
```

**State management pattern** (research.md lines 258–265):
```typescript
import { useState, useRef, useCallback } from "react";

interface HistoryEntry {
  url: string;
  title?: string;
}

type NavAction = "back" | "forward" | "refresh" | "stop" | "home";

export default function InternetExplorer() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [address, setAddress] = useState("");
  const [currentUrl, setCurrentUrl] = useState("about:blank");
  const [history, setHistory] = useState<HistoryEntry[]>([{ url: "about:blank" }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);
```

**URL sanitization pattern** (from RESEARCH.md):
```typescript
function sanitizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed || trimmed === "about:blank") return "about:blank";
  if (/^(javascript|data|file|vbscript):/i.test(trimmed)) return null;
  const url = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    new URL(url);
    return url;
  } catch {
    return null;
  }
}
```

**UI Chrome Pattern** (IE5/6 style — use the Win98 raised border button pattern from ControlPanel.tsx lines 87–96 and PaintClone.tsx lines 109–113):
```typescript
// Address bar row:
<div style={{
  display: "flex", alignItems: "center", gap: 4, padding: "4px 6px",
  background: "#c0c0c0", borderBottom: "2px solid #808080",
  fontSize: 11, fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif',
}}>
  <span style={{ fontWeight: 700, marginRight: 4 }}>Address:</span>
  <input
    type="text"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    onKeyDown={(e) => { if (e.key === 'Enter') navigate(address); }}
    style={{
      flex: 1, padding: "2px 4px", fontSize: 11,
      borderTop: "2px solid #808080", borderLeft: "2px solid #808080",
      borderRight: "2px solid #fff", borderBottom: "2px solid #fff",
    }}
  />
  <button onClick={() => navigate(address)} style={win98BtnStyle}>Go</button>
</div>

// iframe:
<iframe
  ref={iframeRef}
  src={currentUrl}
  sandbox="allow-scripts allow-forms allow-same-origin"
  style={{ width: "100%", height: "100%", border: "none", background: "#fff" }}
  onLoad={handleIframeLoad}
  onError={handleIframeError}
/>

// Common Win98 button style (from ControlPanel.tsx):
const win98BtnStyle: React.CSSProperties = {
  background: "#c0c0c0",
  borderTop: "2px solid #fff", borderLeft: "2px solid #fff",
  borderRight: "2px solid #808080", borderBottom: "2px solid #808080",
  outline: "1px solid #000",
  padding: "2px 8px", fontSize: 11, cursor: "pointer", color: "#000",
};
```

**Nav buttons pattern** (use same win98BtnStyle):
```typescript
<div style={{ display: "flex", gap: 2, padding: "4px 6px", background: "#c0c0c0", borderBottom: "2px solid #808080" }}>
  <button onClick={() => handleNav("back")} style={win98BtnStyle} disabled={historyIndex <= 0}>◀</button>
  <button onClick={() => handleNav("forward")} style={win98BtnStyle} disabled={historyIndex >= history.length - 1}>▶</button>
  <button onClick={() => handleNav("refresh")} style={win98BtnStyle}>⟳</button>
  <button onClick={() => handleNav("stop")} style={win98BtnStyle}>✕</button>
  <button onClick={() => handleNav("home")} style={win98BtnStyle}>🏠</button>
  {loading && <span style={{ fontSize: 10, marginLeft: "auto", color: "#000" }}>Loading...</span>}
</div>
```

---

### `app/desktop/desktop.css` (stylesheet)

**Analog:** `app/desktop/desktop.css` (lines 1–474, existing file)

**Nature of change:** Add CSS variables for color scheme support. Replace hardcoded color values with `var()` + fallback defaults.

**Titlebar gradient** (lines 43–55) — replace hardcoded colors with CSS variables with defaults:
```css
.win98-titlebar {
  background: linear-gradient(90deg, var(--titlebar-start, #000080), var(--titlebar-end, #1084d0));
  /* rest unchanged */
}

.win98-titlebar-inactive {
  background: linear-gradient(90deg, var(--titlebar-inactive-start, #808080), var(--titlebar-inactive-end, #b4b4b4));
}
```

**Taskbar background** (line 90):
```css
.win98-taskbar {
  background: var(--taskbar-bg, #c0c0c0);
  /* rest unchanged */
}
```

**Start sidebar** (lines 148–159):
```css
.win98-start-sidebar {
  background: linear-gradient(180deg, var(--titlebar-start, #000080), #000000);
  /* rest unchanged */
}
```

**CSS variable declarations on `:root`** — add at top of file or let JS injection handle it:
```css
:root {
  --titlebar-start: #000080;
  --titlebar-end: #1084d0;
  --titlebar-inactive-start: #808080;
  --titlebar-inactive-end: #b4b4b4;
  --taskbar-bg: #c0c0c0;
}
```
(These act as defaults; JS injecting `style.setProperty()` on the desktop container overrides them.)

---

### `public/wallpapers/` (static asset directory) — NEW

**Analog:** None — purely a filesystem change.

**Pattern for new asset directories** — create with `.gitkeep`:
```
public/wallpapers/
  .gitkeep
```

**Usage in code:** Reference via path: `url(/wallpapers/filename.jpg)`. The static export serves `public/` files at the root.

---

## Shared Patterns

### Win98 Raised Border Group Box
**Source:** `app/desktop/components/programs/ControlPanel.tsx` (lines 38–44)
**Apply to:** ControlPanel section expansion, InternetExplorer chrome
```typescript
<div style={{
  borderTop: "2px solid #808080",
  borderLeft: "2px solid #808080",
  borderRight: "2px solid #fff",
  borderBottom: "2px solid #fff",
  padding: 8, marginBottom: 12
}}>
  <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8 }}>Section Title</div>
  {/* content */}
</div>
```

### Win98 Button Style
**Source:** `app/desktop/components/programs/ControlPanel.tsx` (lines 87–96)
**Apply to:** InternetExplorer nav buttons, ControlPanel buttons
```typescript
const win98BtnStyle: React.CSSProperties = {
  background: "#c0c0c0",
  borderTop: "2px solid #fff", borderLeft: "2px solid #fff",
  borderRight: "2px solid #808080", borderBottom: "2px solid #808080",
  outline: "1px solid #000",
  padding: "4px 20px", fontSize: 12, cursor: "pointer", color: "#000",
};
```

### localStorage Pattern (try-catch wrapper)
**Source:** RESEARCH.md (lines 152–168)
**Apply to:** All localStorage reads/writes in DesktopShell, ControlPanel, useWindowManager
```typescript
// Read:
const stored = (() => {
  try { return localStorage.getItem(KEY); }
  catch { return null; }
})();

// Write:
try { localStorage.setItem(KEY, value); }
catch (err) {
  if (err instanceof DOMException && err.name === "QuotaExceededError") {
    // Show user feedback
  }
}
```

### CSS Variable Injection via Ref
**Source:** RESEARCH.md (lines 218–227)
**Apply to:** DesktopShell (color scheme)
```typescript
const el = desktopRef.current;
if (!el || !scheme) return;
Object.entries(scheme.vars).forEach(([key, val]) => {
  el.style.setProperty(key, val);
});
```
The `<main>` element in DesktopShell gets `ref={desktopRef}`.

### Program Component Structure Pattern
**Source:** `app/desktop/components/programs/FileExplorer.tsx`, `PaintClone.tsx`, `AboutMeWindow.tsx`
**Apply to:** InternetExplorer (new component)
```typescript
"use client";

// Imports

export default function ProgramName() {
  // State and handlers

  return (
    <div style={{ /* fill available space */ fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif', color: "#000" }}>
      {/* Component UI */}
    </div>
  );
}
```

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `public/wallpapers/` | static asset directory | file-I/O | New directory — no existing wallpaper directory in the project |

## Metadata

**Analog search scope:** `app/desktop/`, `app/desktop/components/`, `app/desktop/components/programs/`, `app/desktop/hooks/`
**Files scanned:** 12
**Pattern extraction date:** 2026-07-10
