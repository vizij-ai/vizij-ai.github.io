---
pageId: docs-architecture
moduleId: docs/architecture
sourceModuleId: introduction/architecture-bridge
sourcePath: introduction/architecture-bridge.md
surface: docs
publish: true
routeSlug: architecture
canonicalPath: /docs/architecture/
routeRole: system-map
routeRoleLabel: Architecture bridge
title: Architecture
summary: Connect the public learning model to the real Vizij repos, packages,
  apps, assets, and deployment surfaces.
moduleType: reference bridge
bucket: Introduction
depth: Advanced
hubGroup: orientation
order: 20
redirects:
  - architecture-bridge
outcome: "After this page, you should be able to explain:"
prerequisites:
  - vizij-docs/current_documentation/ARCHITECTURE.md,
  - vizij-docs/current_documentation/concepts/ARCHITECTURE_PRIMER.md,
  - vizij-docs/current_documentation/ROADMAP.md,
  - guidebook/reference/README.md.
successCheck:
  - you can explain why the guidebook bucket model is not the repo map,
  - you can identify which documentation surface owns which type of truth,
  - you can route from a learner-facing question to the right
    implementation-facing source,
  - you can describe the public route and the deeper platform view without
    treating them as conflicting stories.
headings:
  - depth: 2
    slug: module-notes
    text: Module Notes
  - depth: 2
    slug: what-you-need
    text: What You Need
  - depth: 2
    slug: teaching-view-vs-platform-view
    text: Teaching View vs. Platform View
  - depth: 2
    slug: the-guidebook-is-a-teaching-structure
    text: The Guidebook Is A Teaching Structure
  - depth: 2
    slug: documentation-authority-matrix
    text: Documentation Authority Matrix
  - depth: 2
    slug: mapping-the-maintained-route-to-the-platform
    text: Mapping The Maintained Route To The Platform
  - depth: 2
    slug: when-to-stay-in-the-guidebook
    text: When To Stay In The Guidebook
  - depth: 2
    slug: when-to-leave-the-guidebook
    text: When To Leave The Guidebook
  - depth: 2
    slug: recommended-next-steps
    text: Recommended Next Steps
context:
  bucketChain: "Previous: Start of guidebook Current: Introduction Next: Experience"
  depthLadder: "Above: What Is Vizij?, How To Use This Guidebook, System Mental
    Model, Customization Concepts Primer Current: Advanced Below: none, this is
    the deepest current depth in this bucket"
  modulePosition: "Previous in bucket: Customization Concepts Primer Current
    module: Architecture Bridge Next in bucket: none, this is the last module in
    the bucket sequence"
  moduleType: reference bridge
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
  label: Getting Started
  href: /docs/getting-started/
  description: Choose the right public route before you dive into the repo map.
next:
  label: Renderer Data Model
  href: /docs/renderer-data-model/
  description: Move from the repo map into the runtime path/value contract.
implementationAnchors:
  - label: Cross-repo architecture
    href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/ARCHITECTURE.md
    description: Canonical internal repo-boundary reference.
  - label: Runtime provider
    href: https://github.com/vizij-ai/vizij-web/tree/main/packages/@vizij/runtime-react/src/VizijRuntimeProvider.tsx
    description: The public route’s runtime boundary in code.
demoLinks:
  - label: Demos architecture lane
    href: /demos/#architecture
    description: Compare the system map with the public behavior slices.
hasMermaid: true
---

## Module Notes

- Read this after the `Introduction` pages if you need to bridge from the guidebook route into repo and architecture documentation.
- The page is mainly for contributors, facilitators, and advanced readers who need an authority map and a clean handoff from learner framing to implementation framing.
- ABI details, package signatures, runtime internals, and project-status tracking remain outside this module.

## What You Need

It helps if you can inspect these internal anchors:

1. `vizij-docs/current_documentation/ARCHITECTURE.md`,
2. `vizij-docs/current_documentation/concepts/ARCHITECTURE_PRIMER.md`,
3. `vizij-docs/current_documentation/ROADMAP.md`,
4. `guidebook/reference/README.md`.

You do not need crate-by-crate or package-by-package detail to use this page well.

## Teaching View vs. Platform View

Vizij is easiest to navigate when you keep two views in mind at the same time:

