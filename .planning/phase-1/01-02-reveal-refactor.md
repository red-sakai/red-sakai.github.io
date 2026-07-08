---
id: 01-02
wave: 2
autonomous: true
objective: Refactor useRevealOnScroll to use Lenis scroll events, preserve fire-once behavior
files_modified:
  - app/hooks/useRevealOnScroll.ts
task_count: 6
---

# Plan 1-02: Lenis-Driven Reveal Animations

## Objective

Refactor `useRevealOnScroll` to use Lenis scroll events instead of IntersectionObserver, preserving the same fade-in/slide-up behavior and fire-once semantics. All consuming components use the same API (`{ ref, visible }`) — no consumer changes needed.

## Tasks

### Task 2.1: Modify useRevealOnScroll signature

Change the hook to accept no IntersectionObserver options (Lenis handles scroll position instead). Keep the same return type `{ ref, visible }`.

### Task 2.2: Implement Lenis-driven reveal logic

The hook should:
1. Get the Lenis instance from a shared reference (expose `window.__lenis` or use context)
2. On Lenis `scroll` event, check each observed element's `getBoundingClientRect()`
3. Set `visible = true` when element top enters viewport (threshold ~85% from top of viewport)
4. Remove element from observed list once revealed (fire-once)
5. Clean up on unmount

Implementation approach using the `<ReactLenis>` ref:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export function useRevealOnScroll<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const checkVisibility = () => {
      if (visible) return;
      const rect = node.getBoundingClientRect();
      const threshold = window.innerHeight * 0.85;
      if (rect.top < threshold) {
        setVisible(true);
      }
    };

    // Lenis fires 'scroll' on the global instance via ReactLenis
    const handleLenisScroll = () => {
      checkVisibility();
    };

    // Also check on mount in case element is already visible
    checkVisibility();

    // Listen for Lenis scroll events on the global lenis instance
    // Access via the global reference that ReactLenis sets up
    const lenis = (window as unknown as { __lenis?: { on: (e: string, fn: () => void) => void; off: (e: string, fn: () => void) => void } }).__lenis;
    if (lenis) {
      lenis.on("scroll", handleLenisScroll);
    }

    return () => {
      if (lenis) {
        lenis.off("scroll", handleLenisScroll);
      }
    };
  }, [visible]);

  return { ref, visible } as const;
}
```

Wait — `ReactLenis` from `lenis/react` handles setting up the lenis instance internally. We need to access it. The preferred approach is to use the `useLenis` hook from `lenis/react`:

```tsx
import { useLenis } from "lenis/react";
```

This hook returns the Lenis instance directly inside any component rendered under `<ReactLenis>`. So the refactored hook can use `useLenis` to get the instance and listen for scroll events.

### Task 2.3: Update hook implementation

Rewrite `useRevealOnScroll.ts`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

export function useRevealOnScroll<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const checkVisibility = () => {
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const threshold = window.innerHeight * 0.85;
      if (rect.top < threshold) {
        setVisible(true);
      }
    };

    checkVisibility();

    if (lenis) {
      lenis.on("scroll", checkVisibility);
    }

    return () => {
      if (lenis) {
        lenis.off("scroll", checkVisibility);
      }
    };
  }, [lenis]);

  return { ref, visible } as const;
}
```

### Task 2.4: Verify all consumers compile

Consumers (EducationSection, ExperienceSection, ProjectsSection, CertificationsSection, Footer) all use `const { ref, visible } = useRevealOnScroll<HTMLElement>()` — same API, no changes needed.

Verify with `npx tsc --noEmit`.

### Task 2.5: Verify build + lint

```bash
npm run build && npm run lint
```

### Task 2.6: Commit all changes

```bash
git add -A && git commit -m "feat(1-02): refactor useRevealOnScroll to use Lenis scroll events"
```

## Success Criteria

- [ ] `useRevealOnScroll` uses `useLenis()` from `lenis/react` instead of IntersectionObserver
- [ ] Fire-once behavior preserved — revealed elements stay visible
- [ ] All 5 consumers work without modification
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
