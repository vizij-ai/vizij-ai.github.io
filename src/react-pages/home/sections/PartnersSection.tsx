import SectionBlock from "@/components/sections/SectionBlock";
import { Buildings2, Flag2, SquareAcademicCap } from "@solar-icons/react-perf/LineDuotone";
import type React from "react";

export interface PartnerPillar {
	title: string;
	description: string;
	/**
	 * Optional icon (React element). Pass in your own icon component already styled
	 * (e.g., w-12 h-12 text-accent-three).
	 */
	icon?: React.ReactNode;
	className?: string;
}

export interface PartnersSectionProps {
	/**
	 * Section id. Defaults to "partners".
	 */
	id?: string;
	/**
	 * Section heading. Defaults to "Our Partners".
	 */
	title?: string;
	/**
	 * Section subheading displayed under the heading.
	 */
	subtitle?: string;
	/**
	 * Optional description paragraph rendered in a bordered card above the pillars grid.
	 * If not provided, a sensible default is used.
	 */
	description?: React.ReactNode;
	/**
	 * aria-label for the section element. If omitted, title is used.
	 */
	ariaLabel?: string;
	/**
	 * Wrapper className for the outer section element.
	 */
	className?: string;
	/**
	 * Optional className for the inner card wrapper.
	 */
	cardClassName?: string;
	/**
	 * The three pillars to render (Academia, Industry, Public Sector).
	 * If omitted, defaults are used.
	 */
	items?: PartnerPillar[];
}

/**
 * PartnersSection
 *
 * Renders the "Our Partners" block used on the homepage:
 * - Section heading/subheading (via SectionBlock)
 * - A bordered card with a short description paragraph
 * - A 3-column grid of partner pillars (Academia, Industry, Public Sector)
 *
 * Icons are optional and may be passed as React nodes on each pillar item.
 */
export default function PartnersSection({
	id = "partners",
	title = "Our Partners",
	subtitle = "Building the future of human-centered robotics and AI together",
	description = (
		<>
			Semio Community actively encourages multidisciplinary collaboration among academia, industry,
			and the public sector to drive innovation, ethical practices, and the widespread adoption of
			human-centered robotics and AI technologies.
		</>
	),
	ariaLabel,
	className,
	cardClassName,
	items,
}: PartnersSectionProps) {
	const pillars: PartnerPillar[] =
		items && items.length > 0
			? items
			: [
					{
						title: "Academia",
						description: "Supporting research institutions with tools and infrastructure",
						icon: <SquareAcademicCap className="w-12 h-12" />,
					},
					{
						title: "Industry",
						description: "Bridging the gap between research and commercial applications",
						icon: <Buildings2 className="w-12 h-12" />,
					},
					{
						title: "Public Sector",
						description: "Partnering with government to advance robotics policy and standards",
						icon: <Flag2 className="w-12 h-12" />,
					},
				];

	return (
		<SectionBlock
			id={id}
			title={title}
			subtitle={subtitle}
			ariaLabel={ariaLabel || title}
			variant="tertiary"
			className={className}
		>
			<div className="max-w-4xl mx-auto">
				<div
					className={`bg-special-lighter rounded-lg p-8 border border-special backdrop-blur-lg ${
						cardClassName || ""
					}`}
				>
					{/* Description copy */}
					{description ? (
						<p className="text-lg leading-relaxed text-center mb-6">
							{typeof description === "string" ? description : description}
						</p>
					) : null}

					{/* Pillars grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{pillars.map((p, idx) => (
							<div key={`${p.title}-${idx}`} className={`text-center ${p.className || ""}`}>
								{p.icon ? (
									<div className="w-12 h-12 mx-auto mb-3 text-accent-three flex items-center justify-center">
										{p.icon}
									</div>
								) : null}
								<h3 className="font-semibold mb-2">{p.title}</h3>
								<p className="text-sm text-color-600 dark:text-color-400">{p.description}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</SectionBlock>
	);
}
