---
phase: 2
slug: retro-desktop-mode
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-10
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — no test framework configured per AGENTS.md |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run lint`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | DESKTOP-02, DESKTOP-05 | — | N/A | build | `npm run build` | — | ⬜ pending |
| 02-02-01 | 02 | 1 | DESKTOP-03, DESKTOP-04 | — | N/A | build | `npm run build` | — | ⬜ pending |
| 02-03-01 | 03 | 1 | DESKTOP-06 | — | N/A | build | `npm run build` | — | ⬜ pending |
| 02-04-01 | 04 | 1 | DESKTOP-07 | — | N/A | build | `npm run build` | — | ⬜ pending |
| 02-05-01 | 05 | 2 | DESKTOP-08 | — | N/A | build | `npm run build` | — | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements — no test framework to install. All features verified via build + lint + manual testing.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Wallpaper display (presets, import, fit modes) | DESKTOP-02, DESKTOP-07 | Visual — wallpaper rendering requires human eyes | Open Control Panel, select each wallpaper type and fit mode. Verify correct display. |
| iframe browser loads external URLs | DESKTOP-07 | Browser security — X-Frame-Options behavior is browser-dependent | Open Internet Explorer, type a URL, verify iframe loads or shows blocked fallback. |
| Sound effects play | DESKTOP-08 | Auditory — requires human ears | Open programs, verify startup chime, window sounds, click sounds play correctly. |
| Draggable/resizable windows | DESKTOP-06 | Interactive behavior — requires physical drag/resize gestures | Drag windows by titlebar, resize via southeast handle, verify z-order on click. |
| Context menu shows only Refresh | DESKTOP-02 | Visual — verify menu contents | Right-click desktop, verify only "Refresh" appears. |
| Color scheme changes titlebars | DESKTOP-02 | Visual — verify CSS variable application | Change color scheme in Control Panel, verify titlebars and taskbar update. |

---

## Validation Sign-Off

- [ ] All tasks have `npm run build` verify
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
