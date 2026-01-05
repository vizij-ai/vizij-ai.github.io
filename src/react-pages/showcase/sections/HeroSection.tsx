import { useCallback } from "react";
import { HeroPassiveBehavior } from "@/components/demos/HeroPassiveBehavior";
import { RuntimeFaceFrame } from "@/components/demos/RuntimeFaceFrame";
import { ShowcaseRuntime } from "@/components/demos/ShowcaseRuntime";
import { HERO_FACES } from "@/demo-lib/heroFaces";
import { useSectionInView } from "@/demo-lib/useSectionInView";
import type { SectionCopy } from "./SectionCopy";

export function HeroSection({ copy }: { copy?: SectionCopy }) {
  const eyebrow = copy?.eyebrow ?? "Vizij · Rendered robot faces";
  const title =
    copy?.title ?? "Design, animate, and deploy expressive rendered robot faces.";
  const headerDescription = copy?.description
    ? undefined
    : "Vizij is an open-source ecosystem for building and deploying rendered robot faces. It provides a standardized, modular rig and controller pipeline—covering gaze, visemes, and emotion—so faces behave consistently across hardware.";
  const noteDescription =
    copy?.description ??
    "Hugo from Peerbots, and Quori from the Quori Project are playing their idle behaviors mixing expressions and visemes while coordinating blinks and saccades to stay lifelike. Below, you’ll find focused demos that unpack the building blocks—rig controls, pose kits, gaze behaviors, and speech blending—that make this composite performance work.";
  const ctaPrimaryLabel = copy?.ctaPrimaryLabel ?? "Launch the demos";
  const ctaPrimaryHref = copy?.ctaPrimaryHref ?? "#controls";
  const ctaSecondaryLabel = copy?.ctaSecondaryLabel ?? "Read the docs";
  const ctaSecondaryHref =
    copy?.ctaSecondaryHref ?? "https://github.com/vizij-ai";

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
                src="/demos/assets/vizij-icon.png"
                alt="Vizij icon"
                className="hero-brand__icon"
                loading="lazy"
              />
            </span>
            <img
              src="/demos/assets/vizij.png"
              alt="Vizij wordmark"
              className="hero-brand__wordmark"
              loading="lazy"
            />
          </div>
          <p className="hero-brand__tagline">
            Design, animate, and deploy expressive rendered robot faces.
          </p>
          <div className="hero-brand__chips">
            <span className="hero-chip">Emotive facial expressions</span>
            <span className="hero-chip">Granular Gaze Control</span>
            <span className="hero-chip">Synchronized Lips and Speech</span>
            <span className="hero-chip">Web-native GLTF</span>
            <span className="hero-chip">Integrates with ROS 2</span>
          </div>
        </div>
        <div className="section-header">
          <p className="section-eyebrow">{eyebrow}</p>
          <h1 className="section-title">{title}</h1>
          {headerDescription && (
            <p className="section-description">{headerDescription}</p>
          )}
          <div className="hero-cta-row">
            <button
              type="button"
              className="cta"
              onClick={() =>
                ctaPrimaryHref.startsWith("#")
                  ? scrollToSection(ctaPrimaryHref.slice(1))
                  : (window.location.href = ctaPrimaryHref)
              }
            >
              {ctaPrimaryLabel}
            </button>
            <a
              className="ghost-button"
              href={ctaSecondaryHref}
              target="_blank"
              rel="noreferrer"
            >
              {ctaSecondaryLabel}
            </a>
            <a
              className="ghost-link"
              href="https://github.com/vizij-ai"
              target="_blank"
              rel="noreferrer"
            >
              ⭐ Star Vizij on GitHub
            </a>
          </div>
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
      <div className="section-description">
        <p>{noteDescription}</p>
      </div>
    </section>
  );
}
