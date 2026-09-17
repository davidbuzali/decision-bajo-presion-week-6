# Decisions — Decisión Bajo Presión

## 2026-09-16 — Packet session close

### Decisions made

- Attack **The MEASUREMENT vacuum** as the official course vacuum. Define the team's narrower product interpretation as behavior measurement: whether rehearsal changes observable decisions when conditions change. Use Compliance-Upgrade only as the consultant-led distribution and payment bridge.
- Build for an adult teacher or brigade member before any student flow.
- Use a screen-based browser 3D simulation first and label it honestly; do not assume a headset adds value.
- Make the three required layers multiplicative: the user's click/keyboard/voice action changes the 3D scenario, the same event feeds the adaptive retest, and the retest produces an evidence comparison for a human safety lead.
- Use deterministic, explainable adaptive logic rather than a remote or opaque AI model.
- Keep all data in memory for the working slice; collect no personal data and store no raw voice.
- Require a human debrief before the unseen retest.
- Keep every critical outcome pending physical validation; the digital module cannot certify competence.
- Preserve the shadow clause: no personalized trauma, recognizable victims, cloned voices, emotion inference, or fear-adaptive intensity.

### Evidence created

- `docs/PACKET.md`
- `docs/IMPLEMENTATION_PROMPT.md`
- `docs/IMAGE_PROMPT.md`
- `docs/assets/decision-under-pressure-mockup.png`

### Tomorrow's first move

Scaffold the Vite/React/TypeScript application and implement the typed event schema plus adaptive selector tests before building the 3D corridor.

## 2026-09-16 — Packet finalization session close

### Decisions made

- Use the course's official name **The MEASUREMENT vacuum** and define behavior measurement as the team's narrower interpretation.
- Limit the working slice to five screens: safe start, baseline, human debrief, unseen retest, and evidence comparison.
- Use FLAIM FTS with FLAIM Capture as the global benchmark and localize the workflow to CDMX school civil-protection programs and existing Responsables Oficiales.
- Keep the three-year product human-led and centered on transfer evidence, corrective action, and physical validation.
- Make the Dragon Stack multiplicative: voice and visible controls share one validator; baseline events choose the adaptive retest; the selected retest changes the 3D scene.
- Keep the app client-only, without accounts, a database, analytics, secrets, or persistent session data.
- Treat browser voice recognition as optional and disclose that some browser implementations may use a provider service; never store audio or recognized transcripts in the app.
- Require M01–M15 mechanical checks, one real documented bug and fix, two verified deployments, and a fresh-chat persona pass.

### Packet status

The problem, exact user, success definition, image-generated mockup, feature flow, actor swimlane, benchmark, three-year light charter, scope cut, architecture, Dragon Stack, security floor, test plan, and Blueprint traceability are complete.

### Tomorrow's first move

Synchronize `docs/IMPLEMENTATION_PROMPT.md` with the finalized packet, divide the build into small acceptance-tested features and commits, and review that prompt before writing application code.

## 2026-09-16 — Implementation-prompt session close

### Decisions made

- Keep domain logic independent from React, Three.js, and browser APIs.
- Build pure typed contracts and M01–M07 tests before interface components.
- Divide the app into seven acceptance-tested features followed by a real test-fix commit and an evidence-documentation commit.
- Reuse one action validator and one event schema across 3D, flat view, keyboard, pointer, and voice paths.
- Build the 3D scene from primitive geometry so the prototype has no external model, school map, or asset dependency.
- Treat voice recognition as an optional adapter with explicit opt-in, `es-MX`, immediate transcript disposal, and complete fallback controls.
- Make the physical-validation state immutable in domain types and unavailable as a digital closure control.
- Require the first Vercel deployment after the tested feature build and the second only after the documented bug/persona fix.

### Prompt status

`docs/IMPLEMENTATION_PROMPT.md` now specifies the file boundaries, domain contracts, seven build features, acceptance criteria, security checks, M01–M15 test obligations, nine-build-commit plan, deployment sequence, session-close discipline, and definition of done.

### Tomorrow's first move

