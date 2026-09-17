import { SCENARIOS_BY_ID } from "./scenarios";
import type {
  ActionCode,
  DecisionEvent,
  DecisionId,
  InputMode,
  ScenarioId,
} from "./types";

const actionsByDecision = Object.values(SCENARIOS_BY_ID).reduce(
  (index, scenario) => {
    for (const decision of scenario.decisions) {
      index[decision.id] = new Set(
        decision.options.map((option) => option.actionCode),
      );
    }
    return index;
  },
  {} as Record<DecisionId, ReadonlySet<ActionCode>>,
);

export const VOICE_PHRASE_LIMIT = 64;

const voiceActionsByDecision: Partial<
  Readonly<Record<DecisionId, Readonly<Record<string, ActionCode>>>>
> = {
  baseline_alert: {
    "esperar instruccion": "observe_and_follow_instruction",
  },
  baseline_blocked_exit: {
    "ruta alterna": "verify_alternate_route",
    "esperar instruccion": "wait_without_communicating",
  },
  baseline_accountability: {
    "reportar persona": "report_and_request_support",
    "pedir apoyo": "report_and_request_support",
  },
  retest_route_change: {
    "ruta alterna": "follow_temporary_route",
    "esperar instruccion": "wait_at_route_change",
  },
  retest_missing_participant: {
    "reportar persona": "report_missing_after_move",
  },
  retest_accessible_assistance: {
    "pedir apoyo": "coordinate_accessible_support",
  },
};

export type VoiceCommand =
  | Readonly<{ kind: "decision"; actionCode: ActionCode }>
  | Readonly<{ kind: "pause" }>;

function normalizePhrase(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("es-MX")
    .replace(/\s+/g, " ");
}

export function validateAction(
  decisionId: DecisionId,
  candidateAction: string,
): ActionCode | null {
  const allowedActions = actionsByDecision[decisionId];
  return allowedActions.has(candidateAction as ActionCode)
    ? (candidateAction as ActionCode)
    : null;
}

export function parseVoiceCommand(
  decisionId: DecisionId,
  phrase: string,
): VoiceCommand | null {
  if (phrase.length === 0 || phrase.length > VOICE_PHRASE_LIMIT) {
    return null;
  }

  const normalized = normalizePhrase(phrase);
  if (normalized === "pausar") {
    return { kind: "pause" };
  }

  const candidate = voiceActionsByDecision[decisionId]?.[normalized];
  const actionCode = candidate
    ? validateAction(decisionId, candidate)
    : null;

  return actionCode ? { kind: "decision", actionCode } : null;
}

export function mapVoicePhrase(
  decisionId: DecisionId,
  phrase: string,
): ActionCode | null {
  const command = parseVoiceCommand(decisionId, phrase);
  return command?.kind === "decision" ? command.actionCode : null;
}

export function createDecisionEvent(input: {
  scenarioId: ScenarioId;
  decisionId: DecisionId;
  candidateAction: string;
  relativeTimeMs: number;
  inputMode: InputMode;
}): DecisionEvent | null {
  const actionCode = validateAction(input.decisionId, input.candidateAction);
  const decisionBelongsToScenario = SCENARIOS_BY_ID[
    input.scenarioId
  ].decisions.some((decision) => decision.id === input.decisionId);

  if (
    !actionCode ||
    !decisionBelongsToScenario ||
    !Number.isFinite(input.relativeTimeMs)
  ) {
    return null;
  }

  return {
    scenarioId: input.scenarioId,
    decisionId: input.decisionId,
    actionCode,
    relativeTimeMs: Math.max(0, Math.trunc(input.relativeTimeMs)),
    inputMode: input.inputMode,
  };
}
