import { GazeInteractiveFace } from "@/components/demos/GazeInteractiveFace";
import { HeroPassiveBehavior } from "@/components/demos/HeroPassiveBehavior";
import { PoseButtonPanel } from "@/components/demos/PoseButtonPanel";
import { PoseRigMirrorBridge } from "@/components/demos/PoseRigMirrorBridge";
import { RigControlPanel } from "@/components/demos/RigControlPanel";
import { RuntimeFaceFrame } from "@/components/demos/RuntimeFaceFrame";
import { ShowcaseRuntime } from "@/components/demos/ShowcaseRuntime";
import { SpeechOverlay } from "@/components/demos/SpeechOverlay";
import { VoicePanel } from "@/components/demos/VoicePanel";
import Section from "@/components/sections/Section";
import { HERO_FACES } from "@/demo-lib/heroFaces";
import type { SpeechStatus } from "@/demo-lib/speech";
import {
	DEMO_PAGES,
	type DemoPageId,
	type DemoPageMeta,
	getDemoPageById,
	getDemoPageHref,
} from "@/react-pages/demos/demoPages";
import ConnectSection from "@/react-pages/home/sections/ConnectSection";
import { CallToActionButton, FeatureCard } from "@semio-community/ecosystem-site-core";
import {
	ArrowLeft,
	ArrowRight,
	CodeSquare,
	LinkRoundAngle,
} from "@solar-icons/react-perf/LineDuotone";
import { OrchestratorProvider } from "@vizij/orchestrator-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

const PREVIEW_CARD_CLASS =
	"group flex h-full flex-col overflow-hidden rounded-lg border border-[#eadcc9] bg-white/88 shadow-[0_24px_80px_-28px_rgba(24,24,27,0.2)] backdrop-blur-lg dark:border-white/8 dark:bg-[#17191e]/82 dark:shadow-[0_24px_80px_-28px_rgba(0,0,0,0.55)]";
const PREVIEW_MEDIA_CLASS =
	"aspect-video overflow-hidden bg-linear-to-br from-[#fff8ef] to-[#eef8f2] dark:from-[#22262d] dark:to-[#111419]";
const SOFT_PANEL_CLASS =
	"rounded-[1.7rem] border border-[#ead7c3] bg-white/88 shadow-[0_18px_52px_-30px_rgba(24,24,27,0.24)] dark:border-white/10 dark:bg-[#171b22]/88 dark:shadow-[0_18px_52px_-30px_rgba(0,0,0,0.48)]";
const PREVIEW_FOOTER_CLASS =
	"space-y-2 border-t border-[#ead7c3]/70 bg-[#faf1e5]/72 px-5 py-4 dark:border-white/10 dark:bg-[#1b1f27]/86";
const RAIL_CARD_CLASS =
	"rounded-[1.7rem] border border-[#ead7c3] bg-white/86 p-5 shadow-[0_18px_48px_-30px_rgba(24,24,27,0.24)] transition-transform hover:-translate-y-0.5 hover:border-accent-two/35 dark:border-white/10 dark:bg-[#171b22]/88 dark:shadow-[0_18px_48px_-30px_rgba(0,0,0,0.48)]";
const HERO_SUBTLE_PILL_CLASS =
	"rounded-full border border-[#ead7c3] bg-white/76 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#6e6254] dark:border-white/10 dark:bg-[#1b1f27]/84 dark:text-[#bbb2a7]";
const MUTED_TEXT_CLASS = "text-color-500 dark:text-[#c8c0b4]";
const TEACHING_PANEL_CLASS =
	"mt-6 rounded-3xl border border-[#ead7c3] bg-white/72 p-6 shadow-[0_22px_64px_-36px_rgba(24,24,27,0.22)] backdrop-blur-md dark:border-white/10 dark:bg-[#151a21]/88 dark:shadow-[0_22px_64px_-36px_rgba(0,0,0,0.55)]";
const TEACHING_CARD_CLASS =
	"rounded-2xl border border-[#ead7c3]/80 bg-white/78 p-5 dark:border-white/10 dark:bg-[#1a1f27]/88";
const TEACHING_WARM_CARD_CLASS =
	"rounded-2xl border border-[#ead7c3]/80 bg-[#fff4e6] p-5 dark:border-[#3a2d21] dark:bg-[#221913]";
const TEACHING_SUCCESS_CARD_CLASS =
	"rounded-2xl border border-[#dbe8dc] bg-[#eef7f1] p-5 dark:border-[#2c4338] dark:bg-[#13201c]";
const TEACHING_CODE_PANEL_CLASS =
	"overflow-hidden rounded-2xl border border-[#ead7c3]/80 bg-white/82 dark:border-white/10 dark:bg-[#1a1f27]/92";
const TEACHING_CODE_HEADER_CLASS =
	"flex items-center gap-3 border-b border-[#ead7c3]/80 bg-[#fbefe3]/85 px-4 py-3 dark:border-white/10 dark:bg-[#23202a]/92";
const SERIF_STACK = '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif';
const SANS_STACK = '"Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif';

