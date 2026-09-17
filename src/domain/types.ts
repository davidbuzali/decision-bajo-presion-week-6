export const SESSION_PHASES = [
  "intro",
  "baseline",
  "debrief",
  "retest",
  "comparison",
  "paused",
] as const;

export type SessionPhase = (typeof SESSION_PHASES)[number];

export const INPUT_MODES = ["pointer", "keyboard", "voice"] as const;
export type InputMode = (typeof INPUT_MODES)[number];

export const BEHAVIOR_CODES = [
  "checks_route_status",
  "maintains_accountability",
  "requests_assistance",
  "verifies_information",
] as const;

export type BehaviorCode = (typeof BEHAVIOR_CODES)[number];

export const BASELINE_DECISION_IDS = [
  "baseline_alert",
  "baseline_blocked_exit",
  "baseline_accountability",
] as const;

export const RETEST_DECISION_IDS = [
  "retest_route_change",
  "retest_missing_participant",
  "retest_accessible_assistance",
  "retest_conflicting_signs",
] as const;

export const DECISION_IDS = [
  ...BASELINE_DECISION_IDS,
  ...RETEST_DECISION_IDS,
] as const;

export type DecisionId = (typeof DECISION_IDS)[number];

export const ACTION_CODES = [
  "observe_and_follow_instruction",
  "move_without_checking",
  "continue_activity",
  "verify_alternate_route",
  "attempt_blocked_route",
  "wait_without_communicating",
  "report_and_request_support",
  "search_alone",
  "close_count_without_reporting",
  "follow_temporary_route",
  "use_closed_stairwell",
  "wait_at_route_change",
  "report_missing_after_move",
  "assume_participant_followed",
  "close_recount_early",
  "coordinate_accessible_support",
  "leave_assigned_person",
  "move_group_without_support",
  "verify_conflicting_signs",
  "follow_first_sign",
  "wait_without_verifying",
] as const;

export type ActionCode = (typeof ACTION_CODES)[number];

export const SCENARIO_IDS = [
  "baseline_corridor_a",
  "retest_route_change_b",
  "retest_accountability_b",
  "retest_assistance_b",
  "retest_conflicting_signs_b",
] as const;

export type ScenarioId = (typeof SCENARIO_IDS)[number];

export type ScenarioKind = "baseline" | "retest";

export type DecisionOption = Readonly<{
  actionCode: ActionCode;
  label: string;
}>;

export type ScenarioDecision = Readonly<{
  id: DecisionId;
  prompt: string;
  options: readonly DecisionOption[];
}>;

export type ScenarioDefinition = Readonly<{
  id: ScenarioId;
  kind: ScenarioKind;
  title: string;
  disruption: string;
  targetBehavior?: BehaviorCode;
  decisions: readonly ScenarioDecision[];
}>;

export type DecisionEvent = Readonly<{
  scenarioId: ScenarioId;
  decisionId: DecisionId;
  actionCode: ActionCode;
  relativeTimeMs: number;
  inputMode: InputMode;
}>;

export const EVIDENCE_STATEMENTS = [
  "demonstrated_both",
  "demonstrated_after_debrief",
  "not_yet_demonstrated",
] as const;

export type EvidenceStatement = (typeof EVIDENCE_STATEMENTS)[number];

export type ComparisonResult = Readonly<{
  behaviorCode: BehaviorCode;
  evidenceStatement: EvidenceStatement;
  physicalValidation: "pending";
}>;

export type AdaptiveSelection = Readonly<{
  behaviorCode: BehaviorCode;
  scenario: ScenarioDefinition;
}>;
