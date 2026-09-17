// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/app/App";
import { BaselineRehearsal } from "../src/components/BaselineRehearsal";

vi.mock("../src/components/ScenarioScene3D", () => ({
  ScenarioScene3D: () => <div role="img" aria-label="Escena 3D de prueba" />,
}));

afterEach(() => {
  cleanup();
});

const firstDecisionLabels = [
  "Observar el entorno y seguir la instrucción vigente",
  "Mover al grupo sin comprobar las condiciones",
  "Continuar la actividad anterior",
];

describe("Feature 3 baseline rehearsal", () => {
  it("shows identical decision controls in 3D and flat views", () => {
    const onDecision = vi.fn();
    const { rerender } = render(
      <BaselineRehearsal
        events={[]}
        motion="standard"
        view="three_d"
        onDecision={onDecision}
      />,
    );

    for (const label of firstDecisionLabels) {
      expect(screen.getByRole("button", { name: new RegExp(label) })).toBeVisible();
    }
    expect(screen.getByText(/3D en pantalla · No es realidad virtual/i)).toBeVisible();
    screen
      .getByRole("button", { name: /Observar el entorno/i })
      .click();

    rerender(
      <BaselineRehearsal
        events={[]}
        motion="reduced"
        view="flat"
        onDecision={onDecision}
      />,
    );

    for (const label of firstDecisionLabels) {
      expect(screen.getByRole("button", { name: new RegExp(label) })).toBeVisible();
    }
    expect(screen.getByText(/Vista plana · Mismas decisiones/i)).toBeVisible();
    expect(screen.getByText("Movimiento reducido")).toBeVisible();
    screen
      .getByRole("button", { name: /Observar el entorno/i })
      .click();
    expect(onDecision).toHaveBeenNthCalledWith(
      1,
      "observe_and_follow_instruction",
      "keyboard",
    );
    expect(onDecision).toHaveBeenNthCalledWith(
      2,
      "observe_and_follow_instruction",
      "keyboard",
    );
  });

  it("classifies keyboard and pointer activation through the same callback", async () => {
    const user = userEvent.setup();
    const onDecision = vi.fn();
    render(
      <BaselineRehearsal
        events={[]}
        motion="reduced"
        view="flat"
        onDecision={onDecision}
      />,
    );

    const first = screen.getByRole("button", {
      name: /Observar el entorno/i,
    });
    first.focus();
    await user.keyboard("{Enter}");
    expect(onDecision).toHaveBeenLastCalledWith(
      "observe_and_follow_instruction",
      "keyboard",
    );

    await user.click(
      screen.getByRole("button", { name: /Continuar la actividad anterior/i }),
    );
    expect(onDecision).toHaveBeenLastCalledWith(
      "continue_activity",
      "pointer",
    );
  });

  it("completes all three baseline decisions and exposes the next-step boundary", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("radio", { name: /Vista plana/i }));
    await user.click(screen.getByRole("button", { name: /Comenzar ensayo/i }));
    await user.click(screen.getByRole("button", { name: /Observar el entorno/i }));
    expect(screen.getByText(/Decisión registrada: Observar/i)).toBeVisible();

    await user.click(screen.getByRole("button", { name: /Verificar y usar/i }));
    expect(screen.getByText("Conteo incompleto")).toBeVisible();

    await user.click(
      screen.getByRole("button", {
        name: /^Reportar la diferencia y pedir apoyo coordinado$/i,
      }),
    );
    expect(
      screen.getByRole("heading", {
        name: "Lo que ocurrió en el escenario inicial",
      }),
    ).toBeVisible();
    expect(screen.getByText("3 eventos observables")).toBeVisible();
    expect(screen.queryByRole("button", { name: /Pausar y salir/i })).toBeNull();
  });

  it("preserves the current decision when paused and resumed", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("radio", { name: /Vista plana/i }));
    await user.click(screen.getByRole("button", { name: /Comenzar ensayo/i }));
    await user.click(screen.getByRole("button", { name: /Observar el entorno/i }));
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "La salida principal está bloqueada. ¿Qué decides?",
      }),
    ).toBeVisible();

    await user.click(screen.getByRole("button", { name: /Pausar y salir/i }));
    await user.click(screen.getByRole("button", { name: /Reanudar ensayo/i }));

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "La salida principal está bloqueada. ¿Qué decides?",
      }),
    ).toBeVisible();
    expect(screen.getAllByRole("button", { name: /Verificar y usar/i })).toHaveLength(1);
  });
});
