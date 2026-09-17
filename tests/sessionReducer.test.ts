import { describe, expect, it } from "vitest";
import {
  createInitialSessionState,
  sessionReducer,
  type SessionState,
} from "../src/app/sessionReducer";
import { event } from "./fixtures";

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
});
