import { type CollectionEntry, getCollection } from "astro:content";
import { isDraftVisible } from "@/utils/drafts";

type ResearchEntry = CollectionEntry<"research">;

type LegacyResearchFields = {
  year?: number;
  venue?: string;
  citations?: number;
};

function getLegacyField<K extends keyof LegacyResearchFields>(
  entry: ResearchEntry,
  key: K,
): LegacyResearchFields[K] {
  return (entry.data as LegacyResearchFields)[key];
}

function getPublishDate(entry: ResearchEntry): Date | null {
  const value = entry.data.publishDate;
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getPublishYear(entry: ResearchEntry): number | null {
  const publishDate = getPublishDate(entry);
  if (publishDate) {
    return publishDate.getFullYear();
  }
  const legacyYear = getLegacyField(entry, "year");
  return typeof legacyYear === "number" ? legacyYear : null;
}

function sortResearchEntries(entries: ResearchEntry[]): ResearchEntry[] {
  return [...entries].sort((a, b) => {
    if (a.data.featured !== b.data.featured) {
      return a.data.featured ? -1 : 1;
    }

    const aTime = getPublishDate(a)?.getTime() ?? Number.NEGATIVE_INFINITY;
    const bTime = getPublishDate(b)?.getTime() ?? Number.NEGATIVE_INFINITY;
    if (aTime !== bTime) {
      return bTime - aTime;
    }

    const aYear = getPublishYear(a) ?? Number.NEGATIVE_INFINITY;
    const bYear = getPublishYear(b) ?? Number.NEGATIVE_INFINITY;
    if (aYear !== bYear) {
      return bYear - aYear;
    }

    return a.data.title.localeCompare(b.data.title);
  });
}

async function loadResearchEntries(): Promise<ResearchEntry[]> {
  const entries = await getCollection("research", ({ data }) =>
    isDraftVisible(data.draft),
  );
  return sortResearchEntries(entries);
}

function normalizeTopics(entry: ResearchEntry): string[] {
  return entry.data.topics ?? [];
}

function normalizePublishDate(entry: ResearchEntry): Date | null {
  return getPublishDate(entry);
}

function getContributorIds(entry: ResearchEntry): string[] {
  return (entry.data.contributors ?? []).map((contributor) =>
    contributor.personId.toLowerCase(),
  );
}

/** Get all research entries */
export async function getAllResearch(): Promise<ResearchEntry[]> {
  return loadResearchEntries();
}

/** Get featured research entries */
export async function getFeaturedResearch(): Promise<ResearchEntry[]> {
  const entries = await loadResearchEntries();
  return entries.filter((entry) => entry.data.featured);
}

/** Get research entries filtered by type */
export async function getResearchByType(
  type: ResearchEntry["data"]["type"],
): Promise<ResearchEntry[]> {
  const entries = await loadResearchEntries();
  return entries.filter((entry) => entry.data.type === type);
}

/** Get research entries by publication year */
export async function getResearchByYear(
  year: number,
): Promise<ResearchEntry[]> {
  const entries = await loadResearchEntries();
  return entries.filter((entry) => getPublishYear(entry) === year);
}

/** Get research entries within a year range */
export async function getResearchByYearRange(
  startYear: number,
  endYear: number,
): Promise<ResearchEntry[]> {
  const entries = await loadResearchEntries();
  return entries.filter((entry) => {
    const entryYear = getPublishYear(entry);
    return entryYear !== null && entryYear >= startYear && entryYear <= endYear;
  });
}

/** Get research entries by topic */
export async function getResearchByTopic(
  topic: string,
): Promise<ResearchEntry[]> {
  const entries = await loadResearchEntries();
  const lower = topic.toLowerCase();
  return entries.filter((entry) =>
    normalizeTopics(entry).some((value) => value.toLowerCase() === lower),
  );
}

/** Get research entries by contributor (personId) */
export async function getResearchByContributor(
  personId: string,
): Promise<ResearchEntry[]> {
  const entries = await loadResearchEntries();
  const lower = personId.toLowerCase();
  return entries.filter((entry) => getContributorIds(entry).includes(lower));
}

/** Get research entries by organization involvement */
export async function getResearchByOrganization(
  organizationId: string,
): Promise<ResearchEntry[]> {
  const entries = await loadResearchEntries();
  const lower = organizationId.toLowerCase();
  return entries.filter((entry) =>
    (entry.data.organizations ?? []).some((org) =>
      org.organizationId.toLowerCase() === lower,
    ),
  );
}

/** Get research entries by venue (conference or journal) */
export async function getResearchByVenue(
  venue: string,
): Promise<ResearchEntry[]> {
  const entries = await loadResearchEntries();
  const lower = venue.toLowerCase();
  return entries.filter((entry) => {
    const value = getLegacyField(entry, "venue");
    return value ? value.toLowerCase().includes(lower) : false;
  });
}

/** Get research entries related to specific hardware */
export async function getResearchByHardware(
  hardwareId: string,
): Promise<ResearchEntry[]> {
  const entries = await loadResearchEntries();
  const lower = hardwareId.toLowerCase();
  return entries.filter((entry) =>
    entry.data.relatedHardware?.some(
      (hw) => hw.toLowerCase() === lower,
    ) ?? false,
  );
}

/** Get research entries related to specific software */
export async function getResearchBySoftware(
  softwareId: string,
): Promise<ResearchEntry[]> {
  const entries = await loadResearchEntries();
  const lower = softwareId.toLowerCase();
  return entries.filter((entry) =>
    entry.data.relatedSoftware?.some(
      (sw) => sw.toLowerCase() === lower,
    ) ?? false,
  );
}

/** Get recent research entries sorted by publish date */
export async function getRecentResearch(
  limit: number = 10,
): Promise<ResearchEntry[]> {
  const entries = await loadResearchEntries();
  const withTime = entries
    .map((entry) => {
      const publishDate = getPublishDate(entry);
      if (publishDate) {
        return { entry, time: publishDate.getTime() };
      }
      const year = getPublishYear(entry);
      if (year !== null) {
        return { entry, time: new Date(year, 0, 1).getTime() };
      }
      return null;
    })
    .filter(
      (value): value is { entry: ResearchEntry; time: number } => value !== null,
    )
    .sort((a, b) => b.time - a.time)
    .slice(0, limit)
    .map(({ entry }) => entry);

  return withTime;
}

/** Get all unique research topics */
export async function getUniqueResearchTopics(): Promise<string[]> {
  const entries = await loadResearchEntries();
  const topics = entries.flatMap((entry) => normalizeTopics(entry));
  return [...new Set(topics)].sort((a, b) => a.localeCompare(b));
}

/** Get all unique venues */
export async function getUniqueResearchVenues(): Promise<string[]> {
  const entries = await loadResearchEntries();
  const venues = entries
    .map((entry) => getLegacyField(entry, "venue"))
    .filter((venue): venue is string => Boolean(venue));
  return [...new Set(venues)].sort((a, b) => a.localeCompare(b));
}

/** Get all unique research contributors (people) */
export async function getUniqueResearchContributors(): Promise<
  Array<{ name: string; affiliation?: string; count: number }>
> {
  const entries = await loadResearchEntries();
  const contributorMap = new Map<string, { affiliation?: string; count: number }>();

  entries.forEach((entry) => {
    (entry.data.contributors ?? []).forEach((contributor) => {
      const existing = contributorMap.get(contributor.personId) ?? {
        count: 0,
      };
      existing.count += 1;
      if (!existing.affiliation && contributor.affiliationSnapshot) {
        existing.affiliation = contributor.affiliationSnapshot;
      }
      contributorMap.set(contributor.personId, existing);
    });
  });

  return Array.from(contributorMap.entries())
    .map(([personId, data]) => ({ name: personId, ...data }))
    .sort((a, b) => b.count - a.count);
}

export async function getUniqueResearchAuthors(): Promise<
  Array<{ name: string; affiliation?: string; count: number }>
> {
  return getUniqueResearchContributors();
}

/** Get study count by type */
export async function getResearchCountByType(): Promise<Record<string, number>> {
  const entries = await loadResearchEntries();
  return entries.reduce((acc, entry) => {
    acc[entry.data.type] = (acc[entry.data.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/** Get study count by year */
export async function getResearchCountByYear(): Promise<Record<number, number>> {
  const entries = await loadResearchEntries();
  return entries.reduce((acc, entry) => {
    const year = getPublishYear(entry);
    if (year !== null) {
      acc[year] = (acc[year] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);
}

/** Search research entries by query string */
export async function searchResearch(
  query: string,
): Promise<ResearchEntry[]> {
  const entries = await loadResearchEntries();
  const lowerQuery = query.toLowerCase();

  return entries.filter((entry) => {
    const titleMatch = entry.data.title.toLowerCase().includes(lowerQuery);
    const descriptionMatch = entry.data.description
      ?.toLowerCase()
      .includes(lowerQuery) ?? false;
    const topicMatch = normalizeTopics(entry).some((topic) =>
      topic.toLowerCase().includes(lowerQuery),
    );
    const contributorMatch = (entry.data.contributors ?? []).some(
      (contributor) =>
        contributor.personId.toLowerCase().includes(lowerQuery) ||
        contributor.affiliationSnapshot
          ?.toLowerCase()
          .includes(lowerQuery),
    );
    const organizationMatch = (entry.data.organizations ?? []).some((org) =>
      org.organizationId.toLowerCase().includes(lowerQuery) ||
      org.role.toLowerCase().includes(lowerQuery) ||
      org.note?.toLowerCase().includes(lowerQuery),
    );
    const venue = getLegacyField(entry, "venue");
    const venueMatch = venue ? venue.toLowerCase().includes(lowerQuery) : false;
    const hardwareMatch = entry.data.relatedHardware?.some((hw) =>
      hw.toLowerCase().includes(lowerQuery),
    ) ?? false;
    const softwareMatch = entry.data.relatedSoftware?.some((sw) =>
      sw.toLowerCase().includes(lowerQuery),
    ) ?? false;

    return (
      titleMatch ||
      descriptionMatch ||
      topicMatch ||
      contributorMatch ||
      organizationMatch ||
      venueMatch ||
      hardwareMatch ||
      softwareMatch
    );
  });
}

/** Get related research entries */
export async function getRelatedResearch(
  currentStudy: ResearchEntry,
  limit: number = 5,
): Promise<ResearchEntry[]> {
  const entries = await loadResearchEntries();
  const others = entries.filter((entry) => entry.id !== currentStudy.id);

  const currentTopics = new Set(normalizeTopics(currentStudy));
  const currentContributors = new Set(getContributorIds(currentStudy));
  const currentOrganizations = new Set(
    (currentStudy.data.organizations ?? []).map(
      (organization) => organization.organizationId,
    ),
  );
  const currentYear = getPublishYear(currentStudy);

  const scored = others.map((entry) => {
    let score = 0;

    const sharedTopics = normalizeTopics(entry).filter((topic) =>
      currentTopics.has(topic),
    );
    score += sharedTopics.length * 3;

    const contributorIds = getContributorIds(entry);
    const sharedContributors = contributorIds.filter((id) =>
      currentContributors.has(id),
    );
    score += sharedContributors.length * 4;

    const sharedOrganizations = (entry.data.organizations ?? []).filter((org) =>
      currentOrganizations.has(org.organizationId),
    );
    score += sharedOrganizations.length * 2;

    if (currentStudy.data.relatedHardware && entry.data.relatedHardware) {
      const sharedHardware = entry.data.relatedHardware.filter((hw) =>
        currentStudy.data.relatedHardware!.includes(hw),
      );
      score += sharedHardware.length * 2;
    }

    if (currentStudy.data.relatedSoftware && entry.data.relatedSoftware) {
      const sharedSoftware = entry.data.relatedSoftware.filter((sw) =>
        currentStudy.data.relatedSoftware!.includes(sw),
      );
      score += sharedSoftware.length * 2;
    }

    const entryYear = getPublishYear(entry);
    if (
      currentYear !== null &&
      entryYear !== null &&
      Math.abs(entryYear - currentYear) <= 1
    ) {
      score += 1;
    }

    return { entry, score };
  });

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => entry);
}

/** Group research entries by year */
export function groupResearchByYear(
  researchEntries: ResearchEntry[],
): Record<number, ResearchEntry[]> {
  const grouped: Record<number, ResearchEntry[]> = {};

  researchEntries.forEach((entry) => {
    const year = getPublishYear(entry);
    if (year === null) return;
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year]!.push(entry);
  });

  Object.values(grouped).forEach((group) => {
    group.sort((a, b) => {
      const bTime = normalizePublishDate(b)?.getTime() ?? 0;
      const aTime = normalizePublishDate(a)?.getTime() ?? 0;
      return bTime - aTime;
    });
  });

  return grouped;
}

/** Group research entries by type */
export function groupResearchByType(
  researchEntries: ResearchEntry[],
): Record<string, ResearchEntry[]> {
  const grouped: Record<string, ResearchEntry[]> = {};

  researchEntries.forEach((entry) => {
    if (!grouped[entry.data.type]) {
      grouped[entry.data.type] = [];
    }
    grouped[entry.data.type]!.push(entry);
  });

  return grouped;
}

/** Filter research entries by multiple criteria */
export async function filterResearch(criteria: {
  type?: string;
  yearFrom?: number;
  yearTo?: number;
  topics?: string[];
  contributors?: string[];
  venues?: string[];
  organizations?: string[];
  relatedHardware?: string[];
  relatedSoftware?: string[];
}): Promise<ResearchEntry[]> {
  let entries = await loadResearchEntries();

  if (criteria.type) {
    entries = entries.filter((entry) => entry.data.type === criteria.type);
  }

  if (criteria.yearFrom !== undefined) {
    entries = entries.filter((entry) => {
      const year = getPublishYear(entry);
      return year !== null && year >= criteria.yearFrom!;
    });
  }

  if (criteria.yearTo !== undefined) {
    entries = entries.filter((entry) => {
      const year = getPublishYear(entry);
      return year !== null && year <= criteria.yearTo!;
    });
  }

  if (criteria.topics && criteria.topics.length > 0) {
    const lowerTopics = criteria.topics.map((topic) => topic.toLowerCase());
    entries = entries.filter((entry) =>
      lowerTopics.some((topic) =>
        normalizeTopics(entry)
          .map((value) => value.toLowerCase())
          .includes(topic),
      ),
    );
  }

  if (criteria.contributors && criteria.contributors.length > 0) {
    const lowerContributors = criteria.contributors.map((c) => c.toLowerCase());
    entries = entries.filter((entry) =>
      lowerContributors.some((personId) =>
        getContributorIds(entry).includes(personId),
      ),
    );
  }

  if (criteria.venues && criteria.venues.length > 0) {
    const lowerVenues = criteria.venues.map((venue) => venue.toLowerCase());
    entries = entries.filter((entry) =>
      lowerVenues.some((venue) => {
        const value = getLegacyField(entry, "venue");
        return value ? value.toLowerCase().includes(venue) : false;
      }),
    );
  }

  if (criteria.organizations && criteria.organizations.length > 0) {
    const lowerOrgs = criteria.organizations.map((org) => org.toLowerCase());
    entries = entries.filter((entry) =>
      lowerOrgs.some((organizationId) =>
        (entry.data.organizations ?? []).some(
          (org) => org.organizationId.toLowerCase() === organizationId,
        ),
      ),
    );
  }

  if (criteria.relatedHardware && criteria.relatedHardware.length > 0) {
    const lowerHardware = criteria.relatedHardware.map((hw) => hw.toLowerCase());
    entries = entries.filter((entry) =>
      lowerHardware.some((hardwareId) =>
        entry.data.relatedHardware?.some(
          (hw) => hw.toLowerCase() === hardwareId,
        ) ?? false,
      ),
    );
  }

  if (criteria.relatedSoftware && criteria.relatedSoftware.length > 0) {
    const lowerSoftware = criteria.relatedSoftware.map((sw) => sw.toLowerCase());
    entries = entries.filter((entry) =>
      lowerSoftware.some((softwareId) =>
        entry.data.relatedSoftware?.some(
          (sw) => sw.toLowerCase() === softwareId,
        ) ?? false,
      ),
    );
  }

  return entries;
}

/** Get research statistics */
export async function getResearchStatistics(): Promise<{
  total: number;
  byType: Record<string, number>;
  byYear: Record<number, number>;
  uniqueContributorsCount: number;
  uniqueVenuesCount: number;
  mostRecentStudy?: ResearchEntry;
}> {
  const entries = await loadResearchEntries();
  const [byType, byYear, uniqueContributors, uniqueVenues] = await Promise.all([
    getResearchCountByType(),
    getResearchCountByYear(),
    getUniqueResearchContributors(),
    getUniqueResearchVenues(),
  ]);

  return {
    total: entries.length,
    byType,
    byYear,
    uniqueContributorsCount: uniqueContributors.length,
    uniqueVenuesCount: uniqueVenues.length,
    mostRecentStudy: entries[0],
  };
}

/** Build co-authorship network */
export async function getResearchCoAuthorshipNetwork(): Promise<{
  nodes: Array<{ id: string; name: string; affiliation?: string; count: number }>;
  edges: Array<{ source: string; target: string; weight: number }>;
}> {
  const entries = await loadResearchEntries();
  const nodeMap = new Map<string, { affiliation?: string; count: number }>();
  const edgeMap = new Map<string, number>();

  entries.forEach((entry) => {
    const people = (entry.data.contributors ?? []).filter(
      (contributor): contributor is typeof contributor & { personId: string } =>
        Boolean(contributor.personId),
    );

    people.forEach((contributor) => {
      const existing = nodeMap.get(contributor.personId) ?? { count: 0 };
      existing.count += 1;
      if (!existing.affiliation && contributor.affiliationSnapshot) {
        existing.affiliation = contributor.affiliationSnapshot;
      }
      nodeMap.set(contributor.personId, existing);
    });

    for (let i = 0; i < people.length; i++) {
      for (let j = i + 1; j < people.length; j++) {
        const key = [people[i]!.personId, people[j]!.personId]
          .sort()
          .join("|||");
        edgeMap.set(key, (edgeMap.get(key) || 0) + 1);
      }
    }
  });

  const nodes = Array.from(nodeMap.entries()).map(([id, data]) => ({
    id,
    name: id,
    ...(data.affiliation && { affiliation: data.affiliation }),
    count: data.count,
  }));

  const edges = Array.from(edgeMap.entries())
    .map(([key, weight]) => {
      const [source, target] = key.split("|||");
      if (!source || !target) return null;
      return { source, target, weight };
    })
    .filter(
      (edge): edge is { source: string; target: string; weight: number } =>
        edge !== null,
    );

  return { nodes, edges };
}