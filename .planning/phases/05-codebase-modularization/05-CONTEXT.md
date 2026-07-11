# Phase 5: Codebase Modularization - Context

**Gathered:** 2026-07-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Restructure the project from flat `app/*` layout to the standard Next.js pattern where `app/` contains only routes/pages and all shared code (components, hooks, lib, utils, types, data) lives at project root. Desktop sub-app components are migrated to `components/desktop/` with a namespace prefix. No behavioral changes — pure file moves and import updates.

</domain>

<decisions>
## Implementation Decisions

### Project Structure
- **D-01:** Standard Next.js pattern — `app/` for routes/pages only, everything else at project root
- **D-02:** `globals.css` stays at `app/globals.css` (Next.js convention for CSS imports)
- **D-03:** Empty `app/actions/` directory removed

### Component Organization
- **D-04:** Desktop-specific components go to `components/desktop/` (namespaced to avoid collisions with generic names like ContextMenu, StartMenu, Window)
- **D-05:** Shared components (`sections/`, `ui/`, `providers/`) move to root `components/`
- **D-06:** `app/components/desktop/` (empty) removed

### Hooks & Data
- **D-07:** All hooks merge into root-level `hooks/` — desktop hooks (`useWindowManager`, `useDesktopSounds`) included
- **D-08:** All data files merge into root-level `data/` — JSON content files, generated wallpaper list, desktop logo included

### Utilities & Types
- **D-09:** `app/lib/utils.ts` moves to root `lib/utils.ts`
- **D-10:** `app/types/model-viewer.d.ts` moves to root `types/model-viewer.d.ts`

### Migration Strategy
- **D-11:** Split into logical commits per domain (components, hooks, data, lib, types) — not one bulk commit
- **D-12:** The prebuild script (`scripts/generate-wallpapers.js`) output path updated to `data/wallpapers-generated.ts` (root level)
- **D-13:** All import paths in moved files updated to reflect new locations

### the agent's Discretion
- Import path aliases in `tsconfig.json`/`next.config.ts` can be added if needed for clean imports (e.g., `@/` alias for root-level directories)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Configuration
- `next.config.ts` — Static export config, image optimization settings
- `tsconfig.json` — Path aliases and compiler options (may need updates for new structure)

### Current File Inventory
- `app/` directory listing (`ls -la app/`) — Source of truth for what needs to move
- `find app -name "*.tsx" -o -name "*.ts"` — Complete file inventory

### Build Pipeline
- `scripts/generate-wallpapers.js` — Prebuild script that needs output path update
- `package.json` — Prebuild hook reference

</canonical_refs>

<code_context>
## Existing Code Insights

### Current Structure
- Everything lives under `app/` — routes, components, hooks, types, data, CSS
- Desktop has its own nested `components/`, `hooks/`, `data/` under `app/desktop/`
- `lib/utils.ts` (cn utility) is the only shared utility
- `app/hooks/useRevealOnScroll.ts` is the only shared hook
- `app/types/model-viewer.d.ts` is the only type declaration
- `app/components/desktop/` is an empty directory

### Established Patterns
- `@/` path alias used for imports (e.g., `@/app/data/wallpapers-generated`)
- `"use client"` directive on interactive components

### Import Updates Needed
Every file that imports from the old paths needs updating. Key affected patterns:
- `@/app/components/...` → `@/components/...`
- `@/app/data/...` → `@/data/...`
- `@/app/hooks/...` → `@/hooks/...`
- `@/app/lib/...` → `@/lib/...`
- `@/app/types/...` → `@/types/...`
- `@/app/desktop/...` → `@/components/desktop/...` (component files) or `@/hooks/...` (hook files)

</code_context>

<specifics>
## Specific Ideas

- Directories to create at root: `components/`, `hooks/`, `types/`, `data/`, `lib/` (lib/ already exists at root)
- Directories to remove from `app/`: `components/`, `hooks/`, `types/`, `data/`, `actions/`, `lib/`
- Desktop `app/desktop/components/*` → `components/desktop/*`
- Desktop `app/desktop/hooks/*` → `hooks/*`
- Desktop `app/desktop/data/*` → `data/*`
- CSS `app/globals.css` stays in place
- `app/components/desktop/` (empty) removed during cleanup

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 5-Codebase-Modularization*
*Context gathered: 2026-07-11*
