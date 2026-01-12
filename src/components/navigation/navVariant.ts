import { siteConfig } from "@/site.config";
import type { NavCtaVariant, NavHighlightVariant } from "@/types";

type NavHighlightClasses = {
  text: string;
  focusOutline: string;
};

const navHighlightClassMap: Record<NavHighlightVariant, NavHighlightClasses> = {
  primary: {
    text: "text-accent-two",
    focusOutline: "focus:outline-accent-two",
  },
  secondary: {
    text: "text-accent-one",
    focusOutline: "focus:outline-accent-one",
  },
  tertiary: {
    text: "text-accent-three",
    focusOutline: "focus:outline-accent-three",
  },
};

export const resolveNavHighlightVariant = (
  override?: NavHighlightVariant,
): NavHighlightVariant =>
  override ?? siteConfig.navigation?.highlightVariant ?? "tertiary";

export const getNavHighlightClasses = (
  override?: NavHighlightVariant,
): NavHighlightClasses => {
  const variant = resolveNavHighlightVariant(override);
  return navHighlightClassMap[variant];
};

export const getNavCtaVariant = (): NavCtaVariant =>
  siteConfig.navigation?.ctaVariant ??
  siteConfig.navigation?.highlightVariant ??
  "tertiary";
