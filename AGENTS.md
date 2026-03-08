# AGENTS.md — Vizij Website

This file provides guidance for AI coding agents (Claude Code, Copilot, etc.) working in this repository.

## Ecosystem Overview

This repo is one of four interconnected repositories:

| Repo | Role |
|------|------|
| `ecosystem-content-hub` | Canonical content source (MDX files for all sites) |
| `ecosystem-content-schema` | Shared Zod schemas and TypeScript types for content |
| `ecosystem-site-core` | Shared React UI components, layout, and navigation |
| **this repo** | Vizij website (Astro + React) |

Content flows: `ecosystem-content-hub` → sync → `src/content/` → Astro pages → static site.

## Key Files

| File | Purpose |
|------|---------|
| `src/site.config.ts` | Site metadata, navigation menu, and nav styling variant |
| `src/content.config.ts` | Astro content collections (uses `createEcosystemCollections` from schema package) |
| `src/layouts/SiteShell.astro` | Root Astro layout (html/head/body shell) |
| `src/components/BaseHead.astro` | Meta tags, OG, favicons |
| `src/components/layout/Header.tsx` | Site header with nav and search |
| `src/components/layout/Footer.tsx` | Site footer |
| `src/components/navigation/navIcons.ts` | Maps content-type route keys to icon components |

## Code Patterns

### 1. Thin re-export (most component files)
Site files that simply re-export from the shared package:
```ts
// src/components/sections/Section.tsx
export { PageSection as Section, PageSection as default } from "@semio-community/ecosystem-site-core";
```

### 2. siteConfig wrapper (navigation buttons)
Site files that wrap a shared component and inject site-specific styling from `siteConfig`:
```tsx
// src/components/navigation/NavIconButton.tsx
const navHighlight = getNavHighlightClasses(
  resolveNavHighlightVariant(siteConfig.navigation?.highlightVariant),
);
export const NavIconButton = React.forwardRef(...) => (
  <SharedNavIconButton navHighlight={navHighlight} {...props} />
);
```
Files following this pattern: `NavIconButton.tsx`, `MobileNavButton.tsx`.

### 3. Bound component (from package)
Package components pre-wired with common dependencies, used in `Header.tsx` and `SearchApp.tsx`:
- `BoundNavigationMenu` — desktop nav with `CallToActionButton` pre-wired
- `BoundMobileNavigation` — mobile nav with theme toggle and search support

### 4. Astro page + React island
Astro files (`.astro`) handle SSG data loading. Interactive React components mount as islands with `client:load`:
```astro
---
import { getCollection } from "astro:content";
import HomePage from "@/react-pages/home/HomePage";
const events = await getCollection("events");
---
<HomePage events={events} client:load />
```

### 5. Astro page with MDX body (events detail)
Vizij's event detail pages can include MDX body content alongside structured data:
```astro
---
import { render } from "astro:content";
const { Content } = await render(entry);
---
<MDXContent entry={entry} />  <!-- renders MDX body -->
```
This is why `src/pages/events/[...slug].astro` uses direct primitive imports rather than an `EventDetail` wrapper.

## Common Tasks

### Add a new content entry
Content is synced from `ecosystem-content-hub`. To add content:
1. Add the MDX file to the appropriate collection in `ecosystem-content-hub/content/<type>/`
2. Run the site sync workflow, or copy the file directly to `src/content/<type>/`
3. Set `visibility` in the frontmatter to include `"vizij-ai"` if needed

To add directly, place the MDX file in `src/content/<type>/` matching the schema from `@semio-community/ecosystem-content-schema`. Use an existing entry as a reference.

For events with MDX body content (like `hri-2026-tutorial.mdx`), the body is rendered automatically by `src/pages/events/[...slug].astro`.

### Add a new page
For a static informational page:
1. Create `src/pages/my-page.astro`
2. Import `SiteShell` layout and any needed React components
3. Add a menu entry to `menuLinks` in `src/site.config.ts` if it needs nav links

For a page with significant React UI:
1. Create `src/react-pages/my-page/MyPage.tsx` with the React component
2. Create `src/react-pages/my-page/sections/` for section components
3. Create `src/pages/my-page.astro` that imports and renders the React component with `client:load`

### Add a new demo
Vizij has a demos page (`src/pages/demos.astro`) with interactive runtime showcase components:
1. Create a new demo component in `src/components/demos/`
2. Use `@vizij/runtime-react` for runtime integration
3. Add it to the demos page React component in `src/react-pages/demos/`

### Add a navigation link
Edit `menuLinks` in `src/site.config.ts`. Each entry:
```ts
{
  path: "/my-page/",
  title: "My Page",
  inHeader: true,
  sections: [
    { kind: "link", title: "Section Name", href: "/my-page/#section" },
  ],
}
```

### Add a navigation icon for a content type
Edit `src/components/navigation/navIcons.ts`. Map a route key to a Solar icon component.

### Add a new shared component
If the component is site-specific (e.g. uses Vizij runtime library), add it to `src/components/<category>/`.
If it would benefit all three ecosystem sites, add it to `ecosystem-site-core` instead.

### Update the shared package
1. Make changes in `ecosystem-site-core`, bump the version, build, and publish
2. Run `npm install @semio-community/ecosystem-site-core@^X.Y.Z` in this repo
3. Update any site files that use the changed API

## Content Schema

Content collections are defined by `createEcosystemCollections`. Available collections:
- `events` — workshops, conferences (some with MDX body content)
- `hardware` — robotics hardware projects
- `software` — software tools (includes Vizij itself)
- `research` — publications and papers
- `people` — team and community members
- `organizations` — partner and affiliated organizations

## Vizij-Specific Features

This site has features not present in other ecosystem sites:

- **`src/pages/demos.astro`** — Interactive runtime demos page
- **`src/components/demos/`** — Demo showcase components using `@vizij/runtime-react`
  - `ShowcaseRuntime.tsx` — Main runtime demo component
  - `PoseRigMirrorBridge.tsx`, `RuntimeDebugOverlay.tsx`, etc.
- **`src/components/detail/ActionsSection.tsx`** — CTA action buttons for event detail pages
- **MDX event pages** — Some events (e.g. `hri-2026-tutorial.mdx`) have rich body content

The demo components are tightly coupled to Vizij's AI/rendering runtime and should remain site-specific.

## Build and Check

```bash
npm run dev          # Start dev server (localhost:4321)
npm run build        # Full build (CMS + Astro + Pagefind)
npm run build:site   # Astro only
npm run check        # Astro type check
npx tsc --noEmit     # TypeScript type check
npm run lint         # Biome lint
npm run format       # Format code
```

## What Stays Site-Specific

- `src/components/hero/HeroHeader.tsx` — Vizij branded hero with glyph animation
- `src/components/background/ParallaxHexBackground.tsx` — branded background
- `src/components/demos/` — Vizij runtime interactive demos
- `src/components/detail/ActionsSection.tsx` — event action buttons
- `src/components/search/` — Pagefind search
- `src/components/BaseHead.astro` — site-specific meta config
- `src/components/navigation/navIcons.ts` — site-specific route→icon mapping
- `src/components/mdx/mdxComponents.tsx` — MDX rendering component map

## What Lives in the Shared Package

If you see logic that is identical across all three ecosystem sites, it belongs in `ecosystem-site-core`. Currently shared:
- All card components, navigation components, button primitives
- Layout primitives (`PageSection`, `SubsectionGrid`, `SectionBlock`)
- Detail page components (`BaseDetailLayout`, `DetailHero`, `InfoCard`, `ContentSection`, etc.)
- Events page (`EventsSections`), Header/Footer shells, SkipLink
