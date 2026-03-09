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
	const resolveHref = (path: string) => url(path, urlPrefix || import.meta.env.BASE_URL);

	return (
		<SharedHeader
			currentPath={normalizedCurrentPath}
			siteTitle={siteConfig.title}
			homeHref={homeUrl()}
			homeLinkContent={
				<>
					<div title={siteConfig.title}>
						<img src="/brand.svg" className="size-5" alt="" />
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
