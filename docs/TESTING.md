# Testing and security evidence

Last updated: 2026-09-16  
Pre-deployment source revision: the `test: verify evidence loop and security floor` commit containing this record  
Environment: macOS, Node.js 20+, Google Chrome through Playwright 1.63.0

## Mechanical pass

| ID | Status | Evidence |
|---|---|---|
| M01 | Pass | `tests/adaptive.test.ts` exhaustively maps each missed baseline behavior to its intended retest family. |
| M02 | Pass | `tests/adaptive.test.ts` asserts that every retest has a different scenario ID and disruption from the baseline. |
| M03 | Pass | `tests/actions.test.ts`, `tests/baseline.test.tsx`, and `tests/voice.test.tsx` verify that pointer, keyboard, and bounded voice inputs resolve through the shared action validator. |
| M04 | Pass | `tests/actions.test.ts` and `tests/voice.test.tsx` reject empty, unrelated, overlong, unsupported, denied, and failed speech without appending an event. |
| M05 | Pass | `tests/comparison.test.ts` and `tests/comparisonScreen.test.tsx` exhaustively cover the three approved evidence statements and exactly one rendered statement. |
| M06 | Pass | `tests/comparison.test.ts` asserts the literal `physicalValidation: "pending"`; `tests/comparisonScreen.test.tsx` finds the gate and no closure button. |
| M07 | Pass | `tests/events.test.ts` asserts the exact five-field event schema and rejects invalid actions, timing, input modes, and scenarios. |
| M08 | Pass | `tests/voice.test.tsx` proves recognition is not constructed or started before the explicit **Escuchar comando** action. |
| M09 | Pass | `tests/voice.test.tsx` confirms unsupported, permission-denied, network-error, and recognition-error states leave visible buttons usable. |
| M10 | Pass | `tests/session.test.tsx`, `tests/baseline.test.tsx`, `tests/debrief.test.tsx`, `tests/retest.test.tsx`, and `tests/sessionReducer.test.ts` verify pause availability, focus transfer, phase preservation, and zero evidence or confirmation creation in baseline, human debrief, and retest. |
| M11 | Pass | `e2e/evidence-loop.spec.ts` completes the entire flat-view journey with native Tab, arrow-key, Enter, and Space patterns; component tests confirm pointer/keyboard action parity. |
| M12 | Pass | Playwright completes baseline → pause/resume → neutral trace → debrief pause/resume → human-debrief acknowledgment → different unseen retest → comparison and finds the immutable physical gate. |
| M13 | Pass | The Playwright journey reloads after comparison and observes the clean start screen with no retained result; component tests also cover remount and exit resets. |
| M14 | Pass | Playwright repeats the complete flow at 390 × 844 and checks for horizontal overflow after every transition. Desktop and mobile screenshots were visually inspected. |
| M15 | Pass | Lint, 69 Vitest tests, 4 Playwright tests, strict TypeScript, production build, tracked-source scans, fixture review, same-origin GET-only browser request assertion, and production dependency audit all pass. |

## Recorded screenshots

- [M12 desktop comparison](evidence/m12-desktop-comparison.png)
- [M14 mobile comparison](evidence/m14-mobile-comparison.png)
- [M14 mobile physical-validation gate](evidence/m14-mobile-physical-gate.png)

The screenshots contain only invented demonstration content. They show the approved after-debrief statement and the still-open physical-validation gate; they contain no participant, school, or location data.

## Command record

Run from the repository root:

```bash
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
pnpm audit --prod
git diff --check
```

Results on 2026-09-16:

- ESLint: passed with no findings.
- Vitest: 69 tests passed across 11 files.
- Playwright: 4 tests passed in installed Google Chrome.
- Strict TypeScript: passed.
- Vite production build: passed.
- Production dependency audit: no known vulnerabilities.
- Diff whitespace check: passed.
- Production output: `dist/index.html` 0.54 kB, initial JavaScript 223.07 kB (69.25 kB gzip), CSS 19.23 kB (4.65 kB gzip), lazy 3D chunk 895.68 kB (236.51 kB gzip).

The Playwright configuration uses the installed stable Chrome channel. The browser download command timed out against the Playwright CDN in this environment, so no downloaded Chromium binary was used. This did not weaken the browser checks: all four tests ran in the installed Chrome browser and passed.

## Five-check security floor

### 1. No secrets or required environment variables

- `.gitignore` excludes `.env` and `.env.*`, while allowing a documented `.env.example` if one is ever needed.
- `git ls-files | rg '(^|/)\.env($|\.)'` returned no tracked environment file.
- The tracked application, tests, configuration, and package manifest were scanned for assigned API keys, client secrets, access tokens, passwords, and credentials; the scan returned no match.
- The app requires no environment variable or third-party service key.

### 2. No personal data; authentication is unnecessary

- The UI requests no name, email, school, location, file, free text, biometric, profile, or identity field.
- The source scan found no text, email, file, password, or textarea input.
- The event contract stores only `scenarioId`, `decisionId`, `actionCode`, `relativeTimeMs`, and `inputMode`.
- Reload, remount, and **Salir sin guardar** tests all clear the in-memory session.

### 3. No database or user table; Row Level Security is not applicable

- `package.json` and the lockfile contain no Supabase, Firebase, authentication, analytics, error-reporting, or HTTP-client dependency.
- The application source contains no `localStorage`, `sessionStorage`, IndexedDB, cookie, `fetch`, XHR, WebSocket, beacon, or geolocation use.
- The Playwright journey observes only same-origin `GET` requests for application resources. Voice was disabled, so no browser-provider speech request occurred.
- Because there is no database, user table, or persisted account, Row Level Security has no applicable object to protect.

### 4. Every accepted input is allow-listed

