---
pageId: tutorials-renderer-data-model
moduleId: tutorials/renderer-data-model
sourceModuleId: control/first-control-interactions
sourcePath: control/first-control-interactions.md
surface: tutorials
publish: true
routeSlug: renderer-data-model
canonicalPath: /tutorials/renderer-data-model/
routeRole: walkthrough
routeRoleLabel: Control lab
title: Renderer Data Model
summary: Use the first maintained runtime interactions to make path writes,
  cause and effect, and visible control semantics concrete.
moduleType: walkthrough
bucket: Control
depth: Surface
hubGroup: foundations
order: 20
redirects:
  - first-control-interactions
outcome: After this page, you should be able to use the maintained fullscreen
  tutorial to trigger two different kinds of control, explain how their behavior
  differs, and connect each visible interaction to the code that stages it.
prerequisites:
  - "Run this from the vizij-web root:"
successCheck:
  - mouse movement visibly steers gaze
  - number keys visibly animate authored facial states
  - you can explain the difference between continuous standard-input control and
    discrete pose-weight control
  - you can point to the two hooks that stage those writes
headings:
  - depth: 2
    slug: starting-state
    text: Starting State
  - depth: 2
    slug: the-two-control-patterns-you-are-learning
    text: The Two Control Patterns You Are Learning
  - depth: 2
    slug: what-this-page-is-not-proving-yet
    text: What This Page Is Not Proving Yet
  - depth: 2
    slug: walkthrough
    text: Walkthrough
  - depth: 2
    slug: what-you-should-be-able-to-say-now
    text: What You Should Be Able To Say Now
  - depth: 2
    slug: fast-recovery-if-it-fails
    text: Fast Recovery If It Fails
  - depth: 2
    slug: recommended-next-steps
    text: Recommended Next Steps
context:
  bucketChain: "Previous: Experience Current: Control Next: Customize on the
    customization route or Integrate on the fast route"
  depthLadder: "Above: none, this is the entry depth in this bucket Current:
    Surface Below: Paths and Standard Controls, Runtime Inputs and Semantics,
    Control Surfaces and Configuration Layers, Orchestration and Diagnostics"
  modulePosition: "Previous in bucket: start at Control Current module: First
    Control Interactions Next in bucket: Paths and Standard Controls"
  moduleType: walkthrough
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
  label: Hello Face
  href: /tutorials/hello-face/
  description: Return to the first maintained runtime proof.
next:
  label: Authoring
  href: /tutorials/authoring/
  description: Move from using a working face to changing one.
implementationAnchors:
  - label: Control bucket reference
    href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/control/README.md
    description: The maintained control route behind the first public interactions.
demoLinks:
  - label: Rig controls demo
    href: /demos/#controls
    description: Compare the guided interaction path with the public demo slice.
labId: first-controls
hasMermaid: false
---

## Starting State

Run this from the `vizij-web` root:

```bash
cd /home/chris/Code/Semio/vizij_ws/vizij-web
pnpm run dev:tutorial-fullscreen-face
```

Open the local Vite URL if it is not already open.

This page assumes you already completed [Hello Face Quickstart](/tutorials/hello-face/) and have the face rendering locally.

## The Two Control Patterns You Are Learning

This app teaches two useful control ideas immediately:

1. continuous standard-input control through mouse gaze
2. discrete authored-state control through pose hotkeys

Both are real runtime writes. They just write into different parts of the runtime model.

Quick term bridge before you continue:

1. `standard control` means a reusable runtime channel such as eye position.
2. `pose weight` means the current strength of a named authored state such as `happy` or `surprise`.
3. `path` means the runtime address the hook writes, not the visible UI widget itself.

## What This Page Is Not Proving Yet

This page proves that the runtime can accept and apply different kinds of control writes.

It does not yet prove:

1. that you have an application integration shell,
2. that you have authored new behavior,
3. that you have a deployment endpoint,
4. that every control category in Vizij behaves the same way.

## Walkthrough

### 1. Confirm runtime readiness before testing control

Do not test control while the app is still loading.

Wait until:

