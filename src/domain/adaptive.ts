import { RETEST_SCENARIOS } from "./scenarios";
import type {
  AdaptiveSelection,
  BehaviorCode,
  DecisionEvent,
} from "./types";

function selectedAction(
  events: readonly DecisionEvent[],
  decisionId: DecisionEvent["decisionId"],
): DecisionEvent["actionCode"] | undefined {
  return events.find((event) => event.decisionId === decisionId)?.actionCode;
}

export function selectTargetBehavior(
  baselineEvents: readonly DecisionEvent[],
): BehaviorCode {
  const exitAction = selectedAction(
    baselineEvents,
    "baseline_blocked_exit",
  );
  if (exitAction !== "verify_alternate_route") {
    return "checks_route_status";
  }

  const accountabilityAction = selectedAction(
    baselineEvents,
    "baseline_accountability",
  );
  if (accountabilityAction === "close_count_without_reporting") {
    return "maintains_accountability";
  }

  if (accountabilityAction !== "report_and_request_support") {
    return "requests_assistance";
  }

  return "verifies_information";
}

export function selectRetestScenario(
  baselineEvents: readonly DecisionEvent[],
): AdaptiveSelection {
  const behaviorCode = selectTargetBehavior(baselineEvents);
  return {
    behaviorCode,
    scenario: RETEST_SCENARIOS[behaviorCode],
  };
}
