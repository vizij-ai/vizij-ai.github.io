import { useEffect, useMemo, useState, type ReactNode } from "react";
import { VizijRuntimeProvider, useVizijRuntime } from "@vizij/runtime-react";
import {
  createShowcaseBundle,
  type ShowcaseFaceAssetKey,
} from "@/demo-lib/faceAssets";
import { broadcastRuntimeStatus } from "@/demo-lib/runtimeDebug";

type ShowcaseRuntimeProps = {
  namespace: string;
  asset?: ShowcaseFaceAssetKey;
  children: ReactNode;
  active?: boolean;
  fallback?: ReactNode;
  autostart?: boolean;
  driveOrchestrator?: boolean;
  visible?: boolean;
  hiddenStepHz?: number;
  label?: string;
};

export function ShowcaseRuntime({
  namespace,
  asset = "hugoLatest",
  children,
  active = true,
  fallback = null,
  autostart = true,
  driveOrchestrator = false,
  visible = true,
  hiddenStepHz = 1,
  label,
}: ShowcaseRuntimeProps) {
  const bundle = useMemo(
    () => createShowcaseBundle(namespace, asset),
    [namespace, asset],
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!active) {
    return <>{fallback}</>;
  }
  if (!ready) {
    return <>{fallback}</>;
  }

  const shouldAutostart = autostart && visible;
  const shouldDriveHidden = driveOrchestrator && !visible && hiddenStepHz > 0;

  return (
    <VizijRuntimeProvider assetBundle={bundle} autostart={shouldAutostart}>
      <HiddenStepController enabled={shouldDriveHidden} hz={hiddenStepHz} />
      <RuntimeDebugBeacon
        namespace={namespace}
        label={label}
        visible={visible}
        driver={driveOrchestrator}
        autostart={shouldAutostart}
        hiddenStepHz={hiddenStepHz}
      />
      {children}
    </VizijRuntimeProvider>
  );
}

function HiddenStepController({
  enabled,
  hz,
}: {
  enabled: boolean;
  hz: number;
}) {
  const { step, ready } = useVizijRuntime();

  useEffect(() => {
    if (!enabled || !ready || hz <= 0) {
      return;
    }
    const intervalMs = 1000 / hz;
    const id = window.setInterval(() => {
      step(1 / hz);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [enabled, hz, ready, step]);

  return null;
}

function RuntimeDebugBeacon(props: {
  namespace: string;
  label?: string;
  visible: boolean;
  driver: boolean;
  autostart: boolean;
  hiddenStepHz: number;
}) {
  const { namespace, label, visible, driver, autostart, hiddenStepHz } = props;
  useEffect(() => {
    broadcastRuntimeStatus({
      namespace,
      label,
      visible,
      driver,
      autostart,
      hiddenStepHz,
      timestamp: Date.now(),
    });
  }, [autostart, driver, hiddenStepHz, label, namespace, visible]);

  return null;
}
