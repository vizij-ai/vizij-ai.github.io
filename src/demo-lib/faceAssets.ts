import { FACE_ROOT_BOUNDS } from "@/demo-lib/runtimeFace";
import { resolveSitePath } from "@/utils/url";
import type { VizijAssetBundle } from "@vizij/runtime-react";

const FACE_ASSET_PATHS = {
  hugoCurrentExtended: resolveSitePath(
    "/demos/assets/Hugo_Current_Extended.glb",
  ),
  quoriCurrentExtended: resolveSitePath(
    "/demos/assets/Quori_Current_Extended.glb",
  ),
  hugoLatest: resolveSitePath("/demos/assets/Hugo_Current_Extended.glb"),
  quoriLatest: resolveSitePath("/demos/assets/Quori_Current_Extended.glb"),
} as const;

export type ShowcaseFaceAssetKey = keyof typeof FACE_ASSET_PATHS;

const FACE_ASSET_GLB_BASE = {
  kind: "url" as const,
  aggressiveImport: true,
  rootBounds: FACE_ROOT_BOUNDS,
};

export const faceAssetBundleTemplate: VizijAssetBundle = {
  namespace: "vizij-showcase",
  glb: {
    ...FACE_ASSET_GLB_BASE,
    src: FACE_ASSET_PATHS.hugoCurrentExtended,
  },
  pose: {
    stageNeutralFilter: (_id, path) => !path.includes("/color/"),
  },
};

function createGlbConfig(asset: ShowcaseFaceAssetKey): VizijAssetBundle["glb"] {
  return {
    ...FACE_ASSET_GLB_BASE,
    src: FACE_ASSET_PATHS[asset],
  };
}

export function createShowcaseBundle(
  key: string,
  asset: ShowcaseFaceAssetKey = "hugoCurrentExtended",
): VizijAssetBundle {
  return {
    ...faceAssetBundleTemplate,
    namespace: `${faceAssetBundleTemplate.namespace}-${key}`,
    glb: createGlbConfig(asset),
  };
}
