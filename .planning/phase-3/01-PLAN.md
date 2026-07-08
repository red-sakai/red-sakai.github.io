---
phase: 3
plan: 01
wave: 1
objective: Add "My Portfolio" desktop shortcut and pixel-art portfolio viewer
files_modified:
  - app/layout.tsx
  - app/desktop/components/DesktopShell.tsx
  - app/desktop/components/programs/PortfolioViewer.tsx
  - app/desktop/desktop.css
---

## Objective

Add a "My Portfolio" desktop icon on the retro desktop that opens a pixel-art-styled viewer showing the portfolio content (education, experience, projects, certifications) from JSON data files.

## Tasks

### Task 1: Add Press Start 2P pixel font

- Import `Press_Start_2P` from `next/font/google` in `app/layout.tsx`
- Add it as a CSS variable `--font-pixel` alongside existing Sora and JetBrains Mono

### Task 2: Create PortfolioViewer program

- Create `app/desktop/components/programs/PortfolioViewer.tsx`
- Tab-based layout: Education | Experience | Projects | Certifications
- Read JSON data from `app/data/` files
- Pixel-art aesthetic:
  - `Press Start 2P` for section headings
  - `JetBrains Mono` for body text at small sizes
  - Dark retro background with grid pattern
  - `image-rendering: pixelated` on images
  - Solid 2px borders, no border-radius
  - Retro color palette (green/amber/white on dark bg)
  - CRT scanline overlay effect

### Task 3: Wire desktop icon

- Add `"portfolio"` to `programList` and `desktopIcons` in DesktopShell.tsx
- Add case for `"portfolio"` in `renderProgram` switch
- Import PortfolioViewer component

### Task 4: Add pixel-art CSS

- Add scanline and grid overlay styles for the PortfolioViewer
- Add pixel-perfect border utility styles to `desktop.css`
