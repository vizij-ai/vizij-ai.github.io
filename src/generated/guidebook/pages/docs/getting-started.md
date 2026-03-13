---
pageId: docs-getting-started
moduleId: docs/getting-started
sourceModuleId: introduction/how-to-use-this-guidebook
sourcePath: introduction/how-to-use-this-guidebook.md
surface: docs
publish: true
routeSlug: getting-started
canonicalPath: /docs/getting-started/
routeRole: orientation
routeRoleLabel: Path chooser
title: Getting Started
summary: Get oriented, choose a learning path, and know when to switch from
  overview pages to implementation references.
moduleType: decision guide
bucket: Introduction
depth: Surface
hubGroup: orientation
order: 10
redirects:
  - how-to-use-this-guidebook
outcome: After this page, you should be able to choose the right learning path
  for your goal, pick the right depth, and know when to switch from overview
  pages to repo-local implementation docs.
prerequisites:
  - You do not need to understand Vizij architecture before using this page.
successCheck:
  - you can name the path you want to follow,
  - you know whether you need Surface, Fundamentals, or Advanced depth first,
  - you know which page you are opening next,
  - you know when to switch from overview pages to repo-local docs.
headings:
  - depth: 2
    slug: module-notes
    text: Module Notes
  - depth: 2
    slug: what-you-need
    text: What You Need
  - depth: 2
    slug: learning-paths
    text: Learning Paths
  - depth: 2
    slug: choose-a-path
    text: Choose A Path
  - depth: 2
    slug: path-chooser
    text: Path Chooser
  - depth: 2
    slug: quick-chooser
    text: Quick chooser
  - depth: 2
    slug: when-to-stay-in-the-overview-docs
    text: When To Stay In The Overview Docs
  - depth: 2
    slug: when-to-switch-to-implementation-docs
    text: When To Switch To Implementation Docs
  - depth: 2
    slug: what-these-pages-do-not-replace
    text: What These Pages Do Not Replace
  - depth: 2
    slug: suggested-first-step
    text: Suggested First Step
  - depth: 2
    slug: recommended-next-steps
    text: Recommended Next Steps
context:
  bucketChain: "Previous: Start of docs path Current: Introduction Next: Experience"
  depthLadder: "Above: none, this is the entry depth in this bucket Current:
    Surface Below: System Mental Model, Customization Concepts Primer,
    Architecture Bridge"
  modulePosition: "Previous in bucket: What Is Vizij? Current module: Choose a
    Learning Path Next in bucket: System Mental Model"
  moduleType: decision guide
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
next:
  label: Architecture
  href: /docs/architecture/
  description: Map the public route back to the real cross-repo implementation surfaces.
implementationAnchors:
  - label: Docs source overview
    href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/README.md
    description: Canonical source framing behind the public docs path.
  - label: Vizij roadmap
    href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/ROADMAP.md
    description: Cross-repo program framing behind the maintained path.
demoLinks:
  - label: Public demos
    href: /demos/
    description: Observe the runtime first, then return to the docs route.
hasMermaid: true
---

## Module Notes

### Intended Audience

This page is for:

1. newcomers who want the shortest path to a working Vizij face,
2. builders who want to know where customization fits,
3. contributors who need to understand the docs map before going deeper.

### Artifact Being Touched

The artifact here is the reader-facing docs map.

Use it to decide what to learn next. It is not the same thing as the internal architecture of the platform.

## What You Need

You do not need to understand Vizij architecture before using this page.

It is enough to know that Vizij can load and control expressive faces and that these docs are organized to help you move from first proof to deeper ownership.

## Learning Paths

The docs are organized around six documentation buckets:

1. `Introduction`
2. `Experience`
3. `Control`
4. `Customize`
5. `Integrate`
6. `Deploy`

Each bucket supports three depth levels:

1. `Surface`
   - get oriented and succeed quickly
2. `Fundamentals`
   - learn the mental models and practical basics
3. `Advanced`
   - go deeper into ownership, extension, or more complex implementation patterns

<pre class="guidebook-mermaid mermaid">
flowchart LR
    intro[&quot;Introduction&quot;] --&gt; exp[&quot;Experience&quot;]
    exp --&gt; control[&quot;Control&quot;]
    control --&gt; customize[&quot;Customize&quot;]
    control --&gt; integrate[&quot;Integrate&quot;]
    customize --&gt; integrate
    integrate --&gt; deploy[&quot;Deploy&quot;]

    surface[&quot;Surface\nfirst success&quot;] --- intro
    fundamentals[&quot;Fundamentals\nmental model + stable contracts&quot;] --- control
    advanced[&quot;Advanced\nownership + implementation bridges&quot;] --- deploy
