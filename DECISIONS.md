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
