import { ControlsSection } from "@/components/demos/ControlsSection";
import { ExpressionsSection } from "@/components/demos/ExpressionsSection";
import { GazePlaySection } from "@/components/demos/GazePlaySection";
import { VoiceSection } from "@/components/demos/VoiceSection";
import React from "react";
import { HeroSection } from "@/components/demos/HeroSection";
// import HeroSection from "@/react-pages/home/sections/HeroSection";
// import MissionSection from "@/react-pages/home/sections/MissionSection";
// import ProgramsSection from "@/react-pages/home/sections/ProgramsSection";
// import PartnersSection from "@/react-pages/home/sections/PartnersSection";
// import ConnectSection from "@/react-pages/home/sections/ConnectSection";
// import { CallToActionButton } from "@/components/ui/CallToActionButton";
// import { url } from "@/utils/url";

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
      <HeroSection />
      <ExpressionsSection/>
      <GazePlaySection/>
      <VoiceSection/>
      <ControlsSection/>
    </div>
  );
}
