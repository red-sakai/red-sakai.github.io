# Phase 7: Favorites Manager - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-26
**Phase:** 7-Favorites Manager
**Areas discussed:** Persistence Strategy, Edit UI Pattern, Image Handling

---

## Persistence Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Seed from JSON | Copy data/favorites.json to localStorage on first visit | |
| Start empty | Begin with an empty list, add everything manually | ✓ |
| localStorage only | Same pattern as wallpapers/settings | ✓ |
| localStorage + Download-as-JSON | Edits saved + export button | |

**User's choice:** Start empty, localStorage only
**Notes:** User also introduced the concept of admin mode — a secret password at the login screen that grants editing privileges. This is a cross-phase dependency with Phase 6.

| Option | Description | Selected |
|--------|-------------|----------|
| Session-based admin | Stay in admin until window close or refresh | ✓ |
| Per-action admin | Prompt for password on each edit | |

**User's choice:** Session-based admin mode, auto-detected from login screen secret password

---

## Edit UI Pattern

| Option | Description | Selected |
|--------|-------------|----------|
| Unlock button in window | Small unlock button in Favorites toolbar → password prompt | |
| Auto-detect from login | If secret password used at login, admin mode is active | ✓ |

**User's choice:** Auto-detect from login screen

| Option | Description | Selected |
|--------|-------------|----------|
| Win98 modal dialog | Raised borders, titlebar, OK/Cancel | ✓ |
| Inline editing | Fields editable directly in grid | |

**User's choice:** Win98 modal dialog

| Option | Description | Selected |
|--------|-------------|----------|
| All fields | Title, category, rating, thoughts, image URL | ✓ |
| Simplified | Title, category, rating only | |

**User's choice:** All fields editable

---

## Image Handling

| Option | Description | Selected |
|--------|-------------|----------|
| URL input | Paste an image URL | ✓ |
| File upload → base64 | Pick file, stored as base64 | |
| Skip images | No image field at all | |

**User's choice:** URL input only

---

## Deferred Ideas

- Data export/import (download JSON backup) — not a priority
- Dynamic categories beyond anime/manhwa/game — not requested
- Seed migration from existing JSON file — user wants to start empty
