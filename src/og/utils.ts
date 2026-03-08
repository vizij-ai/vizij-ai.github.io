export const truncateText = (value?: string, maxChars = 220) => {
	if (!value) return value;
	if (value.length <= maxChars) return value;
	return `${value.slice(0, maxChars - 1).trimEnd()}…`;
};
