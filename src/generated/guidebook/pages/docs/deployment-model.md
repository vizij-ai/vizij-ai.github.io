---
pageId: docs-deployment-model
moduleId: docs/deployment-model
sourceModuleId: deploy/operator-and-deployment-model
sourcePath: deploy/operator-and-deployment-model.md
surface: docs
publish: true
routeSlug: deployment-model
canonicalPath: /docs/deployment-model/
routeRole: operations
routeRoleLabel: Deployment framing
title: Deployment Model
summary: Compare browser and standalone delivery, operator expectations, and the
  downstream deployment choices the guidebook makes explicit.
moduleType: concept page
bucket: Deploy
depth: Fundamentals
hubGroup: integration-and-delivery
order: 60
redirects:
  - operator-and-deployment-model
outcome: "After this page, you should be able to explain the operational shape
  of the first Vizij deployment endpoint: what is running, who controls it, what
  signals move through it, and what counts as a healthy operator path."
prerequisites:
  - Minimal Web Player,
  - Easiest Standalone Deployment,
  - Loading, Playback, and Embedding.
successCheck:
  - you can explain the first operator-facing deployment model in plain language,
  - you understand the role of the WebSocket service and the built-in control
    panel,
  - you can name the minimum conditions for a healthy deployed endpoint,
  - you understand the current localhost-only boundary.
headings:
  - depth: 2
    slug: module-notes
    text: Module Notes
  - depth: 2
    slug: what-you-need
    text: What You Need
  - depth: 2
    slug: the-first-deployment-model
    text: The First Deployment Model
  - depth: 2
    slug: control-topology
    text: Control Topology
  - depth: 2
    slug: runtime-vs-provider
    text: Runtime vs. Provider
  - depth: 2
    slug: what-the-operator-actually-needs
    text: What The Operator Actually Needs
  - depth: 2
    slug: current-operational-facts
    text: Current Operational Facts
  - depth: 2
    slug: path-contract-at-the-deployment-boundary
    text: Path Contract At The Deployment Boundary
  - depth: 2
    slug: recommended-first-deployment-choice
    text: Recommended First Deployment Choice
  - depth: 2
    slug: healthy-deployment-versus-nearby-states
    text: Healthy Deployment Versus Nearby States
  - depth: 2
    slug: slot-centric-thinking
    text: Slot-Centric Thinking
  - depth: 2
    slug: built-in-web-control-panel
    text: Built-In Web Control Panel
  - depth: 2
    slug: boundary-to-advanced-deployment
    text: Boundary To Advanced Deployment
  - depth: 2
    slug: recommended-next-steps
    text: Recommended Next Steps
context:
  bucketChain: "Previous: Integrate Current: Deploy Next: End of guidebook route"
  depthLadder: "Above: Easiest Standalone Deployment Current: Fundamentals Below:
    Hardware, ROS, and Multi-Screen Topologies"
  modulePosition: "Previous in bucket: Easiest Standalone Deployment Current
    module: Operator and Deployment Model Next in bucket: Deployment Checks and
    Recovery"
  moduleType: concept page
  bucketOverview:
    label: Deploy
    href: /docs/
  referenceBridges:
    - label: Animation, Integration, and Deployment Reference
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/reference/animation-integration-and-deployment-reference.md
    - label: Validation Checkpoints
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/validation-checkpoints.md
    - label: Troubleshooting Matrix
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/troubleshooting-matrix.md
prev:
  label: Animation Model
  href: /docs/animation-model/
  description: Return to motion and authored behavior.
next:
  label: Hello Face
  href: /tutorials/hello-face/
  description: Switch back into the maintained build spine.
implementationAnchors:
  - label: Standalone app
    href: https://github.com/vizij-ai/vizij-web/tree/main/apps/vizij-standalone
    description: Current operator-facing delivery surface.
demoLinks: []
hasMermaid: true
---

## Module Notes

### Intended Audience

This page is for readers who already understand the first standalone deployment walkthrough and now need the operating model behind it.

### Artifact Being Touched

The first operator-facing deployment consists of:

1. a standalone runtime app,
2. a loaded face asset,
3. a running WebSocket control service,
4. a built-in or external same-host control client,
5. a person operating the endpoint.

The maintained implementation anchor is `vizij-standalone`.

## What You Need

It helps if you have already completed:

1. [Minimal Web Player](/tutorials/minimal-player/),
2. [Easiest Standalone Deployment](/tutorials/deployment/),
3. [Loading, Playback, and Embedding](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/integrate/loading-playback-and-embedding.md).

## The First Deployment Model

For the guidebook's first deployment path, the model is intentionally simple:

1. load a face into `vizij-standalone`,
2. expose a control surface over WebSocket,
3. optionally use the built-in web control panel,
4. validate that runtime and control are both healthy.

This keeps deployment concrete without immediately pulling the reader into ROS, custom robotics bridges, or multi-screen topology decisions.

Current deployable floor:

`vizij-standalone` on one host with one same-host operator path.

Treat that as the credible baseline before you reason about split surfaces, robot middleware, or broader topology planning.

## Control Topology

