import { FACE_ROOT_BOUNDS } from "@/demo-lib/runtimeFace";
import { useVizijStore, useVizijStoreSetter } from "@vizij/render";
import { type RootBounds, VizijRuntimeFace, useVizijRuntime } from "@vizij/runtime-react";
import { clsx } from "clsx";
import { type ReactNode, type RefObject, useEffect } from "react";

export type RuntimeFaceFrameProps = {
	label?: string;
	subtitle?: string;
	variant?: "sm" | "md" | "lg";
	className?: string;
	pointerTargetRef?: RefObject<HTMLDivElement | null>;
	onCanvasClick?: () => void;
	overlay?: ReactNode;
	footer?: ReactNode;
	mode?: "panel" | "media";
};

const FRAME_VARIANTS: Record<NonNullable<RuntimeFaceFrameProps["variant"]>, string> = {
	sm: "min-h-[18rem]",
	md: "min-h-[22rem]",
	lg: "min-h-[26rem]",
};

const CANVAS_VARIANTS: Record<NonNullable<RuntimeFaceFrameProps["variant"]>, string> = {
	sm: "h-[16rem] sm:h-[18rem]",
	md: "h-[18rem] sm:h-[22rem]",
	lg: "h-[22rem] sm:h-[28rem]",
};

export function RuntimeFaceFrame({
	label,
	subtitle,
	variant = "md",
	className,
	pointerTargetRef,
	onCanvasClick,
	overlay,
	footer,
	mode = "panel",
}: RuntimeFaceFrameProps) {
	const { ready, loading, error, stagePoseNeutral } = useVizijRuntime();

	useEffect(() => {
		if (ready) {
			stagePoseNeutral();
		}
	}, [ready, stagePoseNeutral]);

	if (mode === "media") {
		return (
			// biome-ignore lint/a11y/useKeyWithClickEvents: interactive canvas element handles click only by design
			<div
				ref={pointerTargetRef ?? undefined}
				className={clsx("relative h-full w-full overflow-hidden bg-surface", className)}
				onClick={onCanvasClick}
			>
				<FaceCameraBounds />
				<VizijRuntimeFace
					className="h-full w-full"
					style={{ width: "100%", height: "100%", display: "block" }}
					showSafeArea={false}
				/>
				<RuntimeStatusBadge ready={ready} loading={loading} error={error} />
				{overlay}
			</div>
		);
	}

	return (
		<div
			className={clsx(
				"flex flex-col gap-3 rounded-xl border border-accent-base/20 bg-surface-lighter/40 p-4 backdrop-blur-md",
				FRAME_VARIANTS[variant],
				className,
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

			{/* biome-ignore lint/a11y/useKeyWithClickEvents: interactive canvas element handles click only by design */}
			<div
				ref={pointerTargetRef ?? undefined}
				className={clsx(
					"relative w-full overflow-hidden rounded-lg border border-accent-base/20 bg-surface",
					CANVAS_VARIANTS[variant],
				)}
				onClick={onCanvasClick}
			>
				<FaceCameraBounds />
				<VizijRuntimeFace
					className="h-full w-full"
					style={{ width: "100%", height: "100%", display: "block" }}
					showSafeArea={false}
				/>
				<RuntimeStatusBadge ready={ready} loading={loading} error={error} />
				{overlay}
			</div>

			{footer ? <div className="text-xs text-color-500">{footer}</div> : null}
		</div>
	);
}

type RuntimeErrorLike = ReturnType<typeof useVizijRuntime>["error"];

type RuntimeStatusBadgeProps = {
	ready: boolean;
	loading: boolean;
	error: RuntimeErrorLike | Error | null | undefined;
};

function RuntimeStatusBadge({ ready, loading, error }: RuntimeStatusBadgeProps) {
	if (error) {
		return (
			<div className="absolute inset-0 flex items-center justify-center bg-surface/85 text-sm font-medium text-accent-two">
				{error.message}
			</div>
		);
	}
	if (!ready) {
		return (
			<div className="absolute inset-0 flex items-center justify-center bg-surface/70 text-sm text-color-500">
				Initialising Vizij...
			</div>
		);
	}
	if (loading) {
		return (
			<div className="absolute inset-0 flex items-center justify-center bg-surface/70 text-sm text-color-500">
				Loading face...
			</div>
		);
	}
	return null;
}

function FaceCameraBounds() {
	const { rootId } = useVizijRuntime();
	const setStore = useVizijStoreSetter();
	const currentBounds = useVizijStore((state) => {
		if (!rootId) {
			return null;
		}
		const entry = state.world[rootId];
		if (entry && "rootBounds" in entry) {
			return (entry.rootBounds as RootBounds | undefined) ?? null;
		}
		return null;
	});

	useEffect(() => {
		if (!rootId) {
			return;
		}
		if (hasSameBounds(currentBounds, FACE_ROOT_BOUNDS)) {
			return;
		}
		setStore((state) => {
			const entry = state.world[rootId];
			if (!entry || !("rootBounds" in entry)) {
				return {};
			}
			return {
				world: {
					...state.world,
					[rootId]: {
						...entry,
						rootBounds: {
							center: { ...FACE_ROOT_BOUNDS.center },
							size: { ...FACE_ROOT_BOUNDS.size },
						},
					},
				},
			};
		});
	}, [rootId, currentBounds, setStore]);

	return null;
}

const BOUNDS_EPSILON = 0.005;

function hasSameBounds(
	candidate: RootBounds | null | undefined,
	target: typeof FACE_ROOT_BOUNDS,
): boolean {
	if (!candidate) {
		return false;
	}
	return (
		almostEqual(candidate.center.x, target.center.x) &&
		almostEqual(candidate.center.y, target.center.y) &&
		almostEqual(candidate.size.x, target.size.x) &&
		almostEqual(candidate.size.y, target.size.y)
	);
}

function almostEqual(a: number, b: number) {
	return Math.abs(a - b) <= BOUNDS_EPSILON;
}
