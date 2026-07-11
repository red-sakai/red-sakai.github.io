# Phase 4: Desktop Enhancements - Pattern Map

**Mapped:** 2026-07-11
**Files analyzed:** 5 (4 modified / 1 created)
**Analogs found:** 5 / 5

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `app/desktop/components/ContextMenu.tsx` | component | event-driven | existing `ContextMenu.tsx` (same file) | exact — rewrite with submenu hover |
| `app/desktop/components/DesktopShell.tsx` | component | event-driven + request-response | existing `DesktopShell.tsx` (same file) | exact — add state, icons, cases |
| `app/desktop/components/programs/InternetExplorer.tsx` | component | request-response + iframe | existing `InternetExplorer.tsx` (same file) | exact — fix closure + timer |
| `app/desktop/hooks/useWindowManager.ts` | hook/utility | CRUD | existing `useWindowManager.ts` (same file) | exact — expand type union |
| `app/desktop/components/programs/GameStation.tsx` | component | request-response + iframe | `PaintClone.tsx` + `InternetExplorer.tsx` | role-match (PaintClone) + data-flow-match (IE iframe) |

## Pattern Assignments

---

### `app/desktop/components/ContextMenu.tsx` (component, event-driven)

**Analog:** `app/desktop/components/ContextMenu.tsx` (existing, same file — rewrite with submenu support)

**Current structure to preserve** (lines 1-68):
The file is small (68 lines). Everything is relevant.

**Imports pattern** (lines 1-3):
```typescript
"use client";
import { useEffect, useRef, useCallback } from "react";
```
Add `useState` for `hoveredParent` tracking, keep existing imports.

**Interface pattern — preserve** (lines 5-12):
```typescript
export interface ContextMenuItem {
  label?: string;
  icon?: string;
  disabled?: boolean;
  separator?: boolean;
  children?: ContextMenuItem[];       // ← already typed for submenus
  action?: () => void;
}
```

**Props pattern — preserve** (lines 14-19):
```typescript
interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}
```

**Outside-click detection — preserve** (lines 26-34):
```typescript
useEffect(() => {
  const handler = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      close();
    }
  };
  window.addEventListener("mousedown", handler);
  return () => window.removeEventListener("mousedown", handler);
}, [close]);
```

**CSS classes already available** (from `desktop.css`):
- `.win98-context-menu` — root container (line 284)
- `.win98-context-item` — menu item row (line 299)
- `.win98-context-item:hover` — hover highlight (line 309)
- `.win98-context-item.disabled` — disabled state (line 314)
- `.win98-context-separator` — divider line (line 324)
- `.win98-context-icon` — icon span (line 330)
- `.win98-context-label` — label span (line 337)
- `.win98-context-arrow` — right arrow for submenu parents (line 341)
- `.win98-context-submenu` — submenu popup (line 347): positioned `position: absolute; left: 100%; top: -3px`

**Pattern to add: hover-to-open submenu** (from RESEARCH.md lines 389-425):
```typescript
const [hoveredParent, setHoveredParent] = useState<number | null>(null);
const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

const handleItemMouseEnter = useCallback((index: number, hasChildren: boolean) => {
  if (!hasChildren) return;
  if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  hoverTimerRef.current = setTimeout(() => {
    setHoveredParent(index);
  }, 150);
}, []);

const handleItemMouseLeave = useCallback((index: number) => {
  if (hoverTimerRef.current) {
    clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = null;
  }
  setHoveredParent((current) => current === index ? null : current);
}, []);
```

**Submenu rendering pattern** (from RESEARCH.md lines 413-424):
```typescript
{item.children && hoveredParent === i && (
  <div
    className="win98-context-submenu"
    onMouseEnter={() => { /* clear any close timer — keep open */ }}
    onMouseLeave={() => setHoveredParent(null)}
  >
    {item.children.map((child, ci) => (
      <div key={ci} className="win98-context-item" onClick={() => { ... }}>
        <span className="win98-context-label">{child.label}</span>
      </div>
    ))}
  </div>
)}
```

**Current render loop — replace** (lines 49-65):
Previous implementation skips submenu items entirely (`handleItemClick` returns early if `item.children`). New render loop must:
1. Render parent items with right arrow (`.win98-context-arrow`) when `item.children` exists
2. Attach `onMouseEnter`/`onMouseLeave` for hover-to-open
3. Render `.win98-context-submenu` div when `hoveredParent === i`

**Arrow indicator for submenu parents** (CSS class at line 341-344):
```css
.win98-context-arrow {
  margin-left: auto;
  font-size: 9px;
  padding-left: 12px;
}
```

