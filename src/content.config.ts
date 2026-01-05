import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function removeDupsAndLowerCase(array: string[]) {
  return [...new Set(array.map((str) => str.toLowerCase()))];
}

// Helper function to parse dates consistently without timezone shifts
function parseDate(val: string | Date): Date {
  if (typeof val === "string") {
    const parts = val.split("-").map(Number);
    if (parts.length === 3 && parts.every((p) => !isNaN(p))) {
      return new Date(parts[0]!, parts[1]! - 1, parts[2]!);
    }
    return new Date(val);
  }

  // If already a Date, normalize using UTC parts to avoid off-by-one issues
  return new Date(val.getUTCFullYear(), val.getUTCMonth(), val.getUTCDate());
}

// Shared schemas for cross-collection references
const organizationIdSchema = z
  .string()
  .min(1, "organizationId must reference an organizations collection entry");

const personIdSchema = z
  .string()
  .min(1, "personId must reference a people collection entry");

const hardwareIdSchema = z
  .string()
  .min(1, "hardwareId must reference a hardware collection entry");

const softwareIdSchema = z
  .string()
  .min(1, "softwareId must reference a software collection entry");

const temporalMetadataSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

const linksSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  bluesky: z.string().optional(),
  mastodon: z.string().optional(),
  scheduling: z.string().optional(),
  googleScholar: z.string().optional(),
  orcid: z.string().optional(),
  documentation: z.string().optional(),
  paper: z.string().optional(),
  purchase: z.string().optional(),
  rental: z.string().optional(),
  demo: z.string().optional(),
  pypi: z.string().optional(),
  npm: z.string().optional(),
  pdf: z.string().optional(),
  doi: z.string().optional(),
  arxiv: z.string().optional(),
  code: z.string().optional(),
  data: z.string().optional(),
  video: z.string().optional(),
  registration: z.string().optional(),
  program: z.string().optional(),
  proceedings: z.string().optional(),
  recordings: z.string().optional(),
});

const contributorRoleSchema = z.string().min(1);

const baseContributorSchema = z
  .object({
    role: contributorRoleSchema,
    primary: z.boolean().default(false),
  })
  .merge(temporalMetadataSchema);

const contributorSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("person"),
      personId: personIdSchema,
    })
    .merge(baseContributorSchema),
  z
    .object({
      type: z.literal("organization"),
      organizationId: organizationIdSchema,
    })
    .merge(baseContributorSchema),
]);

const imagePolicySchema = z.object({
  heroInCard: z.boolean().default(true),
  heroInDetail: z.boolean().default(true),
  logoOrAvatarInCard: z.boolean().default(true),
  logoOrAvatarInDetail: z.boolean().default(true),
  logoOrAvatarOnHeroInCard: z.boolean().default(true),
  logoOrAvatarOnHeroInDetail: z.boolean().default(true),
  logoOrAvatarBackdropInCard: z.boolean().default(false),
  logoOrAvatarBackdropInDetail: z.boolean().default(false),
  logoOrAvatarBackdropInList: z.boolean().default(false),
  showFallbackIcon: z.boolean().default(true),
});

const eventOrganizationSchema = z
  .object({
    organizationId: organizationIdSchema,
    role: z.string().optional(),
    note: z.string().optional(),
  })
  .merge(temporalMetadataSchema);

// Proposed People Collection
const people = defineCollection({
  loader: glob({ base: "./src/content/people", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      id: personIdSchema,
      name: z.string(),
      honorific: z.string().optional(),
      pronouns: z.string().optional(),
      title: z.string().optional(),
      bio: z.string().optional(),
      expertise: z.array(z.string()).optional(),
      affiliations: z
        .array(
          z
            .object({
              organizationId: organizationIdSchema,
              role: z.string(),
              department: z.string().optional(),
              isPrimary: z.boolean().default(false),
            })
            .merge(temporalMetadataSchema),
        )
        .optional(),
      links: linksSchema.optional(),
      images: z
        .object({
          avatar: image().optional(),
          hero: image().optional(),
        })
        .optional(),
      imagePolicy: imagePolicySchema.optional().default({}),
      boardMember: z.boolean().default(false),
      isContributor: z.boolean().default(false),
      isDonor: z.boolean().default(false),
      featured: z.boolean().default(false),
      draft: z.boolean().optional(),
    }),
});

// Proposed Organizations Collection
const organizations = defineCollection({
  loader: glob({
    base: "./src/content/organizations",
    pattern: "**/*.{md,mdx}",
  }),
  schema: ({ image }) =>
    z.object({
      id: organizationIdSchema,
      name: z.string(),
      shortName: z.string().optional(),
      description: z.string(),
      type: z.enum([
        "academic",
        "industry",
        "nonprofit",
        "government",
        "community",
      ]),
      category: z.enum([
        "research",
        "development",
        "funding",
        "infrastructure",
        "outreach",
      ]),
      isPartner: z.boolean().default(false),
      isGrantMaker: z.boolean().default(false),
      isDonor: z.boolean().default(false),
      collaborationSummary: z.string().optional(),
      images: z
        .object({
          logo: image().optional(),
          hero: image().optional(),
          logoUrl: z.string().optional(),
          gallery: z.array(image()).optional(),
        })
        .optional(),
      imagePolicy: imagePolicySchema.optional().default({}),
      links: linksSchema.optional(),
      location: z.object({
        city: z.string(),
        country: z.string(),
      }),
      featured: z.boolean().default(false),
      draft: z.boolean().optional(),
      order: z.number().default(999),
    }),
});

