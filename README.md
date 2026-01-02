# jhered.me

Personal portfolio built with Next.js 16 (App Router) and Tailwind CSS 4. The site highlights experience, projects, certifications, and contact information, with content driven by JSON data and assets in `public`.

## Prerequisites
- Node.js 18.17+ and npm 9+ (Next.js 16 requirement)
- pnpm/yarn also work if you prefer, but scripts below use npm

## Getting Started
1) Install dependencies: `npm install`
2) Run the dev server: `npm run dev`
3) Open http://localhost:3000 to view the site

## Scripts
- `npm run dev` – start development server
- `npm run build` – production build
- `npm run start` – run built app locally
- `npm run lint` – lint with ESLint

## Project Structure
- app/ – App Router routes, layouts, and UI
	- components/sections – page sections (Hero, Experience, Projects, etc.)
	- data/ – JSON content for education, experience, certifications, projects
	- contact/, about/, projects/ – route segments
- public/ – static assets (images, 3d-models)
- tailwind.config.ts, postcss.config.mjs – styling configuration

## Editing Content
- Update text/content in JSON files under `app/data`.
- Replace or add images in `public/images/...` and keep filenames referenced in JSON consistent.

## Deployment
- Build locally with `npm run build`; serve with `npm run start` for a production preview.
- Deploy the built output using namecheap DNS.