Start Feature 1 only: scaffold the Vite/React/TypeScript project, add the pure domain contracts and fixtures, implement M01–M07, run lint/tests/build, then commit and push that coherent increment before creating the UI.

## 2026-09-16 — Feature 1 session close

### Decisions made

- Isolate this nested repository with its own `pnpm-workspace.yaml` and lockfile so dependency changes never alter the parent Week 2 workspace.
- Use React, TypeScript, Vite, Three.js, and React Three Fiber in the scaffold, while keeping all Feature 1 domain modules free of React, Three.js, and browser imports.
- Represent decisions, actions, behaviors, scenarios, evidence statements, input modes, and session phases as closed TypeScript unions derived from readonly constants.
- Define one generic baseline scenario and four deterministic retest families: route change, accountability, assistance, and conflicting signs.
- Prioritize retest selection in this order: blocked-route evidence, falsely closed accountability, unsupported solo search, then the all-targets-demonstrated fallback.
- Validate that an action belongs to both the current decision and current scenario before creating an event.
- Keep event objects to exactly five fields and clamp relative time to a nonnegative integer.
- Map voice phrases according to the current decision so the same phrase can safely produce a scenario-specific allow-listed action; keep `pausar` as a session command that never becomes evidence.
- Make `physicalValidation: "pending"` the only representable physical-validation state.

### Verification

- Peer dependency check: no issues.
- ESLint: passed with no findings.
- M01–M07: 22 tests passed across 4 files.
- Strict TypeScript build: passed.
- Vite production build: passed; generated `dist/index.html` and hashed CSS/JavaScript assets.
- The Codex workspace shell did not expose `node` to pnpm child scripts, so the same installed ESLint, Vitest, TypeScript, and Vite entrypoints were executed directly with the bundled Node binary; this is an environment-path limitation, not a project failure.

### Tomorrow's first move

Start Feature 2 only: implement the safe Spanish start screen, in-memory session reducer, motion/view preferences, persistent pause control shell, and accessibility foundations without beginning the 3D scenario.

## 2026-09-16 — Feature 2 session close

### Decisions made

- State the product boundary before entry: this is a screen-based educational rehearsal that records predefined decisions and relative timing, not identity, emotion, competence, or real-world certification.
- Keep motion, view, and optional-voice preferences only in the React session reducer; do not use local storage, cookies, accounts, analytics, or a backend.
- Default to normal motion, screen-based 3D, and voice disabled. Offer reduced motion and a flat-view path before the rehearsal starts.
- Treat the voice checkbox as preparation only. It never requests microphone permission; the later explicit **Escuchar comando** action will own that request.
- Disclose that a browser provider may process speech while making clear that this application stores neither audio nor transcripts.
- Preserve the active scenario phase and evidence on pause. Pausing creates no event; exiting without saving resets settings, phase, and evidence to fresh defaults.
- Move focus into the pause dialog so keyboard users immediately reach the resume action.
- Stop at the Feature 2 boundary: the baseline screen remains an honest placeholder until the 3D and flat-view implementations are built together in Feature 3.

### Verification

- ESLint: passed with no findings.
- Vitest: 32 tests passed across 6 files, including reducer transitions, in-memory reset, zero microphone calls, keyboard start/pause/resume, pause focus, and clean exit.
- Strict TypeScript build: passed.
- Vite production build: passed.
- Browser QA: desktop start, preference handoff, paused dialog, and a 390 × 844 narrow viewport were inspected; the Spanish copy, semantic controls, focus target, and responsive layout remained usable.
- M08, M10, and the Feature 2 portions of M11 and M13 now have coverage. Voice error fallback and complete-flow assertions remain assigned to their later features.

### Tomorrow's first move

Start Feature 3 only: implement the three-decision baseline with primitive 3D geometry and exact flat-view parity, route every interaction through the existing validator and event contract, and preserve the Feature 2 pause and accessibility behavior.

## 2026-09-16 — Feature 3 session close

### Decisions made

