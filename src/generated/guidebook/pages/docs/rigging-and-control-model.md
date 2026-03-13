---
pageId: docs-rigging-and-control-model
moduleId: docs/rigging-and-control-model
sourceModuleId: control/paths-and-standard-controls
sourcePath: control/paths-and-standard-controls.md
surface: docs
publish: true
routeSlug: rigging-and-control-model
canonicalPath: /docs/rigging-and-control-model/
routeRole: model
routeRoleLabel: Control vocabulary
title: Rigging and Control Model
summary: Learn the standard control vocabulary, path families, and portable
  control abstractions behind public-facing rig behavior.
moduleType: concept page
bucket: Control
depth: Fundamentals
hubGroup: control-models
order: 40
redirects:
  - paths-and-standard-controls
outcome: After this page, you should be able to read common Vizij control paths,
  distinguish standard controls from pose-weight paths, and connect visible face
  behavior to the runtime values being written underneath it.
prerequisites:
  - run tutorial-fullscreen-face,
  - looked briefly at useMouseGaze.ts or usePoseHotkeys.ts,
  - seen at least one face in vizij-authoring.
successCheck:
  - you can read a standard control path and say what kind of behavior it
    targets,
  - you can read a pose-weight path and say how it differs,
  - you can explain why mouse gaze and pose hotkeys are not the same kind of
    control.
headings:
  - depth: 2
    slug: module-notes
    text: Module Notes
  - depth: 2
    slug: what-you-need
    text: What You Need
  - depth: 2
    slug: the-core-idea
    text: The Core Idea
  - depth: 2
    slug: quick-term-bridge
    text: Quick Term Bridge
  - depth: 2
    slug: runtime-path-versus-deployment-slot
    text: Runtime Path Versus Deployment Slot
  - depth: 2
    slug: standard-control-path-shape
    text: Standard Control Path Shape
  - depth: 2
    slug: pose-weight-path-shape
    text: Pose Weight Path Shape
  - depth: 2
    slug: viseme-weight-path-shape
    text: Viseme Weight Path Shape
  - depth: 2
    slug: current-control-family-inventory
    text: Current Control-Family Inventory
  - depth: 2
    slug: visible-interaction-vs-runtime-meaning
    text: Visible Interaction vs Runtime Meaning
  - depth: 2
    slug: where-these-paths-show-up
    text: Where These Paths Show Up
  - depth: 2
    slug: good-questions-to-ask-when-reading-a-path
    text: Good Questions To Ask When Reading a Path
  - depth: 2
    slug: current-useful-visual
    text: Current Useful Visual
  - depth: 2
    slug: recommended-next-steps
    text: Recommended Next Steps
context:
  bucketChain: "Previous: Experience Current: Control Next: Customize on the
    customization route or Integrate on the fast route"
  depthLadder: "Above: First Control Interactions Current: Fundamentals Below:
    Orchestration and Diagnostics"
  modulePosition: "Previous in bucket: First Control Interactions Current module:
    Paths and Standard Controls Next in bucket: Runtime Inputs and Semantics"
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
  label: Renderer Data Model
  href: /docs/renderer-data-model/
  description: Return to input semantics and typed values.
next:
  label: Animation Model
  href: /docs/animation-model/
  description: Continue into motion, playback, and embedding guidance.
implementationAnchors:
  - label: Renderer and rigging reference
    href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/reference/renderer-and-rigging-reference.md
    description: Compact reference bridge for control and rigging terms.
demoLinks:
  - label: Expressions demo
    href: /demos/#expressions
    description: Compare the public control model with the visible runtime controls.
hasMermaid: true
---

## Module Notes

### Intended Audience

This page is for readers who have already seen a face working and now need the mental model underneath it.

It is especially useful after [Hello Face Quickstart](/tutorials/hello-face/).

### Artifact Being Touched

The artifact here is the control vocabulary itself:

1. runtime input paths,
2. standard control paths,
3. pose-weight paths,
4. related categories like visemes.

These are the stable handles that let different Vizij surfaces stay aligned.

## What You Need

You do not need to understand every runtime package to use this page.

It helps if you have already:

1. run `tutorial-fullscreen-face`,
2. looked briefly at `useMouseGaze.ts` or `usePoseHotkeys.ts`,
3. seen at least one face in `vizij-authoring`.

## The Core Idea

When you move a face in Vizij, you are usually writing a value to a path.

The visible UI or runtime surface may differ, but the underlying question stays the same:

1. what face is being controlled,
2. what path is being written,
3. what kind of control that path represents.

## Quick Term Bridge

Before you read the path grammar, keep these definitions nearby:

| Term | Read it as | Where it usually shows up first |
| --- | --- | --- |
| `path` | the runtime address a value is written to | hooks, diagnostics panels, transport clients |
| `standard control` | a reusable control family such as gaze, jaw, or brows | mouse gaze, resolved face controls, player UIs |
| `pose weight` | the current strength of an authored facial state | hotkeys, pose panels, authored expression blending |
| `viseme` | a speech-shaped mouth state exposed as a named weight | speech and live-agent surfaces |
| `slot` | a deployment-facing exposed control entry, not a synonym for every path | standalone operator control surfaces |

If you need the broader distinction between `runtime path`, `deployment slot name`, `controller`, `driver`, `layer`, `mode`, and `stage`, use [Glossary and Terminology Bridge](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/glossary-and-terminology-bridge.md).

## Runtime Path Versus Deployment Slot

This page teaches the runtime-facing path grammar.

