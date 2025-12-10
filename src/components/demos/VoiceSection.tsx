import { useEffect, useRef, useState } from "react";
import { ShowcaseRuntime } from "./ShowcaseRuntime";
import { SectionIntro } from "./SectionIntro";
import { RuntimeFaceFrame } from "./RuntimeFaceFrame";
import { VoicePanel } from "./VoicePanel";
import { SpeechOverlay } from "./SpeechOverlay";
import { FaceFramePlaceholder } from "./FaceFramePlaceholder";
import { useSectionInView } from "../../hooks/useSectionInView";
import { type SpeechStatus } from "../../data/speech";

export function VoiceSection() {
  const [speechStatus, setSpeechStatus] = useState<SpeechStatus>("idle");
  const [showOverlay, setShowOverlay] = useState(true);
  const facePointerRef = useRef<HTMLDivElement | null>(null);
  const { ref, hasEntered, isVisible } = useSectionInView<HTMLElement>({
    threshold: 0.3,
    once: false,
  });

  useEffect(() => {
    if (!showOverlay) {
      return;
    }
    const node = facePointerRef.current;
    if (!node) {
      return;
    }
    const hide = () => setShowOverlay(false);
    node.addEventListener("pointermove", hide, { once: true });
    node.addEventListener("pointerdown", hide, { once: true });
    return () => {
      node.removeEventListener("pointermove", hide);
      node.removeEventListener("pointerdown", hide);
    };
  }, [showOverlay]);

  useEffect(() => {
    if (speechStatus !== "idle") {
      setShowOverlay(false);
    }
  }, [speechStatus]);
  return (
    <section id="voice" className="showcase-section" ref={ref}>
      <SectionIntro
        eyebrow="Speech lip-sync"
        title="Synchronize speech and lip movements."
        description="Enter text to speak and watch as the mouth expresses timed visemes associated with your chosen text."
      />
      <ShowcaseRuntime
        namespace="voice"
        asset="hugoLatest"
        active={hasEntered}
        autostart={isVisible}
        driveOrchestrator
        visible={isVisible}
        hiddenStepHz={1}
        label="Voice"
        fallback={<VoiceFallback />}
      >
        <div className="section-grid two-col">
          <VoicePanel
            status={speechStatus}
            onStatusChange={setSpeechStatus}
            enabled={isVisible}
          />
          <RuntimeFaceFrame
            variant="lg"
            label="Voice reactive"
            subtitle="Polly timeline scaffold"
            pointerTargetRef={facePointerRef}
            overlay={
              showOverlay ? <SpeechOverlay status={speechStatus} /> : null
            }
          />
        </div>
      </ShowcaseRuntime>
    </section>
  );
}

function VoiceFallback() {
  return (
    <div className="section-grid two-col">
      <div className="feature-card feature-card--placeholder">
        <p className="feature-card__eyebrow">Speech pipeline</p>
        <h3>Voice demo warming up.</h3>
        <p className="feature-card__description">
          Amazon Polly + Vizij viseme playback boots as soon as the section is
          visible, keeping initial load snappy.
        </p>
      </div>
      <FaceFramePlaceholder
        variant="lg"
        label="Voice reactive"
        subtitle="Viseme playback scaffold"
      />
    </div>
  );
}
