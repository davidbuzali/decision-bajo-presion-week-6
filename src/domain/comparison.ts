import type {
  ActionCode,
  BehaviorCode,
  ComparisonResult,
  DecisionEvent,
} from "./types";

const demonstratingActions: Readonly<Record<BehaviorCode, ReadonlySet<ActionCode>>> = {
  checks_route_status: new Set([
    "verify_alternate_route",
    "follow_temporary_route",
  ]),
  maintains_accountability: new Set([
    "report_and_request_support",
    "report_missing_after_move",
  ]),
  requests_assistance: new Set([
    "report_and_request_support",
    "coordinate_accessible_support",
  ]),
  verifies_information: new Set([
    "observe_and_follow_instruction",
    "verify_conflicting_signs",
  ]),
};

export function demonstratesBehavior(
  events: readonly DecisionEvent[],
  behaviorCode: BehaviorCode,
): boolean {
  const accepted = demonstratingActions[behaviorCode];
  return events.some((event) => accepted.has(event.actionCode));
}

export function compareBehavior(input: {
  behaviorCode: BehaviorCode;
  baselineEvents: readonly DecisionEvent[];
  retestEvents: readonly DecisionEvent[];
}): ComparisonResult {
  const baselineDemonstrated = demonstratesBehavior(
    input.baselineEvents,
    input.behaviorCode,
  );
  const retestDemonstrated = demonstratesBehavior(
    input.retestEvents,
    input.behaviorCode,
  );

  const evidenceStatement =
    baselineDemonstrated && retestDemonstrated
      ? "demonstrated_both"
      : retestDemonstrated
        ? "demonstrated_after_debrief"
        : "not_yet_demonstrated";

  return {
    behaviorCode: input.behaviorCode,
    evidenceStatement,
    physicalValidation: "pending",
  };
}
