import type { FC } from "react";
import type { CollectionEntry } from "astro:content";
import { ItemCard } from "@/components/cards/ItemCard";
import { resolveCardImagePolicy } from "@/utils/images";

export interface PersonCardProps {
  personId: string;
  data: CollectionEntry<"people">["data"];
  className?: string;
}

export const PersonCard: FC<PersonCardProps> = ({
  personId,
  data,
  className: _className,
}) => {
  const fullName = data.name || personId;

  const description =
    data.bio ||
    (data.expertise && data.expertise.length > 0
      ? `Expertise: ${data.expertise.slice(0, 3).join(", ")}`
      : undefined);

  const websiteLink = data.links?.website;
  const githubLink = data.links?.github
    ? `https://github.com/${data.links.github}`
    : undefined;
  const cardImages = resolveCardImagePolicy({
    hero: data.images?.hero,
    logoOrAvatar: data.images?.avatar,
    policy: data.imagePolicy,
  });

  return (
    <ItemCard
      title={fullName}
      description={description}
      href={`/people/${personId}`}
      type="people"
      logo={cardImages.logo}
      image={cardImages.image}
      showFallbackAvatar={cardImages.showFallbackIcon}
      logoBackdrop={cardImages.logoBackdrop}
      category={data.title}
      featuredState={data.featured ? "featured" : "not-featured"}
      links={{
        website: websiteLink,
        github: githubLink,
      }}
    />
  );
};
