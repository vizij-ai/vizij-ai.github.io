import { RuntimeFaceFrame } from "@/components/demos/RuntimeFaceFrame";
import { useVizijRuntime } from "@vizij/runtime-react";
import { useMemo, useState } from "react";
import { STANDARD_GAZE_PATHS } from "./bindings";
import { TutorialLabSection } from "./TutorialLabSection";
import { TutorialRuntime } from "./TutorialRuntime";

function clamp(value: number, min = -1, max = 1) {
	return Math.min(Math.max(value, min), max);
}

function DataModelBody() {
	const { setInput, faceId, namespace } = useVizijRuntime();
	const [horizontal, setHorizontal] = useState(0);
	const [vertical, setVertical] = useState(0);

	const applyValues = (nextHorizontal: number, nextVertical: number) => {
		setInput(`rig/${faceId ?? "face"}/${STANDARD_GAZE_PATHS.leftX}`, { float: clamp(nextHorizontal) });
		setInput(`rig/${faceId ?? "face"}/${STANDARD_GAZE_PATHS.rightX}`, { float: clamp(nextHorizontal) });
		setInput(`rig/${faceId ?? "face"}/${STANDARD_GAZE_PATHS.leftY}`, { float: clamp(nextVertical) });
		setInput(`rig/${faceId ?? "face"}/${STANDARD_GAZE_PATHS.rightY}`, { float: clamp(nextVertical) });
	};

	const writes = useMemo(
		() => [
			{ path: `rig/${faceId ?? "face"}/${STANDARD_GAZE_PATHS.leftX}`, value: horizontal },
			{ path: `rig/${faceId ?? "face"}/${STANDARD_GAZE_PATHS.rightX}`, value: horizontal },
			{ path: `rig/${faceId ?? "face"}/${STANDARD_GAZE_PATHS.leftY}`, value: vertical },
			{ path: `rig/${faceId ?? "face"}/${STANDARD_GAZE_PATHS.rightY}`, value: vertical },
		],
		[faceId, horizontal, vertical],
	);

	return (
		<div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
			<RuntimeFaceFrame
				variant="lg"
				label="Renderer output"
				subtitle={`Namespace ${namespace} · control writes fan into the live face`}
			/>
			<div className="space-y-4 rounded-2xl border border-accent-base/20 bg-surface-lighter/45 p-5">
				<p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-two">
					Path and value writes
				</p>
				<label className="block text-sm text-color-500">
					<span className="mb-2 block font-medium text-foreground">Horizontal gaze</span>
					<input
						type="range"
						min={-1}
						max={1}
						step={0.05}
						value={horizontal}
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
				<TutorialRuntime namespace="tutorial-renderer-data-model">
					<DataModelBody />
				</TutorialRuntime>
			)}
		</TutorialLabSection>
	);
}

