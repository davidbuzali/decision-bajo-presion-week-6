import { lazy, Suspense } from "react";
import type { MotionPreference, ViewPreference } from "../app/sessionReducer";
import { BASELINE_SCENARIO } from "../domain/scenarios";
import type {
  ActionCode,
  DecisionEvent,
  InputMode,
  ScenarioDecision,
} from "../domain/types";

const ScenarioScene3D = lazy(async () => {
  const module = await import("./ScenarioScene3D");
  return { default: module.ScenarioScene3D };
});

type BaselineRehearsalProps = Readonly<{
  events: readonly DecisionEvent[];
  motion: MotionPreference;
  view: ViewPreference;
  onDecision: (actionCode: ActionCode, inputMode: InputMode) => void;
}>;

const SCENE_STATES = [
  {
    title: "Alerta activa",
    description: "Observa el entorno antes de iniciar el movimiento.",
  },
  {
    title: "Salida principal bloqueada",
    description: "La ruta esperada ya no está disponible.",
  },
  {
    title: "Conteo incompleto",
    description: "Una persona asignada no aparece en el punto de reunión.",
  },
] as const;

const BASELINE_DECISIONS: readonly ScenarioDecision[] =
  BASELINE_SCENARIO.decisions;

export function BaselineRehearsal({
  events,
  motion,
  view,
  onDecision,
}: BaselineRehearsalProps) {
  const decisionIndex = events.length;
  const decision = BASELINE_DECISIONS[decisionIndex];
  const sceneState = SCENE_STATES[decisionIndex];
  const previousEvent = events.at(-1);
  const previousOption = previousEvent
    ? BASELINE_DECISIONS
        .flatMap((item) => item.options)
        .find((option) => option.actionCode === previousEvent.actionCode)
    : undefined;

  if (!decision || !sceneState) {
    return null;
  }

  return (
    <main id="main-content" className="rehearsal-page">
      <section className="rehearsal-heading" aria-labelledby="decision-title">
        <div>
          <p className="eyebrow">{BASELINE_SCENARIO.title}</p>
          <h1 id="decision-title">{decision.prompt}</h1>
        </div>
        <div className="rehearsal-badges" aria-label="Estado del ensayo">
          <span>Decisión {decisionIndex + 1} de 3</span>
          <span>
            {view === "three_d"
              ? "3D en pantalla · No es realidad virtual"
              : "Vista plana · Mismas decisiones"}
          </span>
        </div>
      </section>

      <div className="rehearsal-layout">
        <section className="scene-panel" aria-labelledby="scene-state-title">
          <div className="scene-panel__topline">
            <span>Entorno ficticio</span>
            <span>{motion === "reduced" ? "Movimiento reducido" : "Movimiento normal"}</span>
          </div>

          {view === "three_d" ? (
            <Suspense
              fallback={
                <div className="scene-canvas scene-loading" role="status">
                  Preparando vista 3D…
                </div>
              }
            >
              <ScenarioScene3D decisionIndex={decisionIndex} motion={motion} />
            </Suspense>
          ) : (
            <div
              className="flat-scene"
              role="img"
              aria-label="Resumen textual del corredor escolar ficticio"
            >
              <span className="flat-scene__route" aria-hidden="true">→</span>
              <span className="flat-scene__door" aria-hidden="true">SALIDA</span>
              {decisionIndex >= 1 ? (
                <span className="flat-scene__block" aria-hidden="true">BLOQUEADA</span>
              ) : null}
              <span className="flat-scene__people" aria-hidden="true">● ● ●</span>
            </div>
          )}

          <div className="scene-status">
            <span className="scene-status__pulse" aria-hidden="true" />
            <div>
              <h2 id="scene-state-title">{sceneState.title}</h2>
              <p>{sceneState.description}</p>
            </div>
          </div>
        </section>

        <section className="decision-panel" aria-labelledby="options-title">
          <p className="step-label">Elige una acción observable</p>
          <h2 id="options-title">¿Qué decides?</h2>
          <p className="decision-help">
            Tu selección se registra una vez. No hay puntuación ni diagnóstico.
          </p>
          <div className="decision-options">
            {decision.options.map((option, index) => (
              <button
                key={option.actionCode}
                type="button"
                className="decision-option"
                onClick={(event) =>
                  onDecision(
                    option.actionCode,
                    event.detail === 0 ? "keyboard" : "pointer",
                  )
                }
              >
                <span aria-hidden="true">{index + 1}</span>
                <strong>{option.label}</strong>
              </button>
            ))}
          </div>
          <p className="keyboard-hint">Usa Tab para recorrer y Enter o Espacio para elegir.</p>
        </section>
      </div>

      <p className="decision-confirmation" aria-live="polite" aria-atomic="true">
        {previousOption
          ? `Decisión registrada: ${previousOption.label}. Continúa con la siguiente situación.`
          : "Aún no se ha registrado una decisión."}
      </p>
    </main>
  );
}
