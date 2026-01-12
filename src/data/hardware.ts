import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { isDraftVisible } from "@/utils/drafts";

/** Get all hardware entries, sorted by featured status and name */
export async function getAllHardware(): Promise<CollectionEntry<"hardware">[]> {
  const hardware = await getCollection("hardware", ({ data }) => {
    // In production, exclude drafts. In development, show all.
    return isDraftVisible(data.draft);
  });
  return hardware.sort((a, b) => {
    // Sort by featured first, then by status priority, then by name
    if (a.data.featured !== b.data.featured) {
      return a.data.featured ? -1 : 1;
    }

    // Status priority: available > in-progress > coming-soon > deprecated
    const statusPriority: Record<string, number> = {
      available: 0,
      "in-progress": 1,
      "coming-soon": 2,
      deprecated: 3,
    };

    const aPriority = statusPriority[a.data.status] ?? 999;
    const bPriority = statusPriority[b.data.status] ?? 999;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    return a.data.name.localeCompare(b.data.name);
  });
}

/** Get hardware filtered by category */
export async function getHardwareByCategory(
  category: "mobile" | "social" | "assistive" | "research" | "educational",
): Promise<CollectionEntry<"hardware">[]> {
  const hardware = await getAllHardware();
  return hardware.filter((item) => item.data.category === category);
}

/** Get hardware filtered by status */
export async function getHardwareByStatus(
  status: "available" | "in-progress" | "coming-soon" | "deprecated",
): Promise<CollectionEntry<"hardware">[]> {
  const hardware = await getAllHardware();
  return hardware.filter((item) => item.data.status === status);
}

/** Get only featured hardware */
export async function getFeaturedHardware(): Promise<
  CollectionEntry<"hardware">[]
> {
  const hardware = await getAllHardware();
  return hardware.filter((item) => item.data.featured);
}

/** Get hardware by topic */
export async function getHardwareByTopic(
  topic: string,
): Promise<CollectionEntry<"hardware">[]> {
  const hardware = await getAllHardware();
  return hardware.filter((item) =>
    item.data.topics?.some(
      (value) => value.toLowerCase() === topic.toLowerCase(),
    ),
  );
}

// Backward compatibility alias
export const getHardwareByResearchArea = getHardwareByTopic;

/** Get hardware by organization */
export async function getHardwareByOrganization(
  organizationId: string,
): Promise<CollectionEntry<"hardware">[]> {
  const hardware = await getAllHardware();
  return hardware.filter((item) => {
    return (item.data.contributors ?? []).some(
      (contributor) =>
        contributor.type === "organization" &&
        contributor.organizationId === organizationId,
    );
  });
}

/** Get all unique categories */
export async function getUniqueCategories(): Promise<string[]> {
  const hardware = await getAllHardware();
  const categories = hardware.map((item) => item.data.category);
  return [...new Set(categories)];
}

/** Get all unique hardware topics */
export async function getUniqueHardwareTopics(): Promise<string[]> {
  const hardware = await getAllHardware();
  const topics = hardware.flatMap((item) => item.data.topics ?? []);
  return [...new Set(topics)].sort((a, b) => a.localeCompare(b));
}

/** Get all unique organizations */
export async function getUniqueOrganizations(): Promise<string[]> {
  const hardware = await getAllHardware();
  const organizations = hardware.flatMap((item) =>
    (item.data.contributors ?? [])
      .filter((contributor) => contributor.type === "organization")
      .map((contributor) => contributor.organizationId),
  );

  return [...new Set(organizations)].sort((a, b) => a.localeCompare(b));
}

/** Get hardware count by category */
export async function getHardwareCountByCategory(): Promise<
  Record<string, number>
> {
  const hardware = await getAllHardware();
  return hardware.reduce(
    (acc, item) => {
      const category = item.data.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

/** Get hardware count by status */
export async function getHardwareCountByStatus(): Promise<
  Record<string, number>
> {
  const hardware = await getAllHardware();
  return hardware.reduce(
    (acc, item) => {
      const status = item.data.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

/** Search hardware by query string */
export async function searchHardware(
  query: string,
): Promise<CollectionEntry<"hardware">[]> {
  const hardware = await getAllHardware();
  const lowerQuery = query.toLowerCase();

  return hardware.filter((item) => {
    const contributorMatch = (item.data.contributors ?? []).some(
      (contributor) => {
        if (contributor.role?.toLowerCase().includes(lowerQuery)) {
          return true;
        }
        if (contributor.type === "organization") {
          return contributor.organizationId
            .toLowerCase()
            .includes(lowerQuery);
        }
        if (contributor.type === "person") {
          return contributor.personId.toLowerCase().includes(lowerQuery);
        }
        return false;
      },
    );

    return (
      item.data.name.toLowerCase().includes(lowerQuery) ||
      item.data.description.toLowerCase().includes(lowerQuery) ||
      item.data.shortDescription.toLowerCase().includes(lowerQuery) ||
      (item.data.topics ?? []).some((topic) =>
        topic.toLowerCase().includes(lowerQuery),
      ) ||
      contributorMatch
    );
  });
}

/** Get related hardware (by shared tags or research areas) */
export async function getRelatedHardware(
  currentItem: CollectionEntry<"hardware">,
  limit: number = 3,
): Promise<CollectionEntry<"hardware">[]> {
  const allHardware = await getAllHardware();

  // Filter out the current item
  const otherHardware = allHardware.filter(
    (item) => item.id !== currentItem.id,
  );

  // Score each item based on shared topics
  const scored = otherHardware.map((item) => {
    let score = 0;

    const sharedTopics = (item.data.topics ?? []).filter((topic) =>
      (currentItem.data.topics ?? []).includes(topic),
    );
    score += sharedTopics.length * 3;

    // Score for same category
    if (item.data.category === currentItem.data.category) {
      score += 1;
    }

    return { item, score };
  });

  // Sort by score and return top items
  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}