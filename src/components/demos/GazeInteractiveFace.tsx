import { useState, useEffect, useRef, useCallback } from "react";
import { useVizijRuntime } from "@vizij/runtime-react";
import { useIdleGazeBehavior } from "@/demo-lib/useIdleGazeBehavior";
import { useMouseGaze } from "@/demo-lib/useMouseGaze";
import { usePoseHotkeys } from "@/demo-lib/usePoseHotkeys";
import { RuntimeFaceFrame } from "./RuntimeFaceFrame";

export function GazeInteractiveFace({
  enabled = true,
  mode = "panel",
}: {
  enabled?: boolean;
  mode?: "panel" | "media";
}) {
  const { ready, assetBundle } = useVizijRuntime();
  const poseConfig = assetBundle.pose?.config ?? null;
  const { bindings, setPoseWeight } = usePoseHotkeys(
    poseConfig,
    ready && enabled,
  );
  const { ref: gazeRef, isPointerActive } = useMouseGaze(ready && enabled);
  useIdleGazeBehavior({
    enabled: ready && enabled,
    pointerActive: isPointerActive,
  });
  const [prompt, setPrompt] = useState("Move your cursor to steer gaze.");
  const resetTimer = useRef<number | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(true);

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        window.clearTimeout(resetTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!overlayVisible) {
      return;
    }
    const node = gazeRef.current;
    if (!node) {
      return;
    }
    const hideOverlay = () => setOverlayVisible(false);
    node.addEventListener("pointermove", hideOverlay, { once: true });
    node.addEventListener("pointerdown", hideOverlay, { once: true });
    return () => {
      node.removeEventListener("pointermove", hideOverlay);
      node.removeEventListener("pointerdown", hideOverlay);
    };
  }, [gazeRef, overlayVisible]);

  const handleClick = useCallback(() => {
    if (!ready) {
      return;
    }
    if (bindings.length === 0) {
      setPrompt("Pose bundle required for click reactions.");
      return;
    }
    setOverlayVisible(false);
    const randomBinding = bindings[Math.floor(Math.random() * bindings.length)];
    if (!randomBinding) {
      setPrompt("Pose bundle required for click reactions.");
      return;
    }

    bindings.forEach((binding) => {
      if (binding.pose.id === randomBinding.pose.id) {
        return;
      }
      setPoseWeight(binding, 0);
    });
    setPoseWeight(randomBinding, 1);
    setPrompt(
      `Reacting with ${randomBinding.pose.name ?? randomBinding.pose.id}.`,
    );
    if (resetTimer.current) {
      window.clearTimeout(resetTimer.current);
    }
    resetTimer.current = window.setTimeout(() => {
      setPoseWeight(randomBinding, 0);
      setPrompt("Click anywhere on the face to react.");
      resetTimer.current = null;
    }, 520);
  }, [bindings, ready, setPoseWeight]);

  const overlay = overlayVisible ? (
    <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-accent-base/20 bg-surface/85 p-3 text-xs text-color-500 backdrop-blur-md">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-base/80">
        Live Demo
      </p>
      <p>{prompt}</p>
      <p>Mouse movement steers gaze. Click triggers random expressions.</p>
    </div>
  ) : null;

  if (mode === "media") {
    return (
      <RuntimeFaceFrame
        mode="media"
        pointerTargetRef={gazeRef}
        onCanvasClick={handleClick}
        overlay={overlay}
      />
    );
  }

  return (
    <RuntimeFaceFrame
      variant="lg"
      label="Cursor-reactive gaze"
      subtitle="Pointer tracking + pose triggers"
      pointerTargetRef={gazeRef}
      onCanvasClick={handleClick}
      overlay={overlay}
      footer={
        <p>
          Pointer and click inputs are mapped onto rig paths so the same behavior
          can be driven by cursor, touch, or sensor streams.
        </p>
      }
    />
  );
}
