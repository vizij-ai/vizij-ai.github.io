export type GuideAction = {
	label: string;
	href: string;
	variant: "primary" | "secondary" | "tertiary";
};

export type GuideOverviewPanel = {
	title: string;
	items: string[];
};

export type GuideLink = {
	label: string;
	href: string;
	description: string;
};

export type GuideSection = {
	id: string;
	title: string;
	subtitle: string;
	paragraphs?: string[];
	bullets?: string[];
	orderedBullets?: string[];
	links?: GuideLink[];
};

export type GuidePageEntry = {
	slug: string;
	kind: "docs" | "tutorial";
	eyebrow: string;
	title: string;
	description: string;
	actions: GuideAction[];
	overviewPanels: GuideOverviewPanel[];
	referenceImplementation?: {
		label: string;
		href: string;
		note: string;
	};
	nextStep?: {
		label: string;
		href: string;
		description: string;
	};
	sections: GuideSection[];
	resourcesTitle: string;
	resources: GuideLink[];
};

const orgGitHub = "https://github.com/vizij-ai";
const vizijWebRepo = `${orgGitHub}/vizij-web`;
const vizijDocsRepo = `${orgGitHub}/vizij-docs`;

export const docsGuidePages: Record<string, GuidePageEntry> = {
	"getting-started": {
		slug: "getting-started",
		kind: "docs",
		eyebrow: "Vizij Docs",
		title: "Getting Started",
		description:
			"Start with the public tutorial spine, understand the minimal prerequisites, and know what success looks like before you drop into the runtime details.",
		actions: [
			{ label: "Open Tutorials", href: "/tutorials/", variant: "primary" },
			{ label: "Read Architecture", href: "/docs/architecture/", variant: "secondary" },
			{ label: "Explore Demos", href: "/demos/", variant: "tertiary" },
		],
		overviewPanels: [
			{
				title: "Start here if",
				items: [
					"You want the cleanest public path into Vizij.",
					"You need to understand the overall learning sequence.",
					"You want to avoid jumping straight into app-specific surfaces.",
				],
			},
			{
				title: "Minimal prerequisites",
				items: [
					"Comfort with web-based tooling and static sites.",
					"A willingness to learn the runtime and control model in sequence.",
					"A face asset or a willingness to begin with the existing Hugo reference asset.",
				],
			},
			{
				title: "First success signal",
				items: [
					"You can place a face onscreen.",
					"You can trigger a visible change through a control path.",
					"You know which docs and tutorials come next.",
				],
			},
		],
		nextStep: {
			label: "Continue to the Hello Face tutorial",
			href: "/tutorials/hello-face/",
			description:
				"Move from high-level orientation into the first working face and the first deterministic control interaction.",
		},
		sections: [
			{
				id: "public-path",
				title: "The maintained public path",
				subtitle: "Vizij now has one primary route for learning, not a collection of competing tutorial packs.",
				paragraphs: [
					"The public site leads with one maintained sequence: website, Hello Face, renderer data model, authoring, rigging and control, minimal player, animations, agent face, and deployment.",
					"That path is designed to match how people actually learn the system. Start with a visible face, then understand the runtime, then move into authoring and integration, then take the result into deployment.",
					"Existing workshop materials, old tutorial packs, and app-specific demos remain useful as source material, but they are no longer the canonical way to explain Vizij to new users.",
				],
			},
			{
				id: "what-to-prepare",
				title: "What to prepare",
				subtitle: "Keep the first pass small, deterministic, and easy to verify.",
				bullets: [
					"Use the public docs hub when you need architecture or model-level explanations.",
					"Use the tutorials hub when you want a guided workflow with explicit next steps.",
					"Use the demos page for richer runtime examples, not as the default learning entrypoint.",
					"Start with the existing Hugo reference face when you want to avoid asset pipeline work in phase 1.",
				],
			},
			{
				id: "how-to-progress",
				title: "How to progress cleanly",
				subtitle: "Learn one level at a time so the platform and the user experience stay connected.",
				orderedBullets: [
					"Get a face onscreen and verify the runtime is alive.",
					"Understand how values and control paths move through the renderer.",
					"Learn how authoring and rigging turn a face into a reusable asset bundle.",
					"Move into playback, expressive behavior, conversation integration, and deployment only after the basics are stable.",
				],
			},
		],
		resourcesTitle: "Deeper reference links",
		resources: [
			{
				label: "Vizij internal documentation",
				href: vizijDocsRepo,
				description: "Cross-repo architecture, roadmap framing, and current system decisions.",
			},
			{
				label: "Vizij web workspace",
				href: vizijWebRepo,
				description: "Current packages, apps, and runtime implementations that back the public docs.",
			},
		],
	},
	architecture: {
		slug: "architecture",
		kind: "docs",
		eyebrow: "Vizij Docs",
		title: "Architecture",
		description:
			"Understand how authoring, runtime control, renderer state, deployment surfaces, and protocol work fit together in the current Vizij stack.",
		actions: [
			{ label: "Read Getting Started", href: "/docs/getting-started/", variant: "primary" },
			{
				label: "Follow Renderer Tutorial",
				href: "/tutorials/renderer-data-model/",
				variant: "secondary",
			},
			{ label: "Explore Demos", href: "/demos/", variant: "tertiary" },
		],
		overviewPanels: [
			{
				title: "System layers",
				items: [
					"Face assets and bundles",
					"Renderer and control data model",
					"Runtime orchestration and deployment surfaces",
				],
			},
			{
				title: "Near-term story",
				items: [
					"Public docs and tutorials lead the presentation.",
					"Creator reliability and deployment are the near-term operational focus.",
					"Deeper runtime expressiveness remains visible but not the public starting point.",
				],
			},
			{
				title: "What to look for",
				items: [
					"How authored assets become runtime bundles.",
					"Where control values are staged, merged, and rendered.",
					"How browser and standalone deployments stay connected to the same core model.",
				],
			},
		],
		sections: [
			{
				id: "layering",
				title: "Layered architecture",
				subtitle: "Vizij is presented as a public learning system, but it still rests on a deeper platform stack.",
				paragraphs: [
					"At the public level, people encounter Vizij through docs, tutorials, and demos. Beneath that surface, the system is organized around authored face bundles, runtime wiring, renderer state, expressive behavior, and deployment surfaces.",
					"The important architectural point is that those layers are not separate products. They are different views into the same system: authoring produces reusable assets, runtime surfaces stage values and behavior, and deployment paths expose that behavior to operators and applications.",
				],
			},
			{
				id: "runtime-pipeline",
				title: "Runtime pipeline",
				subtitle: "Data moves from bundle and control input into a rendered face through explicit runtime contracts.",
				bullets: [
					"An asset bundle supplies the GLB, rig, pose, and optional animation data.",
					"The runtime provider boots the renderer and orchestration layer for a namespace and face.",
					"Control inputs and animation outputs flow through namespaced paths into renderer-visible state.",
					"The face component renders the resulting state through the Vizij renderer.",
				],
			},
			{
				id: "deployment-surface",
				title: "Deployment surface",
				subtitle: "Near-term deployment is intentionally concrete: browser and standalone are both first-class references.",
				paragraphs: [
					"The deployment story is not an abstract future concern. Browser delivery and standalone operator-facing delivery are both active architectural references in the current system.",
					"That is why deployment documentation, protocol notes, and operator control expectations must stay connected to the same concepts taught in the public docs and tutorials.",
				],
			},
		],
		resourcesTitle: "Deeper reference links",
		resources: [
			{
				label: "Runtime React package",
				href: `${vizijWebRepo}/tree/main/packages/@vizij/runtime-react`,
				description: "Current runtime provider and face rendering surface.",
			},
			{
				label: "Vizij architecture docs",
				href: vizijDocsRepo,
				description: "Cross-repo architecture and roadmap framing for the platform.",
			},
		],
	},
	"renderer-data-model": {
		slug: "renderer-data-model",
		kind: "docs",
		eyebrow: "Vizij Docs",
		title: "Renderer Data Model",
		description:
			"Learn how values, paths, and renderer state updates work so you can reason about controls, debugging, and runtime behavior.",
		actions: [
			{
				label: "Try the tutorial",
				href: "/tutorials/renderer-data-model/",
				variant: "primary",
			},
			{
				label: "Read rigging model",
				href: "/docs/rigging-and-control-model/",
				variant: "secondary",
			},
			{ label: "See demos", href: "/demos/", variant: "tertiary" },
		],
		overviewPanels: [
			{
				title: "Core ideas",
				items: [
					"Namespaced paths identify what should change.",
					"Value payloads describe how it should change.",
					"Renderer state reflects the visible result of those updates.",
				],
			},
			{
				title: "Why it matters",
				items: [
					"This model is the bridge between high-level intent and visible expression.",
					"It underpins tutorials, demos, authoring, and deployment.",
					"It is the first place to look when a face behaves incorrectly.",
				],
			},
			{
				title: "Common failures",
				items: [
					"Wrong path",
					"Wrong face or namespace",
					"Wrong value shape or range",
				],
			},
		],
		sections: [
			{
				id: "paths-and-values",
				title: "Paths and values",
				subtitle: "Vizij control is data-driven rather than hard-wired to a single face implementation.",
				paragraphs: [
					"A control message is meaningful only when the path and the value agree about what is being targeted. The path identifies the address within the current namespace and face context. The value payload carries the actual change to apply.",
					"That design lets the same overall system support low-level renderer properties, standard rig paths, pose weights, and other runtime signals without forcing every face into one monolithic interface.",
				],
			},
			{
				id: "state-progression",
				title: "State progression",
				subtitle: "A visible change is the result of staging, stepping, and rendering.",
				bullets: [
					"Inputs are staged into the current runtime context.",
					"The orchestration layer steps forward and resolves current values.",
					"The renderer store reflects the resulting face state.",
					"The runtime face surface renders that state on screen.",
				],
			},
			{
				id: "debugging-model",
				title: "Debugging model",
				subtitle: "When the face is wrong, look for mismatches in address, value, and timing.",
				orderedBullets: [
					"Confirm the face and namespace are the ones you think they are.",
					"Confirm the control path is targeting the intended output or rig path.",
					"Confirm the value shape and range make sense for that path.",
					"Confirm the runtime is stepping and the renderer is receiving the update.",
				],
			},
		],
		resourcesTitle: "Deeper reference links",
		resources: [
			{
				label: "Vizij renderer package",
				href: `${vizijWebRepo}/tree/main/packages/@vizij/render`,
				description: "Current renderer primitives and store-facing surface.",
			},
			{
				label: "Concept reference docs",
				href: `${vizijDocsRepo}/tree/main/current_documentation/concepts`,
				description: "Canonical internal reference material for data, graphs, and binding concepts.",
			},
		],
	},
	"rigging-and-control-model": {
		slug: "rigging-and-control-model",
		kind: "docs",
		eyebrow: "Vizij Docs",
		title: "Rigging and Control Model",
		description:
			"Understand how standard control surfaces and custom face-specific wiring meet so faces stay expressive without becoming one-off systems.",
		actions: [
			{
				label: "Try the tutorial",
				href: "/tutorials/rigging-and-control/",
				variant: "primary",
			},
			{
				label: "Read animation model",
				href: "/docs/animation-model/",
				variant: "secondary",
			},
			{ label: "See authoring", href: "/tutorials/authoring/", variant: "tertiary" },
		],
		overviewPanels: [
			{
				title: "Rigging goals",
				items: [
					"Expose meaningful controls for a face.",
					"Preserve compatibility with shared behavior and tooling.",
					"Keep the path structure understandable and debuggable.",
				],
			},
			{
				title: "Two kinds of rigging",
				items: [
					"Standardized controls for cross-face behavior.",
					"Custom controls for face-specific expressiveness and implementation detail.",
				],
			},
			{
				title: "Healthy rig signs",
				items: [
					"Control names are stable and legible.",
					"Mappings are explicit rather than magical.",
					"Validation against a reference face is straightforward.",
				],
			},
		],
		sections: [
			{
				id: "standard-vs-custom",
				title: "Standard and custom control rigs",
				subtitle: "Vizij needs both portability and expressive flexibility, so the model supports both.",
				paragraphs: [
					"Standard controls make it possible to share interaction logic, tutorials, and runtime expectations across multiple faces. They are the reason a public tutorial path can teach concepts instead of only one current app.",
					"Custom rigs are still essential, because every face has its own geometry, style, and expressive affordances. The point is not to eliminate custom rigging. The point is to keep it legible and compatible with the broader system.",
				],
			},
			{
				id: "path-discipline",
				title: "Path discipline",
				subtitle: "The control model stays useful only when paths remain explicit, stable, and inspectable.",
				bullets: [
					"Keep control groups and path names consistent with the intended mental model.",
					"Prefer mappings that can be read and debugged without specialized tribal knowledge.",
					"Avoid burying common behaviors behind opaque or inconsistent path conventions.",
				],
			},
			{
				id: "validation",
				title: "Validation habits",
				subtitle: "A rig should be easy to prove correct before it reaches a deployment context.",
				orderedBullets: [
					"Verify that standard controls produce the expected visible effect.",
					"Verify that custom controls do not silently break shared behavior assumptions.",
					"Verify that exported bundles carry the rigging information the runtime expects.",
				],
			},
		],
		resourcesTitle: "Deeper reference links",
		resources: [
			{
				label: "Binding and expression concepts",
				href: `${vizijDocsRepo}/tree/main/current_documentation/concepts`,
				description: "Internal concept docs for binding expressions and related rigging concepts.",
			},
			{
				label: "Renderer and authoring workspace",
				href: `${vizijWebRepo}/tree/main/apps/vizij-authoring`,
				description: "Current implementation surface for authoring and validating rigs.",
			},
		],
	},
	"animation-model": {
		slug: "animation-model",
		kind: "docs",
		eyebrow: "Vizij Docs",
		title: "Animation Model",
		description:
			"Understand how expressive motion is represented, replayed, and layered so animation assets stay reusable across runtime contexts.",
		actions: [
			{ label: "Try the tutorial", href: "/tutorials/animations/", variant: "primary" },
			{ label: "Read deployment model", href: "/docs/deployment-model/", variant: "secondary" },
			{
				label: "See minimal player",
				href: "/tutorials/minimal-player/",
				variant: "tertiary",
			},
		],
		overviewPanels: [
			{
				title: "Animation scope",
				items: [
					"Animation assets define motion over time.",
					"They sit on top of the same value and path model used elsewhere in Vizij.",
					"They must be replayable and inspectable in real runtime contexts.",
				],
			},
			{
				title: "Playback expectations",
				items: [
					"Animations should start, stop, reset, and blend predictably.",
					"Timing assumptions should be explicit.",
					"Runtime playback should not depend on hidden authoring state.",
				],
			},
			{
				title: "Why this page exists",
				items: [
					"To separate the mental model of animation from any one current app.",
					"To show how authored motion relates to runtime playback and deployment.",
				],
			},
		],
		sections: [
			{
				id: "assets",
				title: "Animation assets",
				subtitle: "Animations are reusable motion assets, not one-off manual tweaks.",
				paragraphs: [
					"Vizij treats animation as a first-class asset concern. Motion needs to be saved, loaded, replayed, and shared in a way that survives movement between authoring, runtime, demos, and deployment.",
					"That is why the animation model should be thought of alongside bundles and control paths rather than as an isolated visual flourish.",
				],
			},
			{
				id: "playback",
				title: "Playback model",
				subtitle: "Runtime playback must remain deterministic and easy to reason about.",
				bullets: [
					"Know which animation you are starting.",
					"Know whether it resets or blends with current state.",
					"Know how and when it stops.",
					"Know what happens to outputs when playback ends.",
				],
			},
			{
				id: "boundaries",
				title: "Authoring and playback boundaries",
				subtitle: "The animation workflow is strongest when authored motion and runtime execution stay clearly connected but not collapsed into one surface.",
				paragraphs: [
					"Authoring is where motion is created, adjusted, and exported. Playback is where that motion is made operational in a live runtime. The boundary matters because exported animation assets need to stay meaningful outside the authoring UI that produced them.",
				],
			},
		],
		resourcesTitle: "Deeper reference links",
		resources: [
			{
				label: "Animation React package",
				href: `${vizijWebRepo}/tree/main/packages/@vizij/animation-react`,
				description: "Current animation-facing React package surface.",
			},
			{
				label: "Vizij authoring workspace",
				href: `${vizijWebRepo}/tree/main/apps/vizij-authoring`,
				description: "Current implementation surface for authored timeline and runtime playback flows.",
			},
		],
	},
	"deployment-model": {
		slug: "deployment-model",
		kind: "docs",
		eyebrow: "Vizij Docs",
		title: "Deployment Model",
		description:
			"See how browser and standalone delivery fit into the current Vizij story, and what operator-facing deployment really requires.",
		actions: [
			{ label: "Try deployment tutorial", href: "/tutorials/deployment/", variant: "primary" },
			{ label: "Read architecture", href: "/docs/architecture/", variant: "secondary" },
			{ label: "Explore demos", href: "/demos/", variant: "tertiary" },
		],
		overviewPanels: [
			{
				title: "Canonical deployment references",
				items: [
					"Browser deployment",
					"Standalone operator-facing deployment",
					"Shared protocol expectations across both",
				],
			},
			{
				title: "What deployment adds",
				items: [
					"Operator workflows",
					"Protocol and transport concerns",
					"Observability and security follow-up work",
				],
			},
			{
				title: "What is not near-term gating",
				items: [
					"Deeper namespacing evolution",
					"Broader multi-face runtime expressiveness",
					"Every future hardening initiative",
				],
			},
		],
		sections: [
			{
				id: "browser-and-standalone",
				title: "Browser and standalone are both first-class",
				subtitle: "The current deployment story is intentionally concrete rather than speculative.",
				paragraphs: [
					"Vizij needs to support clean browser delivery and standalone operator-facing delivery in the same near-term phase. Those are both active references, not placeholder future ideas.",
					"That is why deployment documentation must talk about operator control, runtime wiring, and practical rollout constraints instead of treating deployment as a final packaging afterthought.",
				],
			},
			{
				id: "operator-surface",
				title: "Operator surface",
				subtitle: "Deployment is about more than rendering a face. It is about exposing the right control and monitoring surface for real use.",
				bullets: [
					"Know what controls an operator needs to see.",
					"Know how multiple control contexts are separated or coordinated.",
					"Know where runtime state and errors are visible.",
				],
			},
			{
				id: "follow-on",
				title: "Follow-on constraints",
				subtitle: "Some deployment-adjacent concerns remain important, but they are not all blocking the current public story.",
				paragraphs: [
					"Namespacing evolution, broader multi-face expressiveness, and deeper hardening all matter. They should remain visible in the architecture and roadmap, but they should not overshadow the current task of getting clean browser and standalone paths ready for people to use and understand.",
				],
			},
		],
		resourcesTitle: "Deeper reference links",
		resources: [
			{
				label: "Vizij standalone app",
				href: `${vizijWebRepo}/tree/main/apps/vizij-standalone`,
				description: "Current standalone deployment reference implementation.",
			},
			{
				label: "Runtime protocol planning",
				href: vizijDocsRepo,
				description: "Current internal planning for standalone protocol and deployment follow-up work.",
			},
		],
	},
};