</pre>

Use the path to choose *where to learn next*.

Use the depth to choose *how much detail you need right now*.

## Choose A Path

### Fast path: you want the fastest believable path to a working deployment

Follow:

`Introduction -> Experience -> Control -> Integrate -> Deploy`

Choose this first if you want to:

1. prove that Vizij works,
2. understand the control model,
3. get a face into a player or runtime shell,
4. reach a real endpoint quickly.

Most first-time builders should start here.

### Customization path: you want to make the face your own before deploying it

Follow:

`Introduction -> Experience -> Control -> Customize -> Integrate -> Deploy`

Choose this first if you want to:

1. modify an existing face,
2. work on rigs, poses, animations, or export,
3. carry an authored artifact into integration,
4. deploy something you now own.

### You only need one concept right now

Jump directly to the bucket that matches the problem you are trying to solve:

1. `Experience` if you need first contact with a working face,
2. `Control` if you need to understand paths, standard controls, or runtime inputs,
3. `Customize` if you need authoring and export,
4. `Integrate` if you need a runtime shell or application embedding,
5. `Deploy` if you need a real endpoint, operator flow, or standalone path.

## Path Chooser

| Path | Choose it when | First maintained anchor | What it intentionally skips |
| --- | --- | --- | --- |
| Fast deployment path | You need proof, control understanding, a player, and a first deployed endpoint | `tutorial-fullscreen-face`, `demo-vizij-player`, `vizij-standalone` | deep customization and authoring ownership |
| Customization path | You need to change the face or its behavior before integrating it | `vizij-authoring` and its local docs | the fastest path to a deployed endpoint |
| Single-bucket jump-in | You already know the path and only need one concept or recovery page | the bucket that matches the immediate problem | path-level context and sequencing |

## Quick chooser

Use this if you are hesitating at the first fork:

| If your immediate question is... | Open this next | Why |
| --- | --- | --- |
| `Can I make a face run at all?` | [Hello Face Quickstart](/tutorials/hello-face/) | fastest maintained proof |
| `What do these runtime interactions actually mean?` | [First Control Interactions](/tutorials/renderer-data-model/) | same maintained app, slower explanation |
| `How do I change the face or its behavior before integrating it?` | [Tweak an Existing Face](/tutorials/authoring/) | lowest-friction authoring entry |
| `How do I embed a face in my app?` | [Minimal Web Player](/tutorials/minimal-player/) | first practical integration shell |
| `How do I get to a same-host operator endpoint?` | [Easiest Standalone Deployment](/tutorials/deployment/) | first maintained deployment floor |

## When To Stay In The Overview Docs

Stay in the overview docs when your question is primarily:

1. what does this concept mean,
2. what should I learn next,
3. what artifact am I touching,
4. what misunderstanding should I avoid,
5. which maintained app is the right example to inspect.

## When To Switch To Implementation Docs

Switch to implementation docs when your question becomes implementation-specific:

1. which app or package owns this behavior,
2. what the current code contract is,
3. how a maintained example is assembled,
4. which runtime or authoring document is authoritative.

For the maintained path, the usual implementation docs are:

1. `vizij-web/apps/tutorial-fullscreen-face`
2. `vizij-web/apps/tutorial-agent-face`
3. `vizij-web/apps/demo-vizij-player`
4. `vizij-web/apps/vizij-authoring`
5. `vizij-web/apps/vizij-standalone`
6. `vizij-web/packages/@vizij/runtime-react`

## What These Pages Do Not Replace

These overview pages are deliberately reader-facing.

They do not replace:

1. repo-local implementation docs in `vizij-web` and `vizij-rs`,
2. internal roadmap and architecture authority docs in `vizij-docs/current_documentation`,
3. detailed app-level runbooks when the implementation surface matters more than the teaching abstraction.

When you need engineering truth, use the implementation anchors provided in each module.

## Suggested First Step

If you are new to Vizij, start with [Hello Face Quickstart](/tutorials/hello-face/).

That page is the fastest way to see a working face, trigger visible changes, and build trust in the runtime before you learn the deeper vocabulary.

## Recommended Next Steps

1. New reader: [Hello Face Quickstart](/tutorials/hello-face/)
2. Reader who wants the bucket overview first: [Introduction](/docs/)
3. Reader who already saw a demo and needs semantics: [Paths and Standard Controls](/docs/rigging-and-control-model/)
