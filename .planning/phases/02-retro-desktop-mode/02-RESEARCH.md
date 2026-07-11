# Phase 2: Retro Desktop Mode — Research

**Researched:** 2026-07-10
**Domain:** Windows 98-style desktop customization (wallpaper system, iframe browser, control panel expansion, shortcut management)
**Confidence:** HIGH

## Summary

Phase 2 enhances the existing Win98-style desktop at `/desktop` with four major feature areas: a wallpaper system supporting preset images + user import, an IE-style iframe browser, an expanded Control Panel (color schemes, faux resolution, mouse settings, icon visibility), and desktop shortcut cleanup. The GRUB bootloader already offers "Normal Mode" and "Retro Desktop Mode" options — no changes needed there.

**Key constraints:** Static Next.js export (no API routes, no SSR, no server-side proxy), existing desktop uses inline styles + `win98-*` CSS classes (no Tailwind in desktop section), window state managed via custom `useWindowManager` hook, programs rendered via switch statement in `DesktopShell.tsx`.

**Primary recommendation:** Implement wallpaper system via localStorage + CSS background properties; build iframe browser with error fallback UI; extend Control Panel as a settings hub with localStorage persistence; add `"browser"` to `WindowState.component` union type; simplify context menu to single "Refresh" item per D-09.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Wallpaper rendering | Browser (DesktopShell) | — | Inline style on `<main>` element, CSS background properties |
| Wallpaper import (file picker) | Browser (ControlPanel) | — | FileReader API is browser-only; data URI stored in localStorage |
| Preset wallpaper reading | Browser (img src) | Build (public/) | Images in `public/wallpapers/` are served at build time as static assets |
| Web browser (iframe) | Browser | — | iframe loads external URLs; X-Frame-Options enforced by browser security model |
| Color scheme application | Browser (CSS variables) | — | CSS custom properties set via JS on desktop container |
| Screen resolution (faux) | Browser (cosmetic) | — | Purely cosmetic — no actual resolution change possible |
| Mouse settings | Browser | — | Click handler configuration in DesktopIcon and global event handlers |
| Icon visibility | Browser (DesktopShell) | — | Filter desktopIcons array based on localStorage settings |
| Context menu | Browser (ContextMenu) | — | Simplify to single item, remove submenus |
| Desktop shortcuts | Browser (DesktopShell) | — | Edit array definitions, no architectural change |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js (static export) | 16.x | App router, route handling | Existing project constraint |
| React | 19.x | Component model | Existing project constraint |
| Web Audio API | Browser native | Sound effects | Already used via `useDesktopSounds` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| localStorage | Browser API | Persist wallpaper config, imported images, color scheme, settings | All persistent state — 5MB limit, wrap in try-catch |
| CSS Custom Properties | Browser API | Apply color schemes to titlebars, taskbar | Color scheme switching — no library needed |
| FileReader | Browser API | Read user-selected image files for wallpaper import | File picker in Control Panel |
| IntersectionObserver | Browser API | Detect iframe load failure | Browser "page blocked" detection |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| localStorage for imported wallpapers | IndexedDB via `idb-keyval` | IndexedDB handles larger data but adds a dependency and API complexity. localStorage is simpler, sufficient for a few wallpapers (<5MB total). [ASSUMED] |
| CSS variables for color schemes | Inline style overrides on every component | CSS variables are cleaner (single declaration point). Both work; variables are the modern standard. [CITED: MDN CSS Custom Properties] |

**Installation:** No new packages required. This phase uses existing stack + browser APIs only.

## Package Legitimacy Audit

> No external packages are installed in this phase. All implementation uses browser APIs (localStorage, FileReader, Web Audio API, CSS Custom Properties) and existing stack (Next.js, React). No audit needed.

## Architecture Patterns

### System Architecture Diagram

