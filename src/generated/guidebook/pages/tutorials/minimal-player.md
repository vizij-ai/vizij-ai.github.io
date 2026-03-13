---
pageId: tutorials-minimal-player
moduleId: tutorials/minimal-player
sourceModuleId: integrate/minimal-web-player
sourcePath: integrate/minimal-web-player.md
surface: tutorials
publish: true
routeSlug: minimal-player
canonicalPath: /tutorials/minimal-player/
routeRole: walkthrough
routeRoleLabel: Runtime shell
title: Minimal Player
summary: Load the authored face into the smallest useful player shell and keep
  the runtime surface honest.
moduleType: walkthrough
bucket: Integrate
depth: Surface
hubGroup: runtime-and-deployment
order: 50
redirects:
  - minimal-web-player
outcome: After this page, you should be able to launch the maintained
  player-stage app, explain what makes it a trustworthy runtime shell instead of
  just another demo, and identify the code shape you would reuse in your own
  first player.
prerequisites:
  - "Use the vizij-web workspace root:"
successCheck:
  - demo-vizij-player runs locally
  - you can identify the shell surfaces that expose runtime truth
  - at least one maintained control path visibly reaches the face
  - you can explain why this app is a player-stage shell rather than just
    another runtime demo
headings:
  - depth: 2
    slug: starting-state
    text: Starting State
  - depth: 2
    slug: scope-note
    text: Scope note
  - depth: 2
    slug: route-handoff-from-this-page
    text: Route Handoff From This Page
  - depth: 2
    slug: what-a-minimal-player-must-prove
    text: What A Minimal Player Must Prove
  - depth: 2
    slug: what-this-page-does-not-solve-yet
    text: What This Page Does Not Solve Yet
  - depth: 2
    slug: walkthrough
    text: Walkthrough
  - depth: 2
    slug: what-to-reuse-in-your-own-first-player
    text: What To Reuse In Your Own First Player
  - depth: 2
    slug: fast-recovery-if-it-fails
    text: Fast Recovery If It Fails
  - depth: 2
    slug: when-to-move-on
    text: When To Move On
  - depth: 2
    slug: recommended-next-steps
    text: Recommended Next Steps
context:
  bucketChain: "Previous: Control on the fast route or Customize on the
    customization route Current bucket: Integrate Next bucket after this one:
    Deploy"
  depthLadder: "Above: none, this is the entry depth in this bucket Current:
    Surface Below: Loading, Playback, and Embedding, Application Integration
    Patterns, API-Backed Interactive Application, Rich Interactive Applications"
  modulePosition: "Previous in bucket: start at Integrate Current module: Minimal
    Web Player Next in bucket: Loading, Playback, and Embedding"
  moduleType: walkthrough
  bucketOverview:
    label: Integrate
    href: /docs/
  referenceBridges:
    - label: Runtime Quickstart Reference
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/reference/runtime-quickstart-reference.md
    - label: Animation, Integration, and Deployment Reference
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/reference/animation-integration-and-deployment-reference.md
    - label: Validation Checkpoints
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/validation-checkpoints.md
prev:
  label: Rigging and Control
  href: /tutorials/rigging-and-control/
  description: Return to the customization branch and export discipline.
next:
  label: Animations
  href: /tutorials/animations/
  description: Continue into authored motion and richer runtime behavior.
implementationAnchors:
  - label: Minimal web player guidebook module
    href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/integrate/minimal-web-player.md
    description: Canonical runtime-shell walkthrough.
demoLinks:
  - label: Architecture demo lane
    href: /demos/#architecture
    description: Compare the player shell with the broader public runtime map.
labId: minimal-web-player
hasMermaid: false
---

## Starting State

Use the `vizij-web` workspace root:

```bash
cd /home/chris/Code/Semio/vizij_ws/vizij-web
pnpm run dev:demo-vizij-player
```

Open the local URL shown by Vite.

This walkthrough uses `demo-vizij-player` because it is the strongest maintained example of a bundle-first player surface in the workspace.

## Scope note

This walkthrough assumes a React app built on `@vizij/runtime-react`.

Keep the distinction clear:

1. the lifecycle and validation lessons here are the portable part,
2. the concrete code examples are React-specific,
3. this page is about integration, not deployment.

## Route Handoff From This Page

Use this page as the last stop before you branch, not as proof that every next step must stay inside `Integrate`.

| If this describes you... | Treat this page as successful when... | Open this next |
| --- | --- | --- |
| you are not building in React | you can explain the `VizijAssetBundle`, provider-owned readiness states, and one working control path | [Loading, Playback, and Embedding](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/integrate/loading-playback-and-embedding.md), then repo-local implementation docs for your framework |
| your next real question is operator control or deployment topology | you have one healthy player shell and one visible control path reaching the face | [Deploy](/docs/), then [Easiest Standalone Deployment](/tutorials/deployment/) or [Hardware, ROS, and Multi-Screen Topologies](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/deploy/hardware-ros-and-multi-screen-topologies.md) |

## What A Minimal Player Must Prove

For this route, a player is only believable if it makes four things obvious:

1. what face asset is loaded
2. whether the runtime is healthy
3. what the viewer is currently showing
4. whether at least one control path reaches the face successfully

## What This Page Does Not Solve Yet

This page does not yet solve:

1. service-backed or session-backed behavior loops,
2. non-React implementation details,
3. operator-facing endpoint exposure,
4. deployment topology choices.

That is the standard you are checking as you walk through the app.

## Walkthrough

### 1. Launch the maintained player anchor

Run:

```bash
pnpm run dev:demo-vizij-player
```

When the app opens, choose one of the curated sample faces if it is not already selected.

Expected result:

