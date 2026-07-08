---
focus: tech
last_mapped: 2026-07-08
---

# Integrations — red-sakai.github.io

## External Services

### unpkg (CDN)
- **Purpose**: Loads `<model-viewer>` custom element for 3D rendering
- **URL**: `https://unpkg.com/@google/model-viewer@4/dist/model-viewer.min.js`
- **Usage**: Loaded via `<Script>` in `app/layout.tsx` with `strategy="afterInteractive"`
- **Alternative**: No fallback or local copy

## External APIs

None. The site is a fully static export — no external API calls are made at runtime.

## Auth Providers

None.

## Databases

None. Content is stored in local JSON files under `app/data/`.

## Webhooks

None.

## Third-Party Integrations (Absent)

Notable by their absence — no analytics, no CMS, no comment systems, no form services, no monitoring tools are integrated into this site.

## Domain & DNS

- **Custom domain**: `jhered.me`
- **DNS**: Namecheap (per README)
- **Records**: `CNAME` file in repo root maps `jhered.me` during deployment to GitHub Pages

## Deployment

- **Host**: GitHub Pages
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`)
  - Trigger: push to `main` branch or `workflow_dispatch`
  - Build: `npm ci && npm run build`
  - Deploy: `actions/deploy-pages@v4`
  - URL: `https://jhered.me`
