import React, { useMemo, useState, useRef, useEffect } from "react";
import { EventCard } from "@/components/cards/EventCard";
import Section from "@/components/sections/Section";
import type { ImageLike, ImagePolicy } from "@/utils/images";

type LinkMap = {
  website?: string;
  registration?: string;
  program?: string;
  proceedings?: string;
  recordings?: string;
};

type Location = {
  city?: string;
  country?: string;
  online?: boolean;
};

type ImageRef = ImageLike;

export type SerializedEvent = {
  id: string;
  data: {
    name?: string;
    displayName?: string;
    description?: string;
    type: string;
    startDate: string | Date;
    endDate?: string | Date;
    featured?: boolean;
    links?: LinkMap;
    location?: Location;
    imagePolicy?: ImagePolicy;
    images?: {
      logo?: ImageRef;
      hero?: ImageRef;
    };
  };
};

export interface EventsSectionsProps {
  // Provide all events (past, current, upcoming) as JSON string to avoid prop serialization issues.
  eventsPayload: string;
  // Optionally control how many items are initially shown in Featured and Past sections (no "Show more" UI here).
  initialFeaturedCount?: number;
  initialPastCount?: number;
  className?: string;
}

/**
 * EventsSections
 *
 * Client-rendered events listing that computes Featured / Upcoming / Past at runtime (request-time),
 * so event placements won't be frozen at build-time.
 *
 * How sections are determined:
 * - Featured: all "currently happening" events (regardless of .featured flag) PLUS any future events with data.featured === true.
 * - Upcoming: events with endDate >= now, sorted ascending by startDate and grouped by start year.
 * - Past: events with endDate < now, sorted descending by startDate.
 */
type ExpandableGridProps<T> = {
  items: T[];
  initialCount: number;
  viewAllText: string;
  renderItem: (item: T, index: number) => React.ReactNode;
};

