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
import HeroHeader from "@/components/hero/HeroHeader";
import PageNav from "@/components/nav/PageNav";
import Section from "@/components/sections/Section";
import { HERO_FACES } from "@/demo-lib/heroFaces";
import type { SpeechStatus } from "@/demo-lib/speech";
import { useSectionInView } from "@/demo-lib/useSectionInView";
import {
  DEMO_PAGES,
  type DemoPageId,
  type DemoPageMeta,
  getDemoPageById,
  getDemoPageHref,
} from "@/react-pages/demos/demoPages";
import ConnectSection from "@/react-pages/home/sections/ConnectSection";
import {
  CallToActionButton,
  FeatureCard,
  LinkCard,
} from "@semio-community/ecosystem-site-core";
import {
  EmojiFunnySquare,
  RoundAltArrowLeft,
  RoundAltArrowRight,
} from "@solar-icons/react-perf/LineDuotone";
import { OrchestratorProvider } from "@vizij/orchestrator-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { resolveSitePath, url } from "@/utils/url";

const PREVIEW_CARD_CLASS =
  "group flex h-full flex-col overflow-hidden rounded-lg bg-special-lighter backdrop-blur-lg";
const PREVIEW_MEDIA_CLASS =
  "aspect-video overflow-hidden bg-linear-to-br from-special-lighter to-special";

/* ─── Shared shell ─── */

function DemoPageShell({ children }: { children: ReactNode }) {
  return (
    <OrchestratorProvider autostart={false}>
      <div className="space-y-12">{children}</div>
    </OrchestratorProvider>
  );
}

/* ─── Overview page ─── */

function OverviewHashRedirect() {
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    const target: Record<string, string> = {
      controls: resolveSitePath(getDemoPageHref("controls")),
      expressions: resolveSitePath(getDemoPageHref("expressions")),
      gaze: resolveSitePath(getDemoPageHref("gaze")),
      voice: resolveSitePath(getDemoPageHref("voice")),
    };
    const href = hash ? target[hash] : undefined;
    if (href) {
      window.location.replace(href);
    }
  }, []);
  return null;
}

