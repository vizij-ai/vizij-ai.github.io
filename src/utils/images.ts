import type { ImageMetadata } from "astro";

export type ImageLike =
  | ImageMetadata
  | {
      src: string;
      alt?: string;
    }
  | string
  | undefined;

export type ImagePolicy = {
  heroInCard: boolean;
  heroInDetail: boolean;
  logoOrAvatarInCard: boolean;
  logoOrAvatarInDetail: boolean;
  logoOrAvatarOnHeroInCard: boolean;
  logoOrAvatarOnHeroInDetail: boolean;
  logoOrAvatarBackdropInCard: boolean;
  logoOrAvatarBackdropInDetail: boolean;
  logoOrAvatarBackdropInList: boolean;
  showFallbackIcon: boolean;
};

const defaultImagePolicy: ImagePolicy = {
  heroInCard: true,
  heroInDetail: true,
  logoOrAvatarInCard: true,
  logoOrAvatarInDetail: true,
  logoOrAvatarOnHeroInCard: true,
  logoOrAvatarOnHeroInDetail: true,
  logoOrAvatarBackdropInCard: false,
  logoOrAvatarBackdropInDetail: false,
  logoOrAvatarBackdropInList: false,
  showFallbackIcon: true,
};

export const resolveImagePolicy = (
  policy?: Partial<ImagePolicy> | null,
): ImagePolicy => {
  if (!policy) return defaultImagePolicy;
  return { ...defaultImagePolicy, ...policy };
};

const normalizeImagePath = (value: string) => {
  if (!value) return value;
  let next = value;
  if (next.startsWith("@/")) {
    next = next.replace(/^@\//, "/src/");
  }
  if (next.startsWith("/assets/")) {
    next = `/src${next}`;
  }
  const assetsIndex = next.indexOf("/src/assets/");
  if (assetsIndex >= 0) {
    next = next.slice(assetsIndex);
  }
  const windowsAssetsIndex = next.indexOf("\\src\\assets\\");
  if (windowsAssetsIndex >= 0) {
    next = next.slice(windowsAssetsIndex).replace(/\\/g, "/");
  }
  return next;
};

export const resolveImageLike = (image?: ImageLike) => {
  if (!image) return undefined;
  if (typeof image === "string") return normalizeImagePath(image);
  return normalizeImagePath(image.src);
};

export type LogoContainer =
  | {
      logo?: ImageLike;
      logoUrl?: string;
    }
  | Record<string, unknown>
  | null
  | undefined;

export const resolveLogoAsset = (images?: LogoContainer): ImageLike => {
  if (!images) return undefined;
  const source =
    (images as { logo?: ImageLike })?.logo ??
    (images as { logoUrl?: string })?.logoUrl;
  return resolveImageLike(source);
};

type ImagePolicyInput = {
  hero?: ImageLike;
  logoOrAvatar?: ImageLike;
  policy?: Partial<ImagePolicy> | null;
};

export const resolveCardImagePolicy = ({
  hero,
  logoOrAvatar,
  policy,
}: ImagePolicyInput): {
  image?: ImageLike;
  logo?: ImageLike;
  showFallbackIcon: boolean;
  logoBackdrop: boolean;
} => {
  const resolvedPolicy = resolveImagePolicy(policy);
  const image = resolvedPolicy.heroInCard ? hero : undefined;
  let logo = resolvedPolicy.logoOrAvatarInCard ? logoOrAvatar : undefined;

  if (image && logo && !resolvedPolicy.logoOrAvatarOnHeroInCard) {
    logo = undefined;
  }

  return {
    image,
    logo,
    showFallbackIcon: resolvedPolicy.showFallbackIcon,
    logoBackdrop: resolvedPolicy.logoOrAvatarBackdropInCard,
  };
};

export const resolveDetailImagePolicy = ({
  hero,
  logoOrAvatar,
  policy,
}: ImagePolicyInput): {
  image?: ImageLike;
  profile?: ImageLike;
  showFallbackIcon: boolean;
  logoBackdrop: boolean;
} => {
  const resolvedPolicy = resolveImagePolicy(policy);
  const image = resolvedPolicy.heroInDetail ? hero : undefined;
  let profile = resolvedPolicy.logoOrAvatarInDetail ? logoOrAvatar : undefined;

  if (image && profile && !resolvedPolicy.logoOrAvatarOnHeroInDetail) {
    profile = undefined;
  }

  return {
    image,
    profile,
    showFallbackIcon: resolvedPolicy.showFallbackIcon,
    logoBackdrop: resolvedPolicy.logoOrAvatarBackdropInDetail,
  };
};
