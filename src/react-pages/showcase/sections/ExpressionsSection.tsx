import { FaceFramePlaceholder } from "@/components/demos/FaceFramePlaceholder";
import { PoseButtonPanel } from "@/components/demos/PoseButtonPanel";
import { PoseRigMirrorBridge } from "@/components/demos/PoseRigMirrorBridge";
import { RuntimeFaceFrame } from "@/components/demos/RuntimeFaceFrame";
import { SectionIntro } from "@/components/demos/SectionIntro";
import { ShowcaseRuntime } from "@/components/demos/ShowcaseRuntime";
import { usePoseActivity } from "@/demo-lib/usePoseActivity";
import { useSectionInView } from "@/demo-lib/useSectionInView";
import type { SectionCopy } from "./SectionCopy";

export function ExpressionsSection({ copy }: { copy?: SectionCopy }) {
  const eyebrow = copy?.eyebrow ?? "Bundle Poses";
  const title = copy?.title ?? "Express emotions with Vizij.";
  const description =
    copy?.description ??
    "Package expressions, visemes, and gestures so rendered faces can express mood and intent easily.";

  const { ref, hasEntered, isVisible } = useSectionInView<HTMLElement>({
    threshold: 0.35,
    once: false,
  });
  const poseActive = usePoseActivity(1400);

  return (
    <section id="expressions" className="showcase-section" ref={ref}>
      <SectionIntro
        eyebrow={eyebrow}
        title={title}
        description={description}
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
                label="Expression kit · Quori"
                subtitle="Tap a preset or fire the hotkeys to see the expression"
              />
            }
          >
            <PoseRigMirrorBridge />
            <RuntimeFaceFrame
              variant="md"
              label="Expression kit · Quori"
              subtitle="Tap a preset or fire the hotkeys to see the expression"
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
                label="Expression kit · Hugo"
                subtitle="Tap a preset or fire the hotkeys to see the expression"
              />
            }
          >
            <PoseRigMirrorBridge />
            <RuntimeFaceFrame
              variant="md"
              label="Expression kit · Hugo"
              subtitle="Tap a preset or fire the hotkeys to see the expression"
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
