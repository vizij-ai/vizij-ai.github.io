/**
 * Re-export shim. The canonical HeroHeader now lives in
 * `@semio-community/ecosystem-site-core` (the per-site copies were
 * older forks that diverged on the glyph field vs the hero-image
 * feature). The shared version is the superset: glyph field removed
 * (vestigial), hero-image (`img`/`imgAlt`/`imgObjectPosition`)
 * retained. Existing `@/components/hero/HeroHeader` imports keep
 * working unchanged.
 */
import { HeroHeader } from "@semio-community/ecosystem-site-core";

export default HeroHeader;
export type {
	HeroHeaderProps,
	HeroAction,
	HeroHeadingTag,
} from "@semio-community/ecosystem-site-core";