1. the face is fully visible
2. there is no loading or initialization message blocking the view
3. repeated mouse movement produces consistent eye motion

Why this matters:

1. `tutorial-fullscreen-face` stages a neutral pose baseline when the runtime becomes ready
2. the interaction hooks only make sense after the provider has loaded the face and registered the runtime state
3. a visible face is not automatically a ready control surface

If you are not confident the app is healthy yet, go back to [Hello Face Quickstart](/tutorials/hello-face/) or check [Validation Checkpoints](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/validation-checkpoints.md).

### 2. Use mouse gaze as a continuous control

Move the pointer across the viewport and watch the eyes respond.

Expected result:

1. eye movement changes smoothly as the pointer moves
2. the interaction feels continuous rather than one-shot
3. the face returns toward neutral when the pointer stops driving gaze

Open:

1. `vizij-web/apps/tutorial-fullscreen-face/src/hooks/useMouseGaze.ts`

What to look for:

1. pointer position is normalized into a reusable value range
2. the hook calls runtime input staging rather than mutating the canvas directly
3. the control paths target the face's standard eye-position channels

The important mental model is simple: mouse movement becomes a stream of runtime input values.

### 3. Use pose hotkeys as a discrete authored-state control

Press the number keys shown by the app.

Expected result:

1. a visible face pose or expression animates in
2. releasing the key lets the pose animate back out
3. repeated key presses work consistently

Open:

1. `vizij-web/apps/tutorial-fullscreen-face/src/hooks/usePoseHotkeys.ts`

What to look for:

1. the hook derives pose-weight paths from the loaded pose config
2. it uses runtime helpers such as `buildPoseWeightPathMap()` and `animateValue(...)`
3. the interaction is based on named authored states, not direct eye-position steering

The mental model here is different: a key press selects one authored state and animates its weight.

### 4. Compare the two control styles directly

Use this comparison while the app is open:

| Interaction | What you do | What changes visibly | Runtime meaning |
| --- | --- | --- | --- |
| Mouse gaze | move the pointer | eyes track continuously | writes standardized eye-position inputs |
| Pose hotkeys | press and release a number key | expression or pose weight animates in and out | writes authored pose-weight values |

This is the first important control lesson in Vizij:

1. not every control write is the same kind of write
2. standardized channels and authored pose weights are both valid, but they solve different problems
3. later pages explain the path grammar and semantics behind these interactions

### 5. Inspect the code shape that makes both patterns work

You have already seen the behavior in the browser. Now connect it to the runtime API surface:

1. `useMouseGaze.ts` uses runtime input staging for continuous steering
2. `usePoseHotkeys.ts` uses runtime animation helpers for temporary pose blends
3. both hooks depend on the same `VizijRuntimeProvider` and `useVizijRuntime()` foundation from `FaceApp.tsx`

That common foundation matters. Vizij control is not a pile of unrelated tricks. The runtime stays consistent while the control semantics change.

## What You Should Be Able To Say Now

By the end of this page, the correct short explanation is:

1. mouse gaze is a continuous standard-control example
2. hotkeys are a discrete pose-weight example
3. both go through runtime APIs
4. they differ because they write to different semantic control surfaces

## Fast Recovery If It Fails

Use these shortcuts:

1. if the face is visible but gaze does not move, compare the current app state with [Hello Face Quickstart](/tutorials/hello-face/)
2. if hotkeys do nothing, verify the app finished loading before testing
3. if you need a route-level definition of healthy behavior, use [Validation Checkpoints](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/validation-checkpoints.md)
4. if the runtime reaches an error state, use [Troubleshooting Matrix](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/troubleshooting-matrix.md)

## Recommended Next Steps

Continue to [Paths and Standard Controls](/docs/rigging-and-control-model/).

That page names the path vocabulary underneath the gaze and pose interactions you just used.

Use these branch points after that:

1. If you want to stay on the fast route toward embedding, continue later to [Minimal Web Player](/tutorials/minimal-player/).
2. If you want to start owning the face after the control model is clear, branch to [Tweak an Existing Face](/tutorials/authoring/).
