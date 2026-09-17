import { useReducer } from "react";
import { PauseOverlay } from "../components/PauseOverlay";
import { StartScreen } from "../components/StartScreen";
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

  const liveStatus =
    session.phase === "intro"
      ? "Configuración inicial"
      : session.phase === "paused"
        ? "Sesión pausada"
        : "Ensayo iniciado";

  return (
    <div className="app-shell">
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
        {session.phase !== "intro" && session.phase !== "paused" ? (
          <button
            className="pause-button"
            type="button"
            onClick={() => dispatch({ type: "pause" })}
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
          onStart={() => dispatch({ type: "start" })}
        />
      ) : session.phase === "paused" ? (
        <PauseOverlay
          onResume={() => dispatch({ type: "resume" })}
          onExit={() => dispatch({ type: "exit" })}
        />
      ) : (
        <main id="main-content" className="session-page">
          <section className="session-placeholder" aria-labelledby="session-title">
            <div className="session-meta">
              <span>Paso 1 de 5</span>
              <span>
                {session.settings.view === "three_d"
                  ? "Vista 3D en pantalla"
                  : "Vista plana"}
              </span>
              <span>
                {session.settings.motion === "reduced"
                  ? "Movimiento reducido"
                  : "Movimiento normal"}
              </span>
            </div>
            <p className="eyebrow">Sesión preparada</p>
            <h1 id="session-title">Escenario inicial</h1>
            <p>
              La configuración accesible y el control de pausa están activos. El
              escenario de decisiones se incorporará en el siguiente incremento.
            </p>
            {session.settings.voiceEnabled ? (
              <p className="inline-status">
                Voz preparada, todavía sin solicitar acceso al micrófono.
              </p>
            ) : null}
          </section>
        </main>
      )}

      <footer className="site-footer">
        <p>Ejercicio de demostración. No sustituye un simulacro físico.</p>
        <p>Sin cuentas · sin perfiles · sin puntuación de preparación</p>
      </footer>
    </div>
  );
}
