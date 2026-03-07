import React from "react";
import {
  MobileNavButton as SharedMobileNavButton,
  type MobileNavButtonProps as SharedMobileNavButtonProps,
  getNavHighlightClasses,
  resolveNavHighlightVariant,
} from "@semio-community/ecosystem-site-core";
import { siteConfig } from "@/site.config";

export interface MobileNavButtonProps
  extends Omit<SharedMobileNavButtonProps, "navHighlight"> {}

const navHighlight = getNavHighlightClasses(
  resolveNavHighlightVariant(siteConfig.navigation?.highlightVariant),
);

export const MobileNavButton = React.forwardRef<
  HTMLButtonElement,
  MobileNavButtonProps
>(function MobileNavButton(props, ref) {
  return <SharedMobileNavButton ref={ref} navHighlight={navHighlight} {...props} />;
});

export default MobileNavButton;