- Decision IDs, action codes, scenarios, phases, evidence statements, and input modes are closed TypeScript unions derived from readonly constants.
- Pointer, keyboard, and voice candidates all enter `createDecisionEvent` and are checked against the current scenario decision.
- Voice accepts only the documented bounded Spanish commands, is one-shot, and discards recognized text immediately after mapping.
- Unknown, empty, unrelated, overlong, out-of-order, duplicate, wrong-family, and post-completion inputs are covered by passing tests.

### 5. All fixtures and screenshots are fictional

- The scenarios use a generic fictional corridor, anonymous figures, generic route signs, and fictional scenario IDs.
- No real person, school, organization, address, building plan, incident, voice recording, or operational route appears in source fixtures or captured evidence.
- The interface and footer label the experience as a demonstration prototype that cannot replace a physical drill or certify readiness.

## Risks carried into Deployment 1

- The optional Three.js path is correctly lazy-loaded, but its 895.68 kB minified chunk exceeds Vite's 500 kB warning threshold. The safe start and flat-view paths do not load it. Public-load behavior must be inspected on Deployment 1.
- Browser speech recognition depends on browser support and may use a browser-provider service only after explicit opt-in. Deployment verification will not grant microphone permission or transmit speech.

## Deployment 1

| Field | Verified value |
|---|---|
| Vercel project | `davidbuzali/decision-bajo-presion-week-6` |
| GitHub source | `davidbuzali/decision-bajo-presion-week-6`, connected by Vercel |
| Source commit | `48507716c946379d62940b585e557a5bbc1373b5` |
| Deployment ID | `dpl_4EpMNwyanWvVaYjfsYa6wwPmXgZW` |
| Created | `2026-09-17T02:27:32Z` |
| Target/status | Production / Ready |
| Immutable URL | `https://decision-bajo-presion-week-6-4mvth3w0g-davidbuzali.vercel.app` |
| Production alias | `https://decision-bajo-presion-week-6.vercel.app` |

Public verification passed on 2026-09-17:

- Vercel installed the locked dependencies and completed `pnpm run build` successfully.
- The public safe start rendered without authentication or Deployment Protection.
- The production alias returned HTTP 200 with Vercel caching and `strict-transport-security: max-age=63072000; includeSubDomains; preload`.
- The complete flat-view journey passed: baseline → pause/resume → neutral trace → human debrief → different unseen retest → approved comparison statement → **Pendiente de validación física**.
- A real public reload returned to the clean start screen with no retained result.
- The browser-loaded HTML referenced only same-origin hashed JavaScript and CSS assets.
- The public Playwright command below passed all three browser checks, including the 390 × 844 flow, reload reset, same-origin `GET` request assertion, and lazy 3D canvas smoke test.
- The optional 3D corridor rendered successfully from `ScenarioScene3D-DfWDNpEi.js`.

```bash
PLAYWRIGHT_BASE_URL=https://decision-bajo-presion-week-6.vercel.app pnpm test:e2e
```

Result: 3 tests passed in 12.9 seconds.

### Real defect D01 — upstream 3D deprecation warning

| Item | Evidence |
|---|---|
| Severity | Low engineering risk; no user-visible blockage |
| Reproduction | Open the production alias, keep the default 3D view, select **Comenzar ensayo**, then inspect the browser console. |
| Expected | The lazy 3D corridor renders without runtime warnings. |
| Actual | The corridor renders, but the console reports: `THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.` |
| Root cause | `@react-three/fiber@9.7.0` constructs `new THREE.Clock()` in its distributed renderer while `three@0.186.0` marks that class deprecated. The warning originates from the hashed lazy 3D chunk, not application scenario code. |
| Screenshot | [Deployment 1 public 3D corridor](evidence/deployment-1-3d.png) |
| Current decision | Keep open for the required post-persona fix decision. Compare its low severity with any persona blockers before choosing commit 8; do not hide or suppress the warning without resolving dependency compatibility. |

The warning does not appear in the flat-view journey and did not prevent the public 3D canvas from rendering. It is recorded as a real defect, not presented as a fixed issue.

## Deployment 2 — P01 correction

| Field | Verified value |
|---|---|
| Vercel project | `davidbuzali/decision-bajo-presion-week-6` |
| GitHub source | `davidbuzali/decision-bajo-presion-week-6`, connected by Vercel |
| Source commit | `9bee7474b21ca55dda5a57f39bb2f179b2ec64bf` |
| Deployment ID | `dpl_4qQGk7tec6tTKgrAP5KFVg6QfUfw` |
| Created | `2026-09-17T02:55:31Z` |
| Target/status | Production / Ready |
| Immutable URL | `https://decision-bajo-presion-week-6-9jxb2r2dx-davidbuzali.vercel.app` |
| Production alias | `https://decision-bajo-presion-week-6.vercel.app` |

Public verification passed on 2026-09-17:

- The stable alias returned HTTP 200 with a Vercel cache hit and `strict-transport-security: max-age=63072000; includeSubDomains; preload`.
- All four Playwright checks passed against the public alias in 13.7 seconds.
- Screen 3 visibly exposes **Pausar y salir** before the human-debrief confirmation.
- Pausing from Screen 3 opens the neutral pause overlay without creating a decision or satisfying the human gate.
- The human confirmation is unavailable while paused; resuming returns to the same debrief with its evidence intact.
- The unseen retest remains inaccessible until the participant explicitly confirms that the human debrief occurred.
- The changed Screen 3 was recaptured from the public deployment and repeated with Laura's original persona instructions.
- The immutable physical-validation gate, reload privacy reset, 390 × 844 layout, request-origin assertion, and lazy 3D canvas continue to pass.

P01 is resolved. D01 remains open as a low-severity upstream deprecation warning and did not block Deployment 2.
