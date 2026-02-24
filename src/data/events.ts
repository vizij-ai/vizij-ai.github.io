import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { isDraftVisible } from "@/utils/drafts";

/** Get all events, sorted by start date (upcoming first) */
export async function getAllEvents(): Promise<CollectionEntry<"events">[]> {
  const events = await getCollection("events", ({ data }) => {
    // In production, exclude drafts. In development, show all.
    return isDraftVisible(data.draft, data.sites);
  });
  const now = new Date();

  return events.sort((a, b) => {
    // Featured events first
    if (a.data.featured !== b.data.featured) {
      return a.data.featured ? -1 : 1;
    }

    // Then upcoming events before past events
    const aUpcoming = a.data.startDate >= now;
    const bUpcoming = b.data.startDate >= now;

    if (aUpcoming !== bUpcoming) {
      return aUpcoming ? -1 : 1;
    }

    // Sort by date (upcoming: ascending, past: descending)
    if (aUpcoming) {
      return a.data.startDate.getTime() - b.data.startDate.getTime();
    } else {
      return b.data.startDate.getTime() - a.data.startDate.getTime();
    }
  });
}

/** Get only upcoming events */
export async function getUpcomingEvents(): Promise<
  CollectionEntry<"events">[]
> {
  const events = await getAllEvents();
  const now = new Date();
  return events.filter((event) => event.data.endDate >= now);
}

/** Get past events */
export async function getPastEvents(): Promise<CollectionEntry<"events">[]> {
  const events = await getAllEvents();
  const now = new Date();
  return events
    .filter((event) => event.data.endDate < now)
    .sort((a, b) => b.data.startDate.getTime() - a.data.startDate.getTime());
}

/** Get events happening now */
export async function getCurrentEvents(): Promise<CollectionEntry<"events">[]> {
  const events = await getAllEvents();
  const now = new Date();
  return events.filter(
    (event) => event.data.startDate <= now && event.data.endDate >= now,
  );
}

/** Get events filtered by type */
export async function getEventsByType(
  type:
    | "conference"
    | "workshop"
    | "hackathon"
    | "meetup"
    | "webinar"
    | "competition",
): Promise<CollectionEntry<"events">[]> {
  const events = await getAllEvents();
  return events.filter((event) => event.data.type === type);
}

/** Get only featured events */
export async function getFeaturedEvents(): Promise<
  CollectionEntry<"events">[]
> {
  const events = await getAllEvents();
  return events.filter((event) => event.data.featured);
}

/** Get events by location (city or country) */
export async function getEventsByLocation(location: {
  city?: string;
  country?: string;
}): Promise<CollectionEntry<"events">[]> {
  const events = await getAllEvents();

  return events.filter((event) => {
    if (location.city && location.country) {
      return (
        event.data.location.city.toLowerCase() ===
          location.city.toLowerCase() &&
        event.data.location.country.toLowerCase() ===
          location.country.toLowerCase()
      );
    } else if (location.city) {
      return (
        event.data.location.city.toLowerCase() === location.city.toLowerCase()
      );
    } else if (location.country) {
      return (
        event.data.location.country.toLowerCase() ===
        location.country.toLowerCase()
      );
    }
    return false;
  });
}

/** Get virtual/online events */
export async function getOnlineEvents(): Promise<CollectionEntry<"events">[]> {
  const events = await getAllEvents();
  return events.filter((event) => event.data.location.online);
}

/** Get events within a date range */
export async function getEventsByDateRange(
  startDate: Date,
  endDate: Date,
): Promise<CollectionEntry<"events">[]> {
  const events = await getAllEvents();
  return events.filter(
    (event) =>
      event.data.startDate >= startDate && event.data.startDate <= endDate,
  );
}

/** Get events by year */
export async function getEventsByYear(
  year: number,
): Promise<CollectionEntry<"events">[]> {
  const events = await getAllEvents();
  return events.filter((event) => event.data.startDate.getFullYear() === year);
}

/** Get events by month and year */
export async function getEventsByMonth(
  year: number,
  month: number,
): Promise<CollectionEntry<"events">[]> {
  const events = await getAllEvents();
  return events.filter((event) => {
    const eventDate = event.data.startDate;
    return (
      eventDate.getFullYear() === year && eventDate.getMonth() === month - 1
    );
  });
}

/** Get all unique event topics */
export async function getUniqueEventTopics(): Promise<string[]> {
  const events = await getAllEvents();
  const topics = events.flatMap((event) => event.data.topics);
  return [...new Set(topics)].sort();
}

/** Get all unique locations */
export async function getUniqueLocations(): Promise<
  { city: string; country: string }[]
> {
  const events = await getAllEvents();
  const locationStrings = events
    .filter((event) => !event.data.location.online)
    .map(
      (event) => `${event.data.location.city}|${event.data.location.country}`,
    );

  const uniqueLocations = [...new Set(locationStrings)].map((loc) => {
    const [city, country] = loc.split("|");
    return { city: city || "", country: country || "" };
  });

  return uniqueLocations
    .filter((loc) => loc.city && loc.country)
    .sort((a, b) => a.country.localeCompare(b.country));
}

