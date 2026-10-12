# React Pages

This directory contains React “page” components that represent the main UI for each route. Each Astro route (`src/pages/**/*.astro`) should be a thin wrapper that loads data on the server and renders a single React page component from this folder inside the shared `BaseLayout`.

Goal:
- Standardize on React for page-level UI.
- Keep Astro for routing, SSG, content collections, and `<head>`/SEO.
- Maintain Astro’s performance by defaulting to SSR-only React and hydrating only where needed.

## Why a separate folder?

- Clarifies the boundary: `.astro` files handle routing and server-side data loading; React files render UI.
- Encourages consistent patterns for props, layout, and hydration.
- Keeps `src/components` focused on reusable UI primitives and sections, while `src/react-pages` hosts the page-level containers.

## Usage pattern

1) The `.astro` route:
   - Imports server-side collection queries from `@/utils/collections`.
   - Imports a React page component from `src/react-pages`.
   - Wraps the page in `BaseLayout` (React layout) and passes props.

2) The React page component:
   - Pure server-rendered React by default (no client hydration).
   - Receives its data via props (typed).
   - Uses shared React UI components from `src/components`.

### Example: React page component (HomePage)

```tsx
// src/react-pages/home/HomePage.tsx
import React from "react";
import type { CollectionEntry } from "astro:content";

export interface HomePageProps {
  projectCount: number;
  featuredEventCount: number;
}

export default function HomePage({ projectCount, featuredEventCount }: HomePageProps) {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-light">Reproducible Robot Science</h1>
        <p className="text-color-600 dark:text-color-400 mt-3">
          Explore active projects and upcoming events.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4 bg-surface/60">
          <div className="text-sm text-color-600">Active Projects</div>
          <div className="text-3xl font-semibold">{projectCount}</div>
        </div>
        <div className="rounded-lg border p-4 bg-surface/60">
          <div className="text-sm text-color-600">Upcoming Events</div>
          <div className="text-3xl font-semibold">{featuredEventCount}</div>
        </div>
        <div className="rounded-lg border p-4 bg-surface/60">
          <div className="text-sm text-color-600">Community</div>
          <div className="text-3xl font-semibold">Growing</div>
        </div>
      </section>
    </div>
  );
}
```

### Example: Astro route wrapper

```astro
---
import BaseHead from "@/components/BaseHead.astro";
import SiteShell from "@/layouts/SiteShell.astro";
import HomePage from "@/react-pages/home/HomePage";
import {
  getAllHardware,
  getAllSoftware,
  getAllResearch,
  getCurrentEvents,
  getFeaturedEvents,
  getUpcomingEvents,
} from "@/utils/collections";

const hardware = await getAllHardware();
const software = await getAllSoftware();
const research = await getAllResearch();
const projectCount = hardware.length + software.length + research.length;

const currentEvents = await getCurrentEvents();
const upcomingEvents = await getUpcomingEvents();
const featuredOnly = await getFeaturedEvents();
const now = new Date();
const featuredEventCount = [
  ...currentEvents.filter((c) => !featuredOnly.some((f) => f.id === c.id)),
  ...upcomingEvents.filter((u) => !featuredOnly.some((f) => f.id === u.id)),
  ...featuredOnly.filter((f) => f.data.startDate > now),
].length;
---

<html lang="en">
  <head>
    <BaseHead title="Home" description="Welcome to Semio Community" />
  </head>
  <body class="bg-surface">
    <SiteShell showBackground>
      <HomePage projectCount={projectCount} featuredEventCount={featuredEventCount} />
    </SiteShell>
  </body>
</html>
```

## Conventions

- One React page component per route.
  - Directory: `src/react-pages/<route>/YourPage.tsx`
  - Default export should be the page component.
  - Co-locate page-specific child components under the same folder if they are not reused elsewhere.

- Props and typing:
  - Define a `Props` interface next to the page.
  - Keep props serializable (no functions or non-serializable instances).
  - Derive your types from `astro:content` or local types where applicable.

- Data fetching:
  - Do NOT fetch data in the React page component.
  - Fetch in the `.astro` route using `@/utils/collections`, then pass as props.

- Hydration policy:
  - React page components are SSR-only by default (no hydration).
  - Use Astro “islands” (small wrapper .astro components) or client directives only for interactive leaf components:
    - Prefer `client:visible` or `client:idle`.
    - Avoid `client:load` unless necessary.

- Layout:
  - Use `BaseLayout` from `src/layouts/BaseLayout.tsx`.
  - Route decides what to pass for header/footer/theme/skip link (they can be Astro or React components).
  - Keep `noPaddingTop` and other layout flags in the route for clarity.

- Styling:
  - Tailwind v4 utility classes are preferred, matching the existing codebase.

## Do / Don’t

- Do:
  - Keep React pages pure and deterministic (render-only).
  - Keep interaction localized to small components that explicitly opt into hydration.
  - Share UI primitives via `src/components/**`.

- Don’t:
  - Fetch data inside React pages.
  - Hydrate the entire page when only a small part is interactive.
  - Introduce new heavy dependencies unless justified.

## Testing and performance

- Prefer simple unit tests for page-level logic (if any) and visual checks via Storybook or per-route screenshots.
- Track bundle sizes and Lighthouse metrics in CI.
- Review hydration boundaries during PRs to avoid unnecessary client JS.

## Migration notes

- During migration, both `.astro` and React versions of layout/components may exist temporarily.
- Replace `.astro` UI components with React equivalents incrementally.
- Keep the Astro route small and focused: imports, data loading, single React render.

## Checklist for new pages

- [ ] Create `src/react-pages/<route>/YourPage.tsx` with typed props.
- [ ] Add a `.astro` route (or update existing) that:
  - [ ] Loads data via `@/utils/collections`.
  - [ ] Renders `<BaseLayout>` and your page component.
  - [ ] Avoids hydration unless needed for an interactive element.
- [ ] Confirm Lighthouse and bundle size remain within budgets.
- [ ] Add tests or visual checks if the page is complex.