- Render the fictional corridor entirely from Three.js primitive geometry, lights, signs, barriers, and anonymous capsule figures; use no downloaded model or real school layout.
- Lazy-load the 3D engine after entry so the safe start screen and flat flow do not pay the WebGL bundle cost.
- Keep 3D and flat presentation inside one baseline component so both modes expose the exact same prompts, option labels, progress, status, and event callback.
- Route pointer and keyboard activation through the same `createDecisionEvent` validator. Only `inputMode` differs for an equivalent action.
- Enforce baseline ordering again inside the reducer, rejecting duplicate, out-of-order, wrong-scenario, and post-baseline events even if a UI caller misbehaves.
- Subtract time spent paused from relative event timing. Pausing preserves the current decision and evidence without producing an event.
- Use a demand-driven render loop when reduced motion is selected and disable CSS animation through the application-level motion setting.
- Transition to an honest Feature 4 placeholder after the third decision; do not partially implement the trace or human-debrief logic in this increment.

### Verification

- ESLint: passed with no findings.
- Vitest: 38 tests passed across 7 files, including view parity, keyboard/pointer routing, ordered reducer acceptance, duplicate rejection, all three baseline decisions, and pause/resume preservation.
- Strict TypeScript build: passed.
- Vite production build: passed. The initial application bundle remains separate from the lazy-loaded Three.js scene bundle.
- Browser QA: the real WebGL corridor rendered, the second decision changed the exit to a blocked state, and the reduced-motion flat view preserved the same options and status hierarchy.
- Browser console showed only Three.js's upstream `Clock` deprecation warning from the rendering dependency; the application produced no runtime errors.

### Unresolved risk

- The lazy-loaded 3D dependency chunk is approximately 895 kB minified (236 kB gzip). It does not delay the start or flat-view path, but public-deployment performance should be checked on Deployment 1.

### Tomorrow's first move

Start Feature 4 only: render the neutral baseline event trace, derive one adaptive behavior target, label the recommendation as simulated AI with a human final decision, and require the in-memory human-debrief acknowledgment before the retest.

## 2026-09-16 — Feature 4 session close

### Decisions made

- Present the baseline evidence as a neutral chronological sequence containing only the situation label, selected allow-listed action, relative time, and input mode.
- Derive exactly one behavior target from the validated baseline events with the existing deterministic selector; do not expose the selected retest scenario, disruption, options, or intended response.
- Label the target **IA simulada — la decisión final es humana** and explain that it is a proposed focus for a responsible person's debrief, not an automated judgment.
- Use behavior-focused, non-diagnostic language and show no score, probability, trait, readiness rating, or competence label.
- Require the explicit action **Confirmo que ocurrió el debrief humano** before changing the session to the retest phase.
- Treat the acknowledgment as an in-memory navigation gate only. It records no identity, proof, professional participation, or persistent completion state.
- Validate that the trace contains every baseline decision before accepting the acknowledgment, even if an invalid state is supplied outside the normal reducer path.
- Stop at a Feature 5 boundary that confirms the gate opened but hides every retest condition and option.

### Verification

- ESLint: passed with no findings.
- Vitest: 42 tests passed across 8 files, including neutral trace rendering, relative-time formatting, hidden retest options, deterministic target integration, complete-trace acknowledgment gating, unchanged evidence, and reset on remount.
- Strict TypeScript build: passed.
- Vite production build: passed; the 3D engine remains isolated in its lazy-loaded chunk.
- Browser QA: completed a baseline that targets route checking, verified the three-event trace and exact simulated-AI/human-decision label, confirmed the debrief gate, and inspected the responsive layout at 390 × 844.
- Browser console: no application errors or warnings during the flat-view Feature 4 journey.

### Tomorrow's first move

Start Feature 5 only: pass the deterministic `ScenarioDefinition` into reusable scenario UI, record the unseen retest event through the same validator and reducer, preserve 3D/flat/pause parity, and stop at the comparison boundary.

## 2026-09-16 — Feature 5 session close

### Decisions made

