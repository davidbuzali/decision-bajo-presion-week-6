type PauseOverlayProps = Readonly<{
  onResume: () => void;
  onExit: () => void;
}>;

export function PauseOverlay({ onResume, onExit }: PauseOverlayProps) {
  return (
    <main id="main-content" className="pause-page">
      <section
        className="pause-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pause-title"
        aria-describedby="pause-description"
      >
        <span className="pause-mark" aria-hidden="true">
          II
        </span>
        <p className="eyebrow">Sesión en pausa</p>
        <h1 id="pause-title">Tómate el tiempo que necesites</h1>
        <p id="pause-description">
          Pausar no registra una decisión ni cuenta como error. Tu avance existe
          solo en esta pestaña mientras continúas la sesión.
        </p>
        <div className="pause-actions">
          <button
            className="primary-button"
            type="button"
            autoFocus
            onClick={onResume}
          >
            Reanudar ensayo
          </button>
          <button className="secondary-button" type="button" onClick={onExit}>
            Salir sin guardar
          </button>
        </div>
      </section>
    </main>
  );
}
