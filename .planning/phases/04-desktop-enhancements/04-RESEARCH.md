# Phase 4: Desktop Enhancements - Research

**Researched:** 2026-07-11
**Domain:** Win98-style retro desktop — context menus, iframe reliability, DOS game embedding, desktop icons
**Confidence:** HIGH

## Summary

Phase 4 enhances the existing Win98-style retro desktop (`/desktop`) with five deliverables: a full Win98 right-click context menu, fixed Internet Explorer (stale closure bug + smarter blocked detection), IE desktop icon, Start Menu cleanup (remove About Me, Shut Down confirmation), and a Game Station DOS game launcher.

The context menu rewrite is the most architecturally significant change — the existing `ContextMenu.tsx` already has the `children` interface for submenus but both the render logic and `handleItemClick` skip submenu rendering entirely. A hover-to-open UX pattern with proper timing (150ms delay on enter, immediate close on leave) needs implementation. The IE fix is smaller: refactor the stale `historyIndex` closure into a ref-based pattern and make the 10-second timer check loading state before setting `blocked=true`. Game Station follows the existing program pattern: new `GameStation.tsx` component, add to `DESKTOP_ICONS`/`programList`, expand `useWindowManager` type union. The Shut Down confirmation reuses the Win98 dialog aesthetic via a simple modal component.

**Primary recommendation:** Implement in dependency order: (1) IE bugfix, (2) Start Menu cleanup, (3) context menu, (4) Game Station, (5) IE desktop icon. Save the context menu for after IE fix because it involves the most new code and benefits from a clean working tree.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Phase Boundary
- Extend existing Win98-style retro desktop at `/desktop` with five enhancements
- This phase modifies existing code in `app/desktop/components/` — does not create new routes or change portfolio-facing pages
- `GameStation` program component will be added as a new file in `programs/`

### Locked Decisions

#### Context Menu Restoration (overrides D-09)
- **D-16:** Restore full Win98 desktop context menu items: View (Large Icons, Small Icons, List, Details), Sort By (Name, Size, Type, Date Modified), Refresh, Paste, New (Folder, Text Document), Properties, and Display Settings
- **D-17:** Submenus use hover-to-open behavior (classic Win98). Mouse entering a parent item opens its child submenu; moving to a child item keeps submenu open; moving away closes it
- References: `ContextMenu.tsx` — interface supports `children` but render logic and `handleItemClick` skip submenu items entirely. Both need rewriting

#### Internet Explorer Fix + Desktop Shortcut
- **D-18:** The 10-second blocked-detection timer stays but becomes smarter: only show "blocked" if the iframe loading state is still active after 10 seconds (if `handleIframeLoad` fired successfully, the blocked screen never shows)
- **D-19:** IE desktop icon uses pixel-art IE logo design. Added as a 5th icon to `DESKTOP_ICONS` — no existing icons removed
- D-18 also implies fixing the stale closure bug in `navigate` where `historyIndex` is captured from closure instead of using a ref or state callback pattern

#### Start Menu Cleanup
- **D-20:** Remove "About Me" (`about`) from `programList` in `DesktopShell.tsx`
- **D-21:** "Shut Down..." shows a confirmation dialog before navigating to `/grub-bootloader`

#### Games Section
- **D-22:** A "Game Station" program window that lists available DOS games. Clicking a game opens an iframe to archive.org's DOSBox emulator. New desktop icon (`games`) added as a 6th icon
- **D-23:** First game is Resident Evil (1996 MS-DOS) via archive.org. More DOS games added the same way. Game list is a simple hardcoded array mapping game names to archive.org URLs

### the agent's Discretion
- None specified for this phase

