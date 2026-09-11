import { getEntry } from "astro:content";
import type { EntryLoader } from "@semio-community/ecosystem-site-core";
import { isDraftVisible } from "@/utils/drafts";

/**
 * Adapter from Astro's `getEntry` to site-core's `EntryLoader`.
 *
 * Astro types `getEntry` per-collection with literal keys; site-core is
 * deliberately framework-agnostic and takes a plain string-keyed loader
 * (it cannot import `astro:content`). Bridging the two needs exactly one
 * cast, and this is it — kept in a named module rather than repeated
 * inline in each route, so there is one place to revisit if Astro's
 * content types gain a string-keyed overload.
 *
 * ## Visibility is enforced here, deliberately
 *
 * Every route filters its own `getStaticPaths` with `isDraftVisible`, but
 * related-entry expansion resolves ids directly — so without this check a
 * public entry could surface a draft or other-site entry it references,
 * linking to a route that was never generated. That is not hypothetical:
 * the ICSR award lists a draft person as a recipient, and the award page
 * rendered their name and a dead `/people/<id>` link.
 *
 * Applying the filter at this single injected boundary means every payload
 * builder inherits it, rather than each one remembering to re-filter.
 *
 * Returns `null` for a missing or hidden id so both drop cleanly; the
 * reference-graph check reports genuinely dangling ids separately.
 */
export const loadEntry: EntryLoader = async (collection, id) => {
	const entry = await (getEntry as (c: string, i: string) => Promise<unknown>)(
		collection,
		id,
	);
	if (!entry) return null;
	const data = (entry as { data?: { draft?: boolean; sites?: string[] } }).data;
	if (data && !isDraftVisible(data.draft, data.sites)) return null;
	return entry as Awaited<ReturnType<EntryLoader>>;
};