export const tutorialGuidePages: Record<string, GuidePageEntry> = {
	"hello-face": {
		slug: "hello-face",
		kind: "tutorial",
		eyebrow: "Vizij Tutorials",
		title: "Hello Face",
		description:
			"Get a face onscreen quickly, verify that the runtime is alive, and make your first deterministic control change.",
		actions: [
			{ label: "Tutorial hub", href: "/tutorials/", variant: "primary" },
			{
				label: "Read getting started docs",
				href: "/docs/getting-started/",
				variant: "secondary",
			},
			{ label: "Explore demos", href: "/demos/", variant: "tertiary" },
		],
		overviewPanels: [
			{
				title: "Prerequisites",
				items: [
					"Know the overall tutorial path.",
					"Use the Hugo reference asset if you want the fastest start.",
					"Be ready to verify one visible control change.",
				],
			},
			{
				title: "What you will prove",
				items: [
					"A face bundle can load cleanly.",
					"The runtime can render the face.",
					"You can trigger a visible change on demand.",
				],
			},
			{
				title: "Success check",
				items: [
					"The face appears onscreen.",
					"You trigger at least one clear visible response.",
					"You know which page to read next.",
				],
			},
		],
		referenceImplementation: {
			label: "Current reference implementation",
			href: `${vizijWebRepo}/tree/main/packages/@vizij/runtime-react`,
			note: "Use the runtime-react surface as the implementation substrate, not the public tutorial identity.",
		},
		nextStep: {
			label: "Continue to Renderer Data Model",
			href: "/tutorials/renderer-data-model/",
			description:
				"After you can load and control a face, learn how values and control paths actually move through the renderer.",
		},
		sections: [
			{
				id: "bundle-and-runtime",
				title: "Load a working face bundle",
				subtitle: "Start with the smallest reliable runtime surface rather than a larger app shell.",
				paragraphs: [
					"Use one face bundle, one runtime provider, and one face surface. The goal is not to build a full application yet. The goal is to prove the runtime contract is healthy and visible.",
					"Keep the first pass small enough that you can tell whether the problem is asset loading, runtime bootstrapping, or control wiring.",
				],
			},
			{
				id: "first-control",
				title: "Trigger a first control interaction",
				subtitle: "The first meaningful interaction should be short, visible, and easy to repeat.",
				bullets: [
					"Choose one control that produces a visible response.",
					"Keep the interaction deterministic rather than gesture-heavy.",
					"Reset back to a neutral state after each change so success is obvious.",
				],
			},
			{
				id: "troubleshooting",
				title: "Troubleshoot the first pass",
				subtitle: "When Hello Face fails, keep the failure diagnosis narrow.",
				orderedBullets: [
					"Confirm the asset bundle is loading.",
					"Confirm the face is rendering and not just stalled at initialization.",
					"Confirm the control path or interaction is targeting the expected face and namespace.",
				],
			},
		],
		resourcesTitle: "Deeper reference links",
		resources: [
			{
				label: "Runtime React package",
				href: `${vizijWebRepo}/tree/main/packages/@vizij/runtime-react`,
				description: "Current implementation surface for the minimal runtime loop.",
			},
			{
				label: "Vizij authoring app docs",
				href: `${vizijWebRepo}/tree/main/apps/vizij-authoring`,
				description: "Reference implementation context for where this tutorial leads next.",
			},
		],
	},
	"renderer-data-model": {
		slug: "renderer-data-model",
		kind: "tutorial",
		eyebrow: "Vizij Tutorials",
		title: "Renderer Data Model",
		description:
			"Learn how control paths and values map to visible behavior so you can reason about runtime changes instead of guessing.",
		actions: [
			{ label: "Back to Hello Face", href: "/tutorials/hello-face/", variant: "primary" },
			{
				label: "Read renderer docs",
				href: "/docs/renderer-data-model/",
				variant: "secondary",
			},
			{ label: "Explore demos", href: "/demos/", variant: "tertiary" },
		],
		overviewPanels: [
			{
				title: "Prerequisites",
				items: [
					"You already have a face running.",
					"You have seen at least one visible control interaction.",
					"You are ready to inspect why the change works.",
				],
			},
			{
				title: "What you will prove",
				items: [
					"A control path can be identified and written intentionally.",
					"The value shape matters as much as the path.",
					"You can connect a visible result back to the data that caused it.",
				],
			},
			{
				title: "Success check",
				items: [
					"You can explain the path you changed.",
					"You can explain the value you sent.",
					"You can predict the visible result before triggering it.",
				],
			},
		],
		nextStep: {
			label: "Continue to Authoring",
			href: "/tutorials/authoring/",
			description:
				"Once the runtime data model is clear, move into how authored assets and exported bundles are built.",
		},
		sections: [
			{
				id: "choose-a-path",
				title: "Choose one path and make it legible",
				subtitle: "Do not start with a huge control surface. Start with one value and one visible effect.",
				paragraphs: [
					"Renderer data model work goes wrong when people try to reason about too many paths at once. Pick a single path or a tiny related set, then watch what visible change it produces.",
					"Once that link is clear, the rest of the model becomes easier to extend.",
				],
			},
			{
				id: "watch-the-result",
				title: "Watch the renderer respond",
				subtitle: "The visible face is the output of a specific state update, not an opaque black box.",
				bullets: [
					"Confirm the path is being written into the intended namespace and face context.",
					"Confirm the value is in the expected shape and range.",
					"Watch the renderer change as a result of that one input.",
				],
			},
			{
				id: "debug-data",
				title: "Debug with discipline",
				subtitle: "Renderer debugging improves when you separate address, value, and timing.",
				orderedBullets: [
					"Is the path correct?",
					"Is the value correct?",
					"Is the runtime stepping and applying the update?",
				],
			},
		],
		resourcesTitle: "Deeper reference links",
		resources: [
			{
				label: "Renderer docs",
				href: "/docs/renderer-data-model/",
				description: "Mental model and core contracts behind the tutorial.",
			},
			{
				label: "Vizij render package",
				href: `${vizijWebRepo}/tree/main/packages/@vizij/render`,
				description: "Current implementation surface for the renderer model.",
			},
		],
	},
	authoring: {
		slug: "authoring",
		kind: "tutorial",
		eyebrow: "Vizij Tutorials",
		title: "Authoring",
		description:
			"Understand how a face moves from import and editing into an exported bundle that the runtime can actually use.",
		actions: [
			{
				label: "Back to renderer tutorial",
				href: "/tutorials/renderer-data-model/",
				variant: "primary",
			},
			{ label: "Read architecture", href: "/docs/architecture/", variant: "secondary" },
			{
				label: "Read rigging tutorial",
				href: "/tutorials/rigging-and-control/",
				variant: "tertiary",
			},
		],
		overviewPanels: [
			{
				title: "Prerequisites",
				items: [
					"You understand the runtime data model at a basic level.",
					"You want to produce a reusable face bundle rather than only tweak live values.",
				],
			},
			{
				title: "What you will prove",
				items: [
					"You can move from imported face asset to exported runtime bundle.",
					"You know which information must survive export.",
					"You know what authoring does and does not guarantee.",
				],
			},
			{
				title: "Success check",
				items: [
					"You can describe the import, edit, and export loop.",
					"You can identify the bundle pieces the runtime needs next.",
				],
			},
		],
		referenceImplementation: {
			label: "Current reference implementation",
			href: `${vizijWebRepo}/tree/main/apps/vizij-authoring`,
			note: "The public concept is Authoring. The current implementation surface is vizij-authoring.",
		},
		nextStep: {
			label: "Continue to Rigging and Control",
			href: "/tutorials/rigging-and-control/",
			description:
				"After the asset pipeline is clear, move into how shared and custom controls are attached cleanly.",
		},
		sections: [
			{
				id: "import-build-export",
				title: "Import, build, export",
				subtitle: "The authoring workflow should produce runtime-ready artifacts, not just an editor-specific state.",
				paragraphs: [
					"Treat authoring as a bundle-producing workflow. The point is not only to make the face look right in the editor. The point is to produce something the runtime can load and the deployment path can rely on.",
					"That is why exported assets and control structure matter as much as the editor experience itself.",
				],
			},
			{
				id: "bundle-shape",
				title: "What the export must carry",
				subtitle: "An exported face needs more than geometry to be operational in Vizij.",
				bullets: [
					"Usable face geometry and bounds",
					"Rigging and pose information the runtime can interpret",
					"Any authored animation or control metadata the next stage expects",
				],
			},
			{
				id: "iteration-habits",
				title: "Healthy iteration habits",
				subtitle: "Authoring moves faster when you validate against runtime expectations early.",
				bullets: [
					"Keep checking how the bundle behaves in a minimal runtime.",
					"Do not wait until the end to validate shared controls.",
					"Treat export as a contract check, not just a save button.",
				],
			},
		],
		resourcesTitle: "Deeper reference links",
		resources: [
			{
				label: "Vizij authoring workspace",
				href: `${vizijWebRepo}/tree/main/apps/vizij-authoring`,
				description: "Current authoring implementation surface and local docs.",
			},
			{
				label: "Rigging and control model docs",
				href: "/docs/rigging-and-control-model/",
				description: "The model that the next tutorial step focuses on directly.",
			},
		],
	},
	"rigging-and-control": {
		slug: "rigging-and-control",
		kind: "tutorial",
		eyebrow: "Vizij Tutorials",
		title: "Rigging and Control",
		description:
			"Map reusable control ideas onto a concrete face without losing the shared contract that makes behavior portable.",
		actions: [
			{ label: "Back to Authoring", href: "/tutorials/authoring/", variant: "primary" },
			{
				label: "Read rigging docs",
				href: "/docs/rigging-and-control-model/",
				variant: "secondary",
			},
			{
				label: "Continue to Minimal Player",
				href: "/tutorials/minimal-player/",
				variant: "tertiary",
			},
		],
		overviewPanels: [
			{
				title: "Prerequisites",
				items: [
					"You understand the authoring pipeline.",
					"You are ready to make the controls operational.",
				],
			},
			{
				title: "What you will prove",
				items: [
					"Standard controls can drive the face cleanly.",
					"Custom controls can exist without breaking the shared model.",
					"You can validate the result before deployment.",
				],
			},
			{
				title: "Success check",
				items: [
					"Friendly controls map onto visible behavior.",
					"The path structure remains legible.",
					"You can explain what is standardized and what is custom.",
				],
			},
		],
		nextStep: {
			label: "Continue to Minimal Player",
			href: "/tutorials/minimal-player/",
			description:
				"Once controls are wired correctly, move into the smallest reliable playback surface.",
		},
		sections: [
			{
				id: "wire-standard-controls",
				title: "Wire the standard controls first",
				subtitle: "Make the cross-face contract work before expanding into custom expressiveness.",
				paragraphs: [
					"Standard controls are what let shared tutorials, shared logic, and shared runtime habits survive across different faces. Start there.",
					"Once that baseline is healthy, custom control groups can add the face-specific affordances that make a design distinctive.",
				],
			},
			{
				id: "customize-with-discipline",
				title: "Customize with discipline",
				subtitle: "Custom rigging should extend the model, not fracture it.",
				bullets: [
					"Keep names and groups legible.",
					"Document the purpose of custom controls clearly.",
					"Avoid hiding common interactions behind unclear path schemes.",
				],
			},
			{
				id: "validate-before-runtime",
				title: "Validate before deployment",
				subtitle: "Rigging errors are cheaper to catch before they are embedded in a larger runtime or operator workflow.",
				orderedBullets: [
					"Confirm standard controls behave correctly.",
					"Confirm custom controls do what they claim to do.",
					"Confirm the exported bundle still behaves in a minimal player context.",
				],
			},
		],
		resourcesTitle: "Deeper reference links",
		resources: [
			{
				label: "Rigging and control docs",
				href: "/docs/rigging-and-control-model/",
				description: "The model-level explanation behind this walkthrough.",
			},
			{
				label: "Vizij authoring workspace",
				href: `${vizijWebRepo}/tree/main/apps/vizij-authoring`,
				description: "Current implementation surface for authoring and rig validation.",
			},
		],
	},
	"minimal-player": {
		slug: "minimal-player",
		kind: "tutorial",
		eyebrow: "Vizij Tutorials",
		title: "Minimal Player",
		description:
			"Build the smallest reliable runtime playback surface that proves a bundle is ready to run outside the authoring context.",
		actions: [
			{
				label: "Back to Rigging and Control",
				href: "/tutorials/rigging-and-control/",
				variant: "primary",
			},
			{
				label: "Read deployment docs",
				href: "/docs/deployment-model/",
				variant: "secondary",
			},
			{ label: "Continue to Animations", href: "/tutorials/animations/", variant: "tertiary" },
		],
		overviewPanels: [
			{
				title: "Prerequisites",
				items: [
					"You have an authored and rigged face bundle.",
					"You want to prove playback without a large app shell.",
				],
			},
			{
				title: "What you will prove",
				items: [
					"The runtime can load the bundle cleanly.",
					"The face can render and respond outside authoring.",
					"The playback loop is reliable enough to extend.",
				],
			},
			{
				title: "Success check",
				items: [
					"The player loads consistently.",
					"The face can be controlled or reset cleanly.",
					"You know what makes the player ready for integration.",
				],
			},
		],
		referenceImplementation: {
			label: "Current reference implementation",
			href: `${vizijWebRepo}/tree/main/packages/@vizij/runtime-react`,
			note: "Use runtime-react as the implementation basis for a minimal player rather than elevating a current demo app name into the public teaching surface.",
		},
		nextStep: {
			label: "Continue to Animations",
			href: "/tutorials/animations/",
			description:
				"Once the minimal runtime loop is healthy, add reusable expressive motion on top of it.",
		},
		sections: [
			{
				id: "runtime-loop",
				title: "Keep the runtime loop minimal",
				subtitle: "The goal is to prove clean playback, not to rebuild a full studio.",
				paragraphs: [
					"A minimal player should keep the runtime provider, bundle loading, and face surface as direct and inspectable as possible.",
					"If the player already behaves like a large diagnostics tool, it is no longer serving the teaching goal of this page.",
				],
			},
			{
				id: "ready-to-run",
				title: "Define ready-to-run clearly",
				subtitle: "Playback success should be explicit enough that someone else can reproduce it.",
				bullets: [
					"The bundle loads without ambiguity.",
					"The face reaches a stable visible state.",
					"A small control interaction still works after load.",
					"The player can be reset or reloaded cleanly.",
				],
			},
			{
				id: "what-not-to-add",
				title: "What not to add yet",
				subtitle: "Keep integration, deployment, and richer conversation behavior for the later pages.",
				paragraphs: [
					"This page should not become a general-purpose runtime product surface. Its job is to prove that a bundle can run cleanly outside authoring so that the later pages can build from a stable base.",
				],
			},
		],
		resourcesTitle: "Deeper reference links",
		resources: [
			{
				label: "Runtime React package",
				href: `${vizijWebRepo}/tree/main/packages/@vizij/runtime-react`,
				description: "The package-level reference implementation for the minimal player concept.",
			},
			{
				label: "Deployment model docs",
				href: "/docs/deployment-model/",
				description: "The broader operational context for what happens after the player works.",
			},
		],
	},
	animations: {
		slug: "animations",
		kind: "tutorial",
		eyebrow: "Vizij Tutorials",
		title: "Animations",
		description:
			"Define, load, and replay expressive motion in a way that is reusable across runtime contexts rather than locked to one authoring session.",
		actions: [
			{ label: "Back to Minimal Player", href: "/tutorials/minimal-player/", variant: "primary" },
			{ label: "Read animation docs", href: "/docs/animation-model/", variant: "secondary" },
			{ label: "Continue to Agent Face", href: "/tutorials/agent-face/", variant: "tertiary" },
		],
		overviewPanels: [
			{
				title: "Prerequisites",
				items: [
					"You have a working player-level runtime.",
					"You want to add reusable motion rather than only manual control writes.",
				],
			},
			{
				title: "What you will prove",
				items: [
					"An animation asset can be triggered intentionally.",
					"Playback can start, stop, and reset predictably.",
					"You can reason about the animation as runtime behavior, not just timeline editing.",
				],
			},
			{
				title: "Success check",
				items: [
					"Playback is deterministic.",
					"The visible motion is easy to restart.",
					"You know what to inspect when it does not behave correctly.",
				],
			},
		],
		nextStep: {
			label: "Continue to Agent Face",
			href: "/tutorials/agent-face/",
			description:
				"Once reusable motion is in place, add conversation-aware synchronization and more operational integration.",
		},
		sections: [
			{
				id: "define-and-save",
				title: "Define and save motion",
				subtitle: "Treat animation as a reusable asset that can survive movement between tools and runtime contexts.",
				paragraphs: [
					"The point of animation work in Vizij is not only to create motion that looks good once. It is to create motion that can be saved, loaded, and reused in later runtime contexts.",
				],
			},
			{
				id: "replay-cleanly",
				title: "Replay cleanly",
				subtitle: "A useful animation workflow gives you deterministic playback rather than opaque motion magic.",
				bullets: [
					"Know what starts the animation.",
					"Know how to stop or reset it.",
					"Know what other controls or runtime state can coexist with it.",
				],
			},
			{
				id: "troubleshoot",
				title: "Troubleshoot motion issues",
				subtitle: "Animation problems usually reduce to identification, timing, or reset behavior.",
				orderedBullets: [
					"Confirm the runtime is addressing the intended motion asset or control path.",
					"Confirm the timing assumptions are what you think they are.",
					"Confirm the face returns to the intended state after playback ends.",
				],
			},
		],
		resourcesTitle: "Deeper reference links",
		resources: [
			{
				label: "Animation model docs",
				href: "/docs/animation-model/",
				description: "The model-level explanation behind the runtime animation workflow.",
			},
			{
				label: "Animation React package",
				href: `${vizijWebRepo}/tree/main/packages/@vizij/animation-react`,
				description: "Current package-level reference surface for animation-related behavior.",
			},
		],
	},
	"agent-face": {
		slug: "agent-face",
		kind: "tutorial",
		eyebrow: "Vizij Tutorials",
		title: "Agent Face",
		description:
			"Integrate a rendered face with conversation-aware behavior, speech timing, visemes, and expressive state changes without losing operational clarity.",
		actions: [
			{ label: "Back to Animations", href: "/tutorials/animations/", variant: "primary" },
			{ label: "Read architecture", href: "/docs/architecture/", variant: "secondary" },
			{ label: "Continue to Deployment", href: "/tutorials/deployment/", variant: "tertiary" },
		],
		overviewPanels: [
			{
				title: "Prerequisites",
				items: [
					"You have a working runtime and a basic motion layer.",
					"You are ready to integrate speech and expressive behavior with a live system.",
				],
			},
			{
				title: "What you will prove",
				items: [
					"Conversation-aware behavior can be layered on top of the same runtime model.",
					"Speech, visemes, and expression changes can stay synchronized enough to be operationally useful.",
					"You can define graceful degradation boundaries instead of assuming a perfect live system.",
				],
			},
			{
				title: "Success check",
				items: [
					"You can explain the integration boundary clearly.",
					"You know what live dependencies exist.",
					"You know what happens when they fail or stall.",
				],
			},
		],
		referenceImplementation: {
			label: "Current reference implementation",
			href: `${vizijWebRepo}/tree/main/apps/tutorial-agent-face`,
			note: "Treat tutorial-agent-face as a source implementation, not the public tutorial identity.",
		},
		nextStep: {
			label: "Continue to Deployment",
			href: "/tutorials/deployment/",
			description:
				"After the integration story is clear, move into browser and standalone deployment for operator-facing delivery.",
		},
		sections: [
			{
				id: "integration-boundary",
				title: "Define the integration boundary",
				subtitle: "The face should remain a clean runtime participant, not an inseparable tangle of provider-specific logic.",
				paragraphs: [
					"Agent-facing behavior should be connected through explicit inputs, outputs, and timing assumptions. That makes the integration easier to test, reason about, and replace when the conversation engine changes.",
				],
			},
			{
				id: "sync-patterns",
				title: "Synchronize speech and expression",
				subtitle: "Live interaction quality depends on timing and graceful coordination more than on a single magic feature.",
				bullets: [
					"Coordinate speech state and visible expression changes.",
					"Coordinate viseme-like mouth behavior with the broader emotional state.",
					"Prefer explicit timing and reset behavior over hidden heuristics.",
				],
			},
			{
				id: "graceful-degrade",
				title: "Graceful degradation",
				subtitle: "A live integration should fail visibly and safely rather than silently corrupting the face state.",
				bullets: [
					"Know what the face should do when live input stalls.",
					"Know how to recover to a stable idle state.",
					"Keep provider-specific assumptions out of the public mental model whenever possible.",
				],
			},
		],
		resourcesTitle: "Deeper reference links",
		resources: [
			{
				label: "Architecture docs",
				href: "/docs/architecture/",
				description: "The broader system framing for where live integration fits.",
			},
			{
				label: "Current agent face implementation",
				href: `${vizijWebRepo}/tree/main/apps/tutorial-agent-face`,
				description: "The existing implementation surface this page abstracts into a cleaner public concept.",
			},
		],
	},
	deployment: {
		slug: "deployment",
		kind: "tutorial",
		eyebrow: "Vizij Tutorials",
		title: "Deployment",
		description:
			"Take a working face from your machine into browser and standalone delivery with a clear operator-facing handoff and known follow-up constraints.",
		actions: [
			{ label: "Back to Agent Face", href: "/tutorials/agent-face/", variant: "primary" },
			{ label: "Read deployment docs", href: "/docs/deployment-model/", variant: "secondary" },
			{ label: "Explore demos", href: "/demos/", variant: "tertiary" },
		],
		overviewPanels: [
			{
				title: "Prerequisites",
				items: [
					"You have a working runtime bundle and a clear control story.",
					"You are ready to hand the system to a deployment or operator context.",
				],
			},
			{
				title: "What you will prove",
				items: [
					"The face can run in the target deployment surface.",
					"Operator needs and runtime visibility are understood.",
					"Known follow-up constraints are documented rather than ignored.",
				],
			},
			{
				title: "Success check",
				items: [
					"You can describe the browser path.",
					"You can describe the standalone path.",
					"You know which constraints are next-wave work rather than current blockers.",
				],
			},
		],
		referenceImplementation: {
			label: "Current reference implementation",
			href: `${vizijWebRepo}/tree/main/apps/vizij-standalone`,
			note: "Use vizij-standalone as the current implementation reference for the operator-facing deployment branch.",
		},
		sections: [
			{
				id: "choose-path",
				title: "Choose the deployment path consciously",
				subtitle: "Vizij supports both browser and standalone references in the current phase.",
				paragraphs: [
					"Deployment should begin by deciding which delivery surface is right for the immediate target. Browser and standalone are both legitimate near-term paths, but they imply different operational expectations.",
				],
			},
			{
				id: "operator-workflow",
				title: "Define the operator workflow",
				subtitle: "Deployment is only complete when the control and monitoring surface matches how the system will be used.",
				bullets: [
					"Know what controls the operator needs.",
					"Know what runtime state and errors must be visible.",
					"Know how the face returns to a stable state if something goes wrong.",
				],
			},
			{
				id: "known-follow-on",
				title: "Name the follow-on work explicitly",
				subtitle: "Deployment does not require solving every future runtime question before a useful first release exists.",
				bullets: [
					"Namespacing evolution remains important but not a near-term blocker for the public deployment story.",
					"Broader multi-face shared-runtime work remains a later expressiveness wave.",
					"Security, auth, and observability gaps should be recorded as known follow-up items when they are not yet fully solved.",
				],
			},
		],
		resourcesTitle: "Deeper reference links",
		resources: [
			{
				label: "Deployment model docs",
				href: "/docs/deployment-model/",
				description: "The model-level framing for deployment choices and operator expectations.",
			},
			{
				label: "Vizij standalone app",
				href: `${vizijWebRepo}/tree/main/apps/vizij-standalone`,
				description: "Current standalone implementation reference for the deployment branch.",
			},
		],
	},
};
