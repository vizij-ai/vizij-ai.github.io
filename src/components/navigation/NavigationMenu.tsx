import React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { clsx } from "clsx";
import { CallToActionButton } from "../ui/CallToActionButton";
import { navIconMap } from "@/components/navigation/navIcons";
import { url as buildUrl } from "@/utils/url";
import type {
  FeaturedSection,
  LinkSection,
  NavCollections,
  Section,
} from "@/site.config";

interface NavigationMenuProps {
  currentPath: string;
  menuLinks: Array<{
    path: string;
    title: string;
    inHeader: boolean;
    callToAction?: boolean;
    dropdownSubtitle?: string;
    sections?: Section[];
  }>;
  navCollections: NavCollections;
  urlPrefix: string;
}

// Helper function to construct URLs
const makeUrl = (path: string, prefix: string = "") =>
  buildUrl(path, prefix || import.meta.env.BASE_URL);

const dropdownIconMap = navIconMap;

export const NavigationMenuComponent: React.FC<NavigationMenuProps> = ({
  currentPath,
  menuLinks,
  navCollections,
  urlPrefix,
}) => {
  const url = (path: string) => makeUrl(path, urlPrefix);
  const getLinkSections = (sections?: Section[]) =>
    (sections ?? []).filter(
      (section): section is LinkSection => section.kind === "link",
    );
  const getFeaturedSections = (sections?: Section[]) =>
    (sections ?? []).filter(
      (section): section is FeaturedSection => section.kind === "featured",
    );
  const getFieldValue = (value: string | number | undefined) =>
    value === undefined ? "" : String(value);

  // Robust path normalization and active detection
  const normalize = (p: string | undefined) => {
    if (!p) return "/";
    const withoutQuery = p.split("?")[0]!.split("#")[0]!;
    let s = withoutQuery;
    if (!s.startsWith("/")) s = `/${s}`;
    if (s !== "/" && s.endsWith("/")) s = s.slice(0, -1);
    return s;
  };

  // Determine a single active header link via longest prefix match
  const activeHeaderPath = (() => {
    const cur = normalize(currentPath);
    let bestPath = "";
    let bestLen = -1;
    for (const link of menuLinks.filter((l) => l.inHeader)) {
      const base = normalize(link.path);
      const matches =
        (base === "/" && cur === "/") ||
        (base !== "/" && (cur === base || cur.startsWith(`${base}/`)));
      if (matches && base.length > bestLen) {
        bestPath = link.path;
        bestLen = base.length;
      }
    }
    return bestPath;
  })();

  // Fallback if no menu links
  if (!menuLinks || menuLinks.length === 0) {
    return <div className="text-accent-three">Loading navigation...</div>;
  }

  return (
    <NavigationMenu.Root className="relative z-10">
      <NavigationMenu.List className="flex list-none items-center justify-center gap-0.5 md:gap-1">
        {menuLinks
          .filter((link) => link.inHeader)
          .map((link) => {
            const linkSections = getLinkSections(link.sections);
            const featuredSections = getFeaturedSections(link.sections);
            const hasDropdown =
              (linkSections.length > 0 || featuredSections.length > 0) &&
              !link.callToAction;

            if (!hasDropdown || link.callToAction) {
              // Simple link without dropdown
              if (link.callToAction) {
                return (
                  <NavigationMenu.Item key={link.path}>
                    <CallToActionButton
                      href={url(link.path)}
                      variant="tertiary"
                      size="small"
                      className="text-xs sm:text-sm px-2 md:px-3 py-1.5 md:py-2"
                    >
                      {link.title}
                    </CallToActionButton>
                  </NavigationMenu.Item>
                );
              }

              return (
                <NavigationMenu.Item key={link.path}>
                  <NavigationMenu.Link
                    className={clsx(
                      "block select-none rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-xs sm:text-sm font-medium leading-none no-underline transition-all duration-200 whitespace-nowrap",
                      "text-accent-three hover:text-accent-base focus:text-accent-base",
                      link.path === activeHeaderPath &&
                        "font-semibold text-foreground",
                    )}
                    href={url(link.path)}
                  >
                    {link.title}
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              );
            }

            // Link with dropdown
            return (
              <NavigationMenu.Item key={link.path}>
                <NavigationMenu.Trigger
                  className={clsx(
                    "group inline-flex select-none items-center gap-0.5 md:gap-1 rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-xs sm:text-sm font-medium leading-none outline-none transition-colors whitespace-nowrap",
                    link.path === activeHeaderPath
                      ? "font-semibold text-accent-three"
                      : "text-foreground hover:text-accent-base focus:text-accent-base data-[state=open]:text-accent-base",
                  )}
                  onPointerDown={(e) => {
                    // Allow click to navigate
                    e.preventDefault();
                    window.location.href = url(link.path);
                  }}
                  onPointerUp={(e) => {
                    e.preventDefault();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {link.title}
                  <svg
                    className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:-rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </NavigationMenu.Trigger>

                <NavigationMenu.Content className="data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight absolute top-0 left-0 w-full sm:w-auto">
                  <div className="w-[400px] p-4 bg-surface backdrop-blur-md rounded-xl shadow-2xl border border-color-100 dark:border-color-800">
                    {/* Main page link */}
                    <a
                      href={url(link.path)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent-base/10 transition-colors mb-3 group/link"
                    >
                      <div className="w-10 h-10 rounded-lg bg-accent-base/10 flex items-center justify-center shrink-0">
                        {(() => {
                          const IconComponent = dropdownIconMap[link.path];
                          if (IconComponent) {
                            return (
                              <IconComponent className="w-5 h-5 text-accent-base" />
                            );
                          }
                          return (
                            <svg
                              className="w-5 h-5 text-accent-base"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                              <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                          );
                        })()}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground group-hover/link:text-accent-base transition-colors">
                          {link.title} Home
                        </div>
                        <div className="text-xs text-color-500">
                          {link.dropdownSubtitle ??
                            `Browse all ${link.title.toLowerCase()}`}
                        </div>
                      </div>
                    </a>

                    {/* Divider */}
                    {(linkSections.length > 0 ||
                      featuredSections.length > 0) && (
                      <div className="h-px bg-color-200 dark:bg-color-700 my-3"></div>
                    )}

                    {/* Sections */}
                    {linkSections.length > 0 && (
                      <div className="space-y-2 mb-3">
                        <div className="text-xs font-semibold text-color-500 uppercase tracking-wider px-3">
                          Sections
                        </div>
                        {linkSections.map((section) => (
                          <a
                            key={section.href}
                            href={url(section.href)}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent-base/10 transition-colors group/link"
                          >
                            <span className="text-sm text-foreground group-hover/link:text-accent-base transition-colors">
                              {section.title}
                            </span>
                          </a>
                        ))}
                      </div>
                    )}

                    {featuredSections.map((section, index) => {
                      const collectionItems =
                        navCollections[section.collection] ?? {};
                      const items = section.items
                        .map((itemId) => collectionItems[itemId])
                        .filter(
                          (
                            item,
                          ): item is {
                            id: string;
                            fields: Record<string, string | number | undefined>;
                          } => Boolean(item),
                        );

                      if (items.length === 0) return null;

                      const titleField = section.fields.title;
                      const subtitleField = section.fields.subtitle;

                      return (
                        <React.Fragment
                          key={`${section.collection}-${section.title}`}
                        >
                          {(linkSections.length > 0 || index > 0) && (
                            <div className="h-px bg-color-200 dark:bg-color-700 my-3"></div>
                          )}
                          <div className="space-y-2">
                            <div className="text-xs font-semibold text-color-500 uppercase tracking-wider px-3">
                              {section.title}
                            </div>
                            {items.map((item) => {
                              const title =
                                getFieldValue(item.fields[titleField]) ||
                                item.id;
                              const subtitle = subtitleField
                                ? getFieldValue(item.fields[subtitleField])
                                : "";
                              return (
                                <a
                                  key={item.id}
                                  href={url(
                                    `/${section.collection}/${item.id}`,
                                  )}
                                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent-base/10 transition-colors group/link"
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="font-medium text-sm text-foreground group-hover/link:text-accent-base transition-colors line-clamp-2">
                                      {title}
                                    </div>
                                    {subtitle && (
                                      <div className="text-xs text-color-500 line-clamp-1">
                                        {subtitle}
                                      </div>
                                    )}
                                  </div>
                                </a>
                              );
                            })}
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            );
          })}

        {/* Indicator hidden to avoid border overlap issues */}
        <NavigationMenu.Indicator className="hidden" />
      </NavigationMenu.List>

      <NavigationMenu.Viewport className="absolute top-full left-0 right-0 mt-2.5 flex justify-center data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut h-(--radix-navigation-menu-viewport-height) w-full origin-[top_center] overflow-hidden transition-[width,height] duration-300 sm:w-(--radix-navigation-menu-viewport-width)" />
    </NavigationMenu.Root>
  );
};
