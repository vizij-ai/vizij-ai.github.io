import GuidePage from "@/components/guides/GuidePage";
import { tutorialGuidePages } from "@/site-content/vizij/guides";

export default function TutorialGuidePage({ slug }: { slug: string }) {
	const entry = tutorialGuidePages[slug];
	if (!entry) {
		throw new Error(`Unknown tutorial guide slug: ${slug}`);
	}
	return <GuidePage entry={entry} />;
}
