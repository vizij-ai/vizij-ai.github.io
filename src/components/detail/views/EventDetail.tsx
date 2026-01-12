import React from "react";
import type { CollectionEntry } from "astro:content";
import BaseDetailLayout from "@/components/detail/BaseDetailLayout";
import {
  DetailHero,
  type DetailHeroBadge,
} from "@/components/detail/DetailHero";
import ContentSection from "@/components/detail/ContentSection";
import SpecificationsList from "@/components/detail/SpecificationsList";
import LinkSection from "@/components/detail/LinkSection";
import BasicChip from "@/components/ui/BasicChip";
import { RelatedItemsGrid } from "@/components/detail/RelatedItemsGrid";
import { resolveDetailImagePolicy, resolveLogoAsset } from "@/utils/images";
import { getEventPreviewDescriptionText } from "@/utils/events";
import { parseDateLocal } from "@/utils/date";

type EventData = CollectionEntry<"events">["data"];

export interface EventDetailProps {
  data: EventData;
  badges?: DetailHeroBadge[];
  relatedEvents?: CollectionEntry<"events">[];
}

const TYPE_LABELS: Record<string, string> = {
  conference: "Conference",
  workshop: "Workshop",
  hackathon: "Hackathon",
  meetup: "Meetup",
  webinar: "Webinar",
  competition: "Competition",
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatRoleLabel(role: string) {
  return role
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function EventDetail({
  data,
  badges: providedBadges,
  relatedEvents = [],
}: EventDetailProps) {
  const detailImages = resolveDetailImagePolicy({
    hero: data.images?.hero,
    logoOrAvatar: resolveLogoAsset(data.images),
    policy: data.imagePolicy,
  });
  const startDate = parseDateLocal(data.startDate);
  const endDate = parseDateLocal(data.endDate ?? data.startDate);
  const currentDate = new Date();

  let eventStatus: "ongoing" | "upcoming" | "past" = "upcoming";
  if (currentDate > endDate) {
    eventStatus = "past";
  } else if (currentDate >= startDate && currentDate <= endDate) {
    eventStatus = "ongoing";
  }

  const badges =
    providedBadges ??
    (() => {
      const statusBadges: DetailHeroBadge[] = [];
      if (eventStatus === "ongoing") {
        statusBadges.push({
          text: "Ongoing",
          color: "green",
          variant: "solid",
        });
      } else if (eventStatus === "upcoming") {
        statusBadges.push({
          text: "Upcoming",
          color: "blue",
          variant: "solid",
        });
      } else {
        statusBadges.push({
          text: "Past Event",
          color: "gray",
          variant: "outline",
        });
      }

      if (typeof data.location?.online === "boolean") {
        statusBadges.push({
          text: data.location.online ? "Online" : "In Person",
          color: data.location.online ? "accent" : "green",
          variant: "outline",
        });
      }

      statusBadges.push({
        text: TYPE_LABELS[data.type] || data.type,
        color: "blue",
        variant: "outline",
      });

      return statusBadges;
    })();

  const featuredState = data.featured
    ? eventStatus === "past"
      ? "previously-featured"
      : "featured"
    : undefined;

  const descriptionText = getEventPreviewDescriptionText({
    startDate,
    endDate,
    description: data.description,
    location: data.location,
  });

  const eventLinks = { ...(data.links || {}) };
  if (eventStatus === "past") {
    delete eventLinks.registration;
  }

  const eventDetailsItems = [
    {
      label: "Start Date",
      value: formatDate(startDate),
      icon: "solar:calendar-date-line-duotone",
    },
    {
      label: "End Date",
      value: formatDate(endDate),
      icon: "solar:calendar-mark-line-duotone",
    },
  ];

  const locationItems = [];
  if (data.location?.venue) {
    locationItems.push({
      label: "Venue",
      value: data.location.venue,
      icon: "solar:buildings-line-duotone",
    });
  }
  const locationCity = data.location?.city;
  const locationCountry = data.location?.country;
  if (locationCity || locationCountry) {
    const locationValue =
      locationCity && locationCountry
        ? `${locationCity}, ${locationCountry}`
        : locationCity || locationCountry || "Unknown location";

    locationItems.push({
      label: "Location",
      value: locationValue,
      icon: "solar:map-point-line-duotone",
    });
  }
  if (data.location?.online) {
    locationItems.push({
      label: "Online Access",
      value: "Available",
      icon: "solar:laptop-minimalistic-line-duotone",
    });
  }
  if (data.location?.coordinates) {
    locationItems.push({
      label: "Map",
      value: "View on Google Maps",
      link: `https://maps.google.com/?q=${data.location.coordinates.lat},${data.location.coordinates.lng}`,
      external: true,
      icon: "solar:map-line-duotone",
    });
  }

  const roleEntries = (data.roles || []).map((role) => ({
    value: role,
    label: formatRoleLabel(role),
  }));

  return (
    <BaseDetailLayout
      hero={
        <DetailHero
          image={detailImages.image}
          title={data.name}
          subtitle={descriptionText}
          badges={badges}
          featuredState={featuredState}
          logo={detailImages.profile}
          entityType="event"
          showFallbackAvatar={detailImages.showFallbackIcon}
          logoBackdrop={detailImages.logoBackdrop}
        />
      }
      links={
        eventLinks && Object.keys(eventLinks).length > 0 ? (
          <LinkSection links={eventLinks} size="md" className="gap-1" />
        ) : null
      }
      description={
        data.description ? (
          <ContentSection title="ABOUT THE EVENT" content={data.description} />
        ) : null
      }
      metadata={
        <>
          <SpecificationsList
            title="EVENT DETAILS"
            items={eventDetailsItems}
            defaultItemIcon="solar:calendar-line-duotone"
          />
          <SpecificationsList
            title="LOCATION"
            items={locationItems}
            defaultItemIcon="solar:map-point-line-duotone"
          />
        </>
      }
      contributors={
        roleEntries.length > 0 && (
          <div className="bg-linear-to-br from-surface-lighter to-surface rounded-xl border border-accent-one/20 p-6">
            <h3 className="text-xs font-semibold mb-3 text-accent-base uppercase tracking-wider">
              SEMIO COMMUNITY ROLES
            </h3>
            <div className="flex flex-wrap gap-2">
              {roleEntries.map((role) => (
                <BasicChip
                  key={role.value}
                  text={role.label}
                  variant="primary"
                />
              ))}
            </div>
          </div>
        )
      }
      tags={
        data.topics && data.topics.length > 0 ? (
          <div className="bg-linear-to-br from-surface-lighter to-surface rounded-xl border border-accent-one/20 p-6">
            <h3 className="text-xs font-semibold mb-3 text-accent-base uppercase tracking-wider">
              TOPICS
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.topics.map((topic: string) => (
                <span
                  key={topic}
                  className="px-3 py-1.5 bg-accent-two/10 rounded-lg text-sm text-accent-base"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        ) : null
      }
      related={
        relatedEvents.length > 0 ? (
          <RelatedItemsGrid
            title="Related Events"
            subtitle="Similar upcoming and past events"
            items={relatedEvents.map((event) => ({
              id: event.id,
              data: {
                name: event.data.name,
                title: undefined,
                displayName: event.data.displayName,
                description: event.data.description,
                abstract: undefined,
                status: undefined,
                type: event.data.type,
                category: undefined,
                featured: event.data.featured,
                images: event.data.images,
                avatar: undefined,
                logo: undefined,
                thumbnail: undefined,
                banner: event.data.images?.hero,
                links: event.data.links,
                startDate: event.data.startDate,
                endDate: event.data.endDate,
                imagePolicy: event.data.imagePolicy,
                shortDescription: `${
                  TYPE_LABELS[event.data.type] || event.data.type
                }${event.data.location?.city ? ` • ${event.data.location.city}` : ""}`,
              },
            }))}
            itemType="events"
            columns={3}
          />
        ) : null
      }
    />
  );
}
