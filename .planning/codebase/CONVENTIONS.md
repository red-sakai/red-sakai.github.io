---
focus: quality
last_mapped: 2026-07-08
---

# Conventions — red-sakai.github.io

## Code Style & Formatting

- **Language**: TypeScript with strict mode enabled
- **Component pattern**: Arrow function exports for section components, default exports for page components
- **CSS**: Tailwind utility classes exclusively — no module CSS files, no styled-components
- **CSS-in-JS**: Inline `style` props used sparingly for dynamic values (e.g., `backgroundColor` during theme transitions)

## Component Patterns

### Client Components
All interactive components use `"use client"` directive at the top:
```tsx
"use client";
import { useState, useEffect } from "react";
```

### Section Components
- Receive `theme` and `onThemeToggle` props from parent page
- Use the custom `useRevealOnScroll` hook for scroll-triggered fade-in
- Follow transition pattern: `opacity-0 translate-y-6` → `opacity-100 translate-y-0` on visibility

```tsx
export function EducationSection() {
  const { ref, visible } = useRevealOnScroll<HTMLElement>();
  return (
    <section
      ref={ref}
      className={"transition-all duration-700 " + (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}
    >
```

### Navbar Component
- `NavbarCapsule` is shared across all pages
- Accepts `items`, `theme`, `onThemeToggle` props
- Has default items array for standard navigation
- Manages mobile menu state inline

## Imports Pattern

```
1. Type imports  (import type { ... })
2. React/hooks imports
3. Next.js imports (Link, useRouter, Image, Script)
4. Local component imports
5. Data imports (JSON files)
6. Utility/hook imports
```

## CSS Conventions

### Tailwind v4 Syntax
```css
@import "tailwindcss";
@plugin "tailwindcss-animate";
@custom-variant dark (&:is(.dark *));
```

### Dark Mode
- Applied via `class` strategy on `<html>` element
- Per-page management: each page has its own `useState<"light"|"dark">`
- Global CSS variables defined in `:root` and `.dark` blocks
- Section-specific dark mode overrides use `!important` extensively (e.g., `.dark #education .edu-card`)

### CSS Variables
- shadcn/ui-style CSS variable naming: `--background`, `--foreground`, `--card`, etc.
- `@theme inline` block maps CSS variables to Tailwind theme tokens

## Deprecated Animations
Custom `@keyframes` defined in `app/globals.css`:
- `starTwinkle` — dark mode star field
- `floatPulse` — "Learn More" prompt
- `carousel-in-right/left`, `carousel-out-left/right` — project carousel
- `terminal-pop` — terminal profile reveal
- `shutdown-screen`, `shutdown-flash` — bootloader shutdown animation

## Error Handling
- Minimal error boundaries — no React error boundaries observed
- Audio play uses `.catch(() => {})` to suppress autoplay errors
- Optional chaining and null checks used for ref-based DOM access

## Exports
- Named exports for section components (`export function Hero`)
- Default exports for page components and `TerminalNavbar`
- `cn()` utility is a named export

## File Organization
- One component per file
- Component files named after the exported component (PascalCase)
- JSON data files imported as default imports
