import type { FC } from "react";
import { ItemCard } from "@/components/cards/ItemCard";
import {
  resolveCardImagePolicy,
  resolveLogoAsset,
  type ImageLike,
  type ImagePolicy,
} from "@/utils/images";

type ResearchCardData = {
  title?: string;
  description?: string;
  type?: string;
  featured?: boolean;
  publishDate?: string | Date;
  year?: number;
  links?: {
    website?: string;
    program?: string;
    paper?: string;
    documentation?: string;
    pdf?: string;
    proceedings?: string;
    doi?: string;
    arxiv?: string;
    code?: string;
    github?: string;
    demo?: string;
    video?: string;
  };
  images?: {
    logo?: ImageLike;
    hero?: ImageLike;
    logoUrl?: string;
  };
  imagePolicy?: ImagePolicy;
};

export interface ResearchCardProps {
  researchId: string;
  data: ResearchCardData;
  className?: string;
}

export const ResearchCard: FC<ResearchCardProps> = ({
  researchId,
  data,
  className: _className,
}) => {
  const publishDate = data.publishDate ? new Date(data.publishDate) : undefined;
  const yearLabel =
    publishDate && !Number.isNaN(publishDate.getTime())
      ? publishDate.getFullYear()
      : ((data as { year?: number }).year ?? undefined);

  const typeLabel = data.type
    ? data.type.charAt(0).toUpperCase() + data.type.slice(1)
    : "";
  const category = [typeLabel, yearLabel].filter(Boolean).join(" • ");

  const docsLink =
    data.links?.paper ||
    data.links?.documentation ||
    data.links?.pdf ||
    data.links?.proceedings ||
    (data.links?.doi ? `https://doi.org/${data.links.doi}` : undefined) ||
    (data.links?.arxiv
      ? `https://arxiv.org/abs/${data.links.arxiv}`
      : undefined);

  const githubLink = data.links?.code || data.links?.github;
  const demoLink = data.links?.demo || data.links?.video;
  const websiteLink = data.links?.website || data.links?.program;

  const cardImages = resolveCardImagePolicy({
    hero: data.images?.hero,
    logoOrAvatar: resolveLogoAsset(data.images),
    policy: data.imagePolicy,
  });

  return (
    <ItemCard
      title={data.title || researchId}
      description={data.description}
      href={`/research/${researchId}`}
      type="research"
      image={cardImages.image}
      imageAlt={data.title}
      logo={cardImages.logo}
      showFallbackAvatar={cardImages.showFallbackIcon}
      logoBackdrop={cardImages.logoBackdrop}
      category={category}
      featuredState={data.featured ? "featured" : "not-featured"}
      links={{
        website: websiteLink,
        github: githubLink,
        demo: demoLink,
        docs: docsLink,
      }}
    />
  );
};
