import { getPoseGroup, type PoseHotkeyBinding } from "@/demo-lib/usePoseHotkeys";

function bindingLabel(binding: PoseHotkeyBinding) {
	return `${getPoseGroup(binding.pose) ?? ""} ${binding.pose.name ?? binding.pose.id}`.toLowerCase();
}

export function pickExpressiveBindings(bindings: PoseHotkeyBinding[], count = 3) {
	const emotion = bindings.filter((binding) => bindingLabel(binding).includes("emotion"));
	const viseme = bindings.filter((binding) => bindingLabel(binding).includes("viseme"));
	const remaining = bindings.filter(
		(binding) => !emotion.includes(binding) && !viseme.includes(binding),
	);
	return [...emotion, ...remaining, ...viseme].slice(0, count);
}

export const STANDARD_GAZE_PATHS = {
	leftX: "standard/left_eye/pos/x",
	leftY: "standard/left_eye/pos/y",
	rightX: "standard/right_eye/pos/x",
	rightY: "standard/right_eye/pos/y",
} as const;

