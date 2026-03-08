import React from "react";
import { LIST_ICON_COLOR } from "../constants";
import type { OgListItem } from "../types";

const CalendarIcon = () => (
	<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
		<rect
			x="3"
			y="5"
			width="18"
			height="16"
			rx="2"
			fill="none"
			stroke={LIST_ICON_COLOR}
			strokeWidth="1.5"
		/>
		<path d="M3 9.5H21" stroke={LIST_ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" />
		<path d="M8 3V7" stroke={LIST_ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" />
		<path d="M16 3V7" stroke={LIST_ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" />
	</svg>
);

const LocationIcon = () => (
	<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
		<path
			d="M12 22s7-7.364 7-12A7 7 0 0 0 5 10c0 4.636 7 12 7 12Z"
			stroke={LIST_ICON_COLOR}
			strokeWidth="1.5"
			fill="none"
		/>
		<circle cx="12" cy="9" r="2.5" stroke={LIST_ICON_COLOR} strokeWidth="1.5" fill="none" />
	</svg>
);

export function renderListIcon(icon?: OgListItem["icon"]) {
	if (!icon) {
		return <span style={{ fontSize: "22px", color: LIST_ICON_COLOR }}>•</span>;
	}
	if (React.isValidElement(icon)) {
		return icon;
	}
	if (icon === "calendar") {
		return <CalendarIcon />;
	}
	if (icon === "location") {
		return <LocationIcon />;
	}
	return <span style={{ fontSize: "22px", color: LIST_ICON_COLOR }}>{String(icon)}</span>;
}
