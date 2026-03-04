import { NavigationMenuComponent } from "@/components/navigation/NavigationMenu";
import { SearchApp } from "@/components/search/SearchApp";
import { menuLinks, siteConfig, type NavCollections } from "@/site.config";
import { homeUrl } from "@/utils/url";
import { Header as SharedHeader } from "@semio-community/ecosystem-site-core";

export type HeaderProps = {
  currentPath: string;
  navCollections: NavCollections;
};

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

  return (
    <SharedHeader
      currentPath={normalizedCurrentPath}
      siteTitle={siteConfig.title}
      homeHref={homeUrl()}
      homeLinkContent={
        <>
          <div title={siteConfig.title}>
            <img src="/brand.svg" className="size-5" />
          </div>
          <strong className="max-[320px]:hidden lowercase text-base hidden lg:block z-10 mb-0.5 ms-2 lg:text-base xl:text-xl hover:opacity-90 whitespace-nowrap text-foreground">
            {siteConfig.title}
          </strong>
        </>
      }
      navigation={
        <NavigationMenuComponent
          currentPath={normalizedCurrentPath}
          menuLinks={menuLinks}
          navCollections={navCollections}
          urlPrefix={urlPrefix}
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
