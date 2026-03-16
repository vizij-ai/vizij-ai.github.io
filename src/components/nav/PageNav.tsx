import { resolveSitePath } from "@/utils/url";
import {
	RoundAltArrowLeft,
	RoundAltArrowRight,
} from "@solar-icons/react-perf/LineDuotone";

export interface PageNavLink {
	label: string;
	href: string;
	description?: string;
}

export interface PageNavProps {
	prev?: PageNavLink;
	next?: PageNavLink;
	className?: string;
}

export default function PageNav({ prev, next, className }: PageNavProps) {
	if (!prev && !next) return null;
	return (
		<nav aria-label="Page navigation" className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${className ?? ""}`}>
			{prev ? (
				<a
					href={resolveSitePath(prev.href)}
					className="group flex flex-col gap-2 rounded-lg border border-accent-base/15 bg-special-lighter p-5 transition-colors hover:border-accent-two/30"
				>
					<span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-color-500">
						<RoundAltArrowLeft className="h-3.5 w-3.5" />
						Previous
					</span>
					<span className="text-base font-semibold text-foreground">{prev.label}</span>
					{prev.description && (
						<span className="text-sm text-color-500 line-clamp-2">{prev.description}</span>
					)}
				</a>
			) : (
				<div />
			)}
			{next ? (
				<a
					href={resolveSitePath(next.href)}
					className="group flex flex-col gap-2 rounded-lg border border-accent-base/15 bg-special-lighter p-5 text-right transition-colors hover:border-accent-two/30"
				>
					<span className="flex items-center justify-end gap-1.5 text-xs font-medium uppercase tracking-widest text-color-500">
						Next
						<RoundAltArrowRight className="h-3.5 w-3.5" />
					</span>
					<span className="text-base font-semibold text-foreground">{next.label}</span>
					{next.description && (
						<span className="text-sm text-color-500 line-clamp-2">{next.description}</span>
					)}
				</a>
			) : (
				<div />
			)}
		</nav>
	);
}
