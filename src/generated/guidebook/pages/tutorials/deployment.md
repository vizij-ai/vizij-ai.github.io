---
pageId: tutorials-deployment
moduleId: tutorials/deployment
sourceModuleId: deploy/easiest-standalone-deployment
sourcePath: deploy/easiest-standalone-deployment.md
surface: tutorials
publish: true
routeSlug: deployment
canonicalPath: /tutorials/deployment/
routeRole: walkthrough
routeRoleLabel: Operator delivery
title: Deployment
summary: Launch the cleanest maintained standalone deployment path and treat
  operator handoff as part of the tutorial pathway, not an afterthought.
moduleType: walkthrough
bucket: Deploy
depth: Surface
hubGroup: runtime-and-deployment
order: 80
redirects:
  - easiest-standalone-deployment
outcome: After this page, you should be able to launch the maintained standalone
  runtime surface, load a face into it, confirm that its local control endpoint
  is alive, and explain why this counts as a deployment-shaped result rather
  than another local demo.
prerequisites:
  - "Use the vizij-web workspace root:"
successCheck:
  - vizij-standalone launches locally
  - you can load a face into it
  - you can name the default local control endpoint
  - you can confirm that a same-host operator path can drive the face
  - you can explain why this is a deployment endpoint instead of another
    tutorial app
headings:
  - depth: 2
    slug: starting-state
    text: Starting State
  - depth: 2
    slug: preflight
    text: Preflight
  - depth: 2
    slug: what-this-first-deployment-must-prove
    text: What This First Deployment Must Prove
  - depth: 2
    slug: walkthrough
    text: Walkthrough
  - depth: 2
    slug: persisting-speech-keys-with-env
    text: Persisting Speech Keys with .env
  - depth: 2
    slug: the-smallest-useful-operator-checklist
    text: The Smallest Useful Operator Checklist
  - depth: 2
    slug: pre-flight-and-post-flight-checklist
    text: Pre-Flight And Post-Flight Checklist
  - depth: 2
    slug: fast-recovery-if-it-fails
    text: Fast Recovery If It Fails
  - depth: 2
    slug: recommended-next-steps
    text: Recommended Next Steps
context:
  bucketChain: "Previous: Integrate Current: Deploy Next: End of guidebook route"
  depthLadder: "Above: none, this is the entry depth in this bucket Current:
    Surface Below: Operator and Deployment Model, Deployment Checks and
    Recovery, Hardware, ROS, and Multi-Screen Topologies"
  modulePosition: "Previous in bucket: start at Deploy Current module: Easiest
    Standalone Deployment Next in bucket: Operator and Deployment Model"
  moduleType: walkthrough
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
  label: Behind the Face
  href: /tutorials/behind-the-face/
  description: Return to the stack breakdown between authoring and deployment.
next:
  label: Deployment Model
  href: /docs/deployment-model/
  description: Return to the conceptual deployment framing.
implementationAnchors:
  - label: vizij-standalone
    href: https://github.com/vizij-ai/vizij-web/tree/main/apps/vizij-standalone
    description: Current operator-facing standalone surface.
demoLinks: []
hasMermaid: false
---

## Starting State

Use the `vizij-web` workspace root:

```bash
cd /home/chris/Code/Semio/vizij_ws/vizij-web
pnpm run dev:vizij-standalone
```

This walkthrough uses `apps/vizij-standalone`, the maintained desktop runtime shell for first deployment work.

## Preflight

Before you run the standalone path, confirm these assumptions:

1. `pnpm install` has already completed successfully in `vizij-web`,
2. your machine can already launch the Tauri dev shell for `vizij-standalone`,
3. you have one known-good bundled GLB available if you do not want to rely on the file picker,
4. if you plan to launch fullscreen on a specific monitor, you can inspect displays first from the app-local README.

If the desktop shell itself does not start, stop here and use [vizij-web/apps/vizij-standalone/README.md](/home/chris/Code/Semio/vizij_ws/vizij-web/apps/vizij-standalone/README.md) as the implementation authority before debugging runtime behavior.

## What This First Deployment Must Prove

For this route, deployment means more than `a face rendered`.

The standalone surface has to make these things true:

1. a face can be loaded into the runtime endpoint
2. runtime status is visible
3. a local control surface is exposed
4. an operator on the same host can connect and drive the face

That is the bar for a first believable deployment endpoint.

Current deployable floor:

`vizij-standalone` plus one same-host control path.

This page is not yet claiming LAN-first, ROS-first, or multi-device deployment as the maintained baseline.

## Walkthrough

### 1. Launch the standalone app in development

Run:

```bash
pnpm run dev:vizij-standalone
```

If the app starts without a face already loaded, use the file picker to choose a bundled GLB or launch again later with `--glb`.

Expected result:

1. the app opens as a desktop runtime surface rather than a browser-only demo
2. if no model is loaded, the app makes that state explicit
3. once a model is loaded, the runtime transitions into a visible active state

An explicit `no model loaded` state is part of healthy deployment behavior, not a failure in itself.

### 2. Load a face and wait for the runtime to settle

Use one of these paths:

1. interactive file picker in the desktop app
2. a CLI launch with a known GLB path

Example CLI form from the app README:

```bash
pnpm --filter vizij-standalone dev -- -- --glb /path/to/avatar.glb --fullscreen
```

For the full list of CLI options — display selection, port override, web control panel toggle, speech flags, and ROS2 surface options — see the [vizij-standalone README](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/deploy/vizij-web/apps/vizij-standalone/README.md).

Expected result:

1. the face loads without the app hiding its intermediate states
2. runtime health becomes visible in the app UI
3. the surface now looks like an endpoint that can be operated, not only inspected

