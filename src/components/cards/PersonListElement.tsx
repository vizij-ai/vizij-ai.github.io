import type { FC } from "react";
import type { CollectionEntry } from "astro:content";
import { ItemListElement } from "@/components/cards/ItemListElement";
import { resolveImagePolicy, type ImagePolicy } from "@/utils/images";

export interface PersonListElementProps {
  personId: string;
  data:
    | CollectionEntry<"people">["data"]
    | {
        name: string;
        honorific?: string;
        title?: string;
        featured?: boolean;
        affiliations?: Array<{
          organizationId: string;
          role?: string;
          department?: string;
          startDate?: Date | string;
          endDate?: Date | string | null;
          isPrimary?: boolean;
        }>;
        images?: CollectionEntry<"people">["data"]["images"];
        imagePolicy?: ImagePolicy;
      };
  affiliationLabel?: string;
  className?: string;
}

export const PersonListElement: FC<PersonListElementProps> = ({
  personId,
  data,
  affiliationLabel,
  className,
}) => {
  const fullName =
    (data.honorific ? `${data.honorific} ${data.name}` : data.name) || personId;

  // Prefer explicitly marked primary affiliation, then any current (no endDate).
  const currentAffiliation =
    data.affiliations?.find((aff) => aff.isPrimary) ??
    data.affiliations?.find((aff) => !aff.endDate);

  // Human-readable affiliation label (prefer prop; fallback to id)
  const affiliation = affiliationLabel || currentAffiliation?.organizationId;

  // Compose secondary line as "{affiliation} · {title}" when available (no separator if one is missing)
  const description = (() => {
    const parts = [affiliation, data.title].filter(Boolean) as string[];
    return parts.length ? parts.join(" · ") : undefined;
  })();
  const imagePolicy = resolveImagePolicy(data.imagePolicy);

  return (
    <ItemListElement
      title={fullName}
      description={description}
      href={`/people/${personId}`}
      type="people"
      logo={data.images?.avatar}
      imageAlt={fullName}
      logoBackdrop={imagePolicy.logoOrAvatarBackdropInList}
      featuredState={data.featured ? "featured" : "not-featured"}
      className={className}
    />
  );
};

export default PersonListElement;
