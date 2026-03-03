import React from "react";
import { CallToActionButton } from "../ui/CallToActionButton";
import { navIconMap } from "@/components/navigation/navIcons";
import {
  getNavCtaVariant,
  getNavHighlightClasses,
} from "@/components/navigation/navVariant";
import { url as buildUrl } from "@/utils/url";
import {
  NavigationMenu as SharedNavigationMenu,
  type MenuLink,
} from "@semio-community/ecosystem-site-core";
import type { NavCollections } from "@/site.config";

interface NavigationMenuProps {
  currentPath: string;
  menuLinks: MenuLink[];
  navCollections: NavCollections;
  urlPrefix: string;
}

const makeUrl = (path: string, prefix: string = "") =>
  buildUrl(path, prefix || import.meta.env.BASE_URL);

export const NavigationMenuComponent: React.FC<NavigationMenuProps> = ({
  currentPath,
  menuLinks,
  navCollections,
  urlPrefix,
}) => {
  const url = (path: string) => makeUrl(path, urlPrefix);
  const navHighlight = getNavHighlightClasses();
  const ctaVariant = getNavCtaVariant();

  return (
    <SharedNavigationMenu
      currentPath={currentPath}
      menuLinks={menuLinks as MenuLink[]}
      navCollections={navCollections}
      resolveHref={url}
      navHighlight={navHighlight}
      ctaVariant={ctaVariant}
      dropdownIconMap={navIconMap}
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
          variant={variant}
          size={size}
          className={className}
          fullWidth={fullWidth}
        >
          {children}
        </CallToActionButton>
      )}
    />
  );
};
