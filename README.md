# Decisión Bajo Presión

Week 6 working slice attacking **The MEASUREMENT vacuum**: a browser-based emergency decision rehearsal for adult school staff in Mexico. The team's specific interpretation is behavior measurement—whether rehearsal changes observable decisions when the expected plan stops working.

The planned product combines a screen-based 3D simulation, transparent adaptive logic, and optional bounded voice commands. It records narrow observable actions, supports a human-led debrief, and presents a different unseen retest. Critical behaviors remain pending physical validation; the software does not certify readiness or replace civil-protection professionals.

## Current stage

Feature 1 complete: Vite/React/TypeScript foundation plus pure, tested domain contracts for actions, observable events, adaptive retest selection, and comparison evidence. The interactive five-screen experience is intentionally not implemented yet.

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
