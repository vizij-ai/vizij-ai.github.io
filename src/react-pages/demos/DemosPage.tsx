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
import Section from "@/components/sections/Section";
import { HERO_FACES } from "@/demo-lib/heroFaces";
import type { SpeechStatus } from "@/demo-lib/speech";
import { useSectionInView } from "@/demo-lib/useSectionInView";
import ConnectSection from "@/react-pages/home/sections/ConnectSection";
import { FeatureCard } from "@semio-community/ecosystem-site-core";
import { CallToActionButton } from "@semio-community/ecosystem-site-core";
import { EmojiFunnySquare } from "@solar-icons/react-perf/LineDuotone";
import { OrchestratorProvider } from "@vizij/orchestrator-react";
import React, { useEffect, useRef, useState } from "react";

const PREVIEW_CARD_CLASS =
  "group flex h-full flex-col overflow-hidden rounded-lg bg-special-lighter backdrop-blur-lg";
const PREVIEW_MEDIA_CLASS =
  "aspect-video overflow-hidden bg-linear-to-br from-special-lighter to-special";

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
      <HeroHeader
        fullBleed
        showGlyphField={false}
        icon={<EmojiFunnySquare className="h-16 w-16 text-accent-two" />}
        title="Demos"
        description="Explore the Vizij runtime and tools for expressive behavior, gaze interactions, and voice lip-sync."
        actions={[
          { label: "Overview", href: "#hero", indicatorText: "2" },
          {
            label: "Rig Controls",
            href: "#controls",
            variant: "secondary",
          },
          { label: "Voice", href: "#voice", variant: "tertiary" },
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
                  <article className={`${PREVIEW_CARD_CLASS} md:col-span-2`}>
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
        </Section>
      </div>

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
    </OrchestratorProvider>
  );
}
