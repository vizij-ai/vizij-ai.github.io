import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const siteRoot = process.cwd();
const docsRoot = path.resolve(siteRoot, "../vizij-docs/current_documentation/guidebook");
const manifestPath = path.join(docsRoot, "public_projection_manifest.json");
const generatedRoot = path.join(siteRoot, "src/generated/guidebook");
const generatedPagesRoot = path.join(generatedRoot, "pages");
const generatedHubsPath = path.join(generatedRoot, "hubs.json");
const generatedRedirectsPath = path.join(generatedRoot, "redirects.json");

const repoGuidebookUrl =
	"https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook";

const bucketOverviewRouteMap = new Map([
	["introduction/README.md", "/docs/"],
	["control/README.md", "/docs/"],
	["integrate/README.md", "/docs/"],
	["deploy/README.md", "/docs/"],
	["experience/README.md", "/tutorials/"],
	["customize/README.md", "/tutorials/"],
	["reference/README.md", "/docs/"],
	["support/README.md", "/docs/"],
	["README.md", "/docs/"],
]);

const mediaExtensions = new Set([
	".csv",
	".css",
	".fbx",
	".gif",
	".glb",
	".gltf",
	".html",
	".js",
	".json",
	".jpeg",
	".jpg",
	".jsx",
	".mdx",
	".mp3",
	".mp4",
	".obj",
	".png",
	".svg",
	".ts",
	".tsx",
	".usdz",
	".wav",
	".webm",
	".yaml",
	".yml",
]);

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}

function ensureDir(directoryPath) {
	fs.mkdirSync(directoryPath, { recursive: true });
}

