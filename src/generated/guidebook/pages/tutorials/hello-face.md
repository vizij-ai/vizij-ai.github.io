---
pageId: tutorials-hello-face
moduleId: tutorials/hello-face
sourceModuleId: experience/hello-face-quickstart
sourcePath: experience/hello-face-quickstart.md
surface: tutorials
publish: true
routeSlug: hello-face
canonicalPath: /tutorials/hello-face/
routeRole: walkthrough
routeRoleLabel: First visible win
title: Hello Face
summary: Launch the smallest maintained Vizij runtime app, prove the face is
  live, and connect the visible behavior back to the runtime skeleton.
moduleType: walkthrough
bucket: Experience
depth: Surface
hubGroup: foundations
order: 10
redirects:
  - hello-face-quickstart
outcome: After this page, you should be able to launch the maintained Hello Face
  app, confirm that the runtime is actually live, trigger visible behavior with
  the mouse and keyboard, and point to the small runtime skeleton that makes the
  app work.
prerequisites:
  - "Install dependencies once:"
  - "Use the vizij-web workspace root:"
successCheck:
  - tutorial-fullscreen-face runs locally
  - the face renders and reaches a stable ready state
  - mouse movement changes gaze and number keys trigger visible pose changes
  - you can point to the asset bundle, provider, and interaction hooks in code
headings:
  - depth: 2
    slug: starting-state
    text: Starting State
  - depth: 2
    slug: what-you-need
    text: What You Need
  - depth: 2
    slug: quick-term-bridge
    text: Quick term bridge
  - depth: 2
    slug: what-success-looks-like-up-front
    text: What Success Looks Like Up Front
  - depth: 2
    slug: walkthrough
    text: Walkthrough
  - depth: 2
    slug: why-this-page-matters
    text: Why This Page Matters
  - depth: 2
    slug: what-this-page-is-not-proving-yet
    text: What This Page Is Not Proving Yet
  - depth: 2
    slug: choose-your-next-route
    text: Choose Your Next Route
  - depth: 2
    slug: fast-recovery-if-it-fails
    text: Fast Recovery If It Fails
  - depth: 2
    slug: recommended-next-steps
    text: Recommended Next Steps
context:
  bucketChain: "Previous: Introduction Current: Experience Next: Control"
  depthLadder: "Above: none, this is the entry depth in this bucket Current:
    Surface Below: Existing Asset Sandbox, Sample Asset Exploration"
  modulePosition: "Previous in bucket: start at Experience Current module: Hello
    Face Quickstart Next in bucket: Richer Interactive Example"
  moduleType: walkthrough
  bucketOverview:
    label: Experience
    href: /tutorials/
  referenceBridges:
    - label: Runtime Quickstart Reference
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/reference/runtime-quickstart-reference.md
    - label: Validation Checkpoints
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/validation-checkpoints.md
    - label: Troubleshooting Matrix
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/troubleshooting-matrix.md
prev:
  label: Getting Started
  href: /docs/getting-started/
  description: Choose the route before you run the first app.
next:
  label: Renderer Data Model
  href: /tutorials/renderer-data-model/
  description: Use the same maintained surface to slow down and inspect the first
    interactions.
implementationAnchors:
  - label: tutorial-fullscreen-face
    href: https://github.com/vizij-ai/vizij-web/tree/main/apps/tutorial-fullscreen-face
    description: Smallest maintained runtime app behind the first public success.
demoLinks:
  - label: Public demos
    href: /demos/
    description: Compare the guided quickstart with the broader runtime showcase.
labId: hello-face
hasMermaid: false
---

## Starting State

Use the `vizij-web` workspace root:

```bash
cd /home/chris/Code/Semio/vizij_ws/vizij-web
```

This walkthrough uses `apps/tutorial-fullscreen-face`, which is the smallest maintained Vizij runtime app in the workspace.

## What You Need

Install dependencies once:

```bash
pnpm install
```

Start the tutorial app:

```bash
pnpm run dev:tutorial-fullscreen-face
```

Open the local Vite URL that appears in the terminal.

## Quick term bridge

Keep these four labels distinct while you work through the first run:

| Term | What it means on this page | What it does not mean yet |
| --- | --- | --- |
| `face artifact` | the bundled sample face being loaded | your own authored face |
| `runtime bundle` | the app-facing bundle handed to `VizijRuntimeProvider` | the whole application shell |
| `app shell` | the tutorial app that hosts the face and hooks | a deployed operator endpoint |
| `deployment endpoint` | a later `Deploy` concern with an exposed control path | this first-run tutorial surface |

## What Success Looks Like Up Front

Before you inspect any code, know what a healthy first run should look like:

1. the page opens without a blank canvas or crash
2. the face becomes visible after loading finishes
3. moving the mouse changes eye gaze
4. pressing the number keys changes visible facial poses

If the face never appears, stop and use [Validation Checkpoints](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/validation-checkpoints.md) or [Troubleshooting Matrix](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/troubleshooting-matrix.md) before continuing.

## Walkthrough

### 1. Launch the maintained runtime tutorial

From `vizij-web`, run:

```bash
pnpm run dev:tutorial-fullscreen-face
```

When the browser opens, wait for the face to settle into its ready state.

Expected result:

1. you may briefly see a loading or initialization message
2. the face appears centered on screen
3. the app stops looking transitional and starts behaving like a live face surface