const LEGACY_HASH_ROUTE_MAP: Partial<Record<string, string>> = {
	controls: getDemoPageHref("controls"),
	expressions: getDemoPageHref("expressions"),
	gaze: getDemoPageHref("gaze"),
	voice: getDemoPageHref("voice"),
};

type DemosPageProps = {
	demoId?: DemoPageId;
};

function DemoActionButton({
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
				? "border border-accent-two/35 bg-surface/80 text-foreground hover:border-accent-two/55 hover:bg-accent-two/10 dark:border-accent-two/30 dark:bg-[#1b1f27]/84"
				: "border border-accent-base/25 bg-transparent text-foreground hover:border-accent-base/45 hover:bg-accent-base/10 dark:border-white/15 dark:hover:bg-white/5";

	return (
		<a
			href={href}
			className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${classes}`}
			style={{ fontFamily: SANS_STACK }}
		>
			{label}
			<LinkRoundAngle className="h-4 w-4" />
		</a>
	);
}

function DemoTeachingPanel({
	title,
	summary,
	bullets,
	validation,
	code,
	sources,
	reproduceSteps,
	nextHref,
	nextLabel,
}: {
	title: string;
	summary: string;
	bullets: string[];
	validation: string[];
	code: string;
	sources: Array<{ label: string; href: string }>;
	reproduceSteps: string[];
	nextHref: string;
	nextLabel: string;
}) {
	return (
		<div className={TEACHING_PANEL_CLASS}>
			<div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.95fr]">
				<div className="space-y-5">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-two">
							Observe, inspect, reproduce
						</p>
						<h3 className="mt-3 text-xl font-semibold text-foreground">{title}</h3>
						<p className={`mt-2 text-sm leading-7 ${MUTED_TEXT_CLASS}`}>{summary}</p>
					</div>
					<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
						<div className={TEACHING_CARD_CLASS}>
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-two">
								Inspect
							</p>
							<ul className={`mt-4 space-y-3 text-sm leading-6 ${MUTED_TEXT_CLASS}`}>
								{bullets.map((bullet) => (
									<li key={bullet} className="flex gap-3">
										<LinkRoundAngle className="mt-1 h-4 w-4 shrink-0 text-accent-two" />
										<span>{bullet}</span>
									</li>
								))}
							</ul>
						</div>
						<div className={TEACHING_WARM_CARD_CLASS}>
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-two">
								Reproduce
							</p>
							<ol className={`mt-4 space-y-3 text-sm leading-6 ${MUTED_TEXT_CLASS}`}>
								{reproduceSteps.map((step, index) => (
									<li key={step} className="flex gap-3">
										<span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent-two/30 bg-accent-two/10 text-xs font-semibold text-accent-two">
											{index + 1}
										</span>
										<span>{step}</span>
									</li>
								))}
							</ol>
						</div>
					</div>
					<div className={TEACHING_SUCCESS_CARD_CLASS}>
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-two">
							Validate
						</p>
						<ul className={`mt-4 space-y-3 text-sm leading-6 ${MUTED_TEXT_CLASS}`}>
							{validation.map((item) => (
								<li key={item} className="flex gap-3">
									<LinkRoundAngle className="mt-1 h-4 w-4 shrink-0 text-accent-two" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</div>
					<div className={TEACHING_CARD_CLASS}>
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-two">
							Source surfaces
						</p>
						<div className="mt-4 flex flex-wrap gap-3">
							{sources.map((source) => (
								<a
									key={source.href}
									href={source.href}
									className="inline-flex items-center gap-2 rounded-full border border-accent-base/20 bg-accent-base/10 px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent-two/45 hover:bg-accent-two/10 dark:border-white/10 dark:bg-white/6 dark:hover:bg-accent-two/12"
								>
									<LinkRoundAngle className="h-4 w-4 text-accent-two" />
									<span>{source.label}</span>
								</a>
							))}
						</div>
					</div>
					<div>
						<CallToActionButton href={nextHref} size="small" variant="tertiary">
							{nextLabel}
						</CallToActionButton>
					</div>
				</div>
				<div className="space-y-5">
					<div className={TEACHING_CODE_PANEL_CLASS}>
						<div className={TEACHING_CODE_HEADER_CLASS}>
							<CodeSquare className="h-4 w-4 text-accent-two" />
							<p className="text-sm font-semibold text-foreground">Representative runtime write</p>
						</div>
						<pre className="overflow-x-auto rounded-none border-none bg-transparent">
							<code className="block px-4 py-4 text-[13px] leading-7 text-foreground">{code}</code>
						</pre>
					</div>
					<div className={TEACHING_CARD_CLASS}>
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-two">
							What to confirm
						</p>
						<p className={`mt-3 text-sm leading-6 ${MUTED_TEXT_CLASS}`}>
							If you cannot point to the runtime write, the source surface, and the exact tutorial
							or doc route that reproduces the behavior, this section is still acting like a
							showcase instead of a technical demo.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function DemoPageShell({ children }: { children: ReactNode }) {
	return (
		<OrchestratorProvider autostart={false}>
			<div className="relative overflow-hidden bg-[linear-gradient(180deg,#fffdf8_0%,#fcfbf7_38%,#f7f4ee_100%)] pb-20 dark:bg-[linear-gradient(180deg,#0f1114_0%,#131821_42%,#0f1114_100%)]">
				<div className="pointer-events-none absolute inset-0">
					<div className="absolute left-[-12rem] top-10 h-[32rem] w-[32rem] rounded-full bg-[#f97316]/10 blur-3xl" />
					<div className="absolute right-[-10rem] top-48 h-[28rem] w-[28rem] rounded-full bg-[#0f766e]/10 blur-3xl" />
					<div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-[#eab308]/8 blur-3xl" />
				</div>

				<div className="relative space-y-12">{children}</div>
			</div>
		</OrchestratorProvider>
	);
}

function OverviewHashRedirect() {
	useEffect(() => {
		const hash = window.location.hash.replace(/^#/, "");
		const targetHref = hash ? LEGACY_HASH_ROUTE_MAP[hash] : undefined;
		if (targetHref) {
			window.location.replace(targetHref);
		}
	}, []);

	return null;
}

function DemosMasthead() {
	const heroFaces = HERO_FACES.slice(0, 2);

	return (
		<section
			id="hero"
			className="mx-auto max-w-7xl scroll-mt-28 px-4 pt-20 sm:px-6 sm:pt-24 lg:px-8"
		>
			<div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
				<div className="space-y-6 rounded-[2.35rem] border border-[#ead7c3] bg-[linear-gradient(180deg,rgba(255,251,245,0.98),rgba(247,239,229,0.93))] p-6 shadow-[0_20px_64px_-34px_rgba(24,24,27,0.24)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(22,25,31,0.96),rgba(16,18,23,0.92))] dark:shadow-[0_20px_64px_-34px_rgba(0,0,0,0.6)] sm:p-8">
					<div className="flex flex-wrap items-center gap-3">
						<span
							className="rounded-full border border-accent-two/25 bg-accent-two/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-two"
							style={{ fontFamily: SANS_STACK }}
						>
							Vizij Demos
						</span>
						<span className={HERO_SUBTLE_PILL_CLASS} style={{ fontFamily: SANS_STACK }}>
							Observe, inspect, reproduce
						</span>
					</div>

					<div className="space-y-4">
						<h1
							className="max-w-4xl text-4xl leading-[1.02] text-[#211b16] dark:text-[#f6f1e8] sm:text-5xl lg:text-6xl"
							style={{ fontFamily: SERIF_STACK }}
						>
							Current Vizij Demos
						</h1>
						<p
							className="max-w-2xl text-base leading-8 text-[#5d5247] dark:text-[#c8c0b4] sm:text-lg"
							style={{ fontFamily: SANS_STACK }}
						>
							Browse each runtime surface as its own page so the behavior, code path, and follow-on
							route stay focused instead of competing inside one long scroll document.
						</p>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div className={SOFT_PANEL_CLASS}>
							<p
								className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-two"
								style={{ fontFamily: SANS_STACK }}
							>
								Use this page for
							</p>
							<p
								className="mt-3 text-lg leading-tight text-foreground"
								style={{ fontFamily: SERIF_STACK }}
							>
								Choose one behavior, then move straight into its runtime contract
							</p>
						</div>
						<div className="rounded-[1.7rem] border border-accent-base/15 bg-[#16171a] p-5 text-white shadow-[0_18px_52px_-30px_rgba(24,24,27,0.42)]">
							<p
								className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f8c46d]"
								style={{ fontFamily: SANS_STACK }}
							>
								Expect from each demo
							</p>
							<p className="mt-3 text-lg leading-tight" style={{ fontFamily: SERIF_STACK }}>
								One observed behavior, one runtime explanation, one reproduction route
							</p>
						</div>
					</div>

					<div className="overflow-hidden rounded-[1.7rem] border border-accent-base/15 bg-[#16171a] shadow-[0_18px_52px_-30px_rgba(24,24,27,0.42)]">
						<div className="flex items-center justify-between gap-3 border-b border-white/8 bg-white/5 px-5 py-4">
							<div>
								<p
									className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f8c46d]"
									style={{ fontFamily: SANS_STACK }}
								>
									Start with one known contract
								</p>
								<p
									className="mt-2 text-sm leading-6 text-white/68"
									style={{ fontFamily: SANS_STACK }}
								>
									The demos index should prove inspectability immediately, then route you into the
									specific runtime surface you want to study.
								</p>
							</div>
							<span
								className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/65"
								style={{ fontFamily: SANS_STACK }}
							>
								typed write
							</span>
						</div>
						<pre className="overflow-x-auto px-5 py-4">
							<code className="block text-[13px] leading-7 text-white/92">
								{`standard/vizij/left_eye/pos/x -> { f64: 0.45 }
standard/vizij/right_eye/pos/x -> { f64: 0.45 }
standard/vizij/jaw/open -> { f64: 0.15 }`}
							</code>
						</pre>
					</div>

					<div className="flex flex-wrap gap-3">
						<DemoActionButton
							href={getDemoPageHref("controls")}
							label="Open Rig Controls"
							variant="primary"
						/>
						<DemoActionButton href="/docs/" label="Read Docs" variant="secondary" />
						<DemoActionButton
							href="/docs/architecture/"
							label="Open Architecture"
							variant="tertiary"
						/>
					</div>
				</div>

				<div className="grid gap-5 md:grid-cols-2">
					{heroFaces.map((face, index) => (
						<ShowcaseRuntime
							key={face.namespace}
							namespace={`hero-${face.namespace}`}
							asset={face.asset}
							active
							visible
							autostart
							driveOrchestrator={index === 0}
						>
							<HeroPassiveBehavior enabled />
							<article className="overflow-hidden rounded-[2rem] border border-[#ead7c3] bg-white/92 shadow-[0_24px_80px_-28px_rgba(24,24,27,0.32)] dark:border-white/10 dark:bg-[#171b22]/90 dark:shadow-[0_24px_80px_-28px_rgba(0,0,0,0.58)]">
								<div className="aspect-[4/5] overflow-hidden bg-linear-to-br from-special-lighter to-special">
									<RuntimeFaceFrame mode="media" />
								</div>
								<div className={PREVIEW_FOOTER_CLASS}>
									<p
										className="text-sm font-semibold text-foreground"
										style={{ fontFamily: SANS_STACK }}
									>
										{face.label}
									</p>
									<p
										className={`text-sm leading-6 ${MUTED_TEXT_CLASS}`}
										style={{ fontFamily: SANS_STACK }}
									>
										{face.subtitle}
									</p>
								</div>
							</article>
						</ShowcaseRuntime>
					))}
				</div>
			</div>
		</section>
	);
}

function DemosRail() {
	return (
		<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{DEMO_PAGES.map((demo) => (
					<a key={demo.id} href={getDemoPageHref(demo)} className={RAIL_CARD_CLASS}>
						<p
							className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-two"
							style={{ fontFamily: SANS_STACK }}
						>
							{demo.surfaceLabel}
						</p>
						<p
							className="mt-3 text-xl leading-tight text-foreground"
							style={{ fontFamily: SERIF_STACK }}
						>
							{demo.label}
						</p>
						<p
							className={`mt-2 text-sm leading-6 ${MUTED_TEXT_CLASS}`}
							style={{ fontFamily: SANS_STACK }}
						>
							{demo.teaser}
						</p>
						<div
							className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent-two"
							style={{ fontFamily: SANS_STACK }}
						>
							Open demo
							<ArrowRight className="h-4 w-4" />
						</div>
					</a>
				))}
			</div>
		</section>
	);
}

function DemoSwitchboard({ activeDemoId }: { activeDemoId: DemoPageId }) {
	return (
		<div className="grid gap-3 sm:grid-cols-2">
			{DEMO_PAGES.map((demo) => {
				const isActive = demo.id === activeDemoId;
				return (
					<a
						key={demo.id}
						href={getDemoPageHref(demo)}
						aria-current={isActive ? "page" : undefined}
						className={`rounded-[1.45rem] border p-4 transition-colors ${
							isActive
								? "border-accent-two/35 bg-accent-two/10 text-foreground dark:border-accent-two/30 dark:bg-accent-two/12"
								: "border-[#ead7c3] bg-white/72 hover:border-accent-two/35 hover:bg-accent-two/10 dark:border-white/10 dark:bg-[#1b1f27]/84 dark:hover:bg-white/8"
						}`}
					>
						<p
							className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
								isActive ? "text-accent-two" : MUTED_TEXT_CLASS
							}`}
							style={{ fontFamily: SANS_STACK }}
						>
							{demo.surfaceLabel}
						</p>
						<p className="mt-2 text-lg leading-tight" style={{ fontFamily: SERIF_STACK }}>
							{demo.label}
						</p>
						<p
							className={`mt-2 text-sm leading-6 ${MUTED_TEXT_CLASS}`}
							style={{ fontFamily: SANS_STACK }}
						>
							{demo.teaser}
						</p>
					</a>
				);
			})}
		</div>
	);
}

