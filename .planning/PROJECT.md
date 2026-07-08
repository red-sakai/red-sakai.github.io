# jhered.me — Portfolio Site

## What This Is

Personal portfolio for Jhered Miguel Republica at jhered.me. A static Next.js site with dark/light theme, JSON-driven content sections (education, experience, projects, certifications), 3D model-viewer Hero, and easter-egg pages (shell terminal, GRUB bootloader). Single-page layout on `/` with hash-linked navigation.

## Core Value

Provide a fast, visually clean portfolio that showcases Jhered's work and lets visitors explore with a smooth, polished experience.

## Requirements

### Validated

- ✓ Portfolio rendered as static Next.js 16 export (App Router) — existing
- ✓ Dark/light theme with `class` strategy on `<html>` — existing
- ✓ JSON-driven content (education, experience, projects, certifications) — existing
- ✓ Hash-linked section navigation on home page (`#education`, `#experience`, etc.) — existing
- ✓ 3D model-viewer in Hero section — existing
- ✓ Easter-egg pages (shell terminal, GRUB bootloader, GUI loading) — existing
- ✓ Scroll-triggered fade-in animations via useRevealOnScroll (IntersectionObserver) — existing
- ✓ Tailwind CSS 4 with tailwindcss-animate plugin — existing
- ✓ Custom font stack (Sora + JetBrains Mono via next/font) — existing

### Active

- [ ] **LENIS-01**: Lenis dependency installed and configured with standard settings (1x speed, natural easing)
- [ ] **LENIS-02**: Lenis smooth scrolling active on all routes (wired in root layout)
- [ ] **LENIS-03**: useRevealOnScroll refactored to use Lenis scroll events instead of IntersectionObserver for reveal animations
- [ ] **LENIS-04**: Lenis correctly managed across page navigation (cleanup on unmount, no duplicate instances)
- [ ] **LENIS-05**: No regressions on easter-egg pages (shell terminal scroll behavior unaffected)

### Out of Scope

- Custom Lenis speed/easing per section — defer to tuning phase if needed
- Scroll-triggered parallax or progress bars — not requested
- Horizontal scroll orientation — not applicable to this site

## Context

- Site is a static export (`output: "export"`) — no SSR, no API routes, no dynamic data
- Root layout (`app/layout.tsx`) is a server component — Lenis needs a client component wrapper
- Home page (`app/page.tsx`) is `"use client"` — manages theme state and renders all sections
- `useRevealOnScroll` is a custom hook in `lib/` — uses IntersectionObserver, fires once per element
- Lenis v1.x provides `lenis` npm package with React integration options
- All pages share a single scroll container — a single Lenis instance should suffice

## Constraints

- **Static export**: No server-side logic; Lenis must work entirely client-side
- **Next.js App Router**: Lenis must be properly cleaned up on route changes (useEffect return)
- **Browser compatibility**: Must work in modern browsers (Chrome, Firefox, Safari) per portfolio audience

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Lenis-driven reveals | Replace IntersectionObserver with Lenis scroll events for unified scroll control | — Pending |
| All routes | Consistent experience across entire site | — Pending |
| Standard config | No need for custom easing/speed at this stage | — Pending |
| Single Lenis instance | Single scroll container, no nested scroll areas | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-08 after initialization*
