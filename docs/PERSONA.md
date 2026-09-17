# Persona test — Laura Hernández

Date: 2026-09-16  
Method: synthetic in-chat persona walkthrough requested by the user  
Deployment shown: Deployment 1 at `https://decision-bajo-presion-week-6.vercel.app`

This is not a real participant interview. The pass uses only the five ordered public screenshots below and the declared persona. A capture setup error initially failed to carry Laura's reduced-motion choice into later screens; the images were regenerated before this final pass. The final observations do not include the artificial motion-setting contradiction.

## Persona

Laura Hernández is 47, a primary-school teacher and brigade volunteer in CDMX. She uses WhatsApp and school platforms, has never played a 3D game, reads instructions carefully, dislikes being judged by software, and has mild motion sensitivity. She prefers reduced motion and ordinary buttons; voice is optional, not assumed to be more accessible.

## Screens reviewed in order

1. [Safe start](evidence/persona/screen-1-safe-start.png)
2. [Baseline decision](evidence/persona/screen-2-baseline.png)
3. [Human debrief](evidence/persona/screen-3-human-debrief.png)
4. [Unseen retest](evidence/persona/screen-4-unseen-retest.png)
5. [Evidence comparison](evidence/persona/screen-5-comparison.png)

## In-character walkthrough

### Screen 1 — Safe start

> “I understand that this is a practice exercise using fictional data and that it does not certify how prepared I am. I would choose **Movimiento reducido** and **Vista plana**, leave voice off, and then press **Comenzar ensayo**. The selected radio controls are clear. I understand that I may pause or leave without penalty, although I do not yet see the pause button. I am slightly unsure whether my preferences apply as soon as I select them or only after I begin.”

Laura proceeds. The safety boundary reduces concern about being judged, and the non-3D route is discoverable before entry.

### Screen 2 — Baseline decision

> “I see that this is decision 1 of 3, and the screen confirms **Vista plana** and **Movimiento reducido**, so I trust that my preferences worked. I also notice **Pausar y salir** immediately. I would choose **Observar el entorno y seguir la instrucción vigente**. The phrase ‘Tu selección se registra una vez’ tells me the choice matters, but I hesitate because I do not know whether clicking records it immediately or whether I can correct an accidental click.”

Laura proceeds, but the irreversible-selection model adds avoidable hesitation.

### Screen 3 — Human debrief

> “I understand that the system is showing the three actions and relative times without judging my intention, emotion, or ability. The simulated AI proposes one topic, but a person makes the final decision. I would not press **Confirmo que ocurrió el debrief humano** until I had actually spoken with the responsible person. If that person were not available, I would stop here. I do not see **Pausar y salir** or another clear way to leave without falsely confirming that the conversation happened.”

This is the only observed blocker. The screen correctly protects the human gate, but it removes the safe exit precisely when an external person may be unavailable.

### Screen 4 — Unseen retest

> “I understand that this is a different situation and one new decision. The screen still confirms **Vista plana** and **Movimiento reducido**, and **Pausar y salir** is visible. I would choose **Verificar y seguir la ruta temporal señalizada**. The labels about simulated AI and physical testing tell me that success here still does not prove physical readiness. I still hesitate briefly because selecting appears immediate and final.”

Laura proceeds and correctly understands the retest boundary.

### Screen 5 — Evidence comparison

> “I understand that the behavior appeared after the debrief in the new simulation, but it is not a certification. **Pendiente de validación física** is prominent, and the explanation says that the software cannot close the finding. I would wait for the responsible person to arrange the physical micro-drill. I do not see a digital decision to make, but I would like an unmistakable message that the digital part is finished and a safe way to return to the beginning.”

Laura clearly distinguishes simulated improvement from pending physical validation. The remaining issue is closure of the digital session, not closure of the safety finding.

## Observation log

| Screen | Attempted action | Confusion or hesitation | Severity | Evidence | Fix decision |
|---|---|---|---|---|---|
| 1 | Select reduced motion, flat view, keep voice off, begin | Unsure whether preferences apply immediately or on start | `slows/confuses` | Controls are clear, but copy says only that preferences exist during the session | Clarify that selections apply when the rehearsal begins |
| 1 | Locate the promised pause/exit path | Promise is visible, but control is not present yet | `slows/confuses` | “Puedes pausar o salir sin penalización” without a visible exit control on this screen | Explain that the control appears during rehearsal, or provide a safe exit consistently |
| 2 | Select “Observar el entorno…” | Unsure whether one click records immediately and whether an accidental choice can be corrected | `slows/confuses` | “Tu selección se registra una vez”; no separate confirmation step | State “Al seleccionar, se registra de inmediato” or add a pre-record confirmation pattern |
| 2 | Pause if uncomfortable | No confusion | `none` | **Pausar y salir** is prominent; reduced-motion and flat-view badges are consistent | Preserve placement and labeling |
| 3 | Wait for and complete the human debrief | If the responsible person is unavailable, Laura cannot continue honestly and sees no pause/exit path | `blocks completion` | Human confirmation is required; screenshot has no **Pausar y salir** or equivalent safe exit | Highest-priority fix: retain a clear pause/exit path without bypassing the human gate |
| 3 | Interpret the adaptive focus | No important confusion or sense of automated judgment | `none` | “IA simulada — la decisión final es humana” plus non-diagnostic trace copy | Preserve these boundaries |
| 4 | Select the temporary-route verification | Immediate, irreversible recording still causes brief hesitation | `slows/confuses` | Same one-time recording copy; no confirmation step | Use the same recording clarification chosen for Screen 2 |
| 4 | Understand simulation limits | No confusion | `none` | **IA simulada** and **Requiere prueba física** appear together | Preserve both labels |
| 5 | Hand off to the physical micro-drill | Unsure whether the digital session is formally finished or how to return safely | `slows/confuses` | No final navigation control; software correctly offers no approval control | Add explicit “La parte digital terminó” copy and a non-approval return-to-start action |
| 5 | Interpret the result | No confusion: simulated improvement remains distinct from physical validation | `none` | Approved evidence statement is visually separated from **Pendiente de validación física** | Preserve this hierarchy and wording |

## Required checks

- **Notices Pausar y salir:** yes on Screens 2 and 4; its absence on Screen 3 becomes the principal blocker.
- **Can avoid motion and 3D:** yes. Laura finds both settings before entry, and subsequent screens visibly preserve **Movimiento reducido** and **Vista plana**.
- **Understands when a decision is recorded:** partially. She understands that selection is recorded once but hesitates about whether activation is immediate and reversible.
- **Distinguishes simulated improvement from pending physical validation:** yes. Screens 4 and 5 make the distinction clear.

## Highest-severity finding

**P01 — The required human-debrief screen has no visible pause or exit path.**

Severity: `blocks completion`.

The human gate must remain non-bypassable, but Laura may reach it before the responsible person is available. Without a safe exit, she must either abandon the tab without guidance or falsely confirm that the debrief occurred. The recommended fix is to preserve the gate while making **Pausar y salir** available on Screen 3. This outranks the non-blocking D01 dependency warning and the lower-severity recording/closure ambiguities.

## Retest status

Not started. After P01 is fixed, capture the changed Screen 3 and repeat that screen with the same persona instructions to determine whether Laura can wait or exit without feeling pressured to make a false confirmation.
