# Phase 4: Desktop Enhancements - Context

**Gathered:** 2026-07-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Extend the existing Win98-style retro desktop at `/desktop` with five enhancements: a full Win98 context menu (restoring View, Sort By, Paste, New, Properties, Display settings), Internet Explorer bug fix and desktop shortcut, Start Menu cleanup (remove About Me, add Shut Down confirmation), a "Game Station" DOS game launcher program, and a **Win98-style login screen** that appears after the BIOS boot sequence and before the desktop renders.

The login screen is rendered as the first state within DesktopShell (after the boot sequence finishes, before the desktop is shown). User sees: BIOS POST → Win98 login (username readonly: "Jhered OS", password optional) → "Loading personal settings" → Desktop.

This phase modifies existing code in `app/desktop/components/` — it does not create new routes. A `Win98Login` program component will be added in `components/desktop/`.

</domain>

<decisions>
## Implementation Decisions

### Context Menu Restoration (overrides D-09)
- **D-16:** Restore full Win98 desktop context menu items: View (Large Icons, Small Icons, List, Details), Sort By (Name, Size, Type, Date Modified), Refresh, Paste, New (Folder, Text Document), Properties, and Display Settings
- **D-17:** Submenus use hover-to-open behavior (classic Win98). Mouse entering a parent item opens its child submenu; moving to a child item keeps submenu open; moving away closes it
- References: `ContextMenu.tsx` — interface supports `children` but render logic and `handleItemClick` skip submenu items entirely. Both need rewriting

### Internet Explorer Fix + Desktop Shortcut
- **D-18:** The 10-second blocked-detection timer stays but becomes smarter: only show "blocked" if the iframe loading state is still active after 10 seconds (if `handleIframeLoad` fired successfully, the blocked screen never shows)
- **D-19:** IE desktop icon uses pixel-art IE logo design. Added as a 5th icon to `DESKTOP_ICONS` — no existing icons removed
- D-18 also implies fixing the stale closure bug in `navigate` where `historyIndex` is captured from closure instead of using a ref or state callback pattern

### Start Menu Cleanup
- **D-20:** Remove "About Me" (`about`) from `programList` in `DesktopShell.tsx`
- **D-21:** "Shut Down..." shows a confirmation dialog before navigating to `/grub-bootloader`

### Games Section
- **D-22:** A "Game Station" program window that lists available DOS games. Clicking a game opens an iframe to archive.org's DOSBox emulator. New desktop icon (`games`) added as a 6th icon
- **D-23:** First game is Resident Evil (1996 MS-DOS) via archive.org. More DOS games added the same way. Game list is a simple hardcoded array mapping game names to archive.org URLs

### Win98 Login Screen (new)
- **D-24:** Login screen renders inside DesktopShell as an intermediate state between boot (`showBoot`) and desktop render. Boot finishes → Login shown → "Loading personal settings" → Desktop
- **D-25:** Username field is read-only, pre-filled with "Jhered OS"
- **D-26:** Password field accepts any input or can be left empty — pressing Enter or clicking OK submits
- **D-27:** OK button submits login; Cancel button navigates back to `/grub-bootloader`
- **D-28:** User picture is a Win98-style generic user icon (silhouette), not a real photo
- **D-29:** On submit, show a brief "Loading your personal settings..." animation (like real Win98) before transitioning to the desktop
- **D-30:** No Easter eggs — simple login, any password works, no hidden behavior
- **D-31:** Visual design matches classic Win98 login dialog — blue titlebar ("Log On to Jhered OS"), user tile on the left, username/password fields on the right, OK/Cancel buttons

</decisions>

<overridden>
## Phase 2 Decisions Overridden

| Overridden | New Decision | Rationale |
|------------|-------------|-----------|
| D-09 (Refresh only) | D-16, D-17 | Restore full Win98 context menu with hover-to-open submenus |

</overridden>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Files to Modify
- `app/desktop/components/ContextMenu.tsx` — Rewrite submenu rendering, implement hover-to-open, restore all context menu items
- `app/desktop/components/DesktopShell.tsx` — Update `contextItems`, `DESKTOP_ICONS` (add browser + games), `programList` (remove about), `handleShutDown` (add confirmation), `renderProgram` (add GameStation case). **Add login screen state** between boot and desktop render
- `app/desktop/components/programs/InternetExplorer.tsx` — Fix stale closure bug in navigation, fix blocked detection timer
- `app/desktop/components/StartMenu.tsx` — No changes expected (dynamic component powered by props)

### Files to Create
- `app/desktop/components/programs/GameStation.tsx` — Game listing + archive.org iframe launcher

### Login Screen (new)
- `components/desktop/Win98Login.tsx` — New login screen component (render logic, Win98-style dialog, user icon, username/password fields, OK/Cancel, loading transition)
- `components/desktop/desktop.css` — May need additional Win98 login CSS classes

### Supporting Files
- `app/desktop/components/DesktopIcon.tsx` — No changes expected
- `app/desktop/components/Window.tsx` — No changes expected
- `app/desktop/hooks/useWindowManager.ts` — No changes expected (type union may need `games` added)
- `app/desktop/desktop.css` — Context menu styles (existing classes likely sufficient for restoration)

