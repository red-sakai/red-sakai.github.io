---
focus: quality
last_mapped: 2026-07-08
---

# Testing — red-sakai.github.io

## Test Framework

**No test framework is configured.** The project has no test runner, no test files, and no testing dependencies in `package.json`.

## What Exists

| Aspect | Status |
|--------|--------|
| Unit tests | None |
| Integration tests | None |
| E2E tests | None |
| Snapshot tests | None |
| Component tests | None |

## CI Verification

The CI pipeline (`.github/workflows/deploy.yml`) only runs:
1. `npm ci` — install dependencies
2. `npm run build` — static export build

There is no `npm test` step in CI.

## Linting

ESLint (`eslint-config-next` with `core-web-vitals` + `typescript` preset) is the only automated quality check. Run with:

```bash
npm run lint
```

## Type Checking

TypeScript compilation (`tsc`) runs implicitly during `next build`. There is no standalone `npm run typecheck` command.

## Recommended Test Strategy

If testing is added in the future:
- **React Testing Library** would be the natural fit for component tests
- **Playwright** or **Cypress** for E2E if needed
- Testing should focus on data rendering (JSON → component) and theme toggling
- The easter-egg pages (`/shell`, `/grub-bootloader`, `/gui-loading`) are low-priority for test coverage
