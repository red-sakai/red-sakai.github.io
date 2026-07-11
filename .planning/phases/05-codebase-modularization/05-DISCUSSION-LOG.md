# Phase 5: Codebase Modularization - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-11
**Phase:** 5-Codebase-Modularization
**Areas discussed:** Target structure, Desktop namespace, CSS location, Migration strategy, Desktop components

---

## Target Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Standard Next.js pattern | `app/` for routes only — everything else at project root: lib/, hooks/, types/, utils/, components/ | ✓ |
| Feature-grouped | Keep desktop domain fully self-contained under `app/desktop/` | |
| Hybrid — clean up what's messy | Keep current structure but fix pain points | |

**User's choice:** Standard Next.js pattern
**Notes:** User wants `app/` for routes only, shared code at project root.

---

## Desktop Namespace (hooks/data)

| Option | Description | Selected |
|--------|-------------|----------|
| Merge into shared | All hooks in `hooks/`, all data in `data/` — simple flat structure | ✓ |
| Namespace by domain | `hooks/desktop/`, `data/desktop/` — keeps desktop concerns separate | |

**User's choice:** Merge into shared
**Notes:** Desktop hooks (useWindowManager, useDesktopSounds) and data (jhered-os-logo) merge into root-level shared directories.

---

## CSS Location

| Option | Description | Selected |
|--------|-------------|----------|
| Stay in app/ | Next.js convention — can stay at `app/globals.css` | ✓ |
| Move to styles/ at root | Keep app/ route-only | |

**User's choice:** Stay in app/
**Notes:** globals.css keeps its Next.js-conventional location.

---

## Migration Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Single bulk fix | One big commit with all moves + import updates | |
| Split into logical commits | Separate commits per domain (components, hooks, data, lib, types) | ✓ |
| Migrate incrementally | Move 2-3 files at a time across multiple sessions | |

**User's choice:** Split into logical commits
**Notes:** Cleaner history, easier to review.

---

## Desktop Components

| Option | Description | Selected |
|--------|-------------|----------|
| `components/desktop/` | Prefix with desktop/ to prevent name collisions | ✓ |
| Flat `components/` | Merge everything flat — simpler imports but risk of name conflicts | |

**User's choice:** `components/desktop/`
**Notes:** Names like ContextMenu, StartMenu, Window are too generic to put flat in components/.

---

## the agent's Discretion

- Import path aliases (e.g., `@/` for root-level dirs) can be added in tsconfig/next.config if helpful

## Deferred Ideas

None — discussion stayed within phase scope.
