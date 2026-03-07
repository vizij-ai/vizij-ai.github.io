import React from "react";
import { MissionSection as SharedMissionSection, type MissionSectionProps } from "@semio-community/ecosystem-site-core";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon, UserMultipleIcon } from "@hugeicons/core-free-icons";
import { CpuBolt } from "@solar-icons/react-perf/LineDuotone";

export type { MissionSectionProps };

const defaultPrimaryCopy = (
  <>
    Semio Community is a{" "}
    <span className="font-semibold">501(c)(3) nonprofit organization</span>{" "}
    facilitating community-driven robotics hardware, software, and research to
    foster reproducible, replicable, and generalizable science and reusable
    systems within human-robot interaction (HRI).
  </>
);

const defaultFeatures: MissionSectionProps["features"] = [
  {
    title: "Community-Driven",
    icon: (
      <HugeiconsIcon
        icon={UserMultipleIcon}
        className="w-12 h-12 mx-auto mb-3 text-accent-two"
      />
    ),
    description: "Fostering collaboration and knowledge-sharing across disciplines",
  },
  {
    title: "Human-Centered",
    icon: <CpuBolt className="w-12 h-12 mx-auto mb-3 text-accent-two" />,
    description: "Prioritizing ethical and accessible robotics and AI technologies",
  },
  {
    title: "Replicable",
    icon: (
      <HugeiconsIcon
        icon={BookOpen01Icon}
        className="w-12 h-12 mx-auto mb-3 text-accent-two"
      />
    ),
    description: "Promoting reproducible scientific research and reusable systems",
  },
];

const defaultSecondaryCopy = (
  <>
    Founded with the belief that the future of robotics lies in collaborative
    innovation, we work to break down barriers between research and
    application, making cutting-edge robotics technology accessible to
    researchers, developers, and educators worldwide.
  </>
);

export default function MissionSection(props: MissionSectionProps) {
  return (
    <SharedMissionSection
      subtitle="Advancing human-centered robotics and AI through community collaboration"
      primaryCopy={defaultPrimaryCopy}
      features={defaultFeatures}
      secondaryCopy={defaultSecondaryCopy}
      {...props}
    />
  );
}
