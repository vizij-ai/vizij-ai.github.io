import {
	isBaseRelativePath,
	isExternalUrl,
	resolveBaseUrl,
	resolveSitePath,
	url,
} from "@semio-community/ecosystem-site-core";

export { isBaseRelativePath, isExternalUrl, resolveBaseUrl, resolveSitePath, url };

export function homeUrl(): string {
	return url("/");
}
