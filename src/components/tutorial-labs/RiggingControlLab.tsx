import { RuntimeFaceFrame } from "@/components/demos/RuntimeFaceFrame";
import {
	type FaceScalarControl,
	mapNormalizedControlValue,
	resolveFaceControls,
} from "@/demo-lib/faceControls";
import { getPoseGroup, usePoseHotkeys } from "@/demo-lib/usePoseHotkeys";
import { useVizijRuntime } from "@vizij/runtime-react";
import { useMemo, useState } from "react";
import { TutorialLabSection } from "./TutorialLabSection";
import { TutorialRuntime } from "./TutorialRuntime";
import { pickExpressiveBindings } from "./bindings";

function clamp(value: number, min = -1, max = 1) {
	return Math.min(Math.max(value, min), max);
}

function writeControl(
	control: FaceScalarControl | null,
	normalizedValue: number,
	setInput: (path: string, value: { float: number }) => void,
) {
	if (!control) {
		return null;
	}
	const value = mapNormalizedControlValue(control, clamp(normalizedValue));
	setInput(control.path, { float: value });
	return { path: control.path, value };
}

function RiggingControlBody() {
	const { setInput, faceId, ready, assetBundle, inputConstraints } = useVizijRuntime();
	const poseConfig = assetBundle.pose?.config ?? null;
	const { bindings, setPoseWeight } = usePoseHotkeys(poseConfig, ready);
	const featured = useMemo(() => pickExpressiveBindings(bindings, 1)[0] ?? null, [bindings]);
	const [horizontal, setHorizontal] = useState(0);
	const [vertical, setVertical] = useState(0);
	const [lastMode, setLastMode] = useState("No control used yet");
	const controls = useMemo(
		() => resolveFaceControls(assetBundle, faceId, inputConstraints),
		[assetBundle, faceId, inputConstraints],
	);
	const hasResolvedGaze =
		Boolean(controls.eyes.leftX) &&
		Boolean(controls.eyes.rightX) &&
		Boolean(controls.eyes.leftY) &&
		Boolean(controls.eyes.rightY);

	const applyGaze = (nextHorizontal: number, nextVertical: number) => {
		if (!hasResolvedGaze) {
			setLastMode("Resolved gaze controls unavailable for this asset");
			return;
		}
		writeControl(controls.eyes.leftX, nextHorizontal, setInput);
		writeControl(controls.eyes.rightX, nextHorizontal, setInput);
		writeControl(controls.eyes.leftY, nextVertical, setInput);
		writeControl(controls.eyes.rightY, nextVertical, setInput);
		setLastMode(`Resolved gaze control (${controls.gazeSource})`);
	};

	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-xl border border-accent-base/20">
				<div className="aspect-[4/3] bg-linear-to-br from-special-lighter to-special">
					<RuntimeFaceFrame mode="media" />
				</div>
				<div className="border-t border-accent-base/10 bg-surface-lighter/45 px-4 py-3">
					<p className="text-xs font-semibold uppercase tracking-wider text-accent-base/80">
						Rig output
					</p>
					<p className="mt-0.5 text-sm text-color-500">
						Friendly controls fan out into {controls.gazeSource} paths and optional pose weights.
					</p>
				</div>
			</div>

			{hasResolvedGaze ? null : (
				<p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-color-500">
					This asset does not expose a full resolved gaze control set for the demo-style mapping.
				</p>
			)}

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<label className="block text-sm text-color-500">
					<span className="mb-2 block font-medium text-foreground">Look right / left</span>
					<input
						type="range"
						min={-1}
						max={1}
						step={0.05}
						value={horizontal}
						disabled={!hasResolvedGaze}
						onChange={(event) => {
							const next = Number(event.target.value);
							setHorizontal(next);
							applyGaze(next, vertical);
						}}
						className="w-full"
					/>
				</label>
				<label className="block text-sm text-color-500">
					<span className="mb-2 block font-medium text-foreground">Look up / down</span>
					<input
						type="range"
						min={-1}
						max={1}
						step={0.05}
						value={vertical}
						disabled={!hasResolvedGaze}
						onChange={(event) => {
							const next = Number(event.target.value);
							setVertical(next);
							applyGaze(horizontal, next);
						}}
						className="w-full"
					/>
				</label>
			</div>

			{featured ? (
				<button
					type="button"
					className="w-full rounded-xl border border-accent-base/20 bg-surface px-4 py-3 text-left text-sm transition-colors hover:border-accent-two/45 hover:bg-accent-base/10"
					onClick={() => {
						setPoseWeight(featured, 1);
						setLastMode(`Custom pose control: ${featured.pose.name ?? featured.pose.id}`);
						window.setTimeout(() => setPoseWeight(featured, 0), 550);
					}}
				>
					Trigger featured {getPoseGroup(featured.pose) ?? "pose"} control
				</button>
			) : null}

			<details className="rounded-xl border border-accent-base/20 bg-surface-lighter/45">
				<summary className="cursor-pointer px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-two">
					Control status
				</summary>
				<div className="border-t border-accent-base/10 p-4 text-xs leading-6 text-color-500">
					<p className="font-medium text-foreground">{lastMode}</p>
				</div>
			</details>
		</div>
	);
}

export default function RiggingControlLab() {
	return (
		<TutorialLabSection
			id="rigging-and-control-lab"
			title="Micro-lab: control mapping"
			subtitle="Use one friendly control surface and watch it fan out to underlying rig paths."
			trySteps={[
				"Move the gaze sliders and watch both eyes respond together.",
				"Trigger the featured pose button once.",
				"Compare the standard control and custom control examples.",
			]}
			successSignal="You can explain how a single user-facing control can map to multiple underlying paths or a pose weight."
		>
			{() => (
				<TutorialRuntime namespace="tutorial-rigging-control">
					<RiggingControlBody />
				</TutorialRuntime>
			)}
		</TutorialLabSection>
	);
}
