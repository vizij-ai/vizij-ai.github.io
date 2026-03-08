#!/usr/bin/env node

/**
 * Test script to verify draft functionality across all content collections
 * Run with: node test/verify-drafts.mjs
 */

import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

// ANSI color codes for terminal output
const colors = {
	green: "\x1b[32m",
	red: "\x1b[31m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	reset: "\x1b[0m",
	bold: "\x1b[1m",
};

/**
 * Parse frontmatter from MDX file
 */
function parseFrontmatter(content) {
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return {};

	const frontmatter = {};
	const lines = match[1].split("\n");

	for (const line of lines) {
		const colonIndex = line.indexOf(":");
		if (colonIndex > 0) {
			const key = line.substring(0, colonIndex).trim();
			let value = line.substring(colonIndex + 1).trim();

			// Handle boolean values
			if (value === "true") value = true;
			else if (value === "false") value = false;
			// Remove quotes if present
			else if (
				(value.startsWith('"') && value.endsWith('"')) ||
				(value.startsWith("'") && value.endsWith("'"))
			) {
				value = value.slice(1, -1);
			}

			frontmatter[key] = value;
		}
	}

	return frontmatter;
}

/**
 * Check a single collection for draft content
 */
async function checkCollection(collectionName) {
	const collectionPath = join(projectRoot, "src", "content", collectionName);

	try {
		const files = await readdir(collectionPath);
		const mdxFiles = files.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

		const results = {
			total: 0,
			drafts: [],
			published: [],
		};

		for (const file of mdxFiles) {
			const filePath = join(collectionPath, file);
			const content = await readFile(filePath, "utf-8");
			const frontmatter = parseFrontmatter(content);

			results.total++;

			if (frontmatter.draft === true) {
				results.drafts.push({
					file,
					name: frontmatter.name || frontmatter.title || file,
				});
			} else {
				results.published.push({
					file,
					name: frontmatter.name || frontmatter.title || file,
				});
			}
		}

		return results;
	} catch (error) {
		if (error.code === "ENOENT") {
			return { total: 0, drafts: [], published: [], error: "Collection not found" };
		}
		throw error;
	}
}

/**
 * Verify that draft filtering is configured in data helpers
 */
async function checkDataHelper(helperName) {
	const helperPath = join(projectRoot, "src", "data", `${helperName}.ts`);

	try {
		const content = await readFile(helperPath, "utf-8");
		const hasDraftFilter = content.includes("data.draft !== true");
		return { exists: true, hasDraftFilter };
	} catch (error) {
		return { exists: false, hasDraftFilter: false };
	}
}

/**
 * Main test runner
 */
async function main() {
	console.log(`${colors.bold}${colors.blue}=== Draft System Verification ===${colors.reset}\n`);

	const collections = ["hardware", "software", "events", "partners", "studies"];
	let allTestsPassed = true;

	// Check each collection
	for (const collection of collections) {
		console.log(`${colors.bold}📁 Collection: ${collection}${colors.reset}`);

		// Check content files
		const results = await checkCollection(collection);

		if (results.error) {
			console.log(`  ${colors.yellow}⚠ ${results.error}${colors.reset}`);
		} else {
			console.log(`  Total files: ${results.total}`);
			console.log(`  Published: ${colors.green}${results.published.length}${colors.reset}`);
			console.log(`  Drafts: ${colors.yellow}${results.drafts.length}${colors.reset}`);

			if (results.drafts.length > 0) {
				for (const draft of results.drafts) {
					console.log(`    ${colors.yellow}📝 ${draft.name} (${draft.file})${colors.reset}`);
				}
			}
		}

		// Check data helper configuration
		const helper = await checkDataHelper(collection);
		if (helper.exists) {
			if (helper.hasDraftFilter) {
				console.log(`  ${colors.green}✓ Data helper has draft filtering${colors.reset}`);
			} else {
				console.log(`  ${colors.red}✗ Data helper missing draft filtering${colors.reset}`);
				allTestsPassed = false;
			}
		} else {
			console.log(`  ${colors.yellow}⚠ No data helper found${colors.reset}`);
		}

		console.log();
	}

	// Check dynamic routes
	console.log(`${colors.bold}🔄 Dynamic Routes${colors.reset}`);
	const dynamicRoutes = [
		{ name: "hardware", path: "src/pages/hardware/[...slug].astro" },
		{ name: "software", path: "src/pages/software/[...slug].astro" },
	];

	for (const route of dynamicRoutes) {
		const routePath = join(projectRoot, route.path);
		try {
			const content = await readFile(routePath, "utf-8");
			const hasDraftFilter = content.includes("data.draft !== true");

			if (hasDraftFilter) {
				console.log(`  ${colors.green}✓ ${route.name} route has draft filtering${colors.reset}`);
			} else {
				console.log(`  ${colors.red}✗ ${route.name} route missing draft filtering${colors.reset}`);
				allTestsPassed = false;
			}
		} catch (error) {
			console.log(`  ${colors.yellow}⚠ ${route.name} route not found${colors.reset}`);
		}
	}

	console.log();

	// Summary
	console.log(`${colors.bold}📊 Summary${colors.reset}`);

	let totalDrafts = 0;
	let totalPublished = 0;

	for (const collection of collections) {
		const results = await checkCollection(collection);
		if (!results.error) {
			totalDrafts += results.drafts.length;
			totalPublished += results.published.length;
		}
	}

	console.log(`  Total content items: ${totalPublished + totalDrafts}`);
	console.log(`  Published: ${colors.green}${totalPublished}${colors.reset}`);
	console.log(`  Drafts: ${colors.yellow}${totalDrafts}${colors.reset}`);

	console.log();

	if (allTestsPassed) {
		console.log(`${colors.green}${colors.bold}✅ All draft system checks passed!${colors.reset}`);
		process.exit(0);
	} else {
		console.log(`${colors.red}${colors.bold}❌ Some draft system checks failed!${colors.reset}`);
		process.exit(1);
	}
}

// Run the tests
main().catch((error) => {
	console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
	process.exit(1);
});
