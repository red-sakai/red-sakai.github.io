---
phase: 3
plan: 02
wave: 2
objective: Refactor PortfolioViewer to use PixelatedWrapper with real portfolio sections
files_modified:
  - app/desktop/components/programs/PixelatedWrapper.tsx
  - app/desktop/components/programs/PortfolioViewer.tsx
  - app/desktop/desktop.css
---

## Objective

Replace the custom pixel-art card rendering with a `PixelatedWrapper` that wraps the real portfolio section components (EducationSection, ExperienceSection, ProjectsSection, CertificationsSection) and applies pixelation CSS effects.

## Tasks

### Task 1: Create PixelatedWrapper
- Wraps children with pixelated CSS: Press Start 2P font, `image-rendering: pixelated`, CRT scanline overlay, grid overlay
- Strips rounded corners, shadows, blur from wrapped content

### Task 2: Rewrite PortfolioViewer
- Import real section components from `app/components/sections/`
- Render inside PixelatedWrapper with tab navigation
- Keep retro titlebar and statusbar

### Task 3: Update CSS
- Add `.pixelated-wrapper` class for image pixelation and font forcing
- Remove unused `.pixel-card-*` classes
