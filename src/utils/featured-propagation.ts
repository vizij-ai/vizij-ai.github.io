import { getCollection } from "astro:content";
import { createFeaturedPropagation } from "@semio-community/ecosystem-site-core";
import { siteConfig } from "@/site.config";
import { isDraftVisible } from "@/utils/drafts";

/**
 * Build a propagation handle for this site, scoped to "now."
 *
 * Loads the press + awards collections once and delegates to the
 * shared `createFeaturedPropagation` factory in site-core. The
 * factory computes the currently-featured entity set and returns
 * helpers that augment an individual entry or a list of entries
 * with propagated featuring (so a press item with an active
 * `featuring` window lights up the entities it references).
 *
 * Pages that render any collection-derived cards should call this
 * once near the top and apply `.propagate(entry, collection)` or
 * `.propagateAll(entries, collection)` to whatever they pass to
 * view components.
 *
 * The result is build-time. A daily rebuild (see deploy.yml's
 * `schedule: cron`) keeps temporal windows fresh.
 */
export async function buildFeaturedPropagation(now: Date = new Date()) {
	const [allPress, allAwards] = await Promise.all([
		getCollection("press", ({ data }) =>
			isDraftVisible(data.draft, data.sites),
		),
		getCollection("awards", ({ data }) =>
			isDraftVisible(data.draft, data.sites),
		),
	]);
	return createFeaturedPropagation({
		siteKey: siteConfig.siteKey,
		allPress,
		allAwards,
		now,
	});
}
