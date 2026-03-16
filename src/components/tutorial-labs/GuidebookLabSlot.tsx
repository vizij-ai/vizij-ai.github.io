import { TutorialLabPlaceholder } from "@/components/tutorial-labs/TutorialLabPlaceholder";
import { Suspense, lazy, useMemo } from "react";

const labMap = {
	"hello-face": {
		load: () => import("@/components/tutorial-labs/HelloFaceLab"),
		id: "hello-face-lab",
		title: "Micro-lab: first visible control",
		subtitle: "Load a working face and trigger one short, repeatable response.",
		trySteps: [
			"Wait for the face to load.",
			"Click any preset button once.",
			"Watch the face respond and settle back to neutral.",
		],
		successSignal:
			"You see a visible expression change and you can repeat it on demand without reloading the page.",
	},
	"first-controls": {
		load: () => import("@/components/tutorial-labs/RendererDataModelLab"),
		id: "first-controls-lab",
		title: "Micro-lab: path writes and visible behavior",
		subtitle: "Move the live controls and compare visible changes with the path-value contract behind them.",
		trySteps: [
			"Move the horizontal gaze slider.",
			"Move the vertical gaze slider.",
			"Compare the visible change with the paths and values shown beside the face.",
		],
		successSignal:
			"You can explain which paths changed and why the visible motion followed.",
	},
	"deep-custom-pipeline": {
		load: () => import("@/components/tutorial-labs/RiggingControlLab"),
		id: "deep-custom-pipeline-lab",
		title: "Micro-lab: control mapping",
		subtitle: "Use one user-facing control and inspect how it fans out to the underlying rig paths.",
		trySteps: [
			"Move the gaze sliders and watch both eyes respond together.",
			"Trigger the featured pose button once.",
			"Compare the standard control and custom control examples.",
		],
		successSignal:
			"You can explain how a single control can map to multiple underlying paths or a pose weight.",
	},
	"minimal-web-player": {
		load: () => import("@/components/tutorial-labs/AnimationLab"),
		id: "minimal-web-player-lab",
		title: "Micro-lab: playback and reset",
		subtitle: "Run a short sequence and inspect how the player returns to a clean baseline.",
		trySteps: [
			"Press Play sequence once.",
			"Watch the face move through each step in order.",
			"Press Reset to return to neutral immediately.",
		],
		successSignal:
			"You can identify the playback order and verify the player resets cleanly.",
	},
} as const;

type LabId = keyof typeof labMap;

export default function GuidebookLabSlot({ labId }: { labId: string }) {
	const config = labMap[labId as LabId];
	if (!config) return null;

	const LazyLab = useMemo(() => lazy(config.load), [config]);
	const fallback = (
		<TutorialLabPlaceholder
			id={config.id}
			title={config.title}
			subtitle={config.subtitle}
			trySteps={config.trySteps}
			successSignal={config.successSignal}
		/>
	);

	return (
		<Suspense fallback={fallback}>
			<LazyLab />
		</Suspense>
	);
}