<pre class="guidebook-mermaid mermaid">
flowchart TD
    subgraph OperatorSurface [&quot;Operator Surface (Built-in or External)&quot;]
        operator[&quot;Operator (Person)&quot;] --&gt; panel[&quot;Web Control Panel\n(localhost:9000)&quot;]
        operator --&gt; custom[&quot;Custom Client\n(SDK / WS)&quot;]
    end

    subgraph RuntimeSurface [&quot;Runtime Surface (Standalone App)&quot;]
        panel -- &quot;ws://localhost:9000&quot; --&gt; ws[&quot;WebSocket Server&quot;]
        custom -- &quot;ws://localhost:9000&quot; --&gt; ws
        ws &lt;--&gt; conn[&quot;Connection Manager&quot;]
        conn &lt;--&gt; app[&quot;Vizij Runtime&quot;]
        app &lt;--&gt; face[&quot;Face Artifact\n(Quori / Hugo)&quot;]
    end

    style OperatorSurface fill:#161a33,stroke:#2d3356
    style RuntimeSurface fill:#0b0d18,stroke:#7c4dff,stroke-width:2px
</pre>

## Runtime vs. Provider

It is important to distinguish between the **Face Artifact** (the rig and visuals) and the **Provider** (the logic driving the face).

<pre class="guidebook-mermaid mermaid">
flowchart LR
    provider[&quot;AI Provider\n(Gemini / OpenAI)&quot;] -- &quot;Typed Values&quot; --&gt; runtime[&quot;Vizij Runtime&quot;]
    runtime -- &quot;Bone/Morph Weights&quot; --&gt; face[&quot;Face Artifact&quot;]
    
    subgraph ControlLoop [&quot;Control Loop&quot;]
        runtime
        face
    end
</pre>

## What The Operator Actually Needs

An operator does not need every internal detail of the runtime.

They do need clarity on:

1. whether the face asset loaded successfully,
2. whether the runtime is ready,
3. what port or endpoint the control client should use,
4. whether a control client is connected,
5. whether the face is actually responding to inputs,
6. how to reset or recover when something goes wrong.

That is the practical deployment model.

## Current Operational Facts

Important operational facts from the current standalone app:

1. the default endpoint is `ws://localhost:9000`,
2. the server currently binds to `127.0.0.1`,
3. the built-in web control panel is served on the same port,
4. the control panel behaves like a regular WebSocket client,
5. the connection manager enforces one active client at a time.

This is why deployment is not just about rendering. The runtime has to expose a believable control surface for an operator.

## Path Contract At The Deployment Boundary

Keep these three strings separate when you validate or debug the standalone endpoint:

| What you are looking at | Example | Trust it for |
| --- | --- | --- |
| runtime hint | `rig/{faceId}/standard/vizij/left_eye/pos/x` | internal runtime reasoning and bundle-to-renderer diagnostics |
| discovered slot name | `standard/vizij/left_eye/pos/x` | external client writes and operator-facing control |
| namespaced snapshot key | `{namespace}/rig/{faceId}/standard/vizij/left_eye/pos/x` | shared-runtime or orchestrator-level inspection |

The practical rule is simple:

1. copy discovered slot names from the endpoint when writing through WebSocket or the built-in panel,
2. use the full runtime path when you are inspecting runtime internals,
3. use the namespaced form only when a shared runtime or diagnostics surface actually shows it.

## Recommended First Deployment Choice

Use this before you jump into deeper topology pages:

| If your real constraint is... | Best current route | Readiness label | Why |
| --- | --- | --- | --- |
| one machine, one rendered face, one same-host operator path | standalone endpoint plus built-in web control | maintained now | matches the current localhost-first server and control-panel story directly |
| one machine with the face on one screen and supporting UI on another | single-host multi-monitor deployment | maintained advanced path | display selection, fullscreen, and kiosk-style window options are implemented now |
| separate operator and face surfaces beyond the same host | split control-surface planning | prototype direction | control separation is real, but the current bind and exclusive-client rules still shape the topology tightly |
| ROS or robot middleware as the main system boundary | ROS and hardware comparison route | roadmap direction | the guidebook can frame the topology, but it is not a packaged maintained walkthrough today |

## Healthy Deployment Versus Nearby States

| State | What is true | What is still missing |
| --- | --- | --- |
| useful demo | a face renders and something moves | operator path may be weak or implicit |
| healthy first deployment | runtime, control endpoint, and operator path are all explicit | advanced topology and remote-network concerns |
| unfinished runtime shell | some runtime pieces exist | loading, control, or recovery truth is still hidden |

## Slot-Centric Thinking

In the standalone deployment model, think in discovered slot names at the operator boundary:

1. the deployment surface exposes controllable paths,
2. those paths are synchronized into the backend,
3. clients write typed values against them,
4. the runtime updates the face accordingly,
5. reset and value-query behavior are part of normal operation.

That slot model is the deployment-facing expression of the same path-and-value ideas the reader already saw in `Control`.

## Built-In Web Control Panel

The built-in control panel is important because it lowers the first deployment barrier.

It gives the reader:

1. a no-extra-installation operator surface,
2. dynamic slot discovery,
3. real-time slider control,
4. reset behavior,
5. a believable first operator path on the same host as the runtime.

Treat this as part of the first deployment story, not as a side note.

| Feature | What the operator gets |
| :--- | :--- |
| **Control UI** | a same-host browser surface for driving the loaded face without building a separate client first |
| **Discovery** | dynamic slots populate from the loaded model schema |

## Boundary To Advanced Deployment

This page deliberately stops before:

1. ROS integration,
2. LAN-first or remote-device control claims,
3. multi-screen control setups,
4. hardware-specific transport decisions.

Those are real deployment topics, but they belong in the advanced deployment branch.

## Recommended Next Steps

1. If you want the first deployment readiness loop and recovery sequence, continue to [Deployment Checks and Recovery](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/deploy/deployment-checks-and-recovery.md).
2. For reusable readiness checks across the route, continue to [Validation Checkpoints](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/validation-checkpoints.md).
3. For failure recovery patterns, continue to [Troubleshooting Matrix](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/troubleshooting-matrix.md).
