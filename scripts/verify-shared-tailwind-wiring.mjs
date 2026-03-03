import { readFileSync } from "node:fs";
import path from "node:path";

const globalCssPath = path.resolve("src/styles/global.css");
const content = readFileSync(globalCssPath, "utf8");

const requiredSnippets = [
  '@import "@semio-community/ecosystem-site-core/styles.css";',
  '@source "../../node_modules/@semio-community/ecosystem-site-core/dist/**/*.{js,mjs,cjs}";',
];

const forbiddenSnippets = ['@source inline("h-[72px]'];

const missing = requiredSnippets.filter((snippet) => !content.includes(snippet));
const forbidden = forbiddenSnippets.filter((snippet) => content.includes(snippet));

if (missing.length === 0 && forbidden.length === 0) {
  console.log("[verify:shared-tailwind] OK");
  process.exit(0);
}

if (missing.length > 0) {
  console.error("[verify:shared-tailwind] Missing required entries in src/styles/global.css:");
  for (const item of missing) {
    console.error(`  - ${item}`);
  }
}

if (forbidden.length > 0) {
  console.error("[verify:shared-tailwind] Remove temporary fallback entries:");
  for (const item of forbidden) {
    console.error(`  - ${item}`);
  }
}

process.exit(1);