```
User at /desktop
     │
     ▼
┌─────────────────────────────────────────────────────┐
│ DesktopShell (state hub)                             │
│                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ wallpaperState│  │ colorScheme  │  │ iconVisibil│  │
│  │ {type, value, │  │ {id, vars[]} │  │ {active[]} │  │
│  │  fit}          │  │              │  │            │  │
│  └──────┬──────┘  └──────┬───────┘  └─────┬──────┘  │
│         │                │                │          │
│         ▼                ▼                ▼          │
│  ┌──────────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ <main style={ │  │ CSS vars │  │ Filtered icons │  │
│  │  background } │  │ on root  │  │ render loop   │  │
│  └──────────────┘  └──────────┘  └───────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ ContextMenu (simplified — single "Refresh")   │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ WindowShell ← useWindowManager              │   │
│  │  └─ renderProgram(component) switch:       │   │
│  │      "browser"     → InternetExplorer       │   │
│  │      "explorer"    → FileExplorer           │   │
│  │      "paint"       → PaintClone             │   │
│  │      "controlpanel"→ ControlPanel (expanded)│   │
│  │      "about"       → AboutMeWindow         │   │
│  │      "portfolio"   → PortfolioViewer        │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ localStorage persistence:                     │   │
│  │  desktop-wallpaper: {type, value, fit}       │   │
│  │  desktop-colorscheme: "standard"|"rose"|...  │   │
│  │  desktop-icons: string[] (visible IDs)       │   │
│  │  desktop-mousespeed: number (ms)             │   │
│  │  desktop-sounds: boolean                     │   │
│  │  imported-wallpaper-N: base64 data URIs      │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Recommended Project Structure (Additions Only)
```
public/
└── wallpapers/              # NEW — preset wallpaper images (user adds at build time)
    └── .gitkeep             # Keeps directory in git

app/desktop/components/
├── DesktopShell.tsx          # MODIFY — wallpaper, color scheme, icon visibility, context menu
├── ContextMenu.tsx           # MODIFY — simplify to single "Refresh" item
├── DesktopIcon.tsx           # MODIFY — adjustable double-click speed from localStorage
└── programs/
    ├── ControlPanel.tsx      # MODIFY — major expansion (wallpaper, color scheme, resolution, mouse, icons)
    └── InternetExplorer.tsx  # NEW — IE5/6-style iframe browser

