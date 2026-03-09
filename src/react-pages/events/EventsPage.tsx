import { EventsPage as SharedEventsPage } from "@semio-community/ecosystem-site-core";
import { Calendar } from "@solar-icons/react-perf/LineDuotone";
import type React from "react";

export type { EventsPageProps } from "@semio-community/ecosystem-site-core";

export default function EventsPage({ children }: { children?: React.ReactNode }) {
	return (
		<SharedEventsPage
			title="Events"
			description="Learn more about Vizij at conferences, workshops, and training events."
			heroIcon={<Calendar className="w-16 h-16 text-accent-two" />}
			actions={[]}
		>
			{children}
		</SharedEventsPage>
	);
}
