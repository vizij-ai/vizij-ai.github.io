import {
  TestTube,
  UserHandUp,
  Calendar,
  UsersGroupTwoRounded,
  UserPlusRounded,
  Document2,
} from "@solar-icons/react-perf/LineDuotone";
import { mapSlugKeysToRouteKeys } from "@semio-community/ecosystem-site-core";
import type { ComponentType, SVGProps } from "react";

export type NavigationIcon = ComponentType<SVGProps<SVGSVGElement>>;

const baseRouteIconMap: Record<string, NavigationIcon> = {
  projects: TestTube,
  services: UserHandUp,
  events: Calendar,
  contributors: UsersGroupTwoRounded,
  "get-involved": UserPlusRounded,
  about: Document2,
};

export const navIconMap = mapSlugKeysToRouteKeys(baseRouteIconMap);

export const mainRouteIconMap = baseRouteIconMap;