Current visual anchor:

<figure class="guidebook-media">
<img src="/guidebook-assets/screenshots/tutorial-fullscreen-face.png" alt="Tutorial Fullscreen Face" loading="lazy" />
<figcaption>the settled ready-state view of the smallest maintained runtime tutorial.</figcaption>
</figure>

Use this still to confirm the baseline face state before you test motion or hotkey-driven changes.

### 2. Prove that the face is live, not static

Do two checks immediately:

1. move the mouse across the viewport and watch the eyes follow
2. press the number keys and watch visible expression or pose changes trigger

Expected result:

1. gaze moves continuously with pointer movement
2. pose changes feel discrete and key-driven
3. repeated interactions continue working, which proves the runtime is actively staging inputs rather than showing a prerecorded asset

This is the first useful Vizij confidence test. A rendered face is not enough. The face has to respond.

Motion anchor:

<figure class="guidebook-media">
<img src="/guidebook-assets/gifs/fullscreen-demo.gif" alt="Fullscreen Demo Motion" loading="lazy" />
<figcaption>live gaze steering and hotkey-triggered pose changes proving that the face is not static.</figcaption>
</figure>

The still screenshot above proves the settled ready state. This loop is the stronger proof that the surface is live: gaze keeps steering and hotkey-triggered expressions come and go through the runtime.

### 3. Inspect the runtime skeleton in code

Open these files:

1. `vizij-web/apps/tutorial-fullscreen-face/src/FaceApp.tsx`
2. `vizij-web/apps/tutorial-fullscreen-face/src/hooks/useMouseGaze.ts`
3. `vizij-web/apps/tutorial-fullscreen-face/src/hooks/usePoseHotkeys.ts`

In `FaceApp.tsx`, find the three pieces that define the app:

```tsx
const assetBundle: VizijAssetBundle = {
  namespace: "fullscreen-face",
  glb: {
    kind: "url",
    src: faceAssetUrl,
    aggressiveImport: true,
  },
  pose: {
    stageNeutralFilter: (_id, path) => !path.includes("/color/"),
  },
};

export function FaceApp() {
  return (
    <VizijRuntimeProvider assetBundle={assetBundle} autostart>
      <VizijRuntimeHud />
      <FaceRuntime />
    </VizijRuntimeProvider>
  );
}
```

What each piece is doing:

1. `assetBundle` tells Vizij what face bundle to load
2. `VizijRuntimeProvider` owns loading, controller registration, and runtime state
3. `FaceRuntime` and `VizijRuntimeFace` render and control the resolved face

If you understand those three pieces, you understand the core shape of the maintained Hello Face path.

### 4. Connect the visible behavior to the maintained hooks

Open `useMouseGaze.ts` and `usePoseHotkeys.ts`.

You are looking for two different control patterns:

1. mouse gaze writes eye-position inputs continuously while the pointer moves
2. pose hotkeys animate named pose-weight paths up and back down

You do not need to memorize every line yet. You do need to notice that both behaviors are driven through runtime APIs, not through one-off DOM tricks.

Expected result:

1. the gaze hook explains why the eyes follow the mouse
2. the hotkey hook explains why number keys trigger expression changes
3. the code lines up cleanly with the behavior you already saw in the browser

### 5. Name the maintained runtime pattern

At this point, you should be able to say:

1. this app loads one existing face bundle
2. the runtime provider resolves the face and keeps track of readiness
3. small hooks stage real runtime input writes
4. the face is rendered by the same runtime stack other Vizij apps build on

That is the entire reason this app is the first maintained route through the guidebook.

## Why This Page Matters

`Hello Face` is not trying to teach all of Vizij.

It is trying to remove the first doubt:

1. can I run a real Vizij face locally
2. can I make it do something visible
3. can I find the code path that produced what I just saw

Once those are true, later control, integration, and deployment pages have something solid to build on.

## What This Page Is Not Proving Yet

This page proves a live runtime surface. It does not yet prove:

1. that you understand path semantics in detail,
2. that you have an application integration shell of your own,
3. that you have authored or customized the face,
4. that you have a deployment endpoint an operator can drive.

## Choose Your Next Route

The canonical next step is [First Control Interactions](/tutorials/renderer-data-model/).

Use one of these branch points after that:

| If your next goal is... | Open this next |
| --- | --- |
| understand the visible interactions before going deeper | [First Control Interactions](/tutorials/renderer-data-model/) |
| get to a player shell and keep the fast route | [Minimal Web Player](/tutorials/minimal-player/) after `Control` |
| start owning the face and its behavior | [Tweak an Existing Face](/tutorials/authoring/) after `Control` |

## Fast Recovery If It Fails

Use these shortcuts instead of guessing:

1. if dependencies are missing or stale, rerun `pnpm install`
2. if the page loads but the face never appears, use [Validation Checkpoints](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/validation-checkpoints.md)
3. if the face appears but does not respond, continue to [First Control Interactions](/tutorials/renderer-data-model/) and compare the expected behavior there
4. if the app shows an error state, use [Troubleshooting Matrix](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/troubleshooting-matrix.md)

## Recommended Next Steps

Continue to [First Control Interactions](/tutorials/renderer-data-model/).

That page uses the same app, but it slows down and explains what the two maintained interaction patterns are actually doing.
