import { RuntimeFaceFrame } from "@/components/demos/RuntimeFaceFrame";
import { getPoseGroup, usePoseHotkeys } from "@/demo-lib/usePoseHotkeys";
import { useVizijRuntime } from "@vizij/runtime-react";
import { useMemo, useState } from "react";
import { pickExpressiveBindings, STANDARD_GAZE_PATHS } from "./bindings";
import { TutorialLabSection } from "./TutorialLabSection";
import { TutorialRuntime } from "./TutorialRuntime";

function RiggingControlBody() {
	const { setInput, faceId, ready, assetBundle } = useVizijRuntime();
	const poseConfig = assetBundle.pose?.config ?? null;
	const { bindings, setPoseWeight } = usePoseHotkeys(poseConfig, ready);
	const featured = useMemo(() => pickExpressiveBindings(bindings, 1)[0] ?? null, [bindings]);
	const [horizontal, setHorizontal] = useState(0);
	const [vertical, setVertical] = useState(0);
	const [lastMode, setLastMode] = useState("No control used yet");

	const applyGaze = (nextHorizontal: number, nextVertical: number) => {
		setInput(`rig/${faceId ?? "face"}/${STANDARD_GAZE_PATHS.leftX}`, { float: nextHorizontal });
		setInput(`rig/${faceId ?? "face"}/${STANDARD_GAZE_PATHS.rightX}`, { float: nextHorizontal });
		setInput(`rig/${faceId ?? "face"}/${STANDARD_GAZE_PATHS.leftY}`, { float: nextVertical });
		setInput(`rig/${faceId ?? "face"}/${STANDARD_GAZE_PATHS.rightY}`, { float: nextVertical });
		setLastMode("Standard gaze control");
	};

	return (
		<div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
			<RuntimeFaceFrame
				variant="lg"
				label="Rig output"
				subtitle="Friendly controls fan out into standard paths and optional pose weights."
			/>
			<div className="space-y-4 rounded-2xl border border-accent-base/20 bg-surface-lighter/45 p-5">
				<p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-two">
					One control, many writes
				</p>
				<label className="block text-sm text-color-500">
					<span className="mb-2 block font-medium text-foreground">Look right / left</span>
					<input
						type="range"
						min={-1}
						max={1}
						step={0.05}
						value={horizontal}
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
						onChange={(event) => {
							const next = Number(event.target.value);
							setVertical(next);
							applyGaze(horizontal, next);
						}}
						className="w-full"
					/>
				</label>
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
				<div className="rounded-xl border border-accent-base/20 bg-surface p-4 text-xs leading-6 text-color-500">
					<p className="font-medium text-foreground">Current teaching point</p>
					<p className="mt-1">{lastMode}</p>
					<p className="mt-3">
						The standard gaze sliders each write to both left and right eye paths. The featured pose
						button shows how a friendlier control can target a pose weight instead.
					</p>
				</div>
			</div>
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

