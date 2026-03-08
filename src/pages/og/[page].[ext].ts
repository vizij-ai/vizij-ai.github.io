import { type NavigationIcon, mainRouteIconMap } from "@/components/navigation/navIcons";
import { renderOgImage } from "@/og/renderer";
import type { OgImageProps } from "@/og/types";
import type { APIContext } from "astro";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const STATIC_PAGES: Record<string, OgImageProps> = {
	home: {
		title: "Semio Community",
		description: "Reproducible Robot Science",
	},
	projects: {
		title: "Projects",
		description: "Explore active Semio projects across robotics and HRI.",
	},
	services: {
		title: "Services",
		description: "Manufacturing, software, and research support for robotics.",
	},
	events: {
		title: "Events",
		description: "Join us at conferences, workshops, and training focused on HRI & AI.",
	},
	contributors: {
		title: "Contributors",
		description: "Researchers, partners, and sponsors supporting community robotics.",
	},
	"get-involved": {
		title: "Get Involved",
		description: "Volunteer, donate, or collaborate on open robotics.",
	},
	about: {
		title: "About",
		description: "A nonprofit advancing reproducible human-centered robotics.",
	},
};

const BADGE_ICON_SIZE = 180;
const BADGE_ICON_COLOR = "#FF9E00";

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
				viewBox: "0 0 412 412",
				xmlns: "http://www.w3.org/2000/svg",
				style: { display: "block" },
			},
			React.createElement(
				"g",
				{ transform: "translate(604.607 194.034)" },
				React.createElement(
					"g",
					{ transform: "translate(-331.8 16.33)" },
					React.createElement("path", {
						d: "M0 83.231L-63.499 46.568-123.354 81.126V52.887L-31.75 0 31.749 36.66 63.501 18.331 87.955 32.449 0 83.231Z",
						fill: "#FFC400",
					}),
				),
				React.createElement(
					"g",
					{ transform: "translate(-486.902 10.015)" },
					React.createElement("path", {
						d: "M0 4.208L63.499-32.453V-101.562L87.928-87.463 88.043 18.277 24.454 54.99V91.651L0 105.77V4.208Z",
						fill: "#2AA499",
					}),
				),
				React.createElement(
					"g",
					{ transform: "translate(-335.448 -6.213)" },
					React.createElement("path", {
						d: "M0-71.217V2.106L59.854 36.662 35.396 50.781-56.157-2.078-56.237-75.449-87.955-93.755V-121.998L0-71.217Z",
						fill: "#EF6129",
					}),
				),
				React.createElement(
					"g",
					{ transform: "translate(-300.051 -128.214)" },
					React.createElement("path", {
						d: "M0 136.12L-28.103 119.895V50.784L59.858 0 59.94 101.514 0 136.12Z",
						fill: "#EC4D01",
					}),
				),
				React.createElement(
					"g",
					{
						transform: "matrix(-.866025 .500001 .500001 .866025 -407.972 -90.55)",
					},
					React.createElement("path", {
						d: "M-164.126 43.978H-62.564L-11.784-43.978H-113.346L-164.126 43.978Z",
						fill: "#FF7A2C",
					}),
				),
				React.createElement(
					"g",
					{ transform: "translate(-430.697 -26.65)" },
					React.createElement("path", {
						d: "M0-32.449V0L-59.853 34.556-147.808-16.224-59.853-67.005 0-32.449Z",
						fill: "#48E2CE",
					}),
				),
				React.createElement(
					"g",
					{
						transform: "matrix(.866025 .500001 .500001 -.866025 -538.174 -48.341)",
					},
					React.createElement("path", {
						d: "M-32.194-32.194H69.368L120.149-120.149H18.587L-32.194-32.194Z",
						fill: "#50C4B6",
					}),
				),
				React.createElement(
					"g",
					{ transform: "translate(-423.403 191.213)" },
					React.createElement("path", {
						d: "M0-103.668L28.104-119.893 87.955-85.336V16.225L0-34.556V-103.668Z",
						fill: "#FF9E00",
					}),
				),
				React.createElement(
					"g",
					{ transform: "matrix(0 -1 -1 0 -207.96 175.287)" },
					React.createElement("path", {
						d: "M-32.151 120.195H69.411L120.195 32.233H18.681L-32.151 120.195Z",
						fill: "#F78600",
					}),
				),
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
