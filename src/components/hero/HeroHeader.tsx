import { CallToActionButton } from "@semio-community/ecosystem-site-core";
import { clsx } from "clsx";
import React, { useEffect, useMemo, useRef } from "react";

export type HeroAction = {
	label: React.ReactNode;
	href: string;
	variant?: "default" | "primary" | "secondary" | "tertiary";
	indicatorText?: string | number;
	ariaLabel?: string;
	target?: string;
	rel?: string;
};

/**
 * HeroHeader
 *
 * Glyph-backed hero layout that standardizes the common Semio hero pattern:
 * full-width glyph field with headline, supporting copy, and up to three CTA buttons.
 *
 * Props:
 * - title / description: main textual content; accepts ReactNodes to allow styled spans.
 * - headingTag: override the rendered heading element (defaults to `h1`).
 * - actions: array of CTA definitions (label, href, optional variant + indicator text).
 * - icon: optional React node rendered above the title (e.g., hero glyph or emoji).
 * - fullBleed / fullBleedClassName: enable and customize the 100vw offset wrapper for edge-to-edge heroes.
 */
export interface HeroHeaderProps {
	title: React.ReactNode;
	description?: React.ReactNode;
	headingTag?: React.ElementType;
	actions?: HeroAction[];
	icon?: React.ReactNode;
	fullBleed?: boolean;
	fullBleedClassName?: string;
	showGlyphField?: boolean;
}

const FULL_BLEED_STYLE: React.CSSProperties = {
	width: "100vw",
	position: "relative",
	left: "50%",
	right: "50%",
	marginLeft: "-50vw",
	marginRight: "-50vw",
};

const DEFAULT_GLYPH_PROPS: GlyphFieldProps = {
	count: 25,
	speed: 1000,
	scaling: 1,
	grayscale: false,
	filled: false,
	className: "flex h-full w-full opacity-25 dark:opacity-15",
};

export default function HeroHeader({
	title,
	description,
	headingTag: HeadingTag = "h1",
	actions,
	icon,
	fullBleed = false,
	fullBleedClassName = "relative pt-16 md:pt-20 lg:pt-4 mb-8 sm:mb-12",
	showGlyphField = true,
}: HeroHeaderProps) {
	const heroBody = (
		<div className="hero-container min-h-95 sm:min-h-105 md:min-h-120 w-full bg-transparent flex items-center justify-center relative overflow-hidden py-16 sm:py-20 md:py-24 pt-24 sm:pt-28 md:pt-32">
			{showGlyphField ? (
				<div className="glyph-wrapper absolute inset-0 w-full h-full">
					<GlyphField {...DEFAULT_GLYPH_PROPS} />
				</div>
			) : null}

			<div className="relative px-4 sm:px-6 md:px-8 max-w-5xl mx-auto w-full pointer-events-none space-y-6 text-center">
				{icon ? <div className="flex justify-center text-accent-base/80">{icon}</div> : null}
				{title
					? React.createElement(
							HeadingTag,
							{
								className: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground uppercase",
							},
							title,
						)
					: null}

				{description ? (
					<p className="text-sm sm:text-base md:text-lg lg:text-xl font-light text-color-600 dark:text-color-400 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
						{description}
					</p>
				) : null}

				{actions && actions.length > 0 ? (
					<div className="flex flex-wrap justify-center gap-4">
						{actions.map(
							(
								{ label, href, variant = "primary", indicatorText, ariaLabel, target, rel },
								index,
							) => (
								<CallToActionButton
									key={href}
									href={href}
									size="large"
									variant={variant}
									indicatorText={
										typeof indicatorText === "number" ? indicatorText.toString() : indicatorText
									}
									ariaLabel={ariaLabel}
									target={target}
									rel={rel}
								>
									{label}
								</CallToActionButton>
							),
						)}
					</div>
				) : null}
			</div>

			<style>
				{`
          .glyph-wrapper {
            mask-image:
              linear-gradient(
                to right,
                transparent 0%,
                black 10%,
                black 90%,
                transparent 100%
              ),
              linear-gradient(
                to bottom,
                transparent 0%,
                black 15%,
                black 85%,
                transparent 100%
              );
            mask-size: 100% 100%;
            mask-position: center;
            mask-repeat: no-repeat;
            mask-composite: intersect;

            -webkit-mask-image:
              linear-gradient(
                to right,
                transparent 0%,
                black 10%,
                black 90%,
                transparent 100%
              ),
              linear-gradient(
                to bottom,
                transparent 0%,
                black 15%,
                black 85%,
                transparent 100%
              );
            -webkit-mask-size: 100% 100%;
            -webkit-mask-position: center;
            -webkit-mask-repeat: no-repeat;
            -webkit-mask-composite: source-in;
          }

          @supports not (mask-composite: intersect) {
            .glyph-wrapper {
              mask: radial-gradient(
                ellipse 90% 80% at center,
                black 40%,
                transparent 100%
              );
              -webkit-mask: radial-gradient(
                ellipse 90% 80% at center,
                black 40%,
                transparent 100%
              );
            }
          }
        `}
			</style>
		</div>
	);

	if (fullBleed) {
		return (
			<div
				className={clsx("w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]", fullBleedClassName)}
				style={FULL_BLEED_STYLE}
			>
				{heroBody}
			</div>
		);
	}

	return heroBody;
}

