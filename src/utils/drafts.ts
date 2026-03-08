type SiteKey = "semio" | "quori" | "vizij";

const SITE_KEY: SiteKey = "vizij";

export function shouldShowDrafts(): boolean {
	if (import.meta.env.PROD) {
		return false;
	}

	const raw =
		process.env.SHOW_DRAFTS ??
		process.env.PUBLIC_SHOW_DRAFTS ??
		import.meta.env.PUBLIC_SHOW_DRAFTS ??
		import.meta.env.SHOW_DRAFTS;

	if (raw === undefined) {
		return true;
	}

	return String(raw).toLowerCase() === "true";
}

export function isDraftVisible(draft?: boolean, sites?: readonly SiteKey[]): boolean {
	if (sites && sites.length > 0 && !sites.includes(SITE_KEY)) {
		return false;
	}

	return draft !== true || shouldShowDrafts();
}
