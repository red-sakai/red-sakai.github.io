# AGENTS.md — red-sakai.github.io

Personal portfolio at **jhered.me** — Next.js 16 (App Router) + Tailwind CSS 4 + TypeScript.

## Commands

- `npm run dev` — dev server on localhost:3000
- `npm run build` — static export to `out/` (no SSR)
- `npm run lint` — ESLint with `eslint-config-next`

## Architecture

- **Static export**: `next.config.ts` sets `output: "export"`. No API routes, no server components that need dynamic data.
- **Content**: Edit JSON files in `app/data/` — `education.json`, `experience.json`, `projects.json`, `certifications.json`. Images referenced by path go in `public/images/`.
- **Theme**: Dark/light toggled via `class` strategy on `<html>`. State managed per-page with `useState<"light"|"dark">`.
- **Routes**: `/` (single-page sections via hash), `/about`, `/projects`, `/contact`, `/shell`, `/gui-loading`, `/grub-bootloader`. Last three are novelty/easter-egg pages.
- **Fonts**: Sora (`--font-sora`) and JetBrains Mono (`--font-jetbrains-mono`) via `next/font/google`, applied as CSS variables in `globals.css`.
- **3D**: `<model-viewer>` custom element (loaded from unpkg) for the Hero sun/moon. Three.js via `@react-three/fiber` used in `ShapeBlur` component only.
- **CSS**: Tailwind v4 with `@import "tailwindcss"`, `@plugin "tailwindcss-animate"`, `@custom-variant dark`. Global CSS variables in `globals.css`. Dark mode overrides use `!important` extensively.
- **Utilities**: `cn()` from `lib/utils.ts` (wraps `clsx` + `tailwind-merge`).
- **Scroll animation**: Custom `useRevealOnScroll` hook (IntersectionObserver, fires once).

## Deployment

- **Branch**: `main` deploys via `.github/workflows/deploy.yml`. `dev` is the working branch.
- **CI**: `npm ci && npm run build` → copies `CNAME` + `.nojekyll` into `out/` → deploys to GitHub Pages.
- **Custom domain**: `CNAME` file maps `jhered.me`. Must be preserved during builds.
- **CV**: Update `/public/JHERED_MIGUEL_REPUBLICA.pdf` when needed.

## Conventions

- Interactive components use `"use client"` directive.
- Section components use `useRevealOnScroll` for fade-in on scroll.
- Section-level `id` attributes must match the navbar hash links.
- Commit style: conventional commits (`feat:`, `docs:`, etc.) targeting `dev` branch.
- No test framework configured.
