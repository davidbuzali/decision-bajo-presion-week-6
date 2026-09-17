import { lazy, Suspense } from "react";
import type { MotionPreference, ViewPreference } from "../app/sessionReducer";
import type {
  ActionCode,
  DecisionEvent,
  InputMode,
  ScenarioDefinition,
} from "../domain/types";
import { scenePresentation, sceneStatus } from "./scenarioPresentation";
import { VoiceControl } from "./VoiceControl";

const ScenarioScene3D = lazy(async () => {
  const module = await import("./ScenarioScene3D");
  return { default: module.ScenarioScene3D };
});

export type ScenarioRehearsalProps = Readonly<{
  scenario: ScenarioDefinition;
  events: readonly DecisionEvent[];
  motion: MotionPreference;
  view: ViewPreference;
  voiceEnabled?: boolean;
  onVoicePause?: () => void;
  onDecision: (actionCode: ActionCode, inputMode: InputMode) => void;
}>;

export function ScenarioRehearsal({
  scenario,
  events,
  motion,
  view,
  voiceEnabled = false,
  onVoicePause,
  onDecision,
}: ScenarioRehearsalProps) {
  const decisionIndex = events.length;
  const decision = scenario.decisions[decisionIndex];
  const status = sceneStatus(scenario, decisionIndex);
  const presentation = scenePresentation(scenario.id, decisionIndex);
  const previousEvent = events.at(-1);
  const previousOption = previousEvent
    ? scenario.decisions
        .flatMap((item) => item.options)
        .find((option) => option.actionCode === previousEvent.actionCode)
    : undefined;

  if (!decision || !status) {
    return null;
  }

  const isRetest = scenario.kind === "retest";

  return (
    <main id="main-content" className="rehearsal-page">
      <section className="rehearsal-heading" aria-labelledby="decision-title">
        <div>
          <p className="eyebrow">
            {isRetest ? "Escenario B — retest no visto" : scenario.title}
          </p>
          <h1 id="decision-title">{decision.prompt}</h1>
        </div>
        <div className="rehearsal-badges" aria-label="Estado del ensayo">
          <span>
            Decisión {decisionIndex + 1} de {scenario.decisions.length}
          </span>
          <span>
            {view === "three_d"
              ? "3D en pantalla · No es realidad virtual"
              : "Vista plana · Mismas decisiones"}
          </span>
        </div>
      </section>

      {isRetest ? (
        <div className="retest-notices" aria-label="Límites del retest">
          <span>IA simulada — la decisión final es humana</span>
          <span>Requiere prueba física</span>
        </div>
      ) : null}

      <div className="rehearsal-layout">
        <section className="scene-panel" aria-labelledby="scene-state-title">
          <div className="scene-panel__topline">
            <span>Entorno ficticio</span>
            <span>
              {motion === "reduced" ? "Movimiento reducido" : "Movimiento normal"}
            </span>
          </div>

          {view === "three_d" ? (
            <Suspense
              fallback={
                <div className="scene-canvas scene-loading" role="status">
                  Preparando vista 3D…
                </div>
              }
            >
              <ScenarioScene3D
                scenarioId={scenario.id}
                decisionIndex={decisionIndex}
                motion={motion}
              />
            </Suspense>
          ) : (
            <div
              className="flat-scene"
              role="img"
              aria-label="Resumen textual del corredor escolar ficticio"
            >
              <span className="flat-scene__route" aria-hidden="true">
                →
              </span>
              {presentation.conflictingSigns ? (
                <span
                  className="flat-scene__route flat-scene__route--conflict"
                  aria-hidden="true"
                >
                  ←
                </span>
              ) : null}
              <span className="flat-scene__door" aria-hidden="true">
                SALIDA
              </span>
              {presentation.routeBlocked ? (
                <span className="flat-scene__block" aria-hidden="true">
                  BLOQUEADA
                </span>
              ) : null}
              <span
                className={`flat-scene__people${
                  presentation.countAttention || presentation.assistanceNeeded
                    ? " flat-scene__people--attention"
                    : ""
                }`}
                aria-hidden="true"
              >
                ● ● ●
              </span>
              {presentation.assistanceNeeded ? (
                <span className="flat-scene__support" aria-hidden="true">
                  APOYO
                </span>
              ) : null}
            </div>
          )}

          <div className="scene-status">
            <span className="scene-status__pulse" aria-hidden="true" />
            <div>
              <h2 id="scene-state-title">{status.title}</h2>
              <p>{status.description}</p>
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
          {voiceEnabled ? (
            <VoiceControl
              key={decision.id}
              decisionId={decision.id}
              onDecision={onDecision}
              onPause={() => onVoicePause?.()}
            />
          ) : null}
          <p className="keyboard-hint">
            Usa Tab para recorrer y Enter o Espacio para elegir.
          </p>
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
