import React from "react";
import {
  NavIconButton as SharedNavIconButton,
  type NavIconButtonProps as SharedNavIconButtonProps,
} from "@semio-community/ecosystem-site-core";
import { getNavHighlightClasses } from "@/components/navigation/navVariant";

export interface NavIconButtonProps
  extends Omit<SharedNavIconButtonProps, "navHighlight"> {}

export const NavIconButton = React.forwardRef<
  HTMLButtonElement,
  NavIconButtonProps
>(function NavIconButton(props, ref) {
  const navHighlight = getNavHighlightClasses();
  return <SharedNavIconButton ref={ref} navHighlight={navHighlight} {...props} />;
});

export default NavIconButton;
