export type HubCard = {
	id: string;
	title: string;
	description: string;
	href: string;
	meta: string;
	badge?: string;
};

export type HubSection = {
	id: string;
	title: string;
	subtitle: string;
	cards: HubCard[];
};

export type HubPageContent = {
	eyebrow: string;
	title: string;
	description: string;
	actions: Array<{
		label: string;
		href: string;
		variant: "primary" | "secondary" | "tertiary";
	}>;
	sections: HubSection[];
};

export const docsHubContent: HubPageContent = {
	eyebrow: "Vizij Docs",
	title: "Core concepts, architecture, and deployment models for the Vizij ecosystem.",
	description:
		"Use these pages to understand how Vizij fits together before dropping into a hands-on walkthrough. The docs hub explains the data model, rigging model, animation model, and deployment model behind the tutorial path.",
	actions: [
		{ label: "Start Here", href: "/docs/getting-started/", variant: "primary" },
		{ label: "View Architecture", href: "/docs/architecture/", variant: "secondary" },
		{ label: "Follow Tutorials", href: "/tutorials/", variant: "tertiary" },
	],
	sections: [
		{
			id: "foundations",
			title: "Foundations",
			subtitle: "Learn the system framing before you start changing or deploying a face.",
			cards: [
				{
					id: "getting-started",
					title: "Getting Started",
					description:
						"Understand the intended learner journey, prerequisites, and first successful interaction.",
					href: "/docs/getting-started/",
					meta: "Start here",
					badge: "Guide",
				},
				{
					id: "architecture",
					title: "Architecture",
					description:
						"See how authoring, runtime, deployment, and protocol layers meet inside Vizij.",
					href: "/docs/architecture/",
					meta: "System map",
					badge: "Reference",
				},
			],
		},
		{
			id: "models",
			title: "Core models",
			subtitle: "The contracts that make rendered robot faces portable, controllable, and reusable.",
			cards: [
				{
					id: "renderer-data-model",
					title: "Renderer Data Model",
					description:
						"How values, paths, and renderer state updates flow through a face at runtime.",
					href: "/docs/renderer-data-model/",
					meta: "Runtime data",
					badge: "Model",
				},
				{
					id: "rigging-and-control-model",
					title: "Rigging and Control Model",
					description:
						"How standard controls and custom rigs map abstract intent onto concrete face behavior.",
					href: "/docs/rigging-and-control-model/",
					meta: "Control contracts",
					badge: "Model",
				},
				{
					id: "animation-model",
					title: "Animation Model",
					description:
						"How expressive motion is authored, stored, replayed, and layered inside Vizij.",
					href: "/docs/animation-model/",
					meta: "Motion system",
					badge: "Model",
				},
				{
					id: "deployment-model",
					title: "Deployment Model",
					description:
						"How browser and standalone deployments are structured for real operator-facing use.",
					href: "/docs/deployment-model/",
					meta: "Operations",
					badge: "Reference",
				},
			],
		},
	],
};

export const tutorialsHubContent: HubPageContent = {
	eyebrow: "Vizij Tutorials",
	title: "One maintained tutorial spine for designing, controlling, and deploying rendered robot faces.",
	description:
		"These walkthroughs are written from scratch around the public concepts we want people to learn. Existing apps are implementation references only. Some pages include runnable micro-labs where interaction is the lesson.",
	actions: [
		{ label: "Start With Hello Face", href: "/tutorials/hello-face/", variant: "primary" },
		{ label: "See Docs", href: "/docs/", variant: "secondary" },
		{ label: "Explore Demos", href: "/demos/", variant: "tertiary" },
	],
	sections: [
		{
			id: "foundations",
			title: "Foundations",
			subtitle: "Build intuition for what a face is, how it renders, and how data moves through it.",
			cards: [
				{
					id: "hello-face",
					title: "Hello Face",
					description:
						"Get a face onscreen quickly, understand the first control interaction, and verify the runtime is alive.",
					href: "/tutorials/hello-face/",
					meta: "30-45 min",
					badge: "Micro-lab",
				},
				{
					id: "renderer-data-model",
					title: "Renderer Data Model",
					description:
						"Learn how control messages and values map onto visible renderer behavior.",
					href: "/tutorials/renderer-data-model/",
					meta: "30-45 min",
					badge: "Micro-lab",
				},
			],
		},
		{
			id: "authoring",
			title: "Authoring",
			subtitle: "Move from a working face into reusable control structure and exportable assets.",
			cards: [
				{
					id: "authoring",
					title: "Authoring",
					description:
						"Understand the import, build, export, and iteration loop for reusable face assets.",
					href: "/tutorials/authoring/",
					meta: "Workflow guide",
					badge: "Walkthrough",
				},
				{
					id: "rigging-and-control",
					title: "Rigging and Control",
					description:
						"Map standard controls and custom control groups onto a concrete face implementation.",
					href: "/tutorials/rigging-and-control/",
					meta: "45-60 min",
					badge: "Micro-lab",
				},
			],
		},
		{
			id: "runtime",
			title: "Runtime and deployment",
			subtitle: "Take authored assets into playback, expressive behavior, and deployment contexts.",
			cards: [
				{
					id: "minimal-player",
					title: "Minimal Player",
					description:
						"Build the smallest reliable playback surface that proves a face bundle can run cleanly.",
					href: "/tutorials/minimal-player/",
					meta: "Runtime loop",
					badge: "Walkthrough",
				},
				{
					id: "animations",
					title: "Animations",
					description:
						"Create, save, replay, and troubleshoot expressive motion assets inside the runtime.",
					href: "/tutorials/animations/",
					meta: "30-45 min",
					badge: "Micro-lab",
				},
				{
					id: "agent-face",
					title: "Agent Face",
					description:
						"Integrate conversation-aware behavior, speech, visemes, and expressive state changes.",
					href: "/tutorials/agent-face/",
					meta: "Integration guide",
					badge: "Walkthrough",
				},
				{
					id: "deployment",
					title: "Deployment",
					description:
						"Move from local development into browser and standalone operator-facing deployment paths.",
					href: "/tutorials/deployment/",
					meta: "Delivery guide",
					badge: "Walkthrough",
				},
			],
		},
	],
};
