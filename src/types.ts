export type NavHighlightVariant = "primary" | "secondary" | "tertiary";
export type NavCtaVariant = "default" | "primary" | "secondary" | "tertiary";

export interface SiteConfig {
	author: string;
	date: {
		locale: string | string[] | undefined;
		options: Intl.DateTimeFormatOptions;
	};
	description: string;
	lang: string;
	ogLocale: string;
	title: string;
	navigation?: {
		highlightVariant?: NavHighlightVariant;
		ctaVariant?: NavCtaVariant;
	};
	og?: {
		pageBackground?: string;
		cardBackground?: string;
	};
	/** Identifies this site within the ecosystem (matches the sync script siteKey). */
	siteKey: "semio-community" | "quori" | "vizij";
	/** ID of the organization this site represents. Used to pick the headline role on person bios and to reorder a person's affiliations so the home-org entry comes first. */
	homeOrganizationId?: string;
	/** When true, `/organizations/<homeOrganizationId>` is excluded from this site and affiliation rows pointing at the home org link to `/` instead. */
	suppressOrganizationPage?: boolean;
	/**
	 * Site-wide parallax hex background — a branding element, not a
	 * per-page toggle. When present, the background renders on EVERY
	 * page of this site (optionally tuned by the fields below). Omit the
	 * key entirely to disable the background for the whole site. There is
	 * deliberately no per-page override: the background is part of the
	 * site's visual identity, so its presence is a single site-level
	 * decision rather than per-page configuration overhead.
	 */
	parallaxBackground?: {
		count?: number;
		seed?: string | number;
		verticalSpanVh?: number;
		horizontalRangeVw?: { min: number; max: number };
		palette?: string[];
		opacity?: { stroke: [number, number]; fill: [number, number] };
		className?: string;
	};
}

export interface PaginationLink {
	srLabel?: string;
	text?: string;
	url: string;
}

export interface SiteMeta {
	articleDate?: string | undefined;
	description?: string;
	ogImage?: string | undefined;
	title: string;
	navigation?: {
		highlightVariant?: NavHighlightVariant;
		ctaVariant?: NavCtaVariant;
	};
}

/** Webmentions */
export interface WebmentionsFeed {
	children: WebmentionsChildren[];
	name: string;
	type: string;
}

export interface WebmentionsCache {
	children: WebmentionsChildren[];
	lastFetched: null | string;
}

export interface WebmentionsChildren {
	author: Author | null;
	content?: Content | null;
	"mention-of": string;
	name?: null | string;
	photo?: null | string[];
	published?: null | string;
	rels?: Rels | null;
	summary?: Summary | null;
	syndication?: null | string[];
	type: string;
	url: string;
	"wm-id": number;
	"wm-private": boolean;
	"wm-property": string;
	"wm-protocol": string;
	"wm-received": string;
	"wm-source": string;
	"wm-target": string;
}

export interface Author {
	name: string;
	photo: string;
	type: string;
	url: string;
}

export interface Content {
	"content-type": string;
	html: string;
	text: string;
	value: string;
}

export interface Rels {
	canonical: string;
}

export interface Summary {
	"content-type": string;
	value: string;
}

export type AdmonitionType = "tip" | "note" | "important" | "caution" | "warning";

export interface Badge {
	variant?:
		| "default"
		| "accent"
		| "accent-base"
		| "accent-one"
		| "accent-two"
		| "muted"
		| "outline";
	showHash?: boolean;
	title: string;
}
