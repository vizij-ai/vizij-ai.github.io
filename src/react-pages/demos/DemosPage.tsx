import { FaceFramePlaceholder } from "@/components/demos/FaceFramePlaceholder";
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
import { useSectionInView } from "@/demo-lib/useSectionInView";
import ConnectSection from "@/react-pages/home/sections/ConnectSection";
import { FeatureCard } from "@semio-community/ecosystem-site-core";
import { CallToActionButton } from "@semio-community/ecosystem-site-core";
import {
  CodeSquare,
  LinkRoundAngle,
} from "@solar-icons/react-perf/LineDuotone";
import { OrchestratorProvider } from "@vizij/orchestrator-react";
import React, { useEffect, useRef, useState } from "react";

const PREVIEW_CARD_CLASS =
  "group flex h-full flex-col overflow-hidden rounded-lg bg-special-lighter backdrop-blur-lg";
const PREVIEW_MEDIA_CLASS =
  "aspect-video overflow-hidden bg-linear-to-br from-special-lighter to-special";
const SERIF_STACK =
  '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif';
const SANS_STACK =
  '"Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif';

function DemoMapFigure() {
  return (
    <figure className="overflow-hidden rounded-[2rem] border border-accent-base/15 bg-surface/90 shadow-[0_24px_80px_-28px_rgba(24,24,27,0.35)]">
      <svg
        viewBox="0 0 1200 780"
        className="h-auto w-full"
        role="img"
        aria-label="Diagram showing the demos page as an observe-inspect-reproduce surface"
      >
        <defs>
          <linearGradient
            id="demo-bg"
            x1="78"
            y1="60"
            x2="1124"
            y2="720"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFF8EF" />
            <stop offset="1" stopColor="#EEF8F2" />
          </linearGradient>
          <filter
            id="demo-shadow"
            x="0"
            y="0"
            width="1200"
            height="780"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feDropShadow
              dx="0"
              dy="18"
              stdDeviation="18"
              floodColor="#2C241E"
              floodOpacity="0.12"
            />
          </filter>
          <linearGradient
            id="demo-arrow"
            x1="270"
            y1="380"
            x2="930"
            y2="380"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F97316" />
            <stop offset="1" stopColor="#0F766E" />
          </linearGradient>
        </defs>

        <rect width="1200" height="780" rx="40" fill="url(#demo-bg)" />
        <circle cx="1046" cy="126" r="128" fill="#F97316" fillOpacity="0.08" />
        <circle cx="166" cy="650" r="146" fill="#0F766E" fillOpacity="0.07" />

        <g filter="url(#demo-shadow)">
          <rect x="74" y="72" width="1052" height="636" rx="36" fill="#FFFDF8" />
        </g>

        <text
          x="118"
          y="130"
          fill="#B45309"
          fontFamily="'Avenir Next', 'Segoe UI', sans-serif"
          fontSize="16"
          fontWeight="700"
          letterSpacing="0.24em"
        >
          DEMO MAP
        </text>
        <text
          x="118"
          y="182"
          fill="#18181B"
          fontFamily="'Iowan Old Style', Georgia, serif"
          fontSize="44"
          fontWeight="700"
        >
          Observe behavior, then route it back to the source
        </text>
        <text
          x="118"
          y="220"
          fill="#57534E"
          fontFamily="'Avenir Next', 'Segoe UI', sans-serif"
          fontSize="21"
        >
          A demo page should be a field guide: what you are seeing, what paths
          or services drive it, and where to go to reproduce it.
        </text>

        {[
          {
            x: 122,
            y: 304,
            width: 174,
            height: 184,
            fill: "#FFF7ED",
            stroke: "#FDBA74",
            label: "OBSERVE",
            title: ["Rig", "Controls"],
            detail: "Direct runtime writes.",
            accent: "#9A3412",
          },
          {
            x: 328,
            y: 272,
            width: 174,
            height: 216,
            fill: "#FFFBEB",
            stroke: "#FCD34D",
            label: "OBSERVE",
            title: ["Pose", "Buttons"],
            detail: "Canonical pose weights.",
            accent: "#92400E",
          },
          {
            x: 534,
            y: 304,
            width: 174,
            height: 184,
            fill: "#F7FEE7",
            stroke: "#BEF264",
            label: "OBSERVE",
            title: ["Gaze", "Fan-out"],
            detail: "Four standard eye paths.",
            accent: "#4D7C0F",
          },
          {
            x: 740,
            y: 272,
            width: 174,
            height: 216,
            fill: "#ECFEFF",
            stroke: "#67E8F9",
            label: "OBSERVE",
            title: ["Voice", "Boundary"],
            detail: "Visemes plus service config.",
            accent: "#155E75",
          },
        ].map((item) => (
          <g key={`${item.title[0]}-${item.title[1]}`}>
            <rect
              x={item.x}
              y={item.y}
              width={item.width}
              height={item.height}
              rx="30"
              fill={item.fill}
              stroke={item.stroke}
              strokeWidth="2"
            />
            <text
              x={item.x + 28}
              y={item.y + 40}
              fill={item.accent}
              fontFamily="'Avenir Next', 'Segoe UI', sans-serif"
              fontSize="14"
              fontWeight="700"
              letterSpacing="0.18em"
            >
              {item.label}
            </text>
            <text
              x={item.x + 28}
              y={item.y + 86}
              fill="#111827"
              fontFamily="'Iowan Old Style', Georgia, serif"
              fontSize="34"
              fontWeight="700"
            >
              {item.title[0]}
            </text>
            <text
              x={item.x + 28}
              y={item.y + 120}
              fill="#111827"
              fontFamily="'Iowan Old Style', Georgia, serif"
              fontSize="34"
              fontWeight="700"
            >
              {item.title[1]}
            </text>
            <text
              x={item.x + 28}
              y={item.y + 154}
              fill="#44403C"
              fontFamily="'Avenir Next', 'Segoe UI', sans-serif"
              fontSize="16"
            >
              {item.detail}
            </text>
          </g>
        ))}

        <path
          d="M280 558C418 602 540 609 661 592C798 574 916 530 1010 470"
          stroke="url(#demo-arrow)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="6 14"
        />

        <g>
          <rect
            x="930"
            y="304"
            width="154"
            height="184"
            rx="30"
            fill="#ECFDF5"
            stroke="#5EEAD4"
            strokeWidth="2"
          />
          <text
            x="958"
            y="344"
            fill="#0F766E"
            fontFamily="'Avenir Next', 'Segoe UI', sans-serif"
            fontSize="14"
            fontWeight="700"
            letterSpacing="0.18em"
          >
            ROUTE BACK
          </text>
          <text
            x="958"
            y="390"
            fill="#111827"
            fontFamily="'Iowan Old Style', Georgia, serif"
            fontSize="34"
            fontWeight="700"
          >
            Docs
          </text>
          <text
            x="958"
            y="422"
            fill="#111827"
            fontFamily="'Iowan Old Style', Georgia, serif"
            fontSize="34"
            fontWeight="700"
          >
            &amp; Tutorials
          </text>
          <text
            x="958"
            y="456"
            fill="#44403C"
            fontFamily="'Avenir Next', 'Segoe UI', sans-serif"
            fontSize="16"
          >
            Inspect and reproduce.
          </text>
        </g>

        <rect x="118" y="610" width="964" height="60" rx="24" fill="#16171A" />
        <text
          x="154"
          y="648"
          fill="#FAF5E5"
          fontFamily="'Avenir Next', 'Segoe UI', sans-serif"
          fontSize="21"
        >
          The demo page stops being a showroom when every behavior has a named
          source surface, a representative write, and a next route.
        </text>
      </svg>
      <figcaption className="space-y-2 border-t border-accent-base/10 bg-surface-lighter/80 px-6 py-5">
        <p
          className="text-sm font-semibold text-foreground"
          style={{ fontFamily: SANS_STACK }}
        >
          Demo map
        </p>
        <p
          className="text-sm leading-6 text-color-500"
          style={{ fontFamily: SANS_STACK }}
        >
          Each behavior needs a route back into the exact doc or tutorial page
          that teaches the runtime contract behind it.
        </p>
      </figcaption>
    </figure>
  );
}

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
        ? "border border-accent-two/35 bg-surface/80 text-foreground hover:border-accent-two/55 hover:bg-accent-two/10"
        : "border border-accent-base/25 bg-transparent text-foreground hover:border-accent-base/45 hover:bg-accent-base/10";

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

