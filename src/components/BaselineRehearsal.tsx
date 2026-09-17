import type { MotionPreference, ViewPreference } from "../app/sessionReducer";
import { BASELINE_SCENARIO } from "../domain/scenarios";
import type { ActionCode, DecisionEvent, InputMode } from "../domain/types";
import { ScenarioRehearsal } from "./ScenarioRehearsal";

type BaselineRehearsalProps = Readonly<{
  events: readonly DecisionEvent[];
  motion: MotionPreference;
  view: ViewPreference;
  voiceEnabled?: boolean;
  onVoicePause?: () => void;
  onDecision: (actionCode: ActionCode, inputMode: InputMode) => void;
}>;

export function BaselineRehearsal(props: BaselineRehearsalProps) {
  return <ScenarioRehearsal {...props} scenario={BASELINE_SCENARIO} />;
}
