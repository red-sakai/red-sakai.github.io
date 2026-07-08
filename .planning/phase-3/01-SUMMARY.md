# Plan 01 Summary: Portfolio Desktop Shortcut

## Objective

Add a "My Portfolio" desktop icon on the retro desktop that opens a pixel-art-styled portfolio viewer.

## Tasks

### Task 1: Add Press Start 2P pixel font
- Imported `Press_Start_2P` from `next/font/google` in `app/layout.tsx`
- Added as CSS variable `--font-pixel` alongside existing Sora and JetBrains Mono

### Task 2: Create PortfolioViewer program
- Created `app/desktop/components/programs/PortfolioViewer.tsx`
- 4-tab layout: Education, Experience, Projects, Certifications
- Reads from JSON data files in `app/data/`
- Pixel-art aesthetic: Press Start 2P for headers, JetBrains Mono body text, CRT scanline overlay, grid pattern background, retro green-on-dark palette, pixel-perfect borders

### Task 3: Wire desktop icon
- Added "My Portfolio" to `programList` and `desktopIcons` (first position)
- Registered `"portfolio"` in `renderProgram` switch
- Updated `useWindowManager` component union type and title/icon mappings

### Task 4: Add pixel-art CSS
- Added scanline overlay, grid overlay, card, tab, tag, link, and status badge styles to `desktop.css`

## Verification

- `npm run lint` — 0 errors
- `npm run build` — compiles clean, 14 static pages generated
