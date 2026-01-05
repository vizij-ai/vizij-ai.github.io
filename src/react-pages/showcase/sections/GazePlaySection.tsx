import { FaceFramePlaceholder } from "@/components/demos/FaceFramePlaceholder";
import { GazeInteractiveFace } from "@/components/demos/GazeInteractiveFace";
import { SectionIntro } from "@/components/demos/SectionIntro";
import { ShowcaseRuntime } from "@/components/demos/ShowcaseRuntime";
import { useSectionInView } from "@/demo-lib/useSectionInView";
import type { SectionCopy } from "./SectionCopy";

export function GazePlaySection({ copy }: { copy?: SectionCopy }) {
  const eyebrow = copy?.eyebrow ?? "Responsive presence";
  const title =
    copy?.title ??
    "Enable rendered faces to give people attention across every surface.";
  const description =
    copy?.description ??
    "Use passive gaze behaviors for idle animations or connect mouse, touch, or sensor data to control gaze for joint attention in real time.";

  const { ref, hasEntered, isVisible } = useSectionInView<HTMLElement>({
    threshold: 0.3,
    once: false,
  });

  return (
    <section id="gaze" className="showcase-section" ref={ref}>
      <SectionIntro
        eyebrow={eyebrow}
        title={title}
        description={description}
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