function DemoDetailHeader({ demo }: { demo: DemoPageMeta }) {
	return (
		<section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-24 lg:px-8">
			<div className="grid gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
				<div className="space-y-6 rounded-[2.35rem] border border-[#ead7c3] bg-[linear-gradient(180deg,rgba(255,251,245,0.98),rgba(247,239,229,0.93))] p-6 shadow-[0_20px_64px_-34px_rgba(24,24,27,0.24)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(22,25,31,0.96),rgba(16,18,23,0.92))] dark:shadow-[0_20px_64px_-34px_rgba(0,0,0,0.6)] sm:p-8">
					<a
						href="/demos/"
						className="inline-flex items-center gap-2 text-sm font-medium text-accent-two"
						style={{ fontFamily: SANS_STACK }}
					>
						<ArrowLeft className="h-4 w-4" />
						All demos
					</a>

					<div className="flex flex-wrap items-center gap-3">
						<span
							className="rounded-full border border-accent-two/25 bg-accent-two/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-two"
							style={{ fontFamily: SANS_STACK }}
						>
							{demo.surfaceLabel}
						</span>
						<span className={HERO_SUBTLE_PILL_CLASS} style={{ fontFamily: SANS_STACK }}>
							Runtime page
						</span>
					</div>

					<div className="space-y-4">
						<h1
							className="max-w-4xl text-4xl leading-[1.02] text-[#211b16] dark:text-[#f6f1e8] sm:text-5xl lg:text-6xl"
							style={{ fontFamily: SERIF_STACK }}
						>
							{demo.title}
						</h1>
						<p
							className="max-w-2xl text-base leading-8 text-[#5d5247] dark:text-[#c8c0b4] sm:text-lg"
							style={{ fontFamily: SANS_STACK }}
						>
							{demo.subtitle}
						</p>
						<p
							className={`max-w-2xl text-sm leading-7 ${MUTED_TEXT_CLASS}`}
							style={{ fontFamily: SANS_STACK }}
						>
							{demo.description}
						</p>
					</div>

					<div className="flex flex-wrap gap-3">
						<DemoActionButton href={demo.learnHref} label={demo.learnLabel} variant="primary" />
						<DemoActionButton
							href="/docs/architecture/"
							label="Read Architecture"
							variant="secondary"
						/>
						<DemoActionButton href="/demos/" label="Browse All Demos" variant="tertiary" />
					</div>
				</div>

				<div className={SOFT_PANEL_CLASS}>
					<p
						className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-two"
						style={{ fontFamily: SANS_STACK }}
					>
						Switch demos
					</p>
					<p
						className={`mt-3 text-sm leading-7 ${MUTED_TEXT_CLASS}`}
						style={{ fontFamily: SANS_STACK }}
					>
						The behavior pages replace the old scroll-jump menu. Pick another runtime surface here
						when you want to compare contracts side by side.
					</p>
					<div className="mt-5">
						<DemoSwitchboard activeDemoId={demo.id} />
					</div>
				</div>
			</div>
		</section>
	);
}

