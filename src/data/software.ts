import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { isDraftVisible } from "@/utils/drafts";

/** Get all software entries, sorted by featured status and name */
export async function getAllSoftware(): Promise<CollectionEntry<"software">[]> {
  const software = await getCollection("software", ({ data }) => {
    // In production, exclude drafts. In development, show all.
    return isDraftVisible(data.draft);
  });
  return software.sort((a, b) => {
    // Sort by featured first, then by status priority, then by name
    if (a.data.featured !== b.data.featured) {
      return a.data.featured ? -1 : 1;
    }

    // Status priority: stable > beta > alpha > in-progress > deprecated
    const statusPriority = {
      stable: 0,
      beta: 1,
      alpha: 2,
      "in-progress": 3,
      deprecated: 4,
    };

    const aPriority = statusPriority[a.data.status];
    const bPriority = statusPriority[b.data.status];

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    return a.data.name.localeCompare(b.data.name);
  });
}

/** Get software filtered by category */
export async function getSoftwareByCategory(
  category:
    | "framework"
    | "library"
    | "tool"
    | "simulation"
    | "dataset"
    | "model",
): Promise<CollectionEntry<"software">[]> {
  const software = await getAllSoftware();
  return software.filter((item) => item.data.category === category);
}

/** Get software filtered by status */
export async function getSoftwareByStatus(
  status: "stable" | "beta" | "alpha" | "in-progress" | "deprecated",
): Promise<CollectionEntry<"software">[]> {
  const software = await getAllSoftware();
  return software.filter((item) => item.data.status === status);
}

/** Get only featured software */
export async function getFeaturedSoftware(): Promise<
  CollectionEntry<"software">[]
> {
  const software = await getAllSoftware();
  return software.filter((item) => item.data.featured);
}

/** Get software by programming language */
export async function getSoftwareByLanguage(
  language: string,
): Promise<CollectionEntry<"software">[]> {
  const software = await getAllSoftware();
  return software.filter((item) =>
    item.data.language.some(
      (lang) => lang.toLowerCase() === language.toLowerCase(),
    ),
  );
}

/** Get software by platform */
export async function getSoftwareByPlatform(
  platform: string,
): Promise<CollectionEntry<"software">[]> {
  const software = await getAllSoftware();
  return software.filter((item) =>
    item.data.platform.some(
      (plat) => plat.toLowerCase() === platform.toLowerCase(),
    ),
  );
}

/** Get software by license type */
export async function getSoftwareByLicense(
  license: string,
): Promise<CollectionEntry<"software">[]> {
  const software = await getAllSoftware();
  return software.filter((item) =>
    item.data.license.toLowerCase().includes(license.toLowerCase()),
  );
}

/** Get software by institution */
export async function getSoftwareByOrganization(
  organizationId: string,
): Promise<CollectionEntry<"software">[]> {
  const software = await getAllSoftware();
  return software.filter((item) => {
    return (item.data.contributors ?? []).some(
      (contributor) =>
        contributor.type === "organization" &&
        contributor.organizationId === organizationId,
    );
  });
}

/** Get all unique categories */
export async function getUniqueCategories(): Promise<string[]> {
  const software = await getAllSoftware();
  const categories = software.map((item) => item.data.category);
  return [...new Set(categories)];
}

/** Get all unique topics */
export async function getUniqueSoftwareTopics(): Promise<string[]> {
  const software = await getAllSoftware();
  const topics = software.flatMap((item) => item.data.topics ?? []);
  return [...new Set(topics)].sort((a, b) => a.localeCompare(b));
}

/** Get all unique programming languages */
export async function getUniqueLanguages(): Promise<string[]> {
  const software = await getAllSoftware();
  const languages = software.flatMap((item) => item.data.language);
  return [...new Set(languages)].sort();
}

/** Get all unique platforms */
export async function getUniquePlatforms(): Promise<string[]> {
  const software = await getAllSoftware();
  const platforms = software.flatMap((item) => item.data.platform);
  return [...new Set(platforms)].sort();
}

/** Get all unique licenses */
export async function getUniqueLicenses(): Promise<string[]> {
  const software = await getAllSoftware();
  const licenses = software.map((item) => item.data.license);
  return [...new Set(licenses)].sort();
}

/** Get all unique organizations */
export async function getUniqueOrganizations(): Promise<string[]> {
  const software = await getAllSoftware();
  const organizations = software.flatMap((item) =>
    (item.data.contributors ?? [])
      .filter((contributor) => contributor.type === "organization")
      .map((contributor) => contributor.organizationId),
  );

  return [...new Set(organizations)].sort((a, b) => a.localeCompare(b));
}

