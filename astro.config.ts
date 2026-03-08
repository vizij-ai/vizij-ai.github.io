import fs from "node:fs";
import path from "node:path";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
// import tailwind from "@astrojs/tailwind"; // Removed for Tailwind v4
import icon from "astro-icon";
import robotsTxt from "astro-robots-txt";
import webmanifest from "astro-webmanifest";
import { defineConfig, envField } from "astro/config";
import type { PluginOption } from "vite";
import { siteConfig } from "./src/site.config";

// Remark plugins
import remarkDirective from "remark-directive"; /* handle ::: directives as nodes */
import { remarkAdmonitions } from "./src/plugins/remark-admonitions"; /* add admonitions */
import { remarkReadingTime } from "./src/plugins/remark-reading-time";

// Rehype plugins
import rehypeExternalLinks from "rehype-external-links";
import rehypeUnwrapImages from "rehype-unwrap-images";

import { transformerMetaHighlight, transformerNotationDiff } from "@shikijs/transformers";
import rehypePrettyCode from "rehype-pretty-code";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	image: {
		domains: ["webmention.io"],
	},
	integrations: [
		icon(),
		react(),
		// Tailwind v4 is handled via Vite plugin below
		sitemap(),
		mdx(),
		robotsTxt(),
		webmanifest({
			// See: https://github.com/alextim/astro-lib/blob/main/packages/astro-webmanifest/README.md
			/**
			 * required
			 **/
			name: siteConfig.title,
			/**
			 * optional
			 **/
			// short_name: "Astro_Citrus",
			description: siteConfig.description,
			lang: siteConfig.lang,
			icon: "public/icon.svg", // the source for generating favicon & icons
			icons: [
				{
					src: "icons/apple-touch-icon.png", // used in src/components/BaseHead.astro L:26
					sizes: "180x180",
					type: "image/png",
				},
				{
					src: "icons/icon-192.png",
					sizes: "192x192",
					type: "image/png",
				},
				{
					src: "icons/icon-512.png",
					sizes: "512x512",
					type: "image/png",
				},
			],
			start_url: "/",
			background_color: "#1d1f21",
			theme_color: "#2bbc8a",
			display: "standalone",
			config: {
				insertFaviconLinks: false,
				insertThemeColorMeta: false,
				insertManifestLink: false,
			},
		}),
	],
	markdown: {
		syntaxHighlight: false,

		remarkPlugins: [remarkReadingTime, remarkDirective, remarkAdmonitions],
		remarkRehype: {
			footnoteLabelProperties: {
				className: [""],
			},
			footnoteBackContent: "⤴",
		},

		rehypePlugins: [
			[
				rehypeExternalLinks,
				{
					rel: ["nofollow", "noreferrer"],
					target: "_blank",
				},
			],

			[
				rehypePrettyCode,
				{
					theme: {
						light: "rose-pine-dawn", // after changing the theme, the server needs to be restarted
						dark: "rose-pine", // after changing the theme, the server needs to be restarted
					},

					transformers: [transformerNotationDiff(), transformerMetaHighlight()],
				},
			],
			rehypeUnwrapImages,
		],
	},
	// https://docs.astro.build/en/guides/prefetch/
	prefetch: true,
	site: "https://vizij.ai/",
	// Add dynamic base path for PR previews
	base: process.env.PR_PREVIEW_PATH || "/",
	vite: {
		resolve: {
			dedupe: ["react", "react-dom"],
		},
		ssr: {
			noExternal: [
				"@semio-community/ecosystem-site-core",
				/^@radix-ui\/react-/,
				/^motion(\/.*)?$/,
				/^framer-motion(\/.*)?$/,
			],
		},
		build: {
			sourcemap: true, // Source maps generation
		},
		assetsInclude: ["**/*.wasm"],
		optimizeDeps: {
			exclude: [
				"@resvg/resvg-js",
				"@vizij/orchestrator-wasm",
				"@vizij/node-graph-wasm",
				"@vizij/animation-wasm",
			],
		},
		// biome-ignore lint/suspicious/noExplicitAny: tailwindcss vite plugin type is not assignable without cast
		plugins: [rawFonts([".ttf", "otf", ".woff"]), tailwindcss() as any, serveSrcImagesDev()],
	},
	env: {
		schema: {
			WEBMENTION_API_KEY: envField.string({
				context: "server",
				access: "secret",
				optional: true,
			}),
			WEBMENTION_URL: envField.string({
				context: "client",
				access: "public",
				optional: true,
			}),
			WEBMENTION_PINGBACK: envField.string({
				context: "client",
				access: "public",
				optional: true,
			}),
		},
	},
	server: {
		// port: 1234,
		host: true,
	},
});

