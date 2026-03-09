/**
 * Centralized configuration for link types across all detail pages
 */

export interface LinkConfig {
	icon: string;
	variant: "default" | "primary" | "secondary" | "tertiary";
	priority: number; // For sorting
}

// Define link type configurations with icons and styling
export const LINK_CONFIGS: Record<string, LinkConfig> = {
	// Primary links (high priority, prominent placement)
	website: {
		icon: "solar:global-line-duotone",
		variant: "default",
		priority: 1,
	},
	purchase: {
		icon: "solar:cart-3-line-duotone",
		variant: "primary",
		priority: 2,
	},
	registration: {
		icon: "solar:user-plus-rounded-line-duotone",
		variant: "primary",
		priority: 2,
	},
	demo: {
		icon: "solar:play-circle-line-duotone",
		variant: "secondary",
		priority: 3,
	},

	// Developer links
	github: {
		icon: "mdi:github",
		variant: "default",
		priority: 4,
	},
	documentation: {
		icon: "solar:document-text-line-duotone",
		variant: "tertiary",
		priority: 5,
	},
	api: {
		icon: "solar:code-square-line-duotone",
		variant: "tertiary",
		priority: 6,
	},

	// Package managers
	pypi: {
		icon: "mdi:language-python",
		variant: "tertiary",
		priority: 7,
	},
	npm: {
		icon: "mdi:npm",
		variant: "tertiary",
		priority: 7,
	},

	// Media & content
	video: {
		icon: "solar:video-library-line-duotone",
		variant: "secondary",
		priority: 8,
	},
	stream: {
		icon: "solar:video-library-line-duotone",
		variant: "secondary",
		priority: 8,
	},
	download: {
		icon: "solar:download-minimalistic-line-duotone",
		variant: "tertiary",
		priority: 9,
	},

	// Commerce
	rental: {
		icon: "solar:calendar-mark-line-duotone",
		variant: "secondary",
		priority: 10,
	},
	tickets: {
		icon: "solar:ticket-line-duotone",
		variant: "primary",
		priority: 3,
	},

	// Communication
	email: {
		icon: "solar:letter-line-duotone",
		variant: "tertiary",
		priority: 11,
	},
	phone: {
		icon: "solar:phone-calling-line-duotone",
		variant: "tertiary",
		priority: 12,
	},
	scheduling: {
		icon: "solar:calendar-mark-line-duotone",
		variant: "default",
		priority: 5,
	},

	// Social media
	twitter: {
		icon: "mdi:twitter",
		variant: "tertiary",
		priority: 13,
	},
	linkedin: {
		icon: "mdi:linkedin",
		variant: "tertiary",
		priority: 14,
	},
	facebook: {
		icon: "mdi:facebook",
		variant: "tertiary",
		priority: 15,
	},
	instagram: {
		icon: "mdi:instagram",
		variant: "tertiary",
		priority: 16,
	},
	youtube: {
		icon: "mdi:youtube",
		variant: "tertiary",
		priority: 17,
	},
	discord: {
		icon: "mdi:discord",
		variant: "tertiary",
		priority: 18,
	},
	slack: {
		icon: "mdi:slack",
		variant: "tertiary",
		priority: 19,
	},
	mastodon: {
		icon: "mdi:mastodon",
		variant: "tertiary",
		priority: 20,
	},
	bluesky: {
		icon: "solar:chat-line-line-duotone",
		variant: "tertiary",
		priority: 21,
	},

	// Academic
	orcid: {
		icon: "solar:chat-line-line-duotone",
		variant: "default",
		priority: 22,
	},
	googleScholar: {
		icon: "solar:graduation-cap-line-duotone",
		variant: "default",
		priority: 23,
	},
	arxiv: {
		icon: "solar:archive-line-duotone",
		variant: "secondary",
		priority: 24,
	},
	doi: {
		icon: "solar:link-round-angle-line-duotone",
		variant: "default",
		priority: 25,
	},

	// Study/Research specific
	pdf: {
		icon: "solar:document-text-line-duotone",
		variant: "primary",
		priority: 26,
	},
	poster: {
		icon: "solar:image-line-duotone",
		variant: "tertiary",
		priority: 27,
	},
	proceedings: {
		icon: "solar:book-line-duotone",
		variant: "tertiary",
		priority: 28,
	},
	dataset: {
		icon: "solar:database-line-duotone",
		variant: "tertiary",
		priority: 29,
	},
	code: {
		icon: "solar:code-square-line-duotone",
		variant: "tertiary",
		priority: 30,
	},

	// Event specific
	program: {
		icon: "solar:document-text-line-duotone",
		variant: "secondary",
		priority: 31,
	},
	recordings: {
		icon: "solar:video-library-line-duotone",
		variant: "tertiary",
		priority: 32,
	},

	// Default fallback
	default: {
		icon: "solar:link-round-angle-line-duotone",
		variant: "tertiary",
		priority: 99,
	},
};

