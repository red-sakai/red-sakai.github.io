# Phase 2: Retro Desktop Mode - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-10
**Phase:** 2-Retro Desktop Mode
**Areas discussed:** Wallpaper System, Browser Program, Context Menu Cleanup, Control Panel Scope

---

## Wallpaper System

| Option | Description | Selected |
|--------|-------------|----------|
| Folder-based | Create public/wallpapers/ folder with image files scanned as presets | |
| User import only | File picker, stored as base64 in localStorage | |
| Both folder + import | Presets from folder AND import button | ✓ |

**User's choice:** Both folder + import
**Notes:** User wants preset wallpapers folder AND ability to import custom images

| Option | Description | Selected |
|--------|-------------|----------|
| Tile + Center + Stretch | Win98-style fit mode options | ✓ |
| Fill only | Simple fill, no fit options | |
| Let the agent decide | Agent picks best approach | |

**User's choice:** Tile + Center + Stretch
**Notes:** Authentic Win98 fit behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, keep teal default | #008080 as fallback | ✓ |
| No, first image | Default to first image in folder | |

**User's choice:** Yes, keep teal default

| Option | Description | Selected |
|--------|-------------|----------|
| localStorage | Base64 in localStorage, persists | ✓ |
| Session only | Lost on refresh | |

**User's choice:** localStorage

---

## Browser Program

| Option | Description | Selected |
|--------|-------------|----------|
| Browse portfolio pages | iframe loads existing portfolio pages | |
| Browse portfolio data | File-browser-style viewer of JSON content | |
| Both | Both modes available | |

**User's choice:** (freeform) "the my portfolio shortcut on the desktop already does that, i wanted it to be something else"
**Notes:** User clarified that PortfolioViewer already covers content browsing. Redirected to new idea.

| Option | Description | Selected |
|--------|-------------|----------|
| Browse external sites in iframe | Address bar + iframe loading any URL | ✓ |
| Retro 'Web' browsing portfolio pages | IE clone browsing own pages | |
| Something else | User describes own idea | |

**User's choice:** Browse external sites in iframe

| Option | Description | Selected |
|--------|-------------|----------|
| Full IE clone | Address bar, back/forward, refresh, stop, home | ✓ |
| Minimal | Just address bar + iframe | |

**User's choice:** Full IE clone

| Option | Description | Selected |
|--------|-------------|----------|
| About:Blank | Blank start page | ✓ |
| Portfolio homepage | Loads jhered.me initially | |

**User's choice:** About:Blank

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-prepend https:// | Forces HTTPS | ✓ |
| Accept any protocol | User types whatever | |

**User's choice:** Auto-prepend https://

---

## Context Menu Cleanup

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, only Refresh | Strip everything else | ✓ |
| Keep Refresh + Properties | Also keep Properties option | |

**User's choice:** Yes, only Refresh

---

## Control Panel Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Color scheme | Win98 classic color schemes | ✓ |
| Screen resolution | Faux resolution picker | ✓ |
| Mouse settings | Swap buttons, double-click speed | ✓ |
| Desktop icon visibility | Toggle which icons show | ✓ |

**User's choice:** All four selected

| Option | Description | Selected |
|--------|-------------|----------|
| Gallery grid + Import button | Grid of presets with Import button | ✓ |
| Tabbed | Separate Background and Browse tabs | |

**User's choice:** Gallery grid + Import button

| Option | Description | Selected |
|--------|-------------|----------|
| Both desktop + titlebars | Color scheme affects entire chrome | ✓ |
| Desktop only | Only background accents | |

**User's choice:** Both desktop + titlebars

---

## the agent's Discretion

No areas deferred to agent discretion — all decisions made by user.

## Deferred Ideas

None — discussion stayed within phase scope.
