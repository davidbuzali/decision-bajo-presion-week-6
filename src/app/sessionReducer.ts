import type { DecisionEvent, SessionPhase } from "../domain/types";

export type MotionPreference = "standard" | "reduced";
export type ViewPreference = "three_d" | "flat";

export type SessionSettings = Readonly<{
  motion: MotionPreference;
  view: ViewPreference;
  voiceEnabled: boolean;
}>;

type ActiveScenarioPhase = Extract<SessionPhase, "baseline" | "retest">;

export type SessionState = Readonly<{
  phase: SessionPhase;
  resumePhase: ActiveScenarioPhase | null;
  settings: SessionSettings;
  events: readonly DecisionEvent[];
}>;

export type SessionAction =
  | Readonly<{ type: "set_motion"; motion: MotionPreference }>
  | Readonly<{ type: "set_view"; view: ViewPreference }>
  | Readonly<{ type: "set_voice_enabled"; enabled: boolean }>
  | Readonly<{ type: "start" }>
  | Readonly<{ type: "pause" }>
  | Readonly<{ type: "resume" }>
  | Readonly<{ type: "exit" }>;

export function createInitialSessionState(): SessionState {
  return {
    phase: "intro",
    resumePhase: null,
    settings: {
      motion: "standard",
      view: "three_d",
      voiceEnabled: false,
    },
    events: [],
  };
}

export function sessionReducer(
  state: SessionState,
  action: SessionAction,
): SessionState {
  switch (action.type) {
    case "set_motion":
      return {
        ...state,
        settings: { ...state.settings, motion: action.motion },
      };
    case "set_view":
      return {
        ...state,
        settings: { ...state.settings, view: action.view },
      };
    case "set_voice_enabled":
      return {
        ...state,
        settings: { ...state.settings, voiceEnabled: action.enabled },
      };
    case "start":
      return state.phase === "intro"
        ? { ...state, phase: "baseline" }
        : state;
    case "pause":
      return state.phase === "baseline" || state.phase === "retest"
        ? {
            ...state,
            phase: "paused",
            resumePhase: state.phase,
          }
        : state;
    case "resume":
      return state.phase === "paused" && state.resumePhase
        ? {
            ...state,
            phase: state.resumePhase,
            resumePhase: null,
          }
        : state;
    case "exit":
      return createInitialSessionState();
  }
}
