import { mapSlugKeysToRouteKeys } from "@semio-community/ecosystem-site-core";
import {
	BookBookmark,
	Calendar,
	EmojiFunnySquare,
	Feed,
	SquareAcademicCap,
} from "@solar-icons/react-perf/LineDuotone";
import type { ComponentType, SVGProps } from "react";

export type NavigationIcon = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Per-slug icon mapping for header dropdowns + mobile nav rows.
 *
 * KEEP IN SYNC with `menuLinks` in `@/site.config`. Every
 * header-visible route should have a matching key here. Missing
 * entries render with no icon on the mobile drawer (visible drift
 * bug) and a generic home fallback in the desktop dropdown. Tier 3E
 * is slated to fold icon authorship into `MenuLink` itself so this
 * file collapses to a string→component mapping.
 */
const baseRouteIconMap: Record<string, NavigationIcon> = {
	demos: EmojiFunnySquare,
	docs: BookBookmark,
	tutorials: SquareAcademicCap,
	events: Calendar,
	press: Feed,
};

export const navIconMap = mapSlugKeysToRouteKeys(baseRouteIconMap);

export const mainRouteIconMap = baseRouteIconMap;