function writeJson(filePath, value) {
	ensureDir(path.dirname(filePath));
	fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function normalizeRelativePath(filePath) {
	return filePath.replaceAll("\\", "/").replace(/^\.\/+/, "");
}

function normalizePublicAssetBase(publicAssetBase) {
	const cleaned = (publicAssetBase || "/guidebook-assets").replace(/\/+$/, "");
	return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
}

function toPublicAssetDirectory(publicAssetBase) {
	return path.join(siteRoot, "public", publicAssetBase.replace(/^\/+/, ""));
}

function titleCase(value) {
	return value
		.split(/[\s_-]+/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function stripMarkdown(value) {
	return value
		.replace(/<br\s*\/?>/gi, " ")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
		.replace(/\*\*([^*]+)\*\*/g, "$1")
		.replace(/\*([^*]+)\*/g, "$1")
		.replace(/<\/?[^>]+>/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

function slugify(value) {
	return stripMarkdown(value)
		.toLowerCase()
		.replace(/&/g, "and")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

function extractFirstParagraph(section) {
	if (!section) return "";
	const cleaned = section
		.split(/\n{2,}/)
		.map((part) => part.trim())
		.find((part) => part && !part.startsWith("|") && !part.startsWith("```"));
	return cleaned ? stripMarkdown(cleaned) : "";
}

function extractListItems(section) {
	if (!section) return [];

	const items = section
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => /^(\d+\.|-|\*)\s+/.test(line))
		.map((line) => stripMarkdown(line.replace(/^(\d+\.|-|\*)\s+/, "")))
		.filter(Boolean);

	if (items.length > 0) {
		return items;
	}

	const paragraph = extractFirstParagraph(section);
	return paragraph ? [paragraph] : [];
}

function sectionBody(markdown, heading) {
	const lines = markdown.split("\n");
	const startIndex = lines.findIndex((line) => line.trim() === `## ${heading}`);
	if (startIndex === -1) return "";

	const collected = [];
	for (let index = startIndex + 1; index < lines.length; index += 1) {
		if (lines[index].startsWith("## ")) break;
		collected.push(lines[index]);
	}

	return collected.join("\n").trim();
}

function sectionBodyAny(markdown, headings) {
	for (const heading of headings) {
		const body = sectionBody(markdown, heading);
		if (body) {
			return body;
		}
	}

	return "";
}

function extractHeadings(markdown) {
	return [...markdown.matchAll(/^## (.+)$/gm)].map((match) => ({
		depth: 2,
		slug: slugify(match[1]),
		text: stripMarkdown(match[1]),
	}));
}

function extractMarkdownLinks(value) {
	return [...value.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map((match) => ({
		label: stripMarkdown(match[1]),
		href: match[2],
	}));
}

function extractFirstMarkdownLink(value) {
	return value.match(/\[[^\]]+\]\(([^)]+)\)/)?.[1];
}

function extractLabeledValue(section, label) {
	const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const match = section.match(
		new RegExp(`\\*\\*${escapedLabel}:\\*\\*\\s*([^\\n]+)`, "i"),
	);
	return match ? stripMarkdown(match[1]) : "";
}

function extractCurrentValue(value) {
	if (!value) return "";
	const match = value.match(/Current:\s*(.+?)(?:<br>|$)/i);
	return match ? stripMarkdown(match[1]) : "";
}

function resolveGuidebookLink(rawTarget, sourceRelativePath, routesBySource, publicAssetBase) {
	if (
		!rawTarget ||
		rawTarget.startsWith("http://") ||
		rawTarget.startsWith("https://") ||
		rawTarget.startsWith("mailto:") ||
		rawTarget.startsWith("#")
	) {
		return rawTarget;
	}

	if (rawTarget.startsWith("/assets/")) {
		return `${publicAssetBase}/${rawTarget.slice("/assets/".length)}`;
	}

	if (rawTarget.startsWith("/")) {
		return rawTarget;
	}

	const [targetPath, hash = ""] = rawTarget.split("#");
	const sourceDir = sourceRelativePath
		? path.posix.dirname(normalizeRelativePath(sourceRelativePath))
		: "";
	const normalizedTarget = normalizeRelativePath(
		path.posix.normalize(path.posix.join(sourceDir, targetPath)),
	);
	const hashSuffix = hash ? `#${slugify(hash)}` : "";

	if (normalizedTarget.startsWith("assets/")) {
		return `${publicAssetBase}/${normalizedTarget.slice("assets/".length)}`;
	}

	const extension = path.posix.extname(normalizedTarget).toLowerCase();
	if (mediaExtensions.has(extension)) {
		if (normalizedTarget.includes("/assets/")) {
			return `${publicAssetBase}/${normalizedTarget.split("/assets/")[1]}`;
		}
		if (extension === ".mdx") {
			return `${repoGuidebookUrl}/${normalizedTarget}`;
		}
		return `${repoGuidebookUrl}/${normalizedTarget}`;
	}

	const route = routesBySource.get(normalizedTarget);
	if (route) {
		return `${route.canonicalPath}${hashSuffix}`;
	}

	const bucketRoute = bucketOverviewRouteMap.get(normalizedTarget);
	if (bucketRoute) {
		return bucketRoute;
	}

	if (normalizedTarget.endsWith(".md")) {
		return `${repoGuidebookUrl}/${normalizedTarget}`;
	}

	return rawTarget;
}

function rewriteMarkdownLinks(markdown, sourceRelativePath, routesBySource, publicAssetBase) {
	const segments = markdown.split(/(```[\s\S]*?```)/g);

	return segments
		.map((segment) => {
			if (segment.startsWith("```mermaid")) {
				const mermaidBody = segment
					.replace(/^```mermaid\s*/, "")
					.replace(/```$/, "")
					.trim();
				return `<pre class="guidebook-mermaid mermaid">\n${escapeHtml(mermaidBody)}\n</pre>`;
			}

			if (segment.startsWith("```")) {
				return segment;
			}

			const withHtmlAttributeRewrites = segment.replace(
				/\b(src|href)=["']([^"']+)["']/g,
				(_match, attribute, target) => {
					const resolved = resolveGuidebookLink(
						target,
						sourceRelativePath,
						routesBySource,
						publicAssetBase,
					);
					return `${attribute}="${resolved}"`;
				},
			);

			return withHtmlAttributeRewrites.replace(/(!?\[[^\]]*\])\(([^)]+)\)/g, (_match, label, target) => {
					const resolved = resolveGuidebookLink(
						target,
						sourceRelativePath,
						routesBySource,
						publicAssetBase,
					);
					return `${label}(${resolved})`;
				},
			);
		})
		.join("");
}

function stripSection(markdown, heading) {
	return markdown
		.replace(
			new RegExp(
				`(^## ${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\n[\\s\\S]*?)(?=^## |\\Z)`,
				"m",
			),
			"",
		)
		.trim();
}

function stripProjectedGuidebookSections(markdown) {
	const sectionsToStrip = [
		"Guidebook Context",
		"Page Context",
		"Reader Outcome",
		"Success Check",
		"Implementation Anchors",
	];

	return sectionsToStrip.reduce((value, heading) => stripSection(value, heading), markdown);
}

function escapeHtml(value) {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

function buildGuidebookMediaFigure(src, alt, caption) {
	const safeSrc = escapeHtml(src);
	const safeAlt = escapeHtml(alt);
	const safeCaption = caption ? escapeHtml(caption) : "";
	const extension = path.posix.extname(src).toLowerCase();
	if (extension === ".mp4" || extension === ".webm") {
		return `<figure class="guidebook-media">\n<video controls playsinline preload="metadata" src="${safeSrc}"></video>\n${
			safeCaption ? `<figcaption>${safeCaption}</figcaption>\n` : ""
		}</figure>`;
	}

	return `<figure class="guidebook-media">\n<img src="${safeSrc}" alt="${safeAlt}" loading="lazy" />\n${
		safeCaption ? `<figcaption>${safeCaption}</figcaption>\n` : ""
	}</figure>`;
}

function rewriteGuidebookMedia(markdown) {
	return markdown.replace(
		/!\[([^\]]*)\]\(([^)]+)\)\n\n_Caption:\s*([^\n]+)_/g,
		(_match, alt, src, caption) =>
			buildGuidebookMediaFigure(src, alt, stripMarkdown(caption)),
	);
}