Keep that separate from the deployment-facing short slot names that the standalone endpoint exposes to clients:

| Surface | What you read or write | Example | Why it differs |
| --- | --- | --- | --- |
| runtime input path | full runtime path inside the face runtime | `rig/{face}/standard/left_eye/pos/x` | includes face identity because the runtime is writing into one specific face's control tree |
| deployment slot name | short operator-facing slot discovered from the endpoint | `standard/vizij/left_eye/pos/x` | the standalone bridge normalizes this external slot name into the runtime path it writes internally |
| namespaced observer key | runtime snapshot key in a shared orchestrator | `{namespace}/rig/{face}/standard/left_eye/pos/x` | shared orchestrator inspection can prefix the runtime path with namespace for observation and diagnostics |

If you are debugging the runtime itself, think in full runtime paths.

If you are driving `vizij-standalone`, copy the discovered slot name from the endpoint and let the bridge map it back into the internal runtime path.

## Standard Control Path Shape

The common standard-control shape is:

```text
rig/{face}/standard/{channel}/{track}/{attribute}
```

Examples:

1. `rig/{face}/standard/left_eye/pos/x`
2. `rig/{face}/standard/right_eye/pos/y`

In practice, these paths are useful when you want reusable, face-legible controls such as gaze and other common rig channels.

## Pose Weight Path Shape

The common pose-weight shape is:

```text
rig/{face}/poses/{pose_slug}.weight
```

Examples:

1. `rig/{face}/poses/smile.weight`
2. `rig/{face}/poses/surprised.weight`

These are useful when you want named facial states or authored expressions that can be triggered or blended.

## Viseme Weight Path Shape

Another common category is visemes:

```text
rig/{face}/visemes/{viseme_id}.weight
```

This matters later when speech or live conversation is involved, but the path idea is the same: named behavior mapped to a stable runtime address.

## Current Control-Family Inventory

At the route level, expect three face-facing runtime path families plus one external deployment alias:

| Family | Runtime shape or external alias | Best used for | Common write sources | Do not collapse it into |
| --- | --- | --- | --- | --- |
| `standard control path` | `rig/{face}/standard/{channel}/{track}/{attribute}` | reusable rig-facing channels such as gaze, jaw, and brows | hooks, sliders, operator clients, procedural outputs | a pose-weight path |
| `pose-weight path` | `rig/{face}/poses/{pose_slug}.weight` | authored named expression blending | hotkeys, pose panels, animation tracks, procedural outputs | a lower-level standard channel |
| `viseme weight path` | `rig/{face}/visemes/{viseme_id}.weight` | speech-shaped mouth behavior | speech controllers, live-agent surfaces, animation tracks | a generic pose-weight path |
| `deployment slot name` | `standard/vizij/...` | external operator-facing writes through `vizij-standalone` | standalone clients and web control panels | the full internal runtime path |

Two rules keep this inventory readable:

1. animation tracks and procedural programs are common write sources, not separate face-facing path families by themselves,
2. deployment slot names are external aliases that the bridge maps back into internal runtime paths.

## Visible Interaction vs Runtime Meaning

In `Hello Face`, the mouse interaction is teaching standard control paths through eye movement.

The hotkeys are teaching pose-weight paths through visible expression changes.

That difference matters:

1. a standard path often represents a reusable channel like eye position,
2. a pose-weight path represents the strength of a named authored pose,
3. both are runtime writes, but they describe different kinds of behavior.

## Where These Paths Show Up

You will see these ideas repeated across Vizij:

1. in `tutorial-fullscreen-face` runtime hooks,
2. in `vizij-authoring` when inspecting or organizing controls,
3. in player and deployment surfaces that send or receive typed values,
4. in operator and deployment surfaces where the face must be controlled predictably.

## Good Questions To Ask When Reading a Path

1. Is this path meant to be standard and reusable across faces?
2. Is this a named pose or a lower-level continuous control?
3. Does this path describe a visible movement, an expression state, or speech-related behavior?
4. Would this path make sense to expose in a simple UI, or is it more diagnostic or advanced?

## Current Useful Visual

### Path Anatomy

Understanding the segments of a path helps you navigate any Vizij face:

<pre class="guidebook-mermaid mermaid">
flowchart LR
    p[&quot;rig / {face} / {category} / {channel} / {track} / {attribute}&quot;]
    
    subgraph Anatomy [&quot;Path Segments&quot;]
        direction LR
        cat[&quot;Category\n(standard/poses)&quot;]
        chan[&quot;Channel\n(left_eye/smile)&quot;]
        track[&quot;Track\n(pos/weight)&quot;]
        attr[&quot;Attribute\n(x/y/z)&quot;]
    end
    
    p --- Anatomy
</pre>

The best wave-1 visual is still the existing `tutorial-fullscreen-face` screenshot plus the code in:

1. `apps/tutorial-fullscreen-face/src/hooks/useMouseGaze.ts`
2. `apps/tutorial-fullscreen-face/src/hooks/usePoseHotkeys.ts`

Those anchors remain the clearest current proof surface for this path vocabulary.

## Recommended Next Steps

1. If you want the smallest runtime shell after understanding the path model, read [Minimal Web Player](/tutorials/minimal-player/).
2. If you want to understand how runtime meaning changes by control family, continue to [Runtime Inputs and Semantics](/docs/renderer-data-model/).
3. If you want to make the face your own instead, branch later into the `Customize` bucket.
4. If you are already thinking about operator-facing slots, jump to [Operator and Deployment Model](/docs/deployment-model/).
