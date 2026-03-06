import type { CollectionEntry } from "astro:content";
import type {
  PersonCardData,
  OrganizationCardData,
} from "@semio-community/ecosystem-site-core";

export function toPersonCardData(
  data: CollectionEntry<"people">["data"],
): PersonCardData {
  return data as PersonCardData;
}

export function toOrganizationCardData(
  data: CollectionEntry<"organizations">["data"],
): OrganizationCardData {
  return data as OrganizationCardData;
}
