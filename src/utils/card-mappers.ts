/**
 * Re-export shim for the card-data mappers, which now live in
 * `@semio-community/ecosystem-site-core`. Keeping this file means
 * existing `@/utils/card-mappers` imports across the site continue
 * to work without changes. The mappers themselves are pure type
 * assertions — see `card-mapper-helpers.ts` in site-core for
 * rationale.
 */
export {
	toEventCardData,
	toHardwareCardData,
	toOrganizationCardData,
	toPersonCardData,
	toPressCardData,
	toResearchCardData,
	toSoftwareCardData,
} from "@semio-community/ecosystem-site-core";
