import { siteConfig } from "@/site.config";
import {
	NavIconButton as SharedNavIconButton,
	type NavIconButtonProps as SharedNavIconButtonProps,
	getNavHighlightClasses,
	resolveNavHighlightVariant,
} from "@semio-community/ecosystem-site-core";
import React from "react";

export interface NavIconButtonProps extends Omit<SharedNavIconButtonProps, "navHighlight"> {}

const navHighlight = getNavHighlightClasses(
	resolveNavHighlightVariant(siteConfig.navigation?.highlightVariant),
);

export const NavIconButton = React.forwardRef<HTMLButtonElement, NavIconButtonProps>(
	function NavIconButton(props, ref) {
		return <SharedNavIconButton ref={ref} navHighlight={navHighlight} {...props} />;
	},
);

export default NavIconButton;
