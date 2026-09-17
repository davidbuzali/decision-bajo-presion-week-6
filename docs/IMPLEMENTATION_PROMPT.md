# Final Implementation Prompt — Decisión Bajo Presión

You are the coding agent for the Week 6 working slice documented in `docs/PACKET.md`. Build only the product described there. The packet is authoritative for product scope, ethics, user, flow, and evidence language; this prompt is authoritative for implementation order and acceptance criteria.

Do not begin by expanding the concept. Begin with domain contracts and tests, then implement one small feature at a time. Never claim a test, user observation, deployment, screenshot, or behavior that has not been verified.

## Product outcome

Build a Spanish-language browser rehearsal for an adult teacher or school-brigade member in Mexico. The user completes a three-decision baseline inside a lightweight 3D school corridor, reviews a factual event trace with a human facilitator, and completes a different unseen scenario selected by transparent adaptive logic. Buttons, keyboard controls, and optional bounded voice input must enter the same validated action pipeline.

The final view may compare one narrow behavior across the two simulations, but every critical result must remain **Pendiente de validación física**. The application must never claim that a person is competent, a school is prepared, a route is certified, or lives will be saved.

## Non-negotiable product rules

1. The declared vacuum is **The MEASUREMENT vacuum**: zero data on whether drills change behavior.
2. The five phases visible to the user are safe start, baseline, human debrief, unseen retest, and evidence comparison.
3. The 3D view is labeled **Simulación 3D en pantalla — no es realidad virtual**.
4. Adaptive output is labeled **IA simulada — la decisión final es humana**.
5. `Pausar y salir` remains visible at every decision point and never records a failure.
6. A flat, semantic decision view can complete the same flow without WebGL or motion.
7. Voice is optional, disabled by default, and never required for completion.
8. No account, backend, database, analytics, personal data, persistent session, external AI API, or secret is allowed.
9. No personalized trauma, recognizable victims, cloned voices, graphic injury, biometric input, emotion inference, or fear-adaptive intensity is allowed.
10. Only a human safety lead chooses the next training action; only a later physical drill can validate a critical behavior.

## Required free stack

- Package manager: `pnpm`.
- Application: Vite, React, and TypeScript with strict type checking.
- 3D: `three`, `@react-three/fiber`, and only lightweight primitive geometry; `@react-three/drei` may be used when it removes boilerplate without adding an asset dependency.
- Adaptive layer: deterministic local TypeScript functions; no trained model and no network request.
- Voice: optional browser `SpeechRecognition`/`webkitSpeechRecognition` adapter with Spanish `es-MX` and a strict post-recognition allow list.
- Tests: Vitest, React Testing Library, `@testing-library/user-event`, and Playwright.
- Quality: ESLint and a production `vite build`.
- Hosting: static Vercel deployment from the dedicated GitHub repository.

## Target file structure

Keep domain logic independent from React and Three.js.

```text
src/
  app/
    App.tsx
    sessionReducer.ts
  components/
    StartScreen.tsx
    SimulationScreen.tsx
    ScenarioScene.tsx
    FlatScenarioView.tsx
    DecisionPanel.tsx
    EvidenceTrace.tsx
    DebriefScreen.tsx
    ComparisonScreen.tsx
    PauseOverlay.tsx
  domain/
    types.ts
    actions.ts
    scenarios.ts
    events.ts
    adaptive.ts
    comparison.ts
  adapters/
    speech.ts
  styles/
    app.css
  test/
    setup.ts
tests/
  actions.test.ts
  adaptive.test.ts
  comparison.test.ts
  events.test.ts
  session.test.tsx
e2e/
  rehearsal.spec.ts
docs/
  PACKET.md
  IMPLEMENTATION_PROMPT.md
  TESTING.md          # create during the mechanical pass
  PERSONA.md          # create during the persona pass
```

Equivalent organization is acceptable only if the same boundaries remain obvious and testable.

## Domain contracts

Implement these concepts as closed unions or readonly constants, not arbitrary strings:

```ts
type SessionPhase =
  | "intro"
  | "baseline"
  | "debrief"
  | "retest"
  | "comparison"
  | "paused";

type InputMode = "pointer" | "keyboard" | "voice";

type DecisionEvent = {
  scenarioId: string;
  decisionId: string;
  actionCode: string;
  relativeTimeMs: number;
  inputMode: InputMode;
};

type ComparisonResult = {
  behaviorCode: string;
  evidenceStatement:
    | "demonstrated_both"
    | "demonstrated_after_debrief"
    | "not_yet_demonstrated";
  physicalValidation: "pending";
};
```

Forbidden fields include names, emails, school identifiers, raw audio, transcripts, free text, absolute timestamps, location, biometrics, emotion labels, probabilities, readiness scores, and mortality or survival claims.

All input modes must call one `validateAction(decisionId, candidateAction)` function before an event can be appended. The Three.js scene renders state but cannot create scores, compare behavior, or bypass validation.

