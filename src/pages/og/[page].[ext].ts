import { type NavigationIcon, mainRouteIconMap } from "@/components/navigation/navIcons";
import { renderOgImage } from "@/og/renderer";
import type { OgImageProps } from "@/og/types";
import { siteConfig } from "@/site.config";
import type { APIContext } from "astro";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const STATIC_PAGES: Record<string, OgImageProps> = {
	home: {
		title: siteConfig.title,
		description: siteConfig.description,
	},
	demos: {
		title: "Demos",
		description: "Interactive runtime demos for Vizij's open source robot face ecosystem.",
	},
	projects: {
		title: "Projects",
		description: "Explore open source projects in the Vizij ecosystem.",
	},
	services: {
		title: "Services",
		description:
			"Professional support for designing, animating, and deploying rendered robot faces.",
	},
	events: {
		title: "Events",
		description: "Conferences, workshops, and training on robot faces and human-robot interaction.",
	},
	contributors: {
		title: "Contributors",
		description: "People and organizations contributing to the Vizij open source ecosystem.",
	},
	"get-involved": {
		title: "Get Involved",
		description: "Contribute to Vizij's open source robot face ecosystem.",
	},
	about: {
		title: "About",
		description: "Learn about Vizij's mission to make expressive robot faces open and accessible.",
	},
};

const BADGE_ICON_SIZE = 180;
const BADGE_ICON_COLOR = "#F9FAFB";

const createBadgeIcon = (Icon: NavigationIcon) => {
	const svg = renderToStaticMarkup(
		React.createElement(Icon, {
			width: BADGE_ICON_SIZE,
			height: BADGE_ICON_SIZE,
			color: BADGE_ICON_COLOR,
		}),
	);
	const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
	return React.createElement("img", {
		src: dataUrl,
		width: BADGE_ICON_SIZE,
		height: BADGE_ICON_SIZE,
		alt: "",
		style: { display: "block" },
	});
};

function getBadgeIcon(page: string): React.ReactNode {
	if (page === "home") {
		return React.createElement(
			"svg",
			{
				width: BADGE_ICON_SIZE,
				height: BADGE_ICON_SIZE,
				viewBox: "0 0 1024 1024",
				xmlns: "http://www.w3.org/2000/svg",
				style: { display: "block" },
			},
			React.createElement(
				"g",
				{ transform: "matrix(1.45973,0,0,1.45973,-283.787,-358.145)" },
				React.createElement("circle", {
					cx: "501.067",
					cy: "578.724",
					r: "274.459",
					fill: "#50C4B6",
				}),
			),
			React.createElement(
				"g",
				{ transform: "matrix(1.45973,0,0,1.45973,-134.819,-175.706)" },
				React.createElement("path", {
					d: "M672.388,454.655C675.203,454.598 677.912,455.729 679.85,457.771C681.789,459.812 682.779,462.576 682.578,465.384C679.71,505.327 669.713,644.598 664.568,716.27C663.757,727.561 658.35,738.026 649.609,745.219C640.868,752.412 629.558,755.704 618.322,754.326C556.302,746.721 445.889,733.18 414.085,729.28C409.063,728.664 405.29,724.399 405.29,719.34L405.29,469.833C405.29,464.38 409.652,459.93 415.103,459.821C457.822,458.963 627.445,455.557 672.388,454.655Z",
					fill: "#F56B29",
					fillOpacity: 0.9,
				}),
			),
			React.createElement(
				"g",
				{ transform: "matrix(1.45973,0,0,1.45973,182.197,-418.542)" },
				React.createElement("path", {
					d: "M421.008,522.766C421.344,518.372 424.513,514.715 428.814,513.756C433.115,512.797 437.538,514.762 439.708,518.597C468.398,569.285 527.181,673.141 548.94,711.584C550.684,714.665 550.671,718.438 548.907,721.507C547.142,724.577 543.889,726.486 540.349,726.53C508.933,726.919 442.438,727.742 416.234,728.066C413.424,728.101 410.728,726.953 408.806,724.903C406.883,722.854 405.91,720.091 406.125,717.288C408.741,683.091 416.854,577.066 421.008,522.766Z",
					fill: "#FF9E00",
					fillOpacity: 0.9,
				}),
			),
		);
	}
	const Icon = mainRouteIconMap[page];
	return Icon ? createBadgeIcon(Icon) : null;
}

function getFormat(ext: string | undefined): "png" | "svg" {
	return ext === "svg" ? "svg" : "png";
}

export async function GET(context: APIContext) {
	const page = context.params.page as string;
	const ext = context.params.ext as string | undefined;
	const ogConfig = STATIC_PAGES[page];
	if (!ogConfig) {
		return new Response("Not found", { status: 404 });
	}
	const withIcon: OgImageProps = { ...ogConfig, badgeIcon: getBadgeIcon(page) };
	const { body, contentType } = await renderOgImage(getFormat(ext), withIcon);
	const responseBody =
		typeof body === "string" ? body : new Blob([Buffer.from(body)], { type: contentType });
	return new Response(responseBody, {
		headers: {
			"Content-Type": contentType,
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}

export function getStaticPaths() {
	return Object.keys(STATIC_PAGES).flatMap((page) =>
		["png", "svg"].map((ext) => ({
			params: { page, ext },
			props: STATIC_PAGES[page],
		})),
	);
}
