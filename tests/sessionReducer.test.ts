import { describe, expect, it } from "vitest";
import {
  createInitialSessionState,
  sessionReducer,
  type SessionState,
} from "../src/app/sessionReducer";
import { event, successfulBaseline } from "./fixtures";

function completedBaselineState(): SessionState {
  let state = sessionReducer(createInitialSessionState(), { type: "start" });
  for (const baselineEvent of successfulBaseline()) {
    state = sessionReducer(state, {
      type: "record_event",
      event: baselineEvent,
    });
  }
  return state;
}

describe("Feature 2 session reducer", () => {
  it("starts with accessible defaults and voice disabled", () => {
    expect(createInitialSessionState()).toEqual({
      phase: "intro",
      resumePhase: null,
      settings: {
        motion: "standard",
        view: "three_d",
        voiceEnabled: false,
      },
      events: [],
    });
  });

  it("keeps preferences in memory when the session starts", () => {
    let state = createInitialSessionState();
    state = sessionReducer(state, { type: "set_motion", motion: "reduced" });
    state = sessionReducer(state, { type: "set_view", view: "flat" });
    state = sessionReducer(state, {
      type: "set_voice_enabled",
      enabled: true,
    });
    state = sessionReducer(state, { type: "start" });

    expect(state.phase).toBe("baseline");
    expect(state.settings).toEqual({
      motion: "reduced",
      view: "flat",
      voiceEnabled: true,
    });
  });

  it("pauses and resumes the active phase without changing evidence", () => {
    const baselineEvent = event({
      decisionId: "baseline_alert",
      actionCode: "observe_and_follow_instruction",
    });
    const active: SessionState = {
      ...createInitialSessionState(),
      phase: "baseline",
      events: [baselineEvent],
    };

    const paused = sessionReducer(active, { type: "pause" });
    expect(paused.phase).toBe("paused");
    expect(paused.resumePhase).toBe("baseline");
    expect(paused.events).toEqual([baselineEvent]);

    const resumed = sessionReducer(paused, { type: "resume" });
    expect(resumed.phase).toBe("baseline");
    expect(resumed.resumePhase).toBeNull();
    expect(resumed.events).toEqual([baselineEvent]);
  });

  it("pauses and resumes the human debrief without satisfying its gate", () => {
    const debrief = completedBaselineState();

    const paused = sessionReducer(debrief, { type: "pause" });
    expect(paused.phase).toBe("paused");
    expect(paused.resumePhase).toBe("debrief");
    expect(paused.events).toEqual(debrief.events);

    expect(
      sessionReducer(paused, { type: "confirm_debrief" }),
    ).toBe(paused);

    const resumed = sessionReducer(paused, { type: "resume" });
    expect(resumed.phase).toBe("debrief");
    expect(resumed.resumePhase).toBeNull();
    expect(resumed.events).toEqual(debrief.events);
  });

  it("ignores pause outside an active scenario", () => {
    const intro = createInitialSessionState();
    expect(sessionReducer(intro, { type: "pause" })).toBe(intro);
  });

  it("exits to a fresh state with no preferences or evidence", () => {
    const changed: SessionState = {
      phase: "paused",
      resumePhase: "baseline",
      settings: {
        motion: "reduced",
        view: "flat",
        voiceEnabled: true,
      },
      events: [
        event({
          decisionId: "baseline_alert",
          actionCode: "observe_and_follow_instruction",
        }),
      ],
    };

    expect(sessionReducer(changed, { type: "exit" })).toEqual(
      createInitialSessionState(),
    );
  });

  it("records baseline decisions in order and enters the debrief placeholder", () => {
    const first = event({
      decisionId: "baseline_alert",
      actionCode: "observe_and_follow_instruction",
    });
    const second = event({
      decisionId: "baseline_blocked_exit",
      actionCode: "verify_alternate_route",
    });
    const third = event({
      decisionId: "baseline_accountability",
      actionCode: "report_and_request_support",
    });

    let state = sessionReducer(createInitialSessionState(), { type: "start" });
    state = sessionReducer(state, { type: "record_event", event: first });
    state = sessionReducer(state, { type: "record_event", event: second });
    state = sessionReducer(state, { type: "record_event", event: third });

    expect(state.events).toEqual([first, second, third]);
    expect(state.phase).toBe("debrief");
  });

  it("rejects duplicate and out-of-order baseline events", () => {
    const first = event({
      decisionId: "baseline_alert",
      actionCode: "observe_and_follow_instruction",
    });
    const second = event({
      decisionId: "baseline_blocked_exit",
      actionCode: "verify_alternate_route",
    });
    const active = sessionReducer(createInitialSessionState(), { type: "start" });

    expect(
      sessionReducer(active, { type: "record_event", event: second }),
    ).toBe(active);

    const afterFirst = sessionReducer(active, {
      type: "record_event",
      event: first,
    });
    expect(
      sessionReducer(afterFirst, { type: "record_event", event: first }),
    ).toBe(afterFirst);
  });

  it("requires a completed baseline before confirming the human debrief", () => {
    const active = sessionReducer(createInitialSessionState(), { type: "start" });
    expect(sessionReducer(active, { type: "confirm_debrief" })).toBe(active);

    const duplicateEvent = event({
      decisionId: "baseline_alert",
      actionCode: "observe_and_follow_instruction",
    });
    const incompleteTrace: SessionState = {
      ...createInitialSessionState(),
      phase: "debrief",
      events: [duplicateEvent, duplicateEvent, duplicateEvent],
    };
    expect(
      sessionReducer(incompleteTrace, { type: "confirm_debrief" }),
    ).toBe(incompleteTrace);

    const debrief = completedBaselineState();
    const confirmed = sessionReducer(debrief, { type: "confirm_debrief" });

    expect(confirmed.phase).toBe("retest");
    expect(confirmed.events).toEqual(debrief.events);
  });

  it("accepts only the deterministically selected retest event", () => {
    const forgedRetest: SessionState = {
      ...createInitialSessionState(),
      phase: "retest",
    };
    const routeEvent = event({
      scenarioId: "retest_route_change_b",
      decisionId: "retest_route_change",
      actionCode: "follow_temporary_route",
    });
    expect(
      sessionReducer(forgedRetest, {
        type: "record_event",
        event: routeEvent,
      }),
    ).toBe(forgedRetest);

    const debrief = completedBaselineState();
    const retest = sessionReducer(debrief, { type: "confirm_debrief" });
    expect(
      sessionReducer(retest, { type: "record_event", event: routeEvent }),
    ).toBe(retest);

    const selectedFamily = event({
      scenarioId: "retest_conflicting_signs_b",
      decisionId: "retest_conflicting_signs",
      actionCode: "verify_conflicting_signs",
    });
    const comparison = sessionReducer(retest, {
      type: "record_event",
      event: selectedFamily,
    });

    expect(comparison.phase).toBe("comparison");
    expect(comparison.events).toEqual([...retest.events, selectedFamily]);
  });
});
