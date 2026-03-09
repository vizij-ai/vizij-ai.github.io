import type { SectionCopy } from "./SectionCopy";

const DEFAULT_LINKS = [
	// { label: "💬 Join the Discord", href: "https://discord.gg/vizij" },
	{ label: "🧑‍💻 Contribute on GitHub", href: "https://github.com/vizij-ai" },
	{
		label: "Learn more about Semio Community",
		href: "https://semio.community",
	},
	// { label: "💡 Share your rigs", href: "https://semio.community/demos" },
];

export function CommunitySection({ copy }: { copy?: SectionCopy }) {
	const eyebrow = copy?.eyebrow ?? "Join the community";
	const title = copy?.title ?? "Vizij is built inside the Semio Community.";
	const description =
		copy?.description ??
		"We are building open, extensible tools for expressive robot systems. Join the community to share rigs, contribute code, and co-host workshops.";
	const links = copy?.links?.length ? copy.links : DEFAULT_LINKS;

	return (
		<section id="community" className="showcase-section">
			<div className="section-header">
				<p className="section-eyebrow">{eyebrow}</p>
				<h2 className="section-title">
					{title.includes("Semio Community") ? (
						<>
							Vizij is built inside the <a href="https://semio.community">Semio Community</a>.
						</>
					) : (
						title
					)}
				</h2>
				<p className="section-description">{description}</p>
			</div>
			<div className="community-chip-row">
				{links.map((link) => (
					<a
						key={link.label}
						className="community-chip"
						href={link.href}
						target="_blank"
						rel="noreferrer"
					>
						{link.label}
					</a>
				))}
			</div>
		</section>
	);
}
