import { type ShowcaseFaceAssetKey, createShowcaseBundle } from "@/demo-lib/faceAssets";
import { VizijRuntimeProvider } from "@vizij/runtime-react";
import { type ReactNode, useEffect, useMemo, useState } from "react";

export function TutorialRuntime({
	namespace,
	asset = "quoriCurrentExtended",
	children,
	fallback,
}: {
	namespace: string;
	asset?: ShowcaseFaceAssetKey;
	children: ReactNode;
	fallback?: ReactNode;
}) {
	const bundle = useMemo(() => createShowcaseBundle(namespace, asset), [namespace, asset]);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <>{fallback ?? null}</>;
	}

	return (
		<VizijRuntimeProvider assetBundle={bundle} autostart>
			{children}
		</VizijRuntimeProvider>
	);
}