- Extract one reusable `ScenarioRehearsal` for baseline and retest so both paths share the exact option controls, input-mode classification, 3D/flat selection, reduced-motion behavior, status hierarchy, and decision confirmation.
- Pass the deterministic retest `ScenarioDefinition` directly from the adaptive selection into that shared screen; add no random branch or client-generated variation.
- Extend the primitive scene with scenario-driven flags for route obstruction, count attention, assistance need, and conflicting signs rather than building separate retest interfaces.
- Preserve the Screen 4 labels **Escenario B — retest no visto**, **IA simulada — la decisión final es humana**, and **Requiere prueba física**.
- Reset relative timing when the human debrief is confirmed, then subtract retest pause duration through the same session clock used for baseline.
- Re-run the adaptive selector inside the reducer and accept only the event whose scenario and decision match the selected family. Reject wrong-family, incomplete-trace, duplicate, and post-completion events.
- Move to the comparison phase only after the selected retest event is validated and appended; leave the actual comparison and physical-validation gate for Feature 7.

### Verification

- ESLint: passed with no findings.
- Vitest: 46 tests passed across 9 files, including selected-family enforcement, wrong-family rejection, retest 3D/flat parity, pause/resume preservation, and the baseline → debrief → retest → comparison-boundary path.
- Strict TypeScript build: passed.
- Vite production build: passed; the Three.js dependency remains lazy-loaded outside the initial application bundle.
- Browser QA: the route-checking baseline evidence selected the route-change retest, the WebGL scene showed a different obstruction, all three required Screen 4 safety labels were visible, pause/resume preserved the decision, and completion reached the comparison boundary.
- Reduced-motion flat-view QA: the same route-change prompt, disruption, and option set rendered without WebGL.
- Browser console showed only React Three Fiber's upstream Three.js `Clock` deprecation warning; the application produced no runtime errors.

### Unresolved risk

- The lazy-loaded 3D chunk remains approximately 896 kB minified (237 kB gzip); verify its real public load behavior during Deployment 1.

### Tomorrow's first move

Start Feature 6 only: implement explicit bounded voice activation as an adapter over the existing decision callback, discard recognized text immediately, preserve visible controls on every failure, and add M08/M09 coverage without starting the final comparison UI.

## 2026-09-16 — Feature 6 session close

### Decisions made

- Implement browser speech recognition as an optional adapter over the existing `onDecision` callback, never as a separate evidence or business-logic path.
- Instantiate and start recognition only after the explicit **Escuchar comando** action. Enabling voice at the start screen or loading a scenario performs no microphone or recognition action.
- Configure one-shot recognition for `es-MX`, non-continuous results, no interim transcript, and one alternative.
- Normalize and accept only the five documented commands through the existing current-decision allow list: `ruta alterna`, `reportar persona`, `pedir apoyo`, `esperar instrucción`, and `pausar`.
- Map recognized text immediately to an allow-listed command and return only the command object; expose, render, log, and store no transcript.
- Route recognized decisions through the same validator and reducer with `inputMode: "voice"`; route `pausar` to the existing session pause control without creating evidence.
- Treat unsupported APIs, permission denial, network failure, generic recognition failure, empty results, unrelated phrases, and overlong phrases as neutral non-events while keeping every visible decision button and keyboard path usable.
- Repeat the browser-provider disclosure beside the voice control without claiming offline recognition.
- Stop before Feature 7: no comparison statement or digital physical-validation closure was added.

### Verification

- ESLint: passed with no findings.
- Vitest: 61 tests passed across 10 files, including command normalization, one-shot `es-MX` configuration, zero activation before the explicit button, transcript-free results, pointer/keyboard/voice action parity, voice pause, unrelated phrase rejection, permission/network/recognition failures, unsupported-browser fallback, and preserved visible controls.
- Strict TypeScript build: passed.
- Vite production build: passed; the Three.js scene remains lazy-loaded.
- Browser QA: opted into voice, entered a flat baseline, verified that the voice control and provider disclosure appeared alongside all three visible actions, and confirmed that the page made no request before **Escuchar comando**. The microphone action itself was deliberately not triggered during visual QA.
- Browser console: no errors or warnings during the voice opt-in journey.

### Tomorrow's first move

Start Feature 7 only: render exactly one approved comparison statement for the targeted behavior, show the immutable **Pendiente de validación física** gate and physical micro-drill instruction, then add the complete-flow M05/M06/M12/M13 assertions.