export interface LinkButtonConfig {
	href: string;
	text: string;
	icon?: string;
	variant?: "default" | "primary" | "secondary" | "tertiary";
	external?: boolean;
	priority?: number;
}

/**
 * Get link configuration based on the link type
 */
export function getLinkConfig(linkType: string): LinkConfig {
	// biome-ignore lint/style/noNonNullAssertion: LINK_CONFIGS.default is always defined as a fallback
	return LINK_CONFIGS[linkType] || LINK_CONFIGS.default!;
}

/**
 * Create a standardized link button configuration
 */
export function createLinkButton(
	linkType: string,
	href: string,
	text?: string,
	overrides?: Partial<LinkButtonConfig>,
): LinkButtonConfig {
	const config = getLinkConfig(linkType);

	// Auto-detect if external
	const isExternal =
		href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");

	return {
		href,
		text: text || formatLinkText(linkType),
		icon: config.icon,
		variant: config.variant,
		external: isExternal,
		priority: config.priority,
		...overrides,
	};
}

/**
 * Format link type into human-readable text
 */
function formatLinkText(linkType: string): string {
	const textMap: Record<string, string> = {
		website: "Website",
		github: "GitHub",
		documentation: "Documentation",
		demo: "View Demo",
		purchase: "Purchase",
		rental: "Rental Options",
		pypi: "PyPI",
		npm: "npm",
		registration: "Register",
		tickets: "Get Tickets",
		video: "Watch Video",
		stream: "Watch Stream",
		download: "Download",
		api: "API Reference",
		email: "Email",
		phone: "Call",
		scheduling: "Schedule Meeting",
		twitter: "Twitter",
		linkedin: "LinkedIn",
		facebook: "Facebook",
		instagram: "Instagram",
		youtube: "YouTube",
		discord: "Discord",
		slack: "Slack",
		mastodon: "Mastodon",
		bluesky: "Bluesky",
		orcid: "ORCID",
		googleScholar: "Google Scholar",
		arxiv: "arXiv",
		doi: "DOI",
		pdf: "View PDF",
		poster: "Poster",
		proceedings: "Proceedings",
		dataset: "Dataset",
		code: "Code",
		program: "Program",
		recordings: "Recordings",
	};

	return textMap[linkType] || linkType.charAt(0).toUpperCase() + linkType.slice(1);
}

/**
 * Transform various link data structures into standardized LinkButtonConfig array
 */
