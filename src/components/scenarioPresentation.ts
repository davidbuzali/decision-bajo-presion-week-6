import type { ScenarioDefinition, ScenarioId } from "../domain/types";

export type ScenePresentation = Readonly<{
  routeBlocked: boolean;
  countAttention: boolean;
  assistanceNeeded: boolean;
  conflictingSigns: boolean;
}>;

export type SceneStatus = Readonly<{
  title: string;
  description: string;
}>;

const BASELINE_STATES: readonly SceneStatus[] = [
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
];

export function scenePresentation(
  scenarioId: ScenarioId,
  decisionIndex: number,
): ScenePresentation {
  return {
    routeBlocked:
      (scenarioId === "baseline_corridor_a" && decisionIndex >= 1) ||
      scenarioId === "retest_route_change_b",
    countAttention:
      (scenarioId === "baseline_corridor_a" && decisionIndex >= 2) ||
      scenarioId === "retest_accountability_b",
    assistanceNeeded: scenarioId === "retest_assistance_b",
    conflictingSigns: scenarioId === "retest_conflicting_signs_b",
  };
}

export function sceneStatus(
  scenario: ScenarioDefinition,
  decisionIndex: number,
): SceneStatus | undefined {
  if (scenario.kind === "baseline") {
    return BASELINE_STATES[decisionIndex];
  }

  return {
    title: "Condición inesperada",
    description: scenario.disruption,
  };
}