function ControlsDemoSection() {
	return (
		<Section
			id="controls"
			title="Rig Controls"
			subtitle="Search and control low-level rig inputs while previewing updates in real time."
			variant="primary"
		>
			<div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
				<ShowcaseRuntime
					namespace="controls"
					asset="hugoCurrentExtended"
					active
					visible
					autostart
					driveOrchestrator={false}
				>
					<article className={PREVIEW_CARD_CLASS}>
						<div className={PREVIEW_MEDIA_CLASS}>
							<RuntimeFaceFrame mode="media" />
						</div>
						<div className="flex flex-col gap-1 p-5">
							<p className="text-xs font-semibold uppercase tracking-wider text-accent-base/80">
								Live face output
							</p>
							<p className={`text-sm ${MUTED_TEXT_CLASS}`}>
								Preview staged rig input changes as you tune values.
							</p>
						</div>
					</article>

					<article className={PREVIEW_CARD_CLASS}>
						<div className="p-5">
							<RigControlPanel unstyled />
						</div>
					</article>
				</ShowcaseRuntime>
			</div>
			<div className="mx-auto max-w-6xl">
				<DemoTeachingPanel
					title="Rig controls stage direct runtime writes"
					summary="The controls panel is not magic UI. It searches the active rig input catalog, stages typed values with `setInput()`, and lets you watch the resulting face change immediately."
					bullets={[
						"The learning goal is to connect one control row to one runtime path and value.",
						"This section is strongest when paired with the renderer-data-model tutorial so the path/value contract stays visible.",
						"Once a reader understands one direct write here, the rest of the runtime surface gets easier to reason about.",
					]}
					validation={[
						"One control row produces one visible face change without needing hidden authoring context.",
						"You can point to the exact path and typed value behind the observed change.",
						"You can reproduce the same write in a small runtime component with `setInput()`.",
					]}
					code={"setInput(rigPath, { float: nextValue });"}
					sources={[
						{
							label: "RigControlPanel",
							href: "https://github.com/vizij-ai/vizij-ai.github.io/tree/main/src/components/demos/RigControlPanel.tsx",
						},
						{
							label: "@vizij/runtime-react",
							href: "https://github.com/vizij-ai/vizij-web/tree/main/packages/@vizij/runtime-react",
						},
					]}
					reproduceSteps={[
						"Open the renderer-data-model tutorial and run the micro-lab once.",
						"Match one visible slider or control row to one runtime path write.",
						"Reproduce the same write in a runtime app with `setInput()`.",
					]}
					nextHref="/tutorials/renderer-data-model/"
					nextLabel="Learn the path model"
				/>
			</div>
		</Section>
	);
}

