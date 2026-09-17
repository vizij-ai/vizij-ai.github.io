<!-- tags: type=guidebook-assets; status=written; topics=guidebook,assets,screenshots,video -->

# Guidebook Assets

This folder is the canonical home for reusable media that supports the guidebook system after classification.

## Structure

1. `screenshots/`
   - reusable still images for concepts, workflows, and reference modules
2. `video/`
   - reusable clips or references for walkthrough support and page/media planning
3. `gifs/`
   - generated GIF derivatives of reusable guidebook videos for docs surfaces that need lightweight looping media

## Current Policy

1. Newly added backlog assets can remain in intake form until they are classified.
2. Reusable evergreen media should eventually be copied or linked into this guidebook asset system with clear ownership.
3. Event-only visuals should stay with the workshop or event packet rather than polluting evergreen media.
4. Large video files may require a storage decision before they are moved wholesale into the guidebook asset tree.

## Current Capture Map

### Screenshots

| Asset | Teaching job | Primary guidebook homes |
| --- | --- | --- |
| [tutorial-fullscreen-face.png](screenshots/tutorial-fullscreen-face.png) | smallest maintained first-contact proof | [Hello Face Quickstart](../experience/hello-face-quickstart.md), [Validation Checkpoints](../support/validation-checkpoints.md) |
| [fullscreen-demo.png](screenshots/fullscreen-demo.png) | same route with HUD and controls visible | [Existing Asset Sandbox](../experience/existing-asset-sandbox.md), [Media Intake and Usage Guide](../support/media-intake-and-usage-guide.md), [Troubleshooting Matrix](../support/troubleshooting-matrix.md) |
| [tutorial-agent-face.png](screenshots/tutorial-agent-face.png) | richer optional runtime shell | [Richer Interactive Example](../experience/richer-interactive-example.md), [Existing Asset Sandbox](../experience/existing-asset-sandbox.md), [Validation Checkpoints](../support/validation-checkpoints.md) |
| [vizij-authoring.png](screenshots/vizij-authoring.png) | empty-scene and preset-based authoring overview | [Tweak an Existing Face](../customize/tweak-an-existing-face.md), [Validation Checkpoints](../support/validation-checkpoints.md) |
| [authoring-loading-page.png](screenshots/authoring-loading-page.png) | import boundary and empty-scene recovery | [Import](../customize/import.md), [Troubleshooting Matrix](../support/troubleshooting-matrix.md) |
| [authoring-panel-face-elements.png](screenshots/authoring-panel-face-elements.png) | scene-tree inspection and authoring selection | [Tweak an Existing Face](../customize/tweak-an-existing-face.md), [Rigging](../customize/rigging.md), [Validation Checkpoints](../support/validation-checkpoints.md) |
| [authoring-inspector-face-elements.png](screenshots/authoring-inspector-face-elements.png) | editable face properties in the inspector | [Tweak an Existing Face](../customize/tweak-an-existing-face.md), [Rigging](../customize/rigging.md), [Validation Checkpoints](../support/validation-checkpoints.md) |
| [authoring-program-editor.png](screenshots/authoring-program-editor.png) | graph-structured procedural authoring | [Procedural Programs](../customize/procedural-programs.md) |
| [player-demo.png](screenshots/player-demo.png) | full bundle-first player shell | [Minimal Web Player](../integrate/minimal-web-player.md), [Media Intake and Usage Guide](../support/media-intake-and-usage-guide.md), [Validation Checkpoints](../support/validation-checkpoints.md) |
| [player-demo-controls.png](screenshots/player-demo-controls.png) | visible pose, clip, program, and face-control surfaces | [Minimal Web Player](../integrate/minimal-web-player.md), [Media Intake and Usage Guide](../support/media-intake-and-usage-guide.md), [Troubleshooting Matrix](../support/troubleshooting-matrix.md) |
| [player-demo-details.png](screenshots/player-demo-details.png) | diagnostics, bundle summary, and surfaced runtime detail | [Minimal Web Player](../integrate/minimal-web-player.md), [Validation Checkpoints](../support/validation-checkpoints.md), [Troubleshooting Matrix](../support/troubleshooting-matrix.md) |

### Motion Clips