---

### `app/desktop/components/DesktopShell.tsx` (component, event-driven + request-response)

**Analog:** `app/desktop/components/DesktopShell.tsx` (existing, same file — modify)

**DESKTOP_ICONS pattern — add `browser` and `games`** (lines 56-61):
```typescript
const DESKTOP_ICONS = [
  { id: "portfolio", icon: "🏠", label: "My Portfolio" },
  { id: "explorer", icon: "💻", label: "My Computer" },
  { id: "paint", icon: "🎨", label: "Paint" },
  { id: "controlpanel", icon: "⚙️", label: "Control Panel" },
  // ADD:
  { id: "browser", icon: <IE_ICON_SVG />, label: "Internet Explorer" },
  { id: "games", icon: "🎮", label: "Game Station" },
];
```
**Icon type note:** Existing icons are strings (emoji). For IE, use an inline SVG `<svg>` element — the `icon` prop in `DesktopIcon` accepts `string` but the component renders it as `{icon}` (ReactNode), so an SVG element works. For Game Station, an emoji string `"🎮"` matches the existing pattern.

**programList pattern — remove `about`** (lines 47-54):
```typescript
const programList = [
  // REMOVE: { id: "about", icon: "📄", label: "About Me" },
  { id: "portfolio", icon: "🏠", label: "My Portfolio" },
  { id: "explorer", icon: "📁", label: "File Explorer" },
  { id: "paint", icon: "🎨", label: "Paint" },
  { id: "controlpanel", icon: "⚙️", label: "Control Panel" },
  { id: "browser", icon: "🌐", label: "Internet Explorer" },
  // ADD:
  { id: "games", icon: "🎮", label: "Game Station" },
];
```

**handleOpenProgram — expand union** (lines 187-194):
```typescript
const handleOpenProgram = useCallback(
  (id: string) => {
    sounds.play("open");
    openWindow(id as "about" | "portfolio" | "explorer" | "paint" | "controlpanel" | "browser" | "games");
    //                                                                                              ^^^^^^^
    setStartOpen(false);
  },
  [sounds, openWindow],
);
```

**handleShutDown — add confirmation dialog** (lines 196-198):
Replace direct `router.push` with a confirmation flow:
```typescript
const [showShutDownDialog, setShowShutDownDialog] = useState(false);

const handleShutDown = useCallback(() => {
  setShowShutDownDialog(true);   // was: router.push("/grub-bootloader")
}, []);

const handleShutDownConfirm = useCallback(() => {
  setShowShutDownDialog(false);
  router.push("/grub-bootloader");
}, [router]);

const handleShutDownCancel = useCallback(() => {
  setShowShutDownDialog(false);
}, []);
```

**Shut Down dialog render pattern** (from RESEARCH.md lines 519-542):
Add inside the main return, before the closing `</main>`:
```typescript
{showShutDownDialog && (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 99999,
  }}>
    <div className="win98-window" style={{ width: 320, position: "relative" }}>
      <div className="win98-titlebar">
        <span>Shut Down</span>
      </div>
      <div style={{ padding: 16, textAlign: "center", color: "#000", fontSize: 11 }}>
        <p>Are you sure you want to shut down?</p>
        <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center" }}>
          <button className="win98-title-btn" style={{ padding: "4px 16px" }} onClick={handleShutDownConfirm}>OK</button>
          <button className="win98-title-btn" style={{ padding: "4px 16px" }} onClick={handleShutDownCancel}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
)}
```

**renderProgram — add `games` case** (lines 251-280):
```typescript
const renderProgram = (component: string): ReactNode => {
  switch (component) {
    case "explorer": return <FileExplorer />;
    case "paint": return <PaintClone />;
    case "controlpanel": return <ControlPanel ... />;
    case "portfolio": return <PortfolioViewer />;
    case "browser": return <InternetExplorer />;
    case "games": return <GameStation />;    // ← ADD
    default: return null;
  }
};
```

**Import to add** (alongside existing imports at lines 3-18):
```typescript
import GameStation from "./programs/GameStation";
```

**handleIconOpen — expand union** (lines 217-223):
```typescript
openWindow(id as "about" | "portfolio" | "explorer" | "paint" | "controlpanel" | "browser" | "games");
```

