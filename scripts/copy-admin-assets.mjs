#!/usr/bin/env node

/**
 * Copies source images into the Decap admin bundle so /admin/src/assets/images
 * URLs resolve in production CMS previews.
 */

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "src/assets/images");
const targetDir = path.join(root, "public/admin/src/assets/images");

async function ensureDir(dir) {
	await fs.promises.mkdir(dir, { recursive: true });
}

async function copyImages() {
	if (!fs.existsSync(sourceDir)) {
		console.warn(`[cms:copy-assets] Source directory not found, skipping: ${sourceDir}`);
		return;
	}

	await ensureDir(path.dirname(targetDir));
	await fs.promises.rm(targetDir, { recursive: true, force: true });
	await fs.promises.cp(sourceDir, targetDir, { recursive: true });
	console.log(`[cms:copy-assets] Copied ${sourceDir} -> ${path.relative(root, targetDir)}`);
}

copyImages().catch((err) => {
	console.error("[cms:copy-assets] Failed to copy images", err);
	process.exitCode = 1;
});
