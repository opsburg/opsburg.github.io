<p align="center"><img src="public/logo.png" alt="Opsburg" width="96"></p>

# Opsburg website

Source of [opsburg.dev](https://opsburg.dev), the public site of Opsburg, the platform that builds and ships your apps and AI agents and turns keeping your cloud up into a city-builder game. Next.js 15 static export, Tailwind v4, React 19.

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:3020
```

## Build

```bash
pnpm build    # static export to ./out, with sitemap.xml and robots.txt
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `./out` to GitHub Pages. Pull requests run the build without deploying. On the free plan GitHub Pages needs the repository to be public.

## Where things live

- `src/lib/site.ts`: name, URLs, tagline and the map from city buildings to real infrastructure
- `src/app/page.tsx`: home page
- `src/app/gamified-devops/page.tsx`: why gamified DevOps, with the streak scene (`src/components/StreakScene.tsx`)
- `src/app/vibe-coding/page.tsx`: vibe coding for everyone, governed, with the workshop scene (`src/components/WorkshopScene.tsx`)
- `src/app/faq/page.tsx`: FAQ
- `src/components/HeroScene.tsx`: the 3D home hero; `src/components/scene/`: the pieces the page scenes share
- `src/components/SkyCity.tsx`: the SVG city, used when WebGL is missing
- `public/logo.png`, `src/app/icon.png`, `src/app/apple-icon.png`: the logo (generated with Gemini)
