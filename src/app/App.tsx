import { useReducer, useRef } from "react";
import { BaselineRehearsal } from "../components/BaselineRehearsal";
import { PauseOverlay } from "../components/PauseOverlay";
import { ScenarioRehearsal } from "../components/ScenarioRehearsal";
import { StartScreen } from "../components/StartScreen";
import { TraceDebrief } from "../components/TraceDebrief";
import { createDecisionEvent } from "../domain/actions";
import { selectRetestScenario } from "../domain/adaptive";
import { BASELINE_SCENARIO } from "../domain/scenarios";
import {
  BASELINE_DECISION_IDS,
  type ActionCode,
  type DecisionEvent,
  type InputMode,
  type ScenarioDefinition,
} from "../domain/types";
import {
  createInitialSessionState,
  sessionReducer,
} from "./sessionReducer";

export function App() {
  const [session, dispatch] = useReducer(
    sessionReducer,
    undefined,
    createInitialSessionState,
  );
  const startedAtRef = useRef<number | null>(null);
  const pauseStartedAtRef = useRef<number | null>(null);
  const pausedDurationRef = useRef(0);

  const canPause = session.phase === "baseline" || session.phase === "retest";
  const baselineEvents = session.events.filter(
    (event) => event.scenarioId === "baseline_corridor_a",
  );
  const adaptiveSelection =
    baselineEvents.length === BASELINE_DECISION_IDS.length
      ? selectRetestScenario(baselineEvents)
      : null;
  const retestEvents = adaptiveSelection
    ? session.events.filter(
        (event) => event.scenarioId === adaptiveSelection.scenario.id,
      )
    : [];

  function startSession() {
    startedAtRef.current = performance.now();
    pauseStartedAtRef.current = null;
    pausedDurationRef.current = 0;
    dispatch({ type: "start" });
  }

  function pauseSession() {
    if (!canPause) {
      return;
    }

    pauseStartedAtRef.current = performance.now();
    dispatch({ type: "pause" });
  }

  function resumeSession() {
    if (pauseStartedAtRef.current !== null) {
      pausedDurationRef.current += performance.now() - pauseStartedAtRef.current;
      pauseStartedAtRef.current = null;
    }
    dispatch({ type: "resume" });
  }

  function exitSession() {
    startedAtRef.current = null;
    pauseStartedAtRef.current = null;
    pausedDurationRef.current = 0;
    dispatch({ type: "exit" });
  }

  function confirmDebrief() {
    startedAtRef.current = performance.now();
    pauseStartedAtRef.current = null;
    pausedDurationRef.current = 0;
    dispatch({ type: "confirm_debrief" });
  }

  function recordScenarioDecision(
    scenario: ScenarioDefinition,
    scenarioEvents: readonly DecisionEvent[],
    expectedPhase: "baseline" | "retest",
    actionCode: ActionCode,
    inputMode: InputMode,
  ) {
    const decision = scenario.decisions[scenarioEvents.length];
    const startedAt = startedAtRef.current;
    if (!decision || startedAt === null || session.phase !== expectedPhase) {
      return;
    }

    const event = createDecisionEvent({
      scenarioId: scenario.id,
      decisionId: decision.id,
      candidateAction: actionCode,
      relativeTimeMs: performance.now() - startedAt - pausedDurationRef.current,
      inputMode,
    });

    if (event) {
      dispatch({ type: "record_event", event });
    }
  }

  const liveStatus =
    session.phase === "intro"
      ? "Configuración inicial"
      : session.phase === "paused"
        ? "Sesión pausada"
        : session.phase === "debrief"
          ? "Escenario inicial completado"
          : session.phase === "retest"
            ? "Retest no visto en curso"
            : session.phase === "comparison"
              ? "Retest no visto completado"
              : "Ensayo iniciado";

  return (
    <div className="app-shell" data-motion={session.settings.motion}>
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Decisión Bajo Presión, inicio">
          <span className="brand-mark" aria-hidden="true">
            DBP
          </span>
          <span>
            <strong>Decisión Bajo Presión</strong>
            <small>Prototipo · datos ficticios</small>
          </span>
        </a>
        {canPause ? (
          <button
            className="pause-button"
            type="button"
            onClick={pauseSession}
          >
            <span aria-hidden="true">II</span>
            Pausar y salir
          </button>
        ) : null}
      </header>

      <p className="sr-only" aria-live="polite">
        {liveStatus}
      </p>

      {session.phase === "intro" ? (
        <StartScreen
          settings={session.settings}
          onMotionChange={(motion) =>
            dispatch({ type: "set_motion", motion })
          }
          onViewChange={(view) => dispatch({ type: "set_view", view })}
          onVoiceChange={(enabled) =>
            dispatch({ type: "set_voice_enabled", enabled })
          }
          onStart={startSession}
        />
      ) : session.phase === "paused" ? (
        <PauseOverlay
          onResume={resumeSession}
          onExit={exitSession}
        />
      ) : session.phase === "baseline" ? (
        <BaselineRehearsal
          events={baselineEvents}
          motion={session.settings.motion}
          view={session.settings.view}
          onDecision={(actionCode, inputMode) =>
            recordScenarioDecision(
              BASELINE_SCENARIO,
              baselineEvents,
              "baseline",
              actionCode,
              inputMode,
            )
          }
        />
      ) : session.phase === "debrief" && adaptiveSelection ? (
        <TraceDebrief
          events={baselineEvents}
          behaviorCode={adaptiveSelection.behaviorCode}
          onConfirm={confirmDebrief}
        />
      ) : session.phase === "retest" && adaptiveSelection ? (
        <ScenarioRehearsal
          scenario={adaptiveSelection.scenario}
          events={retestEvents}
          motion={session.settings.motion}
          view={session.settings.view}
          onDecision={(actionCode, inputMode) =>
            recordScenarioDecision(
              adaptiveSelection.scenario,
              retestEvents,
              "retest",
              actionCode,
              inputMode,
            )
          }
        />
      ) : session.phase === "comparison" ? (
        <main id="main-content" className="session-page">
          <section className="session-placeholder" aria-labelledby="session-title">
            <div className="session-meta">
              <span>Paso 5 de 5</span>
              <span>Retest no visto completado</span>
            </div>
            <p className="eyebrow">Decisión registrada</p>
            <h1 id="session-title">Comparación preparada</h1>
            <p>
              La evidencia del escenario inicial y del retest está en memoria. La
              comparación y la validación física se incorporarán en Feature 7.
            </p>
          </section>
        </main>
      ) : (
        <main id="main-content" className="session-page">
          <p>Esta fase todavía no está disponible.</p>
        </main>
      )}

      <footer className="site-footer">
        <p>Ejercicio de demostración. No sustituye un simulacro físico.</p>
        <p>Sin cuentas · sin perfiles · sin puntuación de preparación</p>
      </footer>
    </div>
  );
}
