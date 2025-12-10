import { useCallback } from "react";
import { HERO_FACES } from "../../data/heroFaces";
import { ShowcaseRuntime } from "./ShowcaseRuntime";
import { RuntimeFaceFrame } from "./RuntimeFaceFrame";
import { HeroPassiveBehavior } from "./HeroPassiveBehavior";
import { useSectionInView } from "../../hooks/useSectionInView";

export function HeroSection() {
  const { ref, isVisible, hasEntered } = useSectionInView<HTMLElement>({
    threshold: 0.2,
    once: false,
  });
  const scrollToSection = useCallback((targetId: string) => {
    const node = document.getElementById(targetId);
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <section
      id="hero"
      className="showcase-section showcase-section--hero"
      ref={ref}
    >
      <div className="hero-header">
        <div className="hero-brand">
          <div className="hero-brand__identity">
            <span className="hero-brand__icon-shell">
              <img
                src="/assets/vizij-icon.png"
                alt="Vizij icon"
                className="hero-brand__icon"
                loading="lazy"
              />
            </span>
            <img
              src="/assets/vizij.png"
              alt="Vizij wordmark"
              className="hero-brand__wordmark"
              loading="lazy"
            />
          </div>
          <p className="hero-brand__tagline">
            Design, animate, and deploy expressive rendered robot faces.
          </p>
        </div>
      </div>
      <div className="hero-face-grid">
        {HERO_FACES.map((face, index) => (
          <ShowcaseRuntime
            namespace={face.namespace}
            asset={face.asset}
            key={face.namespace}
            active={hasEntered}
            visible={isVisible}
            driveOrchestrator={index === 0}
            label={face.label}
          >
            <HeroPassiveBehavior enabled={isVisible} />
            <RuntimeFaceFrame
              variant="sm"
              label={face.label}
              subtitle={face.subtitle}
              className="hero-face-card"
            />
          </ShowcaseRuntime>
        ))}
      </div>
      <div className="section-note section-note--hero">
        <p>
          Hugo from Peerbots, and Quori from the Quori Project are playing their idle behaviors 
          mixing expressions and vizemes while coordinating blinks and saccades to stay lifelike. Below, you’ll
          find focused demos that unpack the building blocks—rig controls, pose
          kits, gaze behaviors, and speech blending—that make this composite performance work.
        </p>
      </div>
    </section>
  );
}
