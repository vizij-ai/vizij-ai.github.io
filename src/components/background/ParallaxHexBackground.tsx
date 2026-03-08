import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import React, { useEffect, useMemo, useState } from "react";

/**
 * ParallaxHexBackground
 *
 * Renders a fixed, full-viewport background of hexagons at varying "depths".
 * As the page scrolls, each hexagon translates vertically at a fraction of the
 * scroll distance to create a parallax effect:
 *  - Near hexagons (larger) move more with the scroll (appear closer).
 *  - Far hexagons (smaller) move less (appear farther).
 *
 * Positions and sizes are generated from a seeded PRNG so the layout is
 * semi-stable across renders (e.g., seeded by day).
 *
 * Usage:
 *   <ParallaxHexBackground />
 *
 * Notes:
 * - The container is fixed and pointer-events are disabled so it sits behind content.
 * - Colors are subtle by default; override via the `palette` prop if desired.
 */

export interface ParallaxHexBackgroundProps {
	/**
	 * Total number of hexagons (distributed across depth layers).
	 * Default: 48
	 */
	count?: number;
	/**
	 * Seed for randomization; defaults to YYYY-MM-DD (current date).
	 * Provide a string or number for stable layout between reloads.
	 */
	seed?: string | number;
	/**
	 * How many viewport heights (vh) to cover vertically above/below the viewport.
	 * Example: with verticalSpanVh = 220, hexes may appear from -20vh to 200vh.
	 * Default: 220
	 */
	verticalSpanVh?: number;
	/**
	 * Expand horizontal range beyond the viewport in vw (e.g. -10..110) to avoid edges.
	 * Default: { min: -10, max: 110 }
	 */
	horizontalRangeVw?: { min: number; max: number };
	/**
	 * Colors for strokes/fills. You can pass hex strings or rgba strings.
	 * The renderer will apply strokeOpacity/fillOpacity per hex.
	 * Default: brand-inspired palette.
	 */
	palette?: string[];
	/**
	 * Opacity ranges applied per hex. Values are multiplied with depth-based factors.
	 * Default: { stroke: [0.25, 0.55], fill: [0.05, 0.18] }
	 */
	opacity?: { stroke: [number, number]; fill: [number, number] };
	/**
	 * Optional className for outer fixed container.
	 */
	className?: string;
}

type GlyphSpec = {
	id: string;
	xVw: number; // 0..100 (or slightly outside per range)
	yVh: number; // -buffer..100+buffer
	size: number; // px (used to compute scale)
	rotationDeg: number; // 0 | 120 | 240
	variant: "primary" | "secondary" | "tertiary";
	parallax: number; // 0..1 (1 moves with content, 0 is static)
	zIndex: number; // 1..3
	strokeOpacity: number;
	fillOpacity: number;
};

