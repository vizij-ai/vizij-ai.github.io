import { useMemo, useEffect, useCallback, useRef } from "react";
import { useVizijRuntime } from "@vizij/runtime-react";
import {
  POSE_HOTKEY_LAYOUT,
  usePoseHotkeys,
  type PoseHotkeyBinding,
} from "@/demo-lib/usePoseHotkeys";
import { broadcastPoseTrigger } from "@/demo-lib/poseRigBroadcast";

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
  const featuredBindings = useMemo(() => bindings.slice(18, 24), [bindings]);
  const bindingHotkeys = useMemo(() => {
    return featuredBindings.map((binding, index) => ({
      binding,
      hotkey: POSE_HOTKEY_LAYOUT[index] ?? null,
    }));
  }, [featuredBindings]);
  const timersRef = useRef<Map<string, PoseTimerEntry>>(new Map());

  useEffect(() => {
    return () => {
      timersRef.current.forEach(({ timeoutId, binding }) => {
        window.clearTimeout(timeoutId);
        setPoseWeight(binding, 0);
        broadcastPoseTrigger({
          poseId: binding.pose.id,
          relativePath: binding.relativePath,
          weight: 0,
        });
      });
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
          weight: 0,
        });
      }
      setPoseWeight(binding, 1);
      broadcastPoseTrigger({
        poseId: binding.pose.id,
        relativePath: binding.relativePath,
        weight: 1,
      });
      const timeoutId = window.setTimeout(() => {
        setPoseWeight(binding, 0);
        broadcastPoseTrigger({
          poseId: binding.pose.id,
          relativePath: binding.relativePath,
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
    bindingHotkeys.forEach(({ hotkey, binding }) => {
      if (hotkey) {
        keyBindings.set(hotkey.code, binding);
      }
    });
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
          weight: 0,
        });
      }
      setPoseWeight(binding, 1);
      broadcastPoseTrigger({
        poseId: binding.pose.id,
        relativePath: binding.relativePath,
        weight: 1,
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
        weight: 0,
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      keyBindings.forEach((binding) => {
        setPoseWeight(binding, 0);
        broadcastPoseTrigger({
          poseId: binding.pose.id,
          relativePath: binding.relativePath,
          weight: 0,
        });
      });
      activeKeys.clear();
    };
  }, [bindingHotkeys, clearBindingTimer, ready, setPoseWeight]);

  if (featuredBindings.length === 0) {
    return (
      <div
        className={
          unstyled
            ? ""
            : "rounded-xl border border-dashed border-accent-base/25 bg-surface-lighter/40 p-4"
        }
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-base/80">
          Pose Presets
        </p>
        <h3 className="mt-2 text-base font-semibold">No pose rig metadata found.</h3>
        <p className="mt-2 text-sm text-color-500">
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
          : "rounded-xl border border-accent-base/20 bg-surface-lighter/40 p-4 backdrop-blur-md"
      }
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-accent-base/80">
        Pose Presets
      </p>
      <h3 className="mt-2 text-base font-semibold">Tap to emote.</h3>
      <p className="mt-2 text-sm text-color-500">
        Buttons map straight to Vizij pose weights. Hotkeys mirror each button
        so you can rehearse and perform live.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {bindingHotkeys.map(({ binding, hotkey }, index) => (
          <button
            key={binding.pose.id}
            type="button"
            className="flex items-center justify-between rounded-md border border-accent-base/20 bg-surface px-3 py-2 text-left text-sm transition-colors hover:border-accent-base/50 hover:bg-accent-base/10 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!ready}
            onClick={() => triggerPose(binding)}
          >
            <span>{binding.pose.name ?? `Pose ${index + 1}`}</span>
            {hotkey ? (
              <kbd className="rounded border border-accent-base/20 bg-surface-lighter px-1.5 py-0.5 text-[11px] text-color-500">
                {hotkey.label}
              </kbd>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