**contextItems — replace with full Win98 tree** (lines 213-215):
Replace the single-item array with the full context menu tree. `contextItems` is `ContextMenuItem[]` (which supports `children`). Pattern:
```typescript
const contextItems: ContextMenuItem[] = [
  {
    label: "View", icon: "▼",
    children: [
      { label: "Large Icons", icon: "◎", action: () => setIconLayout("large") },
      { label: "Small Icons", icon: "◎", action: () => setIconLayout("small") },
      { label: "List", icon: "☰", action: () => setIconLayout("list") },
      { label: "Details", icon: "📋", action: () => setIconLayout("details") },
    ],
  },
  {
    label: "Sort By", icon: "↕",
    children: [
      { label: "Name", action: () => sortIconsBy("name") },
      { label: "Size", action: () => sortIconsBy("size") },
      { label: "Type", action: () => sortIconsBy("type") },
      { label: "Date Modified", action: () => sortIconsBy("date") },
    ],
  },
  { separator: true },
  { label: "Refresh", icon: "⟳", action: handleRefresh },
  { label: "Paste", icon: "📋", disabled: true },
  {
    label: "New", icon: "✨",
    children: [
      { label: "Folder", icon: "📁", action: () => createNewFolder() },
      { label: "Text Document", icon: "📄", action: () => createNewTextFile() },
    ],
  },
  { separator: true },
  { label: "Properties", icon: "🔍", action: () => openPropertiesDialog() },
  { label: "Display Settings", icon: "🖥️", action: () => openDisplaySettings() },
];
```

---

### `app/desktop/components/programs/InternetExplorer.tsx` (component, request-response + iframe)

**Analog:** `app/desktop/components/programs/InternetExplorer.tsx` (existing, same file — fix stale closure + timer)

**Problem 1: Stale `historyIndex` closure** (lines 78-95, 151-169):
The `navigate` callback captures `historyIndex` from closure (dependency array line 94). The `handleIframeLoad` callback also captures it (line 169).

**Fix: Add refs + sync wrapper** (from RESEARCH.md lines 329-385):
```typescript
import { useState, useRef, useCallback } from "react";

// ADD refs for values needed in callbacks:
const historyIndexRef = useRef(0);
const loadingRef = useRef(false);

// ADD sync helper to keep ref in sync with state:
const setHistoryIndexAndRef = useCallback((n: number | ((prev: number) => number)) => {
  if (typeof n === "function") {
    setHistoryIndex((prev) => {
      const next = n(prev);
      historyIndexRef.current = next;
      return next;
    });
  } else {
    historyIndexRef.current = n;
    setHistoryIndex(n);
  }
}, []);
```

**Fixed `navigate`** (replace lines 78-95):
```typescript
const navigate = useCallback((rawUrl: string) => {
  const url = sanitizeUrl(rawUrl);
  if (!url) return;
  clearTimer();
  setAddress(url === "about:blank" ? "" : url);
  setCurrentUrl(url);
  setBlocked(false);
  loadingRef.current = true;
  setLoading(true);
  setHistory((prev) => [...prev.slice(0, historyIndexRef.current + 1), { url }]);
  setHistoryIndexAndRef((prev) => prev + 1);
  timerRef.current = setTimeout(() => {
    if (loadingRef.current) {        // ← check ref, not state
      setBlocked(true);
      setLoading(false);
    }
  }, 10000);
}, [clearTimer, setHistoryIndexAndRef]);  // ← no historyIndex!
```

**Fixed `handleIframeLoad`** (replace lines 151-169):
```typescript
const handleIframeLoad = useCallback(() => {
  loadingRef.current = false;
  setLoading(false);
  clearTimer();
  setBlocked(false);
  try {
    const title = iframeRef.current?.contentDocument?.title;
    if (title) {
      const idx = historyIndexRef.current;     // ← read from ref
      setHistory((prev) => {
        const updated = [...prev];
        if (updated[idx]) {
          updated[idx] = { ...updated[idx], title };
        }
        return updated;
      });
    }
  } catch { /* cross-origin */ }
}, [clearTimer]);  // ← no historyIndex!
```

**Fixed `handleNav` back/forward** (lines 97-149):
Replace direct `setHistoryIndex` calls with `setHistoryIndexAndRef`:
```typescript
case "back": {
  if (historyIndexRef.current > 0) {
    const idx = historyIndexRef.current - 1;
    setHistoryIndexAndRef(idx);
    const entry = history[idx];   // ← NOTE: `history` is still a closure issue here
    // ...
  }
  break;
}
```
**Note:** `handleNav` also has a stale `history` closure (line 148: `[history, historyIndex, navigate, clearTimer]`). Either add `history` to deps or use a ref for history too. Simplest approach: keep `history` in deps for `handleNav` but use `historyIndexRef.current` instead of `historyIndex`.

---

### `app/desktop/hooks/useWindowManager.ts` (hook/utility, CRUD)

