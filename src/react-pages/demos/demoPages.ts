export type DemoPageId = "controls" | "expressions" | "gaze" | "voice";
export type DemoPageVariant = "primary" | "secondary" | "tertiary" | "default";

export type DemoPageMeta = {
  id: DemoPageId;
  slug: string;
  label: string;
  shortLabel: string;
  surfaceLabel: string;
  teaser: string;
  title: string;
  subtitle: string;
  description: string;
  learnHref: string;
  learnLabel: string;
  variant: DemoPageVariant;
};

export const DEMO_PAGES: DemoPageMeta[] = [
  {
    id: "controls",
    slug: "controls",
    label: "Rig Controls",
    shortLabel: "Controls",
    surfaceLabel: "Surface 01",
    teaser: "Direct runtime writes",
    title: "Rig Controls Demo",
    subtitle:
      "Search and control low-level rig inputs while previewing updates in real time.",
    description:
      "Inspect direct rig-path writes against the live face output, then move into the renderer-data-model tutorial to reproduce the same contract in code.",
    learnHref: "/tutorials/renderer-data-model/",
    learnLabel: "Learn the path model",
    variant: "primary",
  },
  {
    id: "expressions",
    slug: "expressions",
    label: "Expressions",
    shortLabel: "Expressions",
    surfaceLabel: "Surface 02",
    teaser: "Canonical pose weights",
    title: "Expressions Demo",
    subtitle:
      "Trigger pose presets and preview the resulting expression on both Quori and Hugo outputs.",
    description:
      "Use canonical pose-weight writes to compare how one expression contract maps cleanly across different rendered faces.",
    learnHref: "/tutorials/rigging-and-control/",
    learnLabel: "Learn rigging and control",
    variant: "secondary",
  },
  {
    id: "gaze",
    slug: "gaze",
    label: "Gaze",
    shortLabel: "Gaze",
    surfaceLabel: "Surface 03",
    teaser: "Resolved eye controls",
    title: "Gaze Demo",
    subtitle:
      "Drive gaze in real time from pointer input and click-triggered reactions.",
    description:
      "Pointer motion fans out into canonical left and right eye writes, making the standard gaze path family observable before you rebuild it yourself.",
    learnHref: "/tutorials/renderer-data-model/",
    learnLabel: "Build the gaze writes",
    variant: "tertiary",
  },
  {
    id: "voice",
    slug: "voice",
    label: "Voice",
    shortLabel: "Voice",
    surfaceLabel: "Surface 04",
    teaser: "Speech service plus visemes",
    title: "Voice Demo",
    subtitle:
      "Run text-to-speech and viseme playback with synchronized facial motion.",
    description:
      "Trace the service boundary, viseme timing, and degraded states that sit underneath the synchronized face behavior.",
    learnHref: "/tutorials/agent-face/",
    learnLabel: "Build the live agent face",
    variant: "default",
  },
];

export function getDemoPageHref(idOrDemo: DemoPageId | DemoPageMeta) {
  const demo =
    typeof idOrDemo === "string" ? getDemoPageById(idOrDemo) : idOrDemo;
  return `/demos/${demo.slug}/`;
}

export function getDemoPageById(id: DemoPageId) {
  const demo = DEMO_PAGES.find((entry) => entry.id === id);
  if (!demo) {
    throw new Error(`Unknown demo page id: ${id}`);
  }
  return demo;
}

export function getDemoPageBySlug(slug: string) {
  return DEMO_PAGES.find((entry) => entry.slug === slug);
}
