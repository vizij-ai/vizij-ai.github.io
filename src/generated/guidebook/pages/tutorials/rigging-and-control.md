---
pageId: tutorials-rigging-and-control
moduleId: tutorials/rigging-and-control
sourceModuleId: customize/deep-custom-pipeline
sourcePath: customize/deep-custom-pipeline.md
surface: tutorials
publish: true
routeSlug: rigging-and-control
canonicalPath: /tutorials/rigging-and-control/
routeRole: walkthrough
routeRoleLabel: Deep customization
title: Rigging And Control
summary: Follow the deeper customization route through authoring, control
  structure, export discipline, and validation against a real runtime surface.
moduleType: walkthrough
bucket: Customize
depth: Advanced
hubGroup: authoring
order: 40
redirects:
  - deep-custom-pipeline
outcome: "After this page, you should be able to carry one believable face
  package through a full advanced customization pass:"
prerequisites:
  - Import,
  - Reference-Face Transfer,
  - Rigging,
  - Poses,
  - Animations,
  - Procedural Programs,
  - Export.
  - a maintained preset face that already loads cleanly in vizij-authoring,
  - an imported face that has already made it through the earlier Customize
    fundamentals.
successCheck:
  - you have carried one believable face package through structure, behavior,
    readiness, and export,
  - you can explain why controllable structure must come before authored
    behavior,
  - you can explain why export readiness is its own milestone,
  - you know that the next bucket after a successful deep custom pipeline is
    Integrate.
headings:
  - depth: 2
    slug: module-notes
    text: Module Notes
  - depth: 2
    slug: what-you-need
    text: What You Need
  - depth: 2
    slug: starting-state
    text: Starting State
  - depth: 2
    slug: walkthrough
    text: Walkthrough
  - depth: 2
    slug: common-failure-points-in-this-walkthrough
    text: Common Failure Points In This Walkthrough
  - depth: 2
    slug: recommended-next-steps
    text: Recommended Next Steps
context:
  bucketChain: "Previous: Control Current: Customize Next: Integrate"
  depthLadder: "Above: Tweak an Existing Face, Import, Reference-Face Transfer,
    Rigging, Poses, Animations, Procedural Programs, Export Current: Advanced
    Below: none, this is the deepest current depth in this bucket"
  modulePosition: "Previous in bucket: Export Current module: Deep Custom Pipeline
    Next in bucket: none, this is the last module in the bucket sequence"
  moduleType: walkthrough
  bucketOverview:
    label: Customize
    href: /tutorials/
  referenceBridges:
    - label: Renderer and Rigging Reference
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/reference/renderer-and-rigging-reference.md
    - label: Validation Checkpoints
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/validation-checkpoints.md
    - label: Troubleshooting Matrix
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/troubleshooting-matrix.md
prev:
  label: Authoring
  href: /tutorials/authoring/
  description: Return to the lowest-friction authoring path.
next:
  label: Minimal Player
  href: /tutorials/minimal-player/
  description: Take the authored asset back into a runtime shell.
implementationAnchors:
  - label: Authoring docs
    href: https://github.com/vizij-ai/vizij-web/tree/main/apps/vizij-authoring/docs
    description: Implementation-local detail behind the deeper customization path.
demoLinks: []
labId: deep-custom-pipeline
hasMermaid: false
---

## Module Notes

- Use this page after the `Customize` fundamentals if you need the full import-to-export route in one place.
- The teaching job here is sequencing and checkpoints across the authored face package, not deeper runtime or deployment detail.
- Stop at the handoff into `Integrate`; topology, ROS, and runtime internals belong later.

## What You Need

You should already understand:

1. [Import](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/import.md),
2. [Reference-Face Transfer](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/reference-face-transfer.md),
3. [Rigging](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/rigging.md),
4. [Poses](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/poses.md),
5. [Animations](/docs/animation-model/),
6. [Procedural Programs](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/procedural-programs.md),
7. [Export](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/export.md).

The current implementation anchors live mainly in `vizij-web/apps/vizij-authoring`.

## Starting State

Use the `vizij-web` workspace root:

```bash
cd /home/chris/Code/Semio/vizij_ws/vizij-web
pnpm run dev:vizij-authoring
```

This walkthrough assumes you are starting from one of two believable bases:

1. a maintained preset face that already loads cleanly in `vizij-authoring`,
2. an imported face that has already made it through the earlier `Customize` fundamentals.

If you do not have one of those yet, stop and go back to [Tweak an Existing Face](/tutorials/authoring/) or [Import](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/import.md).

## Walkthrough

Current pipeline motion anchor:

<figure class="guidebook-media">
<img src="/guidebook-assets/gifs/authoring-mode-switches.gif" alt="Authoring Mode Switches" loading="lazy" />
<figcaption>the deep route crossing several authoring surfaces as the work moves from structure into behavior and validation.</figcaption>
</figure>

