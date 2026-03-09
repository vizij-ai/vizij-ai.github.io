import { NavIconButton } from "@/components/navigation/NavIconButton";
import { navIconMap } from "@/components/navigation/navIcons";
import { SearchModal, SearchProvider, useSearch } from "@/components/search";
import { siteConfig } from "@/site.config";
import type { Section } from "@/site.config";
import { url as buildUrl } from "@/utils/url";
import {
	BoundMobileNavigation,
	getNavHighlightClasses,
	resolveNavCtaVariant,
	resolveNavHighlightVariant,
} from "@semio-community/ecosystem-site-core";
import type React from "react";

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
	showDesktopTrigger?: boolean;
	className?: string;
}

const navHighlight = getNavHighlightClasses(
	resolveNavHighlightVariant(siteConfig.navigation?.highlightVariant),
);
const ctaVariant = resolveNavCtaVariant({
	ctaVariant: siteConfig.navigation?.ctaVariant,
	highlightVariant: siteConfig.navigation?.highlightVariant,
});

export const DesktopSearchTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
	className,
	...rest
}) => {
	const { openDesktopModal } = useSearch();

	return (
		<NavIconButton label="Open search" onClick={openDesktopModal} className={className} {...rest}>
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

const MobileNav: React.FC<{ menuLinks: MenuLink[]; currentPath: string; urlPrefix: string }> = ({
	menuLinks,
	currentPath,
	urlPrefix,
}) => {
	const { query, setQuery, results, loading } = useSearch();
	const resolveHref = (path: string) => buildUrl(path, urlPrefix || import.meta.env.BASE_URL);

	return (
		<BoundMobileNavigation
			menuLinks={menuLinks}
			currentPath={currentPath}
			resolveHref={resolveHref}
			navHighlight={navHighlight}
			ctaVariant={ctaVariant}
			iconMap={navIconMap}
			search={{ query, setQuery, results, loading }}
		/>
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
			<div className={["flex items-center gap-x-1 md:gap-x-2", className || ""].join(" ")}>
				{showDesktopTrigger && (
					<div className="hidden md:flex">
						<DesktopSearchTrigger />
					</div>
				)}

				<div className="md:hidden">
					<MobileNav menuLinks={menuLinks} currentPath={currentPath} urlPrefix={urlPrefix} />
				</div>
			</div>

			<SearchModal />
		</SearchProvider>
	);
};

export default SearchApp;
