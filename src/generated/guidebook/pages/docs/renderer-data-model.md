---
pageId: docs-renderer-data-model
moduleId: docs/renderer-data-model
sourceModuleId: control/runtime-inputs-and-semantics
sourcePath: control/runtime-inputs-and-semantics.md
surface: docs
publish: true
routeSlug: renderer-data-model
canonicalPath: /docs/renderer-data-model/
routeRole: model
routeRoleLabel: Runtime semantics
title: Renderer Data Model
summary: Understand the typed input model, path semantics, and visible runtime
  behavior behind the first maintained interactions.
moduleType: concept page
bucket: Control
depth: Fundamentals
hubGroup: control-models
order: 30
redirects:
  - runtime-inputs-and-semantics
outcome: After this page, you should be able to explain what a Vizij runtime
  input is, how it relates to typed paths and values, and how visible behavior
  on a face maps to a more stable runtime meaning underneath.
prerequisites:
  - completed Hello Face Quickstart,
  - read Paths and Standard Controls,
  - seen at least one runtime app show loading, ready, and error states.
successCheck:
  - you can explain why runtime inputs are more stable than any one UI,
  - you can distinguish staged inputs from rendered outputs,
  - you can describe how standard controls, poses, visemes, and
    animation-related values differ semantically.
headings:
  - depth: 2
    slug: module-notes
    text: Module Notes
  - depth: 2
    slug: what-you-need
    text: What You Need
  - depth: 2
    slug: the-core-semantic-chain
    text: The Core Semantic Chain
  - depth: 2
    slug: what-a-runtime-input-actually-is
    text: What A Runtime Input Actually Is
  - depth: 2
    slug: staging-reading-and-writing
    text: Staging, Reading, and Writing
  - depth: 2
    slug: common-semantic-categories
    text: Common Semantic Categories
  - depth: 2
    slug: why-semantics-matter-more-than-ui-labels
    text: Why Semantics Matter More Than UI Labels
  - depth: 2
    slug: where-readers-see-these-semantics-in-practice
    text: Where Readers See These Semantics In Practice
  - depth: 2
    slug: a-useful-mental-model
    text: A Useful Mental Model
  - depth: 2
    slug: current-useful-diagram
    text: Current Useful Diagram
  - depth: 2
    slug: recommended-next-steps
    text: Recommended Next Steps
context:
  bucketChain: "Previous: Experience Current: Control Next: Customize on the
    customization route or Integrate on the fast route"
  depthLadder: "Above: First Control Interactions Current: Fundamentals Below:
    Orchestration and Diagnostics"
  modulePosition: "Previous in bucket: Paths and Standard Controls Current module:
    Runtime Inputs and Semantics Next in bucket: Control Surfaces and
    Configuration Layers"
  moduleType: concept page
  bucketOverview:
    label: Control
    href: /docs/
  referenceBridges:
    - label: Renderer and Rigging Reference
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/reference/renderer-and-rigging-reference.md
    - label: Runtime Quickstart Reference
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/reference/runtime-quickstart-reference.md
    - label: Glossary and Terminology Bridge
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/glossary-and-terminology-bridge.md
prev:
  label: Architecture
  href: /docs/architecture/
  description: Return to the repo map and bundle lifecycle.
next:
  label: Rigging and Control Model
  href: /docs/rigging-and-control-model/
  description: Move from generic runtime inputs into control vocabulary and path families.
implementationAnchors:
  - label: Runtime React package
    href: https://github.com/vizij-ai/vizij-web/tree/main/packages/@vizij/runtime-react
    description: Current runtime hooks and provider primitives.
demoLinks:
  - label: Rig controls demo
    href: /demos/#controls
    description: Observe path writes and visible behavior before reproducing them.
hasMermaid: true
---

## Module Notes

### Intended Audience

This page is for readers who already understand the basic path vocabulary from [Paths and Standard Controls](/docs/rigging-and-control-model/) and now need the next layer of runtime reasoning.

### Artifact Being Touched

The artifact here is not a single app screen. It is the runtime contract that multiple Vizij surfaces rely on:

1. typed paths,
2. typed values,
3. staged runtime inputs,
4. blackboard reads and writes,
5. output paths that can later be observed or rendered.

## What You Need

It helps if you have already:

1. completed [Hello Face Quickstart](/tutorials/hello-face/),
2. read [Paths and Standard Controls](/docs/rigging-and-control-model/),
3. seen at least one runtime app show loading, ready, and error states.

## The Core Semantic Chain

Visible face behavior is usually the end of a longer chain:

1. an app or hook decides to set an input,
2. the input is staged under a path,
3. graphs and animations read and write values against the shared runtime state,
4. the renderer receives the resulting animatable values,
5. the user sees a face change.

That is why the same visual behavior can show up in multiple apps. The UI is not the whole story. The runtime meaning is more stable than the surface.

## What A Runtime Input Actually Is

A runtime input is a value written with an explicit meaning.

The important parts are:

1. the path, which says what the input refers to,
2. the value, which says what data is being written,
3. the shape or expected kind of data, which keeps the runtime deterministic.

In the architecture primer, this is the `TypedPath` plus `Value` plus `Shape` contract.

That contract matters because Vizij does not want a control system that only works inside one UI. Inputs have to survive movement across apps, bundles, runtime controllers, and deployment surfaces.

## Staging, Reading, and Writing

The runtime is designed so inputs are staged first and then consumed during the runtime step.

At a high level:

1. the app stages a value,
2. the orchestrator advances a frame,
3. graphs and animations evaluate against the current state,
4. output values are merged deterministically,
5. the renderer applies the resulting values.