function extractGuidebookContext(
	markdown,
	sourceRelativePath,
	routesBySource,
	publicAssetBase,
	fallbackBucket,
) {
	const body = sectionBodyAny(markdown, ["Guidebook Context", "Page Context"]);
	if (!body) {
		return {
			bucket: fallbackBucket,
			depth: "Guidebook",
			moduleType: "guide",
			bucketChain: "",
			depthLadder: "",
			modulePosition: "",
			bucketOverview: undefined,
			referenceBridges: [],
		};
	}

	const rows = body
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.startsWith("|") && !line.includes("---"))
		.map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));

	const rowMap = new Map(rows.map(([key, value]) => [key, value]));
	const bucketOverviewHref =
		extractFirstMarkdownLink(rowMap.get("Bucket overview") || "") ||
		extractFirstMarkdownLink(extractLabeledValue(body, "Bucket overview"));
	const bucketOverview = bucketOverviewHref
		? {
				label:
					stripMarkdown(rowMap.get("Bucket overview") || "") ||
					stripMarkdown(extractLabeledValue(body, "Bucket overview")) ||
					"Bucket overview",
				href: resolveGuidebookLink(
					bucketOverviewHref,
					sourceRelativePath,
					routesBySource,
					publicAssetBase,
				),
			}
		: undefined;

	const bucket =
		extractCurrentValue(rowMap.get("Bucket chain")) ||
		extractLabeledValue(body, "Bucket") ||
		fallbackBucket;
	const depth =
		extractCurrentValue(rowMap.get("Depth ladder in this bucket")) ||
		extractLabeledValue(body, "Depth role") ||
		"Guidebook";
	const moduleType =
		stripMarkdown(rowMap.get("Module type") || "") ||
		extractLabeledValue(body, "Module type") ||
		"guide";

	return {
		bucket,
		depth,
		moduleType,
		bucketChain: stripMarkdown(rowMap.get("Bucket chain") || ""),
		depthLadder: stripMarkdown(rowMap.get("Depth ladder in this bucket") || ""),
		modulePosition: stripMarkdown(rowMap.get("Module position in this bucket") || ""),
		bucketOverview,
		referenceBridges: extractMarkdownLinks(rowMap.get("Reference bridges") || "").map((link) => ({
			label: link.label,
			href: resolveGuidebookLink(
				link.href,
				sourceRelativePath,
				routesBySource,
				publicAssetBase,
			),
		})),
	};
}

function serializeFrontmatter(frontmatter, body) {
	return `---\n${YAML.stringify(frontmatter)}---\n\n${body.trim()}\n`;
}

function stripLeadingGuidebookMetadata(markdown) {
	const tagCommentMatch = markdown.match(/^<!--[\s\S]*?-->\s*/);
	const tagComment = tagCommentMatch ? tagCommentMatch[0] : "";
	let remainder = markdown.slice(tagComment.length);

	while (remainder.startsWith("> ")) {
		const lineBreakIndex = remainder.indexOf("\n");
		if (lineBreakIndex === -1) {
			remainder = "";
			break;
		}
		remainder = remainder.slice(lineBreakIndex + 1);
	}

	remainder = remainder.replace(/^\s+/, "");
	return remainder;
}

