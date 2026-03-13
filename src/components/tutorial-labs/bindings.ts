import { type PoseHotkeyBinding, getPoseGroup } from "@/demo-lib/usePoseHotkeys";

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
