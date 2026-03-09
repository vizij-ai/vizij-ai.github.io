import type { SectionCopy } from "./SectionCopy";

const STACK = ["Rust", "WebAssembly", "React", "ROS 2", "GLTF", "TypeScript", "Zenoh"];

export function StandardsSection({ copy }: { copy?: SectionCopy }) {
	const eyebrow = copy?.eyebrow ?? "Open standards";
	const title = copy?.title ?? "Built on the open stack.";
	const description =
		copy?.description ??
		"Vizij relies on and integrates with the same technologies teams already trust, so rendered robot faces stay portable and future-proof.";

	return (
		<section id="standards" className="showcase-section">
			<div className="section-header">
				<p className="section-eyebrow">{eyebrow}</p>
				<h2 className="section-title">{title}</h2>
				<p className="section-description">{description}</p>
			</div>
			<div className="standards-row">
				{STACK.map((item) => (
					<span className="standards-pill" key={item}>
						{item}
					</span>
				))}
			</div>
		</section>
	);
}
