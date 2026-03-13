# Vizij Website

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/small.svg)](https://astro.build)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Website for [Vizij](https://vizij.ai) — an open source ecosystem for designing, animating, and deploying rendered robot faces.

## Ecosystem Architecture

This repo is one of four repositories that together form the Semio ecosystem platform:

```
ecosystem-content-hub          Canonical MDX content files (all sites)
ecosystem-content-schema       Shared Zod schemas & TypeScript types
ecosystem-site-core            Shared React UI components & layout
vizij-ai.github.io             This repo — Astro site
```

Content is authored in `ecosystem-content-hub` and synced to each site repo's `src/content/` directory. Schemas come from `@semio-community/ecosystem-content-schema`. UI components come from `@semio-community/ecosystem-site-core`.

## Tech Stack

- **Framework**: [Astro v5](https://astro.build/) with React islands (`client:load`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom design tokens
- **Content**: MDX content collections via `createEcosystemCollections`
- **Search**: [Pagefind](https://pagefind.app/) static search
- **Code Quality**: [Biome](https://biomejs.dev/)
- **Deployment**: GitHub Pages via GitHub Actions

## Project Structure

```
src/
├── site.config.ts        Site metadata, menu links, nav styling variant
├── content.config.ts     Content collection definitions (ecosystem schema)
├── content/              MDX content files (synced from content hub)
│   ├── events/           Some events have rich MDX body content
│   ├── hardware/
│   ├── software/         Includes Vizij itself
│   ├── research/
│   ├── people/
│   └── organizations/
├── pages/                Astro file-based routing
│   ├── index.astro
│   ├── demos.astro       Interactive runtime demos
│   ├── events.astro
│   ├── events/[...slug].astro   Event detail (supports MDX body content)
│   └── ...
├── react-pages/          React page components (used as Astro islands)
│   ├── home/
│   │   ├── HomePage.tsx
│   │   └── sections/
│   └── demos/            Demos page React component
├── layouts/
│   └── SiteShell.astro   Root HTML layout
├── components/
│   ├── BaseHead.astro    Meta tags, OG, favicons
│   ├── layout/           Header.tsx, Footer.tsx, SkipLink.tsx
│   ├── navigation/       NavIconButton.tsx, MobileNavButton.tsx, navIcons.ts
│   ├── sections/         Thin re-exports of PageSection, SubsectionGrid
│   ├── detail/           DetailHero.tsx adapter, LinkSection.tsx, ActionsSection.tsx
│   ├── cards/            Thin re-exports of shared card components
│   ├── events/           Thin re-export of EventsSections
│   ├── search/           SearchProvider, SearchModal, SearchApp
│   ├── hero/             HeroHeader.tsx (Vizij-branded glyph animation)
│   ├── background/       ParallaxHexBackground.tsx
│   ├── demos/            Interactive runtime demo components
│   └── mdx/              MDX component map for body content rendering
└── utils/                url.ts, date.ts, images.ts, events.ts, etc.
```

## Development

### Prerequisites

Node.js 18+ and npm.

### Setup

```bash
npm install
npm run dev        # dev server at http://localhost:4321
```

### Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server (Astro + CMS preview) |
| `npm run dev:site` | Astro dev server only |
| `npm run build` | Full build: CMS config + Astro + Pagefind index |
| `npm run build:site` | Astro build only |
| `npm run build:search` | Regenerate Pagefind index |
| `npm run preview` | Preview production build locally |
| `npm run check` | Astro type check |
| `npm run lint` | Biome lint |
| `npm run format` | Format code |

## Adding and Modifying Content

### Content flow

The canonical source for all content is [`ecosystem-content-hub`](https://github.com/semio-community/ecosystem-content-hub). The `src/content/` directory in this repo is a **generated output** — files are copied here by the sync script and committed to the repo. **Do not hand-edit files in `src/content/`**; changes will be overwritten on the next sync.

`src/content/` is committed (not gitignored) so that CI builds are self-contained and don't depend on the hub being reachable at build time. Content changes arrive as automated sync PRs, providing a review gate before they go live.

### Syncing content locally

Pull the latest content from the hub (the hub repo must be checked out as a sibling directory):

```bash
npm run content:sync:hub   # sync all collections from the hub
```

The sync script filters entries by the `sites` field in each MDX file — only entries tagged `vizij` are copied here. Asset paths that don't exist locally are stripped.

### Guidebook public docs flow

The guidebook-backed `/docs` and `/tutorials` routes do not come from `src/content/`.

They are generated from the canonical guidebook in the sibling `vizij-docs` repo:

- source markdown: `../vizij-docs/current_documentation/guidebook/`
- route metadata: `../vizij-docs/current_documentation/guidebook/public_projection_manifest.json`
- generated output in this repo:
  - `src/generated/guidebook/pages/`
  - `src/generated/guidebook/hubs.json`
  - `src/generated/guidebook/redirects.json`
  - `public/guidebook-assets/`

To refresh the public guidebook projection locally:

```bash
npm run content:sync:guidebook
```

That command runs `scripts/sync-guidebook-public.mjs`, rewrites guidebook links for the public site, regenerates the checked-in page files, and recopies guidebook assets.

Do not hand-edit `src/generated/guidebook/` as the normal workflow. If a public guidebook page is wrong, fix the guidebook source or the projection manifest and rerun the sync.

### Authoring content

Edit or add MDX files in `ecosystem-content-hub/content/<type>/`, then run the sync. Key frontmatter fields:

- `name` / `title` — display name
- `sites: [semio, quori, vizij]` — controls which sites include this entry
- `draft: true` — hides from production builds (still synced; filtered at query time)

For event entries with rich body content (tutorials, workshops), add MDX body content after the frontmatter. The event detail page renders it automatically.

See `@semio-community/ecosystem-content-schema` for the full schema per collection.

## Adding Pages

**Static page**: Add `src/pages/my-page.astro`, import `SiteShell`, render content.

**React page**: Create `src/react-pages/my-page/MyPage.tsx`, then reference from a `.astro` page with `client:load`.

**Detail route**: Already handled by `src/pages/<type>/[...slug].astro` for each content collection.

## Adding Demos

The demos page showcases interactive Vizij runtime functionality:

1. Create a demo component in `src/components/demos/` using `@vizij/runtime-react`
2. Add it to the demos page layout in `src/react-pages/demos/`
3. Add a section link entry to the `Demos` menu item in `src/site.config.ts`

## Modifying Navigation

Edit `menuLinks` in `src/site.config.ts`. To add a top-level link:
```ts
{
  path: "/my-page/",
  title: "My Page",
  inHeader: true,
  sections: [
    { kind: "link", title: "Section", href: "/my-page/#section" },
  ],
}
```

Set `callToAction: true` to render as a CTA button.

## Vizij-Specific Features

- **Demos page** (`src/pages/demos.astro`): Live interactive runtime demos
- **Demo components** (`src/components/demos/`): Vizij runtime showcase (gaze, pose, speech, expressions)
- **MDX event detail**: Events can include rich tutorial body content rendered via `<MDXContent />`
- **ActionsSection** (`src/components/detail/ActionsSection.tsx`): CTA buttons on event detail pages

## Local Development with the Shared Package

To iterate on `ecosystem-site-core` locally while running this site:

### Option A — use the published package (normal workflow)

```bash
npm install
npm run dev
```

### Option B — link the local build for live iteration

In `ecosystem-site-core`, start the TypeScript compiler in watch mode:

```bash
cd ../ecosystem-site-core
npx tsc -p tsconfig.json --watch
```

In a separate terminal, link the package and start the dev server:

```bash
cd vizij-ai.github.io
npm link @semio-community/ecosystem-site-core
npm run dev
```

When you are done, unlink and restore the published version:

```bash
npm unlink --no-save @semio-community/ecosystem-site-core
npm install
```

> **Why linking is safe:** `astro.config.ts` sets `vite.ssr.noExternal` to include `@semio-community/ecosystem-site-core` and related Radix/motion packages, and `vite.resolve.dedupe: ["react", "react-dom"]`. This forces Vite to bundle the linked package through its own resolver, preventing Node from picking up a nested React copy inside the linked `node_modules` and causing an "Invalid hook call" error.

## Updating the Shared Package

When a new version of `@semio-community/ecosystem-site-core` is published, update this repo with:

```bash
# 1. Wait for the Build & Publish Package workflow in ecosystem-site-core to complete
#    (check Actions — the vX.Y.Z tag must be green before proceeding)

# 2. Install the new version — this updates BOTH package.json and package-lock.json
npm install @semio-community/ecosystem-site-core@^X.Y.Z

# 3. Verify nothing is broken
npx tsc --noEmit
npm run build:site

# 4. Commit BOTH files together
git add package.json package-lock.json
git commit -m "chore: bump ecosystem-site-core to vX.Y.Z"
git push
```

> **Critical:** always commit `package.json` and `package-lock.json` together. A `package.json` bump without a matching lockfile causes `npm ci` to fail in CI with a lockfile-mismatch error. Never use `sed` to edit the version in `package.json` without also running `npm install` to regenerate the lockfile.

## Troubleshooting

### "Invalid hook call" / useRef is null at runtime

Two copies of React are loaded simultaneously. Checklist:

1. Run `find node_modules -path "*/react/index.js"` — you should see only one entry. A path through `ecosystem-site-core/node_modules/react` means a nested copy is present; delete it (`rm -rf node_modules/@semio-community/ecosystem-site-core/node_modules/react`).
2. Confirm `astro.config.ts` has both `vite.ssr.noExternal` (including `@semio-community/ecosystem-site-core` and Radix/motion packages) and `vite.resolve.dedupe: ["react", "react-dom"]`.

### `npm ci` fails with lockfile mismatch

`package.json` was bumped without running `npm install` to regenerate the lockfile. Fix:

```bash
npm install
git add package.json package-lock.json
git commit -m "fix: sync lockfile after version bump"
git push
```

### `npm ci` fails with `No matching version found` / `ETARGET`

CI ran before the publish workflow in `ecosystem-site-core` finished. Wait for **Actions → Build & Publish Package** to complete there, then re-run the failing CI job here.

## Deployment

Merging to `main` triggers the GitHub Actions workflow, which builds and deploys to GitHub Pages at [https://vizij.ai](https://vizij.ai).

## Contributing

1. Fork the repository and create a feature branch
2. Make changes; run `npm run check` and `npm run build` to verify
3. Open a pull request with a clear description

For guidance on the AI-assisted development workflow, see [AGENTS.md](AGENTS.md).

## License

MIT — see [LICENSE](LICENSE).
