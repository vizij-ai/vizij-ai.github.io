import React from "react";
import {
	CARD_BORDER,
	OG_BACKGROUND,
	PAGE_BACKGROUND,
	STAR_COLOR,
	STAR_PATH,
	STATUS_STYLES,
	TEXT_MUTED,
	TEXT_PRIMARY,
} from "../constants";
import type { OgImageProps } from "../types";
import { truncateText } from "../utils";
import { BrandLockup } from "./BrandLockup";
import { HeroSection } from "./HeroSection";
import { renderListIcon } from "./ListIcons";

const OutlineStar = ({ color = STAR_COLOR }: { color?: string }) => (
	<svg width="30" height="30" viewBox="0 0 24 24" fill="none">
		<path
			d={STAR_PATH}
			stroke={color}
			strokeWidth="1.5"
			fill="none"
			strokeLinejoin="round"
			strokeLinecap="round"
		/>
	</svg>
);

const SolidStar = ({ color = STAR_COLOR }: { color?: string }) => (
	<svg width="30" height="30" viewBox="0 0 24 24" fill="none">
		<path d={STAR_PATH} fill={color} />
	</svg>
);

export const OgCard = ({
	title,
	description,
	eyebrow,
	badge,
	badgeIcon,
	avatarInitial,
	heroImage,
	logoImage,
	listItems = [],
	statusLabel,
	categoryLabel,
	statusTone,
	listColumns = 1,
	logoMode = "cover",
}: OgImageProps) => {
	const fallbackInitial = avatarInitial || title?.charAt(0)?.toUpperCase() || "V";
	const truncatedTitle = truncateText(title, 80) ?? title;
	const truncatedDescription = truncateText(description, 80);
	const showDescription = Boolean(truncatedDescription) && listItems.length === 0;
	const showList = listItems.length > 0;
	void eyebrow;
	const featuredIcon = (() => {
		if (badge === "featured") return <SolidStar />;
		if (badge === "previously-featured") return <OutlineStar />;
		return null;
	})();

	return (
		<div
			style={{
				width: "1200px",
				height: "630px",
				display: "flex",
				position: "relative",
				flexDirection: "column",
				background: OG_BACKGROUND,
				fontFamily: "Gilroy",
				color: TEXT_PRIMARY,
			}}
		>
			<HeroSection
				heroImage={heroImage}
				logoImage={logoImage}
				logoMode={logoMode}
				fallbackInitial={fallbackInitial}
				badgeIcon={badgeIcon}
			/>

			<div
				style={{
					flex: 1,
					padding: "42px 56px 40px",
					position: "absolute",
					display: "flex",
					right: 0,
					left: 0,
					bottom: 0,
					zIndex: 10,
					flexDirection: "column",
					gap: "20px",
					backgroundColor: PAGE_BACKGROUND,
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "flex-start",
						justifyContent: "space-between",
						gap: "20px",
					}}
				>
					<div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
						<div
							style={{
								fontSize: "52px",
								fontWeight: 700,
								letterSpacing: "-0.02em",
								lineHeight: 1.1,
								color: TEXT_PRIMARY,
								wordBreak: "break-word",
							}}
						>
							{truncatedTitle}
						</div>
						{showDescription ? (
							<div
								style={{
									marginTop: "12px",
									marginBottom: showList ? "8px" : "0px",
									fontSize: "26px",
									color: TEXT_MUTED,
									lineHeight: 1.45,
								}}
							>
								{truncatedDescription}
							</div>
						) : null}
					</div>
					{featuredIcon ? (
						<div style={{ display: "flex", alignItems: "center" }}>{featuredIcon}</div>
					) : null}
				</div>

				{showList ? (
					<div
						style={{
							display: "flex",
							flexDirection: listColumns === 2 ? "row" : "column",
							gap: "12px",
							flexWrap: listColumns === 2 ? "wrap" : "nowrap",
						}}
					>
						{listItems.slice(0, listColumns === 2 ? 4 : 2).map((item) => (
							<div
								key={item.text}
								style={{
									display: "flex",
									alignItems: "center",
									gap: "12px",
									fontSize: "24px",
									color: TEXT_MUTED,
									flexGrow: listColumns === 2 ? 1 : 0,
									flexShrink: listColumns === 2 ? 1 : 0,
									flexBasis: listColumns === 2 ? "48%" : "auto",
								}}
							>
								{renderListIcon(item.icon)}
								<span>{item.text}</span>
							</div>
						))}
					</div>
				) : null}

				<div
					style={{
						marginTop: "auto",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						borderTop: `1px solid ${CARD_BORDER}`,
						paddingTop: "22px",
					}}
				>
					<div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
						{statusLabel ? (
							<div
								style={{
									padding: "8px 22px",
									borderRadius: "999px",
									backgroundColor: statusTone
										? STATUS_STYLES[statusTone]?.bg
										: "rgba(148,163,184,0.18)",
									color: statusTone ? STATUS_STYLES[statusTone]?.text : TEXT_MUTED,
									fontWeight: 600,
									fontSize: "22px",
									letterSpacing: "0.01em",
								}}
							>
								{statusLabel}
							</div>
						) : null}
						{!statusLabel && categoryLabel ? (
							<span
								style={{
									fontSize: "22px",
									color: TEXT_MUTED,
								}}
							>
								{categoryLabel}
							</span>
						) : null}
					</div>
					<BrandLockup />
				</div>
			</div>
		</div>
	);
};
