import type { APIContext } from "astro";
import type { ImageMetadata } from "astro";
import { promises as fs } from "node:fs";
import path from "node:path";
import React, { type ComponentType, type SVGProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Resvg } from "@resvg/resvg-js";
import {
  User,
  Buildings,
  CpuBolt,
  CodeSquare,
  TestTube,
  CalendarMark,
} from "@solar-icons/react-perf/LineDuotone";
import { renderOgImage } from "@/og/renderer";
import type { OgImageAsset, OgImageProps } from "@/og/types";
import { getAllHardware } from "@/data/hardware";
import { getAllSoftware } from "@/data/software";
import { getAllResearch } from "@/data/research";
import { getAllEvents } from "@/data/events";
import { getAllOrganizations } from "@/data/organizations";
import { getAllPeople } from "@/data/people";
import {
  getStatusLabel,
  getCategoryLabel,
  STATUS_COLORS,
} from "@semio-community/ecosystem-site-core";
import { resolveLogoAsset } from "@/utils/images";

const intlShort = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const intlLong = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const capitalize = (value?: string | null) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : undefined;

const formatDate = (value?: string | Date | null, long = false) => {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return (long ? intlLong : intlShort).format(date);
};

const isVisible = <T extends { data: { draft?: boolean } }>(entry: T) =>
  import.meta.env.PROD ? entry.data.draft !== true : true;

const hasCustomOgImage = (entry: { data: Record<string, unknown> }) =>
  Boolean((entry.data as any)?.ogImage);

const getStatusTone = (status?: string): OgImageProps["statusTone"] => {
  if (!status) return undefined;
  if (!(status in STATUS_COLORS)) return undefined;
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS].chip;
};

const assetRootDirs = [
  path.join(process.cwd(), "src/assets/images"),
  path.join(process.cwd(), "src/content"),
  path.join(process.cwd(), "public"),
];
type AssetIndex = Map<string, string[]>;
const mimeMap: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  svg: "image/svg+xml",
};
function getExtMime(ext: string): string {
  return mimeMap[ext] ?? `image/${ext || "png"}`;
}
async function toDataUrlWithRasterize(
  buffer: Buffer,
  ext: string,
  width?: number,
  height?: number,
): Promise<{ src: string; width?: number; height?: number }> {
  if (ext === "svg" || ext === "svg+xml") {
    const png = new Resvg(buffer).render().asPng();
    const dataUrl = `data:image/png;base64,${Buffer.from(png).toString("base64")}`;
    return { src: dataUrl, width, height };
  }
  const mime = getExtMime(ext);
  return {
    src: `data:${mime};base64,${buffer.toString("base64")}`,
    width,
    height,
  };
}
let assetIndexPromise: Promise<AssetIndex> | null = null;
const assetDataCache = new Map<string, string>();

const BADGE_ICON_COLOR = "#FF9E00";
const BADGE_ICON_SIZE = 200;

const createBadgeIcon = (Icon: ComponentType<SVGProps<SVGSVGElement>>) => {
  const svg = renderToStaticMarkup(
    React.createElement(Icon, {
      width: BADGE_ICON_SIZE,
      height: BADGE_ICON_SIZE,
      color: BADGE_ICON_COLOR,
    }),
  );
  const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  return React.createElement("img", {
    src: dataUrl,
    width: BADGE_ICON_SIZE,
    height: BADGE_ICON_SIZE,
    alt: "",
    style: { display: "block", width: "100%", height: "100%" },
  });
};

async function buildAssetIndex(dir: string, acc: AssetIndex): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await buildAssetIndex(fullPath, acc);
      } else {
        const list = acc.get(entry.name);
        if (list) list.push(fullPath);
        else acc.set(entry.name, [fullPath]);
      }
    }),
  );
}

async function getAssetIndex(): Promise<AssetIndex> {
  if (!assetIndexPromise) {
    const map = new Map<string, string[]>();
    assetIndexPromise = (async () => {
      for (const dir of assetRootDirs) {
        try {
          await buildAssetIndex(dir, map);
        } catch {
          // Directory might not exist; skip it
        }
      }
      return map;
    })();
  }
  return assetIndexPromise;
}

