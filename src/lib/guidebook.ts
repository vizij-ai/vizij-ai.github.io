import { getCollection, type CollectionEntry } from "astro:content";
import guidebookHubsData from "@/generated/guidebook/hubs.json";
import guidebookRedirectsData from "@/generated/guidebook/redirects.json";
import type {
	GuidebookHubContent,
	GuidebookHubMap,
	GuidebookRedirect,
	GuidebookSurface,
} from "@/lib/guidebook-content";

export type GuidebookPageEntry = CollectionEntry<"guidebookPages">;

const guidebookHubs = guidebookHubsData as GuidebookHubMap;
const guidebookRedirects = guidebookRedirectsData as GuidebookRedirect[];

function sortGuidebookEntries(entries: GuidebookPageEntry[]) {
	return entries.sort((a, b) => a.data.order - b.data.order);
}

export async function getGuidebookPages(surface: GuidebookSurface) {
	const pages = await getCollection(
		"guidebookPages",
		({ data }) => data.surface === surface && data.publish !== false,
	);
	return sortGuidebookEntries(pages);
}

export async function getGuidebookPageBySlug(surface: GuidebookSurface, slug: string) {
	const pages = await getGuidebookPages(surface);
	return pages.find((entry) => entry.data.routeSlug === slug);
}

export function getGuidebookRedirects(surface: GuidebookSurface) {
	return guidebookRedirects.filter((redirect) => redirect.surface === surface);
}

export async function buildGuidebookHubContent(
	surface: GuidebookSurface,
): Promise<GuidebookHubContent> {
	const hub = guidebookHubs[surface];
	if (!hub) {
		throw new Error(`Missing generated guidebook hub content for ${surface}.`);
	}
	return hub;
}
