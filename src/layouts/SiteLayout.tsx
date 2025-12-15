import React, { type ReactNode } from "react";
import ParallaxHexBackground from "@/components/background/ParallaxHexBackground";

/**
 * BaseLayout.tsx
 *
 * React layout scaffold intended to mirror the structure and behavior of `src/layouts/Base.astro`,
 * without relying on .astro components. Routes can render this component as the top-level wrapper
 * for page content. Keep this SSR-only by default; hydrate only interactive subcomponents as needed.
 *
 * Usage (from an .astro route):
 *   ---
 *   import BaseLayout from "@/layouts/BaseLayout";
 *   import { getAllHardware } from "@/data/hardware";
 *   const data = await getAllHardware();
 *   ---
 *   <BaseLayout header={<HeaderIsland />} footer={<FooterIsland />}>
 *     <YourReactPage data={data} />
 *   </BaseLayout>
 *
 * Notes:
 * - Avoid importing .astro components directly into this file.
 * - Provide `header`, `footer`, `sidebar`, `themeProvider`, and `skipLink` as ReactNodes from the route.
 * - Keep background decorations here to preserve visual parity with Base.astro.
 * - `noPaddingTop` mirrors the behavior in Base.astro (controls top padding for main content).
 */

export interface SiteLayoutProps {
  children: ReactNode;
  /**
   * Optional header node (e.g., a React component or an Astro "island" wrapper rendered from the route).
   */
  header?: ReactNode;
  /**
   * Optional footer node (e.g., a React component or an Astro "island" wrapper rendered from the route).
   */
  footer?: ReactNode;
  /**
   * Optional theme provider node (e.g., a React provider or an Astro "island" wrapper) placed near the top of <body>.
   */
  themeProvider?: ReactNode;
  /**
   * Optional skip link node. If not provided, a default skip link will be rendered.
   */
  skipLink?: ReactNode;
  /**
   * Optional sidebar content rendered before the main container (mirrors <slot name="sidebar" />).
   */
  sidebar?: ReactNode;
  /**
   * When true, removes the top padding applied to the main content container.
   */
  noPaddingTop?: boolean;
  /**
   * Toggle the decorative blurred background gradients.
   */
  showBackground?: boolean;
  /**
   * Extra class names on the inner content container.
   */
  containerClassName?: string;
}

function DefaultSkipLink() {
  // Tailwind utility classes mirror common skip-link patterns.
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-white/90 focus:px-3 focus:py-2 focus:text-sm focus:text-black dark:focus:bg-black/90 dark:focus:text-white shadow"
    >
      Skip to content
    </a>
  );
}

export default function SiteLayout({
  children,
  header,
  footer,
  themeProvider,
  skipLink,
  sidebar,
  noPaddingTop = false,
  showBackground = false,
  containerClassName = "",
}: SiteLayoutProps) {
  return (
    <div className="relative min-h-screen w-full text-text antialiased">
      {/* Optional top-level providers (e.g., theme) */}
      {themeProvider}

      {/* Accessibility: skip link */}
      {skipLink ?? <DefaultSkipLink />}

      {/* Background decorations (matches Base.astro structure) */}
      {showBackground && <ParallaxHexBackground />}

      {/* Full-width header */}
      {header}

      {/* Page content wrapper */}
      <div className="relative flex min-h-screen w-full flex-col">
        <div className="relative flex min-h-screen w-full flex-1 m-auto max-w-6xl">
          {/* Optional sidebar area */}
          {sidebar}

          {/* Main container */}
          <div
            id="container"
            className={`relative m-auto max-w-4xl grow ${containerClassName}`}
          >
            <div
              className={`m-auto grid min-h-screen grid-rows-[1fr_auto] px-4 md:px-8 ${
                noPaddingTop ? "" : "pt-[72px] lg:pt-4"
              }`}
            >
              <main id="main" className="relative flex-grow" data-pagefind-body>
                {children}
              </main>

              {/* Footer area */}
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