1. the app presents a clear player workspace rather than a fullscreen-only tutorial
2. the face viewer, bootstrap state, and side panels are all visible
3. you can tell that the app is built to host a bundle, not just show one canned animation

Current visual anchor:

<figure class="guidebook-media">
<img src="/guidebook-assets/screenshots/player-demo.png" alt="Demo Vizij Player" loading="lazy" />
<figcaption>the full bundle-first player shell with library, face stage, controls, and selected-bundle detail visible together.</figcaption>
</figure>

Use this overview to orient yourself before you zoom into the specific control and diagnostic surfaces below.

### 2. Read the player shell before touching controls

Look for the app surfaces that make the runtime honest:

1. bootstrap or readiness checklist
2. face viewer
3. diagnostics and controller inventory
4. pose, animation, or face-control panels

Expected result:

1. you can see whether the GLB loaded
2. you can see whether the runtime is ready
3. you can tell the difference between loading, empty, ready, and error states

This is the core difference between a player and a thin tutorial surface. A player must explain its state while it is running.

Current shell-detail anchors:

<figure class="guidebook-media">
<img src="/guidebook-assets/screenshots/player-demo-controls.png" alt="Player Demo Controls" loading="lazy" />
<figcaption>the control side of the player, where poses, clips, programs, and surfaced face controls become testable.</figcaption>
</figure>

<figure class="guidebook-media">
<img src="/guidebook-assets/screenshots/player-demo-details.png" alt="Player Demo Details" loading="lazy" />
<figcaption>the diagnostic side of the player, where bundle summary, runtime outputs, and surfaced-controller state stay inspectable.</figcaption>
</figure>

These two crops are useful because they separate the two teaching jobs that the full player screenshot compresses:

1. `player-demo-controls` shows the bundle poses, clip transport, procedural program controls, and metadata-driven face controls that prove a control path is really present,
2. `player-demo-details` shows the selected bundle summary and diagnostics surfaces that make runtime state inspectable instead of mysterious.

### 3. Prove that a control reaches the face

Use one maintained control path in the player:

1. trigger a pose from the pose panel
2. or trigger a simple animation or program if the currently loaded face exposes one
3. or move a face-control value that the UI surfaces from runtime metadata

Expected result:

1. the face changes visibly
2. the app still reports a healthy runtime state
3. the control feels like part of the player shell rather than an invisible side effect

That is the minimal player confidence test: one known-good control path has to work through the visible runtime shell.

### 4. Inspect how the app builds the runtime surface

Open:

1. `vizij-web/apps/demo-vizij-player/src/App.tsx`
2. `vizij-web/apps/demo-vizij-player/src/data/samples.ts`
3. `vizij-web/apps/demo-vizij-player/src/components/DiagnosticsPanel.tsx`
4. `vizij-web/apps/demo-vizij-player/src/components/PosePanel.tsx`

The runtime shape to notice is:

```tsx
<VizijRuntimeProvider
  key={source.id}
  assetBundle={assetBundle}
  autostart
  orchestratorScope="isolated"
>
  <WorkspaceSurface sourceLabel={sourceLabel} sourceMeta={sourceMeta} />
</VizijRuntimeProvider>
```

What this shows:

1. the player still starts with one `VizijAssetBundle`
2. the provider owns runtime startup and controller registration
3. the app shell then builds panels from the resolved runtime state

That is the reusable pattern for a first player. The shell grows around the runtime instead of bypassing it.

### 5. Notice why this app is still restrained

`demo-vizij-player` is richer than `tutorial-fullscreen-face`, but it is still deliberately focused.

It is not trying to be:

1. a full authoring environment
2. a live conversation shell
3. a deployment endpoint

It is trying to be a trustworthy bundle-first player. That scope discipline is part of why it teaches well.

## What To Reuse In Your Own First Player

If you are building a first integration surface, copy these ideas before you copy visual polish:

1. construct one `VizijAssetBundle` from a known source
2. mount one `VizijRuntimeProvider`
3. make loading, ready, empty, and error states explicit
4. build controls from resolved runtime data instead of hard-coded assumptions
5. prove one known-good control path before adding more product UI

## Fast Recovery If It Fails

Use these shortcuts:

1. if the face does not load, inspect the bootstrap and diagnostics panels before touching controls
2. if the runtime is unclear, use [Validation Checkpoints](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/validation-checkpoints.md)
3. if the player reaches an error state, use [Troubleshooting Matrix](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/troubleshooting-matrix.md)
4. if you need the lower-level runtime explanation behind the shell, use [Loading, Playback, and Embedding](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/integrate/loading-playback-and-embedding.md)

## When To Move On

Use these branch points once the player shell feels trustworthy:

1. If you still need the runtime vocabulary behind loading, playback, and embedding, continue to [Loading, Playback, and Embedding](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/integrate/loading-playback-and-embedding.md).
2. If your own app needs local hooks, diagnostics panels, or sample-selection behavior, continue to [Application Integration Patterns](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/integrate/application-integration-patterns.md).
3. If your product depends on an external session or live service loop, branch to [API-Backed Interactive Application](/tutorials/agent-face/).
4. If you are not building in React, stop here once the runtime shell model is clear, then switch to repo-local implementation docs for framework-specific assembly.
5. If your next question is operator control, exposed endpoints, or deployment topology, jump to [Deploy](/docs/) and continue from the deployment route there.

## Recommended Next Steps

Continue to [Loading, Playback, and Embedding](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/integrate/loading-playback-and-embedding.md) if you want the fundamentals behind the player shell.

If your goal is a richer application pattern, continue later to [API-Backed Interactive Application](/tutorials/agent-face/).

If your goal is operator-facing deployment instead of more integration depth, jump next to [Deploy](/docs/).
