import HeroHeader from "@/components/hero/HeroHeader";
import Section from "@/components/sections/Section";
import { url } from "@/utils/url";
import {
	ArrowRight,
	Book,
	CodeSquare,
	EmojiFunnySquare,
	Play,
	Rocket,
} from "@solar-icons/react-perf/LineDuotone";
import React from "react";

export interface HomePageProps {
	projectCount: number;
	featuredEventCount: number;
}

export default function HomePage({ projectCount, featuredEventCount }: HomePageProps) {
	const routeCards = [
		{
			title: "Docs",
			href: url("/docs/"),
			description:
				"Learn the mental models, architecture, and deployment concepts before you start wiring runtime behavior.",
			icon: <Book className="h-6 w-6" />,
			meta: "Core concepts",
		},
		{
			title: "Tutorials",
			href: url("/tutorials/"),
			description:
				"Follow one maintained tutorial spine from Hello Face through authoring, runtime behavior, and deployment.",
			icon: <CodeSquare className="h-6 w-6" />,
			meta: "Hands-on path",
		},
		{
			title: "Demos",
			href: url("/demos/"),
			description:
				"See heavier live runtime experiences and experiments without treating them as the canonical learning path.",
			icon: <Play className="h-6 w-6" />,
			meta: "Interactive surface",
		},
	] as const;

	return (
		<div className="space-y-12">
			<HeroHeader
				title={
					<>
						<div className="inline-block">Vizij is an open ecosystem for </div>{" "}
						<div>
							<span className="text-accent-one">designing</span>,{" "}
							<span className="text-accent-two">animating</span>, and{" "}
							<span className="text-accent-three">deploying</span> rendered robot faces.
						</div>
					</>
				}
				description={
					<span className="text-sm">
						Robot face workflows are still too fragmented to teach, reuse, and deploy cleanly.
						Vizij brings authoring, runtime control, expressive behavior, and deployment into one
						shared system so teams can build once and carry the result into demos, studies, and
						real deployments.
					</span>
				}
				icon={<EmojiFunnySquare className="h-16 w-16 text-accent-two" />}
				headingTag={"h1"}
				actions={[
					{
						label: "Read Docs",
						href: url("/docs/"),
						variant: "primary",
						indicatorText: undefined,
					},
					{
						label: "Follow Tutorials",
						href: url("/tutorials/"),
						variant: "secondary",
						indicatorText: undefined,
					},
					{
						label: "Explore Demos",
						href: url("/demos/"),
						variant: "tertiary",
						indicatorText: undefined,
					},
				]}
			/>

			<Section
				id="motivation"
				title="Why this matters"
				subtitle="Expressive robot faces sit at the intersection of HRI research, embodied AI, demos, education, and deployment."
				variant="secondary"
			>
				<div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3">
					{[
						{
							title: "Motivation",
							icon: <Rocket className="h-6 w-6" />,
							copy:
								"Rendered faces are one of the fastest ways to prototype expressive, controllable robot behavior across research and product contexts.",
						},
						{
							title: "Problem",
							icon: <CodeSquare className="h-6 w-6" />,
							copy:
								"Most teams still stitch together custom pipelines for design, rigging, runtime control, animation, and deployment, which makes their work brittle and hard to share.",
						},
						{
							title: "Solution",
							icon: <Book className="h-6 w-6" />,
							copy:
								"Vizij gives those teams a shared ecosystem so authored assets, controls, expressive behaviors, and deployment patterns can travel together.",
						},
					].map((card) => (
						<div
							key={card.title}
							className="flex h-full flex-col gap-4 rounded-2xl border border-accent-base/20 bg-surface-lighter/50 p-6 backdrop-blur-md"
						>
							<div className="rounded-xl border border-accent-base/20 bg-special-lighter px-3 py-3 text-accent-two">
								{card.icon}
							</div>
							<div className="space-y-2">
								<h2 className="text-xl font-semibold text-foreground">{card.title}</h2>
								<p className="text-sm leading-6 text-color-500">{card.copy}</p>
							</div>
						</div>
					))}
				</div>
			</Section>

			<Section
				id="paths"
				title="Where to go next"
				subtitle="Choose the right entrypoint based on whether you need concepts, a guided workflow, or live runtime examples."
				variant="primary"
			>
				<div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-3">
					{routeCards.map((card) => (
						<a
							key={card.title}
							href={card.href}
							className="group flex h-full flex-col gap-4 rounded-2xl border border-accent-base/20 bg-surface-lighter/40 p-6 transition-all hover:-translate-y-0.5 hover:border-accent-two/45 hover:bg-accent-base/10"
						>
							<div className="flex items-center justify-between gap-4">
								<div className="rounded-xl border border-accent-base/20 bg-special-lighter px-3 py-3 text-accent-two">
									{card.icon}
								</div>
								<span className="text-xs uppercase tracking-[0.2em] text-color-500">{card.meta}</span>
							</div>
							<div className="space-y-2">
								<h2 className="text-xl font-semibold text-foreground">{card.title}</h2>
								<p className="text-sm leading-6 text-color-500">{card.description}</p>
							</div>
							<div className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-accent-two">
								Open {card.title}
								<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
							</div>
						</a>
					))}
				</div>
			</Section>

			<Section
				id="ecosystem"
				title="What Vizij gives you"
				subtitle="A public tutorial spine on top of a deeper platform architecture."
				variant="secondary"
			>
				<div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
					<div className="rounded-2xl border border-accent-base/20 bg-surface-lighter/50 p-6 backdrop-blur-md">
						<p className="text-sm leading-7 text-color-500">
							The public site leads with a clear learning path, but Vizij still preserves the deeper
							system beneath it: authored assets, standardized-yet-flexible control models, runtime
							controllers, deployment surfaces, and reusable reference implementations. That lets one
							team move from face import to expressive behavior to operator-ready deployment without
							rebuilding the stack for every project.
						</p>
						<p className="mt-4 text-sm leading-7 text-color-500">
							Within the broader Semio Community ecosystem, this site currently surfaces{" "}
							<span className="font-semibold text-foreground">{projectCount}</span> active hardware,
							software, and research efforts that feed back into the same reproducible robotics goals.
						</p>
					</div>
					<div className="rounded-2xl border border-accent-base/20 bg-special-lighter/60 p-6">
						<p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-two">
							Current signal
						</p>
						<div className="mt-4 space-y-4">
							<div>
								<p className="text-3xl font-semibold text-foreground">{projectCount}</p>
								<p className="text-sm text-color-500">active software, hardware, and research items</p>
							</div>
							<div>
								<p className="text-3xl font-semibold text-foreground">{featuredEventCount}</p>
								<p className="text-sm text-color-500">featured or upcoming event entries on the site</p>
							</div>
							<a
								href="https://github.com/vizij-ai"
								className="inline-flex items-center gap-2 rounded-full border border-accent-base/25 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent-base/45 hover:bg-accent-base/10"
							>
								View the GitHub organization
								<ArrowRight className="h-4 w-4" />
							</a>
						</div>
					</div>
				</div>
			</Section>

			{featuredEventCount > 0 ? (
				<Section
					id="events"
					title="Current event"
					subtitle="The HRI 2026 workshop and tutorial remains the live event surface, while the site now grows an evergreen docs and tutorial system around it."
					variant="primary"
				>
					<div className="mx-auto max-w-4xl rounded-2xl border border-accent-base/20 bg-surface-lighter/50 p-6 text-center backdrop-blur-md">
						<p className="text-sm leading-6 text-color-500">
							If you are attending the HRI 2026 workshop and tutorial, use the event page for
							schedule, logistics, and event-specific framing, then return to the tutorials hub for
							the canonical evergreen learning path.
						</p>
						<a
							href={url("/events/hri-2026-tutorial/")}
							className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent-two/35 bg-accent-two/10 px-4 py-2 text-sm font-medium text-accent-two transition-colors hover:border-accent-two/60 hover:bg-accent-two/15"
						>
							View the HRI 2026 event page
							<ArrowRight className="h-4 w-4" />
						</a>
					</div>
				</Section>
			) : null}
		</div>
	);
}
