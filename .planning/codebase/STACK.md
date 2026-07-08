---
focus: tech
last_mapped: 2026-07-08
---

# Stack — red-sakai.github.io

## Languages & Runtime

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | TypeScript | ^5 |
| Runtime | Node.js | 18.17+ |
| Package Manager | npm | 9+ (npm ci in CI) |

## Framework

- **Next.js 16.1.1** — App Router, static export mode (`output: "export"`)
- **React 19.2.3** — Server and client components
- **Tailwind CSS 4** — Utility-first CSS, `@tailwindcss/postcss` plugin
- **PostCSS** — PostCSS config at `postcss.config.mjs` with `@tailwindcss/postcss` plugin

## Key Dependencies

### Runtime
| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.1.1 | Framework |
| `react` / `react-dom` | 19.2.3 | UI library |
| `@react-three/fiber` | ^9.5.0 | Three.js React renderer (used in `ShapeBlur`) |
| `three` | ^0.167.1 | 3D graphics library |
| `clsx` | ^2.1.1 | Conditional class joining |
| `tailwind-merge` | ^3.4.0 | Intelligent class merge |
| `class-variance-authority` | ^0.7.1 | Component variant API |
| `lucide-react` | ^0.563.0 | SVG icon library |
| `tailwindcss-animate` | ^1.0.7 | Tailwind animation plugin |

### Dev Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ^5 | Type checking |
| `eslint` | ^9 | Linting |
| `eslint-config-next` | 16.1.1 | Next.js ESLint config |
| `tailwindcss` | ^4 | CSS framework |
| `@tailwindcss/postcss` | ^4 | PostCSS plugin for Tailwind v4 |
| `@types/node` | ^20 | Node.js type definitions |
| `@types/react` / `@types/react-dom` | ^19 | React type definitions |
| `@types/three` | ^0.182.0 | Three.js type definitions |

## External Resources (loaded at runtime)

| Resource | Source | Purpose |
|----------|--------|---------|
| `<model-viewer>` | `https://unpkg.com/@google/model-viewer@4/dist/model-viewer.min.js` | 3D model rendering for Hero sun/moon |

## Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Static export, unoptimized images, trailing slashes |
| `tailwind.config.ts` | Dark mode strategy: `"class"` |
| `postcss.config.mjs` | PostCSS with `@tailwindcss/postcss` |
| `eslint.config.mjs` | ESLint flat config, `core-web-vitals` + `typescript` rules |
| `tsconfig.json` | TypeScript project config |
| `components.json` | shadcn/ui-style component configuration |

## Build Output

- Static export to `out/` directory
- Images unoptimized (static export requirement)
- `.nojekyll` + `CNAME` copied into `out/` during CI for GitHub Pages