const ExpandableGrid = <T extends { id: string }>({
  items,
  initialCount,
  viewAllText,
  renderItem,
}: ExpandableGridProps<T>) => {
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const didMountRef = useRef(false);
  const prevExpandedRef = useRef(expanded);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      prevExpandedRef.current = expanded;
      return;
    }
    // Only scroll when collapsing from expanded -> collapsed
    if (prevExpandedRef.current && !expanded && sectionRef.current) {
      const top =
        sectionRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
    prevExpandedRef.current = expanded;
  }, [expanded]);

  return (
    <div
      ref={sectionRef}
      data-expandable-section
      data-initial-count={initialCount.toString()}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        data-items-container
      >
        {items.map((item, index) => (
          <div
            key={(item as any).id ?? index}
            data-expandable-item
            data-index={index}
            className={index >= initialCount && !expanded ? "hidden" : ""}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {items.length > initialCount && (
        <div className="text-center mt-6">
          <button
            data-expand-button
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-base/10 hover:bg-accent-base/20 rounded-lg font-medium text-accent-base transition-all"
          >
            <span data-expand-text className={expanded ? "hidden" : ""}>
              {viewAllText}
            </span>
            <span data-collapse-text className={expanded ? "" : "hidden"}>
              Show Less
            </span>
            <svg
              className="w-4 h-4 transition-transform"
              data-expand-icon
              style={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                d="M12 15l-4-4h8l-4 4z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export const EventsSections: React.FC<EventsSectionsProps> = ({
  eventsPayload,
  initialFeaturedCount = 6,
  initialPastCount = 6,
  className,
}) => {
  const events = useMemo(
    () => JSON.parse(eventsPayload) as SerializedEvent[],
    [eventsPayload],
  );
  const now = useMemo(() => new Date(), []);

  const toDate = (d?: string | Date) =>
    d ? (d instanceof Date ? d : new Date(d)) : undefined;

  const computeStatus = (e: SerializedEvent) => {
    const start = toDate(e.data.startDate)!;
    const end = toDate(e.data.endDate) ?? start;
    if (now > end) return "past" as const;
    if (now >= start && now <= end) return "ongoing" as const;
    return "upcoming" as const;
  };

  const normalizeForCard = (e: SerializedEvent) => ({
    ...e,
    data: {
      ...e.data,
      startDate: toDate(e.data.startDate)!,
      endDate: toDate(e.data.endDate),
    },
  });

  const { featuredEvents, upcomingEvents, pastEvents, upcomingByYear } =
    useMemo(() => {
      const withStatus = events.map((e) => ({
        raw: e,
        status: computeStatus(e),
        start: toDate(e.data.startDate)!,
        end: toDate(e.data.endDate) ?? toDate(e.data.startDate)!,
        isFeaturedFlag: !!e.data.featured,
      }));

      // Current (happening now)
      const current = withStatus.filter((x) => x.status === "ongoing");

      // Future featured-only: featured events with future startDate
      const featuredOnlyFuture = withStatus.filter(
        (x) => x.isFeaturedFlag && x.start > now,
      );

      // Compose featured: all current (even if not flagged featured) + future featured-only
      // Remove duplicates by id, keeping current events first
      const featuredMap = new Map<string, (typeof withStatus)[number]>();
      for (const x of current) featuredMap.set(x.raw.id, x);
      for (const x of featuredOnlyFuture)
        if (!featuredMap.has(x.raw.id)) featuredMap.set(x.raw.id, x);

      const featuredEvents = Array.from(featuredMap.values())
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .map((x) => normalizeForCard(x.raw));

      // Upcoming: endDate >= now, sorted by start asc
      const upcomingEvents = withStatus
        .filter((x) => x.end >= now)
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .map((x) => normalizeForCard(x.raw));

      // Past: endDate < now, sorted by start desc
      const pastEvents = withStatus
        .filter((x) => x.end < now)
        .sort((a, b) => b.start.getTime() - a.start.getTime())
        .map((x) => normalizeForCard(x.raw));

      // Group upcoming by year of startDate
      const upcomingByYear = upcomingEvents.reduce(
        (acc: Record<string, SerializedEvent[]>, e) => {
          const y = (e.data.startDate as Date).getFullYear().toString();
          acc[y] = acc[y] || [];
          acc[y].push(e);
          return acc;
        },
        {},
      );

      // Sort each year's events by date asc (already asc, but ensure)
      Object.keys(upcomingByYear).forEach((year) => {
        const arr = upcomingByYear[year];
        if (arr) {
          arr.sort(
            (a, b) =>
              (a.data.startDate as Date).getTime() -
              (b.data.startDate as Date).getTime(),
          );
        }
      });

      return {
        featuredEvents,
        upcomingEvents,
        pastEvents,
        upcomingByYear,
      };
    }, [events, now]);

  const cls = (...parts: Array<string | false | undefined>) =>
    parts.filter(Boolean).join(" ");

  return (
    <div className={cls("flex flex-col gap-10", className)}>
      {/* Featured */}
      {featuredEvents.length > 0 && (
        <Section
          id="featured"
          title="Featured Events"
          subtitle="Highlighted events, including events happening right now"
          variant="primary"
        >
          <ExpandableGrid
            items={featuredEvents}
            initialCount={initialFeaturedCount}
            viewAllText={`View All ${featuredEvents.length} Featured & Current Events`}
            renderItem={(e) => (
              <EventCard key={e.id} eventId={e.id} data={e.data as any} />
            )}
          />
        </Section>
      )}

      {/* Upcoming */}
      {upcomingEvents.length > 0 && (
        <Section
          id="upcoming"
          title="Upcoming Events"
          subtitle="Meet with the community at these future gatherings"
          variant="secondary"
        >
          <div className="flex flex-col gap-8">
            {Object.keys(upcomingByYear)
              .sort()
              .map((year) => (
                <div key={year} className="mb-2">
                  <h3 className="text-xl md:text-2xl font-semibold mb-4 gradient-brand-text">
                    {year}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(upcomingByYear[year] ?? []).map((e) => (
                      <EventCard
                        key={e.id}
                        eventId={e.id}
                        data={e.data as any}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </Section>
      )}

      {/* Past */}
      {pastEvents.length > 0 && (
        <Section
          id="past"
          title="Past Events"
          subtitle="Explore our full archive of previous community events"
          variant="tertiary"
        >
          <ExpandableGrid
            items={pastEvents}
            initialCount={initialPastCount}
            viewAllText={`View All ${pastEvents.length} Past Events`}
            renderItem={(e) => (
              <EventCard key={e.id} eventId={e.id} data={e.data as any} />
            )}
          />
        </Section>
      )}
    </div>
  );
};

export default EventsSections;
