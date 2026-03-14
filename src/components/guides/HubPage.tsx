import HeroHeader from "@/components/hero/HeroHeader";
import Section from "@/components/sections/Section";
import type {
	GuidebookHubContent as HubPageContent,
} from "@/lib/guidebook-content";
import { resolveSitePath } from "@/utils/url";
import { LinkCard } from "@semio-community/ecosystem-site-core";
import {
	Book,
	CodeSquare,
	Rocket,
} from "@solar-icons/react-perf/LineDuotone";

const ICONS = [Book, Rocket, CodeSquare];

export default function HubPage({ content }: { content: HubPageContent }) {
	return (
		<div className="space-y-12">
			<HeroHeader
				title={content.title}
				description={content.description}
				actions={content.actions.map((action) => ({
					label: action.label,
					href: resolveSitePath(action.href),
					variant: action.variant,
				}))}
			/>

			{content.sections.map((section, sectionIndex) => (
				<Section
					key={section.id}
					id={section.id}
					title={section.title}
					subtitle={section.subtitle}
					variant={
						(["primary", "secondary", "tertiary"] as const)[sectionIndex % 3]
					}
				>
					<div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{section.cards.map((card, cardIndex) => {
							const Icon = ICONS[(sectionIndex + cardIndex) % ICONS.length]!;
							return (
								<LinkCard
									key={card.id}
									title={card.title}
									description={card.description}
									variant={
										(["primary", "secondary", "tertiary"] as const)[
											sectionIndex % 3
										]
									}
									iconRender={(className) => (
										<Icon className={className} />
									)}
									extraLinks={[
										{
											label: "Open",
											href: resolveSitePath(card.href),
										},
									]}
								/>
							);
						})}
					</div>
				</Section>
			))}
		</div>
	);
}
