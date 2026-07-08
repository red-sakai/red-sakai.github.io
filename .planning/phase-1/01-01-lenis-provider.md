---
id: 01-01
wave: 1
autonomous: true
objective: Install Lenis, create provider component, wire into root layout
files_modified:
  - package.json
  - app/layout.tsx
  - app/components/providers/LenisProvider.tsx
  - app/shell/page.tsx
task_count: 7
---

# Plan 1-01: Lenis Provider + Layout Wiring

## Objective

Install the `lenis` npm package, create a `LenisProvider` client component with standard config, wrap the root layout, and handle initial edge cases.

## Tasks

### Task 1.1: Install lenis

```bash
npm install lenis
```

### Task 1.2: Create LenisProvider component

Create `app/components/providers/LenisProvider.tsx`:

```tsx
"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function LenisProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<{ lenis?: { scrollTo: (y: number, opts: { immediate: boolean }) => void; destroy: () => void } }>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
  }, []);

  useEffect(() => {
    lenisRef.current?.lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        touchMultiplier: 1,
        wheelMultiplier: 1,
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
```

### Task 1.3: Wire LenisProvider into root layout

Edit `app/layout.tsx` — wrap `<body>` children with `<LenisProvider>`.

### Task 1.4: Add data-lenis-prevent to shell page

Edit `app/shell/page.tsx` — add `data-lenis-prevent` to the terminal container div so native scroll works inside the terminal.

### Task 1.5: prefers-reduced-motion support

LenisProvider already checks `prefers-reduced-motion: reduce` and skips initialization — verify it works correctly.

### Task 1.6: Verify lenis type imports resolve

Run `npx tsc --noEmit` to catch any type issues.

### Task 1.7: Commit all changes

```bash
git add -A && git commit -m "feat(1-01): install lenis and wire global smooth scroll provider"
```

## Success Criteria

- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] All routes scroll smoothly via Lenis
- [ ] `data-lenis-prevent` prevents smooth scroll on shell terminal
- [ ] `prefers-reduced-motion: reduce` users get native scroll
- [ ] Route changes reset scroll to top
