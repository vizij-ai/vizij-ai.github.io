import type { ShowcaseFaceAssetKey } from "@/demo-lib/faceAssets";

type HeroFace = {
  namespace: string;
  label: string;
  subtitle: string;
  link?: string;
  asset: ShowcaseFaceAssetKey;
};

export const HERO_FACES: readonly HeroFace[] = [
  {
    namespace: "hero-hugo",
    label: "Hugo · Product demo",
    subtitle: "Current extended rig tuned for in-app hosts",
    link: "https://peerbots.org",
    asset: "hugoCurrentExtended",
  },
  {
    namespace: "hero-quori",
    label: "Quori · Robot face",
    subtitle: "Current extended rig for embodied assistants",
    link: "https://quori.org",
    asset: "quoriCurrentExtended",
  },
] as const;
