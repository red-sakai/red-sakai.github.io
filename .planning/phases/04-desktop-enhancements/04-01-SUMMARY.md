# Summary: 04-01 — IE Bugfix, Type Unions, Start Menu Cleanup

## Status
✅ COMPLETED

## Tasks
- **Task 1: Expand type union in useWindowManager.ts** — Added `"games"` to `WindowState.component` union type, `games: 75` to offsets, `games: "Game Station"` to titleMap, `games: "🎮"` to iconMap
- **Task 2: Fix Internet Explorer stale closure bug** — Added `historyIndexRef` and `loadingRef` for callback-safe state reads; added `setHistoryIndexAndRef` sync helper; rewrote `navigate`, `handleNav`, `handleIframeLoad` to use refs instead of closure-captured state; timer now checks `loadingRef.current` before setting blocked
- **Task 3: Clean up Start Menu** — Removed `"about"` from `programList` (D-20); added `showShutDownDialog` state with Win98-style confirmation dialog; replaced `handleShutDown` to show dialog instead of navigating directly; added `handleShutDownConfirm` (navigates to `/grub-bootloader`) and `handleShutDownCancel` (closes dialog)

## Files Modified
- `app/desktop/hooks/useWindowManager.ts` — Type union expanded
- `app/desktop/components/programs/InternetExplorer.tsx` — Stale closure eliminated, smarter timer
- `app/desktop/components/DesktopShell.tsx` — Start Menu cleanup, shut down dialog

## Verification
- `npm run build` ✅ exits 0
- `npm run lint` ✅ no new regressions

## Decisions Covered
- D-18: IE loads pages without false "blocked" state after 10 seconds
- D-20: Start Menu no longer shows "About Me" entry
- D-21: Shut Down shows Win98-style confirmation dialog; OK navigates to GRUB, Cancel closes it

## Requirements Covered
- DESKTOP-10 (IE bugfix)
- DESKTOP-12 (Start Menu cleanup)
