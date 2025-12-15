import React from "react";
import HeroHeader from "@/components/hero/HeroHeader";
import { CallToActionButton } from "@/components/ui/CallToActionButton";
import Section from "@/components/sections/Section";
import { Calendar } from "@solar-icons/react-perf/LineDuotone";

export interface EventsPageProps {
  children?: React.ReactNode;
}

export default function EventsPage({ children }: EventsPageProps) {
  return (
    <>
      <HeroHeader
        fullBleed
        icon={<Calendar className="w-16 h-16 text-accent-two" />}
        title="Events"
        description="Learn more about Vizij at conferences, workshops, and training events."
        actions={[
          // { label: "Featured Events", href: "#featured" },
          // { label: "Upcoming Events", href: "#upcoming", variant: "secondary" },
          // { label: "Past Events", href: "#past", variant: "tertiary" },
        ]}
      />

      {children}

      {/* <Section id="events-contribute" title="Partner for an Event">
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-8 -mt-6 md:-mt-8">
            Planning a conference, workshop, or other community gathering?
            <br />
            <br className="md:hidden" />
            Partner with Semio Community to reach a broader robotics/AI
            audience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <CallToActionButton
              href="https://forms.gle/5iiaThSsGUMzXWsu6"
              size="large"
            >
              Request Event Services
            </CallToActionButton>
          </div>
        </div>
      </Section> */}
    </>
  );
}
