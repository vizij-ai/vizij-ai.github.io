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
		<div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_0.9fr]">
			<RuntimeFaceFrame
				variant="lg"
				label="Live runtime output"
				subtitle={`Namespace ${namespace} · Face ${faceId ?? "face"}`}
			/>
			<div className="rounded-2xl border border-accent-base/20 bg-surface-lighter/45 p-5">
				<p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-two">
					First control interaction
				</p>
				<h3 className="mt-2 text-lg font-semibold text-foreground">Trigger a visible response.</h3>
				<p className="mt-2 text-sm leading-6 text-color-500">
					These preset buttons fire a small pose weight and then return the face to neutral.
				</p>
				<div className="mt-4 grid grid-cols-1 gap-2">
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
				<p className="mt-4 text-sm leading-6 text-color-500">
					Last trigger: <span className="font-medium text-foreground">{lastTriggered}</span>
				</p>
			</div>
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