This clip is not a full authored workflow map, but it is the best current route-faithful capture for this section because it shows the advanced pipeline crossing several real authoring surfaces instead of pretending deep customization happens in one undifferentiated panel.

Counterexample anchor:

<figure class="guidebook-media">
<img src="/guidebook-assets/gifs/authoring-input-driver-creation-buggy.gif" alt="Buggy Input Driver Creation" loading="lazy" />
<figcaption>an unstable intermediate capture that looks active but does not represent a trustworthy pipeline milestone.</figcaption>
</figure>

Keep this second clip in mind as the wrong shape for the deep route. It is useful here precisely because it records an unstable intermediate authoring moment: something is happening in the tool, but it is not the kind of clean, trustworthy stage transition you should treat as pipeline success.

### 1. Start from a supported base and name the route

Load the maintained preset or imported face you are going to carry through the rest of the pipeline.

Action:

1. load the face and wait for the preview plus side panels to populate,
2. decide whether this artifact is mainly headed toward `Control`, `Customize`, or `Integrate`,
3. state out loud what you expect this face to become by the end of the walkthrough.

Expected result:

1. the starting artifact is visible and stable,
2. you are not doing vague “more authoring” work,
3. the pipeline has a believable destination.

If the starting artifact is still unclear, every later stage becomes harder to trust.

### 2. Establish controllable structure before authoring more behavior

The next job is not visual polish. It is controllable structure.

Action:

1. inspect the loaded face and confirm the targets you need are actually present,
2. check whether copied or transferred structure landed where you expect,
3. stop immediately if the structure is still ambiguous.

Expected result:

1. the right targets exist,
2. the structure is mapped in a Vizij-usable way,
3. later authored behavior has something stable to drive.

If this stage is weak, later poses, animations, or procedural behavior will look more successful than they really are. Route back to [Reference-Face Transfer](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/reference-face-transfer.md) or [Rigging](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/rigging.md) rather than pushing forward.

### 3. Add one named state and one behavior layer

Once the structure is trustworthy, make the artifact do something more deliberate than a static edit.

Action:

1. create or confirm one named pose that expresses a meaningful state,
2. add one motion layer on top of that structure through [Animations](/docs/animation-model/) or [Procedural Programs](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/procedural-programs.md),
3. verify that the visible behavior now reflects real authored intent rather than one-off tweaking.

Expected result:

1. the artifact has at least one named state,
2. it has at least one authored motion or computed behavior layer,
3. you can explain why you chose that behavior layer instead of treating all advanced authoring tools as interchangeable.

### 4. Run export readiness before you call the route complete

A deep custom pipeline becomes reliable only when export readiness is treated as a real checkpoint.

Action:

1. open the export flow,
2. read the audit and warning surfaces instead of treating export as a blind file write,
3. clear any blocker that means the artifact is still structurally or behaviorally untrustworthy.

Expected result:

1. the bundle is coherent enough to leave authoring,
2. unresolved structure mistakes are caught before handoff,
3. export is functioning as a route milestone rather than only a file operation.

If warnings still indicate unresolved structure, route back to [Rigging](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/rigging.md), [Poses](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/poses.md), [Animations](/docs/animation-model/), [Procedural Programs](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/procedural-programs.md), or [Export](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/export.md) as appropriate.

### 5. Export one bundle and define the handoff

The output of this route is not deployment. It is an artifact that is believable enough to enter `Integrate`.

Action:

1. export one bundle you are willing to treat as the current handoff artifact,
2. note what this artifact now proves,
3. choose the first `Integrate` page you will use to validate the handoff.

Expected result:

1. the artifact has actually crossed the authoring boundary,
2. you know whether the next practical stop is [Loading, Playback, and Embedding](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/integrate/loading-playback-and-embedding.md) or a later `Integrate` page,
3. the route has moved forward instead of stalling in endless authoring.

## Common Failure Points In This Walkthrough

Use these reroutes instead of pushing forward with a weak artifact:

1. if the starting artifact is not yet believable, go back to [Tweak an Existing Face](/tutorials/authoring/) or [Import](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/import.md),
2. if copied or transferred structure is still unreliable, go back to [Reference-Face Transfer](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/reference-face-transfer.md) or [Rigging](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/rigging.md),
3. if the face has structure but no convincing authored behavior, go back to [Poses](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/poses.md), [Animations](/docs/animation-model/), or [Procedural Programs](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/procedural-programs.md),
4. if export still feels like guesswork, go back to [Export](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/export.md) before entering `Integrate`.

## Recommended Next Steps

1. If you still need to stabilize the artifact boundary, go back to [Export](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/export.md).
2. If the face is ready to leave authoring, continue to [Loading, Playback, and Embedding](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/integrate/loading-playback-and-embedding.md).
3. If the next job is a richer app shell instead of a minimal handoff, continue later to [Rich Interactive Applications](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/integrate/rich-interactive-applications.md).
