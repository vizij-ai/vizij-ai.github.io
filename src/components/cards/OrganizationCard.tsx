import type { FC } from "react";
import type { CollectionEntry } from "astro:content";
import { ItemCard } from "@/components/cards/ItemCard";
import { resolveCardImagePolicy, resolveLogoAsset } from "@/utils/images";

export interface OrganizationCardProps {
  organizationId: string;
  data: CollectionEntry<"organizations">["data"];
  className?: string;
}

export const OrganizationCard: FC<OrganizationCardProps> = ({
  organizationId,
  data,
  className: _className,
}) => {
  const typeLabel = data.type
    ? data.type.charAt(0).toUpperCase() + data.type.slice(1)
    : "";

  const cardImages = resolveCardImagePolicy({
    hero: data.images?.hero,
    logoOrAvatar: resolveLogoAsset(data.images),
    policy: data.imagePolicy,
  });

  return (
    <ItemCard
      title={data.shortName || data.name || organizationId}
      description={data.description}
      href={`/organizations/${organizationId}`}
      type="organizations"
      image={cardImages.image}
      imageAlt={data.name}
      logo={cardImages.logo}
      showFallbackAvatar={cardImages.showFallbackIcon}
      logoBackdrop={cardImages.logoBackdrop}
      category={typeLabel}
      featuredState={data.featured ? "featured" : "not-featured"}
      links={{
        website: data.links?.website,
        docs: data.links?.documentation,
      }}
    />
  );
};
