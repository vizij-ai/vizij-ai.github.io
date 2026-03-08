import HeroHeader from "@/components/hero/HeroHeader";
import { Compass } from "@solar-icons/react-perf/LineDuotone";

export default function NotFoundPage() {
	return (
		<HeroHeader
			title="404 | Page not found"
			description="We couldn't find the page you're looking for. Check the URL or head back to the homepage."
			icon={<Compass className="w-16 h-16 text-accent-two" />}
			actions={[
				{
					label: "Return Home",
					href: "/",
					variant: "primary",
				},
			]}
		/>
	);
}