function ExpressionsDemoSection() {
	return (
		<Section
			id="expressions"
			title="Expressions"
			subtitle="Trigger pose presets and preview the resulting expression on both Quori and Hugo outputs."
			variant="secondary"
		>
			<div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
				<ShowcaseRuntime
					namespace="expressions-panel"
					asset="quoriCurrentExtended"
					active
					visible
					autostart
					driveOrchestrator={false}
				>
					<article className={`${PREVIEW_CARD_CLASS} md:col-span-2`}>
						<div className="p-5">
							<PoseButtonPanel unstyled />
						</div>
					</article>
				</ShowcaseRuntime>

				{[
					{
						namespace: "expressions-quori-face",
						asset: "quoriCurrentExtended" as const,
						label: "Expression preview · Quori",
						description: "Pose presets update Quori in real time.",
						drive: true,
					},
					{
						namespace: "expressions-hugo-face",
						asset: "hugoCurrentExtended" as const,
						label: "Expression preview · Hugo",
						description: "The same presets are mirrored to Hugo.",
						drive: false,
					},
				].map((face) => (
					<ShowcaseRuntime
						key={face.namespace}
						namespace={face.namespace}
						asset={face.asset}
						active
						visible
						autostart
						driveOrchestrator={face.drive}
					>
						<PoseRigMirrorBridge />
						<article className={PREVIEW_CARD_CLASS}>
							<div className={PREVIEW_MEDIA_CLASS}>
								<RuntimeFaceFrame mode="media" />
							</div>
							<div className="flex flex-col gap-1 p-5">
								<p className="text-xs font-semibold uppercase tracking-wider text-accent-base/80">
									{face.label}
								</p>
								<p className={`text-sm ${MUTED_TEXT_CLASS}`}>{face.description}</p>
							</div>
						</article>
					</ShowcaseRuntime>
				))}
			</div>
			<div className="mx-auto max-w-6xl">
				<DemoTeachingPanel
					title="Expression buttons are canonical pose-weight writes"
					summary="The expression surface makes one contract explicit: a friendly button can still resolve to a stable runtime path, and the same pose control can drive more than one face output."
					bullets={[
						"Expression buttons typically map to `rig/{face}/poses/{poseId}.weight`.",
						"Quori and Hugo mirroring only makes sense when the reader understands that the pose contract is portable but the rendered result is face-specific.",
						"This is the bridge between friendly UX and canonical runtime addressing.",
					]}
					validation={[
						"The same pose trigger produces a coherent expression on both preview faces.",
						"You can identify the canonical pose-weight path that the friendly button represents.",
						"You understand why the contract is portable even though the rendered result is face-specific.",
					]}
					code={"setInput(`rig/${faceId}/poses/${poseId}.weight`, { float: 1 });"}
					sources={[
						{
							label: "PoseButtonPanel",
							href: "https://github.com/vizij-ai/vizij-ai.github.io/tree/main/src/components/demos/PoseButtonPanel.tsx",
						},
						{
							label: "Rigging tutorial",
							href: "/tutorials/rigging-and-control/",
						},
					]}
					reproduceSteps={[
						"Trigger one pose button and watch both preview faces.",
						"Confirm the same button resolves to a canonical pose-weight write.",
						"Rebuild the behavior in the rigging-and-control tutorial against one authored face.",
					]}
					nextHref="/tutorials/rigging-and-control/"
					nextLabel="Learn rigging and control"
				/>
			</div>
		</Section>
	);
}

