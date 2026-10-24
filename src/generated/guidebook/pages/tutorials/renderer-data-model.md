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
  differs, and connect each visible interaction to the code that drives it.
prerequisites:
  - "Run this from the vizij-web root:"
successCheck:
  - holding an expression key visibly fades an expression in and out
  - a viseme key visibly moves the mouth
  - you can explain the difference between writing a standard control and
    calling a method
  - you can point to the hook that does both
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
cd path/to/vizij-web
pnpm run dev:tutorial-fullscreen-face
```

Open the local Vite URL if it is not already open.

This page assumes you already completed [Hello Face Quickstart](/tutorials/hello-face/) and have the face rendering locally.

## The Two Control Patterns You Are Learning

This app teaches two useful control ideas immediately:

1. a held expression: a key fades one of the face standard's expression weights in, and back out on release
2. a played viseme: a key calls one of the face's methods, which plays a mouth shape once

Both drive the face through its own API. One writes a key the app owns for as long as the key is held; the other asks the face to do something over time, and the face writes the keys itself.

Quick term bridge before you continue:

1. `standard control` means a key of the Vizij face standard, such as `standard/vizij/expression/happy`, the same on every face.
2. `method` means a function the face's device declares, such as `play_viseme`, called by name with `runtime.invoke(...)`.
3. `path` means the runtime address a write lands on, not the visible UI widget itself.

## What This Page Is Not Proving Yet

This page proves that the runtime can accept different kinds of control.

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
2. the loading bar over the face is gone
3. moving the pointer over the page shows the key hints

Why this matters:

1. the hotkeys bind only once the provider reports the face `ready`
2. the hints list the keys the app bound, so their presence proves the face's profile was read
3. a visible face is not automatically a ready control surface

If you are not confident the app is healthy yet, go back to [Hello Face Quickstart](/tutorials/hello-face/) or check [Validation Checkpoints](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/validation-checkpoints.md).

### 2. Hold an expression key

Hold one of the expression keys (`1`–`0`, `Q`–`P`, `A`–`J`), then release it.

Expected result:

1. the expression fades in over about two seconds while the key is held
2. it fades back out over the same time once released
3. repeated presses work consistently

Open:

1. `vizij-web/apps/tutorial-fullscreen-face/src/hooks/useFaceHotkeys.ts`

What to look for:

1. the hook reads the face standard's profile, `vizij-face`, and binds its expressions in the profile's order
2. a key press tweens `runtime.path("standard/vizij/expression/<name>")` to 0.75 with `animateValue(...)`, and the release tweens it back to 0
3. the write targets the standard's key, not one of this face's own poses: the face's standard adaptation maps it onto Quori's poses

The important mental model is simple: the app owns the expression's weight, and a tween writes it once per frame.

### 3. Press a viseme key

Press one of the viseme keys (`K`, `L`, `Z`–`M`). They play the first nine of the standard's 15 visemes, `sil` to `nn`; the other six have no key.

Expected result:

1. the mouth takes the shape once, then returns
2. holding the key does not hold the shape
3. repeated presses replay it

What to look for in the same hook:

1. a key press calls `runtime.invoke("play_viseme", { shape, weight })`
2. the face's viseme player writes the standard's viseme keys (`standard/vizij/viseme/<shape>`) through its lipsync envelope, so the app writes no viseme key itself
3. the release does nothing: a viseme is played, not held

The mental model here is different: a key press asks the face to play something, and the face owns the keys it writes while it plays.

### 4. Compare the two control styles directly

Use this comparison while the app is open:

| Interaction | What you do | What changes visibly | Runtime meaning |
| --- | --- | --- | --- |
| Expression key | hold and release a key | an expression fades in and out | the app tweens a key of the face standard |
| Viseme key | press a key | the mouth takes one shape | the app calls a method; the face writes the viseme keys |

This is the first important control lesson in Vizij:

1. not every control is the same kind of write
2. writing a key and calling a method are both valid, but they solve different problems
3. later pages explain the path grammar and semantics behind these interactions

With `?autoplay` added to the URL, the face's own program also runs from load and moves the face between your key presses: a third writer, which the app commands through the keys the program reads.

### 5. Inspect the code shape that makes both patterns work

You have already seen the behavior in the browser. Now connect it to the runtime API surface:

1. `useFaceHotkeys.ts` uses `useAnimateValue()` for the held expressions
2. the same hook calls `runtime.invoke("play_viseme", …)` for the visemes
3. both depend on the same `VizijRuntimeProvider` and `useVizijRuntime()` foundation from `FaceApp.tsx`

That common foundation matters. Vizij control is not a pile of unrelated tricks. The runtime stays consistent while the control semantics change.

## What You Should Be Able To Say Now

By the end of this page, the correct short explanation is:

1. an expression key is a held write to a standard control
2. a viseme key is a method call the face plays out over time
3. both go through the face's runtime API
4. they differ because one writes a key and the other asks the face to write keys

## Fast Recovery If It Fails

Use these shortcuts:

1. if the face is visible but no hints show, compare the current app state with [Hello Face Quickstart](/tutorials/hello-face/)
2. if hotkeys do nothing, verify the app finished loading before testing
3. if you need a route-level definition of healthy behavior, use [Validation Checkpoints](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/validation-checkpoints.md)
4. if the runtime reaches an error state, use [Troubleshooting Matrix](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/troubleshooting-matrix.md)

## Recommended Next Steps

Continue to [Paths and Standard Controls](/docs/rigging-and-control-model/).

That page names the path vocabulary underneath the expression and viseme interactions you just used.

Use these branch points after that:

1. If you want to stay on the fast route toward embedding, continue later to [Minimal Web Player](/tutorials/minimal-player/).
2. If you want to start owning the face after the control model is clear, branch to [Tweak an Existing Face](/tutorials/authoring/).