## Scenario content

Use fictional, generic demonstration content. The baseline scenario contains exactly three decisions:

1. **Alert begins** — observe and follow the current instruction; move without checking conditions; or continue the previous activity.
2. **Primary exit blocked** — verify and use the marked alternate route; attempt the obstructed route; or wait without communicating.
3. **Person not accounted for** — report the discrepancy and request coordinated support; leave the group to search alone; or close the count without reporting it.

Map baseline evidence to one retest family:

| Baseline behavior evidence | Retest family | Target behavior |
|---|---|---|
| Attempted blocked exit | Temporary route change | `checks_route_status` |
| Lost or falsely closed accountability | Missing participant after assembly-area change | `maintains_accountability` |
| Ignored or abandoned assistance assignment | Assigned person cannot use the new route | `requests_assistance` |
| No target missed | Conflicting temporary signs | `verifies_information` |

The retest must have a different `scenarioId` and a different visible disruption from baseline. Selection is deterministic so every mapping can be tested.

## Feature 1 — Project foundation and pure domain

Create the Vite/React/TypeScript project, scripts, strict configuration, domain types, scenario fixtures, action allow lists, event reducer, adaptive selector, and comparison function before building the interface.

Acceptance criteria:

- `pnpm lint`, `pnpm test`, and `pnpm build` scripts exist.
- Domain modules do not import React, Three.js, browser APIs, or UI components.
- Adaptive selection covers every mapping and the all-behaviors-demonstrated fallback.
- `physicalValidation` has no representable value other than `pending`.
- Unit tests cover M01–M07 from the packet and pass.

## Feature 2 — Safe start and accessible application shell

Implement Screen 1 and the session state machine.

The start screen must state in Spanish:

- This is a screen-based rehearsal, not real-world certification.
- The module records predefined decisions and relative timing, not identity or emotion.
- Voice is optional; some browsers may use their provider for recognition; the app stores neither audio nor transcripts.
- The user can leave without penalty.

Provide normal motion, reduced motion, 3D view, and flat view controls. Do not request microphone access during page load or when the voice description is merely displayed.

Acceptance criteria:

- No personal or free-text field exists.
- The full flow can start with voice disabled and flat view selected.
- Reduced motion and view preference live only in memory and reset on reload.
- Visible focus, semantic headings, buttons, status text, and an `aria-live` region are present.
- M08, M09, M10, M11, and M13 have component coverage where applicable.

## Feature 3 — Baseline 3D rehearsal and flat-view parity

Implement Screen 2 with a lightweight corridor assembled from primitive geometry, simple lights, blocked-route objects, and signs. Do not download a school model or reproduce a real location.

The user completes the three baseline decisions in order. Selecting an option changes the scene or visible status and appends one validated event. Display a short confirmation such as **Decisión registrada** so the user knows the choice took effect.

Acceptance criteria:

- A persistent label identifies the experience as screen-based 3D, not VR.
- 3D and flat views present the same option text and produce identical event objects for equivalent selections.
- Keyboard-only use can reach and select every option.
- Reduced motion disables camera animation and nonessential transitions.
- Every event has exactly the five allowed fields.
- Pause works at each decision and leaves the evidence log unchanged.

## Feature 4 — Observable trace and human debrief

Implement Screen 3 after all baseline decisions are complete.

Show the event sequence using neutral factual descriptions and relative times. Show one behavior target proposed by the adaptive selector with the label **IA simulada — la decisión final es humana**. Require an explicit **Confirmo que ocurrió el debrief humano** action before entering the retest; this is a prototype acknowledgment, not proof that a professional participated.

Acceptance criteria:

- No score, probability, trait, emotion, or competence label appears.
- The adaptive target is derived only from allow-listed baseline events.
- The interface does not reveal the correct retest action.
- The human-debrief acknowledgment is required to continue but is not stored after reload.

## Feature 5 — Adaptive unseen retest

Implement Screen 4 by passing the selected retest `ScenarioDefinition` into the same 3D and flat-view components used for baseline.

Acceptance criteria:

- Retest ID and visible disruption differ from baseline.
- The selected family matches the targeted behavior mapping.
- The same action validator, event reducer, pause behavior, accessibility modes, and input modes are reused.
- No randomness makes test results unstable.
- M01, M02, M03, M07, M10, and M12 pass for the retest path.

## Feature 6 — Optional bounded voice input

Implement voice as an adapter, never as an alternate business-logic path.

Recognize only these intended commands after normalization:

- `ruta alterna`
- `reportar persona`
- `pedir apoyo`
- `esperar instrucción`
- `pausar`

Normalize case, surrounding whitespace, and common diacritic variation, then map to an allow-listed candidate action for the current decision. Discard recognized text immediately after mapping. Do not show or log a transcript. Unknown, empty, unrelated, or overlong results create no event and show neutral retry copy.

Acceptance criteria:

