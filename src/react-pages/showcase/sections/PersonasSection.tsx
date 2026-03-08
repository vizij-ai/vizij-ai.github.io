import type { SectionCopy } from "./SectionCopy";

const PERSONAS = [
	{
		title: "Developers",
		description:
			"Bridge behavior logic, ROS 2 topics, and Vizij runtimes so behavior and expression stay in sync across every surface.",
	},
	{
		title: "Animators",
		description:
			"Preview performances in the browser, craft reusable gestures, and ship character direction straight onto robot hardware.",
	},
	{
		title: "Researchers",
		description:
			"Run reproducible social-perception studies with sharable rigs, scripted expressions, and controllable inputs.",
	},
	{
		title: "Makers & Educators",
		description:
			"Give DIY robots honest expressions without proprietary stacks—Vizij runs on laptops, tablets, or other connected devices.",
	},
];

export function PersonasSection({ copy }: { copy?: SectionCopy }) {
	const eyebrow = copy?.eyebrow ?? "What you can do";
	const title = copy?.title ?? "Vizij meets teams wherever they build.";
	const description =
		copy?.description ??
		"Whether you ship to a web app, abstract robot, or humanoid head, Vizij keeps expressive faces consistent from prototype to production.";

	return (
		<section id="personas" className="showcase-section">
			<div className="section-header">
				<p className="section-eyebrow">{eyebrow}</p>
				<h2 className="section-title">{title}</h2>
				<p className="section-description">{description}</p>
			</div>
			<div className="persona-grid">
				{PERSONAS.map((persona) => (
					<article className="persona-card" key={persona.title}>
						<p className="persona-card__eyebrow">{persona.title}</p>
						<p className="persona-card__body">{persona.description}</p>
					</article>
				))}
			</div>
		</section>
	);
}