**Analog:** `app/desktop/hooks/useWindowManager.ts` (existing, same file — expand type union)

**Type union expansion** (line 9):
```typescript
export interface WindowState {
  id: string;
  title: string;
  icon: string;
  component: "about" | "portfolio" | "explorer" | "paint" | "controlpanel" | "browser" | "games";
  //                                                                                          ^^^^^^^
  // ...
}
```

**`openWindow` offsets/titles/icons expansion** (lines 27-44):
```typescript
const offsets: Record<string, number> = {
  about: 0, portfolio: 15, explorer: 30, paint: 60, controlpanel: 90,
  browser: 45, games: 75,                                  // ← ADD games
};
const titleMap: Record<string, string> = {
  about: "About Me - Notepad",
  portfolio: "My Portfolio",
  explorer: "File Explorer",
  paint: "Paint",
  controlpanel: "Control Panel",
  browser: "Internet Explorer",
  games: "Game Station",                                    // ← ADD
};
const iconMap: Record<string, string> = {
  about: "📄",
  portfolio: "🏠",
  explorer: "📁",
  paint: "🎨",
  controlpanel: "⚙️",
  browser: "🌐",
  games: "🎮",                                              // ← ADD
};
```

---

### `app/desktop/components/programs/GameStation.tsx` (NEW — component, request-response + iframe)

**Primary Analog (role-match):** `app/desktop/components/programs/PaintClone.tsx` — same self-contained program component pattern (no external props besides what Window provides, uses inline styles, `"use client"`, `useState`/`useCallback`)

**Secondary Analog (data-flow-match):** `app/desktop/components/programs/InternetExplorer.tsx` — iframe embedding pattern (src, sandbox, loading state)

**PaintClone program pattern** (lines 1-132):
```typescript
"use client";
import { useRef, useState, useCallback, type MouseEvent } from "react";

export default function PaintClone() {
  // state management
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(2);

  // handlers
  const clearCanvas = useCallback(() => { ... }, []);

  return (
    <div style={{ display: "flex", height: "100%", fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif' }}>
      {/* UI content */}
    </div>
  );
}
```

