import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { createEcosystemCollections } from "@semio-community/ecosystem-content-schema";

export const collections = createEcosystemCollections({
  defineCollection,
  glob,
  z,
});
