import { useMemo, type FC } from "react";
import { ItemCard } from "@/components/cards/ItemCard";
import { getLocationString } from "@/utils/events";
import { getFormattedDateRanges, parseDateLocal } from "@/utils/date";
import { Calendar, MapPoint } from "@solar-icons/react-perf/LineDuotone";
import type { FeaturedState } from "../ui/FeaturedStar";
import {
  resolveCardImagePolicy,
  resolveLogoAsset,
  type ImageLike,
  type ImagePolicy,
} from "@/utils/images";

export interface EventCardProps {
  eventId: string;
  data: {
    name?: string;
    displayName?: string;
    description?: string;
    startDate: Date | string;
    endDate?: Date | string;
    type: string;
    images?: {
      logo?: ImageLike;
      hero?: ImageLike;
    };
    imagePolicy?: ImagePolicy;
    links?: {
      website?: string;
      registration?: string;
      program?: string;
      proceedings?: string;
      recordings?: string;
    };
    location?: {
      city?: string;
      country?: string;
      online?: boolean;
    };
    featured?: boolean;
  };
  className?: string;
}

export const EventCard: FC<EventCardProps> = ({ eventId, data }) => {
  // Determine status based on dates
  const now = new Date();
  const startDate = parseDateLocal(data.startDate);
  const endDate = data.endDate ? parseDateLocal(data.endDate) : startDate;

  let status = "upcoming";
  if (now >= startDate && now <= endDate) {
    status = "happening now";
  } else if (now > endDate) {
    status = "past";
  }

  // Build category from event type
  const category = `${data.type.charAt(0).toUpperCase() + data.type.slice(1)}`;

  const locationString = getLocationString(data.location);

  const dateString = getFormattedDateRanges(startDate, endDate);

  const featuredState: FeaturedState = useMemo(() => {
    if (status === "past" && data.featured) return "previously-featured";
    if (data.featured) return "featured";
    return "not-featured";
  }, [status, data.featured]);

  const cardImages = resolveCardImagePolicy({
    hero: data.images?.hero,
    logoOrAvatar: resolveLogoAsset(data.images),
    policy: data.imagePolicy,
  });

  return (
    <ItemCard
      title={data.displayName || data.name || eventId}
      // description={description}
      listItems={[
        {
          text: dateString,
          icon: (
            <Calendar className="text-accent-two mt-0.5 w-4 h-4 shrink-0" />
          ),
        },
        {
          text: locationString ?? "Unknown Location",
          icon: (
            <MapPoint className="text-accent-two mt-0.5 w-4 h-4 shrink-0" />
          ),
        },
      ]}
      href={`/events/${eventId}`}
      type="events"
      image={cardImages.image}
      imageAlt={data.name}
      logo={cardImages.logo}
      showFallbackAvatar={cardImages.showFallbackIcon}
      logoBackdrop={cardImages.logoBackdrop}
      status={status}
      category={category}
      featuredState={featuredState}
      links={{
        website: data.links?.website,
        registration: data.links?.registration,
      }}
    />
  );
};