function GazeDemoSection() {
	return (
		<Section
			id="gaze"
			title="Gaze"
			subtitle="Drive gaze in real time from pointer input and click-triggered reactions."
			variant="tertiary"
		>
			<div className="mx-auto max-w-6xl">
				<ShowcaseRuntime
					namespace="gaze"
					asset="quoriCurrentExtended"
					active
					visible
					autostart
					driveOrchestrator
				>
					<article className={PREVIEW_CARD_CLASS}>
						<div className={PREVIEW_MEDIA_CLASS}>
							<GazeInteractiveFace enabled mode="media" />
						</div>
						<div className="flex flex-col gap-1 p-5">
							<p className="text-xs font-semibold uppercase tracking-wider text-accent-base/80">
								Cursor-reactive gaze
							</p>
							<p className={`text-sm ${MUTED_TEXT_CLASS}`}>
								Move the pointer to steer gaze. Click the face for random expression reactions.
							</p>
						</div>
					</article>
				</ShowcaseRuntime>
			</div>
			<div className="mx-auto max-w-6xl">
				<DemoTeachingPanel
					title="Pointer gaze fans out into four standard eye paths"
					summary="Gaze feels playful on the page, but the runtime contract is strict: one visible pointer gesture becomes four canonical standard-path writes, usually with clamped float values."
					bullets={[
						"Horizontal and vertical pointer motion each fan out to left and right eye paths.",
						"A reader should be able to reproduce this exact behavior with `useVizijRuntime()` and the standard gaze path family.",
						"Click reactions belong on top of the gaze model, not instead of it.",
					]}
					validation={[
						"Pointer motion produces paired left/right eye movement rather than one drifting eye.",
						"You can name the four standard gaze paths without looking them up mid-build.",
						"You can rebuild the behavior with clamped float writes in your own runtime component.",
					]}
					code={`setInput(\`rig/\${faceId}/standard/left_eye/pos/x\`, { float: x });
setInput(\`rig/\${faceId}/standard/right_eye/pos/x\`, { float: x });
setInput(\`rig/\${faceId}/standard/left_eye/pos/y\`, { float: y });
setInput(\`rig/\${faceId}/standard/right_eye/pos/y\`, { float: y });`}
					sources={[
						{
							label: "GazeInteractiveFace",
							href: "https://github.com/vizij-ai/vizij-ai.github.io/tree/main/src/components/demos/GazeInteractiveFace.tsx",
						},
						{
							label: "useMouseGaze reference",
							href: "https://github.com/vizij-ai/vizij-web/tree/main/apps/tutorial-fullscreen-face/src/hooks/useMouseGaze.ts",
						},
					]}
					reproduceSteps={[
						"Move the pointer and confirm the eyes respond as a paired left/right write.",
						"Open the renderer-data-model tutorial and inspect the same path family in the lab.",
						"Reuse the standard gaze path family in your own runtime component before adding reactions.",
					]}
					nextHref="/tutorials/renderer-data-model/"
					nextLabel="Build the gaze writes"
				/>
			</div>
		</Section>
	);
}

