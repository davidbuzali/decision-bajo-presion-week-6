import type {
  BehaviorCode,
  ScenarioDefinition,
  ScenarioId,
} from "./types";

export const BASELINE_SCENARIO = {
  id: "baseline_corridor_a",
  kind: "baseline",
  title: "Escenario A — recorrido inicial",
  disruption: "Alerta, salida principal bloqueada y conteo incompleto",
  decisions: [
    {
      id: "baseline_alert",
      prompt: "La alerta comienza. ¿Qué haces primero?",
      options: [
        {
          actionCode: "observe_and_follow_instruction",
          label: "Observar el entorno y seguir la instrucción vigente",
        },
        {
          actionCode: "move_without_checking",
          label: "Mover al grupo sin comprobar las condiciones",
        },
        {
          actionCode: "continue_activity",
          label: "Continuar la actividad anterior",
        },
      ],
    },
    {
      id: "baseline_blocked_exit",
      prompt: "La salida principal está bloqueada. ¿Qué decides?",
      options: [
        {
          actionCode: "verify_alternate_route",
          label: "Verificar y usar la ruta alterna señalizada",
        },
        {
          actionCode: "attempt_blocked_route",
          label: "Intentar pasar por la salida obstruida",
        },
        {
          actionCode: "wait_without_communicating",
          label: "Esperar sin informar la situación",
        },
      ],
    },
    {
      id: "baseline_accountability",
      prompt: "Una persona asignada no aparece en el conteo. ¿Qué haces?",
      options: [
        {
          actionCode: "report_and_request_support",
          label: "Reportar la diferencia y pedir apoyo coordinado",
        },
        {
          actionCode: "search_alone",
          label: "Separarte del grupo para buscar sin apoyo",
        },
        {
          actionCode: "close_count_without_reporting",
          label: "Cerrar el conteo sin reportar la diferencia",
        },
      ],
    },
  ],
} as const satisfies ScenarioDefinition;

export const RETEST_SCENARIOS = {
  checks_route_status: {
    id: "retest_route_change_b",
    kind: "retest",
    title: "Escenario B — cambio temporal de ruta",
    disruption: "La escalera alterna habitual está cerrada y aparece una ruta temporal",
    targetBehavior: "checks_route_status",
    decisions: [
      {
        id: "retest_route_change",
        prompt: "La ruta alterna habitual también está cerrada. ¿Qué haces?",
        options: [
          {
            actionCode: "follow_temporary_route",
            label: "Verificar y seguir la ruta temporal señalizada",
          },
          {
            actionCode: "use_closed_stairwell",
            label: "Intentar usar la escalera cerrada",
          },
          {
            actionCode: "wait_at_route_change",
            label: "Esperar sin comunicar el nuevo bloqueo",
          },
        ],
      },
    ],
  },
  maintains_accountability: {
    id: "retest_accountability_b",
    kind: "retest",
    title: "Escenario B — cambio de punto de reunión",
    disruption: "El grupo cambia de punto de reunión y falta una persona en el recuento",
    targetBehavior: "maintains_accountability",
    decisions: [
      {
        id: "retest_missing_participant",
        prompt: "Falta una persona después del cambio de punto. ¿Qué haces?",
        options: [
          {
            actionCode: "report_missing_after_move",
            label: "Reportar la ausencia y mantener el conteo abierto",
          },
          {
            actionCode: "assume_participant_followed",
            label: "Suponer que llegó por otra ruta",
          },
          {
            actionCode: "close_recount_early",
            label: "Cerrar el recuento antes de verificar",
          },
        ],
      },
    ],
  },
  requests_assistance: {
    id: "retest_assistance_b",
    kind: "retest",
    title: "Escenario B — apoyo en ruta modificada",
    disruption: "La persona asignada no puede usar la nueva ruta",
    targetBehavior: "requests_assistance",
    decisions: [
      {
        id: "retest_accessible_assistance",
        prompt: "La persona asignada no puede usar la nueva ruta. ¿Qué haces?",
        options: [
          {
            actionCode: "coordinate_accessible_support",
            label: "Solicitar y coordinar apoyo accesible",
          },
          {
            actionCode: "leave_assigned_person",
            label: "Continuar sin la persona asignada",
          },
          {
            actionCode: "move_group_without_support",
            label: "Mover al grupo sin comunicar la necesidad de apoyo",
          },
        ],
      },
    ],
  },
  verifies_information: {
    id: "retest_conflicting_signs_b",
    kind: "retest",
    title: "Escenario B — señales temporales en conflicto",
    disruption: "Dos señales temporales indican rutas diferentes",
    targetBehavior: "verifies_information",
    decisions: [
      {
        id: "retest_conflicting_signs",
        prompt: "Dos señales temporales se contradicen. ¿Qué haces?",
        options: [
          {
            actionCode: "verify_conflicting_signs",
            label: "Verificar la instrucción antes de mover al grupo",
          },
          {
            actionCode: "follow_first_sign",
            label: "Seguir la primera señal sin verificar",
          },
          {
            actionCode: "wait_without_verifying",
            label: "Esperar sin solicitar confirmación",
          },
        ],
      },
    ],
  },
} as const satisfies Readonly<Record<BehaviorCode, ScenarioDefinition>>;

export const SCENARIOS_BY_ID: Readonly<Record<ScenarioId, ScenarioDefinition>> = {
  [BASELINE_SCENARIO.id]: BASELINE_SCENARIO,
  [RETEST_SCENARIOS.checks_route_status.id]:
    RETEST_SCENARIOS.checks_route_status,
  [RETEST_SCENARIOS.maintains_accountability.id]:
    RETEST_SCENARIOS.maintains_accountability,
  [RETEST_SCENARIOS.requests_assistance.id]:
    RETEST_SCENARIOS.requests_assistance,
  [RETEST_SCENARIOS.verifies_information.id]:
    RETEST_SCENARIOS.verifies_information,
};
