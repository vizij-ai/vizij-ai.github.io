import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const PORT = Number(process.env.RENDER_PORT || 4360);
const HOST = "127.0.0.1";
const BASE_URL = `http://${HOST}:${PORT}`;
const RENDER_URL = `${BASE_URL}/tools/render-module`;
const OUTPUT_DIR = path.resolve("public/configurations/images");

const modules = [
  { id: "head", filename: "head-render.png" },
  { id: "speaker", filename: "speaker-render.png" },
  { id: "torso", filename: "torso-render.png" },
  { id: "chest", filename: "chest-render.png" },
  { id: "arms", filename: "arms-render.png" },
  { id: "base", filename: "base-render.png" },
  { id: "stand", filename: "stand-render.png" },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForServer() {
  const timeoutMs = 45_000;
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE_URL}/`);
      if (res.ok) return;
    } catch {
      // retry
    }
    await sleep(500);
  }
  throw new Error(`Server did not start within ${timeoutMs}ms`);
}

async function run() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const server = spawn(
    "npm",
    ["run", "dev", "--", "--host", HOST, "--port", String(PORT)],
    { stdio: "inherit" },
  );

  let serverReady = false;
  try {
    await waitForServer();
    serverReady = true;

    const browser = await chromium.launch();
    const page = await browser.newPage({
      viewport: { width: 1024, height: 1024 },
      deviceScaleFactor: 2,
    });

    for (const module of modules) {
      const targetUrl = `${RENDER_URL}?id=${module.id}`;
      await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(
        () => document.body.dataset.ready === "true",
        { timeout: 60_000 },
      );
      await sleep(250);

      await page.screenshot({
        path: path.join(OUTPUT_DIR, module.filename),
        omitBackground: true,
      });
    }

    await browser.close();
  } finally {
    if (serverReady) {
      server.kill("SIGTERM");
    } else {
      server.kill("SIGTERM");
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