/** Get software count by category */
export async function getSoftwareCountByCategory(): Promise<
  Record<string, number>
> {
  const software = await getAllSoftware();
  return software.reduce(
    (acc, item) => {
      const category = item.data.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

/** Get software count by status */
export async function getSoftwareCountByStatus(): Promise<
  Record<string, number>
> {
  const software = await getAllSoftware();
  return software.reduce(
    (acc, item) => {
      const status = item.data.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

/** Get software count by language */
export async function getSoftwareCountByLanguage(): Promise<
  Record<string, number>
> {
  const software = await getAllSoftware();
  const counts: Record<string, number> = {};

  software.forEach((item) => {
    item.data.language.forEach((lang) => {
      counts[lang] = (counts[lang] || 0) + 1;
    });
  });

  return counts;
}

/** Search software by query string */
export async function searchSoftware(
  query: string,
): Promise<CollectionEntry<"software">[]> {
  const software = await getAllSoftware();
  const lowerQuery = query.toLowerCase();

  return software.filter((item) => {
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
      item.data.language.some((lang) =>
        lang.toLowerCase().includes(lowerQuery),
      ) ||
      item.data.platform.some((plat) =>
        plat.toLowerCase().includes(lowerQuery),
      ) ||
      (item.data.topics ?? []).some((topic) =>
        topic.toLowerCase().includes(lowerQuery),
      ) ||
      contributorMatch
    );
  });
}

/** Get related software (by shared tags, languages, or use cases) */
export async function getRelatedSoftware(
  currentItem: CollectionEntry<"software">,
  limit: number = 3,
): Promise<CollectionEntry<"software">[]> {
  const allSoftware = await getAllSoftware();

  // Filter out the current item
  const otherSoftware = allSoftware.filter(
    (item) => item.id !== currentItem.id,
  );

  // Score each item based on shared attributes
  const scored = otherSoftware.map((item) => {
    let score = 0;

    // Score for shared languages
    const sharedLanguages = item.data.language.filter((lang) =>
      currentItem.data.language.includes(lang),
    );
    score += sharedLanguages.length * 3;

    // Score for shared platforms
    const sharedPlatforms = item.data.platform.filter((plat) =>
      currentItem.data.platform.includes(plat),
    );
    score += sharedPlatforms.length * 2;

    // Score for shared topics
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

/** Get recently updated software */
export async function getRecentlyUpdatedSoftware(
  limit: number = 5,
): Promise<CollectionEntry<"software">[]> {
  const software = await getAllSoftware();
  return software
    .sort((a, b) => {
      const aDate = a.data.publishDate
        ? new Date(a.data.publishDate)
        : new Date(0);
      const bDate = b.data.publishDate
        ? new Date(b.data.publishDate)
        : new Date(0);
      return bDate.getTime() - aDate.getTime();
    })
    .slice(0, limit);
}

/** Get software that needs specific hardware */
export async function getSoftwareRequiringHardware(
  hardwareName: string,
): Promise<CollectionEntry<"software">[]> {
  const software = await getAllSoftware();
  return software.filter(
    (item) =>
      item.data.requirements?.hardware?.some((hw) =>
        hw.toLowerCase().includes(hardwareName.toLowerCase()),
      ) ?? false,
  );
}

/** Filter software by multiple criteria */
export async function filterSoftware(criteria: {
  category?: string;
  status?: string;
  language?: string;
  platform?: string;
  license?: string;
  topics?: string[];
  tags?: string[];
}): Promise<CollectionEntry<"software">[]> {
  let software = await getAllSoftware();

  if (criteria.category) {
    software = software.filter(
      (item) => item.data.category === criteria.category,
    );
  }

  if (criteria.status) {
    software = software.filter((item) => item.data.status === criteria.status);
  }

  if (criteria.language) {
    software = software.filter((item) =>
      item.data.language.some(
        (lang) => lang.toLowerCase() === criteria.language!.toLowerCase(),
      ),
    );
  }

  if (criteria.platform) {
    software = software.filter((item) =>
      item.data.platform.some(
        (plat) => plat.toLowerCase() === criteria.platform!.toLowerCase(),
      ),
    );
  }

  if (criteria.license) {
    software = software.filter((item) =>
      item.data.license.toLowerCase().includes(criteria.license!.toLowerCase()),
    );
  }

  const topicFilters = criteria.topics ?? criteria.tags;
  if (topicFilters && topicFilters.length > 0) {
    software = software.filter((item) =>
      topicFilters.some((topic) =>
        (item.data.topics ?? [])
          .map((value) => value.toLowerCase())
          .includes(topic.toLowerCase()),
      ),
    );
  }

  return software;
}