---
pageId: tutorials-agent-face
moduleId: tutorials/agent-face
sourceModuleId: integrate/api-backed-interactive-application
sourcePath: integrate/api-backed-interactive-application.md
surface: tutorials
publish: true
routeSlug: agent-face
canonicalPath: /tutorials/agent-face/
routeRole: walkthrough
routeRoleLabel: Live integration
title: Agent Face
summary: Build the richer API-backed interactive branch with explicit
  live-service boundaries, runtime checkpoints, and recovery paths.
moduleType: walkthrough
bucket: Integrate
depth: Advanced
hubGroup: runtime-and-deployment
order: 70
redirects:
  - api-backed-interactive-application
outcome: After this page, you should be able to run the maintained richer
  integration example, separate runtime readiness from session readiness, and
  explain how an external service loop becomes visible face behavior through a
  tool bridge instead of bypassing the Vizij runtime.
prerequisites:
  - "Use the vizij-web workspace root:"
successCheck:
  - tutorial-agent-face runs locally
  - you can explain the difference between runtime readiness and session
    readiness
  - you can point to the tool bridge that translates external events into Vizij
    runtime actions
  - if the API key is configured, you can trigger a live interaction and see the
    face respond through that bridge
headings:
  - depth: 2
    slug: starting-state
    text: Starting State
  - depth: 2
    slug: scope-note
    text: Scope note
  - depth: 2
    slug: required-and-optional-setup
    text: Required And Optional Setup
  - depth: 2
    slug: what-you-can-validate-without-the-api-key
    text: What You Can Validate Without The API Key
  - depth: 2
    slug: the-pattern-you-are-learning
    text: The Pattern You Are Learning
  - depth: 2
    slug: walkthrough
    text: Walkthrough
  - depth: 2
    slug: why-this-example-teaches-well
    text: Why This Example Teaches Well
  - depth: 2
    slug: fast-recovery-if-it-fails
    text: Fast Recovery If It Fails
  - depth: 2
    slug: recommended-next-steps
    text: Recommended Next Steps
context:
  bucketChain: "Previous: Control on the fast route or Customize on the
    customization route Current: Integrate Next: Deploy"
  depthLadder: "Above: Minimal Web Player, Loading, Playback, and Embedding,
    Application Integration Patterns Current: Advanced Below: none, this is the
    deepest current depth in this bucket"
  modulePosition: "Previous in bucket: Application Integration Patterns Current
    module: API-Backed Interactive Application Next in bucket: Rich Interactive
    Applications"
  moduleType: walkthrough
  bucketOverview:
    label: Integrate
    href: /docs/
  referenceBridges:
    - label: Runtime Quickstart Reference
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/reference/runtime-quickstart-reference.md
    - label: Animation, Integration, and Deployment Reference
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/reference/animation-integration-and-deployment-reference.md
    - label: Validation Checkpoints
      href: https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/validation-checkpoints.md
prev:
  label: Animations
  href: /tutorials/animations/
  description: Return to authored motion and runtime playback.
next:
  label: Deployment
  href: /tutorials/deployment/
  description: Finish in an operator-facing delivery surface.
implementationAnchors:
  - label: tutorial-agent-face
    href: https://github.com/vizij-ai/vizij-web/tree/main/apps/tutorial-agent-face
    description: Current richer integration app behind the public branch.
demoLinks:
  - label: Voice demo
    href: /demos/#voice
    description: Compare the public speech/viseme behavior slice with the fuller
      agent integration path.
hasMermaid: false
---

## Starting State

Use the `vizij-web` workspace root:

```bash
cd /home/chris/Code/Semio/vizij_ws/vizij-web
```

This walkthrough uses `apps/tutorial-agent-face`, the maintained Vizij example that layers a live service loop on top of the same runtime foundation used in `tutorial-fullscreen-face`.

## Scope note

Open this page only if your product really has an external session or service loop.

If you only need a local embedded face:

1. stay with [Minimal Web Player](/tutorials/minimal-player/),
2. use [Application Integration Patterns](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/integrate/application-integration-patterns.md) to choose the lighter app shape,
3. come back here only when a separate session layer is a real requirement.

## Required And Optional Setup

Install dependencies once:

```bash
pnpm install
```

If you want the full live-session path, create the app-local env file:

```bash
cat > apps/tutorial-agent-face/.env.local <<'EOF'
VITE_GEMINI_API_KEY=your_google_ai_studio_key
EOF
```

Then start the app:

```bash
pnpm run dev:tutorial-agent-face
```

Two valid ways to use this page:

1. without `VITE_GEMINI_API_KEY`, inspect the runtime shell and local interaction layers
2. with `VITE_GEMINI_API_KEY`, complete the full runtime-plus-session walkthrough

## What You Can Validate Without The API Key

The missing API key only blocks the live session layer. It does not erase the rest of the maintained app.

| If `VITE_GEMINI_API_KEY` is missing | You can still validate | You cannot validate yet |
| --- | --- | --- |
| session connection is intentionally unavailable | runtime loading, ready, and error states | live Gemini session connection |
| the face shell should still render | the provider/bootstrap shape in `FaceApp.tsx` | transcript or model-audio flow |
| the UI should still distinguish runtime status from session status | the boundary between `useGeminiLive` and `useAgentFaceTools` | tool-call round trips from the external service |
| the disconnected state is expected | local interaction layers and runtime-owned behavior | service-driven gaze, emotion, or mouth behavior |

