import { resolveSitePath } from "../utils/url";
import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

type RehypeBasePathContentOptions = {
	basePath?: string;
};

function rewriteUrlProperty(
	node: Element,
	property: "href" | "src" | "poster",
	basePath: string,
) {
	const value = node.properties?.[property];
	if (typeof value === "string") {
		node.properties[property] = resolveSitePath(value, basePath);
		return;
	}
	if (Array.isArray(value)) {
		node.properties[property] = value.map((entry) =>
			typeof entry === "string" ? resolveSitePath(entry, basePath) : entry,
		);
	}
}

const rawHtmlAttributePattern =
	/\b(href|src|poster)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;

function rewriteRawHtmlAttributes(fragment: string, basePath: string) {
	return fragment.replace(
		rawHtmlAttributePattern,
		(match, attribute, doubleQuoted, singleQuoted, unquoted) => {
			const value = doubleQuoted ?? singleQuoted ?? unquoted;
			if (typeof value !== "string") return match;

			const rewrittenValue = resolveSitePath(value, basePath);
			if (doubleQuoted !== undefined) {
				return `${attribute}="${rewrittenValue}"`;
			}
			if (singleQuoted !== undefined) {
				return `${attribute}='${rewrittenValue}'`;
			}
			return `${attribute}=${rewrittenValue}`;
		},
	);
}

/**
 * Rewrites root-relative href/src values emitted by synced markdown so they
 * remain correct under Astro base paths such as PR previews.
 */
export const rehypeBasePathContent: Plugin<[RehypeBasePathContentOptions?], Root> =
	(options = {}) => {
		const basePath = options.basePath ?? "/";

		return (tree) => {
			visit(tree, (node) => {
				if (node.type === "element") {
					rewriteUrlProperty(node, "href", basePath);
					rewriteUrlProperty(node, "src", basePath);
					rewriteUrlProperty(node, "poster", basePath);
				}

				if (node.type === "raw" && typeof node.value === "string") {
					node.value = rewriteRawHtmlAttributes(node.value, basePath);
				}
			});
		};
	};
