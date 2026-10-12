import { type CollectionEntry, getCollection } from "astro:content";
import {
	createCollectionQueries,
	getActiveSiteContext,
	type QueryCollection,
} from "@semio-community/ecosystem-site-core";
import { loadEntry } from "@/utils/content-loader";
import { isDraftVisible } from "@/utils/drafts";

/**
 * This site's collection queries: the shared selectors from site-core,
 * bound to this build's site context and to the two loaders that decide
 * what this site may render.
 *
 * The selectors themselves (rankings, related-entry scoring, author
 * lines) live in site-core so every site answers these questions the
 * same way. Only the `astro:content` binding lives here, because
 * site-core cannot import it.
 *
 * The context is the one `site.config` installs, read once and passed
 * explicitly, so these rankings and every featured check elsewhere in the
 * build agree on the site and the instant.
 */

type Entries = { [C in QueryCollection]: CollectionEntry<C> };

const site = getActiveSiteContext();
if (!site) {
	throw new Error(
		"src/utils/collections.ts: no site context is installed; site.config must run first",
	);
}

const loadCollection = <C extends QueryCollection>(collection: C) =>
	(getCollection as (c: C, filter: (entry: Entries[C]) => boolean) => Promise<Entries[C][]>)(
		collection,
		({ data }) => isDraftVisible(data.draft, data.sites),
	);

export const {
	getAllEvents,
	getCurrentEvents,
	getFeaturedEvents,
	getUpcomingEvents,
	getAllHardware,
	getRelatedHardware,
	getAllPeople,
	getFormattedAuthors,
	getPeopleByExpertise,
	getPeopleByOrganization,
	getPartnerOrganizations,
	getAllResearch,
	getRelatedResearch,
	getResearchByOrganization,
	getAllSoftware,
	getRelatedSoftware,
} = createCollectionQueries<Entries>({ site, loadCollection, loadEntry });