| GIF | Source video | Teaching job | Primary guidebook homes |
| --- | --- | --- | --- |
| [fullscreen-demo.gif](gifs/fullscreen-demo.gif) | [fullscreen-demo.mp4](video/fullscreen-demo.mp4) | prove that the minimal face surface is actually live | [Hello Face Quickstart](../experience/hello-face-quickstart.md) |
| [authoring-loading.gif](gifs/authoring-loading.gif) | [authoring-loading.mp4](video/authoring-loading.mp4) | show import progressing from empty scene to trusted session | [Import](../customize/import.md), [Media Intake and Usage Guide](../support/media-intake-and-usage-guide.md) |
| [authoring-click-inspecting.gif](gifs/authoring-click-inspecting.gif) | [authoring-click-inspecting.mp4](video/authoring-click-inspecting.mp4) | selecting a face element and opening inspection | [Tweak an Existing Face](../customize/tweak-an-existing-face.md) |
| [authoring-face-element-inspecting.gif](gifs/authoring-face-element-inspecting.gif) | [authoring-face-element-inspecting.mp4](video/authoring-face-element-inspecting.mp4) | reinforce scene-element to inspector flow | [Tweak an Existing Face](../customize/tweak-an-existing-face.md) |
| [authoring-pose-creation-fast.gif](gifs/authoring-pose-creation-fast.gif) | [authoring-pose-creation-fast.mp4](video/authoring-pose-creation-fast.mp4) | capture a named authored pose | [Poses](../customize/poses.md) |
| [authoring-pose-editing.gif](gifs/authoring-pose-editing.gif) | [authoring-pose-editing.mp4](video/authoring-pose-editing.mp4) | refine a pose after creation | [Poses](../customize/poses.md) |
| [authoring-pose-blending.gif](gifs/authoring-pose-blending.gif) | [authoring-pose-blending.mp4](video/authoring-pose-blending.mp4) | show pose weights and blended state behavior | [Poses](../customize/poses.md) |
| [authoring-animation-creation.gif](gifs/authoring-animation-creation.gif) | [authoring-animation-creation.mp4](video/authoring-animation-creation.mp4) | author clips, tracks, and keyframes | [Animations](../customize/animations.md) |
| [authoring-animation-player.gif](gifs/authoring-animation-player.gif) | [authoring-animation-player.mp4](video/authoring-animation-player.mp4) | show scrubbing and playback transport in motion | [Animations](../customize/animations.md), [Media Intake and Usage Guide](../support/media-intake-and-usage-guide.md) |
| [authoring-inputs-control.gif](gifs/authoring-inputs-control.gif) | [authoring-inputs-control.mp4](video/authoring-inputs-control.mp4) | expose procedural input surfaces | [Procedural Programs](../customize/procedural-programs.md) |
| [authoring-input-controls-prt2.gif](gifs/authoring-input-controls-prt2.gif) | [authoring-input-controls-prt2.mp4](video/authoring-input-controls-prt2.mp4) | second procedural input/output view | [Procedural Programs](../customize/procedural-programs.md) |
| [authoring-program-editing.gif](gifs/authoring-program-editing.gif) | [authoring-program-editing.mp4](video/authoring-program-editing.mp4) | edit graph-driven behavior directly | [Procedural Programs](../customize/procedural-programs.md), [Media Intake and Usage Guide](../support/media-intake-and-usage-guide.md) |
| [authoring-reference-driver-copy.gif](gifs/authoring-reference-driver-copy.gif) | [authoring-reference-driver-copy.mp4](video/authoring-reference-driver-copy.mp4) | review-gated transfer from reference to main face | [Reference-Face Transfer](../customize/reference-face-transfer.md) |
| [authoring-mode-switches.gif](gifs/authoring-mode-switches.gif) | [authoring-mode-switches.mp4](video/authoring-mode-switches.mp4) | show deep customization crossing multiple authoring surfaces | [Deep Custom Pipeline](../customize/deep-custom-pipeline.md) |
| [authoring-input-driver-creation-buggy.gif](gifs/authoring-input-driver-creation-buggy.gif) | [authoring-input-driver-creation-buggy.mp4](video/authoring-input-driver-creation-buggy.mp4) | cautionary example of a non-evergreen intermediate capture | [Media Intake and Usage Guide](../support/media-intake-and-usage-guide.md) |

## Next Step

Classify the newly added asset drop into:

1. evergreen screenshots,
2. evergreen video,
3. generated GIF derivatives,
4. workshop-only media,
5. event-only media,
6. superseded or duplicate media.

## GIF Conversion

Run the repo-local converter to generate GIFs from the videos in this asset tree:

```bash
bash scripts/videos_to_gifs.sh
```

The script reads from `current_documentation/guidebook/assets/video/` and writes matching `.gif` files into `current_documentation/guidebook/assets/gifs/`. It requires `ffmpeg` to be installed and supports `--help` for overrides such as `--match`, `--fps`, `--width`, and `--force`.
