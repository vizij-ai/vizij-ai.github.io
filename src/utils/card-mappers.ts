import type { CollectionEntry } from "astro:content";
import type { OrganizationCardData, PersonCardData } from "@semio-community/ecosystem-site-core";

export function toPersonCardData(data: CollectionEntry<"people">["data"]): PersonCardData {
	return data as PersonCardData;
}

export function toOrganizationCardData(
	data: CollectionEntry<"organizations">["data"],
): OrganizationCardData {
	return data as OrganizationCardData;
}

import type {
	EventCardData,
	HardwareCardData,
	ResearchCardData,
	SoftwareCardData,
} from "@semio-community/ecosystem-site-core";

export function toHardwareCardData(data: CollectionEntry<"hardware">["data"]): HardwareCardData {
	return data as HardwareCardData;
}

export function toSoftwareCardData(data: CollectionEntry<"software">["data"]): SoftwareCardData {
	return data as SoftwareCardData;
}

export function toEventCardData(data: CollectionEntry<"events">["data"]): EventCardData {
	return data as EventCardData;
}

export function toResearchCardData(data: CollectionEntry<"research">["data"]): ResearchCardData {
	return data as ResearchCardData;
}
