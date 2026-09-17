import { useReducer, useRef } from "react";
import { BaselineRehearsal } from "../components/BaselineRehearsal";
import { PauseOverlay } from "../components/PauseOverlay";
import { StartScreen } from "../components/StartScreen";
import { TraceDebrief } from "../components/TraceDebrief";
import { createDecisionEvent } from "../domain/actions";
import { selectRetestScenario } from "../domain/adaptive";
import {
  BASELINE_DECISION_IDS,
  type ActionCode,
  type InputMode,
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

  const canPause = session.phase === "baseline";
  const baselineEvents = session.events.filter(
    (event) => event.scenarioId === "baseline_corridor_a",
  );
  const adaptiveSelection =
    baselineEvents.length === BASELINE_DECISION_IDS.length
      ? selectRetestScenario(baselineEvents)
      : null;

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

  function recordBaselineDecision(actionCode: ActionCode, inputMode: InputMode) {
    const decision = BASELINE_DECISION_IDS[baselineEvents.length];
    const startedAt = startedAtRef.current;
    if (!decision || startedAt === null || session.phase !== "baseline") {
      return;
    }

    const event = createDecisionEvent({
      scenarioId: "baseline_corridor_a",
      decisionId: decision,
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
            ? "Debrief confirmado; retest pendiente"
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
          onDecision={recordBaselineDecision}
        />
      ) : session.phase === "debrief" && adaptiveSelection ? (
        <TraceDebrief
          events={baselineEvents}
          behaviorCode={adaptiveSelection.behaviorCode}
          onConfirm={() => dispatch({ type: "confirm_debrief" })}
        />
      ) : session.phase === "retest" ? (
        <main id="main-content" className="session-page">
          <section className="session-placeholder" aria-labelledby="session-title">
            <div className="session-meta">
              <span>Paso 4 de 5</span>
              <span>Debrief confirmado en esta sesión</span>
            </div>
            <p className="eyebrow">Siguiente incremento</p>
            <h1 id="session-title">Retest no visto preparado</h1>
            <p>
              El escenario adaptativo reutilizará este flujo de decisiones en
              Feature 5. Sus condiciones y opciones todavía no se muestran.
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