If the page loads, the face becomes ready, and the UI reports a missing key or disconnected session separately from runtime readiness, the app is still teaching the right advanced-integration boundary.

## The Pattern You Are Learning

This page teaches one reusable application shape:

1. a stable Vizij runtime shell
2. a separate external session layer
3. a tool bridge that translates service events into Vizij runtime actions
4. UI state that tells you which layer is healthy or failing

That is the whole advanced-integration idea.

## Walkthrough

### 1. Launch the richer app and identify the runtime shell

Run:

```bash
pnpm run dev:tutorial-agent-face
```

Open the local URL shown by Vite.

Expected result:

1. the face appears through the same runtime-react foundation used by the simpler tutorial
2. the UI has more controls and session-facing chrome than `tutorial-fullscreen-face`
3. the app is clearly more product-shaped without being a different runtime model

Current visual anchor:

<figure class="guidebook-media">
<img src="/guidebook-assets/screenshots/tutorial-agent-face.png" alt="Tutorial Agent Face" loading="lazy" />
<figcaption>the runtime face remaining visible and healthy even while the outer session layer is disconnected.</figcaption>
</figure>

That is the point of using this capture here: it lets the page separate runtime readiness from session readiness before the live service path enters the story.

### 2. Separate runtime readiness from session readiness

Before connecting any live session, inspect the UI and app behavior.

What to look for:

1. the face runtime can become ready even if the external session is disconnected
2. a missing API key or disconnected session does not mean the runtime failed
3. local behavior such as face presence, base interactions, and UI shell rendering still prove that the Vizij layer is healthy

This is the first advanced lesson:

1. runtime readiness answers `can the face load and respond`
2. session readiness answers `can the external service connect and drive richer behavior`

Do not collapse those into one state.

### 3. Inspect how the app keeps the runtime foundation small

Open:

1. `vizij-web/apps/tutorial-agent-face/src/FaceApp.tsx`
2. `vizij-web/apps/tutorial-agent-face/src/hooks/useGeminiLive.ts`
3. `vizij-web/apps/tutorial-agent-face/src/hooks/useAgentFaceTools.ts`

The runtime bootstrap still looks like this:

```tsx
export function FaceApp() {
  return (
    <VizijRuntimeProvider assetBundle={assetBundle} autostart>
      <AgentFaceRuntime />
    </VizijRuntimeProvider>
  );
}
```

That small bootstrap matters. The app becomes rich by adding layers around the runtime, not by replacing it.

### 4. Follow the live-service bridge in code

Inside `FaceApp.tsx`, look for the boundary between session logic and runtime logic:

```tsx
const { tools, handleFunctionCalls, gazeActive } = useAgentFaceTools({
  enabled: ready,
  bindings,
});

const { status: geminiStatus, connect, disconnect } = useGeminiLive(
  audioManager,
  voiceName,
  {
    enableTools: toolsEnabled,
    tools,
    handleFunctionCalls: toolsEnabled ? handleFunctionCalls : undefined,
    systemInstruction: SYSTEM_INSTRUCTION,
  },
);
```

What this means:

1. `useGeminiLive` owns the external session
2. `useAgentFaceTools` owns the translation from tool calls into Vizij runtime actions
3. the face still moves through runtime helpers such as `setInput(...)` and `animateValue(...)`

This translation layer is the part you copy into your own advanced app.

### 5. Complete the full live-session path if you configured the API key

If `VITE_GEMINI_API_KEY` is configured:

1. connect the session from the UI
2. trigger a short interaction
3. watch for transcript or session-state feedback
4. observe gaze, emotion, or mouth behavior update through the face surface

Expected result:

1. the session state changes independently from runtime readiness
2. tool-driven actions become visible face changes
3. the UI tells you whether the problem is in the runtime layer, the session layer, or the tool layer

If you did not configure the API key, stop after step 4 and treat the disconnected session as an intentional boundary, not a failed tutorial.

## Why This Example Teaches Well

This app is the best maintained advanced guide because it shows all of these at once:

1. the runtime shell remains recognizable
2. a live service loop is clearly separate from runtime loading
3. the tool bridge is explicit in code
4. the surrounding UI helps diagnose where the system is healthy or failing

That combination is what makes it a reusable integration pattern instead of just a flashy demo.

## Fast Recovery If It Fails

Use these shortcuts:

1. if the face never loads, treat that as a runtime problem and compare against [Hello Face Quickstart](/tutorials/hello-face/)
2. if the face loads but the session will not connect, check whether `VITE_GEMINI_API_KEY` is configured
3. if the session connects but the face does not react, inspect `useAgentFaceTools.ts` and compare the expected bridge shape in this page
4. if you need route-level healthy-state checks, use [Validation Checkpoints](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/validation-checkpoints.md)
5. if you need failure-driven recovery, use [Troubleshooting Matrix](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/support/troubleshooting-matrix.md)

## Recommended Next Steps

Continue to [Rich Interactive Applications](https://github.com/vizij-ai/vizij-docs/tree/main/current_documentation/guidebook/integrate/rich-interactive-applications.md) if you want the broader family of advanced integration patterns.

If you want to return to the simpler integration spine, go back to [Minimal Web Player](/tutorials/minimal-player/).
