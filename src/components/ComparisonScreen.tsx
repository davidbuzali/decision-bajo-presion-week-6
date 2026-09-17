import type {
  BehaviorCode,
  ComparisonResult,
  EvidenceStatement,
} from "../domain/types";

type ComparisonScreenProps = Readonly<{
  result: ComparisonResult;
  baselineEventCount: number;
  retestEventCount: number;
}>;

const EVIDENCE_COPY: Readonly<Record<EvidenceStatement, string>> = {
  demonstrated_both: "Demostrado en ambas simulaciones",
  demonstrated_after_debrief:
    "Demostrado después del debrief en el retest no visto",
  not_yet_demonstrated: "Aún no demostrado — requiere más práctica",
};

const BEHAVIOR_LABELS: Readonly<Record<BehaviorCode, string>> = {
  checks_route_status: "Comprobar el estado de la ruta",
  maintains_accountability: "Mantener abierto el conteo",
  requests_assistance: "Coordinar apoyo",
  verifies_information: "Verificar información cambiante",
};

export function ComparisonScreen({
  result,
  baselineEventCount,
  retestEventCount,
}: ComparisonScreenProps) {
  return (
    <main id="main-content" className="comparison-page">
      <section className="comparison-heading" aria-labelledby="comparison-title">
        <div>
          <p className="eyebrow">Pantalla 5 de 5 · comparación de evidencia</p>
          <h1 id="comparison-title">Lo observado en las dos simulaciones</h1>
          <p>
            Esta comparación describe un comportamiento específico de esta sesión.
            No es una calificación ni una certificación de preparación.
          </p>
        </div>
        <span className="comparison-status">Retest no visto completado</span>
      </section>

      <div className="comparison-layout">
        <section className="evidence-result-card" aria-labelledby="evidence-title">
          <p className="step-label">Comportamiento observado</p>
          <h2 id="evidence-title">{BEHAVIOR_LABELS[result.behaviorCode]}</h2>
          <div className="evidence-statement" aria-label="Resultado de evidencia">
            <span aria-hidden="true">◎</span>
            <p>{EVIDENCE_COPY[result.evidenceStatement]}</p>
          </div>
          <dl className="evidence-summary">
            <div>
              <dt>Escenario inicial</dt>
              <dd>{baselineEventCount} decisiones observables</dd>
            </div>
            <div>
              <dt>Retest no visto</dt>
              <dd>{retestEventCount} decisión observable</dd>
            </div>
          </dl>
          <p className="evidence-boundary">
            El resultado usa únicamente acciones permitidas registradas en memoria y
            se elimina al recargar la página.
          </p>
        </section>

        <aside className="validation-gate" aria-labelledby="validation-title">
          <p className="validation-kicker">Siguiente paso humano</p>
          <div className="validation-state">
            <span aria-hidden="true">!</span>
            <strong id="validation-title">Pendiente de validación física</strong>
          </div>
          <p>
            La persona responsable de seguridad debe observar este comportamiento
            durante un micro-simulacro físico antes de cerrar cualquier acción
            correctiva.
          </p>
          <div className="validation-note">
            <strong>Este prototipo no puede cerrar el hallazgo.</strong>
            <span>
              Tampoco aprueba, certifica ni sustituye la decisión de la persona
              responsable.
            </span>
          </div>
        </aside>
      </div>
    </main>
  );
}
