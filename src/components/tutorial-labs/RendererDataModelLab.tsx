import { RuntimeFaceFrame } from "@/components/demos/RuntimeFaceFrame";
import {
	type FaceScalarControl,
	mapNormalizedControlValue,
	resolveFaceControls,
} from "@/demo-lib/faceControls";
import { useVizijRuntime } from "@vizij/runtime-react";
import { useMemo, useState } from "react";
import { TutorialLabSection } from "./TutorialLabSection";
import { TutorialRuntime } from "./TutorialRuntime";

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

function DataModelBody() {
	const { setInput, faceId, namespace, assetBundle, inputConstraints } = useVizijRuntime();
	const [horizontal, setHorizontal] = useState(0);
	const [vertical, setVertical] = useState(0);
	const controls = useMemo(
		() => resolveFaceControls(assetBundle, faceId, inputConstraints),
		[assetBundle, faceId, inputConstraints],
	);

	const applyValues = (nextHorizontal: number, nextVertical: number) => {
		writeControl(controls.eyes.leftX, nextHorizontal, setInput);
		writeControl(controls.eyes.rightX, nextHorizontal, setInput);
		writeControl(controls.eyes.leftY, nextVertical, setInput);
		writeControl(controls.eyes.rightY, nextVertical, setInput);
	};

	const writes = useMemo(
		() =>
			[
				{
					control: controls.eyes.leftX,
					normalizedValue: horizontal,
				},
				{
					control: controls.eyes.rightX,
					normalizedValue: horizontal,
				},
				{
					control: controls.eyes.leftY,
					normalizedValue: vertical,
				},
				{
					control: controls.eyes.rightY,
					normalizedValue: vertical,
				},
			]
				.map(({ control, normalizedValue }) =>
					control
						? {
								path: control.path,
								value: mapNormalizedControlValue(control, clamp(normalizedValue)),
							}
						: null,
				)
				.filter((entry) => entry !== null),
		[controls, horizontal, vertical],
	);
	const hasResolvedGaze = writes.length === 4;

	return (
		<div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
			<RuntimeFaceFrame
				variant="lg"
				label="Renderer output"
				subtitle={`Namespace ${namespace} · ${controls.gazeSource} control writes fan into the live face`}
			/>
			<div className="space-y-4 rounded-2xl border border-accent-base/20 bg-surface-lighter/45 p-5">
				<p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-two">
					Path and value writes
				</p>
				{hasResolvedGaze ? null : (
					<p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-color-500">
						This face did not expose a full resolved gaze control set, so the lab cannot mirror the
						working demo behavior yet.
					</p>
				)}
				<label className="block text-sm text-color-500">
					<span className="mb-2 block font-medium text-foreground">Horizontal gaze</span>
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
							applyValues(next, vertical);
						}}
						className="w-full"
					/>
				</label>
				<label className="block text-sm text-color-500">
					<span className="mb-2 block font-medium text-foreground">Vertical gaze</span>
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
							applyValues(horizontal, next);
						}}
						className="w-full"
					/>
				</label>
				<pre className="overflow-x-auto rounded-xl border border-accent-base/20 bg-surface p-4 text-xs leading-6 text-color-500">
					{JSON.stringify(writes, null, 2)}
				</pre>
			</div>
		</div>
	);
}

export default function RendererDataModelLab() {
	return (
		<TutorialLabSection
			id="renderer-data-model-lab"
			title="Micro-lab: path writes and visible behavior"
			subtitle="Move two sliders and watch a small set of paths update the live face."
			trySteps={[
				"Move the horizontal gaze slider.",
				"Move the vertical gaze slider.",
				"Compare the visible change with the paths and values shown beside the face.",
			]}
			successSignal="You can explain which paths changed and why the eyes moved the way they did."
		>
			{() => (
				<TutorialRuntime namespace="tutorial-renderer-data-model" asset="quoriCurrentExtended">
					<DataModelBody />
				</TutorialRuntime>
			)}
		</TutorialLabSection>
	);
}
