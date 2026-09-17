import { createDecisionEvent } from "../src/domain/actions";
import type {
  ActionCode,
  DecisionEvent,
  DecisionId,
  InputMode,
  ScenarioId,
} from "../src/domain/types";

export function event(input: {
  decisionId: DecisionId;
  actionCode: ActionCode;
  scenarioId?: ScenarioId;
  inputMode?: InputMode;
  relativeTimeMs?: number;
}): DecisionEvent {
  const created = createDecisionEvent({
    scenarioId: input.scenarioId ?? "baseline_corridor_a",
    decisionId: input.decisionId,
    candidateAction: input.actionCode,
    relativeTimeMs: input.relativeTimeMs ?? 1000,
    inputMode: input.inputMode ?? "pointer",
  });

  if (!created) {
    throw new Error(`Invalid test event for ${input.decisionId}`);
  }

  return created;
}

export function successfulBaseline(): readonly DecisionEvent[] {
  return [
    event({
      decisionId: "baseline_alert",
      actionCode: "observe_and_follow_instruction",
    }),
    event({
      decisionId: "baseline_blocked_exit",
      actionCode: "verify_alternate_route",
    }),
    event({
      decisionId: "baseline_accountability",
      actionCode: "report_and_request_support",
    }),
  ];
}
