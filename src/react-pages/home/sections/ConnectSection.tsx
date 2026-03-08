import {
	CallToActionButton,
	ConnectSection as SharedConnectSection,
} from "@semio-community/ecosystem-site-core";
import type { ConnectSectionProps } from "@semio-community/ecosystem-site-core";
import React from "react";

export type { ConnectSectionProps };

export default function ConnectSection(props: ConnectSectionProps) {
	return (
		<SharedConnectSection {...props}>
			<CallToActionButton
				href="https://donate.stripe.com/cNiaEX4ZE07R8Wj8Yva7C00"
				size="large"
				variant="primary"
				fullWidth
				ariaLabel="Make a donation"
			>
				Make a Donation
			</CallToActionButton>
			<CallToActionButton
				href="https://forms.gle/5iiaThSsGUMzXWsu6"
				size="large"
				variant="secondary"
				fullWidth
				ariaLabel="Volunteer with Semio Community"
			>
				Volunteer
			</CallToActionButton>
			<CallToActionButton
				href="https://forms.gle/5iiaThSsGUMzXWsu6"
				size="large"
				variant="tertiary"
				fullWidth
				ariaLabel="Join the Semio Community mailing list"
			>
				Join the Mailing List
			</CallToActionButton>
		</SharedConnectSection>
	);
}
