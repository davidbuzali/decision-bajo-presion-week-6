import { describe, expect, it } from "vitest";
import {
  VOICE_PHRASE_LIMIT,
  createDecisionEvent,
  mapVoicePhrase,
  parseVoiceCommand,
  validateAction,
} from "../src/domain/actions";

describe("M03 shared action validation", () => {
  it("produces the same action code across pointer, keyboard, and voice", () => {
    const voiceAction = mapVoicePhrase(
      "baseline_blocked_exit",
      "  RUTA ÁLTERNA  ",
    );
    expect(voiceAction).toBe("verify_alternate_route");

    const events = ["pointer", "keyboard", "voice"].map((inputMode) =>
      createDecisionEvent({
        scenarioId: "baseline_corridor_a",
        decisionId: "baseline_blocked_exit",
        candidateAction: voiceAction ?? "",
        relativeTimeMs: 1200,
        inputMode: inputMode as "pointer" | "keyboard" | "voice",
      }),
    );

    expect(events.map((event) => event?.actionCode)).toEqual([
      "verify_alternate_route",
      "verify_alternate_route",
      "verify_alternate_route",
    ]);
  });

  it("rejects an action that belongs to another decision", () => {
    expect(
      validateAction("baseline_alert", "verify_alternate_route"),
    ).toBeNull();
  });

  it("maps the same phrase to the allow-listed action for the current scenario", () => {
    expect(mapVoicePhrase("retest_route_change", "ruta alterna")).toBe(
      "follow_temporary_route",
    );
  });

  it.each([
    ["baseline_alert", "esperar instrucción", "observe_and_follow_instruction"],
    ["baseline_accountability", "reportar persona", "report_and_request_support"],
    ["retest_accessible_assistance", "pedir apoyo", "coordinate_accessible_support"],
  ] as const)(
    "maps %s command %j through the current decision allow list",
    (decisionId, phrase, actionCode) => {
      expect(mapVoicePhrase(decisionId, phrase)).toBe(actionCode);
    },
  );

  it("rejects a valid decision paired with the wrong scenario", () => {
    expect(
      createDecisionEvent({
        scenarioId: "retest_route_change_b",
        decisionId: "baseline_blocked_exit",
        candidateAction: "verify_alternate_route",
        relativeTimeMs: 1200,
        inputMode: "pointer",
      }),
    ).toBeNull();
  });
});

describe("M04 rejected voice results", () => {
  it.each(["", "abrir la puerta", "ruta desconocida"])(
    "rejects %j without creating an action",
    (phrase) => {
      expect(mapVoicePhrase("baseline_blocked_exit", phrase)).toBeNull();
    },
  );

  it("rejects an overlong phrase", () => {
    const phrase = "a".repeat(VOICE_PHRASE_LIMIT + 1);
    expect(mapVoicePhrase("baseline_blocked_exit", phrase)).toBeNull();
  });

  it("rejects a valid phrase when it is invalid for the current decision", () => {
    expect(mapVoicePhrase("baseline_alert", "ruta alterna")).toBeNull();
  });

  it("keeps pause as a session command instead of a decision event", () => {
    expect(parseVoiceCommand("baseline_blocked_exit", "pausar")).toEqual({
      kind: "pause",
    });
    expect(mapVoicePhrase("baseline_blocked_exit", "pausar")).toBeNull();
  });
});
