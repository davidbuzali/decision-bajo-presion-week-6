import { describe, expect, it } from "vitest";
import {
  selectRetestScenario,
  selectTargetBehavior,
} from "../src/domain/adaptive";
import { BASELINE_SCENARIO } from "../src/domain/scenarios";
import { event, successfulBaseline } from "./fixtures";

describe("M01 adaptive retest mapping", () => {
  it("targets route checking after an attempted blocked exit", () => {
    const events = [
      event({
        decisionId: "baseline_blocked_exit",
        actionCode: "attempt_blocked_route",
      }),
    ];

    expect(selectTargetBehavior(events)).toBe("checks_route_status");
  });

  it("targets accountability after a count is closed without reporting", () => {
    const events = [
      event({
        decisionId: "baseline_blocked_exit",
        actionCode: "verify_alternate_route",
      }),
      event({
        decisionId: "baseline_accountability",
        actionCode: "close_count_without_reporting",
      }),
    ];

    expect(selectTargetBehavior(events)).toBe("maintains_accountability");
  });

  it("targets assistance after an unsupported solo search", () => {
    const events = [
      event({
        decisionId: "baseline_blocked_exit",
        actionCode: "verify_alternate_route",
      }),
      event({
        decisionId: "baseline_accountability",
        actionCode: "search_alone",
      }),
    ];

    expect(selectTargetBehavior(events)).toBe("requests_assistance");
  });

  it("uses the conflicting-sign fallback when target behaviors were demonstrated", () => {
    expect(selectTargetBehavior(successfulBaseline())).toBe(
      "verifies_information",
    );
  });
});

describe("M02 unseen scenario difference", () => {
  it.each([
    [
      "route",
      [
        event({
          decisionId: "baseline_blocked_exit",
          actionCode: "attempt_blocked_route",
        }),
      ],
    ],
    ["fallback", successfulBaseline()],
  ] as const)("returns a different ID and disruption for %s", (_name, events) => {
    const selection = selectRetestScenario(events);

    expect(selection.scenario.id).not.toBe(BASELINE_SCENARIO.id);
    expect(selection.scenario.disruption).not.toBe(
      BASELINE_SCENARIO.disruption,
    );
  });
});