app/desktop/hooks/
└── useWindowManager.ts       # MODIFY — add "browser" to component type union
```

### Pattern 1: Wallpaper System (static export–compatible)
**What:** Three-tier wallpaper system: solid colors (inline CSS), preset images (from `/wallpapers/` folder, built at compile time), user-imported images (base64 in localStorage). Fit modes via CSS background properties.

**When to use:** All desktop rendering — wallpaper applied as `background` on the `<main>` container element.

**State shape (stored in localStorage):**
```typescript
interface WallpaperConfig {
  type: "color" | "preset" | "imported";
  value: string;        // hex color, "/wallpapers/filename.jpg", or base64 data URI
  fit: "tile" | "center" | "stretch";
}
```

**CSS for fit modes:**
```typescript
const fitStyles: Record<string, React.CSSProperties> = {
  tile:    { backgroundRepeat: "repeat", backgroundSize: "auto", backgroundPosition: "0 0" },
  center:  { backgroundRepeat: "no-repeat", backgroundSize: "auto", backgroundPosition: "center center" },
  stretch: { backgroundRepeat: "no-repeat", backgroundSize: "100% 100%", backgroundPosition: "0 0" },
};
```
[ASSUMED] — standard CSS background behavior, verifiable via any CSS reference.

**Import flow (ControlPanel):**
```typescript
const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onloadend = () => {
    const dataUri = reader.result as string;
    // Wrap localStorage.setItem in try-catch for QuotaExceededError
    try {
      localStorage.setItem(`imported-wallpaper-${Date.now()}`, dataUri);
    } catch (err) {
      // Show error: "Storage full — remove some wallpapers"
    }
  };
  reader.readAsDataURL(file);
};
```
[CITED: MDN FileReader API, MDN localStorage quotas]

### Pattern 2: Color Scheme via CSS Custom Properties
**What:** Define color scheme presets as plain objects with CSS variable values, apply to desktop container on change.

**When to use:** When color scheme setting changes in Control Panel.

**Scheme definitions:**
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
[ASSUMED] — Win98 classic color schemes; actual values are design choices.

**Application:**
```typescript
// In DesktopShell, on mount / scheme change:
const desktopRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  const el = desktopRef.current;
  if (!el || !scheme) return;
  Object.entries(scheme.vars).forEach(([key, val]) => {
    el.style.setProperty(key, val);
  });
}, [scheme]);
```

**CSS updates (desktop.css):**
```css
.win98-titlebar {
  background: linear-gradient(90deg, var(--titlebar-start, #000080), var(--titlebar-end, #1084d0));
}
.win98-taskbar {
  background: var(--taskbar-bg, #c0c0c0);
  /* ... existing styles */
}
```

**Key insight:** CSS variables are supported in all browsers since ~2016. Using `var()` with a fallback means the existing blue color scheme remains the default. [VERIFIED: MDN — CSS custom properties browser compatibility]

### Pattern 3: iframe Browser with Error Handling
**What:** IE5/6-style web browser component with address bar, nav buttons, and iframe. Accounts for X-Frame-Options blocking.

**When to use:** When user opens the "Internet Explorer" program from desktop or start menu.

```typescript
// Structure outline for InternetExplorer.tsx
"use client";
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

  const normalizeUrl = (input: string): string => {
    input = input.trim();
    if (!input) return "about:blank";
    if (input === "about:blank") return input;  // special case: allow about:blank
    if (!/^https?:\/\//i.test(input)) return `https://${input}`;
    return input;
  };

  const navigate = useCallback((rawUrl: string) => {
    const url = normalizeUrl(rawUrl);
    setAddress(url === "about:blank" ? "" : url);
    setCurrentUrl(url);
    setBlocked(false);
    setLoading(true);
    // Trim future history if we navigated from a mid-point
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), { url }]);
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const handleNav = useCallback((action: NavAction) => {
    switch (action) {
      case "back":
        if (historyIndex > 0) {
          const idx = historyIndex - 1;
          setHistoryIndex(idx);
          const entry = history[idx];
          setCurrentUrl(entry.url);
          setAddress(entry.url === "about:blank" ? "" : entry.url);
          setBlocked(false);
        }
        break;
      case "forward":
        if (historyIndex < history.length - 1) {
          const idx = historyIndex + 1;
          setHistoryIndex(idx);
          const entry = history[idx];
          setCurrentUrl(entry.url);
          setAddress(entry.url === "about:blank" ? "" : entry.url);
          setBlocked(false);
        }
        break;
      case "refresh":
        // Force re-render by toggling key on iframe or using contentWindow.location.reload()
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.location.reload();
        }
        break;
      case "stop":
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.stop();
        }
        setLoading(false);
        break;
      case "home":
        navigate("about:blank");
        break;
    }
  }, [history, historyIndex, navigate]);

  // Detect iframe load failure:
  const handleIframeError = useCallback(() => {
    setBlocked(true);
    setLoading(false);
  }, []);

  const handleIframeLoad = useCallback(() => {
    setLoading(false);
    // Try to read iframe title (will throw on cross-origin — that's fine, it means page loaded)
    try {
      const title = iframeRef.current?.contentDocument?.title;
      if (title) {
        setHistory((prev) => {
          const updated = [...prev];
          if (updated[historyIndex]) {
            updated[historyIndex] = { ...updated[historyIndex], title };
          }
          return updated;
        });
      }
    } catch {
      // Cross-origin — cannot read title, but page loaded
    }
  }, [historyIndex]);

  // ... render IE5-style chrome with address bar, buttons, and iframe
}
```
[ASSUMED] — pattern derived from established iframe embedding knowledge and Web API docs.

**X-Frame-Options handling:**
- Most popular sites (Google, GitHub, Facebook, YouTube, Wikipedia) block iframe embedding via `X-Frame-Options: DENY` or `CSP frame-ancestors 'none'`
- This is a browser-enforced security policy — no client-side workaround exists
- The only fix is a server-side proxy (impossible in static Next.js export)
- **Solution:** Show a friendly Win98-style "This page cannot be displayed" error when iframe load fails
- Detection: use iframe `onError` event + timer-based check (if iframe doesn't fire `onLoad` within 15s, assume blocked)
- Sandbox attribute: `sandbox="allow-scripts allow-forms allow-same-origin"` for security
- IE5/6 chrome: gray address bar with "Address:" label, blue titlebar, raised-3D navigation buttons

**Impact assessment for browser:**
- [ASSUMED] ~80%+ of major sites will be blocked
- The browser is most useful for: sites that explicitly allow framing (some tools, less popular sites), local content, about:blank start page
- Accept this limitation and provide good error UX. The browser is a novelty/nostalgia feature.

### Anti-Patterns to Avoid
- **Storing imported wallpapers without try-catch:** localStorage `setItem` throws `QuotaExceededError` when full. Always wrap in try-catch.
- **Trying to read iframe contentDocument on cross-origin:** Throws a security error. Use try-catch around any cross-origin iframe access.
- **Hardcoding wallpaper paths:** `public/wallpapers/` is empty by design — the user adds their own images. The code must handle the empty state gracefully (fall back to teal).
- **Relying on iframe `onLoad` alone for success detection:** Cross-origin iframes may fail silently. Combine `onLoad` + timer fallback.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image file reading in browser | Custom binary parser | `FileReader.readAsDataURL()` | Built-in browser API, handles all image formats, produces data URI directly usable as `background-image` |
| Color scheme CSS injection | JS-driven inline styles on every element | CSS Custom Properties (`var()`) | Single declaration point, inherits through DOM, supports fallback values |
| State persistence | Custom file-based storage | `localStorage` | Simple key-value API, synchronous, sufficient for <5MB of config data |
| Double-click detection | Custom timing logic | Already in DesktopIcon.tsx | Existing pattern works — only need to make threshold configurable |

**Key insight:** This phase is heavily constrained by the static export (no API routes, no SSR). Every feature must work entirely in the browser without server-side support. The phase is about enhancing an existing client-side React app, not adding new infrastructure.

## Common Pitfalls

### Pitfall 1: QuotaExceededError When Saving Imported Wallpapers
**What goes wrong:** After importing a few wallpaper images, localStorage `setItem()` throws an error. All settings silently stop persisting.
**Why it happens:** localStorage is limited to ~5MB per origin. Base64-encoded images add ~33% overhead vs. binary. A 1920x1080 JPEG can be 500KB+ as base64. Just 5-10 images fill the quota.
**How to avoid:** Wrap every `localStorage.setItem()` call in try-catch. Show user feedback when quota is exceeded. Consider using IndexedDB if more capacity is needed. Track storage usage: `(key.length + value.length) * 2 / 1024 / 1024`.
**Warning signs:** Newly imported wallpaper doesn't appear after refresh. Console shows `QuotaExceededError`. [VERIFIED: MDN Storage Quotas]

### Pitfall 2: iframe Load Failures Are Silent
**What goes wrong:** User types a URL, address bar shows the URL, but the iframe content area stays blank. No error feedback.
**Why it happens:** Cross-origin iframes load asynchronously. If `X-Frame-Options` blocks the page, the iframe fires neither `onLoad` nor `onError` in most cases — it just stays blank.
**How to avoid:** Use a polling approach — after navigating, start a 10-second timer. If no `onLoad` fires within the timer, assume blocked and render the error state. Handle the `onLoad` event to cancel the timer and clear the error. [ASSUMED]

### Pitfall 3: CSS Class Precedence Conflicts with Color Scheme Variables
**What goes wrong:** Color scheme variables are set but don't take effect because inline styles or existing CSS have higher specificity.
**Why it happens:** `.win98-titlebar` already has a hardcoded `background: linear-gradient(...)` value. CSS variables only override if the property uses `var()`.
**How to avoid:** Update `.win98-titlebar` and `.win98-titlebar-inactive` in `desktop.css` to use `var()` with defaults. Any component with inline style backgrounds also needs to be updated to read from CSS variables or accept props.

### Pitfall 4: Static Export Cannot Serve Dynamically Added Files
**What goes wrong:** Imported wallpapers (base64 in localStorage) render fine locally but code assumes they can be saved as files and served.
**Why it happens:** `public/` folder is frozen at build time. Files cannot be added at runtime.
**How to avoid:** Use `data:` URIs for imported wallpapers. Do not attempt to write to `public/` at runtime. The static export constraint is fundamental — verify all approaches against it.

## Code Examples

### Wallpaper Application (DesktopShell.tsx — modify existing background logic)

```typescript
// Source: Pattern derived from CSS background properties [VERIFIED: MDN background]
const WALLPAPER_KEY = "desktop-wallpaper";

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
  fit: "center", // center is the default Win98 behavior for solid colors
};

