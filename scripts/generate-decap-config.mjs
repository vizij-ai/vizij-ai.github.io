#!/usr/bin/env node

import { generateDecapConfig } from "@semio/ecosystem-content-schema";

const result = generateDecapConfig({ rootDir: process.cwd() });

console.log(
  `Generated Decap config with ${result.collectionsCount} collections at ${result.outputGeneratedPath}`,
);
console.log(`Wrote updated config.yml at ${result.baseConfigPath}`);
