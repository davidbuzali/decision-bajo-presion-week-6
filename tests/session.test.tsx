// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/app/App";

afterEach(() => {
  cleanup();
});

describe("Feature 2 safe start", () => {
  it("states the safety and privacy boundaries without personal fields", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Decisión Bajo Presión" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/No certifica preparación/i)).toBeInTheDocument();
    expect(screen.getByText(/No pedimos nombre/i)).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("changes in-memory preferences without requesting microphone access", async () => {
    const user = userEvent.setup();
    const getUserMedia = vi.fn();
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia },
    });
    render(<App />);

    await user.click(
      screen.getByRole("radio", { name: /Movimiento reducido/i }),
    );
    await user.click(screen.getByRole("radio", { name: /Vista plana/i }));
    await user.click(
      screen.getByRole("checkbox", {
        name: /Preparar controles de voz opcionales/i,
      }),
    );

    expect(getUserMedia).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /Comenzar ensayo/i }));
    expect(screen.getByText(/Vista plana · Mismas decisiones/i)).toBeInTheDocument();
    expect(screen.getByText("Movimiento reducido")).toBeInTheDocument();
  });

  it("supports keyboard start and pause without recording a failure", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("radio", { name: /Vista plana/i }));
    const start = screen.getByRole("button", { name: /Comenzar ensayo/i });
    start.focus();
    await user.keyboard("{Enter}");

    const pause = screen.getByRole("button", { name: /Pausar y salir/i });
    expect(pause).toBeInTheDocument();
    pause.focus();
    await user.keyboard("{Enter}");

    expect(
      screen.getByRole("dialog", { name: /Tómate el tiempo/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/no registra una decisión/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Reanudar ensayo/i }),
    ).toHaveFocus();

    await user.click(screen.getByRole("button", { name: /Reanudar ensayo/i }));
    expect(
      screen.getByRole("heading", {
        name: "La alerta comienza. ¿Qué haces primero?",
      }),
    ).toBeInTheDocument();
  });

  it("exits without saving and returns to clean defaults", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("radio", { name: /Movimiento reducido/i }),
    );
    await user.click(screen.getByRole("radio", { name: /Vista plana/i }));
    await user.click(screen.getByRole("button", { name: /Comenzar ensayo/i }));
    await user.click(screen.getByRole("button", { name: /Pausar y salir/i }));
    await user.click(screen.getByRole("button", { name: /Salir sin guardar/i }));

    expect(
      screen.getByRole("radio", { name: /Movimiento normal/i }),
    ).toBeChecked();
    expect(
      screen.getByRole("radio", { name: /Simulación 3D en pantalla/i }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", {
        name: /Preparar controles de voz opcionales/i,
      }),
    ).not.toBeChecked();
  });

  it("creates a fresh session when the application is mounted again", async () => {
    const user = userEvent.setup();
    const first = render(<App />);
    await user.click(screen.getByRole("radio", { name: /Vista plana/i }));
    first.unmount();

    render(<App />);
    expect(
      screen.getByRole("radio", { name: /Simulación 3D en pantalla/i }),
    ).toBeChecked();
  });
});