### 3. Confirm the local control endpoint

The default local control endpoint is:

```text
ws://127.0.0.1:9000
```

Unless disabled, the built-in browser control panel is served on the same port over HTTP:

```text
http://127.0.0.1:9000
```

The server binds to `0.0.0.0`, so the control panel is also reachable from any device on the same network. If you want to drive the face from a phone or another machine, open:

```text
http://<machine-ip>:9000
```

No extra tooling or installation required on the controlling device.

What to confirm:

1. the app surfaces the port or connection state clearly
2. the runtime is ready before you expect remote or browser-side control to work
3. the browser control panel is reachable from a phone or another machine on the same network

This is the maintained current truth for the first deployment route. Only expose the port on trusted networks — the server does not restrict access beyond the Arora exclusive-client policy.

### 4. Prove that operator control reaches the face

Use the built-in control panel, a phone on the same network, or another same-host client to drive one visible change.

Expected result:

1. the client can connect to the standalone endpoint
2. the face responds to control input
3. the runtime remains healthy while the control path is active

At that point, the app has crossed from `demo-shaped` to `deployment-shaped`.

### 5. Inspect the code layers that make deployment work

Open:

1. `vizij-web/apps/vizij-standalone/README.md`
2. `vizij-web/apps/vizij-standalone/src/App.tsx`
3. `vizij-web/apps/vizij-standalone/src/hooks/useWebSocketSync.ts`
4. `vizij-web/apps/vizij-standalone/src-tauri/src/lib.rs`

What each layer owns:

1. `App.tsx` mounts the runtime-react surface in the desktop shell
2. `useWebSocketSync.ts` bridges runtime inputs and transport state
3. `src-tauri/src/lib.rs` owns the CLI flags and endpoint startup

That separation is why this is a deployment surface and not just a richer player app.

## Persisting Speech Keys with .env

Passing `--deepgram-key`, `--openai-key`, and `--api-url` on every launch is tedious. The standalone app reads those values from a `.env` file in `src-tauri/` that Tauri loads automatically at dev and build time.

### Where the file lives

```text
apps/vizij-standalone/src-tauri/.env
```

Copy the provided example to get started:

```bash
cp apps/vizij-standalone/src-tauri/.env.example apps/vizij-standalone/src-tauri/.env
```

Then fill in your keys:

```env
VITE_API_URL="https://us-central1-semio-vizij.cloudfunctions.net/api"
VITE_DEEPGRAM_API_KEY=your_deepgram_key_here
VITE_OPENAI_API_KEY=your_openai_key_here
```

### What each variable does

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | TTS API base URL. Defaults to the hosted Semio endpoint. Override for a local TTS server. |
| `VITE_DEEPGRAM_API_KEY` | Deepgram STT key. Required for microphone input when speech is enabled. |
| `VITE_OPENAI_API_KEY` | OpenAI key. Required for `conversation` speech mode. |

The `VITE_` prefix is required. Tauri forwards those variables to the Vite frontend where the speech hooks read them. Variables without that prefix are not visible to the React layer.

### Precedence

CLI flags always win. The resolution order for each speech value is:

1. CLI flag (`--deepgram-key`, `--openai-key`, `--api-url`, `--speech-mode`)
2. `.env` variable or localStorage value
3. Bundle `speechConfig` metadata
4. Hook default

If speech looks half-configured, check both the `.env` file and the CLI flags before debugging the runtime layer.

### The file is gitignored

`src-tauri/.env` is listed in the workspace `.gitignore`. Do not add it to version control. Use `src-tauri/.env.example` as the committed template.

## The Smallest Useful Operator Checklist

Call the deployment healthy only when all of these are true:

1. a face is loaded
2. runtime status is visible and healthy
3. the WebSocket endpoint is available
4. a same-host control client can connect
5. the face responds to control input predictably

If any one of those is missing, keep treating the setup as unfinished.

## Pre-Flight And Post-Flight Checklist

Use this checklist when you want one compact pass/fail loop instead of rereading the whole walkthrough.

| Phase | Check | Pass signal | Fail clue |
| --- | --- | --- | --- |
| pre-flight | start the app with `pnpm run dev:vizij-standalone` or `pnpm --filter vizij-standalone dev -- -- --glb /path/to/avatar.glb --fullscreen` | desktop window opens and stays up | process fails early or the port is already in use |
| pre-flight | load one face | the face becomes visible or the app leaves `No model loaded` | file picker returns but the app stays empty or enters an error state |
| pre-flight | confirm endpoint identity | the app reports the local control port and the default route is still `ws://127.0.0.1:9000` unless you changed `--port` | you are guessing the port or the app still looks like it is starting |
| post-flight | prove one operator control path | built-in web control panel connects (from same host or phone/LAN at `http://<machine-ip>:9000`) and the face changes visibly | the client connects but no visible change reaches the face |
| post-flight | prove recoverability | reset returns the face toward its defaults and the endpoint stays healthy | the face stays stuck or recovery leaves the endpoint in an unclear state |

## Fast Recovery If It Fails

Use these shortcuts:

1. if the app opens with no face, use the file picker or relaunch with `--glb`
2. if the face loads but control does not connect, verify the port and local endpoint state first
3. if the runtime appears unhealthy, use [Validation Checkpoints](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/validation-checkpoints.md)
4. if the transport or control path is failing, use [Troubleshooting Matrix](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/troubleshooting-matrix.md)

## Recommended Next Steps

Continue to [Operator and Deployment Model](/docs/deployment-model/) if you want the conceptual model behind this endpoint.

Then continue to [Deployment Checks and Recovery](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/deploy/deployment-checks-and-recovery.md) for the first operational validation loop.
