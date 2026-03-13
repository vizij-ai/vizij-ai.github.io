import { SPEECH_STATUS_COPY, type SpeechStatus } from "@/demo-lib/speech";

type SpeechOverlayProps = {
	status: SpeechStatus;
};

export function SpeechOverlay({ status }: SpeechOverlayProps) {
	const copy = SPEECH_STATUS_COPY[status];
	return (
		<div className="pointer-events-none absolute inset-3 flex flex-col justify-end gap-2 rounded-lg border border-[#ead7c3] bg-white/72 p-4 text-sm text-color-400 backdrop-blur-md dark:border-white/10 dark:bg-[#171b22]/82 dark:text-[#c8c0b4]">
			<span className="text-[11px] font-semibold uppercase tracking-wider text-accent-base/80">
				Voice demo
			</span>
			<p>{copy.overlay}</p>
		</div>
	);
}
