import { createShowcaseBundle, type ShowcaseFaceAssetKey } from "@/demo-lib/faceAssets";
import { VizijRuntimeProvider } from "@vizij/runtime-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

export function TutorialRuntime({
	namespace,
	asset = "hugoLatest",
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

