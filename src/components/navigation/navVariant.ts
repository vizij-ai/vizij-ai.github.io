import { siteConfig } from "@/site.config";
import {
  getNavHighlightClasses as resolveNavHighlightClasses,
  resolveNavCtaVariant,
  resolveNavHighlightVariant as resolveHighlightVariant,
  type NavCtaVariant,
  type NavHighlightClasses,
  type NavHighlightVariant,
} from "@semio-community/ecosystem-site-core";

export const resolveNavHighlightVariant = (
  override?: NavHighlightVariant,
): NavHighlightVariant =>
  resolveHighlightVariant(siteConfig.navigation?.highlightVariant, override);

export const getNavHighlightClasses = (
  override?: NavHighlightVariant,
): NavHighlightClasses => {
  const variant = resolveNavHighlightVariant(override);
  return resolveNavHighlightClasses(variant);
};

export const getNavCtaVariant = (): NavCtaVariant =>
  resolveNavCtaVariant({
    ctaVariant: siteConfig.navigation?.ctaVariant,
    highlightVariant: siteConfig.navigation?.highlightVariant,
  });
