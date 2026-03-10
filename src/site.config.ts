import type { SiteConfig } from "@/types";

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
};

export interface LinkSection {
	kind: "link";
	title: string;
	href: string;
}

export interface FeaturedSection {
	kind: "featured";
	title: string;
	collection: "organizations" | "events" | "software" | "research" | "hardware" | "people";
	items: string[];
	fields: {
		title: string;
		subtitle?: string;
	};
}

export type Section = LinkSection | FeaturedSection;
export type NavCollectionKey = FeaturedSection["collection"];
export type NavCollections = Partial<
	Record<
		NavCollectionKey,
		Record<
			string,
			{
				id: string;
				fields: Record<string, string | number | undefined>;
			}
		>
	>
>;

// Used to generate links in both the Header & Footer.
export const menuLinks: {
	path: string;
	title: string;
	inHeader: boolean;
	callToAction?: boolean;
	dropdownSubtitle?: string;
	sections?: Section[];
}[] = [
	{
		path: "/demos/",
		title: "Demos",
		inHeader: true,
		dropdownSubtitle: "Interactive runtime demos and section shortcuts",
		sections: [
			{ kind: "link", title: "Overview", href: "/demos/#hero" },
			{ kind: "link", title: "Rig Controls", href: "/demos/#controls" },
			{ kind: "link", title: "Expressions", href: "/demos/#expressions" },
			{ kind: "link", title: "Gaze", href: "/demos/#gaze" },
			{ kind: "link", title: "Voice", href: "/demos/#voice" },
			{ kind: "link", title: "Architecture", href: "/demos/#architecture" },
			{ kind: "link", title: "Community", href: "/demos/#community" },
		],
	},
	{
		path: "/docs/",
		title: "Docs",
		inHeader: true,
		dropdownSubtitle: "Core concepts, architecture, and deployment guidance",
		sections: [
			{ kind: "link", title: "Overview", href: "/docs/#hero" },
			{ kind: "link", title: "Getting Started", href: "/docs/getting-started/#hero" },
			{ kind: "link", title: "Architecture", href: "/docs/architecture/#hero" },
			{ kind: "link", title: "Renderer Data Model", href: "/docs/renderer-data-model/#hero" },
			{
				kind: "link",
				title: "Rigging and Control Model",
				href: "/docs/rigging-and-control-model/#hero",
			},
			{ kind: "link", title: "Animation Model", href: "/docs/animation-model/#hero" },
			{ kind: "link", title: "Deployment Model", href: "/docs/deployment-model/#hero" },
		],
	},
	{
		path: "/tutorials/",
		title: "Tutorials",
		inHeader: true,
		dropdownSubtitle: "Concept-first walkthroughs and phase-1 runnable labs",
		sections: [
			{ kind: "link", title: "Overview", href: "/tutorials/#hero" },
			{ kind: "link", title: "Hello Face", href: "/tutorials/hello-face/#hero" },
			{
				kind: "link",
				title: "Renderer Data Model",
				href: "/tutorials/renderer-data-model/#hero",
			},
			{ kind: "link", title: "Authoring", href: "/tutorials/authoring/#hero" },
			{
				kind: "link",
				title: "Rigging and Control",
				href: "/tutorials/rigging-and-control/#hero",
			},
			{ kind: "link", title: "Minimal Player", href: "/tutorials/minimal-player/#hero" },
			{ kind: "link", title: "Animations", href: "/tutorials/animations/#hero" },
			{ kind: "link", title: "Agent Face", href: "/tutorials/agent-face/#hero" },
			{ kind: "link", title: "Deployment", href: "/tutorials/deployment/#hero" },
		],
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
];
