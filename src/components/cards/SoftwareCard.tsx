import type { FC } from "react";
import { ItemCard } from "@/components/cards/ItemCard";
import {
  resolveCardImagePolicy,
  resolveLogoAsset,
  type ImageLike,
  type ImagePolicy,
} from "@/utils/images";

type SoftwareCardData = {
  name?: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  status?: string;
  featured?: boolean;
  links?: {
    website?: string;
    github?: string;
    code?: string;
    documentation?: string;
    demo?: string;
    pypi?: string;
    npm?: string;
  };
  images?: {
    logo?: ImageLike;
    hero?: ImageLike;
    logoUrl?: string;
  };
  imagePolicy?: ImagePolicy;
};

export interface SoftwareCardProps {
  softwareId: string;
  data: SoftwareCardData;
  className?: string;
}

export const SoftwareCard: FC<SoftwareCardProps> = ({
  softwareId,
  data,
  className: _className,
}) => {
  const categoryLabel = data.category
    ? data.category.charAt(0).toUpperCase() + data.category.slice(1)
    : "";
  const cardImages = resolveCardImagePolicy({
    hero: data.images?.hero,
    logoOrAvatar: resolveLogoAsset(data.images),
    policy: data.imagePolicy,
  });

  return (
    <ItemCard
      title={data.name || softwareId}
      description={data.shortDescription || data.description}
      href={`/software/${softwareId}`}
      type="software"
      image={cardImages.image}
      imageAlt={data.name}
      logo={cardImages.logo}
      showFallbackAvatar={cardImages.showFallbackIcon}
      logoBackdrop={cardImages.logoBackdrop}
      status={data.status}
      category={categoryLabel}
      featuredState={data.featured ? "featured" : "not-featured"}
      links={{
        website: data.links?.website,
        github: data.links?.github || data.links?.code,
        docs: data.links?.documentation,
        demo: data.links?.demo,
        pypi: data.links?.pypi,
        npm: data.links?.npm,
      }}
    />
  );
};
