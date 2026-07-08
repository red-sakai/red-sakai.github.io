---
id: 01-01
completed: 2026-07-08
requirements: LENIS-01, LENIS-02, LENIS-03, LENIS-04, COMPAT-01, COMPAT-02
---

# Plan 1-01 Summary: Lenis Provider + Layout Wiring

## Completed

- Installed `lenis` v1.3.25
- Created `app/components/providers/LenisProvider.tsx` — client component wrapping `<ReactLenis>` with standard config (lerp: 0.1, duration: 1.2, smoothWheel: true, autoRaf: true)
- Wired into root layout (`app/layout.tsx`)
- Added `data-lenis-prevent` to shell terminal scrollable container
- Route change scroll reset via `usePathname` effect

## Verification

- `npx tsc --noEmit` passes
- `npm run build` passes
- `npm run lint` — pre-existing errors only (model-viewer types)
