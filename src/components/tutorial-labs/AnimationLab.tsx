import { RuntimeFaceFrame } from "@/components/demos/RuntimeFaceFrame";
import { getPoseGroup, usePoseHotkeys } from "@/demo-lib/usePoseHotkeys";
import { useVizijRuntime } from "@vizij/runtime-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { pickExpressiveBindings } from "./bindings";
import { TutorialLabSection } from "./TutorialLabSection";
import { TutorialRuntime } from "./TutorialRuntime";

function sleep(ms: number) {
	return new Promise<void>((resolve) => {
		window.setTimeout(resolve, ms);
	});
}

function AnimationLabBody() {
	const { ready, assetBundle, animateValue } = useVizijRuntime();
	const poseConfig = assetBundle.pose?.config ?? null;
	const { bindings } = usePoseHotkeys(poseConfig, ready);
	const sequence = useMemo(() => pickExpressiveBindings(bindings, 3), [bindings]);
	const cancelRef = useRef(false);
	const [status, setStatus] = useState("Idle");
	const [playing, setPlaying] = useState(false);

	const resetSequence = useCallback(async () => {
		for (const binding of sequence) {
			await animateValue(binding.weightPath, { float: 0 }, { duration: 0.1 });
		}
	}, [animateValue, sequence]);

	const playSequence = useCallback(async () => {
		if (playing || sequence.length === 0) {
			return;
		}
		cancelRef.current = false;
		setPlaying(true);
		setStatus("Playing");
		for (const binding of sequence) {
			if (cancelRef.current) {
				break;
			}
			setStatus(`Triggering ${binding.pose.name ?? binding.pose.id}`);
			await animateValue(binding.weightPath, { float: 1 }, { duration: 0.18 });
			await sleep(220);
			await animateValue(binding.weightPath, { float: 0 }, { duration: 0.18 });
			await sleep(140);
		}
		if (!cancelRef.current) {
			setStatus("Sequence complete");
		}
		setPlaying(false);
	}, [animateValue, playing, sequence]);

	useEffect(() => {
		return () => {
			cancelRef.current = true;
		};
	}, []);

	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-xl border border-accent-base/20">
				<div className="aspect-[4/3] bg-linear-to-br from-special-lighter to-special">
					<RuntimeFaceFrame mode="media" />
				</div>
				<div className="border-t border-accent-base/10 bg-surface-lighter/45 px-4 py-3">
					<p className="text-xs font-semibold uppercase tracking-wider text-accent-base/80">
						Animated output
					</p>
					<p className="mt-0.5 text-sm text-color-500">
						A short scripted sequence shows timing, reset, and replay behavior.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<button
					type="button"
					className="rounded-xl border border-accent-base/20 bg-surface px-4 py-3 text-sm transition-colors hover:border-accent-two/45 hover:bg-accent-base/10 disabled:opacity-60"
					disabled={!ready || playing || sequence.length === 0}
					onClick={() => void playSequence()}
				>
					Play sequence
				</button>
				<button
					type="button"
					className="rounded-xl border border-accent-base/20 bg-surface px-4 py-3 text-sm transition-colors hover:border-accent-two/45 hover:bg-accent-base/10 disabled:opacity-60"
					disabled={!ready}
					onClick={() => {
						cancelRef.current = true;
						setPlaying(false);
						setStatus("Reset to neutral");
						void resetSequence();
					}}
				>
					Reset
				</button>
			</div>

			<details className="rounded-xl border border-accent-base/20 bg-surface-lighter/45">
				<summary className="cursor-pointer px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-two">
					Playback status
				</summary>
				<div className="border-t border-accent-base/10 p-4 text-sm leading-6 text-color-500">
					<p>
						Status: <span className="font-medium text-foreground">{status}</span>
					</p>
					<p className="mt-3">
						Sequence order:{" "}
						{sequence.length > 0
							? sequence.map((binding) => `${getPoseGroup(binding.pose) ?? "pose"}:${binding.pose.name ?? binding.pose.id}`).join(" -> ")
							: "No expressive bindings found in the current bundle"}
					</p>
				</div>
			</details>
		</div>
	);
}

export default function AnimationLab() {
	return (
		<TutorialLabSection
			id="animation-lab"
			title="Micro-lab: timed expressive playback"
			subtitle="Run a short scripted sequence and watch how the face enters, exits, and resets each motion step."
			trySteps={[
				"Press Play sequence once.",
				"Watch the face move through each step in order.",
				"Press Reset to return to neutral immediately.",
			]}
			successSignal="You can tell when the sequence starts, what order it follows, and how the face returns to a clean baseline."
		>
			{() => (
				<TutorialRuntime namespace="tutorial-animation">
					<AnimationLabBody />
				</TutorialRuntime>
			)}
		</TutorialLabSection>
	);
}