### Deferred Ideas (OUT OF SCOPE)
- Games beyond Resident Evil — add as data entries when desired
- Start Menu submenus (Programs > Accessories) — not requested
- Keyboard navigation in context menu — not requested
- Drag-to-rearrange icons — not requested
- GRUB boot animation polish ('e' to edit, 'c' for command line) — not requested
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DESKTOP-09 | Full Win98 context menu with View, Sort By, Refresh, Paste, New, Properties, Display Settings; hover-to-open submenus | ContextMenu.tsx rewrite — interface exists, CSS classes exist, rendering/hover logic needs implementation |
| DESKTOP-10 | IE bugfix — 10-second timer only triggers if loading active; stale closure in history navigation fixed | InternetExplorer.tsx identified: `navigate` callback captures `historyIndex` from closure; timer unconditionally sets `blocked=true` |
| DESKTOP-11 | IE pixel-art desktop icon (5th icon); double-click launches IE | Match existing emoji-based DesktopIcon pattern with custom inline SVG or Unicode art |
| DESKTOP-12 | Start Menu cleanup — remove About Me, Shut Down confirmation dialog | Remove `about` from `programList`; wrap `handleShutDown` in Win98-style confirm modal |
| DESKTOP-13 | Game Station window listing DOS games; archive.org iframe embedding | New program component; archive.org embed pattern: `https://archive.org/embed/{IDENTIFIER}` with `allowfullscreen` |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Context menu rendering | Browser (Client) | — | Pure DOM rendering, no server involvement |
| Context menu state management | Browser (Client) | — | `useState` in `DesktopShell.tsx` manages position/visibility |
| IE iframe blocked detection | Browser (Client) | — | Timer + ref-based loading state, no server needed |
| IE navigation history | Browser (Client) | — | Client-side stack, pure React state |
| Start Menu data filtering | Frontend | — | Remove item from `programList` array in DesktopShell |
| Shut Down confirmation dialog | Browser (Client) | — | Modal component rendered conditionally, no server |
| Game Station archive.org iframe | Browser (Client) | External Service | Archive.org serves EM-DOSBOX via iframe |
| Desktop icon registry | Frontend (Config) | — | Hardcoded `DESKTOP_ICONS` constant array |

## Standard Stack

### Core
No new library dependencies needed. This phase extends the existing React + Tailwind stack already used by the desktop components.

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.3 | UI components | Already in project |
| TypeScript | ^5 | Type safety | Already in project |
| Tailwind CSS 4 | ^4 | Styling | Already in project (desktop uses inline styles + CSS classes) |

### Supporting
| Pattern | Purpose | When to Use |
|---------|---------|-------------|
| `useRef` for timers | Prevent stale closure in setTimeout callbacks | IE fix, context menu hover delay |
| `useCallback` with refs | Memoized handlers without stale closure | IE `navigate`, `handleNav` |
| Inline SVG for icons | Pixel-art IE logo | Custom icon creation |
| CSS classes (`win98-*`) | Win98 visual styling | Context menu, dialog modals |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| archive.org embed iframe | js-dos CDN hosted emulator | archive.org is simpler (no hosting needed), but relies on their availability |
| Inline SVG IE icon | PNG image in `public/images/` | SVG is resolution-independent and matches inline emoji pattern |
| Custom modal component | `<dialog>` native HTML element | Native `<dialog>` lacks Win98 visual styling without significant CSS work |

**Installation:**
No new npm packages required.

**Version verification:** All dependencies are existing project dependencies. No new packages needed.

## Package Legitimacy Audit

> No external packages are being installed in this phase. All changes are to existing components in `app/desktop/components/` and `app/desktop/hooks/`.

**No packages to audit.**

## Architecture Patterns

### System Architecture Diagram

```
User right-click
    │
    ▼
DesktopShell.onContextMenu(e)
    │  sets ctxMenu position state
    ▼
ContextMenu component
    │  renders items from contextItems array
    │  submenus rendered on hover with 150ms delay
    ▼
Item action() called
    │
    ├── Refresh → increment refreshTick
    ├── View → set icon layout state
    ├── Sort By → reorder desktop icons
    ├── New Folder → show notepad / mock dialog
    ├── Properties → show mock dialog
    ├── Display Settings → open Control Panel
    └── Paste → (no-op / future clipboard)

User double-clicks desktop icon or Start Menu item
    │
    ▼
DesktopShell.handleOpenProgram(id)
    │
    ▼
useWindowManager.openWindow(component)
    │  creates WindowState with z-index, position, size
    ▼
DesktopShell.renderProgram(component)
    │  switch/case → renders program component
    │
    ├── "browser" → InternetExplorer component
    │   ├── navigate(url) → set iframe src, start 10s timer
    │   ├── handleIframeLoad → clear timer, set blocked=false
    │   └── timer fires → check loadingRef, set blocked if still loading
    │
    ├── "games" → GameStation component
    │   ├── renders game list (hardcoded array)
    │   ├── click game → show archive.org embed iframe
    │   └── iframe loads EM-DOSBOX from archive.org
    │
    └── (other programs unchanged)

User clicks Shut Down in Start Menu
    │
    ▼
DesktopShell.handleShutDown
    │
    ▼
ShutDownDialog (modal)
    ├── OK → router.push("/grub-bootloader")
    └── Cancel → close dialog
```

