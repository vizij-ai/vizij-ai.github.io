import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { isDraftVisible } from "@/utils/drafts";

type OrganizationEntry = CollectionEntry<"organizations">;

async function loadOrganizationEntries(): Promise<OrganizationEntry[]> {
  const organizations = await getCollection("organizations", ({ data }) =>
    isDraftVisible(data.draft),
  );

  const partners = organizations.filter((org) => org.data.isPartner);

  return partners.sort((a, b) => {
    if (a.data.featured !== b.data.featured) {
      return a.data.featured ? -1 : 1;
    }

    if (a.data.order !== b.data.order) {
      return a.data.order - b.data.order;
    }

    return a.data.name.localeCompare(b.data.name);
  });
}

/** Get all partner organizations */
export async function getAllOrganizations(): Promise<OrganizationEntry[]> {
  return loadOrganizationEntries();
}

/** Get partners filtered by organization type */
export async function getOrganizationsByType(
  type: OrganizationEntry["data"]["type"],
): Promise<OrganizationEntry[]> {
  const partners = await loadOrganizationEntries();
  return partners.filter((partner) => partner.data.type === type);
}

/** Get partners filtered by category */
export async function getOrganizationsByCategory(
  category: OrganizationEntry["data"]["category"],
): Promise<OrganizationEntry[]> {
  const partners = await loadOrganizationEntries();
  return partners.filter((partner) => partner.data.category === category);
}

/** Get featured partners */
export async function getFeaturedOrganizations(): Promise<OrganizationEntry[]> {
  const partners = await loadOrganizationEntries();
  return partners.filter((partner) => partner.data.featured);
}

/** Get partners by location */
export async function getOrganizationsByLocation(location: {
  city?: string;
  country?: string;
}): Promise<OrganizationEntry[]> {
  const partners = await loadOrganizationEntries();

  return partners.filter((partner) => {
    const partnerCity = partner.data.location.city.toLowerCase();
    const partnerCountry = partner.data.location.country.toLowerCase();

    if (location.city && location.country) {
      return (
        partnerCity === location.city.toLowerCase() &&
        partnerCountry === location.country.toLowerCase()
      );
    }

    if (location.city) {
      return partnerCity === location.city.toLowerCase();
    }

    if (location.country) {
      return partnerCountry === location.country.toLowerCase();
    }

    return false;
  });
}

/** Get unique partner types */
export async function getUniqueOrganizationTypes(): Promise<string[]> {
  const partners = await loadOrganizationEntries();
  const types = partners.map((partner) => partner.data.type);
  return [...new Set(types)];
}

/** Get unique partner categories */
export async function getUniqueOrganizationCategories(): Promise<string[]> {
  const partners = await loadOrganizationEntries();
  const categories = partners.map((partner) => partner.data.category);
  return [...new Set(categories)];
}

/** Get unique partner locations */
export async function getUniqueLocations(): Promise<
  Array<{ city: string; country: string }>
> {
  const partners = await loadOrganizationEntries();
  const locationStrings = partners.map(
    (partner) =>
      `${partner.data.location.city}|${partner.data.location.country}`,
  );

  const unique = [...new Set(locationStrings)]
    .map((value) => {
      const [city, country] = value.split("|");
      return { city, country };
    })
    .filter(({ city, country }) => city && country);

  const normalized = unique.map(({ city, country }) => ({
    city: city!,
    country: country!,
  }));

  return normalized.sort((a, b) =>
    a.country.localeCompare(b.country, undefined, { sensitivity: "base" }),
  );
}

/** Count partners by type */
export async function getOrganizationCountByType(): Promise<
  Record<string, number>
> {
  const partners = await loadOrganizationEntries();
  return partners.reduce(
    (acc, partner) => {
      acc[partner.data.type] = (acc[partner.data.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

/** Count partners by category */
export async function getOrganizationCountByCategory(): Promise<
  Record<string, number>
> {
  const partners = await loadOrganizationEntries();
  return partners.reduce(
    (acc, partner) => {
      acc[partner.data.category] = (acc[partner.data.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

/** Count partners by country */
export async function getOrganizationCountByCountry(): Promise<
  Record<string, number>
> {
  const partners = await loadOrganizationEntries();
  return partners.reduce(
    (acc, partner) => {
      const country = partner.data.location.country;
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

/** Search partners by query */
export async function searchOrganizations(
  query: string,
): Promise<OrganizationEntry[]> {
  const partners = await loadOrganizationEntries();
  const lowerQuery = query.toLowerCase();

  return partners.filter((partner) => {
    const summary = partner.data.collaborationSummary?.toLowerCase() ?? "";
    const website = partner.data.links?.website?.toLowerCase() ?? "";

    return (
      partner.data.name.toLowerCase().includes(lowerQuery) ||
      partner.data.description.toLowerCase().includes(lowerQuery) ||
      summary.includes(lowerQuery) ||
      website.includes(lowerQuery) ||
      partner.data.location.city.toLowerCase().includes(lowerQuery) ||
      partner.data.location.country.toLowerCase().includes(lowerQuery)
    );
  });
}

/** Group partners by type */
export function groupOrganizationsByType(
  partners: OrganizationEntry[],
): Record<string, OrganizationEntry[]> {
  return partners.reduce(
    (acc, partner) => {
      if (!acc[partner.data.type]) {
        acc[partner.data.type] = [];
      }
      acc[partner.data.type]!.push(partner);
      return acc;
    },
    {} as Record<string, OrganizationEntry[]>,
  );
}

/** Group partners by country */
export function groupOrganizationsByCountry(
  partners: OrganizationEntry[],
): Record<string, OrganizationEntry[]> {
  return partners.reduce(
    (acc, partner) => {
      const country = partner.data.location.country;
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country]!.push(partner);
      return acc;
    },
    {} as Record<string, OrganizationEntry[]>,
  );
}

/** Filter partners by multiple criteria */
export async function filterOrganizations(criteria: {
  type?: string;
  category?: string;
  location?: { city?: string; country?: string };
  featuredOnly?: boolean;
}): Promise<OrganizationEntry[]> {
  let partners = await loadOrganizationEntries();

  if (criteria.type) {
    partners = partners.filter(
      (partner) => partner.data.type === criteria.type,
    );
  }

  if (criteria.category) {
    partners = partners.filter(
      (partner) => partner.data.category === criteria.category,
    );
  }

  if (criteria.location) {
    partners = await getOrganizationsByLocation(criteria.location);
  }

  if (criteria.featuredOnly) {
    partners = partners.filter((partner) => partner.data.featured);
  }

  return partners;
}

/** Aggregate partner statistics */
export async function getOrganizationshipStatistics(): Promise<{
  total: number;
  featured: number;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
  byCountry: Record<string, number>;
}> {
  const partners = await loadOrganizationEntries();
  const [byType, byCategory, byCountry] = await Promise.all([
    getOrganizationCountByType(),
    getOrganizationCountByCategory(),
    getOrganizationCountByCountry(),
  ]);

  return {
    total: partners.length,
    featured: partners.filter((partner) => partner.data.featured).length,
    byType,
    byCategory,
    byCountry,
  };
}