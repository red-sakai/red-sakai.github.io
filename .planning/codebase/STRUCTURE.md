---
focus: arch
last_mapped: 2026-07-08
---

# Structure — red-sakai.github.io

## Directory Layout

```
red-sakai.github.io/
├── app/                          ← Next.js App Router
│   ├── about/
│   │   └── page.tsx              ← /about — static info page
│   ├── components/
│   │   ├── sections/
│   │   │   ├── Certifications.tsx
│   │   │   ├── Education.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── NavbarCapsule.tsx
│   │   │   └── Projects.tsx
│   │   └── ui/
│   │       ├── ShapeBlur.tsx      ← Three.js GLSL mouse-follow effect
│   │       └── TerminalNavbar.tsx ← Command-bar for /shell page
│   ├── contact/
│   │   └── page.tsx              ← /contact — shell page
│   ├── data/
│   │   ├── certifications.json
│   │   ├── education.json
│   │   ├── experience.json
│   │   └── projects.json
│   ├── grub-bootloader/
│   │   └── page.tsx              ← /grub-bootloader — easter egg
│   ├── gui-loading/
│   │   └── page.tsx              ← /gui-loading — easter egg
│   ├── hooks/
│   │   └── useRevealOnScroll.ts  ← IntersectionObserver hook
│   ├── projects/
│   │   └── page.tsx              ← /projects — shell page
│   ├── shell/
│   │   └── page.tsx              ← /shell — terminal emulator (easter egg)
│   ├── types/
│   │   └── model-viewer.d.ts     ← Global JSX type for <model-viewer>
│   ├── favicon.ico
│   ├── globals.css               ← Tailwind v4 + CSS variables + animations
│   ├── layout.tsx                ← Root layout (fonts, script, metadata)
│   ├── page.tsx                  ← Home page (sections + hero + footer)
│   ├── robots.ts                 ← SEO robots.txt (static export)
│   └── sitemap.ts                ← SEO sitemap (static export)
├── lib/
│   └── utils.ts                  ← cn() helper (clsx + tailwind-merge)
├── public/
│   ├── 3d-models/
│   │   ├── low_poly_moon.glb     ← Moon 3D model for Hero
│   │   └── low_poly_sun.glb      ← Sun 3D model for Hero
│   ├── audio/
│   │   └── windows_startup.mp3   ← Startup sound on / page
│   ├── images/
│   │   ├── certifications/
│   │   ├── education/
│   │   ├── organizational/
│   │   ├── projects/
│   │   └── competitive/
│   ├── JHERED_MIGUEL_REPUBLICA.pdf
│   ├── CNAME                     ← jhered.me — custom domain
│   ├── jhered-image.jpg
│   └── picture.jpg
├── .github/workflows/
│   └── deploy.yml                ← GitHub Pages deployment
├── next.config.ts                ← Static export config
├── tailwind.config.ts            ← Dark mode: class strategy
├── postcss.config.mjs            ← @tailwindcss/postcss
├── eslint.config.mjs             ← Flat config ESLint
├── tsconfig.json
├── components.json               ← shadcn/ui-style config
├── package.json
└── global.d.ts                   ← Global CSS module + model-viewer types
```

## Key Locations

| Path | Purpose |
|------|---------|
| `app/data/` | All editable content in JSON files |
| `app/components/sections/` | Page section components |
| `app/layout.tsx` | Root layout — fonts, metadata, model-viewer script |
| `app/globals.css` | All global styles, Tailwind v4 setup, dark mode variables |
| `public/images/` | All images referenced from JSON data files |
| `public/3d-models/` | GLB files for Hero 3D rendering |
| `.github/workflows/deploy.yml` | CI/CD pipeline for GitHub Pages |

## Naming Conventions

- **Directories**: lowercase with hyphens for routes (`grub-bootloader`, `gui-loading`)
- **Components**: PascalCase (`NavbarCapsule.tsx`, `TerminalNavbar.tsx`)
- **Hooks**: camelCase with `use` prefix (`useRevealOnScroll`)
- **Data files**: lowercase kebab-case (`certifications.json`)
- **Images**: lowercase with hyphens, organized in subdirectories by category
