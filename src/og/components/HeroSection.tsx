import type React from "react";
import { HERO_GRADIENT, HERO_HEIGHT, HERO_WIDTH, OG_HEIGHT, PAGE_BACKGROUND } from "../constants";
import type { OgImageAsset } from "../types";

type HeroSectionProps = {
	heroImage?: OgImageAsset;
	logoImage?: OgImageAsset;
	logoMode?: "cover" | "contain";
	fallbackInitial: string;
	badgeIcon?: React.ReactNode;
};

const renderBadgeCircle = ({
	imageSrc,
	fallbackInitial,
	size,
	mode = "cover",
}: {
	imageSrc?: string;
	fallbackInitial: string;
	size: number;
	mode?: "cover" | "contain";
}) => {
	const safeInitial = fallbackInitial?.slice(0, 2).toUpperCase() || "V";
	const hasImage = Boolean(imageSrc);
	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: "999px",
				overflow: "hidden",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: hasImage ? "transparent" : PAGE_BACKGROUND,
				border: hasImage ? "none" : "2px solid rgba(248,250,252,0.65)",
			}}
		>
			{hasImage ? (
				<img
					src={imageSrc}
					alt=""
					style={{
						width: "100%",
						height: "100%",
						objectFit: mode === "cover" ? "cover" : "contain",
						background: "transparent",
					}}
				/>
			) : (
				<span
					style={{
						fontSize: size * 0.3,
						fontWeight: 700,
						color: "rgba(248,250,252,0.95)",
						letterSpacing: "0.02em",
					}}
				>
					{safeInitial}
				</span>
			)}
		</div>
	);
};

export const HeroSection = ({
	heroImage,
	logoImage,
	logoMode = "cover",
	fallbackInitial,
	badgeIcon,
}: HeroSectionProps) => {
	const hasHeroImage = Boolean(heroImage?.src);
	const hasLogo = Boolean(logoImage?.src);
	const showOverlayLogo = Boolean(hasHeroImage && hasLogo);
	const showBadgeIcon = !hasLogo && Boolean(badgeIcon);
	const baseStyle = hasHeroImage
		? { backgroundColor: "transparent" }
		: {
				backgroundImage: HERO_GRADIENT,
				backgroundSize: "cover",
			};
	const badgeTransform = "translate(-50%, -110%)"; // AGENT: DONT CHANGE THIS
	const badgeSize = 240;

	return (
		<div
			style={{
				height: OG_HEIGHT,
				position: "relative",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				...baseStyle,
			}}
		>
			{hasHeroImage ? (
				<div
					style={{
						position: "absolute",
						inset: 0,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{(() => {
						const imgWidth = heroImage?.width ?? HERO_WIDTH;
						const imgHeight = heroImage?.height ?? HERO_HEIGHT;
						const imageRatio = imgWidth / imgHeight;
						const containerRatio = HERO_WIDTH / HERO_HEIGHT;
						let renderWidth = HERO_WIDTH;
						let renderHeight = HERO_HEIGHT;
						if (imageRatio > containerRatio) {
							renderHeight = HERO_HEIGHT;
							renderWidth = HERO_HEIGHT * imageRatio;
						} else {
							renderWidth = HERO_WIDTH;
							renderHeight = HERO_WIDTH / imageRatio;
						}
						return (
							<img
								src={heroImage?.src}
								alt={heroImage?.alt ?? ""}
								style={{
									position: "absolute",
									left: "50%",
									top: "50%",
									transform: "translate(-50%, -50%)",
									width: `${renderWidth}px`,
									height: `${renderHeight}px`,
									objectFit: "cover",
									opacity: 0.92,
								}}
							/>
						);
					})()}
				</div>
			) : null}

			{showBadgeIcon && badgeIcon ? (
				<div
					style={{
						position: "absolute",
						inset: 0,
						background:
							"radial-gradient(circle at 50% 50%, rgba(15,23,42,0.45), rgba(10,15,30,0.8))",
						pointerEvents: "none",
					}}
				/>
			) : null}

			{showBadgeIcon ? (
				<div
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: badgeTransform,
						zIndex: 2,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						width: badgeSize,
						height: badgeSize,
					}}
				>
					{badgeIcon}
				</div>
			) : null}

			{logoImage?.src && !showOverlayLogo ? (
				<div
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: badgeTransform,
						zIndex: 3,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{renderBadgeCircle({
						imageSrc: logoImage.src,
						fallbackInitial,
						size: badgeSize,
						mode: logoMode,
					})}
				</div>
			) : null}

			{showOverlayLogo ? (
				<div
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: badgeTransform,
						zIndex: 3,
						display: "flex",
					}}
				>
					{renderBadgeCircle({
						imageSrc: logoImage?.src,
						fallbackInitial,
						size: badgeSize,
						mode: logoMode,
					})}
				</div>
			) : null}
		</div>
	);
};