### Requirements
- `.planning/REQUIREMENTS.md` — DESKTOP-01 through DESKTOP-08 (all complete)

### Codebase Standards
- `.planning/codebase/CONVENTIONS.md` — Code style, component patterns
- `.planning/codebase/STACK.md` — Tech stack (Next.js 16, Tailwind 4, static export)
- `.planning/codebase/STRUCTURE.md` — Directory layout
- `.planning/codebase/ARCHITECTURE.md` — Architecture overview

</canonical_refs>

<code_context>
## Existing Code Insights

### ContextMenu.tsx Current State
- `ContextMenuItem` interface already has `children?: ContextMenuItem[]` — submenu typing ready
- But `handleItemClick` returns early if `item.children` is truthy — submenu items are non-interactive
- Render loop only renders label/icon/separator — no submenu popup rendering at all
- No keyboard navigation (arrow keys, Enter, Escape)
- Outside-click detection via `mousedown` listener works

### InternetExplorer.tsx Current State
- `navigate` callback uses stale `historyIndex` closure (line 78-95: `setHistory` callback correctly uses functional form, but `historyIndex` from closure is captured when `navigate` is created)
- Timer (10s) always fires and sets `blocked=true` — `handleIframeLoad` correctly clears the timer but the `navigate` timer still fires for sites that load fine within the 10-second window
- `handleIframeLoad` clears timer and sets `blocked=false` — works correctly
- `handleNav("refresh")` calls `iframeRef.current?.contentWindow?.location.reload()` but does not reset the blocked timer — needs fixing
- `handleNav("back"/"forward")` duplicates the 10-second timer logic — should be consolidated

### DesktopShell.tsx Current State
- `DESKTOP_ICONS` is 7 items — no change needed
- `programList` is 7 items — already updated
- `contextItems` has full Win98 tree with hover-to-open submenus
- `handleOpenProgram`/`handleIconOpen` — type union already expanded
- `handleShutDown` — shows confirmation dialog
- **Boot flow**: `showBoot` state (boolean) controls boot vs desktop. Login screen needs to be a new intermediate state: boot → login → "loading..." → desktop

### Win98 Login (new integration)
- DesktopShell currently has `showBoot` as boolean. Needs to become a 3-state flow: `boot` → `login` → `loading` → `desktop` (where `showBoot` false means desktop shown)
- The login component should follow existing Win98 visual patterns: raised borders, teal/gray backgrounds, `win98-*` CSS classes, pixel aesthetics
- Existing Shut Down dialog provides a reference pattern for modal Win98 dialog overlays (see lines 470-489 of DesktopShell.tsx)

### Boot Flow Architecture
- `/desktop-loading` page has external BIOS POST sequence → auto-navigates to `/desktop`
- `DesktopShell.tsx` has its own internal boot sequence (lines 136-148) with BIOS-style lines
- Login screen replaces the current direct transition from boot to desktop

### Established Patterns
- All interactive components use `"use client"` directive
- Styling uses inline styles and CSS classes (`win98-*` classes in `desktop.css`)
- Programs defined as React components rendered inside WindowShell via switch statement in `renderProgram`
- Desktop icons defined as a constant array with `{ id, icon, label }` shape
- Context menu items use `ContextMenuItem` interface with `{ label, icon, disabled, separator, children, action }`
- Modal dialogs (like Shut Down) rendered as fixed overlay with `win98-window` and `win98-titlebar` classes

</code_context>

<specifics>
## Specific Ideas

- **Context Menu**: Restore all items with real actions. "Refresh" works (increments refreshTick). "New Folder" opens a notepad or creates a mock folder. "Display Settings" opens Control Panel. "Properties" shows a mock properties dialog. View changes are cosmetic (affect icon layout). Sort By affects icon ordering.
- **IE fix**: The simplest fix for the timer is to have the timer callback check if loading is still true before setting blocked. Use a ref for the loading state to avoid closure issues.
- **IE icon**: A pixel-art "e" logo could be a small inline SVG or Unicode art. Match the existing emoji-based pattern by using a stylized character.
- **Game Station**: Window lists games as buttons in a program list style. Click opens an inner iframe to the archive.org URL. Should show a loading state and handle the iframe blocked case like IE does.
- **Shut Down Confirmation**: A simple Win98-style modal dialog with "Shut Down" message and OK/Cancel buttons. On OK, navigate to `/grub-bootloader`.
- **Win98 Login**: Use the classic Win98 "Log On to Windows" dialog layout — blue gradient titlebar with "Log On to Jhered OS", user icon tile (pixel-art generic silhouette) on left side, username and password fields stacked on right, OK/Cancel buttons at bottom. After OK, show "Loading your personal settings..." briefly before revealing desktop.

</specifics>

<deferred>
## Deferred Ideas

- Games beyond Resident Evil — add as data entries when desired
- Start Menu submenus (Programs > Accessories) — not requested
- Keyboard navigation in context menu — not requested
- Drag-to-rearrange icons — not requested
- GRUB boot animation polish ('e' to edit, 'c' for command line) — not requested
- Login Easter egg for specific passwords — not requested

</deferred>

---

*Phase: 4-Desktop Enhancements*
*Context gathered: 2026-07-17*
