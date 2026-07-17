# Phase 4: Desktop Enhancements - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-17
**Phase:** 4-desktop-enhancements
**Areas discussed:** Route placement, User Picture, Transition, Button style, Easter egg

---

## Route Placement

| Option | Description | Selected |
|--------|-------------|----------|
| New /login route | Separate route, bookmarkable | |
| Inline in desktop-loading | Login at end of BIOS boot sequence | |
| Part of DesktopShell | DesktopShell shows login as first state | ✓ |

**User's choice:** Part of DesktopShell
**Notes:** Login screen sits inside DesktopShell as an intermediate state between BIOS boot and desktop render.

## User Picture

| Option | Description | Selected |
|--------|-------------|----------|
| Existing public/picture.jpg | Real photo in retro frame | |
| Pixel-art inline SVG | Retro user silhouette drawn with SVG | |
| Win98-style user icon | Classic Windows user silhouette | ✓ |

**User's choice:** Win98-style user icon
**Notes:** Generic silhouette icon, matching the classic Win98 login aesthetic.

## Transition

| Option | Description | Selected |
|--------|-------------|----------|
| Direct navigation | Press Enter → immediately go to desktop | |
| Loading personal settings | Brief "Loading your personal settings..." animation | ✓ |
| Fade transition | Login fades out, desktop fades in | |

**User's choice:** Loading personal settings
**Notes:** Like real Win98 user login — brief loading screen before desktop appears.

## Button Style

| Option | Description | Selected |
|--------|-------------|----------|
| OK + Cancel buttons | Full Win98 login dialog with OK/Cancel | ✓ |
| Just Enter to submit | No buttons, press Enter to proceed | |

**User's choice:** OK + Cancel buttons
**Notes:** Cancel navigates back to /grub-bootloader.

## Easter Egg

| Option | Description | Selected |
|--------|-------------|----------|
| No Easter egg | Simple login, any password works | ✓ |
| Fun message on specific pw | Hidden message for specific password | |
| Different pic per password | Different icon depending on password | |

**User's choice:** No Easter egg
**Notes:** Simple login flow, no hidden behavior.

---

## Deferred Ideas

- Games beyond Resident Evil — add as data entries when desired
- Start Menu submenus (Programs > Accessories) — not requested
- Keyboard navigation in context menu — not requested
- Drag-to-rearrange icons — not requested
- GRUB boot animation polish — not requested
- Login Easter egg for specific passwords — not requested
