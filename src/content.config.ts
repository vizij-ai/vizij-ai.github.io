import { defineCollection, z } from "astro:content";
import { createEcosystemCollections } from "@semio-community/ecosystem-content-schema";
import { glob } from "astro/loaders";

const linkSchema = z.object({
	label: z.string(),
	href: z.string(),
	description: z.string().optional(),
});

const guidebookPages = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/generated/guidebook/pages",
	}),
	schema: z.object({
		pageId: z.string(),
		moduleId: z.string(),
		sourceModuleId: z.string(),
		sourcePath: z.string(),
		surface: z.enum(["docs", "tutorials"]),
		publish: z.boolean().default(true),
		routeSlug: z.string(),
		canonicalPath: z.string(),
		routeRole: z.string(),
		routeRoleLabel: z.string().optional(),
		title: z.string(),
		summary: z.string(),
		moduleType: z.string(),
		bucket: z.string(),
		depth: z.string(),
		hubGroup: z.string(),
		order: z.number(),
		redirects: z.array(z.string()).default([]),
		outcome: z.string().optional(),
		prerequisites: z.array(z.string()).default([]),
		successCheck: z.array(z.string()).default([]),
		headings: z.array(z.object({ depth: z.number(), slug: z.string(), text: z.string() })).default([]),
		context: z
			.object({
				bucketChain: z.string().optional(),
				depthLadder: z.string().optional(),
				modulePosition: z.string().optional(),
				moduleType: z.string().optional(),
				bucketOverview: linkSchema.optional(),
				referenceBridges: z.array(linkSchema).default([]),
			})
			.optional(),
		prev: linkSchema.optional(),
		next: linkSchema.optional(),
		implementationAnchors: z.array(linkSchema).default([]),
		demoLinks: z.array(linkSchema).default([]),
		labId: z.string().optional(),
		hasMermaid: z.boolean().default(false),
	}),
});

export const collections = {
	...createEcosystemCollections({
	defineCollection,
	glob,
	z,
	}),
	guidebookPages,
};
