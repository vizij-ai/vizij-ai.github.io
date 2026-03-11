import { useSectionInView } from "@/demo-lib/useSectionInView";
import type { ReactNode } from "react";
import { TutorialLabPlaceholder } from "./TutorialLabPlaceholder";

export function TutorialLabSection({
	id,
	title,
	subtitle,
	trySteps,
	successSignal,
	note,
	children,
}: {
	id: string;
	title: string;
	subtitle: string;
	trySteps: string[];
	successSignal: string;
	note?: string;
	children: (state: { hasEntered: boolean; isVisible: boolean }) => ReactNode;
}) {
	const view = useSectionInView<HTMLDivElement>({ threshold: 0.2, once: true });

	return (
		<div ref={view.ref}>
			<TutorialLabPlaceholder
				id={id}
				title={title}
				subtitle={subtitle}
				trySteps={trySteps}
				successSignal={successSignal}
				note={note}
			>
				{view.hasEntered ? children({ hasEntered: view.hasEntered, isVisible: view.isVisible }) : undefined}
			</TutorialLabPlaceholder>
		</div>
	);
}
