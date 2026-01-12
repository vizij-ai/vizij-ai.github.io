import React from "react";
import { SearchProvider, useSearch, SearchModal } from "@/components/search";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";
import { NavIconButton } from "@/components/navigation/NavIconButton";
import type { Section } from "@/site.config";

/**
 * SearchApp.tsx
 *
 * React island that centralizes the search experience and mobile navigation:
 * - Hosts SearchProvider context (Pagefind-backed)
 * - Renders a desktop-only trigger button to open the React SearchModal
 * - Renders MobileNavigation (which reads search mode via useSearch to show SearchMobilePanel)
 * - Mounts a single instance of SearchModal for desktop search
 *
 * Usage (Astro):
 *   <SearchApp
 *     client:load
 *     menuLinks={menuLinks}
 *     currentPath={Astro.url.pathname}
 *     urlPrefix=""
 *   />
 */

type MenuLink = {
  path: string;
  title: string;
  inHeader: boolean;
  callToAction?: boolean;
  sections?: Section[];
};

export interface SearchAppProps {
  menuLinks: MenuLink[];
  currentPath: string;
  urlPrefix?: string;
  /**
   * Whether to show the desktop trigger button that opens the React SearchModal.
   * Defaults to true.
   */
  showDesktopTrigger?: boolean;
  /**
   * Optional className to apply to the outer wrapper.
   */
  className?: string;
}

/**
 * DesktopSearchTrigger
 *
 * A desktop-only icon button that opens the React SearchModal via SearchProvider.
 * Hidden on small screens.
 */
export const DesktopSearchTrigger: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, ...rest }) => {
  const { openDesktopModal } = useSearch();

  return (
    <NavIconButton
      label="Open search"
      onClick={openDesktopModal}
      className={className}
      {...rest}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <line
          x1="16.65"
          y1="16.65"
          x2="21"
          y2="21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </NavIconButton>
  );
};

export const SearchApp: React.FC<SearchAppProps> = ({
  menuLinks,
  currentPath,
  urlPrefix = "",
  showDesktopTrigger = true,
  className,
}) => {
  return (
    <SearchProvider>
      <div
        className={[
          "flex items-center gap-x-1 md:gap-x-2",
          className || "",
        ].join(" ")}
      >
        {showDesktopTrigger && (
          <div className="hidden md:flex">
            <DesktopSearchTrigger />
          </div>
        )}

        {/* Mobile Navigation with Radix UI Dialog (hidden on desktop) */}
        <div className="md:hidden">
          <MobileNavigation
            menuLinks={menuLinks}
            currentPath={currentPath}
            urlPrefix={urlPrefix}
          />
        </div>
      </div>

      {/* Desktop Search Modal (React + Radix) */}
      <SearchModal />
    </SearchProvider>
  );
};

export default SearchApp;