const resolveContentLogo = (images?: {
  logo?: ImageMetadata | string;
  logoUrl?: string;
}) => images?.logo ?? images?.logoUrl ?? null;

function deriveOriginalFileName(src: string): string | null {
  const raw = src.split("/").pop();
  const file = raw?.split("?")[0]?.split("#")[0];
  if (!file) return null;
  const lastDot = file.lastIndexOf(".");
  if (lastDot === -1) return file;
  const ext = file.slice(lastDot + 1).toLowerCase();
  const base = file.slice(0, lastDot);
  // Only strip a trailing hash-like segment (e.g., name.<hash>.ext).
  // Keep legitimate dots in filenames (e.g., hri.2026.png).
  const parts = base.split(".");
  if (parts.length >= 2) {
    const maybeHash = parts[parts.length - 1];
    const looksHashed = /^[a-z0-9_-]{6,}$/i.test(maybeHash ?? "");
    if (looksHashed) {
      parts.pop();
      return `${parts.join(".")}.${ext}`;
    }
  }
  return `${base}.${ext}`;
}

async function loadOgImageAsset(
  meta?: ImageMetadata | string | null,
  hint?: string,
): Promise<OgImageAsset | undefined> {
  if (!meta) return undefined;

  const readToDataUrl = async (
    p: string,
    width?: number,
    height?: number,
  ): Promise<OgImageAsset> => {
    const buffer = await fs.readFile(p);
    const ext = path.extname(p).slice(1).toLowerCase();
    const raster = await toDataUrlWithRasterize(buffer, ext, width, height);
    return { src: raster.src, width, height };
  };

  if (typeof meta === "string") {
    if (meta.startsWith("data:")) {
      return { src: meta };
    }
    let ref = meta.startsWith("__ASTRO_IMAGE_")
      ? meta.replace("__ASTRO_IMAGE_", "")
      : meta;

    // Normalize root-relative and dev server paths
    let resolved: string | null = null;
    if (ref.startsWith("@/")) {
      resolved = path.join(process.cwd(), "src", ref.slice(2));
    } else if (ref.startsWith("/@fs/")) {
      resolved = ref.slice("/@fs/".length);
    } else if (ref.startsWith("/src/")) {
      resolved = path.join(process.cwd(), ref.slice(1));
    } else if (ref.startsWith("/assets/")) {
      resolved = path.join(process.cwd(), "src", ref.slice(1));
    } else if (ref.startsWith("/public/")) {
      resolved = path.join(process.cwd(), ref.slice(1));
    } else if (path.isAbsolute(ref)) {
      resolved = ref;
    } else {
      resolved = path.join(process.cwd(), ref);
    }

    if (resolved) {
      try {
        return await readToDataUrl(resolved);
      } catch (error) {
        console.warn("[og] failed to read asset", resolved, error);
        // fall through to indexed lookup
      }
    }

    // Fallback: resolve by original filename using our asset index
    const originalFile = deriveOriginalFileName(ref);
    if (originalFile) {
      const assetIndex = await getAssetIndex();
      const candidates = assetIndex.get(originalFile);
      if (candidates?.length && candidates.length > 0) {
        let candidate = candidates[0];
        if (hint) {
          const normalized = `${path.sep}${hint}${path.sep}`;
          const match = candidates.find((filePath) =>
            filePath.includes(normalized),
          );
          if (match) candidate = match;
        }
        let cached = assetDataCache.get(candidate!);
        if (!cached) {
          const buffer = await fs.readFile(candidate!);
          const ext = path.extname(candidate!).slice(1).toLowerCase();
          const raster = await toDataUrlWithRasterize(buffer, ext);
          cached = raster.src;
          assetDataCache.set(candidate!, cached);
        }
        return { src: cached! };
      }
    }
    return undefined;
  }

  if (!meta.src) return undefined;
  const devFsPrefix = "/@fs/";
  const srcPath = meta.src.split("?")[0] ?? meta.src;

  if (srcPath.startsWith("__ASTRO_IMAGE_")) {
    const ref = srcPath.replace("__ASTRO_IMAGE_", "");
    const resolved: string = ref.startsWith("@/")
      ? path.join(process.cwd(), "src", ref.slice(2))
      : path.isAbsolute(ref)
        ? ref
        : path.join(process.cwd(), ref);
    try {
      const buffer = await fs.readFile(resolved);
      const ext = path.extname(resolved).slice(1).toLowerCase();
      const raster = await toDataUrlWithRasterize(
        buffer,
        ext,
        meta.width,
        meta.height,
      );
      return {
        src: raster.src,
        width: meta.width,
        height: meta.height,
      };
    } catch {
      // fall through to hashed asset lookup
    }
  }

  if (srcPath.startsWith(devFsPrefix)) {
    const fsPath: string = srcPath.slice(devFsPrefix.length);
    try {
      const buffer = await fs.readFile(fsPath);
      const ext = path.extname(fsPath).slice(1).toLowerCase();
      const raster = await toDataUrlWithRasterize(
        buffer,
        ext,
        meta.width,
        meta.height,
      );
      return {
        src: raster.src,
        width: meta.width,
        height: meta.height,
      };
    } catch {
      // fall through to indexed lookup
    }
  }

  if (srcPath.startsWith("/src/") || srcPath.startsWith("@/")) {
    const resolved: string = srcPath.startsWith("/src/")
      ? path.join(process.cwd(), srcPath.slice(1))
      : path.join(process.cwd(), "src", srcPath.slice(2));
    try {
      const buffer = await fs.readFile(resolved);
      const ext = path.extname(resolved).slice(1).toLowerCase();
      const raster = await toDataUrlWithRasterize(
        buffer,
        ext,
        meta.width,
        meta.height,
      );
      return {
        src: raster.src,
        width: meta.width,
        height: meta.height,
      };
    } catch {
      // fall through to indexed lookup
    }
  }

  const originalFile = deriveOriginalFileName(srcPath);
  if (!originalFile) return undefined;
  const assetIndex = await getAssetIndex();
  const candidates = assetIndex.get(originalFile);
  if (!candidates?.length) return undefined;
  let candidate = candidates[0];
  if (hint) {
    const normalized = `${path.sep}${hint}${path.sep}`;
    const match = candidates.find((filePath) => filePath.includes(normalized));
    if (match) candidate = match;
  }
  if (!candidate) return undefined;
  let dataUrl = assetDataCache.get(candidate);
  if (!dataUrl) {
    const buffer = await fs.readFile(candidate);
    const ext = path.extname(candidate).slice(1).toLowerCase();
    const raster = await toDataUrlWithRasterize(
      buffer,
      ext,
      meta.width,
      meta.height,
    );
    dataUrl = raster.src;
    assetDataCache.set(candidate, dataUrl);
  }
  return { src: dataUrl!, width: meta.width, height: meta.height };
}

