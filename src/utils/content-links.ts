import { resolveSitePath } from "@/utils/url";

type LinkValue =
	| string
	| null
	| undefined
	| LinkValue[]
	| { [key: string]: LinkValue };

function resolveLinkValue<T extends LinkValue>(value: T): T {
	if (typeof value === "string") {
		return resolveSitePath(value) as T;
	}

	if (Array.isArray(value)) {
		return value.map((entry) => resolveLinkValue(entry)) as T;
	}

	if (value && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map(([key, entry]) => [key, resolveLinkValue(entry)]),
		) as T;
	}

	return value;
}

/**
 * Normalizes frontmatter link payloads so internal root-relative paths work
 * under Astro base paths such as PR previews while leaving external/user-handle
 * style values untouched.
 */
export function withResolvedLinks<T extends { links?: LinkValue }>(data: T): T {
	if (!data.links) return data;

	return {
		...data,
		links: resolveLinkValue(data.links),
	};
}