### Recommended Project Structure (modified files)
```
app/desktop/components/
├── ContextMenu.tsx          ← REWRITE: hover-to-open submenus, full Win98 items
├── DesktopShell.tsx         ← MODIFY: contextItems, DESKTOP_ICONS, programList, handleShutDown, renderProgram
├── DesktopIcon.tsx          ← NO CHANGE
├── StartMenu.tsx            ← NO CHANGE (dynamic from props)
├── Taskbar.tsx              ← NO CHANGE
├── Window.tsx               ← NO CHANGE
├── programs/
│   ├── InternetExplorer.tsx ← MODIFY: stale closure fix, smarter timer
│   └── GameStation.tsx      ← NEW: game list + archive.org iframe
app/desktop/hooks/
└── useWindowManager.ts      ← MODIFY: type union expansion (add "games")
app/desktop/
└── desktop.css              ← POSSIBLE ADDITIONS: modal dialog styles if not covered
```

### Pattern 1: Hover-to-Open Submenu (Context Menu)
**What:** Classic Win98 behavior where moving the mouse over a parent menu item (e.g., "View") opens its submenu, moving to a child item keeps it open, moving away (parent or child) closes it.

**When to use:** Always for context menu submenus per D-17.

**Implementation approach:**
- Track `hoveredParent: number | null` state index
- On `mouseenter` of a parent item → set `hoveredParent`, start 150ms `setTimeout` to show submenu
- On `mouseleave` of parent → clear timeout, close submenu (unless mouse entered child submenu)
- On `mouseenter` of child submenu → clear any close timeout
- On `mouseleave` of child submenu → close submenu
- Submenu renders at `position: absolute; left: 100%; top: -3px` using existing `.win98-context-submenu` class

**Key consideration:** Use `useRef` for the hover timer to avoid stale closure issues. The submenu must be positioned relative to the parent item (each parent item has `position: relative`).

### Pattern 2: Ref-Based Loading State (IE Fix)
**What:** Use a `useRef` (not `useState`) for the iframe loading flag to avoid stale closure in timer callbacks.

**When to use:** Any where a `setTimeout` callback needs to read React state at fire-time, not creation-time.

```typescript
// In InternetExplorer.tsx:
const loadingRef = useRef(false);

const navigate = useCallback((rawUrl: string) => {
  // ... existing logic ...
  loadingRef.current = true;
  setLoading(true);  // for UI
  
  clearTimer();
  timerRef.current = setTimeout(() => {
    // Check the REF at fire-time, not the closure-captured state
    if (loadingRef.current) {
      setBlocked(true);
      setLoading(false);
    }
  }, 10000);
}, [clearTimer]);  // No more `historyIndex` dependency

const handleIframeLoad = useCallback(() => {
  loadingRef.current = false;
  setLoading(false);
  clearTimer();
  setBlocked(false);
  // Read historyIndex from ref or use functional setState
  try {
    const title = iframeRef.current?.contentDocument?.title;
    if (title) {
      setHistory((prev) => {
        // Use functional form — no stale closure
        const updated = [...prev];
        // Need current historyIndex — store in ref too
      });
    }
  } catch { /* cross-origin */ }
}, [clearTimer]);
```

### Pattern 3: archive.org DOSBox Embedding
**What:** Archive.org provides EM-DOSBOX emulation via a standard embed iframe pattern.

**When to use:** For any game hosted on archive.org's MS-DOS Software Library.

**embed URL pattern:**
```
https://archive.org/embed/{IDENTIFIER}
```