async function mapHardware(
  entry: Awaited<ReturnType<typeof getAllHardware>>[number],
): Promise<OgImageProps> {
  const status = entry.data.status
    ? getStatusLabel(entry.data.status)
    : undefined;
  const categoryLabel =
    getCategoryLabel("hardware", entry.data.category) || "Hardware";
  return {
    eyebrow: categoryLabel,
    title: entry.data.name,
    description: entry.data.shortDescription || entry.data.description || "",
    badge: entry.data.featured ? "featured" : undefined,
    badgeIcon: createBadgeIcon(CpuBolt),
    avatarInitial: entry.data.name?.[0]?.toUpperCase() || "H",
    heroImage: await loadOgImageAsset(entry.data.images?.hero, "hardware"),
    statusLabel: status,
    categoryLabel,
    statusTone: getStatusTone(entry.data.status),
    logoImage: undefined,
  };
}

async function mapSoftware(
  entry: Awaited<ReturnType<typeof getAllSoftware>>[number],
): Promise<OgImageProps> {
  const status = entry.data.status
    ? getStatusLabel(entry.data.status)
    : undefined;
  const categoryLabel = entry.data.category
    ? getCategoryLabel("software", entry.data.category)
    : undefined;
  return {
    eyebrow: "Software",
    title: entry.data.name,
    description: entry.data.shortDescription || entry.data.description || "",
    badge: entry.data.featured ? "featured" : undefined,
    badgeIcon: createBadgeIcon(CodeSquare),
    avatarInitial: entry.data.name?.[0]?.toUpperCase() || "S",
    heroImage: await loadOgImageAsset(entry.data.images?.hero, "software"),
    logoImage: await loadOgImageAsset(
      resolveContentLogo(entry.data.images),
      "software",
    ),
    statusLabel: status,
    categoryLabel,
    statusTone: getStatusTone(entry.data.status),
    logoMode: "cover",
  };
}

