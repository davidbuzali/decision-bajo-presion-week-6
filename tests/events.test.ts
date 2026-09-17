import { describe, expect, it } from "vitest";
import { createDecisionEvent } from "../src/domain/actions";
import { appendEvent, eventsForScenario } from "../src/domain/events";

describe("M07 exact event schema", () => {
  it("creates only the five allow-listed event fields", () => {
    const event = createDecisionEvent({
      scenarioId: "baseline_corridor_a",
      decisionId: "baseline_alert",
      candidateAction: "observe_and_follow_instruction",
      relativeTimeMs: 1488.8,
      inputMode: "keyboard",
    });

    expect(event).not.toBeNull();
    expect(Object.keys(event ?? {}).sort()).toEqual(
      [
        "scenarioId",
        "decisionId",
        "actionCode",
        "relativeTimeMs",
        "inputMode",
      ].sort(),
    );
    expect(event?.relativeTimeMs).toBe(1488);
    expect(JSON.stringify(event)).not.toMatch(
      /name|email|school|transcript|emotion|readiness|location/i,
    );
  });

  it("appends immutably and filters only by scenario", () => {
    const baseline = createDecisionEvent({
      scenarioId: "baseline_corridor_a",
      decisionId: "baseline_alert",
      candidateAction: "observe_and_follow_instruction",
      relativeTimeMs: 100,
      inputMode: "pointer",
    });
    const retest = createDecisionEvent({
      scenarioId: "retest_conflicting_signs_b",
      decisionId: "retest_conflicting_signs",
      candidateAction: "verify_conflicting_signs",
      relativeTimeMs: 200,
      inputMode: "keyboard",
    });

    if (!baseline || !retest) {
      throw new Error("Expected valid fixture events");
    }

    const firstLog = appendEvent([], baseline);
    const secondLog = appendEvent(firstLog, retest);

    expect(firstLog).toHaveLength(1);
    expect(secondLog).toHaveLength(2);
    expect(eventsForScenario(secondLog, "baseline_corridor_a")).toEqual([
      baseline,
    ]);
  });
});