- Recognition starts only from an explicit **Activar voz** or **Escuchar comando** action.
- Unsupported API, permission denial, network error, or recognition error never blocks visible controls.
- A recognized command and its equivalent button produce the same `actionCode`; only `inputMode` differs.
- The app itself stores no audio or transcript and makes no claim that browser recognition is offline.
- M03, M04, M08, and M09 pass.

## Feature 7 — Comparison and physical-validation gate

Implement Screen 5 with exactly one approved evidence statement:

- **Demostrado en ambas simulaciones**
- **Demostrado después del debrief en el retest no visto**
- **Aún no demostrado — requiere más práctica**

Every critical behavior additionally displays **Pendiente de validación física** and tells the human safety lead to test it during a physical micro-drill. Do not implement a digital control that closes, approves, certifies, overrides, or marks the finding competent.

Acceptance criteria:

- Comparison uses only the targeted behavior and allow-listed events.
- The physical-validation gate is visible for every result and immutable in domain types and UI state.
- Reloading clears the result and returns to the start screen.
- The full baseline → debrief → retest → comparison path passes M05, M06, M12, and M13.

## Security floor

Before the first deployment, verify and document all five course checks:

1. No secret, API key, token, credential, or required environment variable exists.
2. No personal data is collected or stored; therefore authentication is unnecessary.
3. No database or user table exists; therefore Row Level Security is not applicable.
4. Every decision and recognized phrase passes typed allow-list validation; there is no free-text form.
5. Every fixture, identifier, person, institution, screenshot, and seed is fictional and labeled as demonstration content.

Also inspect the built application in the browser network panel: it must not send application data to a backend or analytics service. The only possible external processing is the browser-controlled speech-recognition service after explicit opt-in and disclosure.

## Required test and quality commands

Expose these scripts or clear equivalents:

```json
{
  "scripts": {
    "dev": "vite",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

Complete and record M01–M15 from `docs/PACKET.md`. Do not weaken a failing test to make the build green unless the packet requirement itself was wrong and the decision is documented first.

## Commit plan

The packet commits already exist. Make the application history legible with at least these separate build commits:

1. `chore: scaffold client app and domain contracts`
2. `feat: add safe start and accessible session controls`
3. `feat: build 3d baseline with flat-view parity`
4. `feat: add observable trace and human debrief`
5. `feat: add adaptive unseen retest`
6. `feat: add bounded voice input and comparison gate`
7. `test: verify evidence loop and security floor`
8. `fix: resolve highest-severity mechanical or persona issue`
9. `docs: record testing persona deployments and demo evidence`

Do not combine unrelated milestones only to reduce commit count, and do not create empty or cosmetic commits to inflate it. Every commit must build or document a verifiable increment.

## Deployment and test-fix sequence

1. Finish commits 1–7 and run lint, unit/component tests, end-to-end tests, and the production build.
2. Push `main`, import the GitHub repository into Vercel, and make **Deployment 1**.
3. Open the public URL and repeat the primary journey; record the deployment URL or identifier and outcome in `docs/TESTING.md`.
4. Perform the mechanical pass and document at least one real bug with reproduction, expected result, actual result, cause, and screenshot.
5. In a fresh conversation, run the persona test described in the packet using screenshots of Screens 1–5; log every confusion in `docs/PERSONA.md`.
6. Fix the highest-severity mechanical or persona issue in commit 8, rerun every affected test plus M12 and M15, and capture the changed screen.
7. Complete the testing and persona records in commit 9, push `main`, and make **Deployment 2**.
8. Open the second public deployment and verify the corrected journey before calling the cycle complete.

Never label a local preview as a deployment. Never fabricate the required bug, persona observation, screenshot, test result, or public URL.

## Session close after every build session

Before stopping:

1. Update `DECISIONS.md` with decisions made and unresolved risks.
2. Write tomorrow's first concrete move.
3. Run the relevant checks for the work completed.
4. Commit the coherent increment.
5. Push it to the dedicated GitHub repository.

The application repository and `~/crystal-ball/cuaderno` are separate. Do not commit one inside the other; the coursework notebook receives its own separate update, commit, and push.

## Definition of done

- The packet and this implementation prompt remain consistent.
- The public Vercel URL completes the entire five-screen flow without a backend.
- 3D, adaptive selection, and voice operate through one shared action/evidence loop.
- Click, keyboard, voice, reduced-motion, and flat-view paths preserve the same domain behavior.
- All Blueprint conditions and shadow-clause protections are visible in code and interface copy.
- M01–M15, lint, end-to-end tests, and production build pass.
- One real bug and one highest-severity persona or mechanical issue are documented and fixed.
- Two public deployments are verified.
- At least five meaningful build commits exist; the planned history above creates nine.
- `docs/TESTING.md`, `docs/PERSONA.md`, `DECISIONS.md`, and the demo evidence are current.
- No secrets, personal data, false readiness claim, or digital competence closure exists.
