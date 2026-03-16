/**
 * Utility functions for handling URLs with base path support
 */

/**
 * Creates a base-aware URL for internal links
 * @param path - The relative path (e.g., "about/", "/contact/", "")
 * @param baseOverride - Optional base URL to use instead of import.meta.env.BASE_URL
 * @returns The full path with base URL applied
 */
export function url(path = "", baseOverride?: string): string {
  if (isExternalUrl(path)) return path;
  if (path.startsWith("#") || path.startsWith("?")) return path;

  const baseUrl = baseOverride ?? import.meta.env.BASE_URL;

  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // Ensure base URL ends with slash and combine with clean path
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

  return `${normalizedBase}${cleanPath}`;
}

/**
 * Creates a base-aware URL for the home page
 * @returns The home page URL with base path
 */
export function homeUrl(): string {
  return import.meta.env.BASE_URL;
}

const absoluteSchemePattern = /^[a-zA-Z][a-zA-Z\d+.-]*:/;
const filesystemRootPattern =
  /^\/(?:home|Users|private|var|tmp|mnt|opt|etc)(?:\/|$)|^\/[a-zA-Z]:\//;

/**
 * Returns true when a value is a site-internal root-relative path that should
 * be rewritten to include the current Astro base path.
 */
export function isBaseRelativePath(value: string): boolean {
  if (!value) return false;
  if (isExternalUrl(value)) return false;
  if (absoluteSchemePattern.test(value)) return false;
  if (value.startsWith("#") || value.startsWith("?")) return false;
  if (!value.startsWith("/")) return false;
  return !filesystemRootPattern.test(value);
}

/**
 * Rewrites root-relative site links and asset paths to include BASE_URL while
 * leaving hashes, queries, external URLs, and likely filesystem paths intact.
 */
export function resolveSitePath(value: string, baseOverride?: string): string {
  if (!isBaseRelativePath(value)) return value;

  const baseUrl = baseOverride ?? import.meta.env.BASE_URL;
  if (baseUrl && baseUrl !== "/") {
    const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    if (
      value.startsWith(normalizedBase) ||
      value === normalizedBase.slice(0, -1)
    ) {
      return value;
    }
  }

  return url(value, baseOverride);
}

/**
 * Checks if a URL is absolute or uses a non-site scheme.
 * @param href - The URL to check
 * @returns True if the URL should not be resolved through the site base path
 */
export function isExternalUrl(href: string): boolean {
  return absoluteSchemePattern.test(href) || href.startsWith("//");
}
