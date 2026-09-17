import type {
  MotionPreference,
  SessionSettings,
  ViewPreference,
} from "../app/sessionReducer";

type StartScreenProps = Readonly<{
  settings: SessionSettings;
  onMotionChange: (motion: MotionPreference) => void;
  onViewChange: (view: ViewPreference) => void;
  onVoiceChange: (enabled: boolean) => void;
  onStart: () => void;
}>;

export function StartScreen({
  settings,
  onMotionChange,
  onViewChange,
  onVoiceChange,
  onStart,
}: StartScreenProps) {
  return (
    <main id="main-content" className="start-layout">
      <section className="intro-copy" aria-labelledby="app-title">
        <p className="eyebrow">Ensayo de decisiones · Prototipo educativo</p>
        <h1 id="app-title">Decisión Bajo Presión</h1>
        <p className="lede">
          Practica qué hacer cuando el plan esperado deja de funcionar. Primero
          observaremos decisiones concretas; después una persona responsable
          realizará el debrief.
        </p>

        <div className="boundary-grid" aria-label="Límites del prototipo">
          <article className="boundary-card boundary-card--positive">
            <span className="boundary-icon" aria-hidden="true">
              ✓
            </span>
            <div>
              <h2>Qué registra</h2>
              <p>Opciones predefinidas y tiempo relativo dentro del ejercicio.</p>
            </div>
          </article>
          <article className="boundary-card">
            <span className="boundary-icon" aria-hidden="true">
              —
            </span>
            <div>
              <h2>Qué no concluye</h2>
              <p>
                No certifica preparación, competencia, seguridad ni resultados
                en una emergencia real.
              </p>
            </div>
          </article>
        </div>

        <p className="privacy-note">
          No pedimos nombre, correo, escuela, ubicación ni datos biométricos.
          Puedes pausar o salir sin penalización.
        </p>
      </section>

      <section className="setup-card" aria-labelledby="setup-title">
        <div className="setup-heading">
          <p className="step-label">Antes de comenzar</p>
          <h2 id="setup-title">Configura tu experiencia</h2>
          <p>Estas preferencias existen solo durante esta sesión.</p>
        </div>

        <fieldset className="choice-group">
          <legend>Movimiento</legend>
          <label className="choice-card">
            <input
              type="radio"
              name="motion"
              value="standard"
              checked={settings.motion === "standard"}
              onChange={() => onMotionChange("standard")}
            />
            <span>
              <strong>Movimiento normal</strong>
              <small>Transiciones y cámara suave.</small>
            </span>
          </label>
          <label className="choice-card">
            <input
              type="radio"
              name="motion"
              value="reduced"
              checked={settings.motion === "reduced"}
              onChange={() => onMotionChange("reduced")}
            />
            <span>
              <strong>Movimiento reducido</strong>
              <small>Sin movimiento de cámara ni efectos innecesarios.</small>
            </span>
          </label>
        </fieldset>

        <fieldset className="choice-group">
          <legend>Vista</legend>
          <label className="choice-card">
            <input
              type="radio"
              name="view"
              value="three_d"
              checked={settings.view === "three_d"}
              onChange={() => onViewChange("three_d")}
            />
            <span>
              <strong>Simulación 3D en pantalla</strong>
              <small>No es realidad virtual.</small>
            </span>
          </label>
          <label className="choice-card">
            <input
              type="radio"
              name="view"
              value="flat"
              checked={settings.view === "flat"}
              onChange={() => onViewChange("flat")}
            />
            <span>
              <strong>Vista plana</strong>
              <small>Las mismas decisiones sin escena 3D.</small>
            </span>
          </label>
        </fieldset>

        <div className="voice-setting">
          <label className="switch-row">
            <input
              type="checkbox"
              checked={settings.voiceEnabled}
              onChange={(event) => onVoiceChange(event.target.checked)}
            />
            <span>
              <strong>Preparar controles de voz opcionales</strong>
              <small>También podrás completar todo con botones y teclado.</small>
            </span>
          </label>
          <p>
            No se solicitará acceso al micrófono hasta que elijas “Escuchar
            comando”. Algunos navegadores pueden enviar el audio a su proveedor
            para reconocerlo. Esta aplicación no guarda audio ni transcripciones.
          </p>
        </div>

        <button className="primary-button" type="button" onClick={onStart}>
          Comenzar ensayo
          <span aria-hidden="true">→</span>
        </button>
      </section>
    </main>
  );
}
