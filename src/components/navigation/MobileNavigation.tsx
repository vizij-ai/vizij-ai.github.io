import React, { useCallback } from "react";
import { CallToActionButton } from "../ui/CallToActionButton";
import { useSearch } from "@/components/search";
import { navIconMap } from "@/components/navigation/navIcons";
import {
  getNavCtaVariant,
  getNavHighlightClasses,
} from "@/components/navigation/navVariant";
import { url as buildUrl } from "@/utils/url";
import {
  MobileNavigation as SharedMobileNavigation,
  type MenuLink,
} from "@semio-community/ecosystem-site-core";
import type { Section } from "@/site.config";

interface MobileNavigationProps {
  menuLinks: Array<{
    path: string;
    title: string;
    inHeader: boolean;
    callToAction?: boolean;
    sections?: Section[];
  }>;
  currentPath: string;
  urlPrefix?: string;
}

const makeUrl = (path: string, prefix: string = "") =>
  buildUrl(path, prefix || import.meta.env.BASE_URL);

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  menuLinks,
  currentPath,
  urlPrefix = "",
}) => {
  const { query, setQuery, results, loading } = useSearch();
  const url = (path: string) => makeUrl(path, urlPrefix);
  const navHighlight = getNavHighlightClasses();
  const ctaVariant = getNavCtaVariant();

  const handleThemeToggle = useCallback(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const isDark = root.getAttribute("data-theme") === "dark";
    const themeChangeEvent = new CustomEvent("theme-change", {
      detail: { theme: isDark ? "light" : "dark" },
    });
    document.dispatchEvent(themeChangeEvent);
  }, []);

  return (
    <SharedMobileNavigation
      menuLinks={menuLinks as MenuLink[]}
      currentPath={currentPath}
      resolveHref={url}
      navHighlight={navHighlight}
      ctaVariant={ctaVariant}
      iconMap={navIconMap}
      onToggleTheme={handleThemeToggle}
      search={{
        query,
        setQuery,
        results,
        loading,
      }}
      renderCallToAction={({
        href,
        variant,
        size,
        className,
        fullWidth,
        children,
      }) => (
        <CallToActionButton
          href={href}
          size={size}
          variant={variant}
          className={className}
          fullWidth={fullWidth}
        >
          {children}
        </CallToActionButton>
      )}
    />
  );
};
