// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/app/App";
import { ComparisonScreen } from "../src/components/ComparisonScreen";
import type { EvidenceStatement } from "../src/domain/types";

vi.mock("../src/components/ScenarioScene3D", () => ({
  ScenarioScene3D: () => <div role="img" aria-label="Escena 3D de prueba" />,
}));

afterEach(() => {
  cleanup();
});

const APPROVED_STATEMENTS = [
  "Demostrado en ambas simulaciones",
  "Demostrado después del debrief en el retest no visto",
  "Aún no demostrado — requiere más práctica",
] as const;

const statementCases: ReadonlyArray<
  readonly [EvidenceStatement, (typeof APPROVED_STATEMENTS)[number]]
> = [
  ["demonstrated_both", APPROVED_STATEMENTS[0]],
  ["demonstrated_after_debrief", APPROVED_STATEMENTS[1]],
  ["not_yet_demonstrated", APPROVED_STATEMENTS[2]],
];

async function completeRouteFlow(
  user: ReturnType<typeof userEvent.setup>,
  retestAction: "demonstrate" | "not_yet",
) {
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
  await user.click(
    screen.getByRole("button", {
      name:
        retestAction === "demonstrate"
          ? "Verificar y seguir la ruta temporal señalizada"
          : "Intentar usar la escalera cerrada",
    }),
  );
}

describe("Feature 7 evidence comparison", () => {
  it.each(statementCases)(
    "renders exactly one approved statement for %s",
    (evidenceStatement, expectedCopy) => {
      render(
        <ComparisonScreen
          result={{
            behaviorCode: "checks_route_status",
            evidenceStatement,
            physicalValidation: "pending",
          }}
          baselineEventCount={3}
          retestEventCount={1}
        />,
      );

      expect(screen.getByText(expectedCopy)).toBeVisible();
      expect(
        APPROVED_STATEMENTS.filter(
          (statement) => screen.queryByText(statement) !== null,
        ),
      ).toEqual([expectedCopy]);
      expect(screen.getByText("Pendiente de validación física")).toBeVisible();
      expect(screen.getByText(/micro-simulacro físico/i)).toBeVisible();
      expect(screen.queryByRole("button")).toBeNull();
    },
  );

  it("completes the full path and reports improvement without closing the finding", async () => {
    const user = userEvent.setup();
    render(<App />);

    await completeRouteFlow(user, "demonstrate");

    expect(
      screen.getByRole("heading", {
        name: "Lo observado en las dos simulaciones",
      }),
    ).toBeVisible();
    expect(
      screen.getByText(
        "Demostrado después del debrief en el retest no visto",
      ),
    ).toBeVisible();
    expect(screen.getByText("Comprobar el estado de la ruta")).toBeVisible();
    expect(screen.getByText("Pendiente de validación física")).toBeVisible();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("keeps an unresolved behavior open after an unsuccessful retest", async () => {
    const user = userEvent.setup();
    render(<App />);

    await completeRouteFlow(user, "not_yet");

    expect(
      screen.getByText("Aún no demostrado — requiere más práctica"),
    ).toBeVisible();
    expect(screen.getByText("Pendiente de validación física")).toBeVisible();
  });

  it("clears the comparison and all session evidence on remount", async () => {
    const user = userEvent.setup();
    const completed = render(<App />);
    await completeRouteFlow(user, "demonstrate");
    expect(screen.getByText("Pendiente de validación física")).toBeVisible();

    completed.unmount();
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Decisión Bajo Presión" }),
    ).toBeVisible();
    expect(screen.queryByText("Pendiente de validación física")).toBeNull();
    for (const statement of APPROVED_STATEMENTS) {
      expect(screen.queryByText(statement)).toBeNull();
    }
  });
});
