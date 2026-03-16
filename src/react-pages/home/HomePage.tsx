import HeroHeader from "@/components/hero/HeroHeader";
import Section from "@/components/sections/Section";
import { url } from "@/utils/url";
import {
  CallToActionButton,
  FeatureCard,
  LinkCard,
} from "@semio-community/ecosystem-site-core";
import {
  Book,
  CodeSquare,
  Play,
  Rocket,
} from "@solar-icons/react-perf/LineDuotone";
import React from "react";

export interface HomePageProps {
  projectCount: number;
  featuredEventCount: number;
}

export default function HomePage({
  projectCount,
  featuredEventCount,
}: HomePageProps) {
  const routeCards = [
    {
      title: "Docs",
      href: url("/docs/"),
      description:
        "Learn the mental models, architecture, and deployment concepts before you start wiring runtime behavior.",
      icon: Book,
    },
    {
      title: "Tutorials",
      href: url("/tutorials/"),
      description:
        "Follow one maintained tutorial spine from Hello Face through authoring, runtime behavior, and deployment.",
      icon: CodeSquare,
    },
    {
      title: "Demos",
      href: url("/demos/"),
      description:
        "See heavier live runtime experiences and experiments without treating them as the canonical learning path.",
      icon: Play,
    },
  ];

  return (
    <div className="space-y-12">
      <HeroHeader
        title={
          <>
            <div className="inline-block">Vizij is an open ecosystem for </div>{" "}
            <div>
              <span className="text-accent-one">designing</span>,{" "}
              <span className="text-accent-two">animating</span>, and{" "}
              <span className="text-accent-three">deploying</span> rendered
              robot faces.
            </div>
          </>
        }
        description={
          <span className="text-sm">
            Vizij brings authoring, runtime control, expressive behavior, and
            deployment into one shared system.
          </span>
        }
        headingTag={"h2"}
        actions={[
          {
            label: "Read Docs",
            href: url("/docs/"),
            variant: "primary",
            indicatorText: undefined,
          },
          {
            label: "Follow Tutorials",
            href: url("/tutorials/"),
            variant: "secondary",
            indicatorText: undefined,
          },
          {
            label: "Explore Demos",
            href: url("/demos/"),
            variant: "tertiary",
            indicatorText: undefined,
          },
        ]}
      />

      <Section
        id="motivation"
        title="Why this matters"
        subtitle="Expressive robot faces sit at the intersection of HRI research, embodied AI, demos, education, and deployment."
        variant="secondary"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              title: "Motivation",
              icon: Rocket,
              description:
                "Rendered faces are one of the fastest ways to prototype expressive, controllable robot behavior across research and product contexts.",
            },
            {
              title: "Problem",
              icon: CodeSquare,
              description:
                "Most teams still stitch together custom pipelines for design, rigging, runtime control, animation, and deployment, which makes their work brittle and hard to share.",
            },
            {
              title: "Solution",
              icon: Book,
              description:
                "Vizij gives those teams a shared ecosystem so authored assets, controls, expressive behaviors, and deployment patterns can travel together.",
            },
          ].map((card) => (
            <FeatureCard
              key={card.title}
              title={card.title}
              description={card.description}
              variant="secondary"
              iconComponent={card.icon}
            />
          ))}
        </div>
      </Section>

      <Section
        id="paths"
        title="Where to go next"
        subtitle="Choose the right entrypoint based on whether you need concepts, a guided workflow, or live runtime examples."
        variant="primary"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-3">
          {routeCards.map((card) => (
            <LinkCard
              key={card.title}
              title={card.title}
              description={card.description}
              variant="primary"
              iconRender={(className) => <card.icon className={className} />}
              extraLinks={[{ label: `Open ${card.title}`, href: card.href }]}
            />
          ))}
        </div>
      </Section>

      {featuredEventCount > 0 ? (
        <Section
          id="events"
          title="Current event"
          subtitle="The HRI 2026 workshop and tutorial remains the live event surface, while the site now grows an evergreen docs and tutorial system around it."
          variant="secondary"
        >
          <div className="mx-auto max-w-4xl bg-special-lighter rounded-lg p-8 border border-special backdrop-blur-lg">
            <p className="text-sm leading-6 text-color-500">
              If you are attending the HRI 2026 workshop and tutorial, use the
              event page for schedule, logistics, and event-specific framing,
              then return to the tutorials hub for the canonical evergreen
              learning path.
            </p>
            <CallToActionButton
              href={url("/events/hri-2026-tutorial/")}
              variant="secondary"
              className="mt-5 w-full"
            >
              View the HRI 2026 event page
            </CallToActionButton>
          </div>
        </Section>
      ) : null}
    </div>
  );
}