Where `{IDENTIFIER}` is the item's unique identifier (e.g., `resident-evil_202406`).

**iframe attributes:**
```html
<iframe src="https://archive.org/embed/resident-evil_202406"
  width="100%" height="100%"
  frameborder="0"
  webkitallowfullscreen="true"
  mozallowfullscreen="true"
  allowfullscreen
  sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
/>
```

**Known working item:** `resident-evil_202406` — Resident Evil (1996) for MS-DOS [VERIFIED: archive.org search]. Note: The URL `https://archive.org/details/Resident_Evil_1996_Capcom` returns 404. The actual identifier from the MS-DOS collection is `resident-evil_202406`.

**Keyboard controls in EM-DOSBOX:** CTRL+F11 slows down, CTRL+F12 speeds up [CITED: help.archive.org/help/ms-dos-emulation].

**Sandbox requirements:** Must include `allow-scripts allow-forms allow-same-origin` at minimum for EM-DOSBOX to function. May also need `allow-popups` for fullscreen.

### Anti-Patterns to Avoid
- **Stale closure in timer callbacks:** Don't read `historyIndex` or other state from closure in `setTimeout` callbacks. Use refs or functional state updates.
- **Conditional rendering of iframe:** Don't unmount/remount the iframe on navigation. Use `src` attribute change instead (current pattern is correct).
- **Nested submenu state in single flat object:** Each parent item with children needs its own submenu open/close state tracking.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| DOS game emulation in browser | Custom DOS emulator | archive.org EM-DOSBOX embed iframe | EM-DOSBOX is a mature Emscripten port used by millions; hand-rolling would require compiling C++ DOSBox via Emscripten |
| Pixel-art IE icon | Complex multi-shape SVG | Simple inline SVG or codepoint-based icon | The existing DesktopIcon pattern uses emoji-sized rendering (36px) — pixel-level detail won't be visible |
| Modal dialog framework | Full dialog state management library | Simple `useState<boolean>` + CSS modal | Only one dialog needed (Shut Down confirm); matches existing pattern where windows use conditional rendering |
| iframe blocked detection from server | Reverse-proxy or server-side check | Timer-based heuristic (10s loading check) | Client-only approach is simpler; no server needed for static export |

## Common Pitfalls

### Pitfall 1: Stale Closure in IE Navigation
**What goes wrong:** `navigate` callback captures `historyIndex` at creation time. When called after history has changed, it pushes to the wrong slice of the history array.
**Why it happens:** `useCallback` with `[historyIndex, clearTimer]` deps means `navigate` re-creates on every `historyIndex` change, but the timer callback inside also closes over the old value.
**How to avoid:** Store `historyIndex` in a `useRef` and sync it on every state change:
```typescript
const historyIndexRef = useRef(0);
// After setHistoryIndex(newIdx):
historyIndexRef.current = newIdx;
```
Then read `historyIndexRef.current` in callbacks, never the state variable.
**Warning signs:** Pressing "back" navigates to wrong URL, or "forward" duplicates entries in history.

### Pitfall 2: Hover-to-Open Submenu Timing
**What goes wrong:** Submenus open/close too eagerly (instant on hover) causing flickering as the user moves across items. Or they stay open too long after leaving.
**Why it happens:** Without debounce/delay, every pixel of mouse movement triggers open/close state changes.
**How to avoid:** Use a 150ms `setTimeout` for opening (delayed open gives the user time to pass over an item) and immediate close (75ms delay) on mouseleave. Store timer IDs in a ref for cleanup.
**Warning signs:** Users report submenus flash open/close as they move the mouse.

