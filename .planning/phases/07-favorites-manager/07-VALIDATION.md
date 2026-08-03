---
phase: 7
slug: favorites-manager
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-26
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None (static site — no test framework configured) |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** `npm run build`
- **After every plan wave:** `npm run build && npm run lint`
- **Before verification:** Full build must succeed
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| — | 01 | 1 | — | T-7-01 / — | N/A | build | `npm run build` | — | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new test framework needed.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Admin mode unlock via login secret | Cross-phase (Phase 6) | Requires UI interaction; no E2E framework | 1. Visit /desktop, login with secret password. 2. Open Favorites — verify Add/Edit/Delete appear. 3. Relogin without secret — verify read-only |
| Add/Edit/Delete favorite via Win98 modal | D-08, D-09, D-10 | Modal UI interaction | 1. In admin mode, click "+ Add". 2. Fill form, save — verify entry appears in grid. 3. Edit — verify modal pre-fills. 4. Delete — verify confirmation + removal |
| localStorage persistence | D-01 | Storage state must survive reload | 1. Add entries. 2. Refresh page. 3. Verify entries persist. 4. Clear localStorage — verify empty state |
| Image URL input | D-11 | URL rendering | 1. Add entry with image URL. 2. Verify cover image displays. 3. Add without URL — verify gradient fallback |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
