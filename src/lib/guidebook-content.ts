export type GuidebookLink = {
	label: string;
	href: string;
	description?: string;
};

export type GuidebookHubAction = {
	label: string;
	href: string;
	variant: "primary" | "secondary" | "tertiary";
};

export type GuidebookHubCard = {
	id: string;
	title: string;
	description: string;
	href: string;
	meta: string;
	badge?: string;
	detailRows?: Array<{
		label: string;
		value: string;
	}>;
};

export type GuidebookHubSection = {
	id: string;
	title: string;
	subtitle: string;
	cards: GuidebookHubCard[];
};

export type GuidebookHubContent = {
	eyebrow: string;
	title: string;
	description: string;
	presentationStyle: "atlas" | "spine";
	heroFigure: {
		src: string;
		alt: string;
		title: string;
		caption: string;
	};
	routeStages: Array<{
		eyebrow: string;
		title: string;
		description: string;
		href: string;
		implementation?: string;
		outcome?: string;
	}>;
	progressSteps?: string[];
	decisionPanels?: Array<{
		title: string;
		description: string;
		label: string;
		href: string;
	}>;
	actions: GuidebookHubAction[];
	sections: GuidebookHubSection[];
};

export type GuidebookSurface = "docs" | "tutorials";

export type GuidebookHubMap = Record<GuidebookSurface, GuidebookHubContent>;

export type GuidebookRedirect = {
	surface: GuidebookSurface;
	from: string;
	to: string;
	title: string;
};
