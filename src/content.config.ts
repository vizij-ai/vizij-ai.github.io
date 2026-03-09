import { defineCollection, z } from "astro:content";
import { createEcosystemCollections } from "@semio-community/ecosystem-content-schema";
import { glob } from "astro/loaders";

export const collections = createEcosystemCollections({
	defineCollection,
	glob,
	z,
});
