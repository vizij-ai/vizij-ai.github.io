import type { SectionCopy } from "./SectionCopy";

export function MissionSection({ copy }: { copy?: SectionCopy }) {
	const eyebrow = copy?.eyebrow ?? "Why Vizij exists";
	const title =
		copy?.title ?? "Rendered robot face Infrastructure to unify robot system development.";
	const description =
		copy?.description ??
		"Robot developers often have to spin up an entire pipeline to work on the modules they specialize in. People deserve expressive faces that feel present, trustworthy, and emotionally legible. Vizij makes expressive embodiment as modular as web design so robot designers can benefit from faces that meet humans wherever they interact and designers, developers, and researchers can focus on adding what they do best.";
	const quote = copy?.quote ?? "Open source. Cross-disciplinary. Human-centered.";

	return (
		<section id="mission" className="showcase-section mission-section">
			<div className="section-header">
				<p className="section-eyebrow">{eyebrow}</p>
				<h2 className="section-title">{title}</h2>
				<p className="section-description">{description}</p>
			</div>
			<blockquote className="mission-quote">
				<p>{quote}</p>
			</blockquote>
		</section>
	);
}
