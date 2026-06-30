import guidebookHubsData from "./generated/guidebook/hubs.json";
import type { GuidebookHubMap } from "./lib/guidebook-content";
import { DEMO_PAGES, getDemoPageHref } from "./react-pages/demos/demoPages";
import type { SiteConfig } from "./types";
import {
	type FeaturedSection as CoreFeaturedSection,
	type LinkSection as CoreLinkSection,
	type Section as CoreSection,
	type MenuLink,
	type NavCollectionKey,
	type NavCollections,
	setActiveSiteKey,
} from "@semio-community/ecosystem-site-core";

const guidebookHubs = guidebookHubsData as GuidebookHubMap;

export const siteConfig: SiteConfig = {
	// Used as both a meta property (src/components/BaseHead.astro L:31 + L:49) & the generated satori png (src/pages/og-image/[slug].png.ts)
	author: "Vizij",
	// Date.prototype.toLocaleDateString() parameters, found in src/utils/date.ts.
	date: {
		locale: "en-US",
		options: {
			day: "numeric",
			month: "short",
			year: "numeric",
		},
	},
	// Used as the default description meta property and webmanifest description
	description:
		"Vizij is an Open Source Ecosystem for designing, animating and deploying rendered robot faces.",
	// HTML lang property, found in src/layouts/SiteShell.astro (html lang attr) & astro.config.ts L:48
	lang: "en-US",
	// Meta property, found in src/components/BaseHead.astro L:42
	ogLocale: "en_US",
	// Used to construct the meta title property found in src/components/BaseHead.astro L:11, and webmanifest name found in astro.config.ts L:42
	title: "Vizij",
	navigation: {
		highlightVariant: "secondary",
		ctaVariant: "secondary",
	},
	siteKey: "vizij",
	homeOrganizationId: "semio-community",
	suppressOrganizationPage: false,
};

// Publish this build's site key to the shared card converters so their
// featured-state checks narrow to THIS site ("featured here") rather
// than "featured on any site." Runs at module-eval time — before any
// page renders a card — so the converters always see the right key.
// See `active-site.ts` in site-core for why a build singleton is used.
setActiveSiteKey(siteConfig.siteKey);

// Re-export the canonical types from site-core so the local
// `@/site.config` import surface stays unchanged for downstream
// consumers. Site-core's `FeaturedSection` allows the `press` /
// `awards` collections and makes `items` optional (enabling
// auto-populated featured sections).
export type LinkSection = CoreLinkSection;
export type FeaturedSection = CoreFeaturedSection;
export type Section = CoreSection;
export type { NavCollectionKey, NavCollections };

function buildGuidebookMenuSections(basePath: "/docs/" | "/tutorials/"): Section[] {
	const hub = basePath === "/docs/" ? guidebookHubs.docs : guidebookHubs.tutorials;
	return hub.routeStages.map((stage) => ({
		kind: "link" as const,
		title: stage.title,
		href: `${stage.href}#hero`,
	}));
}

// Used to generate links in both the Header & Footer.
export const menuLinks: MenuLink[] = [
	{
		path: "/demos/",
		title: "Demos",
		inHeader: true,
		dropdownSubtitle: "Interactive runtime demos and focused route-by-route previews",
		sections: [
			...DEMO_PAGES.map((demo) => ({
				kind: "link" as const,
				title: demo.label,
				href: getDemoPageHref(demo),
			})),
		],
	},
	{
		path: "/docs/",
		title: "Docs",
		inHeader: true,
		dropdownSubtitle: "Core concepts, architecture, and deployment guidance",
		sections: buildGuidebookMenuSections("/docs/"),
	},
	{
		path: "/tutorials/",
		title: "Tutorials",
		inHeader: true,
		dropdownSubtitle: "Concept-first walkthroughs and phase-1 runnable labs",
		sections: buildGuidebookMenuSections("/tutorials/"),
	},
	{
		path: "/events/",
		title: "Events",
		inHeader: true,
		sections: [
			{ kind: "link", title: "Featured Events", href: "/events/#featured" },
			{ kind: "link", title: "Upcoming Events", href: "/events/#upcoming" },
			{ kind: "link", title: "Past Events", href: "/events/#past" },
			{
				kind: "link",
				title: "Partner for an Event",
				href: "/events/#events-contribute",
			},
		],
	},
	{
		path: "/press/",
		title: "Press",
		inHeader: true,
		dropdownSubtitle:
			"Announcements, publications, stories, and awards from across the ecosystem",
		sections: [
			{ kind: "link", title: "Featured", href: "/press/#featured" },
			{ kind: "link", title: "Announcements", href: "/press/#announcements" },
			{ kind: "link", title: "Publications", href: "/press/#publications" },
			{ kind: "link", title: "Stories", href: "/press/#stories" },
			{ kind: "link", title: "Awards", href: "/press/#awards" },
			{
				kind: "featured",
				title: "Featured Press",
				collection: "press",
				limit: 3,
				fields: { title: "title", subtitle: "description" },
			},
			{
				kind: "featured",
				title: "Featured Awards",
				collection: "awards",
				limit: 3,
				fields: { title: "title", subtitle: "description" },
			},
		],
	},
];
