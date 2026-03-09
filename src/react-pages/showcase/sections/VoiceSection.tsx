import { FaceFramePlaceholder } from "@/components/demos/FaceFramePlaceholder";
import { RuntimeFaceFrame } from "@/components/demos/RuntimeFaceFrame";
import { SectionIntro } from "@/components/demos/SectionIntro";
import { ShowcaseRuntime } from "@/components/demos/ShowcaseRuntime";
import { SpeechOverlay } from "@/components/demos/SpeechOverlay";
import { VoicePanel } from "@/components/demos/VoicePanel";
import type { SpeechStatus } from "@/demo-lib/speech";
import { useSectionInView } from "@/demo-lib/useSectionInView";
import { useEffect, useRef, useState } from "react";
import type { SectionCopy } from "./SectionCopy";

export function VoiceSection({ copy }: { copy?: SectionCopy }) {
	const eyebrow = copy?.eyebrow ?? "Speech sync";
	const title = copy?.title ?? "Stream visemes into rendered faces.";
	const description =
		copy?.description ??
		"Kick off the sample Amazon Polly read to see how audio events map to nuanced facial expressions. You can swap in your own viseme-generating model to compare.";

	const [speechStatus, setSpeechStatus] = useState<SpeechStatus>("idle");
	const [showOverlay, setShowOverlay] = useState(true);
	const facePointerRef = useRef<HTMLDivElement | null>(null);
	const { ref, hasEntered, isVisible } = useSectionInView<HTMLElement>({
		threshold: 0.3,
		once: false,
	});

	useEffect(() => {
		if (!showOverlay) {
			return;
		}
		const node = facePointerRef.current;
		if (!node) {
			return;
		}
		const hide = () => setShowOverlay(false);
		node.addEventListener("pointermove", hide, { once: true });
		node.addEventListener("pointerdown", hide, { once: true });
		return () => {
			node.removeEventListener("pointermove", hide);
			node.removeEventListener("pointerdown", hide);
		};
	}, [showOverlay]);

	useEffect(() => {
		if (speechStatus !== "idle") {
			setShowOverlay(false);
		}
	}, [speechStatus]);
	return (
		<section id="voice" className="showcase-section" ref={ref}>
			<SectionIntro eyebrow={eyebrow} title={title} description={description} />
			<ShowcaseRuntime
				namespace="voice"
				asset="hugoLatest"
				active={hasEntered}
				autostart={isVisible}
				driveOrchestrator
				visible={isVisible}
				hiddenStepHz={1}
				label="Voice"
				fallback={<VoiceFallback />}
			>
				<div className="section-grid two-col">
					<VoicePanel status={speechStatus} onStatusChange={setSpeechStatus} enabled={isVisible} />
					<RuntimeFaceFrame
						variant="lg"
						label="Voice reactive"
						subtitle="Polly timeline scaffold"
						pointerTargetRef={facePointerRef}
						overlay={showOverlay ? <SpeechOverlay status={speechStatus} /> : null}
					/>
				</div>
			</ShowcaseRuntime>
		</section>
	);
}

function VoiceFallback() {
	return (
		<div className="section-grid two-col">
			<div className="feature-card feature-card--placeholder">
				<p className="feature-card__eyebrow">Speech pipeline</p>
				<h3>Voice demo warming up.</h3>
				<p className="feature-card__description">
					Amazon Polly + Vizij viseme playback boots as soon as the section is visible, keeping
					initial load snappy.
				</p>
			</div>
			<FaceFramePlaceholder
				variant="lg"
				label="Voice reactive"
				subtitle="Viseme playback scaffold"
			/>
		</div>
	);
}
