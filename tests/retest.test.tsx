// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/app/App";
import { ScenarioRehearsal } from "../src/components/ScenarioRehearsal";
import { RETEST_SCENARIOS } from "../src/domain/scenarios";

vi.mock("../src/components/ScenarioScene3D", () => ({
  ScenarioScene3D: () => <div role="img" aria-label="Escena 3D de prueba" />,
}));

afterEach(() => {
  cleanup();
});

async function reachRouteRetest(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("radio", { name: /Vista plana/i }));
  await user.click(screen.getByRole("button", { name: /Comenzar ensayo/i }));
  await user.click(screen.getByRole("button", { name: /Observar el entorno/i }));
  await user.click(screen.getByRole("button", { name: /Intentar pasar/i }));
  await user.click(
    screen.getByRole("button", {
      name: /^Reportar la diferencia y pedir apoyo coordinado$/i,
    }),
  );
  await user.click(
    screen.getByRole("button", {
      name: "Confirmo que ocurrió el debrief humano",
    }),
  );
}

describe("Feature 5 adaptive unseen retest", () => {
  it("uses the same options and action callback in 3D and flat views", () => {
    const scenario = RETEST_SCENARIOS.checks_route_status;
    const onDecision = vi.fn();
    const { rerender } = render(
      <ScenarioRehearsal
        scenario={scenario}
        events={[]}
        motion="standard"
        view="three_d"
        onDecision={onDecision}
      />,
    );

    for (const option of scenario.decisions[0].options) {
      expect(screen.getByRole("button", { name: option.label })).toBeVisible();
    }
    screen.getByRole("button", { name: scenario.decisions[0].options[0].label }).click();

    rerender(
      <ScenarioRehearsal
        scenario={scenario}
        events={[]}
        motion="reduced"
        view="flat"
        onDecision={onDecision}
      />,
    );
    for (const option of scenario.decisions[0].options) {
      expect(screen.getByRole("button", { name: option.label })).toBeVisible();
    }
    screen.getByRole("button", { name: scenario.decisions[0].options[0].label }).click();

    expect(onDecision).toHaveBeenNthCalledWith(
      1,
      "follow_temporary_route",
      "keyboard",
    );
    expect(onDecision).toHaveBeenNthCalledWith(
      2,
      "follow_temporary_route",
      "keyboard",
    );
  });

  it("runs the selected unseen family and stops at the comparison boundary", async () => {
    const user = userEvent.setup();
    render(<App />);
    await reachRouteRetest(user);

    expect(screen.getByText("Escenario B — retest no visto")).toBeVisible();
    expect(
      screen.getByText("IA simulada — la decisión final es humana"),
    ).toBeVisible();
    expect(screen.getByText("Requiere prueba física")).toBeVisible();
    expect(
      screen.getByText(
        "La escalera alterna habitual está cerrada y aparece una ruta temporal",
      ),
    ).toBeVisible();
    expect(screen.queryByText(/salida principal bloqueada y conteo incompleto/i)).toBeNull();

    await user.click(
      screen.getByRole("button", {
        name: "Verificar y seguir la ruta temporal señalizada",
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Comparación preparada" }),
    ).toBeVisible();
    expect(screen.getAllByText("Retest no visto completado")).toHaveLength(2);
    expect(screen.queryByRole("button", { name: /Pausar y salir/i })).toBeNull();
  });

  it("pauses and resumes the same unseen decision without adding evidence", async () => {
    const user = userEvent.setup();
    render(<App />);
    await reachRouteRetest(user);

    const prompt = "La ruta alterna habitual también está cerrada. ¿Qué haces?";
    expect(screen.getByRole("heading", { name: prompt })).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Pausar y salir/i }));
    await user.click(screen.getByRole("button", { name: /Reanudar ensayo/i }));
    expect(screen.getByRole("heading", { name: prompt })).toBeVisible();
    expect(
      screen.getAllByRole("button", {
        name: "Verificar y seguir la ruta temporal señalizada",
      }),
    ).toHaveLength(1);
  });
});