function DemosMasthead() {
  const heroFaces = HERO_FACES.slice(0, 2);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 sm:pt-24 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
        <div className="space-y-6 rounded-[2.35rem] border border-[#ead7c3] bg-[linear-gradient(180deg,rgba(255,251,245,0.98),rgba(247,239,229,0.93))] p-6 shadow-[0_20px_64px_-34px_rgba(24,24,27,0.24)] sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="rounded-full border border-accent-two/25 bg-accent-two/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-two"
              style={{ fontFamily: SANS_STACK }}
            >
              Vizij Demos
            </span>
            <span
              className="rounded-full border border-accent-base/15 bg-surface/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-color-500"
              style={{ fontFamily: SANS_STACK }}
            >
              Observe, inspect, reproduce
            </span>
          </div>

          <div className="space-y-4">
            <h1
              className="max-w-4xl text-4xl leading-[1.02] text-[#211b16] sm:text-5xl lg:text-6xl"
              style={{ fontFamily: SERIF_STACK }}
            >
              Demos
            </h1>
            <p
              className="max-w-2xl text-base leading-8 text-[#5d5247] sm:text-lg"
              style={{ fontFamily: SANS_STACK }}
            >
              Move the face, trigger the behavior, and inspect the live runtime
              response. These demos are the observation surface for rig writes,
              pose weights, gaze fan-out, and service-bound voice behavior.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.7rem] border border-accent-base/15 bg-surface/90 p-5 shadow-[0_18px_52px_-30px_rgba(24,24,27,0.26)]">
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
                Live behavior first, then route back to the contract
              </p>
            </div>
            <div className="rounded-[1.7rem] border border-accent-base/15 bg-[#16171a] p-5 text-white shadow-[0_18px_52px_-30px_rgba(24,24,27,0.42)]">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f8c46d]"
                style={{ fontFamily: SANS_STACK }}
              >
                Expect from each section
              </p>
              <p
                className="mt-3 text-lg leading-tight"
                style={{ fontFamily: SERIF_STACK }}
              >
                One observed behavior, one runtime explanation, one reproduction
                route
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
                  The demos page should prove inspectability immediately, not
                  only after the reader reaches the first section.
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
              href="/docs/"
              label="Read Docs"
              variant="primary"
            />
            <DemoActionButton
              href="/tutorials/"
              label="Follow Tutorials"
              variant="secondary"
            />
            <DemoActionButton
              href="/docs/architecture/"
              label="Open Architecture"
              variant="tertiary"
            />
          </div>
        </div>

        <div className="space-y-5">
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
                <article className="overflow-hidden rounded-[2rem] border border-accent-base/15 bg-surface/92 shadow-[0_24px_80px_-28px_rgba(24,24,27,0.32)]">
                  <div className="aspect-[4/5] overflow-hidden bg-linear-to-br from-special-lighter to-special">
                    <RuntimeFaceFrame mode="media" />
                  </div>
                  <div className="space-y-2 border-t border-accent-base/10 bg-surface-lighter/80 px-5 py-4">
                    <p
                      className="text-sm font-semibold text-foreground"
                      style={{ fontFamily: SANS_STACK }}
                    >
                      {face.label}
                    </p>
                    <p
                      className="text-sm leading-6 text-color-500"
                      style={{ fontFamily: SANS_STACK }}
                    >
                      {face.subtitle}
                    </p>
                  </div>
                </article>
              </ShowcaseRuntime>
            ))}
          </div>

          <DemoMapFigure />
        </div>
      </div>
    </section>
  );
}

