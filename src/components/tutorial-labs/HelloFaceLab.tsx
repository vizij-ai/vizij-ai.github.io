import { RuntimeFaceFrame } from "@/components/demos/RuntimeFaceFrame";
import { getPoseGroup, usePoseHotkeys } from "@/demo-lib/usePoseHotkeys";
import { useVizijRuntime } from "@vizij/runtime-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { pickExpressiveBindings } from "./bindings";
import { TutorialLabSection } from "./TutorialLabSection";
import { TutorialRuntime } from "./TutorialRuntime";

function HelloFaceLabBody() {
	const { ready, assetBundle, namespace, faceId } = useVizijRuntime();
	const poseConfig = assetBundle.pose?.config ?? null;
	const { bindings, setPoseWeight } = usePoseHotkeys(poseConfig, ready);
	const featuredBindings = useMemo(() => pickExpressiveBindings(bindings, 3), [bindings]);
	const [lastTriggered, setLastTriggered] = useState<string>("Nothing yet");
	const timersRef = useRef<number[]>([]);

	useEffect(() => {
		return () => {
			for (const timer of timersRef.current) {
				window.clearTimeout(timer);
			}
			timersRef.current = [];
		};
	}, []);

	const triggerPose = useCallback(
		(index: number) => {
			const binding = featuredBindings[index];
			if (!binding) {
				return;
			}
			setPoseWeight(binding, 1);
			setLastTriggered(binding.pose.name ?? binding.pose.id);
			const timeoutId = window.setTimeout(() => {
				setPoseWeight(binding, 0);
			}, 550);
			timersRef.current.push(timeoutId);
		},
		[featuredBindings, setPoseWeight],
	);

	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-xl border border-accent-base/20">
				<div className="aspect-[4/3] bg-linear-to-br from-special-lighter to-special">
					<RuntimeFaceFrame mode="media" />
				</div>
				<div className="border-t border-accent-base/10 bg-surface-lighter/45 px-4 py-3">
					<p className="text-xs font-semibold uppercase tracking-wider text-accent-base/80">
						Live runtime output
					</p>
					<p className="mt-0.5 text-sm text-color-500">
						Namespace {namespace} · Face {faceId ?? "face"}
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-2">
				{featuredBindings.map((binding, index) => (
					<button
						key={binding.pose.id}
						type="button"
						className="flex items-center justify-between rounded-xl border border-accent-base/20 bg-surface px-4 py-3 text-left text-sm transition-colors hover:border-accent-two/45 hover:bg-accent-base/10 disabled:opacity-60"
						disabled={!ready}
						onClick={() => triggerPose(index)}
					>
						<span>{binding.pose.name ?? `Pose ${index + 1}`}</span>
						<span className="text-xs uppercase tracking-[0.2em] text-color-500">
							{getPoseGroup(binding.pose) ?? "pose"}
						</span>
					</button>
				))}
			</div>

			<p className="text-sm leading-6 text-color-500">
				Last trigger: <span className="font-medium text-foreground">{lastTriggered}</span>
			</p>
		</div>
	);
}

export default function HelloFaceLab() {
	return (
		<TutorialLabSection
			id="hello-face-lab"
			title="Micro-lab: first visible control"
			subtitle="Load a working face and trigger one short, repeatable response."
			trySteps={[
				"Wait for the face to load.",
				"Click any preset button once.",
				"Watch the face respond and settle back to neutral.",
			]}
			successSignal="You see a visible expression change and you can repeat it on demand without reloading the page."
		>
			{() => (
				<TutorialRuntime namespace="tutorial-hello-face">
					<HelloFaceLabBody />
				</TutorialRuntime>
			)}
		</TutorialLabSection>
	);
}