// Proposed Hardware Collection
const hardware = defineCollection({
  loader: glob({ base: "./src/content/hardware", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      id: hardwareIdSchema.optional(),
      name: z.string(),
      description: z.string(),
      shortDescription: z.string().max(200),
      category: z.enum([
        "mobile",
        "social",
        "assistive",
        "research",
        "educational",
      ]),
      status: z.enum(["available", "in-progress", "coming-soon", "deprecated"]),
      specifications: z
        .object({
          height: z.string().optional(),
          weight: z.string().optional(),
          battery: z.string().optional(),
          sensors: z.array(z.string()).optional(),
          actuators: z.array(z.string()).optional(),
          computePlatform: z.string().optional(),
        })
        .optional(),
      features: z.array(z.string()),
      // Combines applications and researchAreas into topics
      topics: z.array(z.string()),
      links: linksSchema.optional(),
      images: z
        .object({
          logo: image().optional(),
          hero: image().optional(),
          logoUrl: z.string().optional(),
          gallery: z.array(image()).optional(),
        })
        .optional(),
      imagePolicy: imagePolicySchema.optional().default({}),
      contributors: z.array(contributorSchema).optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().optional(),
    }),
});

// Proposed Software Collection
const software = defineCollection({
  loader: glob({ base: "./src/content/software", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      id: softwareIdSchema.optional(),
      name: z.string(),
      description: z.string(),
      shortDescription: z.string().max(200),
      category: z.enum([
        "framework",
        "library",
        "tool",
        "simulation",
        "dataset",
        "model",
      ]),
      status: z.enum(["stable", "beta", "alpha", "in-progress", "deprecated"]),
      license: z.string(),
      language: z.array(z.string()),
      platform: z.array(z.string()),
      requirements: z
        .object({
          runtime: z.array(z.string()).optional(),
          hardware: z.array(z.string()).optional(),
          dependencies: z.array(z.string()).optional(),
        })
        .optional(),
      features: z.array(z.string()),
      topics: z.array(z.string()),
      links: linksSchema.optional(),
      images: z
        .object({
          logo: image().optional(),
          hero: image().optional(),
          logoUrl: z.string().optional(),
          gallery: z.array(image()).optional(),
        })
        .optional(),
      imagePolicy: imagePolicySchema.optional().default({}),
      contributors: z.array(contributorSchema).optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().optional(),
      publishDate: z
        .string()
        .or(z.date())
        .transform(parseDate)
        .default(() => new Date()),
    }),
});

// Proposed Research Collection
const research = defineCollection({
  loader: glob({ base: "./src/content/research", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      id: z.string().optional(),
      title: z.string(),
      description: z.string(),
      contributors: z.array(
        z
          .object({
            personId: personIdSchema,
            order: z.number(),
            corresponding: z.boolean().default(false),
            equalContribution: z.boolean().default(false),
            affiliationSnapshot: z.string().optional(),
          })
          .merge(temporalMetadataSchema),
      ),
      type: z.enum([
        "paper",
        "thesis",
        "report",
        "preprint",
        "dataset",
        "benchmark",
        "study",
      ]),
      topics: z.array(z.string()),
      organizations: z
        .array(
          z
            .object({
              organizationId: organizationIdSchema,
              role: z.enum(["affiliated", "funding", "lead", "collaborator"]),
              note: z.string().optional(),
            })
            .merge(temporalMetadataSchema),
        )
        .optional(),
      relatedHardware: z.array(hardwareIdSchema).optional(),
      relatedSoftware: z.array(softwareIdSchema).optional(),
      links: linksSchema.optional(),
      images: z
        .object({
          logo: image().optional(),
          hero: image().optional(),
          gallery: z.array(image()).optional(),
        })
        .optional(),
      imagePolicy: imagePolicySchema.optional().default({}),
      featured: z.boolean().default(false),
      draft: z.boolean().optional(),
      publishDate: z.string().or(z.date()).transform(parseDate).optional(),
    }),
});

// Proposed Events Collection (unchanged for now)
const events = defineCollection({
  loader: glob({ base: "./src/content/events", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      displayName: z.string().optional(),
      description: z.string(),
      type: z.enum([
        "conference",
        "workshop",
        "hackathon",
        "meetup",
        "webinar",
        "competition",
      ]),
      startDate: z.string().or(z.date()).transform(parseDate),
      endDate: z.string().or(z.date()).transform(parseDate),
      location: z.object({
        venue: z.string().optional(),
        city: z.string(),
        country: z.string(),
        online: z.boolean().default(false),
        coordinates: z
          .object({
            lat: z.number(),
            lng: z.number(),
          })
          .optional(),
      }),
      roles: z
        .array(
          z.enum([
            "attendee",
            "organizer",
            "sponsor",
            "exhibitor",
            "speaker",
            "panelist",
            "host",
            "winner",
            "competitor",
          ]),
        )
        .default([])
        .transform((values) => [...new Set(values)]),
      images: z
        .object({
          logo: image().optional(),
          hero: image().optional(),
          gallery: z.array(image()).optional(),
        })
        .optional(),
      imagePolicy: imagePolicySchema.optional().default({}),
      links: linksSchema.optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().optional(),
      topics: z.array(z.string()),
      organizations: z.array(eventOrganizationSchema).optional(),
    }),
});

export const collections = {
  people,
  organizations,
  hardware,
  software,
  research,
  events,
};