**GameStation to follow same structure** (from RESEARCH.md lines 428-497):
```typescript
"use client";
import { useState } from "react";

interface DOSGame {
  id: string;
  title: string;
  archiveIdentifier: string;
  year: string;
}

const DOS_GAMES: DOSGame[] = [
  {
    id: "resident-evil",
    title: "Resident Evil (1996)",
    archiveIdentifier: "resident-evil_202406",
    year: "1996",
  },
];

export default function GameStation() {
  const [selectedGame, setSelectedGame] = useState<DOSGame | null>(null);

  if (selectedGame) {
    // Game view: back button + iframe to archive.org
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ padding: "4px 8px", background: "#c0c0c0", borderBottom: "1px solid #808080",
                      display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setSelectedGame(null)} style={...}>← Back</button>
          <span style={{ fontSize: 11 }}>{selectedGame.title}</span>
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          <iframe
            src={`https://archive.org/embed/${selectedGame.archiveIdentifier}`}
            style={{ width: "100%", height: "100%", border: "none" }}
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
            allowFullScreen
            title={selectedGame.title}
          />
        </div>
      </div>
    );
  }

  // Game list view
  return (
    <div style={{ padding: 8 }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#000" }}>
        Game Station
      </div>
      <div style={{ fontSize: 11, marginBottom: 12, color: "#666" }}>
        Select a DOS game to play via archive.org emulation.
      </div>
      {DOS_GAMES.map((game) => (
        <button key={game.id} onClick={() => setSelectedGame(game)} style={{
          display: "block", width: "100%", textAlign: "left", padding: "6px 8px",
          background: "#c0c0c0", border: "1px solid #808080", marginBottom: 4,
          cursor: "pointer", fontSize: 11, color: "#000",
          fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif',
        }}>
          <span style={{ fontWeight: 700 }}>{game.title}</span>
          <span style={{ marginLeft: 8, color: "#666" }}>({game.year})</span>
        </button>
      ))}
    </div>
  );
}
```

**Key patterns to borrow from PaintClone.tsx:**
- `"use client"` directive (line 1)
- Inline Win98 button styles using the standard bevel pattern (lines 108-113):
  ```typescript
  const btnStyle: React.CSSProperties = {
    background: "#c0c0c0",
    borderTop: "2px solid #fff",
    borderLeft: "2px solid #fff",
    borderRight: "2px solid #808080",
    borderBottom: "2px solid #808080",
    outline: "1px solid #000",
    padding: "2px 8px",
    fontSize: 11,
    cursor: "pointer",
    color: "#000",
    fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif',
  };
  ```
  (From InternetExplorer.tsx lines 12-24 — use as the canonical Win98 button style)

**Key patterns to borrow from InternetExplorer.tsx (iframe):**
- `sandbox` attribute: `"allow-scripts allow-forms allow-same-origin allow-popups"` (GameStation needs `allow-popups` for fullscreen)
- Iframe fill pattern: `style={{ width: "100%", height: "100%", border: "none" }}`
- Loading/blocked states (optional): can match IE's pattern for showing a loading indicator while the archive.org page loads

---

## Shared Patterns

### Win98 Button Style
**Source:** `app/desktop/components/programs/InternetExplorer.tsx` lines 12-24
**Apply to:** GameStation.tsx buttons, ContextMenu.tsx submenu items (if needed)
```typescript
const btnStyle: React.CSSProperties = {
  background: "#c0c0c0",
  borderTop: "2px solid #fff",
  borderLeft: "2px solid #fff",
  borderRight: "2px solid #808080",
  borderBottom: "2px solid #808080",
  outline: "1px solid #000",
  padding: "2px 6px",
  fontSize: 11,
  cursor: "pointer",
  color: "#000",
  fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif',
};
```

### Win98 Font Stack
**Source:** `app/desktop/components/DesktopShell.tsx` line 349
**Apply to:** All desktop components
```typescript
fontFamily: '"MS Sans Serif", "Chicago", "Segoe UI", sans-serif';
```

### "use client" Directive
**Source:** Every interactive component
**Apply to:** All files (ContextMenu.tsx, DesktopShell.tsx, InternetExplorer.tsx, GameStation.tsx)
```typescript
"use client";
```

### Package Import Pattern
**Source:** `app/desktop/components/DesktopShell.tsx` lines 3-18
**Apply to:** GameStation.tsx (new file)
```typescript
import { useState, useCallback } from "react";
// or for more complex:
import { useState, useRef, useCallback, type ReactNode } from "react";
```

### Inline Style Over Module CSS
**Source:** All program components (PaintClone, FileExplorer, InternetExplorer, PortfolioViewer, AboutMeWindow)
**Apply to:** GameStation.tsx (new file)
The desktop components use React inline `style={{}}` objects rather than Tailwind classes for the Win98 chrome. Tailwind is used sparingly in the portfolio-facing pages but desktop programs exclusively use inline styles.

### Desktop Icon Pattern (for IE pixel-art icon)
**Source:** `app/desktop/components/DesktopIcon.tsx` lines 15-88
**Apply to:** The `icon` field in `DESKTOP_ICONS` entries
Existing icons are emoji strings. The IE icon should be an inline SVG component:
```typescript
// In DesktopShell.tsx (as a module-scope const or within the file):
const IE_ICON = (
  <svg width="36" height="36" viewBox="0 0 36 36" style={{ display: "block" }}>
    <circle cx="18" cy="18" r="16" fill="#1a8cdb" />
    <ellipse cx="18" cy="18" rx="12" ry="8" fill="#fff" />
    <text x="18" y="23" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1a8cdb" fontFamily="Arial">e</text>
  </svg>
);

// In DESKTOP_ICONS:
{ id: "browser", icon: IE_ICON, label: "Internet Explorer" }
```

### Window State Type Union Expansion Pattern
**Source:** `app/desktop/hooks/useWindowManager.ts`
**Apply to:** All places in DesktopShell.tsx that cast string literals
The pattern is to add `"games"` (and `"browser"` if missing) to:
1. `WindowState.component` union type in useWindowManager.ts
2. `handleOpenProgram` cast in DesktopShell.tsx
3. `handleIconOpen` cast in DesktopShell.tsx
4. `offsets`/`titleMap`/`iconMap` in useWindowManager.ts

---

## No Analog Found

All 5 files have close matches in the codebase. No new patterns needed from RESEARCH.md beyond what's already extracted above.

| File | Role | Data Flow | Analog | Reason |
|------|------|-----------|--------|--------|
| `app/desktop/components/programs/GameStation.tsx` | component | request-response + iframe | PaintClone (role) + InternetExplorer (iframe) | GameStation is a simple program component — PaintClone has the closest structure. IE provides the iframe embedding pattern |

## Metadata

**Analog search scope:** `app/desktop/components/`, `app/desktop/components/programs/`, `app/desktop/hooks/`
**Files scanned:** 12 (all components, all programs, hooks, CSS)
**Pattern extraction date:** 2026-07-11
