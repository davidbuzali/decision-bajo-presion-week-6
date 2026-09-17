# Decisión Bajo Presión

Week 6 working slice attacking **The MEASUREMENT vacuum**: a browser-based emergency decision rehearsal for adult school staff in Mexico. The team's specific interpretation is behavior measurement—whether rehearsal changes observable decisions when the expected plan stops working.

The planned product combines a screen-based 3D simulation, transparent adaptive logic, and optional bounded voice commands. It records narrow observable actions, supports a human-led debrief, and presents a different unseen retest. Critical behaviors remain pending physical validation; the software does not certify readiness or replace civil-protection professionals.

## Current stage

Features 1–5 complete: the Vite/React/TypeScript foundation and pure domain contracts now support a safe Spanish start, in-memory accessibility preferences, an accessible pause-and-exit shell, the three-decision baseline, a neutral event trace, deterministic behavior targeting, a required human-debrief acknowledgment, and the selected unseen retest. Baseline and retest share the same primitive 3D/flat presentation, action validation, timing, pause, and event pipeline. The evidence comparison remains an explicit Feature 7 boundary.

- Product packet: [`docs/PACKET.md`](docs/PACKET.md)
- Implementation prompt: [`docs/IMPLEMENTATION_PROMPT.md`](docs/IMPLEMENTATION_PROMPT.md)
- Image-generation prompt: [`docs/IMAGE_PROMPT.md`](docs/IMAGE_PROMPT.md)
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
