import { useEffect, useMemo, useState } from "react";

type ShowcaseLink = {
	label: string;
	href: string;
};

type ShowcaseSection = {
	eyebrow?: string;
	title?: string;
	description?: string;
	ctaPrimaryLabel?: string;
	ctaPrimaryHref?: string;
	ctaSecondaryLabel?: string;
	ctaSecondaryHref?: string;
	quote?: string;
	links?: ShowcaseLink[];
};

type ShowcaseCopy = {
	title: string;
	description?: string;
	sections: Record<string, ShowcaseSection>;
};

let cachedCopy: ShowcaseCopy | null = null;

async function loadShowcaseCopy(): Promise<ShowcaseCopy> {
	if (cachedCopy) return cachedCopy;
	const module = await import("/src/content/showcase/sections.mdx");
	const data = module.frontmatter as ShowcaseCopy | undefined;
	if (!data || !data.sections) {
		throw new Error("Missing showcase copy frontmatter");
	}
	cachedCopy = data;
	return data;
}

export function useShowcaseCopy() {
	const [copy, setCopy] = useState<ShowcaseCopy | null>(cachedCopy);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (cachedCopy) return;
		let cancelled = false;
		loadShowcaseCopy()
			.then((data) => {
				if (!cancelled) setCopy(data);
			})
			.catch((err) => {
				if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
			});
		return () => {
			cancelled = true;
		};
	}, []);

	const sections = useMemo(() => copy?.sections ?? {}, [copy]);

	return {
		copy,
		sections,
		error,
	};
}
