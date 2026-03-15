---
pageId: docs-architecture
moduleId: docs/architecture
sourceModuleId: introduction/system-mental-model
sourcePath: introduction/system-mental-model.md
surface: docs
publish: true
routeSlug: architecture
canonicalPath: /docs/architecture/
routeRole: system-map
routeRoleLabel: System mental model
title: System Mental Model
summary: "Understand the stable Vizij layers: authored assets, runtime control,
  integration surfaces, and deployment surfaces."
moduleType: concept page
bucket: Introduction
depth: Fundamentals
hubGroup: orientation
order: 20
redirects:
  - architecture-bridge
  - system-mental-model
outcome: After this page, you should be able to explain the major parts of
  Vizij, how authored assets and runtime control relate, and which conceptual
  contracts stay stable as a face moves from authoring into integration and
  deployment.
prerequisites:
  - read What Is Vizij?,
  - seen a running face in the public demos or the Hello Face tutorial.
successCheck:
  - you can describe Vizij as authored assets plus runtime coordination plus
    application and deployment surfaces,
  - you can explain the distinct roles of the renderer, orchestrator,
    controllers, and blackboard at a high level,
  - you can explain why typed paths, values, and shapes matter even before
    learning their detailed syntax,
  - you can place Hello Face, Authoring, Player, and Deployment in the overall
    system without confusing them for one another.
headings:
  - depth: 2
    slug: module-notes
    text: Module Notes
  - depth: 2
    slug: what-you-need
    text: What You Need
  - depth: 2
    slug: the-stable-system-map
    text: The Stable System Map
  - depth: 2
    slug: one-face-multiple-layers
    text: One Face, Multiple Layers
  - depth: 2
    slug: the-runtime-contracts-that-stay-stable
    text: The Runtime Contracts That Stay Stable
  - depth: 2
    slug: where-authoring-fits
    text: Where Authoring Fits
  - depth: 2
    slug: where-control-fits
    text: Where Control Fits
  - depth: 2
    slug: where-the-public-route-fits
    text: Where The Public Route Fits
  - depth: 2
    slug: misunderstandings-this-page-should-prevent
    text: Misunderstandings This Page Should Prevent
  - depth: 2
    slug: recommended-next-steps
    text: Recommended Next Steps
context:
  bucketChain: "Previous: Start of guidebook Current: Introduction Next: Experience"
  depthLadder: "Above: What Is Vizij?, How To Use This Guidebook Current:
    Fundamentals Below: Architecture Bridge"
  modulePosition: "Previous in bucket: How To Use This Guidebook Current module:
    System Mental Model Next in bucket: Customization Concepts Primer"
  moduleType: concept page
  bucketOverview:
    label: Introduction
    href: /docs/
  referenceBridges:
    - label: Guidebook Learning Model
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/learning-model.md
    - label: Guidebook Module Inventory
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/module_inventory-reference.md
    - label: Glossary and Terminology Bridge
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/glossary-and-terminology-bridge.md
prev:
  label: Guide
  href: /docs/getting-started/
  description: Choose the right public route before you separate the stable Vizij
    system layers.
next:
  label: Renderer Data Model
  href: /docs/renderer-data-model/
  description: Move from the system layers into the runtime path and value contract.
implementationAnchors:
  - label: Guidebook introduction bucket
    href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/introduction/README.md
    description: Canonical conceptual bucket framing behind the system mental model.
  - label: Runtime provider
    href: https://github.com/vizij-ai/vizij-web/tree/main/packages/@vizij/runtime-react/src/VizijRuntimeProvider.tsx
    description: A concrete code anchor behind the runtime layer described on this page.
demoLinks:
  - label: Demos architecture lane
    href: /demos/#architecture
    description: Compare the system map with the public behavior slices.
hasMermaid: true
---

## Module Notes

- Read this after [What Is Vizij?](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/introduction/what-is-vizij.md) if you need the system layers separated before going deeper.
- The page keeps five concepts distinct: the face artifact, authored behavior, runtime coordination, application surface, and deployment surface.
- Detailed path semantics, authoring workflows, package ownership, and deployment procedures stay in later modules.

## What You Need

You do not need package-level or crate-level knowledge to use this page.

