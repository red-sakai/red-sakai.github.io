# Research Summary: Lenis Smooth Scroll for Next.js Portfolio

## Overview

Adding Lenis smooth scrolling to a Next.js 16 static portfolio. Lenis v1.3.23 (latest) from darkroom.engineering.

## Stack

| Technology | Version/Choice | Rationale |
|------------|---------------|-----------|
| Package | `lenis` (npm) | Includes `lenis/react` for React component integration |
| Framework | Next.js 16 App Router | Client component wrapper needed (`"use client"`) |
| React | React 19 | Lenis 1.x compatible |

## Integration Pattern

- Create `app/components/providers/lenis-provider.tsx` as a client component
- Wrap `<ReactLenis>` from `lenis/react` around `{children}` in root layout
- Options: `lerp: 0.1`, `duration: 1.2`, `smoothWheel: true` for standard config
- For Windows compatibility: use `lerp: 0.14` instead of default 0.1

## Key Findings

1. **Client component required**: Lenis needs `"use client"` directive — root layout is a server component, so the provider wraps content inside `<body>`
2. **`lenis/react` package**: Provides `<ReactLenis>` component with `root` prop and `options` — simplest setup
3. **Lenis events for reveals**: Lenis emits `scroll` event with `{velocity, direction, progress}` — can drive reveal animations by checking element positions relative to viewport
4. **`prefers-reduced-motion`**: Respect user preference — skip Lenis init if `prefers-reduced-motion: reduce`
5. **Easter-egg pages**: Use `data-lenis-prevent` attribute on terminal/shell containers to allow native scroll
6. **Static export**: No issues — Lenis is entirely client-side

## Pitfalls to Avoid

1. **Route change scroll reset**: Lenis owns scroll state — on route changes, manually call `lenis.scrollTo(0, { immediate: true })` to reset position
2. **Multiple instances**: Single scroll container means single Lenis instance — re-init on route change can cause duplicate instances; use ref to track
3. **Windows trackpads**: Default config tuned for macOS; Windows users may experience stutter — `lerp: 0.14` and `smoothWheel: true` mitigates this
4. **Canvas/Three.js interference**: The ShapeBlur component uses Three.js — Lenis should work alongside it since they don't share resources, but test interaction

## Recommended Config for This Project

```ts
{
  lerp: 0.1,
  duration: 1.2,
  smoothWheel: true,
  touchMultiplier: 1,
  wheelMultiplier: 1,
  autoRaf: true,      // handles requestAnimationFrame loop
  prevent: (node) => node.closest('[data-lenis-prevent]') !== null
}
```

## Lenis-Driven Reveals Strategy

Replace IntersectionObserver in `useRevealOnScroll`:
1. Use Lenis `scroll` event to check element positions
2. Calculate `getBoundingClientRect()` for each observed element
3. Trigger reveal when element enters viewport (top < window.innerHeight * 0.85)
4. Remove element from observed list once revealed (fire-once behavior preserved)
