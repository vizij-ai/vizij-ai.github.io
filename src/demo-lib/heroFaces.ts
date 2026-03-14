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
    label: "Hugo",
    subtitle: "The Vizij deployment for Peerbots",
    link: "https://peerbots.org",
    asset: "hugoCurrentExtended",
  },
  {
    namespace: "hero-quori",
    label: "Quori",
    subtitle: "The Vizij face for the Quori platform",
    link: "https://quori.org",
    asset: "quoriCurrentExtended",
  },
] as const;