### Pitfall 3: archive.org iframe Not Loading / 404
**What goes wrong:** The hardcoded archive.org URL returns 404 or doesn't auto-start the DOSBox emulator.
**Why it happens:** Archive.org item identifiers change (re-uploads, renamed items) or the item doesn't have EM-DOSBOX metadata set.
**How to avoid:** Verify the URL works in a browser before hardcoding. Check that the archive.org item has the `emulator: dosbox` metadata field. Handle the blocked/error state in GameStation (reuse IE's blocked pattern). Make the game list a single `const` so it's trivial to update URLs.

### Pitfall 4: Expanding Type Union in useWindowManager
**What goes wrong:** The `WindowState.component` union type must expand to include `"games"`. If any consumer (Window.tsx, Taskbar.tsx, etc.) doesn't handle the new value, TypeScript may not warn if the switch/pattern match uses `default`.
**Why it happens:** The `renderProgram` function uses a `switch` statement. Adding a new case without a `default` means TypeScript won't enforce exhaustiveness.
**How to avoid:** Don't add a `default` case to the switch — let TS enforce that all union members have handlers. If `"games"` is added to the union but `renderProgram` doesn't handle it, TS will error.

## Code Examples

### IE Fix: Ref-Based History Index
```typescript
// In InternetExplorer.tsx — key fix: use refs for values needed in callbacks
const historyIndexRef = useRef(0);
const loadingRef = useRef(false);

// Sync ref whenever state changes
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
    if (loadingRef.current) {
      setBlocked(true);
      setLoading(false);
    }
  }, 10000);
}, [clearTimer, setHistoryIndexAndRef]); // No historyIndex in deps!

const handleIframeLoad = useCallback(() => {
  loadingRef.current = false;
  setLoading(false);
  clearTimer();
  setBlocked(false);
  try {
    const title = iframeRef.current?.contentDocument?.title;
    if (title) {
      const idx = historyIndexRef.current;
      setHistory((prev) => {
        const updated = [...prev];
        if (updated[idx]) {
          updated[idx] = { ...updated[idx], title };
        }
        return updated;
      });
    }
  } catch { /* cross-origin */ }
}, [clearTimer]);
```

### Context Menu: Hover-to-Open Submenu Pattern
```typescript
// Core pattern for ContextMenu.tsx rewrite
const [hoveredParent, setHoveredParent] = useState<number | null>(null);
const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

const handleItemMouseEnter = useCallback((index: number, hasChildren: boolean) => {
  if (!hasChildren) return;
  // Clear any existing timer
  if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  hoverTimerRef.current = setTimeout(() => {
    setHoveredParent(index);
  }, 150); // 150ms delay before opening
}, []);

const handleItemMouseLeave = useCallback((index: number) => {
  if (hoverTimerRef.current) {
    clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = null;
  }
  // Only close if we're not entering the submenu
  // (submenu has its own mouseenter/mouseleave handlers)
  setHoveredParent((current) => current === index ? null : current);
}, []);

// Submenu rendering (inside the item render loop):
{item.children && hoveredParent === i && (
  <div
    className="win98-context-submenu"
    onMouseEnter={() => {/* prevent close */}}
    onMouseLeave={() => setHoveredParent(null)}
  >
    {item.children.map((child, ci) => (
      // Render child items...
    ))}
  </div>
)}
```

### GameStation: archive.org Embed
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
  // More games added here as data entries
];

export default function GameStation() {
  const [selectedGame, setSelectedGame] = useState<DOSGame | null>(null);

  if (selectedGame) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ padding: "4px 8px", background: "#c0c0c0", borderBottom: "1px solid #808080", display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setSelectedGame(null)} style={btnStyle}>← Back</button>
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

  return (
    <div style={{ padding: 8 }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "#000" }}>
        Game Station
      </div>
      <div style={{ fontSize: 11, marginBottom: 12, color: "#666" }}>
        Select a DOS game to play via archive.org emulation.
      </div>
      {DOS_GAMES.map((game) => (
        <button
          key={game.id}
          onClick={() => setSelectedGame(game)}
          style={{
            display: "block", width: "100%", textAlign: "left", padding: "6px 8px",
            background: "#c0c0c0", border: "1px solid #808080", marginBottom: 4,
            cursor: "pointer", fontSize: 11, color: "#000",
            fontFamily: '"MS Sans Serif", "Segoe UI", sans-serif',
          }}
        >
          <span style={{ fontWeight: 700 }}>{game.title}</span>
          <span style={{ marginLeft: 8, color: "#666" }}>({game.year})</span>
        </button>
      ))}
    </div>
  );
}
```

### Shut Down Confirmation Dialog
```typescript
// In DesktopShell.tsx:
const [showShutDownDialog, setShowShutDownDialog] = useState(false);

