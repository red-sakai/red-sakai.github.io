# Roadmap: jhered.me Portfolio — Retro Desktop Mode

## Phase Overview

**2 phases** | **21 requirements mapped** | Phase 1 complete ✓

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Lenis Integration | Install Lenis, wire globally, refactor reveals to use Lenis scroll events | LENIS-01–04, REVEAL-01–04, COMPAT-01–05 | 8 |
| 2 | Retro Desktop Mode | Win98-style retro desktop at `/desktop` with GRUB bootloader, interactive programs, sounds | DESKTOP-01–08 | 6 |

### Phase 1: Lenis Integration ✅

**Goal:** Smooth scrolling across all portfolio routes with Lenis-driven reveal animations.

**Status:** Complete — all 13 requirements delivered and verified.

### Phase 2: Retro Desktop Mode

**Goal:** A fully interactive Windows 98-style retro desktop experience at `/desktop`, accessible from a redesigned GRUB bootloader with "Normal Mode" and "Retro Desktop Mode" options.

**Requirements:** DESKTOP-01, DESKTOP-02, DESKTOP-03, DESKTOP-04, DESKTOP-05, DESKTOP-06, DESKTOP-07, DESKTOP-08

**Success Criteria:**
1. GRUB bootloader offers Normal Mode (→ existing portfolio) and Retro Desktop Mode (→ `/desktop`)
2. `/desktop` route renders a Win98 desktop with taskbar, start menu, desktop icons, and draggable windows
3. At least 4 programs work: About Me (notepad), File Explorer, Paint clone, Control Panel
4. Windows are draggable, resizable, minimize/maximize/close functional
5. Startup chime and UI sound effects via Web Audio API
6. `npm run build` succeeds with zero errors
