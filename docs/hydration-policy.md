# Hydration Policy

Updated: 2025-11-14

## Goals

- Keep Astro pages SSR-first: render everything on the server, hydrate only where true interactivity exists.
- Prefer `client:idle` or `client:visible` for low-priority UI to avoid blocking initial page load.
- Avoid `client:load` unless the interaction must be available immediately at page render (e.g., the navigation menu).

## Current directives

| Component/Island | Directive | Rationale |
| --- | --- | --- |
| `ParallaxHexBackground` | `client:only="react"` | Background animation relies on Framer Motion and should never block SSR HTML. |
| `Header` (navigation + search) | `client:load` | Global navigation/search must respond instantly and manages focus/keyboard interaction. |
| `SearchApp` (mobile/desktop search experience) | Inlined inside `Header` React tree | Hydrates with the header to keep keyboard bindings consistent. |
| `NavigationMenuComponent` | Inlined inside `Header` React tree | Shares the header hydration boundary; provides Radix-powered dropdowns. |
| `EventsSections` | `client:load` | Handles filtering, grouping, and expanding/collapsing events on the client. The rest of `/events` stays SSR. |
| `PersonPopover` | `client:idle` | Contributors popovers can hydrate lazily because they only appear on hover/click. Data is serialized on the server and passed as props. |
| `RelatedItemsGrid` (cards slider) | `client:load` | React component controls grid switching + slider logic (only used where interactivity demands it). |
| Future interactive leaves (nav/search popovers, modals) | Prefer `client:idle` / `client:visible` | Document new directives beside the component so reviewers can verify the justification. |

## Usage guidelines

1. **Start SSR-only**: build the React component without hydration. If it needs interactivity, add the directive in the Astro route (or `SiteShell`) with a short comment.
2. **Choose the lightest directive**:
   - `client:visible` when interaction can wait until the component is scrolled into view (e.g., modals triggered from below the fold).
   - `client:idle` for enhancements that can wait until the browser is idle.
   - `client:load` only when the UI must be ready at first paint (navigation, mission-critical forms).
3. **Serialize data in `.astro`**: avoid fetching in hydrated components. Use the Astro route (or `SiteShell`) to load from `@/utils/collections`, transform the payloads, and pass only the fields the client needs.
4. **Document exceptions**: if a component requires unusual hydration, update this file (or inline comments) so future contributors know why.
5. **Measure**: when adding a new hydrated component, capture bundle size/Lighthouse numbers for the affected route and add a regression test if possible.
