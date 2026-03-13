---
pageId: docs-animation-model
moduleId: docs/animation-model
sourceModuleId: customize/animations
sourcePath: customize/animations.md
surface: docs
publish: true
routeSlug: animation-model
canonicalPath: /docs/animation-model/
routeRole: model
routeRoleLabel: Motion system
title: Animation Model
summary: Understand how animation authoring fits the guidebook route before you
  move into runtime playback and richer motion behavior.
moduleType: concept page
bucket: Customize
depth: Fundamentals
hubGroup: integration-and-delivery
order: 50
redirects: []
outcome: After this page, you should be able to explain what an animation is in
  Vizij, what a clip, track, and keyframe mean in the current authoring model,
  and how playback state and transport help you preview authored motion before
  export.
prerequisites:
  - Rigging
  - Poses
  - Customization Concepts Primer
successCheck:
  - you can explain the difference between a clip, a track, and a keyframe,
  - you can explain why an animation is not the same thing as a pose,
  - you can explain what playing, paused, and stopped describe,
  - you can explain why transport is a preview/control layer rather than the
    authored content itself,
  - you can explain why animation authoring belongs before export in the
    customization path.
headings:
  - depth: 2
    slug: module-notes
    text: Module Notes
  - depth: 2
    slug: what-you-need
    text: What You Need
  - depth: 2
    slug: what-animation-means-in-vizij
    text: What Animation Means In Vizij
  - depth: 2
    slug: poses-versus-animations
    text: Poses Versus Animations
  - depth: 2
    slug: clips-tracks-and-keyframes
    text: Clips, Tracks, and Keyframes
  - depth: 2
    slug: what-playback-state-and-transport-mean
    text: What Playback State And Transport Mean
  - depth: 2
    slug: how-authoring-preview-connects-to-runtime-transport
    text: How Authoring Preview Connects To Runtime Transport
  - depth: 2
    slug: what-readers-actually-do-in-the-current-app
    text: What Readers Actually Do In The Current App
  - depth: 2
    slug: a-useful-mental-model
    text: A Useful Mental Model
  - depth: 2
    slug: choose-animation-when
    text: Choose Animation When...
  - depth: 2
    slug: recommended-next-steps
    text: Recommended Next Steps
context:
  bucketChain: "Previous: Control Current: Customize Next: Integrate"
  depthLadder: "Above: Tweak an Existing Face Current: Fundamentals Below: Deep
    Custom Pipeline"
  modulePosition: "Previous in bucket: Poses Current module: Animations Next in
    bucket: Procedural Programs"
  moduleType: concept page
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
  label: Rigging and Control Model
  href: /docs/rigging-and-control-model/
  description: Return to the rig and control vocabulary.
next:
  label: Deployment Model
  href: /docs/deployment-model/
  description: Continue into operator-facing delivery guidance.
implementationAnchors:
  - label: Animation, integration, and deployment reference
    href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/reference/animation-integration-and-deployment-reference.md
    description: Reference bridge for later-stage motion and delivery work.
demoLinks:
  - label: Voice demo
    href: /demos/#voice
    description: Compare authored motion concepts with the public speech/viseme
      behavior slice.
hasMermaid: true
---

## Module Notes

- Read this after [Rigging](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/rigging.md) and [Poses](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/poses.md) when you need authored motion instead of named static states.
- The page stays on the animation layer inside `vizij-authoring`: clips, tracks, keyframes, and transport preview, so readers can keep animation separate from poses, procedural logic, and runtime playback controls.
- Export packaging and runtime selection belong later in the route.

## What You Need

It helps if you have already read:

1. [Rigging](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/rigging.md)
2. [Poses](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/poses.md)
3. [Customization Concepts Primer](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/introduction/customization-concepts-primer.md)

From `vizij-web`:

```bash
pnpm run dev:vizij-authoring
```

You do not need to understand export packaging or runtime embedding details yet.

## What Animation Means In Vizij

In Vizij, an animation is an authored clip of motion over time.

A clip answers questions that a pose does not:

1. which controls change,
2. when they change,
3. how long the motion lasts,
4. how values interpolate between authored moments.

The current authoring model represents this as an `AnimationClipIR` with:

1. a stable clip id,
2. an optional display name,
3. a duration,
4. one or more tracks,
5. clip metadata.

That is why animation authoring belongs after rigging and poses. It assumes there are already meaningful controls to animate.

## Poses Versus Animations

Keep this distinction sharp:

1. a pose is a named state,
2. an animation is a timed path through changing states.

A pose can describe `smile` or `blink` as a reusable state.

An animation can describe:

1. the face easing into a smile,
2. a blink happening quickly and then clearing,
3. a longer expression sequence across several seconds.

So poses answer "what state do I want?"

Animations answer "how does the face move through time?"

This page does not treat poses as obsolete. In current Vizij authoring, poses and animations are neighboring layers with different jobs.

## Clips, Tracks, and Keyframes

