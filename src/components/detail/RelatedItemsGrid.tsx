import React from "react";
import { OrganizationCard } from "../cards/OrganizationCard";
import { EventCard } from "../cards/EventCard";
import { HardwareCard } from "../cards/HardwareCard";
import { SoftwareCard } from "../cards/SoftwareCard";
import { ResearchCard } from "../cards/ResearchCard";
import { PersonCard } from "../cards/PersonCard";
import { resolveLogoAsset, type ImagePolicy } from "@/utils/images";

export interface RelatedItem {
  id: string;
  data: {
    name?: string;
    title?: string;
    displayName?: string;
    shortDescription?: string;
    description?: string;
    abstract?: string;
    status?: string;
    type?: string;
    category?: string;
    featured?: boolean;
    images?: {
      hero?: { src: string } | string;
      logo?: { src: string } | string;
      logoUrl?: string;
    };
    imagePolicy?: ImagePolicy;
    avatar?: { src: string } | string;
    logo?: { src: string } | string;
    thumbnail?: { src: string } | string;
    banner?: { src: string } | string;
    links?: {
      github?: string;
      documentation?: string;
      demo?: string;
    };
  };
}

export interface RelatedItemsGridProps {
  title?: string;
  subtitle?: string;
  items: RelatedItem[];
  itemType?:
    | "hardware"
    | "software"
    | "people"
    | "partners"
    | "research"
    | "events";
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const RelatedItemsGrid: React.FC<RelatedItemsGridProps> = ({
  title = "Related Items",
  subtitle,
  items,
  itemType = "hardware",
  columns = 3,
  className = "",
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  const getItemTitle = (item: RelatedItem) => {
    return (
      item.data.name || item.data.title || item.data.displayName || item.id
    );
  };

  const getItemDescription = (item: RelatedItem) => {
    return (
      item.data.shortDescription ||
      item.data.description ||
      item.data.abstract ||
      ""
    );
  };

  const getItemImage = (item: RelatedItem) => {
    const data = item.data;
    if (typeof data.images?.hero === "string") return data.images.hero;
    if (data.images?.hero && typeof data.images.hero !== "string") {
      if (data.images.hero.src) return data.images.hero.src;
    } else if (typeof data.images?.hero === "string") {
      return data.images.hero;
    }
    if (data.avatar) {
      if (typeof data.avatar === "string") return data.avatar;
      if (data.avatar?.src) return data.avatar.src;
    }
    const customLogo = resolveLogoAsset(data.images);
    if (typeof customLogo === "string") return customLogo;
    if (customLogo && typeof customLogo !== "string") {
      if (customLogo?.src) return customLogo.src;
    } else if (typeof customLogo === "string") {
      return customLogo;
    }
    if (data.logo) {
      if (typeof data.logo === "string") return data.logo;
      if (data.logo?.src) return data.logo.src;
    }
    if (data.thumbnail) {
      if (typeof data.thumbnail === "string") return data.thumbnail;
      if (data.thumbnail?.src) return data.thumbnail.src;
    }
    if (data.banner) {
      if (typeof data.banner === "string") return data.banner;
      if (data.banner?.src) return data.banner.src;
    }
    return null;
  };

  const getItemUrl = (item: RelatedItem) => {
    return `/${itemType}/${item.id}`;
  };

  const gridColumns = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section className={`mt-12 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {subtitle && (
          <p className="text-color-600 dark:text-color-400">{subtitle}</p>
        )}
      </div>

      <div className={`grid ${gridColumns[columns]} gap-6`}>
        {items.map((item) => {
          const imageUrl = getItemImage(item);
          const itemTitle = getItemTitle(item);
          const description = getItemDescription(item);
          const url = getItemUrl(item);

          // Use the appropriate card component based on itemType
          switch (itemType) {
            case "partners":
              return (
                <OrganizationCard
                  key={item.id}
                  organizationId={item.id}
                  data={item.data as any}
                />
              );
            case "events":
              return (
                <EventCard
                  key={item.id}
                  eventId={item.id}
                  data={item.data as any}
                />
              );
            case "hardware":
              return (
                <HardwareCard
                  key={item.id}
                  hardwareId={item.id}
                  data={item.data as any}
                />
              );
            case "software":
              return (
                <SoftwareCard
                  key={item.id}
                  softwareId={item.id}
                  data={item.data as any}
                />
              );
            case "research":
              return (
                <ResearchCard
                  key={item.id}
                  researchId={item.id}
                  data={item.data as any}
                />
              );
            case "people":
              return (
                <PersonCard
                  key={item.id}
                  personId={item.id}
                  data={item.data as any}
                />
              );
            default:
              // Fallback - shouldn't happen if itemType is properly typed
              return null;
          }
        })}
      </div>
    </section>
  );
};
