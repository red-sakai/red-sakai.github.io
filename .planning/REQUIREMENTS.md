# Requirements: jhered.me Portfolio

**Defined:** 2026-07-08
**Core Value:** Provide a fast, visually clean portfolio that showcases Jhered's work and lets visitors explore with a smooth, polished experience.

## v1 Requirements

### Lenis Smooth Scroll

- [ ] **LENIS-01**: Lenis installed via `npm install lenis`
- [ ] **LENIS-02**: Client provider component wraps root layout with `<ReactLenis>` from `lenis/react`
- [ ] **LENIS-03**: Standard config applied (lerp: 0.1, duration: 1.2, smoothWheel: true, autoRaf: true)
- [ ] **LENIS-04**: `prefers-reduced-motion` respected — Lenis skipped when user prefers reduced motion

### Lenis-Driven Reveal Animations

- [ ] **REVEAL-01**: `useRevealOnScroll` refactored to use Lenis `scroll` event instead of IntersectionObserver
- [ ] **REVEAL-02**: Elements revealed when they enter viewport (threshold ~85% from top)
- [ ] **REVEAL-03**: Fire-once behavior preserved — revealed elements stay revealed
- [ ] **REVEAL-04**: Fade-in/slide-up animation styling preserved from current implementation

### Compatibility

- [ ] **COMPAT-01**: Easter-egg pages (`/shell`, `/grub-bootloader`, `/gui-loading`) use `data-lenis-prevent` to allow native scroll
- [ ] **COMPAT-02**: Route changes reset scroll position correctly
- [ ] **COMPAT-03**: Three.js ShapeBlur component works correctly alongside Lenis
- [ ] **COMPAT-04**: Build succeeds (`npm run build`) with no errors or warnings
- [ ] **COMPAT-05**: No lint regressions (`npm run lint` passes)

## v2 Requirements

- **LENIS-06**: Custom speed/easing per section
- **LENIS-07**: Scroll progress indicator driven by Lenis

### Retro Desktop Mode

- [ ] **DESKTOP-01**: GRUB bootloader redesigned with CRT scanline effects, offering "Normal Mode" and "Retro Desktop Mode" as two boot options
- [ ] **DESKTOP-02**: `/desktop` route renders a Windows 98-inspired desktop with classic teal wallpaper (#008080), desktop icons, taskbar, and start menu
- [ ] **DESKTOP-03**: Taskbar displays at bottom with Start button, open window buttons, system tray with clock
- [ ] **DESKTOP-04**: Start menu opens on Start button click with program list and "Shut Down..." option; closes on outside click
- [ ] **DESKTOP-05**: Desktop icons (My Computer, Projects, About Me, Paint, Control Panel) open corresponding programs on double-click
- [ ] **DESKTOP-06**: Windows are draggable, resizable (via southeast handle), with minimize/maximize/close buttons; z-order management on focus
- [ ] **DESKTOP-07**: Four programs functional: About Me (notepad with bio), File Explorer (browses portfolio data), Paint (canvas drawing with colors), Control Panel (appearance settings)
- [ ] **DESKTOP-08**: Retro sound effects via Web Audio API — startup chime, window open/close, click, error beep; responsive adaptation for mobile

### Desktop Enhancements (Phase 4)

- [ ] **DESKTOP-09**: Right-click context menu restored with full Win98 items: View (Large Icons, Small Icons, List, Details), Sort By (Name, Size, Type, Date Modified), Refresh, Paste, New (Folder, Text Document), Properties, Display Settings; hover-to-open submenus
- [ ] **DESKTOP-10**: Internet Explorer bugfix — 10-second blocked timer only triggers if loading is still active; stale closure bug in history navigation fixed
- [ ] **DESKTOP-11**: Internet Explorer appears as a pixel-art desktop icon (5th icon); double-click launches IE program
- [ ] **DESKTOP-12**: Start Menu cleanup — "About Me" item removed; "Shut Down..." shows confirmation dialog before navigating to GRUB
- [ ] **DESKTOP-13**: "Game Station" program window lists available DOS games; clicking a game opens archive.org DOSBox emulator in iframe; first game: Resident Evil

## Out of Scope

| Feature | Reason |
|---------|--------|
| GSAP integration | Not requested; Lenis scroll events suffice for reveals |
| Parallax effects | Not requested for this iteration |
| Horizontal scroll | Not applicable to this portfolio |
| Scroll snapping | Not requested |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| LENIS-01 | Phase 1 | Complete |
| LENIS-02 | Phase 1 | Complete |
| LENIS-03 | Phase 1 | Complete |
| LENIS-04 | Phase 1 | Complete |
| REVEAL-01 | Phase 1 | Complete |
| REVEAL-02 | Phase 1 | Complete |
| REVEAL-03 | Phase 1 | Complete |
| REVEAL-04 | Phase 1 | Complete |
| COMPAT-01 | Phase 1 | Complete |
| COMPAT-02 | Phase 1 | Complete |
| COMPAT-03 | Phase 1 | Complete |
| COMPAT-04 | Phase 1 | Complete |
| COMPAT-05 | Phase 1 | Complete |
| DESKTOP-01 | Phase 2 | Pending |
| DESKTOP-02 | Phase 2 | Pending |
| DESKTOP-03 | Phase 2 | Pending |
| DESKTOP-04 | Phase 2 | Pending |
| DESKTOP-05 | Phase 2 | Pending |
| DESKTOP-06 | Phase 2 | Pending |
| DESKTOP-07 | Phase 2 | Pending |
| DESKTOP-08 | Phase 2 | Pending |
| DESKTOP-09 | Phase 4 | Pending |
| DESKTOP-10 | Phase 4 | Pending |
| DESKTOP-11 | Phase 4 | Pending |
| DESKTOP-12 | Phase 4 | Pending |
| DESKTOP-13 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 13 total
- v2 requirements: 2 total (carried forward)
- v2 phase requirements: 8 total
- Phase 4 requirements: 5 total
- Mapped to phases: 28
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-08*
*Last updated: 2026-07-11 — Phase 4 added*
