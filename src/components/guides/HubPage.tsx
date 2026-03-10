import HeroHeader from "@/components/hero/HeroHeader";
import Section from "@/components/sections/Section";
import type { HubPageContent } from "@/site-content/vizij/hubs";
import { ArrowRight, Book, CodeSquare, Rocket } from "@solar-icons/react-perf/LineDuotone";

const ICONS = [Book, Rocket, CodeSquare];

function ActionButton({
	href,
	label,
	variant,
	as = "a",
}: {
	href: string;
	label: string;
	variant: "primary" | "secondary" | "tertiary";
	as?: "a" | "span";
}) {
	const classes =
		variant === "primary"
			? "bg-accent-two text-surface hover:bg-accent-two/90"
			: variant === "secondary"
				? "border border-accent-two/35 bg-surface/70 text-foreground hover:border-accent-two/60 hover:bg-accent-two/10"
				: "border border-accent-base/25 bg-transparent text-foreground hover:border-accent-base/45 hover:bg-accent-base/10";

	if (as === "span") {
		return (
			<span
				className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${classes}`}
			>
				{label}
				<ArrowRight className="h-4 w-4" />
			</span>
		);
	}

	return (
		<a
			href={href}
			className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${classes}`}
		>
			{label}
			<ArrowRight className="h-4 w-4" />
		</a>
	);
}

export default function HubPage({ content }: { content: HubPageContent }) {
	return (
		<div className="space-y-12">
			<HeroHeader
				title={
					<>
						<div className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-two">
							{content.eyebrow}
						</div>
						<div>{content.title}</div>
					</>
				}
				description={<span className="text-sm text-color-500">{content.description}</span>}
				headingTag="h1"
				actions={content.actions}
			/>

			{content.sections.map((section, index) => {
				const Icon = ICONS[index % ICONS.length] ?? Book;
				return (
					<Section
						key={section.id}
						id={section.id}
						title={section.title}
						subtitle={section.subtitle}
						variant={index % 2 === 0 ? "secondary" : "primary"}
					>
						<div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2">
							{section.cards.map((card) => (
								<a
									key={card.id}
									href={card.href}
									className="group flex h-full flex-col gap-4 rounded-2xl border border-accent-base/20 bg-surface-lighter/50 p-6 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-accent-two/45 hover:bg-accent-base/10"
								>
									<div className="flex items-start justify-between gap-4">
										<div className="rounded-xl border border-accent-base/20 bg-special-lighter px-3 py-3 text-accent-two">
											<Icon className="h-6 w-6" />
										</div>
										<div className="flex items-center gap-2">
											{card.badge ? (
												<span className="rounded-full border border-accent-two/30 bg-accent-two/10 px-2.5 py-1 text-xs font-medium text-accent-two">
													{card.badge}
												</span>
											) : null}
											<span className="text-xs uppercase tracking-[0.2em] text-color-500">
												{card.meta}
											</span>
										</div>
									</div>
									<div className="space-y-2">
										<h2 className="text-xl font-semibold text-foreground">{card.title}</h2>
										<p className="text-sm leading-6 text-color-500">{card.description}</p>
									</div>
									<div className="mt-auto pt-2">
										<ActionButton href={card.href} label="Open page" variant="tertiary" as="span" />
									</div>
								</a>
							))}
						</div>
					</Section>
				);
			})}
		</div>
	);
}
