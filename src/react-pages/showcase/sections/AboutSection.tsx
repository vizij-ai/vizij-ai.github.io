import { SectionIntro } from "@/components/demos/SectionIntro";
import type { SectionCopy } from "./SectionCopy";

const FEATURES = [
	{
		icon: "🎨",
		title: "Design expressive faces",
		description: "Use GLTF + Vizij metadata to capture nuance.",
	},
	{
		icon: "⚙️",
		title: "Animate in real time",
		description: "Blend keyframes, node graphs, and filters on demand.",
	},
	{
		icon: "🌉",
		title: "Bridge web and robot deployments",
		description: "Deploy by integrating with ROS or your custom infrastructure.",
	},
	{
		icon: "🧩",
		title: "Customize every layer",
		description: "Extend Vizij in Rust or TypeScript without forks.",
	},
	{
		icon: "🫶",
		title: "Collaborate across disciplines",
		description: "Give roboticists, artists, and HRI researchers a shared canvas.",
	},
];

export function AboutSection({ copy }: { copy?: SectionCopy }) {
	const eyebrow = copy?.eyebrow ?? "What is Vizij?";
	const title = copy?.title ?? "Infrastructure for expressive, rendered robot faces.";
	const description =
		copy?.description ??
		"Vizij combines rendering, animation, and orchestration so rendered faces can be projected consistently across screens, apps, and robot hardware.";

	return (
		<section id="about" className="showcase-section">
			<SectionIntro eyebrow={eyebrow} title={title} description={description} />
			<div className="feature-grid">
				{FEATURES.map((feature) => (
					<div className="feature-card" key={feature.title}>
						<span className="feature-card__icon" aria-hidden>
							{feature.icon}
						</span>
						<p className="feature-card__title">{feature.title}</p>
						<p className="feature-card__description">{feature.description}</p>
					</div>
				))}
			</div>
		</section>
	);
}
