import GuidePage from "@/components/guides/GuidePage";
import { docsGuidePages } from "@/site-content/vizij/guides";

export default function DocsGuidePage({ slug }: { slug: string }) {
	const entry = docsGuidePages[slug];
	if (!entry) {
		throw new Error(`Unknown docs guide slug: ${slug}`);
	}
	return <GuidePage entry={entry} />;
}
