import hugeiconsIcons from "@iconify-json/hugeicons/icons.json";
import mdiIcons from "@iconify-json/mdi/icons.json";
import solarIcons from "@iconify-json/solar/icons.json";
import type { IconifyJSON } from "@iconify/types";
import { getIconData, iconToSVG } from "@iconify/utils";
import React from "react";
import type { SVGAttributes } from "react";

const COLLECTIONS: Record<string, IconifyJSON> = {
	solar: solarIcons as IconifyJSON,
	mdi: mdiIcons as IconifyJSON,
	hugeicons: hugeiconsIcons as IconifyJSON,
};

export interface IconProps extends SVGAttributes<SVGSVGElement> {
	name: string;
	inline?: boolean;
}

/**
 * Lightweight Iconify-aware React icon component.
 * Supports the icon sets already configured for astro-icon (solar, mdi, hugeicons).
 */
export function Icon({ name, inline = false, ...rest }: IconProps) {
	const [setName, iconName] = name.includes(":")
		? (name.split(":") as [string, string])
		: (["local", name] as [string, string]);

	const collection = COLLECTIONS[setName];

	if (!collection) {
		if (import.meta.env?.DEV) {
			console.warn(`[Icon] Unknown icon set "${setName}" for ${name}`);
		}
		return null;
	}

	const iconData = getIconData(collection, iconName);
	if (!iconData) {
		if (import.meta.env?.DEV) {
			console.warn(`[Icon] Missing icon "${iconName}" in set "${setName}"`);
		}
		return null;
	}

	const renderData = iconToSVG(iconData, {
		height: rest.height ?? rest.width ?? "1em",
	});

	const { body, attributes } = renderData;
	const combined = {
		...attributes,
		...rest,
		"data-icon": name,
	} as SVGAttributes<SVGSVGElement>;

	if (!inline) {
		combined["aria-hidden"] = combined["aria-hidden"] ?? true;
		combined.focusable = combined.focusable ?? false;
	}

	return (
		<svg
			{...combined}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: SVG icon body is sourced from trusted bundled icon sprite
			dangerouslySetInnerHTML={{ __html: body }}
			data-icon-inline={inline ? "true" : "false"}
		/>
	);
}

export default Icon;