/** Get event count by type */
export async function getEventCountByType(): Promise<Record<string, number>> {
  const events = await getAllEvents();
  return events.reduce(
    (acc, event) => {
      const type = event.data.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

/** Search events by query string */
export async function searchEvents(
  query: string,
): Promise<CollectionEntry<"events">[]> {
  const events = await getAllEvents();
  const lowerQuery = query.toLowerCase();

  return events.filter((event) => {
    return (
      event.data.name.toLowerCase().includes(lowerQuery) ||
      event.data.description.toLowerCase().includes(lowerQuery) ||
      event.data.topics.some((topic) =>
        topic.toLowerCase().includes(lowerQuery),
      ) ||
      event.data.location.city.toLowerCase().includes(lowerQuery) ||
      event.data.location.country.toLowerCase().includes(lowerQuery) ||
      event.data.roles.some((role) => role.includes(lowerQuery))
    );
  });
}

/** Get related events (by shared topics or type) */
export async function getRelatedEvents(
  currentEvent: CollectionEntry<"events">,
  limit: number = 3,
): Promise<CollectionEntry<"events">[]> {
  const allEvents = await getUpcomingEvents();

  // Filter out the current event
  const otherEvents = allEvents.filter((event) => event.id !== currentEvent.id);

  // Score each event based on shared attributes
  const scored = otherEvents.map((event) => {
    let score = 0;

    // Score for shared topics
    const sharedTopics = event.data.topics.filter((topic) =>
      currentEvent.data.topics.includes(topic),
    );
    score += sharedTopics.length * 3;

    if (event.data.type === currentEvent.data.type) {
      score += 2;
    }

    if (
      event.data.location.city === currentEvent.data.location.city &&
      event.data.location.country === currentEvent.data.location.country
    ) {
      score += 2;
    } else if (
      event.data.location.country === currentEvent.data.location.country
    ) {
      score += 1;
    }

    return { event, score };
  });

  // Sort by score and return top events
  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ event }) => event);
}

/** Group events by month for calendar view */
export async function groupEventsByMonth(
  events: CollectionEntry<"events">[],
): Promise<Record<string, CollectionEntry<"events">[]>> {
  const grouped: Record<string, CollectionEntry<"events">[]> = {};

  events.forEach((event) => {
    const monthKey = `${event.data.startDate.getFullYear()}-${String(
      event.data.startDate.getMonth() + 1,
    ).padStart(2, "0")}`;

    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    grouped[monthKey].push(event);
  });

  // Sort events within each month
  Object.keys(grouped).forEach((key) => {
    const events = grouped[key];
    if (events) {
      events.sort(
        (a, b) => a.data.startDate.getTime() - b.data.startDate.getTime(),
      );
    }
  });

  return grouped;
}

/** Filter events by multiple criteria */
export async function filterEvents(criteria: {
  type?: string;
  location?: { city?: string; country?: string };
  topics?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  includeOnline?: boolean;
}): Promise<CollectionEntry<"events">[]> {
  let events = await getAllEvents();

  if (criteria.type) {
    events = events.filter((event) => event.data.type === criteria.type);
  }

  if (criteria.location) {
    if (criteria.location.city) {
      events = events.filter(
        (event) =>
          event.data.location.city.toLowerCase() ===
          criteria.location!.city!.toLowerCase(),
      );
    }
    if (criteria.location.country) {
      events = events.filter(
        (event) =>
          event.data.location.country.toLowerCase() ===
          criteria.location!.country!.toLowerCase(),
      );
    }
  }

  if (criteria.topics && criteria.topics.length > 0) {
    const lowerTopics = criteria.topics.map((topic) => topic.toLowerCase());
    events = events.filter((event) =>
      lowerTopics.some((topic) =>
        event.data.topics.some((eventTopic) =>
          eventTopic.toLowerCase().includes(topic),
        ),
      ),
    );
  }

  if (criteria.dateFrom) {
    events = events.filter(
      (event) => event.data.startDate >= criteria.dateFrom!,
    );
  }

  if (criteria.dateTo) {
    events = events.filter((event) => event.data.startDate <= criteria.dateTo!);
  }

  if (criteria.includeOnline === false) {
    events = events.filter((event) => !event.data.location.online);
  }

  return events;
}

type EventRole =
  | "attendee"
  | "organizer"
  | "sponsor"
  | "exhibitor"
  | "speaker"
  | "panelist"
  | "host"
  | "winner"
  | "competitor";

/** Get events where Semio fills a specific role */
export async function getEventsByRole(
  role: EventRole,
): Promise<CollectionEntry<"events">[]> {
  const events = await getAllEvents();
  return events.filter((event) =>
    event.data.roles.includes(role),
  );
}

/** Get next N upcoming events */
export async function getNextEvents(
  limit: number = 5,
): Promise<CollectionEntry<"events">[]> {
  const upcoming = await getUpcomingEvents();
  return upcoming.slice(0, limit);
}