// In DesktopShell:
const [wallpaperConfig, setWallpaperConfig] = useState<WallpaperState>(() => {
  try {
    const stored = localStorage.getItem(WALLPAPER_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_WALLPAPER;
  } catch {
    return DEFAULT_WALLPAPER;
  }
});

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

### WindowState Component Type Extension (useWindowManager.ts)

```typescript
// Source: Existing code pattern — extend the union type
export interface WindowState {
  id: string;
  title: string;
  icon: string;
  // ADD "browser" to the existing union:
  component: "about" | "portfolio" | "explorer" | "paint" | "controlpanel" | "browser";
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
}

// In openWindow mappings, add:
const titleMap: Record<string, string> = {
  about: "About Me - Notepad",
  portfolio: "My Portfolio",
  explorer: "File Explorer",
  paint: "Paint",
  controlpanel: "Control Panel",
  browser: "Internet Explorer",  // NEW
};

const iconMap: Record<string, string> = {
  about: "📄",
  portfolio: "🏠",
  explorer: "📁",
  paint: "🎨",
  controlpanel: "⚙️",
  browser: "🌐",  // NEW
};
```

### Context Menu Simplification (DesktopShell.tsx)

```typescript
// Source: D-09 from CONTEXT.md — Refresh only
const contextItems: ContextMenuItem[] = [
  { label: "Refresh", icon: "⟳", action: handleRefresh },
];
```

**Impact:** Remove View, Sort By, Paste, Properties, and all separators. The `iconSize`, `iconSortBy` state variables in DesktopShell can also be removed (they were only used by these menu items).

### Desktop Shortcuts (DesktopShell.tsx — remove About Me and Projects)

```typescript
// Source: D-15 from CONTEXT.md — keep only 4 icons
const desktopIcons = [
  { id: "portfolio", icon: "🏠", label: "My Portfolio" },
  { id: "explorer", icon: "💻", label: "My Computer" },
  { id: "paint", icon: "🎨", label: "Paint" },
  { id: "controlpanel", icon: "⚙️", label: "Control Panel" },
];
```

**Note:** Unlike the hardcoded `iconPositions` currently used, the filtered/visibility-aware approach should use dynamic positioning or a grid layout. Since D-14 adds icon visibility toggles, the position array approach breaks when icons are hidden. Switch to a flex-wrap or CSS grid approach for the icons container, or maintain position mapping.

### localStorage Key Schema

```
desktop-wallpaper    → JSON.stringify(WallpaperState)
desktop-colorscheme  → "standard" | "rose" | "eggplant" | "marine" | "pumpkin"
desktop-icons-vis    → JSON.stringify(string[])  // visible icon IDs
desktop-mousespeed   → "200" | "400" | "600" | "800"  // double-click threshold in ms
desktop-swapbuttons  → "true" | "false"
desktop-sounds       → "true" | "false"  // existing
imported-wallpaper-N → base64 data URI string
```
[ASSUMED] — schema design; exact key names are implementation choices.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hardcoded wallpaper colors (teal/black/maroon/navy) | Dynamic wallpaper system (color/preset/import + 3 fit modes) | This phase | Dramatically more flexible; requires localStorage persistence pattern |
| Context menu with 4+ items and submenus | Single "Refresh" item | This phase | Removes ~100 lines of state/code from DesktopShell |
| Desktop icons static list of 6 | Configurable list of 4+ (visibility toggles per icon) | This phase | Affects icon rendering loop, requires filtering |
| Window component type: 5 programs | Window component type: 6 programs (+ browser) | This phase | Type change ripples through 3+ files |
| Control Panel: sounds + display + font | Control Panel: sounds + wallpaper gallery + color scheme + faux resolution + mouse + icon visibility | This phase | Major expansion of the component |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Most major websites (Google, GitHub, Facebook) set X-Frame-Options: DENY or frame-ancestors 'none' | Browser Program | If wrong, browser is more useful. If right (likely), browser is limited but still works as a novelty/nostalgia feature. |
| A2 | 5MB localStorage is sufficient for ~5-15 imported wallpapers (at ~200-500KB base64 each) | Wallpaper System | If wrong, users hit quota faster. Mitigation: try-catch + user feedback. |
| A3 | CSS Custom Properties work in all modern browsers the site targets | Color Scheme | If wrong, fallback `var()` defaults preserve Win98 blue. Safe degradation. |
| A4 | No new npm packages are needed | General | If wrong, all features can be built with browser APIs. Package installs are only needed for conveniences like `idb-keyval` for IndexedDB. |
| A5 | The GRUB bootloader at `/grub-bootloader` already redirecting to `/desktop-loading` → `/desktop` needs no changes | GRUB Integration | If wrong, GRUB page needs editing (low effort). Verified: current code routes to `/desktop-loading` for desktop mode. |

## Open Questions (RESOLVED)

1. **What wallpaper images should ship as defaults?**
   RESOLVED: Create the directory with `.gitkeep`. Wallpaper images are user content — the system works with any images placed there. The default teal is the fallback when the directory is empty.

2. **How should the "faux screen resolution" actually behave?**
   RESOLVED: Make it a purely visual dialog that shows "selected resolution" but doesn't change desktop rendering. This matches Win98 behavior where resolution changes were rare and applied system-wide. Add a note in the UI: "Changes take effect after restart."

3. **How to handle icon positioning when icons are toggled on/off?**
   RESOLVED: Use CSS flex-wrap or grid for the icon container. Filter invisible icons from the render array, let CSS handle layout. This is simpler than maintaining position-to-icon mappings.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | none — no test framework configured per AGENTS.md |
| Config file | none |
| Quick run command | `npm run build` (static export validation) |
| Full suite command | `npm run build && npm run lint` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DESKTOP-01 | GRUB offers both modes | Manual visual check | — | ❌ No test infra |
| DESKTOP-02 | /desktop renders Win98 desktop | Manual + build | `npm run build` | ❌ |
| DESKTOP-03 | Taskbar with Start button, windows, clock | Manual visual check | — | ❌ |
| DESKTOP-04 | Start menu opens/closes correctly | Manual visual check | — | ❌ |
| DESKTOP-05 | Desktop icons open correct programs | Manual | — | ❌ |
| DESKTOP-06 | Windows draggable, resizable, min/max/close | Manual | — | ❌ |
| DESKTOP-07 | 4 programs functional | Manual | — | ❌ |
| DESKTOP-08 | Sound effects via Web Audio API | Manual (ears) | — | ❌ |

### Wave 0 Gaps
- No test framework exists. All verification is manual or build-based.

## Security Domain

> Security enforcement: enabled (absent from config = enabled per workflow rules).

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth used in portfolio |
| V3 Session Management | no | No sessions in static site |
| V4 Access Control | no | All public content |
| V5 Input Validation | yes | **URL input in browser program** — validate URL format before iframe navigation |
| V6 Cryptography | no | No crypto operations |

### Known Threat Patterns for iframe Browser

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| iframe clickjacking (user being framed) | Tampering | Not applicable — WE are embedding OTHERS, not vice versa. But we must protect our own visitors if our site is ever embedded. Not a static portfolio concern. |
| URL injection / javascript: URLs | Tampering | Before setting iframe `src`, reject `javascript:`, `data:`, `file:` protocols. Only allow `http:` and `https:` and `about:blank`. |
| Mixed content warnings | Information Disclosure | When site is served over HTTPS, iframe loading HTTP content will be blocked by browser. Auto-prepend `https://` (D-08) mitigates this. |
| iframe sandbox escape | Elevation of Privilege | Use `sandbox="allow-scripts allow-forms allow-same-origin"` on the iframe. This restricts the embedded page from: opening popups, accessing parent navigation, running plugins, etc. |

**URL sanitization for browser:**
```typescript
function sanitizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed || trimmed === "about:blank") return "about:blank";
  // Reject dangerous protocols
  if (/^(javascript|data|file|vbscript):/i.test(trimmed)) return null;
  // Auto-prepend https://
  const url = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  // Basic domain validation
  try {
    new URL(url);
    return url;
  } catch {
    return null;
  }
}
```
[ASSUMED] — security pattern for iframe URL sanitization.

## Sources

### Primary (HIGH confidence)
- [VERIFIED: Codebase files] — All existing files read directly: DesktopShell.tsx, useWindowManager.ts, ControlPanel.tsx, Window.tsx, ContextMenu.tsx, DesktopIcon.tsx, desktop.css, useDesktopSounds.ts, app/desktop/page.tsx, app/grub-bootloader/page.tsx, app/desktop-loading/page.tsx, next.config.ts
- [VERIFIED: CONTEXT.md] — All 15 decisions (D-01 through D-15) read from 02-CONTEXT.md
- [VERIFIED: MDN] — localStorage limits (~5MB), CSS Custom Properties, FileReader API, X-Frame-Options, CSP frame-ancestors, iframe sandbox attribute

### Secondary (MEDIUM confidence)
- [CITED: https-quotas] — Storage quotas and eviction criteria from web.dev

### Tertiary (LOW confidence)
- [ASSUMED] — X-Frame-Options blocking rate for major sites (~80%+)
- [ASSUMED] — Win98 color scheme values (Rose, Eggplant, etc.)
- [ASSUMED] — Base64 image size estimates for 1920x1080 JPEG wallpapers

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — No new packages, all browser APIs
- Architecture: HIGH — Direct code analysis of all affected files
- Pitfalls: HIGH — localStorage quotas, iframe blocking, CSS precedence are well-documented patterns
- Color scheme values: MEDIUM — Design choices subject to user preference
- Wallpaper image sizes: LOW — Depends entirely on user-supplied images

**Research date:** 2026-07-10
**Valid until:** 2026-08-10 (stable knowledge — not framework-dependent)
