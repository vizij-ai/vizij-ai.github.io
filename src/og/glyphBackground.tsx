import React from "react";
import {
	GLYPH_COLORS,
	GLYPH_H,
	GLYPH_PATH_D,
	GLYPH_ROTATIONS,
	GLYPH_W,
	OG_HEIGHT,
	OG_WIDTH,
} from "./constants";

type GlyphVariant = keyof typeof GLYPH_COLORS;

type GlyphBackgroundSpec = {
	x: number;
	y: number;
	size: number;
	variant: GlyphVariant;
	fillOpacity: number;
	strokeOpacity: number;
};

const GLYPH_VARIANTS: readonly GlyphVariant[] = ["primary", "secondary", "tertiary"] as const;

function createOverlayRng(seed: string) {
	let h = 2166136261 >>> 0;
	for (let i = 0; i < seed.length; i++) {
		h ^= seed.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	let a = (h ^ 0x85ebca6b) >>> 0;
	return function rng() {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function generateGlyphOverlaySpecs(count = 32): readonly GlyphBackgroundSpec[] {
	const rng = createOverlayRng("og-glyph-overlay");
	const specs: GlyphBackgroundSpec[] = [];
	for (let i = 0; i < count; i++) {
		// biome-ignore lint/style/noNonNullAssertion: modulo ensures index is always within bounds
		const variant = GLYPH_VARIANTS[i % GLYPH_VARIANTS.length]!;
		const x = -0.15 + rng() * 1.3;
		const y = -0.05 + rng() * 0.85;
		const size = 60 + rng() * 75;
		const fillOpacity = 0.05 + rng() * 0.06;
		const strokeOpacity = 0.22 + rng() * 0.1;
		specs.push({ x, y, size, variant, fillOpacity, strokeOpacity });
	}
	specs.push(
		{
			x: -0.18,
			y: 0.1,
			size: 130,
			variant: "primary",
			fillOpacity: 0.1,
			strokeOpacity: 0.35,
		},
		{
			x: 1.18,
			y: 0.15,
			size: 120,
			variant: "tertiary",
			fillOpacity: 0.09,
			strokeOpacity: 0.32,
		},
		{
			x: -0.12,
			y: 0.7,
			size: 110,
			variant: "secondary",
			fillOpacity: 0.08,
			strokeOpacity: 0.3,
		},
		{
			x: 1.12,
			y: 0.68,
			size: 105,
			variant: "primary",
			fillOpacity: 0.08,
			strokeOpacity: 0.28,
		},
	);
	return specs;
}

const GLYPH_BACKGROUND_SPECS = generateGlyphOverlaySpecs();

const glyphBackgroundDataUrl = (() => {
	const shapes = GLYPH_BACKGROUND_SPECS.map((hex) => {
		const cx = hex.x * OG_WIDTH;
		const cy = hex.y * OG_HEIGHT;
		const scale = hex.size / GLYPH_H;
		const rotation = GLYPH_ROTATIONS[hex.variant];
		const color = GLYPH_COLORS[hex.variant];
		return `<g transform="translate(${cx} ${cy}) rotate(${rotation}) scale(${scale}) translate(${-GLYPH_W / 2} ${-GLYPH_H / 2})"><path d="${GLYPH_PATH_D}" fill="${color}" fill-opacity="${hex.fillOpacity}" stroke="${color}" stroke-opacity="${hex.strokeOpacity}" stroke-width="1.5" vector-effect="non-scaling-stroke"/></g>`;
	}).join("");
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}">${shapes}</svg>`;
	return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
})();

export const GlyphPatternBackground = () => (
	<img
		src={glyphBackgroundDataUrl}
		alt=""
		style={{
			position: "absolute",
			inset: 0,
			zIndex: 1,
			pointerEvents: "none",
		}}
	/>
);
