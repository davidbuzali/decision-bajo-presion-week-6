import { BASELINE_SCENARIO } from "../domain/scenarios";
import type {
  BehaviorCode,
  DecisionEvent,
  InputMode,
  ScenarioDecision,
} from "../domain/types";

type TraceDebriefProps = Readonly<{
  events: readonly DecisionEvent[];
  behaviorCode: BehaviorCode;
  onConfirm: () => void;
}>;

const BASELINE_DECISIONS: readonly ScenarioDecision[] =
  BASELINE_SCENARIO.decisions;

const DECISION_LABELS: Readonly<Record<string, string>> = {
  baseline_alert: "Inicio de la alerta",
  baseline_blocked_exit: "Cambio de ruta",
  baseline_accountability: "Conteo del grupo",
};

const BEHAVIOR_COPY: Readonly<
  Record<BehaviorCode, Readonly<{ title: string; description: string }>>
> = {
  checks_route_status: {
    title: "Comprobar el estado de la ruta",
    description:
      "Observar cómo se verifica una ruta cuando la condición esperada cambia.",
  },
  maintains_accountability: {
    title: "Mantener abierto el conteo",
    description:
      "Observar cómo se comunica y mantiene visible una diferencia en el grupo.",
  },
  requests_assistance: {
    title: "Coordinar apoyo",
    description:
      "Observar cómo se solicita apoyo sin abandonar al grupo ni actuar en solitario.",
  },
  verifies_information: {
    title: "Verificar información cambiante",
    description:
      "Observar cómo se confirma una instrucción cuando aparecen señales distintas.",
  },
};

const INPUT_MODE_LABELS: Readonly<Record<InputMode, string>> = {
  pointer: "control visible",
  keyboard: "teclado",
  voice: "voz opcional",
};

function actionLabel(event: DecisionEvent): string {
  for (const decision of BASELINE_DECISIONS) {
    const option = decision.options.find(
      (candidate) => candidate.actionCode === event.actionCode,
    );
    if (option) {
      return option.label;
    }
  }
  return "Acción validada";
}

function relativeTime(relativeTimeMs: number): string {
  return `${(relativeTimeMs / 1000).toFixed(1).replace(".", ",")} s`;
}

export function TraceDebrief({
  events,
  behaviorCode,
  onConfirm,
}: TraceDebriefProps) {
  const behavior = BEHAVIOR_COPY[behaviorCode];

  return (
    <main id="main-content" className="trace-page">
      <section className="trace-heading" aria-labelledby="trace-title">
        <div>
          <p className="eyebrow">Pantalla 3 de 5 · revisión humana</p>
          <h1 id="trace-title">Lo que ocurrió en el escenario inicial</h1>
          <p>
            Esta secuencia describe acciones registradas y tiempo relativo. No
            interpreta intención, emoción ni capacidad personal.
          </p>
        </div>
        <span className="trace-count">{events.length} eventos observables</span>
      </section>

      <div className="trace-layout">
        <section className="event-card" aria-labelledby="event-sequence-title">
          <div className="card-heading">
            <p className="step-label">Evidencia de esta sesión</p>
            <h2 id="event-sequence-title">Secuencia observable</h2>
          </div>
          <ol className="event-list">
            {events.map((event, index) => (
              <li key={event.decisionId}>
                <span className="event-index" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <div className="event-topline">
                    <h3>
                      {DECISION_LABELS[event.decisionId] ?? "Momento observado"}
                    </h3>
                    <time>{relativeTime(event.relativeTimeMs)}</time>
                  </div>
                  <p>{actionLabel(event)}</p>
                  <small>
                    Entrada: {INPUT_MODE_LABELS[event.inputMode]}
                  </small>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="debrief-column">
          <section className="adaptive-card" aria-labelledby="adaptive-title">
            <p className="adaptive-label">
              IA simulada — la decisión final es humana
            </p>
            <h2 id="adaptive-title">Foco propuesto para el debrief</h2>
            <div className="behavior-focus">
              <span aria-hidden="true">◎</span>
              <div>
                <h3>{behavior.title}</h3>
                <p>{behavior.description}</p>
              </div>
            </div>
            <p className="adaptive-note">
              La propuesta proviene únicamente de las tres acciones permitidas
              registradas arriba. No muestra el próximo escenario ni su respuesta.
            </p>
          </section>

          <section className="human-card" aria-labelledby="human-debrief-title">
            <p className="step-label">Punto de control humano</p>
            <h2 id="human-debrief-title">Debrief humano requerido</h2>
            <p>
              Antes de continuar, una persona responsable debe revisar la secuencia
              con el participante: qué cambió, qué información faltó y qué
              coordinación fue necesaria.
            </p>
            <button className="primary-button" type="button" onClick={onConfirm}>
              Confirmo que ocurrió el debrief humano
            </button>
            <small>
              Esta confirmación solo habilita el siguiente paso del prototipo. No
              prueba quién participó ni certifica la preparación.
            </small>
          </section>
        </div>
      </div>
    </main>
  );
}