It helps if you have already:

1. read [What Is Vizij?](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/introduction/what-is-vizij.md),
2. seen a running face in the public demos or the `Hello Face` tutorial.

## The Stable System Map

At the most useful learner level, Vizij is a relationship between four things:

1. authored assets,
2. runtime control,
3. integration surfaces,
4. deployment surfaces.

Those are connected by a small set of stable contracts rather than by one single app.

### Asset To Runtime Relationship

<pre class="guidebook-mermaid mermaid">
flowchart LR
    classDef asset fill:#fff4e5,stroke:#c97a00,stroke-width:1.5px
    classDef runtime fill:#eef7ee,stroke:#2f855a,stroke-width:1.5px
    classDef app fill:#eef4ff,stroke:#4e79a7,stroke-width:1.5px

    asset[&quot;1. Face asset\nGLB / loaded world&quot;]
    bundle[&quot;2. Vizij bundle metadata\nrig, poses, animations, programs&quot;]
    provider[&quot;3. VizijRuntimeProvider\nloads and owns runtime startup&quot;]
    inputs[&quot;4. Typed inputs\npaths + values&quot;]
    orch[&quot;5. Orchestrator + controllers&quot;]
    board[&quot;6. Blackboard and output paths&quot;]
    render[&quot;7. Renderer applies resolved values&quot;]
    face[&quot;8. VizijRuntimeFace&quot;]

    asset --- bundle
    asset --&gt;|&quot;loaded as bundle input&quot;| provider
    bundle --&gt;|&quot;registers authored runtime layers&quot;| provider
    provider --&gt;|&quot;stages runtime inputs&quot;| inputs
    inputs --&gt; orch --&gt; board --&gt; render --&gt; face

    class asset,bundle asset
    class inputs,orch,board,render runtime
    class provider,face app
</pre>

### App And Deployment Boundary

<pre class="guidebook-mermaid mermaid">
flowchart LR
    classDef app fill:#eef4ff,stroke:#4e79a7,stroke-width:1.5px
    classDef deploy fill:#fdf1f3,stroke:#c05670,stroke-width:1.5px

    provider[&quot;Runtime provider\nowns lifecycle&quot;]
    face[&quot;Runtime face surface&quot;]
    ui[&quot;App-owned hooks,\npanels, and session state&quot;]
    shell[&quot;Browser app or standalone shell&quot;]
    operator[&quot;Operator or end-user context&quot;]

    provider --&gt; face
    provider --&gt; ui
    face --&gt;|&quot;embedded inside&quot;| shell
    ui --&gt;|&quot;belongs to&quot;| shell
    shell --&gt; operator

    class provider,face,ui app
    class shell,operator deploy
</pre>

The first diagram explains where the stable runtime contracts live.

The second explains where application ownership starts and where deployment becomes operational rather than architectural.

### 1. Authored assets

An authored Vizij face is more than mesh data.

At runtime, the system expects a face asset, typically a GLB, plus Vizij-authored metadata that can include:

1. rig structure,
2. pose information,
3. animation information,
4. graph-driven behavior or related runtime definitions.

This is why authoring matters. It produces a face that is not only visible, but controllable and portable.

### 2. Runtime control

The runtime is the part that turns authored structure into live behavior.

The current architecture stays intentionally small:

1. the `renderer` applies values to the visible face,
2. the `orchestrator` coordinates execution and merges writes,
3. graph and animation controllers generate or transform values,
4. the `blackboard` holds shared typed state between controllers.

The important learner-level point is that Vizij does not treat a face as a passive clip player. It treats the face as something live controllers can drive frame by frame.

### 3. Integration surfaces

An integration surface is the application shell that loads a face and exposes it in a usable app context.

That shell is not the same thing as the asset and not the same thing as the runtime contracts underneath it.

Its job is usually to:

1. load the asset and its bundle,
2. boot the runtime,
3. render the face,
4. expose the controls, state, or interactions the app actually needs.

### 4. Deployment surfaces

A deployment surface is where the integrated system is actually run for an end user or operator.

In the current docs and roadmap, that includes browser/runtime deployments and the standalone branch.

Deployment is therefore a real endpoint of the builder path, not just another demo.

