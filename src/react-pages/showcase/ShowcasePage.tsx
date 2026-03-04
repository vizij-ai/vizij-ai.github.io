import { SectionMenu, type SectionMenuItem } from "@/components/demos/SectionMenu";
import { AboutSection } from "./sections/AboutSection";
import { ArchitectureSection } from "./sections/ArchitectureSection";
import { CommunitySection } from "./sections/CommunitySection";
import { ControlsSection } from "./sections/ControlsSection";
import { ExpressionsSection } from "./sections/ExpressionsSection";
import { FooterSection } from "./sections/FooterSection";
import { GazePlaySection } from "./sections/GazePlaySection";
import { HeroSection } from "./sections/HeroSection";
import { MissionSection } from "./sections/MissionSection";
import { PersonasSection } from "./sections/PersonasSection";
import { RoadmapSection } from "./sections/RoadmapSection";
import { StandardsSection } from "./sections/StandardsSection";
import { VoiceSection } from "./sections/VoiceSection";
import { useShowcaseCopy } from "./hooks/useShowcaseCopy";
import { RuntimeDebugOverlay } from "@/components/demos/RuntimeDebugOverlay";
import { OrchestratorProvider } from "@vizij/orchestrator-react";

import "./styles.css";

const SECTION_LINKS: SectionMenuItem[] = [
  { id: "hero", label: "Overview" },
  { id: "about", label: "About" },
  { id: "controls", label: "Rig Controls" },
  { id: "expressions", label: "Expressions" },
  { id: "gaze", label: "Gaze Play" },
  { id: "voice", label: "Voice" },
  { id: "personas", label: "Personas" },
  { id: "mission", label: "Mission" },
  { id: "architecture", label: "Architecture" },
  { id: "community", label: "Community" },
  { id: "roadmap", label: "Roadmap" },
  { id: "standards", label: "Standards" },
];

export default function ShowcasePage() {
  const { sections } = useShowcaseCopy();

  return (
    <OrchestratorProvider autostart={false}>
      <div className="showcase-page">
        <SectionMenu sections={SECTION_LINKS} />
        <div className="showcase-shell">
          <HeroSection copy={sections.hero} />
          <AboutSection copy={sections.about} />
          <ExpressionsSection copy={sections.expressions} />
          <GazePlaySection copy={sections.gaze} />
          <VoiceSection copy={sections.voice} />
          <ControlsSection copy={sections.controls} />
          <PersonasSection copy={sections.personas} />
          <MissionSection copy={sections.mission} />
          <ArchitectureSection copy={sections.architecture} />
          <CommunitySection copy={sections.community} />
          <RoadmapSection copy={sections.roadmap} />
          <StandardsSection copy={sections.standards} />
          <FooterSection />
        </div>
      </div>
      <RuntimeDebugOverlay />
    </OrchestratorProvider>
  );
}
