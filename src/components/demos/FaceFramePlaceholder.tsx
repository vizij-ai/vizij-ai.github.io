import { clsx } from "clsx";
import type { ReactNode } from "react";

type FaceFramePlaceholderProps = {
	variant?: "sm" | "md" | "lg";
	label?: string;
	subtitle?: string;
	message?: ReactNode;
};

const FRAME_VARIANTS: Record<NonNullable<FaceFramePlaceholderProps["variant"]>, string> = {
	sm: "min-h-[18rem]",
	md: "min-h-[22rem]",
	lg: "min-h-[26rem]",
};

export function FaceFramePlaceholder({
	variant = "md",
	label,
	subtitle,
	message = "Vizij runtime will load when you reach this section.",
}: FaceFramePlaceholderProps) {
	return (
		<div
			className={clsx(
				"flex flex-col gap-3 rounded-xl border border-dashed border-accent-base/20 bg-surface-lighter/30 p-4",
				FRAME_VARIANTS[variant],
			)}
		>
			{(label || subtitle) && (
				<div className="flex flex-col gap-1">
					{label ? (
						<p className="text-xs font-semibold uppercase tracking-wider text-accent-base/80">
							{label}
						</p>
					) : null}
					{subtitle ? <p className="text-sm text-color-500">{subtitle}</p> : null}
				</div>
			)}
			<div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-accent-base/20 bg-surface px-4 py-10 text-center text-sm text-color-500">
				{message}
			</div>
		</div>
	);
}
