import { ShowcaseRuntime } from "./ShowcaseRuntime";
import { SectionIntro } from "./SectionIntro";
import { GazeInteractiveFace } from "./GazeInteractiveFace";
import { FaceFramePlaceholder } from "./FaceFramePlaceholder";
import { useSectionInView } from "../../hooks/useSectionInView";

export function GazePlaySection() {
  const { ref, hasEntered, isVisible } = useSectionInView<HTMLElement>({
    threshold: 0.3,
    once: false,
  });

  return (
    <section id="gaze" className="showcase-section" ref={ref}>
      <SectionIntro
        eyebrow="Gaze tracking"
        title="Gaze at your cursor."
        description="Specify direct gaze location which translates under the hood from a point in space to eye shapes' movement and locations. "
      />
      <ShowcaseRuntime
        namespace="gaze"
        asset="hugoLatest"
        active={hasEntered}
        autostart={isVisible}
        driveOrchestrator
        visible={isVisible}
        hiddenStepHz={1}
        label="Gaze"
        fallback={<GazeFallback />}
      >
        <GazeInteractiveFace enabled={isVisible} />
      </ShowcaseRuntime>
    </section>
  );
}

function GazeFallback() {
  return (
    <FaceFramePlaceholder
      variant="lg"
      label="Cursor-reactive gaze"
      subtitle="Live demo activates on scroll"
      message="Scroll a bit further to wake this Vizij runtime."
    />
  );
}
