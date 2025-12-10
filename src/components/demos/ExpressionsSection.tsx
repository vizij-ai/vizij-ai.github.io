import { ShowcaseRuntime } from "./ShowcaseRuntime";
import { SectionIntro } from "./SectionIntro";
import { RuntimeFaceFrame } from "./RuntimeFaceFrame";
import { PoseButtonPanel } from "./PoseButtonPanel";
import { FaceFramePlaceholder } from "./FaceFramePlaceholder";
import { PoseRigMirrorBridge } from "./PoseRigMirrorBridge";
import { useSectionInView } from "../../hooks/useSectionInView";
import { usePoseActivity } from "../../hooks/usePoseActivity";

export function ExpressionsSection() {
  const { ref, hasEntered, isVisible } = useSectionInView<HTMLElement>({
    threshold: 0.35,
    once: false,
  });
  const poseActive = usePoseActivity(1400);

  return (
    <section id="expressions" className="showcase-section" ref={ref}>
      <SectionIntro
        eyebrow="Facial expressions"
        title="Express emotions with Vizij."
        description="Define emotional facial expressions and smoothly animate from one to the next."
      />
      <div className="expression-stack">
        <ShowcaseRuntime
          namespace="expressions-quori"
          asset="quoriLatest"
          active={hasEntered}
          autostart={poseActive && isVisible}
          driveOrchestrator={false}
          visible={isVisible}
          hiddenStepHz={0}
          label="Expressions · panel"
          fallback={<ExpressionPanelFallback />}
        >
          <div className="expression-panel-shell">
            <PoseButtonPanel />
          </div>
        </ShowcaseRuntime>
        <div className="expression-face-grid">
          <ShowcaseRuntime
            namespace="expressions-quori-face"
            asset="quoriLatest"
            active={hasEntered}
            autostart={poseActive && isVisible}
            driveOrchestrator
            visible={isVisible}
            hiddenStepHz={poseActive ? 1 : 0}
            label="Expressions · Quori"
            fallback={
              <ExpressionFaceFallback
                label="Quori"
                subtitle="Tap a preset or fire the hotkeys to set the expression"
              />
            }
          >
            <PoseRigMirrorBridge />
            <RuntimeFaceFrame
              variant="md"
              label="Quori"
              subtitle="Tap a preset or fire the hotkeys to set the expression"
            />
          </ShowcaseRuntime>
          <ShowcaseRuntime
            namespace="expressions-hugo-face"
            asset="hugoLatest"
            active={hasEntered}
            autostart={poseActive && isVisible}
            driveOrchestrator={false}
            visible={isVisible}
            hiddenStepHz={0}
            label="Expressions · Hugo"
            fallback={
              <ExpressionFaceFallback
                label="Hugo"
                subtitle="Tap a preset or fire the hotkeys to set the expression"
              />
            }
          >
            <PoseRigMirrorBridge />
            <RuntimeFaceFrame
              variant="md"
              label="Hugo"
              subtitle="Tap a preset or fire the hotkeys to set the expression"
            />
          </ShowcaseRuntime>
        </div>
      </div>
    </section>
  );
}

function ExpressionPanelFallback() {
  return (
    <div className="expression-panel-shell">
      <div className="feature-card feature-card--placeholder">
        <p className="feature-card__eyebrow">Pose presets</p>
        <h3>Scroll to load the expression kit.</h3>
        <p className="feature-card__description">
          We spin up a dedicated Vizij runtime per section, so this panel
          awakens once it reaches the viewport.
        </p>
        <div className="pose-placeholder-grid" aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

type ExpressionFaceFallbackProps = {
  label: string;
  subtitle: string;
};

function ExpressionFaceFallback({
  label,
  subtitle,
}: ExpressionFaceFallbackProps) {
  return (
    <FaceFramePlaceholder variant="md" label={label} subtitle={subtitle} />
  );
}
