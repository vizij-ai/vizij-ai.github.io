import { getFormattedDateRanges, parseDateLocal } from "./date";

interface PartialEvent {
	description?: string;
	startDate: Date | string;
	endDate?: Date | string;
	location?: {
		city?: string;
		country?: string;
		online?: boolean;
	};
}

export function getEventPreviewDescriptionText(event: PartialEvent): string {
	const locationString = getLocationString(event.location);

	const start = parseDateLocal(event.startDate);
	const end = parseDateLocal(event.endDate ?? event.startDate);

	const dateString = getFormattedDateRanges(start, end);

	return getDescription(dateString, event.description, locationString);
}

export function getLocationString(location?: {
	city?: string;
	country?: string;
	online?: boolean;
}): string | undefined {
	if (!location) return undefined;
	if (location.city && location.country) return `${location.city}, ${location.country}`;
	if (location.country) return location.country;
	if (location.online) return "Online";
	return undefined;
}

function getDescription(
	dateString: string,
	descriptionString?: string,
	locationString?: string,
): string {
	if (locationString) {
		return `${dateString} • ${locationString}`;
	}
	if (descriptionString) {
		return `${dateString} • ${descriptionString}`;
	}
	return dateString;
}
