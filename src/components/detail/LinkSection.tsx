import {
	IconButton,
	type IconButtonSize,
	type LinkType,
	linkPriority,
	normalizeLinkHref,
} from "@semio-community/ecosystem-site-core";
import { clsx } from "clsx";
import type React from "react";
import { useMemo } from "react";

export interface LinkSectionProps {
	// Map of link type to value (URL, handle, email, etc.)
	links?: Partial<Record<LinkType, string>>;
	// Optional: include only these link types
	allowed?: LinkType[];
	// Optional: max number of buttons to show (defaults to all)
	max?: number;
	// Icon size for each button
	size?: IconButtonSize;
	// Extra classes for the container
	className?: string;
	// Force IconButton rendering type
	as?: "button" | "link";
	// Prevent parent navigation when clicking buttons
	stopPropagation?: boolean;
	// Force external behavior (otherwise detected automatically)
	external?: boolean;
}

type LinkEntry = { type: LinkType; href: string };

function buildPrioritizedLinks(
	links?: Partial<Record<LinkType, string>>,
	allowed?: LinkType[],
	max?: number,
): LinkEntry[] {
	if (!links) return [];

	const seen = new Set<string>();
	const items: LinkEntry[] = [];

	const pushIfValid = (type: LinkType, raw?: string) => {
		if (!raw) return;
		if (allowed && !allowed.includes(type)) return;

		const href = normalizeLinkHref(type, raw);
		const key = `${type}:${href}`;
		if (seen.has(key)) return;

		seen.add(key);
		items.push({ type, href });
	};

	// First pass: known link types in configured priority,
	// then reverse so we render increasing priority from left to right.
	for (const t of linkPriority) {
		pushIfValid(t, links[t]);
	}

	// Second pass: any extra/unknown keys not covered by linkPriority
	// (append these after the prioritized set).
	for (const [rawType, raw] of Object.entries(links)) {
		const t = rawType as LinkType;
		if (linkPriority.includes(t)) continue; // already handled
		pushIfValid(t, raw || undefined);
	}

	const ordered = items.reverse(); // increasing priority left -> right
	return typeof max === "number" && max > 0 ? ordered.slice(0, max) : ordered;
}

/**
 * LinkSection
 * Renders a single-row list of circular IconButtons, ordered from
 * lower to higher priority (left to right). When overflow occurs,
 * it scrolls horizontally.
 */
export const LinkSection: React.FC<LinkSectionProps> = ({
	links,
	allowed,
	max,
	size = "md",
	className,
	as,
	stopPropagation,
	external,
}) => {
	const buttons = useMemo(() => buildPrioritizedLinks(links, allowed, max), [links, allowed, max]);

	if (!buttons.length) return null;

	return (
		<div
			className={clsx("flex items-center justify-end gap-1 flex-nowrap overflow-x-auto", className)}
		>
			{buttons.map(({ type, href }) => (
				<IconButton
					key={`${type}-${href}`}
					type={type}
					href={href}
					size={size}
					as={as}
					external={external}
					stopPropagation={stopPropagation}
				/>
			))}
		</div>
	);
};

export default LinkSection;