<pre class="guidebook-mermaid mermaid">
flowchart TD
    clip[&quot;Clip\n(id, name, duration)&quot;] --&gt; trackA[&quot;Track A\n(one targeted control path)&quot;]
    clip --&gt; trackB[&quot;Track B\n(one targeted control path)&quot;]
    trackA --&gt; keyA1[&quot;Keyframe\n(time + value)&quot;]
    trackA --&gt; keyA2[&quot;Keyframe\n(time + value)&quot;]
    trackB --&gt; keyB1[&quot;Keyframe\n(time + value)&quot;]
    clip --&gt; transport[&quot;Transport\n(play / pause / stop / seek / loop)&quot;]
</pre>

The authoring UI and store separate animation into a few learner-friendly parts.

### Clip

A clip is the whole authored animation unit.

In the current app, a clip has:

1. an id,
2. a name,
3. a duration in seconds,
4. a set of tracks.

The app supports both authored clips and imported clips. The inspector explicitly labels animation targets as `authored` or `imported`, which matters because you may be editing a locally authored timeline or inspecting animation that came in with a loaded bundle.

### Track

A track is the time-based history for one targeted control path.

In current implementation, each track stores:

1. a stable track id,
2. a `variableId`,
3. a resolved channel path,
4. interpolation mode,
5. a sequence of keyframes.

The practical meaning is simple: one track usually owns one thing you want to animate over time. The Animation panel builds tracks from visible, editable, selectable inputs, so the timeline stays tied to real authoring controls rather than loose labels.

### Keyframe

A keyframe is an authored value at a specific time.

Each keyframe stores at least:

1. an id,
2. a time,
3. a value,
4. optional interpolation override,
5. optional tangents for cubic shaping.

You can think of a keyframe as "at this moment, this control should be here."

The compiler then normalizes keyframes so the clip is deterministic:

1. times are clamped into clip duration,
2. interpolation values are normalized,
3. duplicate times are resolved predictably,
4. output channels are normalized to runtime-facing paths.

## What Playback State And Transport Mean

The playback controls in authoring are not the animation definition itself. They are the transport used to inspect and preview it.

Current animation transport state includes:

1. `playing`,
2. `paused`,
3. `stopped`.

The authoring app also tracks:

1. current time,
2. duration,
3. loop on or off,
4. play speed,
5. whether runtime transport is currently bound.

That means transport answers operational questions such as:

1. are we previewing right now,
2. where is the playback head,
3. should the clip loop,
4. should playback run faster or slower.

It does not answer the authored content question of what the clip contains. That comes from the tracks and keyframes.

## How Authoring Preview Connects To Runtime Transport

Current `vizij-authoring` does more than scrub values locally.

The animation transport hook can turn the authored timeline into a runtime animation asset, merge it with inherited bundle animations, and bind play, pause, stop, seek, and loop controls to the runtime preview surface.

That is useful for a learner because it explains why the playback controls matter:

1. they preview the authored motion against the actual runtime path,
2. they let authored and imported clips be inspected through the same playback model,
3. they surface real playback state instead of a fake editor-only timer.

This page still stays in `Customize` scope. You do not need to learn runtime integration details here. The important point is only that authoring preview is connected to the real playback path the system already knows how to consume later.

## What Readers Actually Do In The Current App

Current animation anchors:

<figure class="guidebook-media">
<img src="/guidebook-assets/gifs/authoring-animation-creation.gif" alt="Animation Creation" loading="lazy" />
<figcaption>authoring a clip by creating timeline content, not just previewing an existing asset.</figcaption>
</figure>

<figure class="guidebook-media">
<img src="/guidebook-assets/gifs/authoring-animation-player.gif" alt="Animation Player" loading="lazy" />
<figcaption>transport controls driving playback and preview over the authored timeline.</figcaption>
</figure>

These two loops are the strongest current teaching evidence for this page:

1. the creation capture shows clips, tracks, and keyframe editing as authored timeline work,
2. the player capture shows transport behavior in motion, including preview, pause, and clip playback inside the maintained authoring surface.

In the current authoring surface, animation work usually looks like this:

1. choose or create an animation clip,
2. set its duration,
3. add tracks for the visible inputs you want to animate,
4. place or adjust keyframes over time,
5. use play, pause, stop, seek, loop, step, and speed controls to preview the result,
6. inspect clip and track details in the inspector.

The inspector can show details such as:

1. clip name,
2. source as authored or imported,
3. duration,
4. track count,
5. track labels and channels.

That is enough for a reader to understand animation as an authored artifact rather than only a moving preview.

## A Useful Mental Model

Use this stack when you need to reason clearly:

1. rigging defines what can be driven,
2. poses define meaningful named states,
3. animations define how targeted values change over time,
4. transport lets you preview and inspect that motion,
5. export later packages the authored result for downstream use.

## Choose Animation When...

Use animation first when:

1. the behavior has a deliberate duration or beat,
2. the same motion should replay predictably,
3. the author needs clip, track, and transport control.

Do not use animation first when:

1. you only need a reusable named expression state; start with [Poses](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/poses.md),
2. the behavior should be computed continuously from live input; start with [Procedural Programs](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/procedural-programs.md).

If you keep that order clear, the Customize route stays teachable.

## Recommended Next Steps

If you want to understand what artifact leaves authoring after rigging, poses, and animations are in place, continue to [Export](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/customize/export.md).
