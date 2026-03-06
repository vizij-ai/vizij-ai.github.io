import HeroHeader from "@/components/hero/HeroHeader";
import React from "react";
// import HeroSection from "@/react-pages/home/sections/HeroSection";
// import MissionSection from "@/react-pages/home/sections/MissionSection";
// import ProgramsSection from "@/react-pages/home/sections/ProgramsSection";
// import PartnersSection from "@/react-pages/home/sections/PartnersSection";
// import ConnectSection from "@/react-pages/home/sections/ConnectSection";
// import { CallToActionButton } from "@semio-community/ecosystem-site-core";
import { url } from "@/utils/url";

export interface HomePageProps {
  projectCount: number;
  featuredEventCount: number;
}

export default function HomePage({
  projectCount,
  featuredEventCount,
}: HomePageProps) {
  return (
    <div className="space-y-12">

      <HeroHeader
            title={<><div className="inline-block">Vizij is an open source ecosystem for </div> <div><span className="text-accent-one">designing</span>, <span className="text-accent-two">animating</span>, and <span className="text-accent-three">deploying</span> rendered robot faces.</div></>}
            description={
              <span className="text-sm">Documentation will be available soon.</span>
            }
            headingTag={"h2"}
            actions={[
              {
                label: "View Demos",
                href: url("/demos/"),
                variant: "primary",
                indicatorText: undefined,
              },
              {
                label: "Learn More on GitHub",
                href: "https://github.com/vizij-ai",
                variant: "tertiary",
                indicatorText: undefined,
              },
              {
                label: "HRI 2026 Tutorial Event",
                href: url("/events/hri-2026-tutorial/"),
                variant: "secondary",
                indicatorText: undefined,
              },
            ]}
          />

    </div>
  );
}