// biome-ignore lint/suspicious/noExplicitAny: links record has dynamic structure from content schema
export function transformLinksToButtons(links: Record<string, any>): LinkButtonConfig[] {
	const buttons: LinkButtonConfig[] = [];

	// Handle people links
	if (links.website) {
		buttons.push(createLinkButton("website", links.website, "Website"));
	}
	if (links.github) {
		buttons.push(createLinkButton("github", `https://github.com/${links.github}`));
	}
	if (links.linkedin) {
		buttons.push(createLinkButton("linkedin", `https://linkedin.com/in/${links.linkedin}`));
	}
	if (links.twitter) {
		buttons.push(createLinkButton("twitter", `https://twitter.com/${links.twitter}`));
	}
	if (links.mastodon) {
		buttons.push(createLinkButton("mastodon", links.mastodon));
	}
	if (links.bluesky) {
		buttons.push(createLinkButton("bluesky", `https://bsky.app/profile/${links.bluesky}`));
	}
	if (links.scheduling) {
		buttons.push(createLinkButton("scheduling", links.scheduling, "Schedule"));
	}

	// Handle hardware/software links
	if (links.purchase) {
		buttons.push(createLinkButton("purchase", links.purchase));
	}
	if (links.rental) {
		buttons.push(createLinkButton("rental", links.rental));
	}
	if (links.documentation) {
		buttons.push(createLinkButton("documentation", links.documentation));
	}
	if (links.demo) {
		buttons.push(createLinkButton("demo", links.demo));
	}
	if (links.pypi) {
		buttons.push(createLinkButton("pypi", links.pypi));
	}
	if (links.npm) {
		buttons.push(createLinkButton("npm", links.npm));
	}
	if (links.api) {
		buttons.push(createLinkButton("api", links.api));
	}

	// Handle event links
	if (links.registration) {
		buttons.push(createLinkButton("registration", links.registration));
	}
	if (links.tickets) {
		buttons.push(createLinkButton("tickets", links.tickets));
	}
	if (links.video) {
		buttons.push(createLinkButton("video", links.video));
	}
	if (links.stream) {
		buttons.push(createLinkButton("stream", links.stream));
	}

	// Handle study/research links
	if (links.pdf) {
		buttons.push(createLinkButton("pdf", links.pdf, "View PDF"));
	}
	if (links.doi) {
		buttons.push(createLinkButton("doi", `https://doi.org/${links.doi}`, "DOI"));
	}
	if (links.arxiv) {
		buttons.push(createLinkButton("arxiv", links.arxiv, "arXiv"));
	}
	if (links.code) {
		buttons.push(createLinkButton("code", links.code, "Code"));
	}
	if (links.data) {
		buttons.push(createLinkButton("dataset", links.data, "Dataset"));
	}

	// Sort by priority
	return buttons.sort((a, b) => (a.priority || 99) - (b.priority || 99));
}

/**
 * Create link buttons for academic profiles
 */
// biome-ignore lint/suspicious/noExplicitAny: generic CMS entry data shape varies by collection
export function createAcademicButtons(data: any): LinkButtonConfig[] {
	const buttons: LinkButtonConfig[] = [];

	if (data.orcid) {
		buttons.push(createLinkButton("orcid", `https://orcid.org/${data.orcid}`, "ORCID"));
	}
	if (data.googleScholar) {
		buttons.push(
			createLinkButton(
				"googleScholar",
				`https://scholar.google.com/citations?user=${data.googleScholar}`,
				"Google Scholar",
			),
		);
	}

	return buttons;
}

/**
 * Create link buttons for contact information
 */
// biome-ignore lint/suspicious/noExplicitAny: generic CMS entry data shape varies by collection
export function createContactButtons(data: any): LinkButtonConfig[] {
	const buttons: LinkButtonConfig[] = [];

	if (data.email) {
		buttons.push(createLinkButton("email", `mailto:${data.email}`, "Email"));
	}
	if (data.phone) {
		buttons.push(createLinkButton("phone", `tel:${data.phone}`, "Call"));
	}

	return buttons;
}

/**
 * Combine and deduplicate multiple button arrays
 */
export function combineButtons(...buttonArrays: LinkButtonConfig[][]): LinkButtonConfig[] {
	const combined = buttonArrays.flat();
	const seen = new Set<string>();
	const unique = combined.filter((button) => {
		const key = button.href;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});

	return unique.sort((a, b) => (a.priority || 99) - (b.priority || 99));
}