function DemosRail() {
  const items = [
    {
      href: "#controls",
      label: "Rig Controls",
      detail: "Direct runtime writes",
    },
    {
      href: "#expressions",
      label: "Expressions",
      detail: "Pose-weight buttons",
    },
    {
      href: "#gaze",
      label: "Gaze",
      detail: "Four standard eye paths",
    },
    {
      href: "#voice",
      label: "Voice",
      detail: "Service-bound viseme flow",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-[1.7rem] border border-accent-base/15 bg-surface/88 p-5 shadow-[0_18px_48px_-30px_rgba(24,24,27,0.24)] transition-transform hover:-translate-y-0.5 hover:border-accent-two/35"
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-two"
              style={{ fontFamily: SANS_STACK }}
            >
              Surface {index + 1}
            </p>
            <p
              className="mt-3 text-xl leading-tight text-foreground"
              style={{ fontFamily: SERIF_STACK }}
            >
              {item.label}
            </p>
            <p
              className="mt-2 text-sm leading-6 text-color-500"
              style={{ fontFamily: SANS_STACK }}
            >
              {item.detail}
            </p>
          </a>
        ))}
      </div>
    </section>
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
    <div className="mt-6 rounded-3xl border border-accent-base/20 bg-surface-lighter/45 p-6 backdrop-blur-md">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-two">
              Observe, inspect, reproduce
            </p>
            <h3 className="mt-3 text-xl font-semibold text-foreground">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-color-500">{summary}</p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-accent-base/15 bg-surface/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-two">
                Inspect
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-color-500">
                {bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <LinkRoundAngle className="mt-1 h-4 w-4 shrink-0 text-accent-two" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-accent-base/15 bg-special-lighter/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-two">
                Reproduce
              </p>
              <ol className="mt-4 space-y-3 text-sm leading-6 text-color-500">
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
          <div className="rounded-2xl border border-accent-base/15 bg-emerald-500/6 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-two">
              Validate
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-color-500">
              {validation.map((item) => (
                <li key={item} className="flex gap-3">
                  <LinkRoundAngle className="mt-1 h-4 w-4 shrink-0 text-accent-two" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-accent-base/15 bg-surface/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-two">
              Source surfaces
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {sources.map((source) => (
                <a
                  key={source.href}
                  href={source.href}
                  className="inline-flex items-center gap-2 rounded-full border border-accent-base/20 bg-accent-base/10 px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent-two/45 hover:bg-accent-two/10"
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
          <div className="overflow-hidden rounded-2xl border border-accent-base/15 bg-surface/70">
            <div className="flex items-center gap-3 border-b border-accent-base/15 bg-accent-base/10 px-4 py-3">
              <CodeSquare className="h-4 w-4 text-accent-two" />
              <p className="text-sm font-semibold text-foreground">
                Representative runtime write
              </p>
            </div>
            <pre className="overflow-x-auto rounded-none border-none bg-transparent">
              <code className="block px-4 py-4 text-[13px] leading-7 text-foreground">
                {code}
              </code>
            </pre>
          </div>
          <div className="rounded-2xl border border-accent-base/15 bg-surface/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-two">
              What to confirm
            </p>
            <p className="mt-3 text-sm leading-6 text-color-500">
              If you cannot point to the runtime write, the source surface, and
              the exact tutorial or doc route that reproduces the behavior, this
              section is still acting like a showcase instead of a technical
              demo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DemosPage() {
  const [speechStatus, setSpeechStatus] = useState<SpeechStatus>("idle");
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(true);
  const voicePointerRef = useRef<HTMLDivElement | null>(null);

  const controlsView = useSectionInView<HTMLDivElement>({
    threshold: 0.2,
    once: false,
  });
  const expressionsView = useSectionInView<HTMLDivElement>({
    threshold: 0.2,
    once: false,
  });
  const gazeView = useSectionInView<HTMLDivElement>({
    threshold: 0.2,
    once: false,
  });
  const voiceView = useSectionInView<HTMLDivElement>({
    threshold: 0.2,
    once: false,
  });

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
    <OrchestratorProvider autostart={false}>
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#fffdf8_0%,#fcfbf7_38%,#f7f4ee_100%)] pb-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-12rem] top-10 h-[32rem] w-[32rem] rounded-full bg-[#f97316]/10 blur-3xl" />
          <div className="absolute right-[-10rem] top-48 h-[28rem] w-[28rem] rounded-full bg-[#0f766e]/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-[#eab308]/8 blur-3xl" />
        </div>

        <div className="relative space-y-12">
          <DemosMasthead />
          <DemosRail />

          <div ref={controlsView.ref}>
            <Section
              id="controls"
              title="Rig Controls"
              subtitle="Search and control low-level rig inputs while previewing updates in real time."
              variant="primary"
            >
              <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
                {controlsView.hasEntered ? (
                  <ShowcaseRuntime
                    namespace="controls"
                    asset="hugoLatest"
                    active={controlsView.hasEntered}
                    visible={controlsView.isVisible}
                    autostart={controlsView.isVisible}
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
                        <p className="text-sm text-color-500">
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
                ) : (
                  <>
                    <article className={PREVIEW_CARD_CLASS}>
                      <div className={PREVIEW_MEDIA_CLASS}>
                        <FaceFramePlaceholder
                          variant="md"
                          label="Live face output"
                          subtitle="Runtime activates when this section is in view"
                        />
                      </div>
                      <div className="p-5 text-sm text-color-500">
                        Scroll to load the runtime preview.
                      </div>
                    </article>
                    <article className={PREVIEW_CARD_CLASS}>
                      <div className="p-5 text-sm text-color-500">
                        Scroll to load rig controls.
                      </div>
                    </article>
                  </>
                )}
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
                  code={`setInput(rigPath, { float: nextValue });`}
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
          </div>

          <div ref={expressionsView.ref}>
            <Section
              id="expressions"
              title="Expressions"
              subtitle="Trigger pose presets and preview the resulting expression on both Quori and Hugo outputs."
              variant="secondary"
            >
              <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
                {expressionsView.hasEntered ? (
                  <>
                    <ShowcaseRuntime
                      namespace="expressions-panel"
                      asset="quoriLatest"
                      active={expressionsView.hasEntered}
                      visible={expressionsView.isVisible}
                      autostart={expressionsView.isVisible}
                      driveOrchestrator={false}
                    >
                      <article
                        className={`${PREVIEW_CARD_CLASS} md:col-span-2`}
                      >
                        <div className="p-5">
                          <PoseButtonPanel unstyled />
                        </div>
                      </article>
                    </ShowcaseRuntime>

                    {[
                      {
                        namespace: "expressions-quori-face",
                        asset: "quoriLatest" as const,
                        label: "Expression preview · Quori",
                        description: "Pose presets update Quori in real time.",
                        drive: true,
                      },
                      {
                        namespace: "expressions-hugo-face",
                        asset: "hugoLatest" as const,
                        label: "Expression preview · Hugo",
                        description: "The same presets are mirrored to Hugo.",
                        drive: false,
                      },
                    ].map((face) => (
                      <ShowcaseRuntime
                        key={face.namespace}
                        namespace={face.namespace}
                        asset={face.asset}
                        active={expressionsView.hasEntered}
                        visible={expressionsView.isVisible}
                        autostart={expressionsView.isVisible}
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
                            <p className="text-sm text-color-500">
                              {face.description}
                            </p>
                          </div>
                        </article>
                      </ShowcaseRuntime>
                    ))}
                  </>
                ) : (
                  <>
                    <article className={`${PREVIEW_CARD_CLASS} md:col-span-2`}>
                      <div className="p-5 text-sm text-color-500">
                        Scroll to load expression controls.
                      </div>
                    </article>
                    <article className={PREVIEW_CARD_CLASS}>
                      <div className={PREVIEW_MEDIA_CLASS}>
                        <FaceFramePlaceholder
                          variant="md"
                          label="Expression preview · Quori"
                          subtitle="Runtime activates when this section is in view"
                        />
                      </div>
                      <div className="p-5 text-sm text-color-500">
                        Scroll to load Quori preview.
                      </div>
                    </article>
                    <article className={PREVIEW_CARD_CLASS}>
                      <div className={PREVIEW_MEDIA_CLASS}>
                        <FaceFramePlaceholder
                          variant="md"
                          label="Expression preview · Hugo"
                          subtitle="Runtime activates when this section is in view"
                        />
                      </div>
                      <div className="p-5 text-sm text-color-500">
                        Scroll to load Hugo preview.
                      </div>
                    </article>
                  </>
                )}
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
                  code={`setInput(\`rig/\${faceId}/poses/\${poseId}.weight\`, { float: 1 });`}
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
          </div>

          <div ref={gazeView.ref}>
            <Section
              id="gaze"
              title="Gaze"
              subtitle="Drive gaze in real time from pointer input and click-triggered reactions."
              variant="tertiary"
            >
              <div className="mx-auto max-w-6xl">
                {gazeView.hasEntered ? (
                  <ShowcaseRuntime
                    namespace="gaze"
                    asset="hugoLatest"
                    active={gazeView.hasEntered}
                    visible={gazeView.isVisible}
                    autostart={gazeView.isVisible}
                    driveOrchestrator
                  >
                    <article className={PREVIEW_CARD_CLASS}>
                      <div className={PREVIEW_MEDIA_CLASS}>
                        <GazeInteractiveFace
                          enabled={gazeView.isVisible}
                          mode="media"
                        />
                      </div>
                      <div className="flex flex-col gap-1 p-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-accent-base/80">
                          Cursor-reactive gaze
                        </p>
                        <p className="text-sm text-color-500">
                          Move the pointer to steer gaze. Click the face for
                          random expression reactions.
                        </p>
                      </div>
                    </article>
                  </ShowcaseRuntime>
                ) : (
                  <article className={PREVIEW_CARD_CLASS}>
                    <div className={PREVIEW_MEDIA_CLASS}>
                      <FaceFramePlaceholder
                        variant="lg"
                        label="Cursor-reactive gaze"
                        subtitle="Live demo activates on scroll"
                      />
                    </div>
                    <div className="p-5 text-sm text-color-500">
                      Scroll to load gaze interactions.
                    </div>
                  </article>
                )}
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
          </div>

          <div ref={voiceView.ref}>
            <Section
              id="voice"
              title="Voice"
              subtitle="Run text-to-speech and viseme playback with synchronized facial motion."
              variant="default"
            >
              <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
                {voiceView.hasEntered ? (
                  <ShowcaseRuntime
                    namespace="voice"
                    asset="hugoLatest"
                    active={voiceView.hasEntered}
                    visible={voiceView.isVisible}
                    autostart={voiceView.isVisible}
                    driveOrchestrator
                  >
                    <article className={PREVIEW_CARD_CLASS}>
                      <div className={PREVIEW_MEDIA_CLASS}>
                        <RuntimeFaceFrame
                          mode="media"
                          pointerTargetRef={voicePointerRef}
                          overlay={
                            showVoiceOverlay ? (
                              <SpeechOverlay status={speechStatus} />
                            ) : null
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-1 p-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-accent-base/80">
                          Voice reactive
                        </p>
                        <p className="text-sm text-color-500">
                          Visemes and rig cues drive synchronized facial motion.
                        </p>
                      </div>
                    </article>

                    <article className={PREVIEW_CARD_CLASS}>
                      <div className="p-5">
                        <VoicePanel
                          status={speechStatus}
                          onStatusChange={setSpeechStatus}
                          enabled={voiceView.isVisible}
                          unstyled
                        />
                      </div>
                    </article>
                  </ShowcaseRuntime>
                ) : (
                  <>
                    <article className={PREVIEW_CARD_CLASS}>
                      <div className={PREVIEW_MEDIA_CLASS}>
                        <FaceFramePlaceholder
                          variant="lg"
                          label="Voice reactive"
                          subtitle="Viseme timeline preview"
                        />
                      </div>
                      <div className="p-5 text-sm text-color-500">
                        Scroll to load voice preview.
                      </div>
                    </article>
                    <article className={PREVIEW_CARD_CLASS}>
                      <div className="p-5 text-sm text-color-500">
                        Scroll to load voice controls.
                      </div>
                    </article>
                  </>
                )}
              </div>
              <div className="mx-auto max-w-6xl">
                <DemoTeachingPanel
                  title="Voice needs an external service boundary"
                  summary="This section only works when the dependency boundary is explicit. The face motion is driven by viseme events and audio playback, but the whole flow depends on configured API access."
                  bullets={[
                    "This demo depends on `VITE_API_URL` and a working speech backend.",
                    "The reader needs to know where the viseme timing originates and how the face should degrade when the service is absent.",
                    "This demo should route readers into the agent-face tutorial when they want to build the full live behavior stack.",
                  ]}
                  validation={[
                    "The demo clearly stays degraded when the service boundary is absent instead of pretending to work.",
                    "You can identify the env boundary and the source surface that provides the viseme timing.",
                    "You know to move into the agent-face tutorial for a full live integration build.",
                  ]}
                  code={`// .env.local
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
          </div>

          <Section
            id="architecture"
            title="Shared demo architecture"
            subtitle="Every interactive section reuses the same core runtime boundary, asset discipline, and route-back pattern."
            variant="default"
          >
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
              <FeatureCard
                title="Isolated runtime namespaces"
                description="Each section mounts a dedicated runtime namespace so one behavior demo cannot pollute another."
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
              <CallToActionButton
                href="/docs/architecture/"
                size="large"
                variant="secondary"
                fullWidth
              >
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
              <CallToActionButton
                href="/tutorials/hello-face/"
                size="large"
                variant="primary"
                fullWidth
              >
                Start the Tutorial Path
              </CallToActionButton>
            </div>
          </Section>

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
            <CallToActionButton
              href="https://semio.community"
              size="large"
              variant="tertiary"
              fullWidth
            >
              Follow Updates
            </CallToActionButton>
          </ConnectSection>
        </div>
      </div>
    </OrchestratorProvider>
  );
}