This is different from directly mutating a scene or attaching view-only state to a slider. Vizij is intentionally closer to a runtime control pipeline.

## Common Semantic Categories

### Semantic Categories

| Category | Meaning | Encountered In |
| :--- | :--- | :--- |
| **Standard** | Reusable rig channels (Gaze) | `Hello Face` / `useMouseGaze` |
| **Poses** | Authored expressions | `Hello Face` / `usePoseHotkeys` |
| **Speech-timed poses** | Speech-driven pose weights that still use canonical pose paths | `Agent Face` / `STT` |
| **Animations** | Time-based motion | `Authoring` / `Player` |
| **Outputs** | Derived runtime values | `Player` / `Diagnostics` |

The most useful categories for guidebook readers are:

1. standard controls, which expose reusable channels such as gaze or shared rig movement,
2. pose weights, which expose named authored states,
3. speech-timed pose driving, which still stages pose weights even when authoring groups those poses for different blend behavior,
4. animation controls, which drive authored time-based motion,
5. renderer outputs, which can be observed for UI, diagnostics, or logging.

These categories can all show up as paths, but they do not mean the same thing.

### Choose The Semantic Family First

Use this chooser before you start wiring a control or debugging a write:

| If you are trying to... | Likely semantic family | Why | Best next page |
| --- | --- | --- | --- |
| steer a reusable eye, brow, jaw, or similar channel | standard control | you are driving a reusable rig-facing channel directly | [Paths and Standard Controls](/docs/rigging-and-control-model/) |
| blend a named facial state such as `smile` | pose weight | you are changing the strength of an authored expression | [Poses](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/poses.md) |
| play or inspect motion over time | animation control | the main question is clip transport, timing, or playback | [Animations](/docs/animation-model/) |
| drive speech-shaped mouth motion | speech-timed pose weight | the speech layer still writes a canonical pose-weight path, while pose groups continue to define how subsets of poses blend | [Animation, Integration, and Deployment Reference](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/reference/animation-integration-and-deployment-reference.md) |
| inspect what the runtime resolved after evaluation | output path | you are validating the result of orchestration, not only the staged input | [Orchestration and Diagnostics](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/control/orchestration-and-diagnostics.md) |
| expose operator control through a deployment endpoint | deployment slot over runtime input | the client sees a deployment slot name, but the runtime still resolves it into the same typed input semantics underneath | [Operator and Deployment Model](/docs/deployment-model/) |

## Why Semantics Matter More Than UI Labels

Two controls can look similar in a UI and still represent different semantics.

For example:

1. a slider that writes `rig/{face}/standard/left_eye/pos/x` is steering a reusable rig channel,
2. a slider that writes `rig/{face}/poses/smile.weight` is blending a named authored state,
3. a speech-driven system may still write `rig/{face}/poses/{poseId}.weight` without the user touching a control at all.

The visible widget is just a surface. The runtime meaning is the important teaching target.

Pose groups matter here because they determine how different subsets of poses blend together. They are not part of the runtime input path syntax.

## Where Readers See These Semantics In Practice

You can already see the semantic layers in the maintained apps:

1. `tutorial-fullscreen-face` stages gaze and pose inputs through tutorial hooks,
2. `tutorial-agent-face` layers conversation-driven viseme and expression behavior on top of the same runtime concepts,
3. `demo-vizij-player` exposes loading state, controllers, and output paths in a more application-like shell,
4. `vizij-standalone` maps externally driven values into deployment-facing control slots.

Those apps are different surfaces, but the runtime language underneath them is continuous.

That continuity is the main reason the guidebook keeps separating runtime meaning from surface labels:

1. a deployment client may discover and write slot names such as `standard/vizij/left_eye/pos/x`,
2. the standalone bridge then resolves those names into runtime paths such as `rig/{faceId}/standard/vizij/left_eye/pos/x`,
3. the underlying semantic family is still "standard control" even though the operator surface does not expose the full runtime path directly.

## A Useful Mental Model

If a reader gets lost, return to this question:

`What value is being written, to which path, by which part of the runtime, and why?`

That question usually clarifies whether the reader is dealing with:

1. a user input,
2. an authored pose or animation,
3. a derived controller output,
4. a deployment-facing control signal.

## Current Useful Diagram

### The Semantic Chain

Visible face behavior follows a structured multi-layer evaluation:

<pre class="guidebook-mermaid mermaid">
flowchart LR
    app[&quot;App / Hook\n(Write Path)&quot;] --&gt; staged[&quot;Staged Input\n(Un-evaluated)&quot;]
    staged --&gt; orch[&quot;Orchestrator\n(Advanced Step)&quot;]
    orch --&gt; controllers[&quot;Controllers\n(Merge Values)&quot;]
    controllers --&gt; render[&quot;Renderer Output\n(Ready to Draw)&quot;]
    render --&gt; face[&quot;Visible Face\n(Success)&quot;]
</pre>

The screenshot shows the "ready" state where the face is active and responding to standard control writes.

Until then, the architecture primer is the best current textual diagram.

## Recommended Next Steps

1. If you want to see how these runtime ideas become an application shell, continue to [Loading, Playback, and Embedding](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/integrate/loading-playback-and-embedding.md).
2. If you want to stay on the fundamentals path inside `Control`, keep [Paths and Standard Controls](/docs/rigging-and-control-model/) nearby as the simpler vocabulary bridge.
3. If you need to reason about which surface owns each category, continue to [Control Surfaces and Configuration Layers](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/control/control-surfaces-and-configuration-layers.md).
