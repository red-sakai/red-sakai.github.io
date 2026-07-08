# Roadmap: jhered.me Portfolio — Lenis Smooth Scroll

## Phase Overview

**1 phase** | **13 requirements mapped** | All v1 requirements covered ✓

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Lenis Integration | Install Lenis, wire globally, refactor reveals to use Lenis scroll events | LENIS-01–04, REVEAL-01–04, COMPAT-01–05 | 7 |

### Phase 1: Lenis Integration

**Goal:** Smooth scrolling across all portfolio routes with Lenis-driven reveal animations.

**Requirements:** LENIS-01, LENIS-02, LENIS-03, LENIS-04, REVEAL-01, REVEAL-02, REVEAL-03, REVEAL-04, COMPAT-01, COMPAT-02, COMPAT-03, COMPAT-04, COMPAT-05

**Success Criteria:**
1. Scrolling on all pages uses Lenis smooth scroll (lerp 0.1, duration 1.2)
2. `useRevealOnScroll` fires reveals based on Lenis scroll position, not IntersectionObserver
3. Scroll behavior feels natural on both macOS and Windows inputs
4. `prefers-reduced-motion` users get native scroll (Lenis skipped)
5. `/shell` terminal remains natively scrollable (`data-lenis-prevent`)
6. Route changes reset scroll to top
7. `npm run build` succeeds with zero errors
8. `npm run lint` passes with zero errors
