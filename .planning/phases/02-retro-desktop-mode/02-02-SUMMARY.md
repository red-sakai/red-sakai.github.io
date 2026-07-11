---
phase: 02-retro-desktop-mode
plan: 02
subsystem: ui
tags: desktop, win98, double-click, context-menu, component

# Dependency graph
requires:
  - phase: 02-retro-desktop-mode
    provides: DesktopShell.tsx, DesktopIcon.tsx, ContextMenu.tsx (existing components to modify)
provides:
  - Configurable double-click speed on DesktopIcon (prop-driven, default 400ms)
  - Button swapping support on DesktopIcon (left/right click swap via prop)
  - Simplified ContextMenu with flat item rendering (no submenu support)
affects: [02-retro-desktop-mode - DesktopShell integration, Control Panel mouse settings]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Prop-driven configuration with backward-compatible defaults (doubleClickSpeed=400)"
    - "Right-click handler that duplicates left-click logic when swapButtons is true"

key-files:
  created: []
  modified:
    - app/desktop/components/DesktopIcon.tsx
    - app/desktop/components/ContextMenu.tsx

key-decisions:
  - "doubleClickSpeed defaults to 400ms to maintain backward compatibility with existing behavior"
  - "swapButtons defaults to false — existing left-click behavior is preserved"
  - "ContextMenu keeps children field on ContextMenuItem interface for type backward compatibility, but children are rendered as flat items with no submenu arrows or hover state"

duration: 8min
completed: 2026-07-10
---

# Phase 02 Plan 02: DesktopIcon & ContextMenu Prep Summary

**Configurable double-click threshold and button-swapping on DesktopIcon, plus simplified flat-item ContextMenu without submenu rendering**

## Performance

- **Duration:** 8 min
- **Completed:** 2026-07-10
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- DesktopIcon now accepts `doubleClickSpeed` prop (number, default 400ms) replacing the hardcoded 400ms threshold
- DesktopIcon accepts `swapButtons` prop (boolean, default false) that swaps left/right click behavior when true
- ContextMenu simplified to flat item list: removed `subLabel` state, `timerRef`, `showSub`, `renderSubmenu`, and all submenu arrow/indicator rendering
- Both components maintain full backward compatibility — existing call sites work without changes

## Task Commits

Each task was committed atomically:

1. **Task 1: Add configurable double-click speed + swap buttons to DesktopIcon** - `84d3ca3` (feat)
2. **Task 2: Simplify ContextMenu to flat item rendering** - `786b2b5` (refactor)

## Files Created/Modified
- `app/desktop/components/DesktopIcon.tsx` - Added `doubleClickSpeed` and `swapButtons` props; configurable threshold used in `useCallback` dependency array; swap behavior in onClick/onContextMenu handlers
- `app/desktop/components/ContextMenu.tsx` - Removed submenu state, refs, and rendering functions; flattened item render loop (68 lines from 101)

## Decisions Made
- **doubleClickSpeed prop default 400ms**: Matches the existing hardcoded value — existing callers that don't pass the prop get identical behavior
- **swapButtons prop default false**: Ensures zero behavior change for existing DesktopIcon usage
- **ContextMenuItem children field retained**: The interface keeps `children?: ContextMenuItem[]` even though it's unused in rendering — ensures type compatibility with DesktopShell that may pass items containing the field
- **handleItemClick kept as dead code**: Explicitly retained per plan instructions for backward compatibility even though the inline onClick handler in the render loop duplicates its logic

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Stale Next.js `.next` cache caused build failures on Windows (locked file handles from previous dev sessions). Fixed by removing stale `.next/static`, `.next/server`, and `.next/cache` directories and re-running the build.

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes at trust boundaries were introduced.

## Next Phase Readiness
- DesktopIcon is ready for mouse speed settings from Control Panel (D-13)
- ContextMenu is ready for single "Refresh" item rendering (D-09)
- Both components need integration wiring in DesktopShell (handled in subsequent plans)

## Self-Check: PASSED

- ✅ `app/desktop/components/DesktopIcon.tsx` — exists, 89 lines (≥75 min), contains `doubleClickSpeed` and `swapButtons` in Props interface
- ✅ `app/desktop/components/ContextMenu.tsx` — exists, 68 lines (≥40 min), has no `subLabel`, `timerRef`, `renderSubmenu`, or `showSub`
- ✅ Commit `84d3ca3` — Task 1 (DesktopIcon: `feat(02-retro-desktop-mode)`)
- ✅ Commit `786b2b5` — Task 2 (ContextMenu: `refactor(02-retro-desktop-mode)`)
- ✅ Build succeeded — "Compiled successfully in 6.1s", all 15 static pages generated (verified via `out/desktop/index.html`)

---

*Phase: 02-retro-desktop-mode*
*Completed: 2026-07-10*