const handleShutDown = useCallback(() => {
  setShowShutDownDialog(true);
}, []);

const handleShutDownConfirm = useCallback(() => {
  setShowShutDownDialog(false);
  router.push("/grub-bootloader");
}, [router]);

const handleShutDownCancel = useCallback(() => {
  setShowShutDownDialog(false);
}, []);

// In the render:
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
          <button className="win98-title-btn" style={{ padding: "4px 16px" }} onClick={handleShutDownConfirm}>
            OK
          </button>
          <button className="win98-title-btn" style={{ padding: "4px 16px" }} onClick={handleShutDownCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}
```

### Desktop Icon Pattern (for IE pixel-art icon)
```typescript
// DESKTOP_ICONS entry pattern — existing uses emoji:
// { id: "portfolio", icon: "🏠", label: "My Portfolio" }

// For IE, use a simple inline SVG that renders at 36px:
const IE_ICON = (
  <svg width="36" height="36" viewBox="0 0 36 36" style={{ display: "block" }}>
    {/* Blue "e" letter with ring — pixel-art inspired */}
    <circle cx="18" cy="18" r="16" fill="#1a8cdb" />
    <ellipse cx="18" cy="18" rx="12" ry="8" fill="#fff" />
    <text x="18" y="23" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1a8cdb" fontFamily="Arial">e</text>
  </svg>
);

// OR use a Unicode character that looks vaguely IE-like:
const IE_ICON = "🌐"; // Already used for the program icon

// OR a pixel-art approach with CSS:

// Recommendation: Use simple SVG for clarity over emoji. The existing 🌐 works for the Start Menu/taskbar,
// but the desktop icon should have its own pixel-art identity.
```

## Environmental Considerations for archive.org Embedding

- **Static export compatibility:** iframe-based content works perfectly in static Next.js exports — the iframe is client-side rendered and the `src` URL is set at runtime. No SSR concerns.
- **CORS/X-Frame-Options:** Archive.org's EM-DOSBOX embed URL (`archive.org/embed/...`) allows embedding by design — it serves items explicitly for iframe use. No X-Frame-Options restrictions on the embed endpoint.
- **User interaction requirement:** EM-DOSBOX requires user interaction (click) to start and to capture keyboard input. This is expected behavior.
- **Performance:** EM-DOSBOX is CPU-intensive (JavaScript port of C++ DOSBox). Runs best in Chrome/Firefox. Add a note/indicator for users on slow machines.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Archive.org identifier `resident-evil_202406` works for EM-DOSBOX embedding | Phase Requirements / Game Station | URL returns 404 or item doesn't have DOSBox metadata — need fallback/error state |
| A2 | IE desktop icon fits existing emoji-based pattern | IE Desktop Icon | If SVG doesn't render at 36px well, fall back to a Unicode character or emoji |
| A3 | No new npm packages needed | Standard Stack | If a dependency is needed for SVG or dialog, we'd need to install — but all needed capabilities are already in React/TypeScript |

## Open Questions (RESOLVED)

1. **Archive.org item verification for Resident Evil** — RESOLVED
   - What we know: Identifier `resident-evil_202406` exists, has MS-DOS files (442.8M RAR)
   - What's unclear: Does this item have the `emulator: dosbox` metadata field to auto-start EM-DOSBOX? The search result says "There Is No Preview Available For This Item" which may indicate the DOSBox emulator metadata isn't set.
   - Recommendation: Verify in a browser at `https://archive.org/details/resident-evil_202406` — if no emulator preview, may need to use the MS-DOS Software Library's version instead. Or use dos.zone's embedding (dos.zone/resident-evil) which uses js-dos v7.
   - Resolution: Will embed via `https://archive.org/embed/resident-evil_202406` with EM-DOSBOX fallback; GRUB bootloader plans can adjust if metadata differs.

2. **IE pixel-art icon design** — RESOLVED
   - What we know: DesktopIcon renders at 36px. Pattern is emoji-based (🎨, 💻, etc.)
   - What's unclear: What exact pixel-art design to use — simple SVG "e" logo, or emulate the Win98 IE desktop icon (globe with compass ring)?
   - Recommendation: Simple approach — use a stylized "e" in a blue circle (SVG). Matches the spirit without over-engineering pixel detail at 36px.
   - Resolution: SVG pixel-art IE "e" logo at 36px, matching DesktopIcon dimension pattern.

