import {
	isDraftVisibleForSite,
	shouldShowDrafts as resolveDraftFlag,
} from "@semio-community/ecosystem-site-core";
import { siteConfig } from "@/site.config";

/**
 * True when drafts should be visible on this build. In prod they're
 * always hidden; in dev they're shown by default and can be hidden
 * via `SHOW_DRAFTS=false` / `PUBLIC_SHOW_DRAFTS=false`.
 */
export function shouldShowDrafts(): boolean {
	return resolveDraftFlag({
		isProd: import.meta.env.PROD,
		env: {
			SHOW_DRAFTS: process.env.SHOW_DRAFTS ?? import.meta.env.SHOW_DRAFTS,
			PUBLIC_SHOW_DRAFTS:
				process.env.PUBLIC_SHOW_DRAFTS ?? import.meta.env.PUBLIC_SHOW_DRAFTS,
		},
	});
}

/**
 * Standard collection filter combining the cross-site `sites` scope
 * and the draft visibility check. Passes `siteConfig.siteKey` to
 * the shared helper so an entry whose `sites` is set must include
 * this site to be visible.
 */
export function isDraftVisible(
	draft?: boolean,
	sites?: readonly string[],
): boolean {
	return isDraftVisibleForSite(draft, sites, shouldShowDrafts(), siteConfig.siteKey);
}
