import HeroHeader from "@/components/hero/HeroHeader";
import Section from "@/components/sections/Section";
import type { GuidePageEntry } from "@/site-content/vizij/guides";
import { ArrowRight, BookBookmark, CheckCircle, CodeSquare, LinkRoundAngle } from "@solar-icons/react-perf/LineDuotone";
import type { ReactNode } from "react";

function ActionButton({
	href,
	label,
	variant,
}: {
	href: string;
	label: string;
	variant: "primary" | "secondary" | "tertiary";
}) {
	const classes =
		variant === "primary"
			? "bg-accent-two text-surface hover:bg-accent-two/90"
			: variant === "secondary"
				? "border border-accent-two/35 bg-surface/70 text-foreground hover:border-accent-two/60 hover:bg-accent-two/10"
				: "border border-accent-base/25 bg-transparent text-foreground hover:border-accent-base/45 hover:bg-accent-base/10";

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

function OverviewGrid({ entry }: { entry: GuidePageEntry }) {
	return (
		<Section
			id="overview"
			title={entry.kind === "docs" ? "What this page gives you" : "What this walkthrough covers"}
			subtitle={
				entry.kind === "docs"
					? "Use this page to understand the concept cleanly before you drop into implementation detail."
					: "Use this page to move through the concept in order, verify a concrete checkpoint, and then continue to the next step."
			}
			variant="secondary"
		>
			<div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-3">
				{entry.overviewPanels.map((panel) => (
					<div
						key={panel.title}
						className="rounded-2xl border border-accent-base/20 bg-surface-lighter/50 p-6 backdrop-blur-md"
					>
						<h2 className="text-lg font-semibold text-foreground">{panel.title}</h2>
						<ul className="mt-4 space-y-3 text-sm leading-6 text-color-500">
							{panel.items.map((item) => (
								<li key={item} className="flex gap-3">
									<CheckCircle className="mt-1 h-4 w-4 shrink-0 text-accent-two" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</Section>
	);
}

function FocusCards({ entry }: { entry: GuidePageEntry }) {
	if (!entry.referenceImplementation && !entry.nextStep) {
		return null;
	}

	return (
		<Section
			id="focus"
			title="Keep the concept and the implementation separate"
			subtitle="Public pages teach the concept first and identify current implementation surfaces second."
			variant="primary"
		>
			<div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-2">
				{entry.referenceImplementation ? (
					<div className="rounded-2xl border border-accent-base/20 bg-surface-lighter/45 p-6">
						<div className="flex items-center gap-3 text-accent-two">
							<CodeSquare className="h-5 w-5" />
							<p className="text-sm font-semibold uppercase tracking-[0.2em]">
								Current reference implementation
							</p>
						</div>
						<p className="mt-4 text-lg font-semibold text-foreground">
							{entry.referenceImplementation.label}
						</p>
						<p className="mt-2 text-sm leading-6 text-color-500">
							{entry.referenceImplementation.note}
						</p>
						<ActionButton
							href={entry.referenceImplementation.href}
							label="Open implementation reference"
							variant="tertiary"
						/>
					</div>
				) : null}
				{entry.nextStep ? (
					<div className="rounded-2xl border border-accent-base/20 bg-special-lighter/65 p-6">
						<div className="flex items-center gap-3 text-accent-two">
							<ArrowRight className="h-5 w-5" />
							<p className="text-sm font-semibold uppercase tracking-[0.2em]">Next step</p>
						</div>
						<p className="mt-4 text-lg font-semibold text-foreground">{entry.nextStep.label}</p>
						<p className="mt-2 text-sm leading-6 text-color-500">{entry.nextStep.description}</p>
						<ActionButton href={entry.nextStep.href} label="Continue" variant="secondary" />
					</div>
				) : null}
			</div>
		</Section>
	);
}

function RenderSection({
	section,
	index,
}: {
	section: GuidePageEntry["sections"][number];
	index: number;
}) {
	return (
		<Section
			id={section.id}
			title={section.title}
			subtitle={section.subtitle}
			variant={index % 2 === 0 ? "secondary" : "primary"}
		>
			<div className="mx-auto max-w-4xl space-y-6">
				{section.paragraphs?.map((paragraph) => (
					<p key={paragraph} className="text-base leading-8 text-color-500">
						{paragraph}
					</p>
				))}
				{section.bullets ? (
					<ul className="space-y-3 text-base leading-7 text-color-500">
						{section.bullets.map((bullet) => (
							<li key={bullet} className="flex gap-3">
								<BookBookmark className="mt-1 h-4 w-4 shrink-0 text-accent-two" />
								<span>{bullet}</span>
							</li>
						))}
					</ul>
				) : null}
				{section.orderedBullets ? (
					<ol className="space-y-3 text-base leading-7 text-color-500">
						{section.orderedBullets.map((bullet, idx) => (
							<li key={bullet} className="flex gap-3">
								<span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent-two/30 bg-accent-two/10 text-xs font-semibold text-accent-two">
									{idx + 1}
								</span>
								<span>{bullet}</span>
							</li>
						))}
					</ol>
				) : null}
				{section.links ? (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{section.links.map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="rounded-2xl border border-accent-base/20 bg-surface-lighter/45 p-5 transition-colors hover:border-accent-two/45 hover:bg-accent-base/10"
							>
								<div className="flex items-center gap-3 text-accent-two">
									<LinkRoundAngle className="h-5 w-5" />
									<p className="text-base font-semibold text-foreground">{link.label}</p>
								</div>
								<p className="mt-2 text-sm leading-6 text-color-500">{link.description}</p>
							</a>
						))}
					</div>
				) : null}
			</div>
		</Section>
	);
}

function Resources({ entry }: { entry: GuidePageEntry }) {
	return (
		<Section
			id="resources"
			title={entry.resourcesTitle}
			subtitle="Use these links when you need the deeper repo-local or package-level context behind the public page."
			variant="secondary"
		>
			<div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2">
				{entry.resources.map((resource) => (
					<a
						key={resource.href}
						href={resource.href}
						className="rounded-2xl border border-accent-base/20 bg-surface-lighter/45 p-6 transition-colors hover:border-accent-two/45 hover:bg-accent-base/10"
					>
						<div className="flex items-center gap-3 text-accent-two">
							<LinkRoundAngle className="h-5 w-5" />
							<h2 className="text-lg font-semibold text-foreground">{resource.label}</h2>
						</div>
						<p className="mt-3 text-sm leading-6 text-color-500">{resource.description}</p>
					</a>
				))}
			</div>
		</Section>
	);
}

export default function GuidePage({
	entry,
	lab,
}: {
	entry: GuidePageEntry;
	lab?: ReactNode;
}) {
	return (
		<div className="space-y-12">
			<HeroHeader
				title={
					<>
						<div className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-two">
							{entry.eyebrow}
						</div>
						<div>{entry.title}</div>
					</>
				}
				description={<span className="text-sm text-color-500">{entry.description}</span>}
				headingTag="h1"
				actions={entry.actions}
			/>
			<OverviewGrid entry={entry} />
			{lab}
			<FocusCards entry={entry} />
			{entry.sections.map((section, index) => (
				<RenderSection key={section.id} section={section} index={index} />
			))}
			<Resources entry={entry} />
		</div>
	);
}
