// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/app/App";
import { TraceDebrief } from "../src/components/TraceDebrief";
import { RETEST_SCENARIOS } from "../src/domain/scenarios";
import { event } from "./fixtures";

vi.mock("../src/components/ScenarioScene3D", () => ({
  ScenarioScene3D: () => <div role="img" aria-label="Escena 3D de prueba" />,
}));

afterEach(() => {
  cleanup();
});

const traceEvents = [
  event({
    decisionId: "baseline_alert",
    actionCode: "observe_and_follow_instruction",
    relativeTimeMs: 1000,
  }),
  event({
    decisionId: "baseline_blocked_exit",
    actionCode: "verify_alternate_route",
    relativeTimeMs: 3250,
  }),
  event({
    decisionId: "baseline_accountability",
    actionCode: "report_and_request_support",
    relativeTimeMs: 5900,
    inputMode: "keyboard",
  }),
];

describe("Feature 4 observable trace and human debrief", () => {
  it("shows neutral events, relative times, and a bounded behavior target", () => {
    render(
      <TraceDebrief
        events={traceEvents}
        behaviorCode="verifies_information"
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByText("IA simulada — la decisión final es humana")).toBeVisible();
    expect(screen.getByText("Verificar información cambiante")).toBeVisible();
    expect(screen.getByText("1,0 s")).toBeVisible();
    expect(screen.getByText("3,3 s")).toBeVisible();
    expect(screen.getByText("5,9 s")).toBeVisible();
    expect(screen.getByText("Entrada: teclado")).toBeVisible();

    for (const option of RETEST_SCENARIOS.verifies_information.decisions[0]
      .options) {
      expect(screen.queryByText(option.label)).toBeNull();
    }
  });

  it("requires the explicit human-debrief action to continue", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <TraceDebrief
        events={traceEvents}
        behaviorCode="verifies_information"
        onConfirm={onConfirm}
      />,
    );

    expect(onConfirm).not.toHaveBeenCalled();
    await user.click(
      screen.getByRole("button", {
        name: "Confirmo que ocurrió el debrief humano",
      }),
    );
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("derives the target from baseline events and keeps confirmation in memory", async () => {
    const user = userEvent.setup();
    const firstMount = render(<App />);

    await user.click(screen.getByRole("radio", { name: /Vista plana/i }));
    await user.click(screen.getByRole("button", { name: /Comenzar ensayo/i }));
    await user.click(screen.getByRole("button", { name: /Observar el entorno/i }));
    await user.click(screen.getByRole("button", { name: /Intentar pasar/i }));
    await user.click(
      screen.getByRole("button", {
        name: /^Reportar la diferencia y pedir apoyo coordinado$/i,
      }),
    );

    expect(screen.getByText("Comprobar el estado de la ruta")).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Retest no visto preparado" }),
    ).toBeNull();

    await user.click(
      screen.getByRole("button", {
        name: "Confirmo que ocurrió el debrief humano",
      }),
    );
    expect(
      screen.getByRole("heading", { name: "Retest no visto preparado" }),
    ).toBeVisible();

    firstMount.unmount();
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Decisión Bajo Presión" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Retest no visto preparado" }),
    ).toBeNull();
  });
});
