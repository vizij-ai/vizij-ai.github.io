import GuidePage from "@/components/guides/GuidePage";
import { TutorialLabPlaceholder } from "@/components/tutorial-labs/TutorialLabPlaceholder";
import { tutorialGuidePages } from "@/site-content/vizij/guides";
import { Suspense, lazy, useMemo } from "react";

const tutorialLabMap = {
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
	"renderer-data-model": {
		load: () => import("@/components/tutorial-labs/RendererDataModelLab"),
		id: "renderer-data-model-lab",
		title: "Micro-lab: path writes and visible behavior",
		subtitle: "Move two sliders and watch a small set of paths update the live face.",
		trySteps: [
			"Move the horizontal gaze slider.",
			"Move the vertical gaze slider.",
			"Compare the visible change with the paths and values shown beside the face.",
		],
		successSignal:
			"You can explain which paths changed and why the eyes moved the way they did.",
	},
	"rigging-and-control": {
		load: () => import("@/components/tutorial-labs/RiggingControlLab"),
		id: "rigging-and-control-lab",
		title: "Micro-lab: control mapping",
		subtitle: "Use one friendly control surface and watch it fan out to underlying rig paths.",
		trySteps: [
			"Move the gaze sliders and watch both eyes respond together.",
			"Trigger the featured pose button once.",
			"Compare the standard control and custom control examples.",
		],
		successSignal:
			"You can explain how a single user-facing control can map to multiple underlying paths or a pose weight.",
	},
	animations: {
		load: () => import("@/components/tutorial-labs/AnimationLab"),
		id: "animation-lab",
		title: "Micro-lab: timed expressive playback",
		subtitle:
			"Run a short scripted sequence and watch how the face enters, exits, and resets each motion step.",
		trySteps: [
			"Press Play sequence once.",
			"Watch the face move through each step in order.",
			"Press Reset to return to neutral immediately.",
		],
		successSignal:
			"You can tell when the sequence starts, what order it follows, and how the face returns to a clean baseline.",
	},
} as const;

function TutorialLabSlot({ slug }: { slug: keyof typeof tutorialLabMap }) {
	const labEntry = tutorialLabMap[slug];
	const LazyLab = useMemo(() => lazy(labEntry.load), [labEntry]);
	const placeholder = (
		<TutorialLabPlaceholder
			id={labEntry.id}
			title={labEntry.title}
			subtitle={labEntry.subtitle}
			trySteps={labEntry.trySteps}
			successSignal={labEntry.successSignal}
		/>
	);

	if (typeof window === "undefined") {
		return placeholder;
	}

	return (
		<Suspense fallback={placeholder}>
			<LazyLab />
		</Suspense>
	);
}

export default function TutorialGuidePage({ slug }: { slug: string }) {
	const entry = tutorialGuidePages[slug];
	if (!entry) {
		throw new Error(`Unknown tutorial guide slug: ${slug}`);
	}
	const hasLab = slug in tutorialLabMap;
	return (
		<GuidePage
			entry={entry}
			lab={hasLab ? <TutorialLabSlot slug={slug as keyof typeof tutorialLabMap} /> : undefined}
		/>
	);
}
