# Detail Components

This directory contains components used for displaying detailed content pages (slug pages) across the Semio Community website.


> **Note:** `DetailHero`, `LinkSection`, and `ActionsSection` previously
> lived in this directory as per-site copies. They were unreferenced and
> have been removed; the shared equivalents are exported from
> `@semio-community/ecosystem-site-core`.

## Overview

All detail pages use a consistent single-column layout with semantic content slots for better organization and maintainability. The components in this directory work together to create a unified experience across research, people, partners, events, hardware, and software pages.

## Architecture

### Core Layout Component

#### `BaseDetailLayout` (React)
The React foundation component that provides the structure for all detail pages using semantic slots. A thin `.astro` shim forwards slot content into the React layout to keep legacy routes working while new pages can import the React module directly.

**Available Slots:**
- `breadcrumbs` - Navigation breadcrumbs
- `hero` - Hero section with image and title
- `actions` - Primary action buttons (Website, GitHub, Purchase, etc.)
- `description` - Main description/bio/abstract content
- `contributors` - People and organization contributors
- `metadata` - Event details, location info, pricing, etc.
- `specifications` - Hardware specs, software requirements
- `features` - Key features list
- `links` - External links and profiles
- `tags` - Tags, categories, expertise areas
- `stats` - Statistics and metrics
- `default` - MDX/Markdown content
- `related` - Related items grid
- `footer` - Citations, references, additional info

**Usage:**
```astro
<BaseDetailLayout>
  <Fragment slot="hero">...</Fragment>
  <Fragment slot="description">...</Fragment>
  <Fragment slot="contributors">...</Fragment>
  <!-- Additional slots as needed -->
  <Content /> <!-- MDX content -->
  <Fragment slot="related">...</Fragment>
</BaseDetailLayout>
```

### Display Components

#### `DetailHero.tsx`
Hero section component with image overlay, title, badges, and featured indicator.

#### `ActionButtonGroup.tsx`
Group of action buttons for primary CTAs (visit website, view publication, etc.).
Replaces the legacy `LinkButton.astro` implementation; all CTA rendering now lives in this React component.

#### `RelatedItemsGrid.tsx`
Grid display for related content items (research, hardware, software, events, people).

### Content Organization Components

#### `InfoCard`
Reusable card wrapper for content sections with consistent styling.

**Props:**
- `title` - Section title (typically uppercase)
- `icon` - Optional icon name
- `className` - Additional CSS classes

#### `ContentSection`
Simple section wrapper for text content with a title.

#### `MetadataItem.astro`
Component for displaying individual metadata items with icons.

### Utility Components

#### `StatusBadge.tsx`
Badge component for displaying status indicators. (Now located in `detail/legacy/`.)

#### `BasicChip`
Simple chip component for tags and categories. Implemented in React (`components/ui/BasicChip.tsx`) and now imported directly from Astro routes.

#### `OrganizationChip`
Chip component for displaying organization references. Use the React implementation in `components/ui/OrganizationChip.tsx` and pass the organization metadata from the route.

## Deprecated Components

The following components are no longer used after migrating to single-column layout (they have been moved to `detail/legacy/`):

- `SidebarCard.tsx` - No longer needed with single-column layout
- `ChipsCard.tsx` - Replaced by inline chip displays in InfoCard
- `ContributorsSection.tsx` - Replaced by semantic contributors slot
- `FeaturesCard.tsx` - Replaced by features slot with InfoCard
- `MetadataCard.tsx` - Replaced by metadata slot with InfoCard
- `PricingCard.tsx` - Integrated into metadata sections
- `SpecificationsCard.tsx` - Replaced by specifications slot
- `TagsSection.tsx` - Replaced by tags slot with inline implementation
- `TechnologiesCard.tsx` - Integrated into metadata sections

These components are retained for backward compatibility but should not be used in new implementations.

## Component Usage by Page Type

### Research Pages
- Uses: `description` (abstract), `contributors` (authors), `metadata` (publication details), `tags` (research areas)

### People Pages
- Uses: `description` (bio), `contributors` (affiliations), `links` (profiles), `tags` (expertise)

### Partners Pages
- Uses: `description` (about), `metadata` (partnership details), `links` (contact), `contributors` (key contacts), `tags` (collaboration areas)

### Events Pages
- Uses: `description` (about), `metadata` (event details, location), `contributors` (Semio community roles), `tags` (topics, tracks)

### Hardware Pages
- Uses: `description`, `contributors`, `specifications`, `features`, `metadata` (pricing), `tags` (applications)

### Software Pages
- Uses: `description`, `contributors`, `specifications` (requirements), `metadata` (technologies), `features`, `tags` (use cases)

## Best Practices

1. **Consistent Slot Usage**: Use semantic slots appropriately based on content type
2. **InfoCard Wrapper**: Always wrap section content in InfoCard for consistent styling
3. **Icon Usage**: Use consistent icons from the solar and simple-icons libraries
4. **Responsive Design**: Ensure all components work well on mobile devices
5. **Accessibility**: Include proper ARIA labels and keyboard navigation support
6. **Performance**: Use `client:load` directive for interactive React components

## Styling Conventions

### Colors
- Primary accent: `text-accent-base`
- Secondary accent: `text-accent-two`
- Muted text: `text-color-600` (dark: `text-color-400`)
- Standard text: `text-color-800` (dark: `text-color-200`)

### Spacing
- Between sections: `mb-8`
- Within sections: `space-y-3` or `space-y-4`
- Between chips/tags: `gap-2`
- Between buttons: `gap-3`

### Card Styling
```css
bg-linear-to-br from-surface-lighter to-surface 
rounded-xl border border-accent-one/20 p-6
```

### Typography
- Section titles: `text-xs font-semibold uppercase tracking-wider`
- Subsection labels: `text-xs font-medium`
- Content text: `text-sm`

## Migration Notes

When updating or creating new slug pages:

1. Remove any references to deprecated components
2. Use `BaseDetailLayout` without any sidebar-related props
3. Organize content into appropriate semantic slots
4. Use `InfoCard` for section wrappers
5. Apply consistent styling patterns

## Future Enhancements

Potential improvements to consider:

1. **Animation**: Add subtle entrance animations for cards
2. **Collapse/Expand**: Allow sections to be collapsed on long pages
3. **Sticky Navigation**: Add section anchors for long content
4. **Print Styles**: Optimize layout for printing
5. **Loading States**: Add skeleton screens for dynamic content
6. **Search**: Add in-page search functionality
7. **Share**: Add social sharing capabilities