function parseSourceDocument(relativePath) {
	const absolutePath = path.join(docsRoot, relativePath);
	const raw = fs.readFileSync(absolutePath, "utf8");
	const withoutMetadata = stripLeadingGuidebookMetadata(raw);
	const titleMatch = withoutMetadata.match(/^# (.+)$/m);
	assert(titleMatch, `Guidebook page is missing a top-level title: ${relativePath}`);

	const title = stripMarkdown(titleMatch[1]);
	const rawBody = withoutMetadata.replace(/^# .+\n?/, "").trim();
	const projectedBody = stripProjectedGuidebookSections(rawBody);
	const fallbackBucket =
		relativePath === "README.md"
			? "Guidebook"
			: titleCase(path.posix.dirname(relativePath).split("/")[0] || "Guidebook");
	const outcome = extractFirstParagraph(sectionBody(rawBody, "Reader Outcome"));
	const prerequisites = [
		...extractListItems(sectionBody(rawBody, "What You Need")),
		...extractListItems(sectionBody(rawBody, "Starting State")),
	];
	const successCheck = extractListItems(sectionBody(rawBody, "Success Check"));
	const summary = outcome || extractFirstParagraph(sectionBody(rawBody, "Module Notes")) || title;

	return {
		projectedBody,
		rawBody,
		fallbackBucket,
		hasMermaid: /```mermaid/.test(projectedBody),
		headings: extractHeadings(projectedBody),
		outcome,
		prerequisites,
		summary,
		successCheck,
		title,
	};
}

function copyDirectory(source, destination) {
	if (!fs.existsSync(source)) {
		return;
	}

	ensureDir(destination);
	const entries = fs.readdirSync(source, { withFileTypes: true });
	for (const entry of entries) {
		const sourcePath = path.join(source, entry.name);
		const destinationPath = path.join(destination, entry.name);
		if (entry.isDirectory()) {
			copyDirectory(sourcePath, destinationPath);
		} else {
			fs.copyFileSync(sourcePath, destinationPath);
		}
	}
}

function buildCanonicalPath(surface, slug) {
	return `/${surface}/${slug}/`;
}

function loadManifest() {
	assert(fs.existsSync(manifestPath), `Missing guidebook projection manifest: ${manifestPath}`);
	const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

	assert(
		Number.isInteger(manifest.schemaVersion),
		"Guidebook manifest must include an integer schemaVersion.",
	);
	assert(
		Array.isArray(manifest.pages) && manifest.pages.length > 0,
		"Guidebook manifest must include a non-empty pages array.",
	);
	assert(
		manifest.hubs?.docs && manifest.hubs?.tutorials,
		"Guidebook manifest must define docs and tutorials hub metadata.",
	);

	return manifest;
}

function buildManifestProjections(manifest) {
	const projections = manifest.pages
		.filter((page) => page.publish !== false)
		.map((page) => {
			assert(page.pageId, "Every published guidebook page must define pageId.");
			assert(page.moduleId, `Page ${page.pageId} is missing moduleId.`);
			assert(page.sourceModuleId, `Page ${page.pageId} is missing sourceModuleId.`);
			assert(page.sourcePath, `Page ${page.pageId} is missing sourcePath.`);
			assert(page.surface === "docs" || page.surface === "tutorials", `Page ${page.pageId} has invalid surface.`);
			assert(page.slug, `Page ${page.pageId} is missing slug.`);
			assert(typeof page.order === "number", `Page ${page.pageId} is missing numeric order.`);
			assert(page.routeRole, `Page ${page.pageId} is missing routeRole.`);

			const sourcePath = normalizeRelativePath(page.sourcePath);
			const absoluteSourcePath = path.join(docsRoot, sourcePath);
			assert(
				fs.existsSync(absoluteSourcePath),
				`Manifest source path does not exist: ${sourcePath}`,
			);

			return {
				...page,
				canonical: page.canonical !== false,
				canonicalPath: buildCanonicalPath(page.surface, page.slug),
				redirects: page.redirects || [],
				sourcePath,
			};
		});

	const pageIds = new Set();
	const canonicalPaths = new Set();
	for (const projection of projections) {
		assert(!pageIds.has(projection.pageId), `Duplicate pageId in guidebook manifest: ${projection.pageId}`);
		assert(
			!canonicalPaths.has(projection.canonicalPath),
			`Duplicate canonical route in guidebook manifest: ${projection.canonicalPath}`,
		);
		pageIds.add(projection.pageId);
		canonicalPaths.add(projection.canonicalPath);
	}

	const projectionsBySource = new Map();
	for (const projection of projections) {
		const list = projectionsBySource.get(projection.sourcePath) || [];
		list.push(projection);
		projectionsBySource.set(projection.sourcePath, list);
	}

	const canonicalProjectionBySource = new Map();
	for (const [sourcePath, sourceProjections] of projectionsBySource.entries()) {
		const explicitCanonicalProjections = sourceProjections.filter((projection) => projection.canonical);
		assert(
			explicitCanonicalProjections.length <= 1,
			`Multiple canonical projections declared for ${sourcePath}.`,
		);
		canonicalProjectionBySource.set(
			sourcePath,
			explicitCanonicalProjections[0] || sourceProjections[0],
		);
	}

	return { canonicalProjectionBySource, projections };
}

function buildPagePayloads(projections, canonicalProjectionBySource, publicAssetBase) {
	const uniqueSourcePaths = [...new Set(projections.map((projection) => projection.sourcePath))];
	const sourceDocuments = new Map(
		uniqueSourcePaths.map((sourcePath) => [sourcePath, parseSourceDocument(sourcePath)]),
	);
	const routesBySource = new Map(
		[...canonicalProjectionBySource.entries()].map(([sourcePath, projection]) => [
			sourcePath,
			{
				canonicalPath: projection.canonicalPath,
				surface: projection.surface,
			},
		]),
	);

	return projections.map((projection) => {
		const source = sourceDocuments.get(projection.sourcePath);
		assert(source, `Missing parsed source document for ${projection.sourcePath}`);

		const context = extractGuidebookContext(
			source.rawBody,
			projection.sourcePath,
			routesBySource,
			publicAssetBase,
			source.fallbackBucket,
		);
		const title = projection.titleOverride || source.title;
		const summary = projection.summaryOverride || source.summary;

		return {
			...projection,
			bucket: context.bucket || source.fallbackBucket,
			context: {
				bucketChain: context.bucketChain,
				depthLadder: context.depthLadder,
				modulePosition: context.modulePosition,
				moduleType: context.moduleType,
				bucketOverview: context.bucketOverview,
				referenceBridges: context.referenceBridges,
			},
			depth: context.depth || "Guidebook",
			headings: source.headings,
			hasMermaid: source.hasMermaid,
			moduleType: context.moduleType || "guide",
			outcome: source.outcome,
			prerequisites: source.prerequisites,
			renderedBody: rewriteGuidebookMedia(
				rewriteMarkdownLinks(
					source.projectedBody,
					projection.sourcePath,
					routesBySource,
					publicAssetBase,
				),
			),
			successCheck: source.successCheck,
			summary,
			title,
		};
	});
}

function buildRedirects(pagePayloads) {
	const knownPaths = new Set(pagePayloads.map((page) => page.canonicalPath));
	const redirects = [];

	for (const page of pagePayloads) {
		for (const alias of page.redirects) {
			const aliasPath = buildCanonicalPath(page.surface, alias);
			assert(
				!knownPaths.has(aliasPath),
				`Redirect alias conflicts with an existing canonical path: ${aliasPath}`,
			);
			redirects.push({
				from: alias,
				surface: page.surface,
				title: page.title,
				to: page.canonicalPath,
			});
			knownPaths.add(aliasPath);
		}
	}

	return redirects;
}

function validateAdjacentRouteLinks(pagePayloads) {
	const knownRoutes = new Set(pagePayloads.map((page) => page.canonicalPath));
	for (const page of pagePayloads) {
		for (const link of [page.prev, page.next].filter(Boolean)) {
			if (link.href.startsWith("/docs/") || link.href.startsWith("/tutorials/")) {
				assert(
					knownRoutes.has(link.href),
					`Adjacent route ${link.href} for ${page.pageId} does not resolve to a generated page.`,
				);
			}
		}
	}
}

function buildHubContent(hubManifest, pageById) {
	const resolvePage = (pageId) => {
		const page = pageById.get(pageId);
		assert(page, `Unknown guidebook page reference in hub manifest: ${pageId}`);
		return page;
	};

	return {
		eyebrow: hubManifest.eyebrow,
		title: hubManifest.title,
		description: hubManifest.description,
		presentationStyle: hubManifest.presentationStyle,
		heroFigure: hubManifest.heroFigure,
		actions: hubManifest.actions || [],
		decisionPanels: hubManifest.decisionPanels || [],
		progressSteps: hubManifest.progressSteps || [],
		routeStages: (hubManifest.routeStages || []).map((pageId, index) => {
			const page = resolvePage(pageId);
			return {
				eyebrow: `Stage ${index + 1}`,
				title: page.title,
				description: page.summary,
				href: page.canonicalPath,
				implementation: page.implementationAnchors?.[0]?.label,
				outcome: page.outcome || page.summary,
			};
		}),
		sections: (hubManifest.sections || []).map((section) => ({
			id: section.id,
			title: section.title,
			subtitle: section.subtitle,
			cards: (section.items || []).map((pageId) => {
				const page = resolvePage(pageId);
				return {
					id: page.pageId,
					title: page.title,
					description: page.summary,
					href: page.canonicalPath,
					meta: page.routeRoleLabel || page.routeRole,
					badge: titleCase(page.moduleType),
					detailRows: [
						{ label: "Bucket", value: page.bucket },
						{ label: "Depth", value: page.depth },
					],
				};
			}),
		})),
	};
}

function writeGeneratedPages(pagePayloads) {
	fs.rmSync(generatedRoot, { recursive: true, force: true });
	ensureDir(generatedPagesRoot);

	for (const page of pagePayloads) {
		const outputPath = path.join(generatedPagesRoot, page.surface, `${page.slug}.md`);
		ensureDir(path.dirname(outputPath));

		const frontmatter = {
			pageId: page.pageId,
			moduleId: page.moduleId,
			sourceModuleId: page.sourceModuleId,
			sourcePath: page.sourcePath,
			surface: page.surface,
			publish: true,
			routeSlug: page.slug,
			canonicalPath: page.canonicalPath,
			routeRole: page.routeRole,
			routeRoleLabel: page.routeRoleLabel,
			title: page.title,
			summary: page.summary,
			moduleType: page.moduleType,
			bucket: page.bucket,
			depth: page.depth,
			hubGroup: page.hubGroup,
			order: page.order,
			redirects: page.redirects,
			outcome: page.outcome,
			prerequisites: page.prerequisites,
			successCheck: page.successCheck,
			headings: page.headings,
			context: page.context,
			prev: page.prev || undefined,
			next: page.next || undefined,
			implementationAnchors: page.implementationAnchors || [],
			demoLinks: page.demoLinks || [],
			labId: page.labId || undefined,
			hasMermaid: page.hasMermaid,
		};

		fs.writeFileSync(
			outputPath,
			serializeFrontmatter(frontmatter, page.renderedBody),
			"utf8",
		);
	}
}

function main() {
	const manifest = loadManifest();
	const publicAssetBase = normalizePublicAssetBase(manifest.publicAssetBase);
	const publicAssetsRoot = toPublicAssetDirectory(publicAssetBase);
	const { canonicalProjectionBySource, projections } = buildManifestProjections(manifest);
	const pagePayloads = buildPagePayloads(
		projections,
		canonicalProjectionBySource,
		publicAssetBase,
	);
	validateAdjacentRouteLinks(pagePayloads);

	const pageById = new Map(pagePayloads.map((page) => [page.pageId, page]));
	const hubs = {
		docs: buildHubContent(manifest.hubs.docs, pageById),
		tutorials: buildHubContent(manifest.hubs.tutorials, pageById),
	};
	const redirects = buildRedirects(pagePayloads);

	writeGeneratedPages(pagePayloads);
	fs.rmSync(publicAssetsRoot, { recursive: true, force: true });
	copyDirectory(path.join(docsRoot, "assets"), publicAssetsRoot);
	writeJson(generatedHubsPath, hubs);
	writeJson(generatedRedirectsPath, redirects);

	console.log(
		`Generated ${pagePayloads.length} guidebook pages, ${redirects.length} redirects, and synced guidebook assets from ${path.relative(siteRoot, manifestPath)}.`,
	);
}

main();
