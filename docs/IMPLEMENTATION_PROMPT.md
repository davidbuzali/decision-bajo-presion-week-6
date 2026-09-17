# Implementation Prompt — Decisión Bajo Presión

Build the working Week 6 slice described in `docs/PACKET.md`. Do not expand the product beyond that packet.

## Product outcome

Create a Spanish-language browser rehearsal for a teacher or school-brigade adult. The user completes a three-decision baseline scenario inside a lightweight 3D school corridor, sees a neutral observable event trace, passes through a clearly human-led debrief, and then completes a different unseen scenario selected by transparent adaptive logic. A user can answer by clicking, keyboard, or bounded Spanish voice commands. Critical results must always remain labeled `Pendiente de validación física`; the app must never claim readiness, competence, courage, panic, safety, survival, or lives saved.

## Required stack

- Vite, React, and TypeScript.
- `three`, `@react-three/fiber`, and `@react-three/drei` for a screen-based 3D simulation labeled `Simulación 3D en pantalla — no es realidad virtual`.
- A local, deterministic adaptive-selection module. No network AI call. Label its output `IA simulada — la decisión final es humana`.
- Web Speech API for optional bounded Spanish commands. Provide buttons and keyboard controls with identical behavior when speech recognition is unsupported or denied.
- Vitest and Testing Library for logic/components; Playwright for one end-to-end path if the environment supports it.
- Static Vercel configuration. No backend, authentication, database, analytics, cookies, or secrets.

## Small testable features

### 1. Safe session start

- Explain that this is a screen-based rehearsal, not a prediction of real-world safety.
- Let the user select click/keyboard or optional voice assistance.
- State that raw voice and personal data are not stored.
- Provide `Pausar y salir` before the first scenario begins.

Acceptance criteria:

- No user name, email, school name, or other personal field exists.
- Voice permission is requested only after the user explicitly enables it.
- The simulation works fully without voice permission.

### 2. Baseline 3D scenario

- Render a simple low-poly school corridor with route signs and visible state changes.
- Present exactly three bounded decisions: response to the alert, response to a blocked primary exit, and response to an assigned person needing assistance.
- Each decision records `scenarioId`, `decisionId`, `actionCode`, `relativeTimeMs`, and `inputMode`.

Acceptance criteria:

- Mouse, keyboard, and voice paths use one validation function and produce the same allowed action code.
- Free text never becomes an action code.
- `Pausar y salir` is available at all three points and does not create a failure event.

### 3. Observable evidence and debrief

- Show the ordered event trace with plain factual descriptions.
- Highlight one narrow behavior to discuss, without a preparedness score.
- Present a `Debrief con responsable humano` checkpoint that requires a user acknowledgment before the retest.

Acceptance criteria:

- The trace contains no psychological labels, probability, readiness score, or automatic certification.
- The simulated-adaptive label is visible near the suggested retest focus.
- The human facilitator remains the named decision-maker.

### 4. Adaptive unseen retest

- Implement an interpretable scenario-selection function based on missed behavior codes.
- Scenario B must differ in identifier and disruption from scenario A.
- Example mapping: choosing the blocked exit targets `checks_route_status`; failing to assist targets `requests_assistance`; losing the group targets `maintains_accountability`.
- If no baseline behavior is missed, select a deterministic alternate scenario with conflicting signage.

Acceptance criteria:

- Unit tests cover every mapping and the no-missed-behavior fallback.
- The UI explains which observable behavior is being retested but does not reveal the correct action before the choice.
- The retest includes the same input accessibility modes as baseline.

### 5. Human-readable comparison

- Compare only the targeted narrow behavior across the two simulations.
- Allowed messages: `Demostrado en ambas simulaciones`, `Demostrado después del debrief en el retest no visto`, and `Aún no demostrado — requiere más práctica`.
- Every critical behavior also shows `Pendiente de validación física`.

Acceptance criteria:

- No digital path can remove the physical-validation label.
- Reloading clears the invented in-memory session.
- Export is limited to a local JSON download containing only the allow-listed event fields, if export is implemented at all.

### 6. Accessibility and motion control

- Provide a reduced-motion control that disables camera motion and decorative transitions.
- Use visible focus, semantic buttons, sufficient contrast, and an always-available non-3D decision list.
- Announce scenario and decision changes to assistive technology.

Acceptance criteria:

- The complete flow can be finished using only a keyboard.
- Reduced motion persists only for the current session.
- The non-3D alternative produces the same event schema.

## Explicit exclusions

Do not add accounts, personal profiles, Supabase, persistent cloud data, student flows, school-specific maps, a chatbot, open-ended speech storage, emotion recognition, gaze tracking, biometric inputs, graphic victims, personalized trauma, cloned voices, readiness scores, or automatic physical-drill closure.

## Tests and evidence

- Add logic tests for adaptive selection, comparison copy, critical physical-validation labels, and allow-listed event fields.
- Add interaction tests for click/keyboard parity and voice-command parsing.
- Add one browser test covering baseline → debrief → unseen retest → comparison.
- Document the mechanical pass in `docs/TESTING.md`, including one real bug, its cause, fix, and rerun result.
- Document the persona pass in `docs/PERSONA.md`; capture before-fix and after-fix screenshots.
- Never fabricate a passing test, deployment, user observation, or screenshot.

## Commit and deployment plan

Do not combine these milestones:

1. `docs: define behavior-measurement rehearsal packet`
2. `feat: scaffold accessible 3d baseline rehearsal`
3. `feat: add observable event trace and human debrief`
4. `feat: add adaptive unseen retest and bounded voice input`
5. `test: verify decision evidence and physical-validation gate`
6. `fix: resolve highest-severity mechanical or persona issue`
7. `docs: record testing persona and demo evidence`

Deploy once after milestone 5. Run the mechanical and persona passes, fix the highest-severity issue, then deploy again after milestone 7. Record both URLs or deployment identifiers in `docs/TESTING.md`. Do not claim a deployment until its public URL has been opened and tested.

## Definition of done

- The live URL completes the required flow without a backend.
- The 3D simulation, adaptive scenario selection, and voice commands change one shared event/evidence loop.
- All Blueprint conditions in the packet are visible in the implementation.
- Mechanical and persona tests are documented, including one bug and one implemented usability fix.
- At least five meaningful commits and two verified deployments exist.
- `DECISIONS.md` includes the final session close and the next first move.

