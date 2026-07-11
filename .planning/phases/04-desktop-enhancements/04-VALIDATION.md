---
phase: 4
slug: desktop-enhancements
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-11
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None (static export) |
| **Config file** | N/A |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every plan wave:** Run `npm run build`
- **Before plan completion:** Run `npm run lint && npm run build`
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | DESKTOP-10 | T-04-01 / — | URL sanitization preserves existing pattern | manual | `npm run build` | ✅ | ⬜ pending |
| 04-01-02 | 01 | 1 | DESKTOP-12 | — / — | N/A | manual | `npm run build` | ✅ | ⬜ pending |
| 04-02-01 | 02 | 1 | DESKTOP-09 | — / — | N/A | visual | `npm run build` | ✅ | ⬜ pending |
| 04-03-01 | 03 | 1 | DESKTOP-13 | — / — | iframe sandbox restrictions preserved | visual | `npm run build` | ✅ | ⬜ pending |
| 04-03-02 | 03 | 1 | DESKTOP-11 | — / — | N/A | visual | `npm run build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Context menu shows full Win98 items with hover submenus | DESKTOP-09 | Visual UX behavior | Right-click desktop → verify View, Sort By, Refresh, Paste, New, Properties, Display Settings appear; hover View → submenu appears with Large/Small/List/Details |
| IE loads pages without false 10s blocked state | DESKTOP-10 | Browser behavior | Open IE, navigate to a valid URL → verify page loads before 10s timer fires; verify "blocked" only shows for actual frame-blocked sites |
| IE desktop icon renders as pixel art | DESKTOP-11 | Visual design | Desktop shows IE icon with pixel-art styling; double-click opens IE |
| Start Menu omits About Me | DESKTOP-12 | Visual | Open Start Menu → verify no "About Me" item |
| Shut Down shows confirmation | DESKTOP-12 | UX behavior | Click Shut Down → verify confirmation dialog appears; OK → navigates to GRUB |
| Game Station lists games and launches | DESKTOP-13 | Integration behavior | Open Game Station → verify Resident Evil listed; click → iframe loads archive.org DOSBox |

---

## Validation Sign-Off

- [ ] All tasks have either automated verify or manual instructions
- [ ] Sampling continuity: no 3 consecutive tasks without manual verify instructions
- [ ] Wave 0 not needed (no test framework in project)
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
