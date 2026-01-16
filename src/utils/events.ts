import { getFormattedDateRanges, parseDateLocal } from "./date";

interface PartialEvent {
  description?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  dates?: Array<{ name: string; date: Date; order?: number }>;
  location?: {
    city?: string;
    country?: string;
    online?: boolean;
  };
}

function getStartDate(dates?: Array<{ name: string; date: Date; order?: number }>): Date | undefined {
  if (!dates || dates.length === 0) return undefined;
  
  const startDateEntry = dates.find(d => d.name.toLowerCase() === 'start date');
  if (startDateEntry) return startDateEntry.date;
  
  // Fall back to "Event Date" if it exists
  const eventDateEntry = dates.find(d => d.name.toLowerCase() === 'event date');
  if (eventDateEntry) return eventDateEntry.date;
  
  return dates.reduce((min, current) => 
    current.date < min.date ? current : min
  ).date;
}

function getEndDate(dates?: Array<{ name: string; date: Date; order?: number }>): Date | undefined {
  if (!dates || dates.length === 0) return undefined;
  
  const endDateEntry = dates.find(d => d.name.toLowerCase() === 'end date');
  if (endDateEntry) return endDateEntry.date;
  
  // Fall back to "Event Date" if it exists
  const eventDateEntry = dates.find(d => d.name.toLowerCase() === 'event date');
  if (eventDateEntry) return eventDateEntry.date;
  
  return dates.reduce((max, current) => 
    current.date > max.date ? current : max
  ).date;
}

export function getEventPreviewDescriptionText(event: PartialEvent): string {
  const locationString = getLocationString(event.location);

  // Support both old and new formats
  let startDateVal = event.startDate;
  let endDateVal = event.endDate;
  
  if (event.dates && event.dates.length > 0) {
    startDateVal = getStartDate(event.dates);
    endDateVal = getEndDate(event.dates);
  }

  const start = parseDateLocal(startDateVal ?? new Date());
  const end = parseDateLocal(endDateVal ?? startDateVal ?? new Date());

  const dateString = getFormattedDateRanges(start, end);

  return getDescription(dateString, event.description, locationString);
}

export function getLocationString(location?: {
  city?: string;
  country?: string;
  online?: boolean;
}): string | undefined {
  if (!location) return undefined;
  if (location.city && location.country)
    return `${location.city}, ${location.country}`;
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
  } else if (descriptionString) {
    return `${dateString} • ${descriptionString}`;
  } else {
    return dateString;
  }
}
