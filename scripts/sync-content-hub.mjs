#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import {
	validateContentGraph,
	splitReferenceFindings,
	formatReferenceErrors,
} from "@semio-community/ecosystem-content-schema";

const root = process.cwd();
function resolveHubContentRoot() {
	const candidates = [
		path.join(root, "../ecosystem-content-hub/content"),
		path.join(root, "../semio-content-hub/content"),
	];
	return candidates.find((candidate) => fs.existsSync(candidate));
}

const hubRoot = resolveHubContentRoot();
const siteRoot = path.join(root, "src/content");
const collectionKeys = ["organizations", "events", "people", "software", "hardware", "research", "press", "awards"];
const siteKey = "vizij";

function toRepoPath(assetPath) {
	// `@/…` is the Astro/tsconfig alias for `src/…`; resolve it so the
	// existence check below hits the real file. Everything else is treated
	// as root-relative (a leading slash is stripped first).
	if (assetPath.startsWith("@/")) {
		return path.join(root, "src", assetPath.slice(2));
	}
	return path.join(root, assetPath.replace(/^\//, ""));
}

// Image asset references appear in two equivalent forms across content:
// `/src/assets/images/…` and the `@/assets/images/…` alias. Both must be
// sanitized — a reference whose target file is absent in this site is
// dropped so the build doesn't hard-fail on a missing image.
function isManagedAssetPath(value) {
	return (
		value.startsWith("/src/assets/images/") ||
		value.startsWith("@/assets/images/")
	);
}

function sanitizeAssetPaths(value) {
	if (typeof value === "string" && isManagedAssetPath(value)) {
		return fs.existsSync(toRepoPath(value)) ? value : undefined;
	}

	if (Array.isArray(value)) {
		const next = value.map((item) => sanitizeAssetPaths(item)).filter((item) => item !== undefined);
		return next;
	}

	if (value && typeof value === "object") {
		const next = {};
		for (const [k, v] of Object.entries(value)) {
			const sanitized = sanitizeAssetPaths(v);
			if (sanitized !== undefined) next[k] = sanitized;
		}
		return next;
	}

	return value;
}

function parseFrontmatter(raw) {
	if (!raw.startsWith("---\n")) {
		return { data: {}, body: raw };
	}

	const endIndex = raw.indexOf("\n---\n", 4);
	if (endIndex < 0) {
		return { data: {}, body: raw };
	}

	const frontmatterRaw = raw.slice(4, endIndex);
	const body = raw.slice(endIndex + 5);
	const data = YAML.parse(frontmatterRaw) || {};
	return { data, body };
}

function stringifyFrontmatter(data, body) {
	return `---\n${YAML.stringify(data)}---\n${body}`;
}

function getContentFiles(directory) {
	if (!fs.existsSync(directory)) return [];
	return fs
		.readdirSync(directory)
		.filter((name) => (name.endsWith(".md") || name.endsWith(".mdx")) && name !== "README.md");
}

let importedCount = 0;
let skippedCount = 0;
const syncedEntries = Object.fromEntries(
	collectionKeys.map((key) => [key, []]),
);

if (!hubRoot) {
	console.error(
		`Content hub folder not found. Checked ../ecosystem-content-hub/content and ../semio-content-hub/content from ${root}.`,
	);
	process.exit(1);
}

for (const collectionKey of collectionKeys) {
	const sourceDir = path.join(hubRoot, collectionKey);
	const targetDir = path.join(siteRoot, collectionKey);
	if (!fs.existsSync(sourceDir)) continue;
	fs.mkdirSync(targetDir, { recursive: true });

	const importedFiles = new Set();
	for (const fileName of getContentFiles(sourceDir)) {
		const sourcePath = path.join(sourceDir, fileName);
		const targetPath = path.join(targetDir, fileName);
		const raw = fs.readFileSync(sourcePath, "utf8");
		const { data, body } = parseFrontmatter(raw);

		const sites = Array.isArray(data.sites) ? data.sites : undefined;
		if (sites && !sites.includes(siteKey)) {
			skippedCount += 1;
			continue;
		}

		const siteOverride =
			data.overrides && typeof data.overrides === "object" ? data.overrides[siteKey] : undefined;

		const mergedData = sanitizeAssetPaths({
			...data,
			...(siteOverride && typeof siteOverride === "object" ? siteOverride : {}),
		});

		mergedData.sites = undefined;
		mergedData.overrides = undefined;

		fs.writeFileSync(targetPath, stringifyFrontmatter(mergedData, body), "utf8");
		importedFiles.add(fileName);
		importedCount += 1;

		// Collect for post-sync reference validation (id = file slug).
		syncedEntries[collectionKey].push({
			id: fileName.replace(/\.(md|mdx)$/, ""),
			data: mergedData,
		});
	}

	for (const existingName of getContentFiles(targetDir)) {
		if (importedFiles.has(existingName)) continue;
		fs.unlinkSync(path.join(targetDir, existingName));
	}
}

console.log(
	`Synced ${importedCount} entries for site '${siteKey}' across collections: ${collectionKeys.join(", ")} (${skippedCount} skipped).`,
);

// --- Post-sync reference validation ---------------------------------------
// Validate the just-synced content as a self-contained graph for THIS site.
// A dropped *structural* reference (a recipient, contributor, affiliation, or
// funding/lead/granting organization that should have synced to this site but
// didn't — the "Funding Organization row vanished" class) is an error and
// fails the sync. Soft `relatedX` cross-links that thin out per-site drop
// cleanly at render time, so they are reported as warnings only. Typos are
// already caught upstream by the hub's own validate:refs check.
const findings = validateContentGraph({
	entriesByCollection: syncedEntries,
	sites: [siteKey],
	globalMissSeverity: "byRule",
});
const { errors: refErrors, warnings: refWarnings } =
	splitReferenceFindings(findings);
if (findings.length > 0) {
	console.log(
		formatReferenceErrors(findings, {
			graphName: `${siteKey} synced content`,
		}),
	);
}
console.log(
	`Reference check: ${refErrors.length} error(s), ${refWarnings.length} warning(s).`,
);
if (refErrors.length > 0) {
	console.error(
		`\nSync produced ${refErrors.length} dangling structural reference(s) for site '${siteKey}'. ` +
			"A referenced entry did not sync to this site -- check its 'sites:' scoping in the hub.",
	);
	process.exit(1);
}
