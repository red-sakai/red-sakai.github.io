# Phase 2: Retro Desktop Mode - Context

**Gathered:** 2026-07-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Enhance the existing Win98-style retro desktop at `/desktop` with full customization features: a wallpaper system that reads from a `public/wallpapers/` folder plus user import, a browsable web browser program (iframe-based), an expanded Control Panel with color scheme/resolution/mouse/icon visibility settings, desktop shortcut cleanup (remove About Me and Projects icons), and a stripped-down context menu (Refresh only).

This phase modifies existing code in `app/desktop/` — it does not create new routes or change the portfolio-facing pages.

</domain>

<decisions>
## Implementation Decisions

### Wallpaper System
- **D-01:** Support both folder-based presets (`public/wallpapers/`) AND user import via file picker
- **D-02:** Fit modes: Tile, Center, and Stretch (Win98-style)
- **D-03:** Default/fallback wallpaper remains classic teal (#008080) when no image is selected
- **D-04:** Imported wallpapers stored as base64 in localStorage for persistence across reloads

### Browser Program
- **D-05:** Build a full IE-style browser with address bar, back/forward, refresh, stop, home buttons
- **D-06:** Uses an iframe to load external URLs (user types a URL, site loads in iframe)
- **D-07:** Default page on open is about:blank
- **D-08:** Auto-prepend `https://` if no protocol is specified (e.g., `google.com` → `https://google.com`)

### Context Menu Cleanup
- **D-09:** Right-click context menu on desktop shows ONLY "Refresh" — remove View, Sort By, Paste, Properties, and all separators

### Control Panel Scope
- **D-10:** Wallpaper section shows gallery grid of presets (colors + images from `public/wallpapers/`) plus an "Import..." button
- **D-11:** Color scheme setting — changes both desktop appearance AND window titlebar/taskbar colors (Win98 classic)
- **D-12:** Screen resolution — faux resolution picker
- **D-13:** Mouse settings — swap primary button, double-click speed
- **D-14:** Desktop icon visibility — toggle which icons are shown per program

### Desktop Shortcuts
- **D-15:** Remove "About Me" and "Projects" desktop icon entries. Keep My Portfolio, My Computer, Paint, and Control Panel icons

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing Desktop Code
- `app/desktop/components/DesktopShell.tsx` — Main desktop shell with icons, context menu, boot sequence, window rendering
- `app/desktop/components/ContextMenu.tsx` — Context menu component (needs simplification)
- `app/desktop/components/programs/ControlPanel.tsx` — Current control panel (needs expansion)
- `app/desktop/hooks/useWindowManager.ts` — Window state management (window.tsx component type may need extension for browser)
- `app/desktop/components/Window.tsx` — Window chrome component
- `app/desktop/components/DesktopIcon.tsx` — Desktop icon component
- `app/desktop/desktop.css` — Win98 CSS styles
- `app/desktop/page.tsx` — Route page (renders DesktopShell)

### Requirements
- `.planning/REQUIREMENTS.md` — DESKTOP-01 through DESKTOP-08 (existing requirements, all pending)

### Codebase Standards
- `.planning/codebase/CONVENTIONS.md` — Code style, component patterns
- `.planning/codebase/STACK.md` — Tech stack (Next.js 16, Tailwind 4, static export)
- `.planning/codebase/STRUCTURE.md` — Directory layout
- `.planning/codebase/ARCHITECTURE.md` — Architecture overview

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `DesktopIcon.tsx` — Existing desktop icon component with double-click handler, icon size support, label styling. Reusable for all desktop icons.
- `Window.tsx` — Win98 window with titlebar, drag support, resize handle, min/max/close. New browser and enhanced Control Panel reuse this.
- `Taskbar.tsx` / `StartMenu.tsx` — Taskbar with window buttons, start menu with program list. No changes expected.
- `useDesktopSounds.ts` — Web Audio API sound effects. Already wired globally.
- `ContextMenu.tsx` — Context menu with submenu support. Will simplify to single item.

### Established Patterns
- All interactive components use `"use client"` directive
- Styling uses inline styles and CSS classes (no Tailwind in desktop — it uses `win98-*` CSS classes in `desktop.css`)
- Window state managed via `useWindowManager` hook (zustand-like custom hook)
- Programs defined as React components rendered inside WindowShell via switch statement in `DesktopShell.tsx`

### Integration Points
- New `InternetExplorer` component goes in `app/desktop/components/programs/` — follows existing program pattern
- Control Panel expansion modifies `app/desktop/components/programs/ControlPanel.tsx`
- `DesktopShell.tsx` handles: icon list, context menu items, program routing (switch), wallpaper state
- `public/wallpapers/` directory needs to be created — images referenced by path
- `useWindowManager.ts` may need `WindowState.component` type extended to include `"browser"`

### Creative Options
- Wallpaper fit modes can use CSS `background-size: cover/contain/auto` with background-repeat
- Imported wallpapers stored in localStorage as data URIs — limited to ~5MB per image typically
- Browser iframe can show a friendly "page blocked" message when X-Frame-Options prevents loading
- Color scheme can be implemented as CSS custom properties injected at runtime on the desktop container

</code_context>

<specifics>
## Specific Ideas

- Browser should look like Internet Explorer 5/6 era — gray chrome, blue titlebar, address bar with "Address:" label
- Control Panel organized as sections with classic Win98 raised-border group boxes (already the pattern)
- `public/wallpapers/` folder to be created with placeholder README — user will add actual images

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 2-Retro Desktop Mode*
*Context gathered: 2026-07-10*
