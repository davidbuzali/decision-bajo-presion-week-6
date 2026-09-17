import { describe, expect, it } from "vitest";
import { compareBehavior } from "../src/domain/comparison";
import { event } from "./fixtures";

describe("M05 approved comparison statements", () => {
  it.each([
    {
      name: "demonstrated in both simulations",
      baseline: [
        event({
          decisionId: "baseline_blocked_exit",
          actionCode: "verify_alternate_route",
        }),
      ],
      retest: [
        event({
          scenarioId: "retest_route_change_b",
          decisionId: "retest_route_change",
          actionCode: "follow_temporary_route",
        }),
      ],
      expected: "demonstrated_both",
    },
    {
      name: "demonstrated only after debrief",
      baseline: [
        event({
          decisionId: "baseline_blocked_exit",
          actionCode: "attempt_blocked_route",
        }),
      ],
      retest: [
        event({
          scenarioId: "retest_route_change_b",
          decisionId: "retest_route_change",
          actionCode: "follow_temporary_route",
        }),
      ],
      expected: "demonstrated_after_debrief",
    },
    {
      name: "not yet demonstrated",
      baseline: [
        event({
          decisionId: "baseline_blocked_exit",
          actionCode: "attempt_blocked_route",
        }),
      ],
      retest: [
        event({
          scenarioId: "retest_route_change_b",
          decisionId: "retest_route_change",
          actionCode: "use_closed_stairwell",
        }),
      ],
      expected: "not_yet_demonstrated",
    },
  ] as const)("returns the approved value for $name", (testCase) => {
    const result = compareBehavior({
      behaviorCode: "checks_route_status",
      baselineEvents: testCase.baseline,
      retestEvents: testCase.retest,
    });

    expect(result.evidenceStatement).toBe(testCase.expected);
  });
});

describe("M06 immutable physical-validation gate", () => {
  it("keeps every comparison pending physical validation", () => {
    const result = compareBehavior({
      behaviorCode: "checks_route_status",
      baselineEvents: [],
      retestEvents: [],
    });

    expect(result.physicalValidation).toBe("pending");
    expect(Object.keys(result).sort()).toEqual(
      ["behaviorCode", "evidenceStatement", "physicalValidation"].sort(),
    );
  });
});