<pre class="guidebook-mermaid mermaid">
flowchart TD
    subgraph TeachingView [&quot;Guidebook / Teaching View&quot;]
        t1[&quot;Experience\n(Proof of Life)&quot;] --&gt; t2[&quot;Control\n(Runtime Specs)&quot;]
        t2 --&gt; t3[&quot;Customize\n(Authoring)&quot;]
        t3 --&gt; t4[&quot;Integrate\n(App Shells)&quot;]
        t4 --&gt; t5[&quot;Deploy\n(Endpoints)&quot;]
    end

    subgraph PlatformView [&quot;Platform / Implementation View&quot;]
        p1[&quot;vizij-rs\n(Rust Cores / WASM)&quot;]
        p2[&quot;vizij-web\n(TS Packages / Apps)&quot;]
        p3[&quot;vizij-assets\n(Binary Sources)&quot;]
        p4[&quot;vizij-docs\n(Architecture / Roadmap)&quot;]
    end

    t1 -.-&gt; p2
    t2 -.-&gt; p1
    t3 -.-&gt; p2
    t4 -.-&gt; p2
    t5 -.-&gt; p2
    p1 -.-&gt; p2
    p3 -.-&gt; p2
    p4 -.-&gt; TeachingView

    style TeachingView fill:#161a33,stroke:#2d3356
    style PlatformView fill:#0b0d18,stroke:#7c4dff,stroke-width:2px
</pre>

The teaching view organizes concepts in the order that helps readers learn.
The platform view organizes implementation truth by repo, app, package, and asset ownership.

Both views are real. The bridge ensures you can transition from "learning a concept" to "finding the code" without losing the narrative thread.

## The Guidebook Is A Teaching Structure

The guidebook buckets answer questions like:

1. what should a reader learn first,
2. what misunderstanding should a page prevent,
3. what should the next step be,
4. how should the route feel coherent.

They do not answer:

1. which package owns a type,
2. which repo defines a contract,
3. which app is the deepest implementation source,
4. how every runtime subsystem is wired internally.

That is why the guidebook can be canonical for teaching without pretending to be the canonical implementation spec.

## Documentation Authority Matrix

| Surface | Owns this kind of truth | Best used for | Not the right source for |
| --- | --- | --- | --- |
| `vizij-docs/current_documentation` | cross-repo architecture, roadmap framing, decisions, known issues | understanding stable platform direction | app-by-app behavior or package usage details |
| `vizij-web` app docs | maintained app behavior, setup, shell anatomy, operator flow | understanding the current route anchors | cross-repo architectural decisions |
| `vizij-web` package docs | package contracts and usage surfaces | integration details and API shape | learner route framing |
| `vizij-rs` docs | runtime semantics, WASM boundaries, crate-level truth | low-level runtime ownership | public route teaching |
| `vizij-assets` | asset files and provenance | source asset truth | runtime or app behavior |
| guidebook | learner path, terminology, concept boundaries, next steps | teaching and routing | exact implementation truth |

## Mapping The Maintained Route To The Platform

### Experience and Control

These buckets are mostly taught through maintained apps and guidebook language.

The strongest maintained anchors are:

1. `tutorial-fullscreen-face` for the minimal runtime shell,
2. `tutorial-agent-face` for the richer optional branch,
3. `@vizij/runtime-react` for the provider and hook surface.

### Customize

This bucket is still learner-facing, but its strongest implementation truth lives in `vizij-web/apps/vizij-authoring` and its local docs.

The guidebook teaches the route through import, rigging, poses, animations, procedural programs, and export.

The app and local authoring docs own the fine-grained implementation behavior.

### Integrate

This bucket teaches runtime provider, embedding, application shells, and richer app patterns.

The concrete implementation truth lives mostly in:

1. `vizij-web/packages/@vizij/runtime-react`,
2. `vizij-web/apps/demo-vizij-player`,
3. `vizij-web/apps/tutorial-fullscreen-face`,
4. `vizij-web/apps/tutorial-agent-face`.

### Deploy

This bucket teaches the endpoint and operator model.

Its deeper current truth is spread across:

1. `vizij-web/apps/vizij-standalone`,
2. the related standalone source,
3. `vizij-docs` runtime and deployment planning docs.

## When To Stay In The Guidebook

Stay in the guidebook when your main question is:

1. what does this concept mean,
2. what should I learn next,
3. what artifact am I touching,
4. how does this bucket connect to the larger route.

## When To Leave The Guidebook

Leave the guidebook when your main question becomes:

1. which repo or package owns this behavior,
2. what is the current code contract,
3. what does this app or package actually implement,
4. where is the authoritative implementation detail.

For the maintained route, that usually means switching to repo-local docs before switching to raw source files.

## Recommended Next Steps

1. If you want to return to learner-facing system framing, go to [System Mental Model](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/introduction/system-mental-model.md).
2. If you want the route-first builder path, go to [How To Use This Guidebook](/docs/getting-started/) and then [Hello Face Quickstart](/tutorials/hello-face/).
3. If you need stable vocabulary before leaving the guidebook, go to [Glossary and Terminology Bridge](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/glossary-and-terminology-bridge.md).
