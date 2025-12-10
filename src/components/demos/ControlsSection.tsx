
import { SectionIntro } from "./SectionIntro";
import { RigControlPanel } from "./RigControlPanel";
import { RuntimeFaceFrame } from "./RuntimeFaceFrame";
import { FaceFramePlaceholder } from "./FaceFramePlaceholder";
import { useSectionInView } from "../../hooks/useSectionInView";
import { ShowcaseRuntime } from "./ShowcaseRuntime";

export function ControlsSection() {
  const { ref, hasEntered, isVisible } = useSectionInView<HTMLElement>({
    threshold: 0.4,
    once: false,
  });

  return (
    <section id="controls" className="showcase-section" ref={ref}>
      <SectionIntro
        eyebrow="Low-level control"
        title="Every feature is addressable."
        description="Dial any part of the face—from color and opacity to 3D position, rotation, and scale. Search for a feature, select it, then control it directly."
      />
      <ShowcaseRuntime
        namespace="controls"
        asset="hugoLatest"
        active={hasEntered}
        autostart={false}
        driveOrchestrator={false}
        visible={isVisible}
        label="Rig composer"
        fallback={<ControlsFallback />}
      >
        <div className="section-grid two-col">
          <RigControlPanel />
          <RuntimeFaceFrame
            variant="md"
            label="Feature overrides"
            subtitle="Blend shapes, transforms, materials—anything on the rig"
          />
        </div>
      </ShowcaseRuntime>
    </section>
  );
}

function ControlsFallback() {
  return (
    <div className="section-grid two-col">
      <div className="input-stage input-stage--placeholder">
        <p className="input-stage__title">Feature overrides</p>
        <p className="input-stage__subtitle">
          Vizij will boot this live feature editor once the section is in view.
        </p>
        <div className="input-stage__placeholder-bar" aria-hidden />
        <div className="input-stage__placeholder-bar" aria-hidden />
        <div className="input-stage__placeholder-grid" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </div>
      <FaceFramePlaceholder
        variant="md"
        label="Rig playground"
        subtitle="Scroll to initialise Vizij"
      />
    </div>
  );
}