/** PRNG (Mulberry32) with string/number seed support */
function createRng(seed: string | number | undefined): () => number {
	let h = 2166136261 >>> 0;
	const s = String(seed ?? new Date().toISOString().slice(0, 10));
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	let a = (h ^ 0x85ebca6b) >>> 0;
	return function mulberry32() {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Sample in [min, max) using rng() */
function rndIn(rng: () => number, min: number, max: number) {
	return min + rng() * (max - min);
}

/** Pick one from array using rng() */

function generateGlyphs({
	count,
	seed,
	palette,
	verticalSpanVh,
	horizontalRangeVw,
	opacity,
}: Required<
	Pick<
		ParallaxHexBackgroundProps,
		"count" | "seed" | "palette" | "verticalSpanVh" | "horizontalRangeVw" | "opacity"
	>
>): GlyphSpec[] {
	const rng = createRng(seed);

	// Depth bands: near/mid/far proportions
	const nearCount = Math.round(count * 0.22);
	const midCount = Math.round(count * 0.34);
	const farCount = Math.max(0, count - nearCount - midCount);

	const result: GlyphSpec[] = [];

	const bands: Array<{
		n: number;
		sizePx: [number, number];
		parallax: [number, number];
		z: number;
		strokeScale: number;
		fillScale: number;
	}> = [
		// Near: larger, moves more, foreground
		{
			n: nearCount,
			sizePx: [72, 96],
			parallax: [0.65, 1.0],
			z: 3,
			strokeScale: 1.0,
			fillScale: 1.0,
		},
		// Mid
		{
			n: midCount,
			sizePx: [42, 92],
			parallax: [0.35, 0.6],
			z: 2,
			strokeScale: 0.9,
			fillScale: 0.9,
		},
		// Far: smaller, moves less, background
		{
			n: farCount,
			sizePx: [36, 48],
			parallax: [0.08, 0.3],
			z: 1,
			strokeScale: 0.8,
			fillScale: 0.8,
		},
	];

	const variants: Array<"primary" | "secondary" | "tertiary"> = [
		"primary",
		"secondary",
		"tertiary",
	];

	for (const band of bands) {
		for (let i = 0; i < band.n; i++) {
			const u = rng();
			const t = band.z === 3 ? Math.sqrt(u) : band.z === 1 ? u * u : u;
			const size = band.sizePx[0] + (band.sizePx[1] - band.sizePx[0]) * t;
			const parallax = rndIn(rng, band.parallax[0], band.parallax[1]);
			const xVw = rndIn(rng, horizontalRangeVw.min, horizontalRangeVw.max);
			const yVh = rndIn(rng, -verticalSpanVh * 0.1, 100 + verticalSpanVh * 0.8); // spread above/below
			const variantIndex = Math.floor(rng() * variants.length) % variants.length;
			const variant = variants[variantIndex] ?? "primary";
			const rotationDeg = variant === "primary" ? 0 : variant === "secondary" ? 120 : 240;

			const strokeOpacity = rndIn(rng, opacity.stroke[0], opacity.stroke[1]) * band.strokeScale;
			const fillOpacity = rndIn(rng, opacity.fill[0], opacity.fill[1]) * band.fillScale;

			result.push({
				id: `${band.z}-${i}-${Math.floor(rng() * 1e9)}`,
				xVw,
				yVh,
				size,
				rotationDeg,
				variant,
				parallax,
				zIndex: band.z,
				strokeOpacity,
				fillOpacity,
			});
		}
	}

	return result;
}

/** Brand glyph path and dimensions (lifted from the legacy GlyphField.astro) */
const GLYPH_PATH_D =
	"M0.55,10.626L18.002,0.55L35.456,10.627L35.472,30.771L24.893,36.879L29.541,39.562C29.543,39.564 29.546,39.565 29.548,39.567L30.716,40.241L23.83,44.202L14.575,38.873L0.55,30.778L0.55,10.626Z";
const GLYPH_W = 37;
const GLYPH_H = 45;

/** Color helpers (align with GlyphField variant colors) */
function getStrokeColor(variant: "primary" | "secondary" | "tertiary", grayscale = false): string {
	if (grayscale) {
		switch (variant) {
			case "primary":
				return "#d4d4d4";
			case "secondary":
				return "#bdbdbd";
			case "tertiary":
				return "#a3a3a3";
		}
	}
	switch (variant) {
		case "primary":
			return "#EF6129"; // red-orange
		case "secondary":
			return "#FF9E00"; // yellow-orange
		case "tertiary":
			return "#50C4B6"; // teal
	}
}

function getFillColor(variant: "primary" | "secondary" | "tertiary", grayscale = false): string {
	if (grayscale) {
		switch (variant) {
			case "primary":
				return "#d4d4d4";
			case "secondary":
				return "#bdbdbd";
			case "tertiary":
				return "#a3a3a3";
		}
	}
	switch (variant) {
		case "primary":
			return "#EF6129";
		case "secondary":
			return "#FF9E00";
		case "tertiary":
			return "#50C4B6";
	}
}

const MOBILE_UA_REGEX =
	/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i;

function detectMobileDevice(): boolean {
	if (typeof navigator === "undefined") {
		return false;
	}

	const ua = navigator.userAgent || navigator.vendor || "";
	if (MOBILE_UA_REGEX.test(ua)) {
		return true;
	}

	if ("maxTouchPoints" in navigator && navigator.maxTouchPoints > 1) {
		return true;
	}

	if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
		try {
			if (window.matchMedia("(pointer: coarse)").matches) {
				return true;
			}
		} catch {
			// ignore matchMedia failures
		}
	}

	return false;
}

function Glyph({
	spec,
	virtualWidth,
	virtualHeight,
}: {
	spec: GlyphSpec;
	virtualWidth: number;
	virtualHeight: number;
}) {
	// Near (parallax ~1) should be sharp; far (parallax small) slightly blurred.
	// Depth-based blur: numeric per glyph (constant with respect to scroll)
	const p = Math.max(0, Math.min(1, spec.parallax));
	const nearBlur = 1; // px
	const farBlur = 4; // px
	const blurPx = farBlur - p * (farBlur - nearBlur);
	const blurFilter = `blur(${blurPx}px)`;

	const stroke = getStrokeColor(spec.variant);
	const fill = getFillColor(spec.variant);

	// Scale based on desired pixel size vs intrinsic glyph height
	const s = spec.size / GLYPH_H;
	const MAX_BLUR = 16;
	const margin = MAX_BLUR;
	const paddedSize = spec.size + margin * 2;

	const baselineEdge = 100;
	const extra = Math.max(0, virtualWidth / 16);
	const adjustedVw = spec.xVw >= baselineEdge ? spec.xVw + extra : spec.xVw;
	const leftPx = (adjustedVw / 100) * virtualWidth - margin;
	const topPx = (spec.yVh / 100) * virtualHeight - margin;

	return (
		<div style={{ filter: blurFilter, WebkitFilter: blurFilter }}>
			<svg
				width={paddedSize}
				height={paddedSize}
				viewBox={`${-GLYPH_W / 2} ${-GLYPH_H / 2} ${GLYPH_W} ${GLYPH_H}`}
				style={{
					position: "absolute",
					left: `${leftPx}px`,
					top: `${topPx}px`,
					zIndex: spec.zIndex,
					opacity: 1,
					pointerEvents: "none",
					overflow: "visible",
					willChange: "transform, filter",
				}}
				aria-hidden="true"
			>
				<g
					transform={`rotate(${spec.rotationDeg})`}
					style={{ filter: blurFilter, WebkitFilter: blurFilter }}
				>
					<path
						d={GLYPH_PATH_D}
						fill={fill}
						fillOpacity={spec.fillOpacity}
						stroke={stroke}
						strokeOpacity={spec.strokeOpacity}
						strokeWidth={1}
						vectorEffect="non-scaling-stroke"
						transform={`translate(${(-GLYPH_W / 2) * s}, ${(-GLYPH_H / 2) * s}) scale(${s})`}
					/>
				</g>
			</svg>
		</div>
	);
}

export default function ParallaxHexBackground({
	count = 48,
	seed,
	verticalSpanVh = 220,
	horizontalRangeVw = { min: -10, max: 110 },
	palette = ["#50C4B6", "#FF9E00", "#EF6129"], // teal, yellow-orange, red-orange
	opacity = { stroke: [0.22, 0.55], fill: [0.05, 0.18] },
	className = "",
}: ParallaxHexBackgroundProps) {
	const MIN_VIRTUAL_WIDTH = 768;
	const MIN_VIRTUAL_HEIGHT = 960;
	const VIEWPORT_THRESHOLD = 24;
	const getInitialViewport = () => {
		if (typeof window === "undefined") {
			return { width: MIN_VIRTUAL_WIDTH, height: MIN_VIRTUAL_HEIGHT };
		}
		return {
			width: window.innerWidth,
			height: Math.max(MIN_VIRTUAL_HEIGHT, window.innerHeight),
		};
	};
	const [viewport, setViewport] = useState(getInitialViewport);
	const [isMobileDevice, setIsMobileDevice] = useState(() => detectMobileDevice());

	useEffect(() => {
		if (typeof window === "undefined") return;
		let frame: number | null = null;
		const handleResize = () => {
			if (frame) cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const nextWidth = window.innerWidth;
				const nextHeight = Math.max(MIN_VIRTUAL_HEIGHT, window.innerHeight);
				setViewport((prev) => {
					if (
						Math.abs(prev.width - nextWidth) < VIEWPORT_THRESHOLD &&
						Math.abs(prev.height - nextHeight) < VIEWPORT_THRESHOLD
					) {
						return prev;
					}
					return { width: nextWidth, height: nextHeight };
				});
			});
		};
		window.addEventListener("resize", handleResize, { passive: true });
		window.visualViewport?.addEventListener("resize", handleResize);
		return () => {
			if (frame) cancelAnimationFrame(frame);
			window.removeEventListener("resize", handleResize);
			window.visualViewport?.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		setIsMobileDevice(detectMobileDevice());
	}, []);

	const virtualWidth = Math.max(MIN_VIRTUAL_WIDTH, viewport.width);
	const virtualHeight = Math.max(MIN_VIRTUAL_HEIGHT, viewport.height);
	const isMobile = virtualWidth <= 768;
	const effectiveCount = isMobile ? Math.max(24, Math.round(count * 0.75)) : count;
	const disableParallax = isMobileDevice;

	const glyphs = useMemo(
		() =>
			generateGlyphs({
				count: effectiveCount,
				seed: seed ?? new Date().toISOString().slice(0, 10),
				palette,
				verticalSpanVh,
				horizontalRangeVw,
				opacity,
			}).sort((a, b) => a.zIndex - b.zIndex), // ensure back-to-front rendering
		[effectiveCount, seed, palette, verticalSpanVh, horizontalRangeVw, opacity],
	);

	const glyphBands = useMemo(() => {
		const near: GlyphSpec[] = [];
		const mid: GlyphSpec[] = [];
		const far: GlyphSpec[] = [];
		for (const glyph of glyphs) {
			if (glyph.zIndex === 3) near.push(glyph);
			else if (glyph.zIndex === 2) mid.push(glyph);
			else far.push(glyph);
		}
		return { near, mid, far };
	}, [glyphs]);

	const nearParallax = 0.8;
	const midParallax = 0.45;
	const farParallax = 0.18;

	// Subscribe to page scroll once and pass motion value to children
	const { scrollY } = useScroll();
	const smoothedScroll = useSpring(scrollY, {
		stiffness: 250,
		damping: 30,
		mass: 0.2,
	});
	const staticScroll = useMotionValue(0);
	const scrollSource = disableParallax ? staticScroll : isMobileDevice ? smoothedScroll : scrollY;
	const nearY = useTransform(scrollSource, (v) => -v * nearParallax);
	const midY = useTransform(scrollSource, (v) => -v * midParallax);
	const farY = useTransform(scrollSource, (v) => -v * farParallax);

	return (
		<div className={`pointer-events-none fixed inset-0 ${className}`} aria-hidden="true">
			{[
				{ key: "near", mv: nearY, items: glyphBands.near },
				{ key: "mid", mv: midY, items: glyphBands.mid },
				{ key: "far", mv: farY, items: glyphBands.far },
			].map(({ key, mv, items }) =>
				items.length ? (
					<motion.div
						key={key}
						style={{
							y: disableParallax ? 0 : mv,
							position: "absolute",
							inset: 0,
							pointerEvents: "none",
						}}
						aria-hidden="true"
					>
						{items.map((glyph) => (
							<Glyph
								key={glyph.id}
								spec={glyph}
								virtualWidth={virtualWidth}
								virtualHeight={virtualHeight}
							/>
						))}
					</motion.div>
				) : null,
			)}
		</div>
	);
}
