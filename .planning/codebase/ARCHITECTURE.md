---
focus: arch
last_mapped: 2026-07-08
---

# Architecture — red-sakai.github.io

## Pattern

Single-page portfolio with multi-page routes. The site is a **static Next.js export** — no server-side rendering, no API routes, no dynamic data fetching. All content is compiled at build time.

## High-Level Layout

```
app/                    ← App Router routes + components + data
public/                 ← Static assets (images, 3D models, CV PDF, audio)
lib/                    ← Shared utilities
```

## Data Flow

```
JSON files (app/data/*.json)
    ↓ imported directly
React components (app/components/sections/*.tsx)
    ↓ rendered at build time
static HTML (out/*.html)
```

- No data fetching at runtime
- JSON is imported using ES module `import` from `app/data/` — no fetch, no API
- Theme state (`"light" | "dark"`) managed via `useState` in each page, toggled by user and applied as `class` on `<html>`

## Routes

| Path | Component | Type |
|------|-----------|------|
| `/` | `app/page.tsx` | Single-page layout with hash-linked sections |
| `/about` | `app/about/page.tsx` | Static info page with hardcoded data |
| `/projects` | `app/projects/page.tsx` | Shell page (placeholder — content populated via JSON) |
| `/contact` | `app/contact/page.tsx` | Shell page (placeholder) |
| `/shell` | `app/shell/page.tsx` | Interactive terminal emulator (easter egg) |
| `/gui-loading` | `app/gui-loading/page.tsx` | Boot animation → redirects to `/` (easter egg) |
| `/grub-bootloader` | `app/grub-bootloader/page.tsx` | GRUB-style boot selector (easter egg) |

## Entry Points

- **Root layout**: `app/layout.tsx` — sets up fonts, `<Script>` for model-viewer, `<html>` wrapper
- **Home page**: `app/page.tsx` — "use client", manages theme, renders Hero + sections + Footer
- **Global CSS**: `app/globals.css` — Tailwind v4 imports, CSS variables, keyframes, dark overrides

## Layers

### Presentation Layer
- `app/components/sections/` — 7 section components (Hero, NavbarCapsule, Education, Experience, Projects, Certifications, Footer)
- `app/components/ui/` — 2 reusable UI components (ShapeBlur, TerminalNavbar)

### Data Layer
- `app/data/*.json` — 4 JSON files consumed by section components

### Routing Layer
- Standard Next.js App Router file-based routing

## Key Architectural Decisions

1. **Static export** — No SSR needed for a portfolio. Simplifies hosting (GitHub Pages).
2. **JSON content** — Simple, version-controlled, no CMS overhead. Easy to edit.
3. **Client components** — Theme toggle, scroll animations, and 3D interactions all require browser APIs.
4. **Hash-linked sections** — Home page uses `#education`, `#experience`, `#projects`, `#certifications`, `#footer` for single-page navigation.
5. **Custom 3D** — `<model-viewer>` web component for the Hero's sun/moon, Three.js only for `ShapeBlur` cursor effect on the shell page.

## Easter-Egg Flow

```
/grub-bootloader  →  selects GUI/Shell
    ├── GUI  →  /gui-loading  →  / (auto-redirect after 1.8s)
    └── Shell →  /shell  (terminal emulator)
                    ├── "exit" →  /
                    └── "shutdown" →  /grub-bootloader
```
