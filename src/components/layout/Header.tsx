import { navIconMap } from "@/components/navigation/navIcons";
import { SearchApp } from "@/components/search/SearchApp";
import { type NavCollections, menuLinks, siteConfig } from "@/site.config";
import { url, homeUrl } from "@/utils/url";
import {
  BoundNavigationMenu,
  Header as SharedHeader,
  getNavHighlightClasses,
  resolveNavCtaVariant,
  resolveNavHighlightVariant,
} from "@semio-community/ecosystem-site-core";
import { useEffect } from "react";

export type HeaderProps = {
  currentPath: string;
  navCollections: NavCollections;
};

const navHighlight = getNavHighlightClasses(
  resolveNavHighlightVariant(siteConfig.navigation?.highlightVariant),
);
const ctaVariant = resolveNavCtaVariant({
  ctaVariant: siteConfig.navigation?.ctaVariant,
  highlightVariant: siteConfig.navigation?.highlightVariant,
});

function normalizeCurrentPath(currentPath: string, urlPrefix: string) {
  if (!urlPrefix || urlPrefix === "/") {
    return currentPath;
  }
  if (currentPath === urlPrefix) {
    return "/";
  }
  if (currentPath.startsWith(`${urlPrefix}/`)) {
    const stripped = currentPath.slice(urlPrefix.length);
    return stripped.startsWith("/") ? stripped : `/${stripped}`;
  }
  return currentPath;
}

export default function Header({ currentPath, navCollections }: HeaderProps) {
  const urlPrefix = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const normalizedCurrentPath = normalizeCurrentPath(currentPath, urlPrefix);
  const resolveHref = (path: string) =>
    url(path, urlPrefix || import.meta.env.BASE_URL);

  useEffect(() => {
    const header = document.getElementById("main-header");
    const panel = document.getElementById("main-header-panel");
    const nav = header?.querySelector("nav");
    if (!(header instanceof HTMLElement) || !(panel instanceof HTMLElement) || !(nav instanceof HTMLElement)) {
      return;
    }

    const resetOffsets = () => {
      panel.style.removeProperty("--vizij-nav-dropdown-shell-offset");
      panel.style.removeProperty("--vizij-nav-dropdown-content-offset");
    };

    const dropdownLabels = new Set(
      menuLinks.filter((link) => link.sections?.length).map((link) => link.title),
    );

    const scheduleUpdate = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const panelShell = panel.querySelector(
            ":scope > .pointer-events-auto > .mx-auto",
          );
          const panelContent = panel.querySelector(".animate-navPanelContentIn");
          const panelTitle = panelContent?.querySelector(".font-semibold.text-sm");
          const titleText = panelTitle?.textContent?.trim();
          const activeLabel = titleText?.replace(/\s+Home$/, "");

          if (!(panelShell instanceof HTMLElement) || !(panelContent instanceof HTMLElement) || !activeLabel) {
            resetOffsets();
            return;
          }

          const trigger = [...nav.querySelectorAll("a[href]")].find((link) => {
            const label = link.textContent?.trim();
            return label && dropdownLabels.has(label) && label === activeLabel;
          });

          if (!(trigger instanceof HTMLElement)) {
            resetOffsets();
            return;
          }

          resetOffsets();

          const triggerRect = trigger.getBoundingClientRect();
          const shellRect = panelShell.getBoundingClientRect();
          const contentRect = panelContent.getBoundingClientRect();
          const desiredOffset =
            triggerRect.left +
            triggerRect.width / 2 -
            (contentRect.left + contentRect.width / 2);

          const minViewportPadding = 16;
          const minShellOffset = minViewportPadding - shellRect.left;
          const maxShellOffset = window.innerWidth - minViewportPadding - shellRect.right;
          const shellOffset = Math.max(
            minShellOffset,
            Math.min(desiredOffset, maxShellOffset),
          );

          const remainingOffset = desiredOffset - shellOffset;
          const minContentOffset = shellRect.left - contentRect.left;
          const maxContentOffset = shellRect.right - contentRect.right;
          const contentOffset = Math.max(
            minContentOffset,
            Math.min(remainingOffset, maxContentOffset),
          );

          panel.style.setProperty(
            "--vizij-nav-dropdown-shell-offset",
            `${Math.round(shellOffset)}px`,
          );
          panel.style.setProperty(
            "--vizij-nav-dropdown-content-offset",
            `${Math.round(contentOffset)}px`,
          );
        });
      });
    };

    const triggers = [...nav.querySelectorAll("a[href]")].filter((link) => {
      const label = link.textContent?.trim();
      return !!label && dropdownLabels.has(label);
    });

    const observer = new MutationObserver(scheduleUpdate);
    observer.observe(panel, {
      childList: true,
      subtree: true,
    });

    for (const trigger of triggers) {
      trigger.addEventListener("mouseenter", scheduleUpdate);
      trigger.addEventListener("focus", scheduleUpdate);
      trigger.addEventListener("click", scheduleUpdate);
    }

    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", scheduleUpdate);
      for (const trigger of triggers) {
        trigger.removeEventListener("mouseenter", scheduleUpdate);
        trigger.removeEventListener("focus", scheduleUpdate);
        trigger.removeEventListener("click", scheduleUpdate);
      }
    };
  }, []);

  return (
    <SharedHeader
      currentPath={normalizedCurrentPath}
      siteTitle={siteConfig.title}
      homeHref={homeUrl()}
      homeLinkContent={
        <>
          <div title={siteConfig.title}>
            <img src={url("/brand.svg")} className="size-5" alt="" />
          </div>
          <strong className="max-[320px]:hidden lowercase text-base hidden lg:block z-10 mb-0.5 ms-2 lg:text-base xl:text-xl hover:opacity-90 whitespace-nowrap text-foreground">
            {siteConfig.title}
          </strong>
        </>
      }
      navigation={
        <BoundNavigationMenu
          currentPath={normalizedCurrentPath}
          menuLinks={menuLinks}
          navCollections={navCollections}
          resolveHref={resolveHref}
          navHighlight={navHighlight}
          ctaVariant={ctaVariant}
          dropdownIconMap={navIconMap}
        />
      }
      search={
        <SearchApp
          menuLinks={menuLinks}
          currentPath={normalizedCurrentPath}
          urlPrefix={urlPrefix}
        />
      }
    />
  );
}
