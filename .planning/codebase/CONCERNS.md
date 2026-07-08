---
focus: concerns
last_mapped: 2026-07-08
---

# Concerns — red-sakai.github.io

## Technical Debt

### Placeholder Pages
- `/projects` and `/contact` pages render only the `NavbarCapsule` with no actual content. They are shell/placeholder pages:
  - `app/projects/page.tsx` — 11 lines, no project data rendered
  - `app/contact/page.tsx` — 11 lines, no contact form or details
- The main `/` page renders all sections including projects and contact via hash links, so these routes may be intentional shells for future use.

### Extensive `!important` in CSS
- Dark mode overrides throughout `app/globals.css` rely heavily on `!important` rules
- Section-specific selectors like `:root:not(.dark) #education .edu-card, :root:not(.dark) #education .edu-card *` create high-specificity tangles
- CSS maintenance burden grows with each new section or component

### Duplicate Theme State
- Each page manages its own `useState<"light"|"dark">` — no shared state management
- Theme state resets when navigating between pages (no persistence across routes)
- `/about` page reimplements the full theme toggle pattern separately from the home page

### `any` Type Usage
- `<model-viewer>` JSX declaration in `app/types/model-viewer.d.ts` uses `[key: string]: any` catch-all, bypassing type safety for custom element attributes

### Inline Audio Autoplay
- `app/page.tsx` plays `/audio/windows_startup.mp3` on mount with no user interaction requirement
- Browsers may block autoplay; the `.catch(() => {})` silently suppresses errors
- Consider user preference/accessibility implications

## No Testing
- Zero test coverage across the entire codebase
- No test framework, test files, or testing scripts exist
- Changes rely entirely on manual verification and build output

## Security

### No Hardcoded Secrets
- No API keys, tokens, or credentials found in codebase
- No `.env` files committed; `.env*` is gitignored

### Third-Party Script Loading
- `<model-viewer>` script loaded from unpkg CDN with no SRI hash or integrity check
- Adds a supply-chain dependency on unpkg availability

## Performance

### 3D Model Loading
- Two GLB files (`low_poly_sun.glb`, `low_poly_moon.glb`) loaded on the home page
- Model-viewer script (~400KB+) fetched at runtime from unpkg
- Both models present in DOM simultaneously; one is always off-screen (translated out)

### Star Field Animation
- Dark mode generates an inline star field via `radial-gradient` strings created in `requestAnimationFrame`
- Re-renders CSS `backgroundImage` on every theme toggle — acceptable but not optimized

## Browser Compatibility

- Static export + Tailwind ensures broad browser support
- `<model-viewer>` custom element requires WebGL — may not render on older devices
- Custom cursor on `/shell` page is `pointer-events: none` — accessible keyboard navigation unaffected but visual cursor will not appear on touch-only devices

## Maintainability

### JSON Content Growth
- `projects.json` already has 13 entries with images, links, and highlights
- No validation layer — malformed JSON will break the build at compile time

### CV File
- PDF in `public/JHERED_MIGUEL_REPUBLICA.pdf` must be manually regenerated and replaced
- No build step or automation for PDF generation

## Build Output Awareness

- `next build` outputs to `out/` (static export)
- `CNAME` file must be present in repo root for GitHub Pages custom domain
- `.nojekyll` file created during CI — must exist in `out/` for GitHub Pages to serve underscore-prefixed files