async function mapResearch(
  entry: Awaited<ReturnType<typeof getAllResearch>>[number],
): Promise<OgImageProps> {
  const year = entry.data.publishDate
    ? new Date(entry.data.publishDate).getFullYear().toString()
    : undefined;
  const typeLabel = entry.data.type
    ? entry.data.type.charAt(0).toUpperCase() + entry.data.type.slice(1)
    : undefined;
  const logoImage = await loadOgImageAsset(
    resolveContentLogo(entry.data.images),
    "research",
  );
  return {
    eyebrow: entry.data.type || "Research",
    title: entry.data.title,
    description: entry.data.description,
    badgeIcon: createBadgeIcon(TestTube),
    avatarInitial: "R",
    heroImage: await loadOgImageAsset(entry.data.images?.hero, "research"),
    logoImage,
    categoryLabel: [typeLabel, year].filter(Boolean).join(" • ") || undefined,
  };
}

async function mapEvent(
  entry: Awaited<ReturnType<typeof getAllEvents>>[number],
): Promise<OgImageProps> {
  const when = formatDate(entry.data.startDate, true);
  const locationParts = [
    entry.data.location?.city,
    entry.data.location?.country,
  ].filter(Boolean);
  const now = new Date();
  const startDate = new Date(entry.data.startDate);
  const endDate = entry.data.endDate ? new Date(entry.data.endDate) : startDate;
  let statusLabel: string | undefined = "Upcoming";
  if (!Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime())) {
    if (now >= startDate && now <= endDate) {
      statusLabel = "Happening Now";
    } else if (now > endDate) {
      statusLabel = "Past";
    }
  }
  const statusTone: OgImageProps["statusTone"] = statusLabel
    ? statusLabel === "Happening Now"
      ? "green"
      : statusLabel === "Upcoming"
        ? "blue"
        : "gray"
    : undefined;

  return {
    eyebrow: entry.data.type || "Event",
    title: entry.data.displayName || entry.data.name,
    description: entry.data.description || undefined,
    badge: entry.data.featured ? "featured" : undefined,
    badgeIcon: createBadgeIcon(CalendarMark),
    avatarInitial: "E",
    heroImage: await loadOgImageAsset(entry.data.images?.hero, "events"),
    logoImage: await loadOgImageAsset(
      resolveContentLogo(entry.data.images),
      "events",
    ),
    statusLabel,
    statusTone,
    categoryLabel: entry.data.type,
    listItems: [
      when ? { icon: "calendar", text: when } : null,
      locationParts.length
        ? { icon: "location", text: locationParts.join(", ") }
        : null,
    ].filter(Boolean) as OgImageProps["listItems"],
    listColumns: 2,
    logoMode: "cover",
  };
}

async function mapOrganization(
  entry: Awaited<ReturnType<typeof getAllOrganizations>>[number],
): Promise<OgImageProps> {
  const typeLabel = capitalize(entry.data.type) || "Partner";
  const focusLabel = entry.data.category
    ? (capitalize(entry.data.category) ?? entry.data.category)
    : undefined;
  return {
    eyebrow: typeLabel,
    title: entry.data.shortName || entry.data.name,
    description:
      entry.data.collaborationSummary || entry.data.description || "",
    badgeIcon: createBadgeIcon(Buildings),
    avatarInitial: (entry.data.shortName || entry.data.name || "O")
      .charAt(0)
      .toUpperCase(),
    heroImage: await loadOgImageAsset(entry.data.images?.hero, "organizations"),
    logoImage:
      entry.data.images?.hero == null
        ? await loadOgImageAsset(
            resolveContentLogo(entry.data.images),
            "organizations",
          )
        : undefined,
    categoryLabel: focusLabel,
  };
}