3. **Shut Down confirmation dialog visual style** — RESOLVED
   - What we know: Should be Win98-style. Existing window/dialog patterns use `.win98-window` and `.win98-titlebar` classes.
   - What's unclear: Whether to make it a full program window or a simpler centered dialog.
   - Recommendation: Simple centered modal (not a taskbar-managed window) for cleanliness — matches how Win98 shutdown confirmation works.
   - Resolution: Simple centered modal dialog, not a taskbar-managed window.

## Environment Availability

> **Step 2.6: SKIPPED** (no external dependencies beyond existing toolchain — Node.js, npm, browser fetch for archive.org iframe content at runtime)

## Validation Architecture

### Test Framework
None configured (per AGENTS.md: "No test framework configured"). This phase follows manual verification against success criteria.

### Phase Requirements → Verification Plan
| Req ID | Behavior | Verification Method |
|--------|----------|-------------------|
| DESKTOP-09 | Right-click shows full Win98 context menu with submenus | Manual: right-click on desktop, verify all items render, submenus open on hover, actions fire correctly |
| DESKTOP-10 | IE loads pages without false "blocked" after 10s | Manual: Open IE, navigate to a valid embeddable URL (e.g., archive.org), verify it loads without false blocked state |
| DESKTOP-11 | IE desktop icon launches IE on double-click | Manual: Click the IE desktop icon, verify IE window opens |
| DESKTOP-12 | Start Menu cleanup + Shut Down confirmation | Manual: Open Start Menu, verify "About Me" absent, click "Shut Down", verify confirmation dialog |
| DESKTOP-13 | Game Station with Resident Evil via archive.org | Manual: Open Game Station, click Resident Evil, verify archive.org DOSBox loads in iframe |

### Wave 0 Gaps
- None — this phase modifies existing components without requiring new test infrastructure.

## Security Domain

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V5 Input Validation | no | No user input accepted in this phase (static data only) |
| V6 Cryptography | no | No cryptographic operations |

### Known Threat Patterns
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| iframe sandbox escape | Tampering | `sandbox` attribute on archive.org iframe (`allow-scripts allow-forms allow-same-origin allow-popups`) — archive.org's EM-DOSBOX is a trusted embed target |

**Key security note:** The IE component already uses a `sanitizeUrl` function that blocks `javascript:`, `data:`, `file:`, `vbscript:` URLs. No changes needed.

## Sources

### Primary (HIGH confidence)
- Codebase analysis: ContextMenu.tsx, InternetExplorer.tsx, DesktopShell.tsx, useWindowManager.ts, desktop.css, Window.tsx, DesktopIcon.tsx — all read and verified against CONTEXT.md
- Internet Archive MS-DOS Emulation Help Center: [help.archive.org/help/ms-dos-emulation](https://help.archive.org/help/ms-dos-emulation/) — confirms EM-DOSBOX embed pattern and keyboard controls [CITED]
- Structure/conventions from: CONVENTIONS.md, STACK.md, ARCHITECTURE.md, STRUCTURE.md — all read

### Secondary (MEDIUM confidence)
- Archive.org search for Resident Evil: identifier `resident-evil_202406` found via websearch — not yet verified as DOSBox-enabled [ASSUMED]
- MDN X-Frame-Options documentation: [developer.mozilla.org/docs/Web/HTTP/Reference/Headers/X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options) — confirms iframe blocked behavior [CITED]

### Tertiary (LOW confidence)
- Stack Overflow on iframe blocked detection: confirms timer-based heuristic is standard approach — [stackoverflow.com/questions/79308931](https://stackoverflow.com/questions/79308931) [CITED]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - No new packages needed; all capabilities in React/TypeScript
- Architecture: HIGH - All five deliverables map cleanly to existing patterns
- Pitfalls: HIGH - Stale closure, submenu timing, and type union expansion are well-understood React patterns with clear mitigations

**Research date:** 2026-07-11
**Valid until:** 2026-08-11 (stable — code is released, no fast-moving dependencies)
