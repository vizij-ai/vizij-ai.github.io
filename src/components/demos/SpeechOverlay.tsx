import { SPEECH_STATUS_COPY, type SpeechStatus } from "@/demo-lib/speech";

type SpeechOverlayProps = {
  status: SpeechStatus;
};

export function SpeechOverlay({ status }: SpeechOverlayProps) {
  const copy = SPEECH_STATUS_COPY[status];
  return (
    <div className="face-overlay face-overlay--full voice-overlay">
      <span className="face-overlay__pill">Voice demo</span>
      <p>{copy.overlay}</p>
    </div>
  );
}