function VoiceDemoSection() {
	const [speechStatus, setSpeechStatus] = useState<SpeechStatus>("idle");
	const [showVoiceOverlay, setShowVoiceOverlay] = useState(true);
	const voicePointerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (speechStatus !== "idle") {
			setShowVoiceOverlay(false);
		}
	}, [speechStatus]);

	useEffect(() => {
		if (!showVoiceOverlay) return;
		const node = voicePointerRef.current;
		if (!node) return;
		const hideOverlay = () => setShowVoiceOverlay(false);
		node.addEventListener("pointermove", hideOverlay, { once: true });
		node.addEventListener("pointerdown", hideOverlay, { once: true });
		return () => {
			node.removeEventListener("pointermove", hideOverlay);
			node.removeEventListener("pointerdown", hideOverlay);
		};
	}, [showVoiceOverlay]);

	return (
		<Section
			id="voice"
			title="Voice"
			subtitle="Run text-to-speech and viseme playback with synchronized facial motion."
			variant="default"
		>
			<div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
				<ShowcaseRuntime
					namespace="voice"
					asset="hugoCurrentExtended"
					active
					visible
					autostart
					driveOrchestrator
				>
					<article className={PREVIEW_CARD_CLASS}>
						<div className={PREVIEW_MEDIA_CLASS}>
							<RuntimeFaceFrame
								mode="media"
								pointerTargetRef={voicePointerRef}
								overlay={showVoiceOverlay ? <SpeechOverlay status={speechStatus} /> : null}
							/>
						</div>
						<div className="flex flex-col gap-1 p-5">
							<p className="text-xs font-semibold uppercase tracking-wider text-accent-base/80">
								Voice reactive
							</p>
							<p className={`text-sm ${MUTED_TEXT_CLASS}`}>
								Visemes and rig cues drive synchronized facial motion.
							</p>
						</div>
					</article>

					<article className={PREVIEW_CARD_CLASS}>
						<div className="p-5">
							<VoicePanel status={speechStatus} onStatusChange={setSpeechStatus} enabled unstyled />
						</div>
					</article>
				</ShowcaseRuntime>
			</div>
			<div className="mx-auto max-w-6xl">
				<DemoTeachingPanel
					title="Voice needs an external service boundary"
					summary="This section only works when the dependency boundary is explicit. The face motion is driven by viseme events and audio playback, but the whole flow depends on configured API access."
					bullets={[
						"This demo defaults to the staging Vizij API and can be overridden with `VITE_API_URL` when needed.",
						"The reader still needs to know where the viseme timing originates and how the face should degrade when the service boundary is absent.",
						"This demo should route readers into the agent-face tutorial when they want to build the full live behavior stack.",
					]}
					validation={[
						"The demo either plays against the default staging API or clearly reports the service failure instead of faking success.",
						"You can identify the API boundary and the source surface that provides the viseme timing.",
						"You know to move into the agent-face tutorial for a full live integration build.",
					]}
					code={`// optional override in .env.local
VITE_API_URL="https://your-api-base.example.com"`}
					sources={[
						{
							label: "VoicePanel",
							href: "https://github.com/vizij-ai/vizij-ai.github.io/tree/main/src/components/demos/VoicePanel.tsx",
						},
						{
							label: "tutorial-agent-face",
							href: "https://github.com/vizij-ai/vizij-web/tree/main/apps/tutorial-agent-face",
						},
					]}
					reproduceSteps={[
						"Confirm the demo only works when the speech backend and env boundary are configured.",
						"Observe the difference between idle, loading, and active speech states on the face.",
						"Use the agent-face tutorial to build the full live stack with explicit degraded-state handling.",
					]}
					nextHref="/tutorials/agent-face/"
					nextLabel="Build the live agent face"
				/>
			</div>
		</Section>
	);
}

