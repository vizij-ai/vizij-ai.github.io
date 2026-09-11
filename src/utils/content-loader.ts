import { getEntry } from "astro:content";
import type { EntryLoader } from "@semio-community/ecosystem-site-core";

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
 * Returns `null` for a missing id so dangling references drop cleanly;
 * the reference-graph check reports them separately.
 */
export const loadEntry: EntryLoader = async (collection, id) => {
	const entry = await (getEntry as (c: string, i: string) => Promise<unknown>)(
		collection,
		id,
	);
	return (entry as Awaited<ReturnType<EntryLoader>>) ?? null;
};