/* ---------------------------------------------
   GlyphField (React) — simple animation hook
   --------------------------------------------- */

type Variant = "primary" | "secondary" | "tertiary";

export interface GlyphFieldProps {
	count: number;
	speed?: number; // higher is slower movement in this implementation
	scaling?: number;
	className?: string;
	grayscale?: boolean;
	filled?: boolean;
	svgClass?: string;
	bottomLeft?: React.ReactNode;
}

interface Glyph {
	id: string;
	variant: Variant;
	baseX: number; // 0..1
	baseY: number; // 0..1
	scale: number; // ~1..2
	duration: number; // seconds
	begin: number; // seconds
	angle: number; // radians
	amplitude: number; // pixels
	rotationDeg: number;
}

function getRotation(variant: Variant): number {
	switch (variant) {
		case "primary":
			return 0;
		case "secondary":
			return 120;
		case "tertiary":
			return 240;
		default:
			return 0;
	}
}

function getStrokeColor(variant: Variant, grayscale?: boolean): string {
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

function getFillColor(variant: Variant, grayscale?: boolean): string {
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

/**
 * Simple random helper that is stable for a given count on initial render.
 */
function buildGlyphs(count: number, scaling: number): Glyph[] {
	const variants: Variant[] = ["primary", "secondary", "tertiary"];

	return Array.from({ length: count }, (_, idx) => {
		// biome-ignore lint/style/noNonNullAssertion: variants array is non-empty and index is within bounds
		const variant = variants[Math.floor(Math.random() * variants.length)]!;
		const baseX = Math.random() * 0.2 - 0.05 + idx / count;
		const baseY = Math.random() * 0.2 - 0.05 + (count - idx - 1) / count;
		const scale = Math.random() + scaling;
		const duration = Math.random() * 2 + 6; // seconds
		const begin = Math.random() * 5; // seconds
		const angle = Math.random() * Math.PI * 2;
		const amplitude = 30 + Math.random() * 30; // pixels
		const rotationDeg = getRotation(variant);

		return {
			id: `${idx}-${Math.random().toString(36).slice(2)}`,
			variant,
			baseX,
			baseY,
			scale,
			duration,
			begin,
			angle,
			amplitude,
			rotationDeg,
		};
	});
}

export function GlyphField({
	count,
	speed = 1000,
	scaling = 1,
	className,
	grayscale = false,
	filled = false,
	svgClass,
	bottomLeft,
}: GlyphFieldProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const svgRef = useRef<SVGSVGElement | null>(null);

	const glyphs = useMemo(() => buildGlyphs(count, scaling), [count, scaling]);

	// Tracks size for percentage-to-pixel conversion
	const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const updateSize = () => {
			const r = el.getBoundingClientRect();
			sizeRef.current = { w: r.width, h: r.height };
		};
		updateSize();

		let ro: ResizeObserver | null = null;
		if (typeof ResizeObserver !== "undefined") {
			ro = new ResizeObserver(updateSize);
			ro.observe(el);
		} else {
			window.addEventListener("resize", updateSize);
		}

		return () => {
			if (ro) ro.disconnect();
			else window.removeEventListener("resize", updateSize);
		};
	}, []);

	// Animate using rAF: simple sinusoidal drift around base position
	useEffect(() => {
		let raf = 0;
		const start = performance.now();

		const step = () => {
			const now = performance.now();
			const t = (now - start) / 1000; // seconds
			const { w, h } = sizeRef.current;
			const svg = svgRef.current;
			if (svg && w > 0 && h > 0) {
				// Query all glyph groups and position them
				const groups = svg.querySelectorAll<SVGGElement>('[data-glyph="group"]');
				for (const group of groups) {
					const idx = Number(group.getAttribute("data-idx") || "0");
					const g = glyphs[idx];
					if (!g) continue;

					// speed: higher means slower here
					const omega = (1 / Math.max(speed, 1)) * 5; // angular velocity scalar
					const phase = t * omega + g.begin;
					const dx = Math.cos(phase + g.angle) * g.amplitude;
					const dy = Math.sin(phase + g.angle * 0.75) * g.amplitude * 0.6;

					// Base position in pixels
					const basePx = g.baseX * w;
					const basePy = g.baseY * h;

					const x = basePx + dx;
					const y = basePy + dy;

					group.style.transform = `translate(${x}px, ${y}px) rotate(${g.rotationDeg}deg)`;

					const path = group.querySelector<SVGPathElement>('[data-glyph="path"]');
					if (path) {
						const s = g.scale;
						path.style.transform = `translate(-${s * (37 / 2)}px, -${s * (45 / 2)}px) scale(${s})`;
					}
				}
			}
			raf = requestAnimationFrame(step);
		};

		raf = requestAnimationFrame(step);
		return () => cancelAnimationFrame(raf);
	}, [glyphs, speed]);

	return (
		<div ref={containerRef} className={`overflow-hidden relative ${className || ""}`}>
			<svg
				ref={svgRef}
				width="100%"
				height="100%"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				className={`absolute bg-transparent ${svgClass || ""}`}
			>
				{glyphs.map((g, idx) => {
					const stroke = getStrokeColor(g.variant, grayscale);
					const fill = filled ? getFillColor(g.variant, grayscale) : "none";
					return (
						<g
							key={g.id}
							data-glyph="group"
							data-idx={idx}
							data-variant={g.variant}
							style={{
								willChange: "transform",
								transform: `translate(0px, 0px) rotate(${g.rotationDeg}deg)`,
							}}
						>
							<path
								data-glyph="path"
								d="M0.55,10.626L18.002,0.55L35.456,10.627L35.472,30.771L24.893,36.879L29.541,39.562C29.543,39.564 29.546,39.565 29.548,39.567L30.716,40.241L23.83,44.202L14.575,38.873L0.55,30.778L0.55,10.626Z"
								fill={fill}
								fillOpacity={filled ? 0.5 : 0}
								stroke={stroke}
								strokeWidth={1}
								style={{
									willChange: "transform",
									pointerEvents: "visibleFill",
								}}
							/>
						</g>
					);
				})}
			</svg>

			{bottomLeft ? (
				<div className="absolute z-10 bottom-4 left-6 flex flex-row items-center gap-1 drop-shadow-md">
					{bottomLeft}
				</div>
			) : null}
		</div>
	);
}
