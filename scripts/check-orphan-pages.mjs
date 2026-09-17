#!/usr/bin/env node
/**
 * Build-time orphan-page check.
 *
 * Astro ships every file under src/pages/, so a page can be reachable by
 * URL while linked from nowhere (scaffolding strays). This compares the
 * site's static page routes against the routes its nav references
 * (menuLinks paths/subroutes/section hrefs in site.config.ts) and fails
 * if any page is neither linked nor explicitly allow-listed.
 *
 * Excluded automatically: dynamic routes ([...]), non-page endpoints
 * (.ts/.js), and redirect stubs (pages whose only job is to forward a
 * legacy URL — they import RedirectPage or call Astro.redirect).
 *
 * The comparison logic is shared (ecosystem-site-core) so all sites stay
 * consistent; this script only gathers the per-site inputs.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import {
	findOrphanPages,
	routeFromPagePath,
} from "@semio-community/ecosystem-site-core";

const root = process.cwd();
const pagesDir = join(root, "src/pages");
const configPath = join(root, "src/site.config.ts");

// Intentionally-unlinked routes (home + error page by default). Add a
// route here only if a page is deliberately reachable without a nav link
// (e.g. linked from a bespoke component, or a legal/tooling page).
const ALLOWLIST = ["/", "/404/"];

function walk(dir) {
	const out = [];
	for (const name of readdirSync(dir)) {
		const full = join(dir, name);
		if (statSync(full).isDirectory()) out.push(...walk(full));
		else out.push(full);
	}
	return out;
}

const pageRoutes = [];
for (const file of walk(pagesDir)) {
	const route = routeFromPagePath(relative(pagesDir, file));
	if (route === null) continue; // dynamic route or non-page endpoint
	const content = readFileSync(file, "utf8");
	// Redirect stubs are intentional canonicalization of legacy URLs,
	// not orphans — skip them.
	if (/\bRedirectPage\b/.test(content) || /Astro\.redirect\s*\(/.test(content)) {
		continue;
	}
	pageRoutes.push(route);
}

// Every "/segment/"-shaped route literal in the site config counts as
// "linked" — this captures menuLinks paths, subroutes, and section
// hrefs in one pass. Conservative: a genuinely-orphaned page appears
// nowhere here, so it is still flagged.
const config = readFileSync(configPath, "utf8");
const linkedRoutes = [
	...new Set(
		[...config.matchAll(/["'`](\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\/)["'`#]/gi)].map(
			(m) => m[1],
		),
	),
];

const orphans = findOrphanPages({ pageRoutes, linkedRoutes, allowlist: ALLOWLIST });

if (orphans.length > 0) {
	console.error(
		"\n✖ Orphan page(s) — exist under src/pages but are not linked from menuLinks and not allow-listed:\n",
	);
	for (const o of orphans) console.error(`    ${o}`);
	console.error(
		"\nResolve each by one of:\n" +
			"  • link it in src/site.config.ts (menuLinks), or\n" +
			"  • add it to ALLOWLIST in scripts/check-orphan-pages.mjs (if intentionally unlinked), or\n" +
			"  • delete the page file.\n",
	);
	process.exit(1);
}

console.log(`✓ No orphan pages (${pageRoutes.length} static page routes checked).`);
