import { mapSlugKeysToRouteKeys } from "@semio-community/ecosystem-site-core";
import {
	Calendar,
	Document2,
	EmojiFunnySquare,
	TestTube,
	UserHandUp,
	UserPlusRounded,
	UsersGroupTwoRounded,
} from "@solar-icons/react-perf/LineDuotone";
import type { ComponentType, SVGProps } from "react";

export type NavigationIcon = ComponentType<SVGProps<SVGSVGElement>>;

const baseRouteIconMap: Record<string, NavigationIcon> = {
	demos: EmojiFunnySquare,
	projects: TestTube,
	services: UserHandUp,
	events: Calendar,
	contributors: UsersGroupTwoRounded,
	"get-involved": UserPlusRounded,
	about: Document2,
};

export const navIconMap = mapSlugKeysToRouteKeys(baseRouteIconMap);

export const mainRouteIconMap = baseRouteIconMap;
