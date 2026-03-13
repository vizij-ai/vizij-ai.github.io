import { broadcastPoseTrigger } from "@/demo-lib/poseRigBroadcast";
import { EXPRESSIVE_EMOTION_POSE_KEYS } from "@/demo-lib/posePaths";
import {
  POSE_HOTKEY_LAYOUT,
  type PoseHotkeyBinding,
  usePoseHotkeys,
} from "@/demo-lib/usePoseHotkeys";
import { useVizijRuntime } from "@vizij/runtime-react";
import { useCallback, useEffect, useMemo, useRef } from "react";

const DEFAULT_POSE_WEIGHT = 1;

type PoseTimerEntry = {
  timeoutId: number;
  binding: PoseHotkeyBinding;
};

export function PoseButtonPanel({
  unstyled = false,
}: {
  unstyled?: boolean;
} = {}) {
  const { ready, assetBundle } = useVizijRuntime();
  const poseConfig = assetBundle.pose?.config ?? null;
  const { bindings, setPoseWeight } = usePoseHotkeys(poseConfig, ready);
  const featuredBindings = useMemo(() => {
    const emotionsByKey = new Map(
      bindings
        .filter(
          (binding) =>
            binding.semanticKind === "emotion" && binding.semanticKey,
        )
        .map((binding) => [binding.semanticKey, binding] as const),
    );
    const ordered = EXPRESSIVE_EMOTION_POSE_KEYS.map((key) =>
      emotionsByKey.get(key),
    ).filter((binding): binding is PoseHotkeyBinding => Boolean(binding));
    if (ordered.length > 0) {
      return ordered;
    }

    const emotionBindings = bindings.filter(
      (binding) => binding.semanticKind === "emotion",
    );
    if (emotionBindings.length > 0) {
      return emotionBindings;
    }

    return bindings.slice(0, 6);
  }, [bindings]);
  const bindingHotkeys = useMemo(() => {
    return featuredBindings.map((binding, index) => ({
      binding,
      hotkey: POSE_HOTKEY_LAYOUT[index] ?? null,
    }));
  }, [featuredBindings]);
  const timersRef = useRef<Map<string, PoseTimerEntry>>(new Map());

  useEffect(() => {
    return () => {
      for (const { timeoutId, binding } of timersRef.current.values()) {
        window.clearTimeout(timeoutId);
        setPoseWeight(binding, 0);
        broadcastPoseTrigger({
          poseId: binding.pose.id,
          relativePath: binding.relativePath,
          semanticKey: binding.semanticKey,
          weight: 0,
        });
      }
      timersRef.current.clear();
    };
  }, [setPoseWeight]);

  const clearBindingTimer = useCallback((poseId: string) => {
    const timers = timersRef.current;
    const existing = timers.get(poseId);
    if (!existing) {
      return null;
    }
    window.clearTimeout(existing.timeoutId);
    timers.delete(poseId);
    return existing.binding;
  }, []);

  const triggerPose = useCallback(
    (binding: PoseHotkeyBinding) => {
      if (!binding || !ready) {
        return;
      }
      const clearedBinding = clearBindingTimer(binding.pose.id);
      if (clearedBinding) {
        setPoseWeight(clearedBinding, 0);
        broadcastPoseTrigger({
          poseId: clearedBinding.pose.id,
          relativePath: clearedBinding.relativePath,
          semanticKey: clearedBinding.semanticKey,
          weight: 0,
        });
      }
      setPoseWeight(binding, DEFAULT_POSE_WEIGHT);
      broadcastPoseTrigger({
        poseId: binding.pose.id,
        relativePath: binding.relativePath,
        semanticKey: binding.semanticKey,
        weight: DEFAULT_POSE_WEIGHT,
      });
      const timeoutId = window.setTimeout(() => {
        setPoseWeight(binding, 0);
        broadcastPoseTrigger({
          poseId: binding.pose.id,
          relativePath: binding.relativePath,
          semanticKey: binding.semanticKey,
          weight: 0,
        });
        timersRef.current.delete(binding.pose.id);
      }, 650);
      timersRef.current.set(binding.pose.id, { timeoutId, binding });
    },
    [clearBindingTimer, ready, setPoseWeight],
  );

  useEffect(() => {
    if (!ready || bindingHotkeys.length === 0) {
      return;
    }

    const keyBindings = new Map<string, PoseHotkeyBinding>();
    for (const { hotkey, binding } of bindingHotkeys) {
      if (hotkey) {
        keyBindings.set(hotkey.code, binding);
      }
    }
    if (keyBindings.size === 0) {
      return;
    }

    const activeKeys = new Set<string>();

    const handleKeyDown = (event: KeyboardEvent) => {
      const binding = keyBindings.get(event.code);
      if (!binding || activeKeys.has(event.code)) {
        return;
      }
      activeKeys.add(event.code);
      const clearedBinding = clearBindingTimer(binding.pose.id);
      if (clearedBinding) {
        setPoseWeight(clearedBinding, 0);
        broadcastPoseTrigger({
          poseId: clearedBinding.pose.id,
          relativePath: clearedBinding.relativePath,
          semanticKey: clearedBinding.semanticKey,
          weight: 0,
        });
      }
      setPoseWeight(binding, DEFAULT_POSE_WEIGHT);
      broadcastPoseTrigger({
        poseId: binding.pose.id,
        relativePath: binding.relativePath,
        semanticKey: binding.semanticKey,
        weight: DEFAULT_POSE_WEIGHT,
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const binding = keyBindings.get(event.code);
      if (!binding || !activeKeys.has(event.code)) {
        return;
      }
      activeKeys.delete(event.code);
      setPoseWeight(binding, 0);
      broadcastPoseTrigger({
        poseId: binding.pose.id,
        relativePath: binding.relativePath,
        semanticKey: binding.semanticKey,
        weight: 0,
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      for (const binding of keyBindings.values()) {
        setPoseWeight(binding, 0);
        broadcastPoseTrigger({
          poseId: binding.pose.id,
          relativePath: binding.relativePath,
          semanticKey: binding.semanticKey,
          weight: 0,
        });
      }
      activeKeys.clear();
    };
  }, [bindingHotkeys, clearBindingTimer, ready, setPoseWeight]);

  if (featuredBindings.length === 0) {
    return (
      <div
        className={
          unstyled
            ? ""
            : "rounded-xl border border-dashed border-[#ead7c3] bg-white/70 p-4 dark:border-white/10 dark:bg-[#171b22]/76"
        }
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-base/80">
          Pose Presets
        </p>
        <h3 className="mt-2 text-base font-semibold">
          No pose rig metadata found.
        </h3>
        <p className="mt-2 text-sm text-color-500 dark:text-[#c8c0b4]">
          Load a rig bundle with pose definitions to unlock instant expression
          triggers.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        unstyled
          ? ""
          : "rounded-xl border border-[#ead7c3] bg-white/74 p-4 backdrop-blur-md dark:border-white/10 dark:bg-[#171b22]/82"
      }
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-accent-base/80">
        Pose Presets
      </p>
      <h3 className="mt-2 text-base font-semibold">Tap to emote.</h3>
      <p className="mt-2 text-sm text-color-500 dark:text-[#c8c0b4]">
        Buttons map straight to Vizij pose weights. Hotkeys mirror each button
        so you can rehearse and perform live.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {bindingHotkeys.map(({ binding, hotkey }, index) => (
          <button
            key={binding.pose.id}
            type="button"
            className="flex items-center justify-between rounded-md border border-[#ead7c3] bg-white/84 px-3 py-2 text-left text-sm transition-colors hover:border-accent-base/50 hover:bg-accent-base/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#0f1318] dark:hover:bg-white/6"
            disabled={!ready}
            onClick={() => triggerPose(binding)}
          >
            <span>{binding.pose.name ?? `Pose ${index + 1}`}</span>
            {hotkey ? (
              <kbd className="rounded border border-[#ead7c3] bg-[#faf1e5] px-1.5 py-0.5 text-[11px] text-color-500 dark:border-white/10 dark:bg-[#1b1f27] dark:text-[#c8c0b4]">
                {hotkey.label}
              </kbd>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
