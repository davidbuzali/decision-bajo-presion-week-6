// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/app/App";
import { ScenarioRehearsal } from "../src/components/ScenarioRehearsal";
import { VoiceControl } from "../src/components/VoiceControl";
import { BASELINE_SCENARIO } from "../src/domain/scenarios";
import {
  listenForDecisionCommand,
  type SpeechRecognitionLike,
} from "../src/voice/speechRecognition";

vi.mock("../src/components/ScenarioScene3D", () => ({
  ScenarioScene3D: () => <div role="img" aria-label="Escena 3D de prueba" />,
}));

type VoiceWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

class FakeRecognition implements SpeechRecognitionLike {
  static instances: FakeRecognition[] = [];

  lang = "";
  continuous = true;
  interimResults = true;
  maxAlternatives = 0;
  onresult: SpeechRecognitionLike["onresult"] = null;
  onerror: SpeechRecognitionLike["onerror"] = null;
  onend: SpeechRecognitionLike["onend"] = null;
  start = vi.fn();
  stop = vi.fn();

  constructor() {
    FakeRecognition.instances.push(this);
  }

  emitResult(transcript: string) {
    this.onresult?.({ results: { 0: { 0: { transcript } } } });
  }

  emitError(error: string) {
    this.onerror?.({ error });
  }

  emitEnd() {
    this.onend?.();
  }
}

const voiceWindow = window as VoiceWindow;

beforeEach(() => {
  FakeRecognition.instances = [];
  Object.defineProperty(voiceWindow, "SpeechRecognition", {
    configurable: true,
    value: FakeRecognition,
  });
});

afterEach(() => {
  cleanup();
  delete voiceWindow.SpeechRecognition;
  delete voiceWindow.webkitSpeechRecognition;
});

function latestRecognition(): FakeRecognition {
  const instance = FakeRecognition.instances.at(-1);
  if (!instance) {
    throw new Error("Expected a recognition instance");
  }
  return instance;
}

describe("Feature 6 bounded voice adapter", () => {
  it("configures one-shot es-MX recognition and returns no transcript", async () => {
    const resultPromise = listenForDecisionCommand("baseline_blocked_exit");
    const recognition = latestRecognition();

    expect(recognition.lang).toBe("es-MX");
    expect(recognition.continuous).toBe(false);
    expect(recognition.interimResults).toBe(false);
    expect(recognition.maxAlternatives).toBe(1);
    expect(recognition.start).toHaveBeenCalledOnce();

    recognition.emitResult("  RUTA ÁLTERNA  ");
    const result = await resultPromise;
    expect(result).toEqual({
      status: "command",
      command: {
        kind: "decision",
        actionCode: "verify_alternate_route",
      },
    });
    expect(JSON.stringify(result)).not.toMatch(/ruta|transcript/i);
    expect(recognition.stop).toHaveBeenCalledOnce();
  });

  it.each([
    ["not-allowed", "permission"],
    ["service-not-allowed", "permission"],
    ["network", "network"],
    ["audio-capture", "recognition"],
  ] as const)("maps %s to a neutral %s result", async (error, reason) => {
    const resultPromise = listenForDecisionCommand("baseline_alert");
    latestRecognition().emitError(error);
    await expect(resultPromise).resolves.toEqual({ status: "error", reason });
  });

  it("treats an empty recognition end as unrecognized", async () => {
    const resultPromise = listenForDecisionCommand("baseline_alert");
    latestRecognition().emitEnd();
    await expect(resultPromise).resolves.toEqual({ status: "unrecognized" });
  });

  it("does not start recognition until Escuchar comando is activated", async () => {
    const user = userEvent.setup();
    const onDecision = vi.fn();
    render(
      <VoiceControl
        decisionId="baseline_blocked_exit"
        onDecision={onDecision}
        onPause={vi.fn()}
      />,
    );

    expect(FakeRecognition.instances).toHaveLength(0);
    await user.click(screen.getByRole("button", { name: "Escuchar comando" }));
    expect(FakeRecognition.instances).toHaveLength(1);
    expect(latestRecognition().start).toHaveBeenCalledOnce();

    await act(async () => {
      latestRecognition().emitResult("ruta alterna");
    });
    expect(onDecision).toHaveBeenCalledWith("verify_alternate_route", "voice");
  });

  it("routes pausar to the session control without creating a decision", async () => {
    const user = userEvent.setup();
    const onDecision = vi.fn();
    const onPause = vi.fn();
    render(
      <VoiceControl
        decisionId="baseline_blocked_exit"
        onDecision={onDecision}
        onPause={onPause}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Escuchar comando" }));
    await act(async () => {
      latestRecognition().emitResult("pausar");
    });
    expect(onPause).toHaveBeenCalledOnce();
    expect(onDecision).not.toHaveBeenCalled();
  });

  it("shows a neutral retry for an unrelated phrase and creates no action", async () => {
    const user = userEvent.setup();
    const onDecision = vi.fn();
    render(
      <VoiceControl
        decisionId="baseline_blocked_exit"
        onDecision={onDecision}
        onPause={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Escuchar comando" }));
    await act(async () => {
      latestRecognition().emitResult("abrir la ventana");
    });

    expect(screen.getByText(/No se reconoció un comando permitido/i)).toBeVisible();
    expect(onDecision).not.toHaveBeenCalled();
    expect(screen.queryByText("abrir la ventana")).toBeNull();
  });

  it("requests no recognition when voice is enabled or the scenario loads", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("checkbox", {
        name: /Preparar controles de voz opcionales/i,
      }),
    );
    await user.click(screen.getByRole("radio", { name: /Vista plana/i }));
    await user.click(screen.getByRole("button", { name: /Comenzar ensayo/i }));
    expect(FakeRecognition.instances).toHaveLength(0);

    await user.click(screen.getByRole("button", { name: "Escuchar comando" }));
    expect(FakeRecognition.instances).toHaveLength(1);
  });

  it("keeps visible decisions usable after permission denial", async () => {
    const user = userEvent.setup();
    const onDecision = vi.fn();
    render(
      <ScenarioRehearsal
        scenario={BASELINE_SCENARIO}
        events={[]}
        motion="reduced"
        view="flat"
        voiceEnabled
        onDecision={onDecision}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Escuchar comando" }));
    await act(async () => {
      latestRecognition().emitError("not-allowed");
    });

    expect(screen.getByText(/micrófono no fue autorizado/i)).toBeVisible();
    const visibleAction = screen.getByRole("button", {
      name: /Observar el entorno/i,
    });
    expect(visibleAction).toBeEnabled();
    await user.click(visibleAction);
    expect(onDecision).toHaveBeenCalledWith(
      "observe_and_follow_instruction",
      "pointer",
    );
  });

  it("shows an unsupported fallback while preserving all action buttons", () => {
    delete voiceWindow.SpeechRecognition;
    render(
      <ScenarioRehearsal
        scenario={BASELINE_SCENARIO}
        events={[]}
        motion="reduced"
        view="flat"
        voiceEnabled
        onDecision={vi.fn()}
      />,
    );

    expect(screen.getByText(/Voz no disponible/i)).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Escuchar comando" }),
    ).toBeDisabled();
    expect(screen.getAllByRole("button").filter((button) => !button.hasAttribute("disabled")))
      .toHaveLength(3);
  });
});
