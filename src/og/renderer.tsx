import GilroyBold from "@/assets/fonts/Gilroy-Bold.otf";
import GilroyMedium from "@/assets/fonts/Gilroy-Medium.otf";
import GilroyRegular from "@/assets/fonts/Gilroy-Regular.otf";
import GilroySemibold from "@/assets/fonts/Gilroy-SemiBold.otf";
import { Resvg } from "@resvg/resvg-js";
import React from "react";
import satori, { type SatoriOptions } from "satori";
import { OgCard } from "./components/OgCard";
import { OG_HEIGHT, OG_WIDTH } from "./constants";
import type { OgImageProps } from "./types";

const ogOptions: SatoriOptions = {
	width: OG_WIDTH,
	height: OG_HEIGHT,
	fonts: [
		{
			data: Buffer.from(GilroyRegular),
			name: "Gilroy",
			weight: 400,
			style: "normal",
		},
		{
			data: Buffer.from(GilroyMedium),
			name: "Gilroy",
			weight: 500,
			style: "normal",
		},
		{
			data: Buffer.from(GilroySemibold),
			name: "Gilroy",
			weight: 600,
			style: "normal",
		},
		{
			data: Buffer.from(GilroyBold),
			name: "Gilroy",
			weight: 700,
			style: "normal",
		},
	],
};

export async function renderOgImage(
	format: "png" | "svg",
	props: OgImageProps,
): Promise<{ body: string | Uint8Array; contentType: string }> {
	const element = <OgCard {...props} />;
	let svg: string;
	try {
		svg = await satori(element, ogOptions);
	} catch (error) {
		console.error("Failed to render OG image", {
			format,
			title: props.title,
			hasHero: Boolean(props.heroImage),
			hasLogo: Boolean(props.logoImage),
		});
		throw error;
	}

	if (format === "svg") {
		return {
			body: svg,
			contentType: "image/svg+xml; charset=utf-8",
		};
	}

	const png = new Resvg(svg).render().asPng();
	return {
		body: png,
		contentType: "image/png",
	};
}
