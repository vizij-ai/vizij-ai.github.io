import { siteConfig } from "@/site.config";
import type { StatusTone } from "./types";

// Theme values mirrored from src/styles/global.css dark palette
// Use neutral (non-blue) backgrounds for OG assets.
export const SPECIAL_LIGHTER = "hsla(0, 0%, 92%, 0.12)";
export const SPECIAL = "hsla(0, 0%, 0%, 0.18)";
export const PAGE_BACKGROUND = siteConfig.og?.pageBackground ?? "hsl(0, 0%, 7%)";
export const OG_BACKGROUND = siteConfig.og?.cardBackground ?? "hsl(0, 0%, 12%)";
export const CARD_BORDER = "hsla(0, 0%, 65%, 0.18)";
export const TEXT_PRIMARY = "hsl(220, 15%, 88%)";
export const TEXT_MUTED = "hsla(220, 15%, 88%, 0.82)";
export const STAR_COLOR = "#FF9E00"; // theme-accent-one
export const LIST_ICON_COLOR = "#50C4B6"; // teal brand color
export const HERO_GRADIENT = `linear-gradient(135deg, ${SPECIAL_LIGHTER}, ${SPECIAL})`;
export const OG_HEIGHT = 630;
export const OG_WIDTH = 1200;
export const HERO_WIDTH = 1200;
export const HERO_HEIGHT = 360;

export const GLYPH_COLORS = {
	primary: "#EF6129",
	secondary: "#FF9E00",
	tertiary: "#50C4B6",
} as const;

export const GLYPH_ROTATIONS = {
	primary: 0,
	secondary: 120,
	tertiary: 240,
} as const;

export const GLYPH_PATH_D =
	"M0.55,10.626L18.002,0.55L35.456,10.627L35.472,30.771L24.893,36.879L29.541,39.562C29.543,39.564 29.546,39.565 29.548,39.567L30.716,40.241L23.83,44.202L14.575,38.873L0.55,30.778L0.55,10.626Z";
export const GLYPH_W = 37;
export const GLYPH_H = 45;

export const STATUS_STYLES: Record<StatusTone, { text: string; bg: string }> = {
	green: {
		text: "#22c55e",
		bg: "rgba(34, 197, 94, 0.16)",
	},
	yellow: {
		text: "#eab308",
		bg: "rgba(234, 179, 8, 0.18)",
	},
	blue: {
		text: "#0ea5e9",
		bg: "rgba(14, 165, 233, 0.18)",
	},
	orange: {
		text: "#f97316",
		bg: "rgba(249, 115, 22, 0.18)",
	},
	neutral: {
		text: "#94a3b8",
		bg: "rgba(148, 163, 184, 0.18)",
	},
	gray: {
		text: "#cbd5f5",
		bg: "rgba(148, 163, 184, 0.18)",
	},
};

export const STAR_PATH =
	"M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z";