function ArchitectureSection() {
	return (
		<Section
			id="architecture"
			title="Shared demo architecture"
			subtitle="Every interactive section reuses the same core runtime boundary, asset discipline, and route-back pattern."
			variant="default"
		>
			<div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
				<FeatureCard
					title="Shared orchestrator namespaces"
					description="Each section mounts a dedicated runtime namespace while the active visible driver shares one orchestrator loop across the page."
					variant="default"
				/>
				<FeatureCard
					title="Shared bundle assets"
					description="Hugo and Quori bundles are reused intentionally so behavior comparisons stay about contracts, not asset drift."
					variant="default"
				/>
				<FeatureCard
					title="Composable behavior hooks"
					description="Idle, pose, gaze, and voice logic are layered as reusable runtime behaviors rather than hidden page magic."
					variant="default"
				/>
			</div>
			<div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
				<CallToActionButton href="/docs/architecture/" size="large" variant="secondary" fullWidth>
					Read Architecture
				</CallToActionButton>
				<CallToActionButton
					href="/docs/renderer-data-model/"
					size="large"
					variant="tertiary"
					fullWidth
				>
					Learn the Data Model
				</CallToActionButton>
				<CallToActionButton href="/tutorials/hello-face/" size="large" variant="primary" fullWidth>
					Start the Tutorial Path
				</CallToActionButton>
			</div>
		</Section>
	);
}

function CommunitySection() {
	return (
		<ConnectSection
			id="community"
			title="Community"
			subtitle="Contribute rigs, behaviors, and tooling to the Vizij ecosystem."
		>
			<CallToActionButton
				href="https://github.com/vizij-ai"
				size="large"
				variant="primary"
				fullWidth
			>
				Support Development
			</CallToActionButton>
			<CallToActionButton
				href="https://github.com/vizij-ai"
				size="large"
				variant="secondary"
				fullWidth
			>
				Contribute Code
			</CallToActionButton>
			<CallToActionButton href="https://semio.community" size="large" variant="tertiary" fullWidth>
				Follow Updates
			</CallToActionButton>
		</ConnectSection>
	);
}

function DemoRouteFooter({ demo }: { demo: DemoPageMeta }) {
	const demoIndex = DEMO_PAGES.findIndex((entry) => entry.id === demo.id);
	const prevDemo = demoIndex > 0 ? DEMO_PAGES[demoIndex - 1] : undefined;
	const nextDemo = demoIndex < DEMO_PAGES.length - 1 ? DEMO_PAGES[demoIndex + 1] : undefined;

	return (
		<section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
			<div className="grid gap-5 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,0.3fr)]">
				<div className="grid gap-5 md:grid-cols-2">
					{prevDemo ? (
						<a href={getDemoPageHref(prevDemo)} className={RAIL_CARD_CLASS}>
							<p
								className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-two"
								style={{ fontFamily: SANS_STACK }}
							>
								Previous demo
							</p>
							<p
								className="mt-3 text-xl leading-tight text-foreground"
								style={{ fontFamily: SERIF_STACK }}
							>
								{prevDemo.label}
							</p>
							<p
								className={`mt-2 text-sm leading-6 ${MUTED_TEXT_CLASS}`}
								style={{ fontFamily: SANS_STACK }}
							>
								{prevDemo.teaser}
							</p>
						</a>
					) : null}
					{nextDemo ? (
						<a href={getDemoPageHref(nextDemo)} className={RAIL_CARD_CLASS}>
							<p
								className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-two"
								style={{ fontFamily: SANS_STACK }}
							>
								Next demo
							</p>
							<p
								className="mt-3 text-xl leading-tight text-foreground"
								style={{ fontFamily: SERIF_STACK }}
							>
								{nextDemo.label}
							</p>
							<p
								className={`mt-2 text-sm leading-6 ${MUTED_TEXT_CLASS}`}
								style={{ fontFamily: SANS_STACK }}
							>
								{nextDemo.teaser}
							</p>
						</a>
					) : null}
				</div>

				<div className={SOFT_PANEL_CLASS}>
					<p
						className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-two"
						style={{ fontFamily: SANS_STACK }}
					>
						Keep moving
					</p>
					<p
						className={`mt-3 text-sm leading-7 ${MUTED_TEXT_CLASS}`}
						style={{ fontFamily: SANS_STACK }}
					>
						Route back to the full demos index or jump into the underlying docs and tutorials when
						you want the implementation contract instead of the preview.
					</p>
					<div className="mt-5 flex flex-wrap gap-3">
						<DemoActionButton href="/demos/" label="All demos" variant="secondary" />
						<DemoActionButton href={demo.learnHref} label={demo.learnLabel} variant="primary" />
					</div>
				</div>
			</div>
		</section>
	);
}

function DemoDetailPage({ demoId }: { demoId: DemoPageId }) {
	const demo = getDemoPageById(demoId);

	return (
		<>
			<DemoDetailHeader demo={demo} />
			{demo.id === "controls" ? <ControlsDemoSection /> : null}
			{demo.id === "expressions" ? <ExpressionsDemoSection /> : null}
			{demo.id === "gaze" ? <GazeDemoSection /> : null}
			{demo.id === "voice" ? <VoiceDemoSection /> : null}
			<DemoRouteFooter demo={demo} />
		</>
	);
}

function DemoOverviewPage() {
	return (
		<>
			<OverviewHashRedirect />
			<DemosMasthead />
			<DemosRail />
			<ArchitectureSection />
			<CommunitySection />
		</>
	);
}

export default function DemosPage({ demoId }: DemosPageProps) {
	return (
		<DemoPageShell>
			{demoId ? <DemoDetailPage demoId={demoId} /> : <DemoOverviewPage />}
		</DemoPageShell>
	);
}
