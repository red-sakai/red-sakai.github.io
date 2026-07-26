# Phase 7: Favorites Manager - Context

**Gathered:** 2026-07-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Upgrade the existing read-only "My Favorites" program on the retro desktop into a full CRUD interface for managing anime/manhwa/game favorites through the UI — no JSON file editing required. Editing is gated behind an admin mode unlocked via a secret password at the Login screen (Phase 6).

</domain>

<decisions>
## Implementation Decisions

### Persistence Strategy
- **D-01:** Favorites stored in localStorage only (same pattern as wallpapers, color scheme, settings)
- **D-02:** Start empty — no migration from `data/favorites.json`. Existing JSON file is not used at runtime
- **D-03:** The existing `data/favorites.json` file can be removed or kept as a reference seed (not loaded by the app)

### Admin Mode (Cross-Phase with Phase 6)
- **D-04:** Admin mode auto-detected from the Login screen (Phase 6). Entering a specific secret password at login grants session-wide admin privileges
- **D-05:** Admin mode persists for the session (page refresh resets it). No per-action re-authentication
- **D-06:** When not in admin mode, the Favorites program is read-only (current behavior). When in admin mode, Add/Edit/Delete controls appear
- **D-07:** Phase 6 must be updated to expose an admin state (e.g., React context or global state) that Phase 7 reads. This is a cross-phase dependency

### Edit UI Pattern
- **D-08:** Add/Edit forms use Win98-style modal dialogs (same visual pattern as the existing detail modal — raised borders, titlebar, OK/Cancel buttons)
- **D-09:** All fields editable: title, category (dropdown: anime/manhwa/game), rating (0-10 input), thoughts (textarea), image (URL)
- **D-10:** Delete confirmation dialog before removing an entry (Win98-style)

### Image Handling
- **D-11:** URL input only. User pastes an image URL. No file upload or base64 conversion
- **D-12:** When no image URL is provided, the gradient + emoji fallback is shown (already implemented)

### Desktop Registration
- **D-13:** Reuse existing "My Favorites" icon + program entry in `DESKTOP_ICONS` and `programList`. No new registration needed
- **D-14:** The existing `WindowState.component` union type already includes `"favorites"` — no type changes needed

### the agent's Discretion
- Admin state passing mechanism between Phase 6 and Phase 7 (React context, zustand, or a simple global variable — agent chooses based on codebase simplicity)
- Visual layout of the admin toolbar (Add button, Edit/Delete on hover/click within the grid)
- Password validation behavior (exact match, case sensitivity)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing Files to Modify
- `components/desktop/programs/Favorites.tsx` — Upgrade from read-only to full CRUD with admin detection, modal forms, localStorage persistence
- `components/desktop/DesktopShell.tsx` — May need to pass admin state or connect to admin context
- `hooks/useWindowManager.ts` — No changes needed (already supports `"favorites"` component)

### Cross-Phase Dependency
- `.planning/phases/06-login-screen/06-CONTEXT.md` — Phase 6 context. Login screen needs to expose admin mode state
- `.planning/phases/06-login-screen/06-01-PLAN.md` — Current login screen plan. May need updating to support admin flag

### Codebase Standards
- `.planning/codebase/CONVENTIONS.md` — Code style, component patterns
- `.planning/codebase/STACK.md` — Tech stack (Next.js 16, Tailwind 4, static export)
- `.planning/codebase/ARCHITECTURE.md` — Architecture overview

### localStorage Patterns (Reference)
- `components/desktop/DesktopShell.tsx` — Wallpaper/settings localStorage pattern (useEffect hydration + useEffect persist)
- `components/desktop/programs/ControlPanel.tsx` — Imported wallpaper base64 localStorage pattern
- `hooks/useDesktopSounds.ts` — Sound toggle localStorage pattern

</canonical_refs>

<code_context>
## Existing Code Insights

### Favorites.tsx Current State
- Read-only grid with filter buttons (All/Game/Manhwa/Anime)
- Detail modal with cover image (gradient fallback), rating, thoughts section
- Imports `@/data/favorites.json` directly — will need to switch to localStorage read
- ~250 lines, zero-props component — will need a `useEffect` for localStorage hydration

### Established Patterns
- localStorage persistence: 2-part pattern (hydration `useEffect` on mount + persist `useEffect` watching state)
- Win98 modals: raised borders, titlebar with close button, OK/Cancel button row
- Programs are self-contained components with no special props (except ControlPanel)
- All programs use `"use client"` directive

### Integration Points
- Admin state: Phase 6 Login screen needs to set a session-level admin flag. Favorites program reads this flag to show/hide CRUD controls
- The existing `data/favorites.json` file contains 10 entries that will NOT be auto-imported (D-02)

### Creative Options
- Admin unlock could be a simple React context (`AdminContext`) wrapping the desktop route, set by LoginModal
- Add button could live in a toolbar above the filter buttons; Edit/Delete could be per-item icons shown only in admin mode

</code_context>

<specifics>
## Specific Ideas

- Admin toolbar: Add button at top of filters area. Edit (pencil icon) and Delete (X icon) appear on each card/grid item when in admin mode
- Delete confirmation: Standard Win98 "Are you sure?" dialog with Yes/No
- Rating: Simple number input 0-10 (could be a text field with validation, or a dropdown)
- Since admin mode is session-based and auto-detected, the Favorites program doesn't need its own password prompt

</specifics>

<deferred>
## Deferred Ideas

- Data export/import (download JSON) — not a priority for initial implementation
- Dynamic categories (custom categories beyond anime/manhwa/game) — not requested
- Image file upload / base64 storage — user chose URL-only
- Seed migration from `data/favorites.json` — user wants to start empty

</deferred>

---

*Phase: 7-Favorites Manager*
*Context gathered: 2026-07-26*
