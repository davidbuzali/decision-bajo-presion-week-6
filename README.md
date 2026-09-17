# Decisión Bajo Presión

Week 6 working slice attacking **The MEASUREMENT vacuum**: a browser-based emergency decision rehearsal for adult school staff in Mexico. The team's specific interpretation is behavior measurement—whether rehearsal changes observable decisions when the expected plan stops working.

The planned product combines a screen-based 3D simulation, transparent adaptive logic, and optional bounded voice commands. It records narrow observable actions, supports a human-led debrief, and presents a different unseen retest. Critical behaviors remain pending physical validation; the software does not certify readiness or replace civil-protection professionals.

## Current stage

Features 1–7 complete: the Vite/React/TypeScript working slice now supports a safe Spanish start, in-memory accessibility preferences, an accessible pause-and-exit shell, the baseline, neutral event trace, deterministic behavior targeting, human-debrief gate, selected unseen retest, explicitly activated bounded Spanish voice commands, and the final evidence comparison. Screen 5 presents exactly one approved behavior statement and keeps every result **Pendiente de validación física** without any digital approval or closure control. Buttons, keyboard, and voice share one validated action pipeline; recognized text is discarded immediately, and reloading clears the complete session.

- Product packet: [`docs/PACKET.md`](docs/PACKET.md)
- Implementation prompt: [`docs/IMPLEMENTATION_PROMPT.md`](docs/IMPLEMENTATION_PROMPT.md)
- Image-generation prompt: [`docs/IMAGE_PROMPT.md`](docs/IMAGE_PROMPT.md)
- Testing and security evidence: [`docs/TESTING.md`](docs/TESTING.md)
- Decision log: [`DECISIONS.md`](DECISIONS.md)

## Local checks

Requires Node.js 20 or newer and pnpm.

```bash
pnpm install
pnpm lint
pnpm test
pnpm build
```

The production bundle is written to `dist/`.

## Planned deployment

The working application will be deployed on Vercel after the initial build and again after the documented test-fix cycle.