## One Face, Multiple Layers

A useful sentence to keep in mind is:

`the asset carries structure, the runtime executes behavior, the app exposes a use case, and deployment makes that use case real`

That sentence prevents several later confusions:

1. a player is not the same thing as the face,
2. a runtime provider is not the same thing as authoring,
3. deployment is not merely "opening the demo somewhere else."

### Comparison of Layers

| Layer | Primary Role | Key Artifact | Stability |
| :--- | :--- | :--- | :--- |
| **Asset** | Structure & Metadata | GLB / Vizij Bundle | Foundational |
| **Runtime** | Execution & Logic | Orchestrator / WASM | Predictable |
| **App Shell** | Use Case & UI | React Component / Shell | Context-Specific |
| **Deployment** | Endpoint & Operator | Executable / Web URL | Operational |

This separation ensures that a face can move from a simple tutorial into a high-stakes deployment without changing the underlying architecture.

## The Runtime Contracts That Stay Stable

Later pages go deeper into control vocabulary, but this page should name the contracts that make the whole system coherent.

### Typed paths

Vizij addresses values through stable paths.

In the architecture docs, this contract is named `TypedPath`.

A path says what a value means and where it belongs in the system. Graphs, animations, runtime inputs, and renderer-facing writes all rely on that idea.

This is one reason later control pages care so much about path shape: paths are the shared addressing system.

### Values and shapes

Vizij moves typed values through the runtime rather than untyped loose payloads.

At a learner level:

1. a `Value` is the actual typed payload,
2. a `Shape` is the expected structure of that payload,
3. a `TypedPath` tells the runtime what semantic slot that value belongs to.

You do not need every encoding detail yet. You do need to know that Vizij depends on these typed contracts to keep authoring, runtime, and integration aligned.

### The blackboard

The blackboard is the shared runtime state where controllers read and write typed-path values.

You can think of it as the coordination surface between authored behavior and the visible renderer:

1. controllers write there,
2. the orchestrator schedules and merges those writes,
3. the renderer ultimately applies the resulting values.

That is why the blackboard matters conceptually even if you never inspect it directly in early workflows.

## Where Authoring Fits

Authoring belongs before integration because it defines the controllable structure a later runtime can load.

At a fundamentals level, the key idea is simple:

1. rigs define what can be controlled,
2. poses define named states over those controls,
3. animations define authored motion over time,
4. procedural or graph-driven behavior defines computed behavior,
5. export packages the result into an artifact later runtime surfaces can use.

This page does not teach how to perform those steps. It only gives the conceptual placement of authoring inside the larger system.

For that vocabulary in more detail, the next page is usually [Customization Concepts Primer](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/introduction/customization-concepts-primer.md).

## Where Control Fits

Control is the bridge between authored capability and live behavior.

If authoring answers "what can this face do?", control answers "what values are being driven right now?"

That includes:

1. standard controls,
2. pose weights,
3. animation playback,
4. other typed runtime inputs.

This page intentionally does not teach the detailed control taxonomy. It only establishes that control is not a separate world from authoring or rendering. It is the live use of the authored structure through shared runtime contracts.

## Where The Public Route Fits

One helpful public builder spine is:

`Hello Face -> Authoring -> Player -> Deployment`

This page should help you interpret that route correctly:

1. `Hello Face` proves the runtime is real,
2. `Authoring` changes the artifact and its behavior definitions,
3. `Player` shows the runtime inside an application shell,
4. `Deployment` makes that application usable in a real operating context.

The route is a teaching sequence, not the literal architecture diagram.

## Misunderstandings This Page Should Prevent

1. thinking the first demo or player surface is the whole system,
2. confusing the face asset with the application shell that hosts it,
3. treating authoring concepts as separate from runtime control,
4. assuming deployment is only a UI packaging step,
5. assuming the guidebook buckets are the same thing as engineering boundaries.

## Recommended Next Steps

1. If you want the customization vocabulary behind rigs, poses, animations, and export, continue to [Customization Concepts Primer](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/introduction/customization-concepts-primer.md).
2. If you want the control vocabulary behind runtime addresses and standard controls, continue to [Paths and Standard Controls](/docs/rigging-and-control-model/).
