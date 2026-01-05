import type { FC } from "react";
import type { CollectionEntry } from "astro:content";
import { ItemListElement } from "@/components/cards/ItemListElement";
import { resolveImagePolicy, resolveLogoAsset } from "@/utils/images";

export interface OrganizationListElementProps {
  organizationId: string;
  data?: CollectionEntry<"organizations">["data"];
  roleLabel?: string;
  className?: string;
}

export const OrganizationListElement: FC<OrganizationListElementProps> = ({
  organizationId,
  data,
  roleLabel,
  className,
}) => {
  const title = data?.shortName || data?.name || organizationId;
  const location =
    data?.location?.city || data?.location?.country
      ? [data?.location?.city, data?.location?.country]
          .filter(Boolean)
          .join(", ")
      : undefined;

  const description = (() => {
    const parts = [roleLabel, location].filter(Boolean) as string[];
    if (parts.length > 0) return parts.join(" · ");
    if (data?.description) return data.description;
    return undefined;
  })();
  const imagePolicy = resolveImagePolicy(data?.imagePolicy);

  return (
    <ItemListElement
      title={title}
      description={description}
      href={`/organizations/${organizationId}`}
      type="organizations"
      logo={resolveLogoAsset(data?.images)}
      imageAlt={title}
      logoBackdrop={imagePolicy.logoOrAvatarBackdropInList}
      featuredState={data?.featured ? "featured" : "not-featured"}
      className={className}
    />
  );
};

export default OrganizationListElement;