function rawFonts(ext: string[]) {
	return {
		name: "vite-plugin-raw-fonts",
		// @ts-expect-error:next-line
		transform(_, id) {
			if (ext.some((e) => id.endsWith(e))) {
				const buffer = fs.readFileSync(id);
				return {
					code: `export default ${JSON.stringify(buffer)}`,
					map: null,
				};
			}
		},
	};
}

function serveSrcImagesDev(): PluginOption {
	const contentTypeFor = (filePath: string) => {
		const ext = path.extname(filePath).toLowerCase();
		switch (ext) {
			case ".jpg":
			case ".jpeg":
				return "image/jpeg";
			case ".png":
				return "image/png";
			case ".svg":
				return "image/svg+xml";
			case ".webp":
				return "image/webp";
			default:
				return "application/octet-stream";
		}
	};

	const rewriteLegacy = (url: string) => {
		let p = url;
		if (p.startsWith("/@/")) {
			p = p.replace(/^\/@/, "/src");
		}
		// Map old collection-based buckets to use-based buckets.
		if (p.startsWith("/src/assets/images/people/")) {
			const file = path.posix.basename(p).toLowerCase();
			const bucket = file.includes("hero") ? "heroes" : "avatars";
			return p.replace("/src/assets/images/people/", `/src/assets/images/${bucket}/`);
		}
		if (p.startsWith("/src/assets/images/organizations/")) {
			const file = path.posix.basename(p).toLowerCase();
			const bucket = file.includes("hero") ? "heroes" : "logos";
			return p.replace("/src/assets/images/organizations/", `/src/assets/images/${bucket}/`);
		}
		if (p.startsWith("/src/assets/images/events/")) {
			return p.replace("/src/assets/images/events/", "/src/assets/images/logos/");
		}
		if (p.startsWith("/src/assets/images/hardware/")) {
			const file = path.posix.basename(p).toLowerCase();
			const bucket = file.includes("hero") ? "heroes" : "logos";
			return p.replace("/src/assets/images/hardware/", `/src/assets/images/${bucket}/`);
		}
		if (p.startsWith("/src/assets/images/software/")) {
			const file = path.posix.basename(p).toLowerCase();
			const bucket = file.includes("hero") || file.includes("cover") ? "heroes" : "logos";
			return p.replace("/src/assets/images/software/", `/src/assets/images/${bucket}/`);
		}
		return p;
	};

	return {
		name: "serve-src-images-dev",
		apply: "serve" as const,
		configureServer(server: import("vite").ViteDevServer) {
			server.middlewares.use((req, res, next) => {
				const rawUrl = (req.url || "").split("?")[0] || "";
				const normalized = rewriteLegacy(rawUrl);
				if (!normalized.startsWith("/src/assets/images/")) return next();
				const filePath = path.resolve(normalized.slice(1)); // strip leading slash
				if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
					res.statusCode = 404;
					res.end();
					return;
				}
				res.setHeader("Content-Type", contentTypeFor(filePath));
				fs.createReadStream(filePath).pipe(res);
			});
		},
	};
}
