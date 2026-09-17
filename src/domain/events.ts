import type { DecisionEvent } from "./types";

export type EventLog = readonly DecisionEvent[];

export function appendEvent(
  log: EventLog,
  event: DecisionEvent,
): EventLog {
  return [...log, event];
}

export function eventsForScenario(
  log: EventLog,
  scenarioId: DecisionEvent["scenarioId"],
): EventLog {
  return log.filter((event) => event.scenarioId === scenarioId);
}