function DemoOverviewPage() {
  return (
    <>
      <OverviewHashRedirect />

      <HeroHeader
        fullBleed
        showGlyphField={false}
        icon={<EmojiFunnySquare className="h-16 w-16 text-accent-two" />}
        title="Demos"
        description="Explore the Vizij runtime and tools for expressive behavior, gaze interactions, and voice lip-sync."
        actions={[
          {
            label: "Rig Controls",
            href: resolveSitePath(getDemoPageHref("controls")),
          },
          {
            label: "Expressions",
            href: resolveSitePath(getDemoPageHref("expressions")),
            variant: "secondary",
          },
          {
            label: "Gaze",
            href: resolveSitePath(getDemoPageHref("gaze")),
            variant: "tertiary",
          },
          {
            label: "Voice",
            href: resolveSitePath(getDemoPageHref("voice")),
            variant: "primary",
          },
        ]}
      />

      <Section
        id="hero"
        title="Overview"
        subtitle="Vizij allows you to animate and control rendered faces in real time."
        variant="secondary"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
          {HERO_FACES.map((face, index) => (
            <article key={face.namespace} className={PREVIEW_CARD_CLASS}>
              <div className={PREVIEW_MEDIA_CLASS}>
                <ShowcaseRuntime
                  namespace={face.namespace}
                  asset={face.asset}
                  active
                  visible
                  autostart
                  driveOrchestrator={index === 0}
                >
                  <HeroPassiveBehavior enabled />
                  <RuntimeFaceFrame mode="media" />
                </ShowcaseRuntime>
              </div>
              <div className="flex flex-col gap-1 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent-base/80">
                  {face.label}
                </p>
                <p className="text-sm text-color-500">
                  {face.subtitle}
                  {face.link && (
                    <>
                      {" "}
                      <a
                        href={face.link}
                        className="text-link hover:ring-1 rounded-sm px-1"
                        target="_blank"
                        referrerPolicy="no-referrer"
                        rel="noreferrer"
                      >
                        Learn More
                      </a>
                    </>
                  )}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="demos"
        title="Choose a demo"
        subtitle="Each demo focuses on one runtime behavior."
        variant="primary"
      >
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {DEMO_PAGES.map((demo) => (
            <LinkCard
              key={demo.id}
              title={demo.label}
              description={demo.teaser}
              variant={demo.variant === "default" ? "primary" : demo.variant}
              extraLinks={[
                {
                  label: "Open demo",
                  href: resolveSitePath(getDemoPageHref(demo)),
                },
              ]}
            />
          ))}
        </div>
      </Section>

      <Section
        id="architecture"
        title="Architecture"
        subtitle="Runtime and orchestration layers reused in each interactive section."
        variant="default"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
          <FeatureCard
            title="Runtime Wrapper"
            description="Each section mounts a dedicated runtime namespace for isolation."
            variant="default"
          />
          <FeatureCard
            title="Shared Assets"
            description="Face bundles are reused across demos with explicit asset keys."
            variant="default"
          />
          <FeatureCard
            title="Behavior Hooks"
            description="Idle, pose, gaze, and voice logic are composed as reusable hooks."
            variant="default"
          />
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
    </>
  );
}

/* ─── Detail page chrome ─── */

function useDemoSiblings(demo: DemoPageMeta) {
  const demoIndex = DEMO_PAGES.findIndex((entry) => entry.id === demo.id);
  const prevDemo = demoIndex > 0 ? DEMO_PAGES[demoIndex - 1] : undefined;
  const nextDemo =
    demoIndex < DEMO_PAGES.length - 1 ? DEMO_PAGES[demoIndex + 1] : undefined;

  const toNavLink = (d: DemoPageMeta | undefined) =>
    d
      ? { label: d.label, href: getDemoPageHref(d), description: d.teaser }
      : undefined;

  return { prev: toNavLink(prevDemo), next: toNavLink(nextDemo) };
}

function DemoDetailHeader({ demo }: { demo: DemoPageMeta }) {
  const { prev, next } = useDemoSiblings(demo);

  return (
    <div className="space-y-8 pt-4">
      <nav className="flex items-center justify-between text-sm">
        <a
          href={resolveSitePath("/demos/")}
          className="inline-flex items-center gap-1.5 text-color-500 transition-colors hover:text-accent-two"
        >
          <RoundAltArrowLeft className="h-3.5 w-3.5" />
          Back to Demos
        </a>
        <div className="flex items-center gap-4">
          {prev && (
            <a
              href={resolveSitePath(prev.href)}
              className="inline-flex items-center gap-1.5 text-color-500 transition-colors hover:text-accent-two"
            >
              <RoundAltArrowLeft className="h-3.5 w-3.5" />
              {prev.label}
            </a>
          )}
          {next && (
            <a
              href={resolveSitePath(next.href)}
              className="inline-flex items-center gap-1.5 text-color-500 transition-colors hover:text-accent-two"
            >
              {next.label}
              <RoundAltArrowRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </nav>

      <HeroHeader
        showGlyphField={false}
        title={demo.title}
        description={demo.description}
        actions={[
          {
            label: demo.learnLabel,
            href: resolveSitePath(demo.learnHref),
            variant: "primary",
          },
          {
            label: "All Demos",
            href: url("/demos/"),
            variant: "secondary",
          },
        ]}
      />
    </div>
  );
}

function DemoRouteFooter({ demo }: { demo: DemoPageMeta }) {
  const { prev, next } = useDemoSiblings(demo);

  return (
    <div className="mx-auto max-w-4xl">
      <PageNav prev={prev} next={next} />
    </div>
  );
}

/* ─── Individual demo sections (matching main branch) ─── */

function ControlsDemoSection() {
  const view = useSectionInView<HTMLDivElement>({
    threshold: 0.2,
    once: false,
  });

  return (
    <div ref={view.ref}>
      <Section
        id="controls"
        title="Rig Controls"
        subtitle="Search and control low-level rig inputs while previewing updates in real time."
        variant="primary"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
          {view.hasEntered ? (
            <ShowcaseRuntime
              namespace="controls"
              asset="quoriCurrentExtended"
              active={view.hasEntered}
              visible={view.isVisible}
              autostart={view.isVisible}
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
      </Section>
    </div>
  );
}

function ExpressionsDemoSection() {
  const view = useSectionInView<HTMLDivElement>({
    threshold: 0.2,
    once: false,
  });

  return (
    <div ref={view.ref}>
      <Section
        id="expressions"
        title="Expressions"
        subtitle="Trigger pose presets and preview the resulting expression on a live Quori output."
        variant="secondary"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
          {view.hasEntered ? (
            <>
              <ShowcaseRuntime
                namespace="expressions-panel"
                asset="quoriCurrentExtended"
                active={view.hasEntered}
                visible={view.isVisible}
                autostart={view.isVisible}
                driveOrchestrator={false}
              >
                <article className={`${PREVIEW_CARD_CLASS} md:col-span-2`}>
                  <div className="p-5">
                    <PoseButtonPanel unstyled />
                  </div>
                </article>
              </ShowcaseRuntime>

              {(
                [
                  {
                    namespace: "expressions-quori-face",
                    asset: "quoriCurrentExtended" as const,
                    label: "Expression preview · Quori",
                    description: "Pose presets update Quori in real time.",
                    drive: true,
                  },
                ] as const
              ).map((face) => (
                <ShowcaseRuntime
                  key={face.namespace}
                  namespace={face.namespace}
                  asset={face.asset}
                  active={view.hasEntered}
                  visible={view.isVisible}
                  autostart={view.isVisible}
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
            </>
          )}
        </div>
      </Section>
    </div>
  );
}

function GazeDemoSection() {
  const view = useSectionInView<HTMLDivElement>({
    threshold: 0.2,
    once: false,
  });

  return (
    <div ref={view.ref}>
      <Section
        id="gaze"
        title="Gaze"
        subtitle="Drive gaze in real time from pointer input and click-triggered reactions."
        variant="tertiary"
      >
        <div className="mx-auto max-w-6xl">
          {view.hasEntered ? (
            <ShowcaseRuntime
              namespace="gaze"
              asset="quoriCurrentExtended"
              active={view.hasEntered}
              visible={view.isVisible}
              autostart={view.isVisible}
              driveOrchestrator
            >
              <article className={PREVIEW_CARD_CLASS}>
                <div className={PREVIEW_MEDIA_CLASS}>
                  <GazeInteractiveFace enabled={view.isVisible} mode="media" />
                </div>
                <div className="flex flex-col gap-1 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent-base/80">
                    Cursor-reactive gaze
                  </p>
                  <p className="text-sm text-color-500">
                    Move the pointer to steer gaze. Click the face for random
                    expression reactions.
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
      </Section>
    </div>
  );
}

function VoiceDemoSection() {
  const [speechStatus, setSpeechStatus] = useState<SpeechStatus>("idle");
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(true);
  const voicePointerRef = useRef<HTMLDivElement | null>(null);

  const view = useSectionInView<HTMLDivElement>({
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
    <div ref={view.ref}>
      <Section
        id="voice"
        title="Voice"
        subtitle="Run text-to-speech and viseme playback with synchronized facial motion."
        variant="default"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
          {view.hasEntered ? (
            <ShowcaseRuntime
              namespace="voice"
              asset="quoriCurrentExtended"
              active={view.hasEntered}
              visible={view.isVisible}
              autostart={view.isVisible}
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
                    enabled={view.isVisible}
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
      </Section>
    </div>
  );
}

/* ─── Detail page ─── */

function DemoDetailPage({ demoId }: { demoId: DemoPageId }) {
  const demo = getDemoPageById(demoId);

  return (
    <>
      <DemoDetailHeader demo={demo} />
      {demo.id === "controls" && <ControlsDemoSection />}
      {demo.id === "expressions" && <ExpressionsDemoSection />}
      {demo.id === "gaze" && <GazeDemoSection />}
      {demo.id === "voice" && <VoiceDemoSection />}
      <DemoRouteFooter demo={demo} />
    </>
  );
}

/* ─── Entrypoint ─── */

type DemosPageProps = {
  demoId?: DemoPageId;
};

export default function DemosPage({ demoId }: DemosPageProps) {
  return (
    <DemoPageShell>
      {demoId ? <DemoDetailPage demoId={demoId} /> : <DemoOverviewPage />}
    </DemoPageShell>
  );
}
