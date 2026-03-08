import type React from "react";

export type OgListIcon = React.ReactNode | "calendar" | "location";

export type OgListItem = {
	text: string;
	icon?: OgListIcon;
};

export type OgImageAsset = {
	src: string;
	alt?: string;
	width?: number;
	height?: number;
};

export type StatusTone = "green" | "yellow" | "blue" | "orange" | "neutral" | "gray";

export interface OgImageProps {
	title: string;
	description?: string;
	eyebrow?: string;
	badge?: string;
	avatarInitial?: string;
	heroImage?: OgImageAsset;
	logoImage?: OgImageAsset;
	listItems?: OgListItem[];
	statusLabel?: string;
	categoryLabel?: string;
	statusTone?: StatusTone;
	listColumns?: 1 | 2;
	logoMode?: "cover" | "contain";
	badgeIcon?: React.ReactNode;
}
