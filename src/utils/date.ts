import type { CollectionEntry } from "astro:content";
import { siteConfig } from "@/site.config";

function resolveLocale(): string {
	const configured = siteConfig.date?.locale;
	if (Array.isArray(configured)) {
		return configured[0] ?? "en-US";
	}
	return configured ?? "en-US";
}

const DEFAULT_LOCALE = resolveLocale();
const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
	year: "numeric",
	month: "short",
	day: "numeric",
	...(siteConfig.date?.options as Intl.DateTimeFormatOptions | undefined),
};
const ENGLISH_MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

const NARROW_SPACE_REGEX = /[\u202F\u00A0\u2009]/g;
const EN_DASH_SPACING_REGEX = /\s*–\s*/g;

function buildFormatConfig(options?: Intl.DateTimeFormatOptions) {
	return {
		locale: DEFAULT_LOCALE,
		options: {
			...DEFAULT_OPTIONS,
			...options,
		},
	};
}

function normalizeMonthValue(monthValue: string, monthIndex: number, locale: string): string {
	if (Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
		return monthValue;
	}

	const normalizedLocale = locale?.toLowerCase() ?? "";
	if (normalizedLocale.startsWith("en")) {
		return ENGLISH_MONTHS[monthIndex] ?? monthValue;
	}

	return monthValue;
}

function normalizeWhitespace(value: string): string {
	return value.replace(NARROW_SPACE_REGEX, " ").replace(EN_DASH_SPACING_REGEX, " – ");
}

function formatDateWithParts(
	date: Date,
	locale: string,
	options: Intl.DateTimeFormatOptions,
): string {
	const formatter = new Intl.DateTimeFormat(locale, options);
	if (typeof formatter.formatToParts === "function") {
		const parts = formatter.formatToParts(date).map((part) => {
			if (part.type === "month") {
				return {
					...part,
					value: normalizeMonthValue(part.value, date.getMonth(), locale),
				};
			}
			return part;
		});
		return normalizeWhitespace(parts.map((part) => part.value).join(""));
	}

	return normalizeWhitespace(formatter.format(date));
}

function formatDateRangeWithParts(
	startDate: Date,
	endDate: Date,
	locale: string,
	options: Intl.DateTimeFormatOptions,
): string {
	const formatter = new Intl.DateTimeFormat(locale, options);

	if (typeof formatter.formatRangeToParts === "function") {
		const parts = formatter.formatRangeToParts(startDate, endDate).map((part) => {
			if (part.type === "month") {
				const dateForPart =
					part.source === "endRange"
						? endDate
						: part.source === "startRange"
							? startDate
							: startDate;
				return {
					...part,
					value: normalizeMonthValue(part.value, dateForPart.getMonth(), locale),
				};
			}
			return part;
		});

		return normalizeWhitespace(parts.map((part) => part.value).join(""));
	}

	if (typeof formatter.formatRange === "function") {
		return normalizeWhitespace(formatter.formatRange(startDate, endDate));
	}

	const start = formatDateWithParts(startDate, locale, options);
	const end = formatDateWithParts(endDate, locale, options);
	if (start === end) {
		return start;
	}
	return `${start} – ${end}`;
}

export function getFormattedDate(
	date: Date | undefined,
	options?: Intl.DateTimeFormatOptions,
): string {
	if (date === undefined) {
		return "Invalid Date";
	}

	const { locale, options: formatOptions } = buildFormatConfig(options);
	return formatDateWithParts(date, locale, formatOptions);
}

/**
 * Parse a date-only value (YYYY-MM-DD) as a local calendar date to avoid
 * timezone shifts. Falls back to the native Date constructor if the string
 * is not in date-only form.
 */
export function parseDateLocal(value?: string | number | Date | null): Date {
	if (value instanceof Date) {
		return new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
	}
	if (value === undefined || value === null) return new Date(Number.NaN);
	if (typeof value === "number") return new Date(value);

	const stringValue = String(value);
	const isoMatch = stringValue.match(/^(\d{4})-(\d{2})-(\d{2})/);
	if (isoMatch) {
		const [, year, month, day] = isoMatch;
		return new Date(Number(year), Number(month) - 1, Number(day));
	}

	return new Date(stringValue);
}

// biome-ignore lint/suspicious/noExplicitAny: generic constraint requires any for Astro CollectionEntry
export function collectionDateSort<T extends CollectionEntry<any>>(
	a: T & { data: { publishDate: Date } },
	b: T & { data: { publishDate: Date } },
) {
	return b.data.publishDate.getTime() - a.data.publishDate.getTime();
}

export function getFormattedDateRanges(
	date1: Date,
	date2?: Date,
	options?: Intl.DateTimeFormatOptions,
): string {
	const { locale, options: formatOptions } = buildFormatConfig(options);

	if (!date2 || date1.getTime() === date2.getTime()) {
		return formatDateWithParts(date1, locale, formatOptions);
	}

	return formatDateRangeWithParts(date1, date2, locale, formatOptions);
}