async function mapPerson(
  entry: Awaited<ReturnType<typeof getAllPeople>>[number],
): Promise<OgImageProps> {
  const fullName = entry.data.honorific
    ? `${entry.data.honorific} ${entry.data.name}`
    : entry.data.name;
  const role = entry.data.title;
  const expertise = entry.data.expertise?.slice(0, 2) ?? [];
  const description =
    entry.data.bio ||
    (expertise.length ? `Expertise: ${expertise.join(", ")}` : undefined);
  return {
    eyebrow: role || "Contributor",
    title: fullName,
    description,
    badge: entry.data.featured ? "featured" : undefined,
    badgeIcon: createBadgeIcon(User),
    avatarInitial: entry.data.name?.[0]?.toUpperCase() || "P",
    heroImage: await loadOgImageAsset(entry.data.images?.hero, "people"),
    logoImage: await loadOgImageAsset(entry.data.images?.avatar, "people"),
    categoryLabel: role,
    logoMode: "cover",
  };
}

const builders = {
  hardware: mapHardware,
  software: mapSoftware,
  research: mapResearch,
  events: mapEvent,
  organizations: mapOrganization,
  people: mapPerson,
};

export async function GET(context: APIContext) {
  const og = context.props as OgImageProps | undefined;
  if (!og) {
    return new Response("Not found", { status: 404 });
  }
  const format = context.params.ext === "svg" ? "svg" : "png";
  const { body, contentType } = await renderOgImage(format, og);
  const responseBody =
    typeof body === "string"
      ? body
      : new Blob([Buffer.from(body)], { type: contentType });
  return new Response(responseBody, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export async function getStaticPaths() {
  const paths: Array<{
    params: { collection: string; slug: string; ext: string };
    props: OgImageProps;
  }> = [];

  const pushPaths = (
    collection: keyof typeof builders,
    slug: string,
    data: OgImageProps,
  ) => {
    ["png", "svg"].forEach((ext) => {
      paths.push({ params: { collection, slug, ext }, props: data });
    });
  };

  const hardwareEntries = (await getAllHardware())
    .filter(isVisible)
    .filter((entry) => !hasCustomOgImage(entry));
  for (const entry of hardwareEntries) {
    pushPaths("hardware", entry.id, await mapHardware(entry));
  }

  const softwareEntries = (await getAllSoftware())
    .filter(isVisible)
    .filter((entry) => !hasCustomOgImage(entry));
  for (const entry of softwareEntries) {
    pushPaths("software", entry.id, await mapSoftware(entry));
  }

  const researchEntries = (await getAllResearch())
    .filter(isVisible)
    .filter((entry) => !hasCustomOgImage(entry));
  for (const entry of researchEntries) {
    pushPaths("research", entry.id, await mapResearch(entry));
  }

  const eventEntries = (await getAllEvents())
    .filter(isVisible)
    .filter((entry) => !hasCustomOgImage(entry));
  for (const entry of eventEntries) {
    pushPaths("events", entry.id, await mapEvent(entry));
  }

  const organizationEntries = (await getAllOrganizations())
    .filter(isVisible)
    .filter((entry) => entry.data.isPartner)
    .filter((entry) => !hasCustomOgImage(entry));
  for (const entry of organizationEntries) {
    pushPaths("organizations", entry.id, await mapOrganization(entry));
  }

  const peopleEntries = (await getAllPeople())
    .filter(isVisible)
    .filter((entry) => !hasCustomOgImage(entry));
  for (const entry of peopleEntries) {
    pushPaths("people", entry.id, await mapPerson(entry));
  }

  return paths;
}
