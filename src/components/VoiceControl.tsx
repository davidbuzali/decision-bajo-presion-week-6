import { useState } from "react";
import type { ActionCode, DecisionId, InputMode } from "../domain/types";
import {
  isSpeechRecognitionSupported,
  listenForDecisionCommand,
  type VoiceErrorReason,
} from "../voice/speechRecognition";

type VoiceControlProps = Readonly<{
  decisionId: DecisionId;
  onDecision: (actionCode: ActionCode, inputMode: InputMode) => void;
  onPause: () => void;
}>;

type VoiceStatus = "idle" | "listening" | "unrecognized" | VoiceErrorReason;

const STATUS_COPY: Readonly<Record<VoiceStatus, string>> = {
  idle: "La escucha comienza solo al activar el botón.",
  listening: "Escuchando un comando breve…",
  unrecognized:
    "No se reconoció un comando permitido. Usa un botón o intenta de nuevo.",
  unsupported:
    "Voz no disponible en este navegador. Usa los botones o el teclado.",
  permission:
    "El acceso al micrófono no fue autorizado. Los botones siguen disponibles.",
  network:
    "El reconocimiento por voz no respondió. Usa los botones o el teclado.",
  recognition:
    "No fue posible reconocer el comando. Usa un botón o intenta de nuevo.",
};

export function VoiceControl({
  decisionId,
  onDecision,
  onPause,
}: VoiceControlProps) {
  const supported = isSpeechRecognitionSupported();
  const [status, setStatus] = useState<VoiceStatus>(
    supported ? "idle" : "unsupported",
  );

  async function listen() {
    setStatus("listening");
    const result = await listenForDecisionCommand(decisionId);

    if (result.status === "command") {
      if (result.command.kind === "pause") {
        onPause();
      } else {
        onDecision(result.command.actionCode, "voice");
      }
      return;
    }

    setStatus(result.status === "error" ? result.reason : "unrecognized");
  }

  return (
    <div className="voice-control">
      <div>
        <strong>Voz opcional</strong>
        <p id={`voice-status-${decisionId}`} aria-live="polite">
          {STATUS_COPY[status]}
        </p>
      </div>
      <button
        className="voice-button"
        type="button"
        disabled={!supported || status === "listening"}
        aria-describedby={`voice-status-${decisionId}`}
        onClick={listen}
      >
        <span aria-hidden="true">◉</span>
        {status === "listening" ? "Escuchando…" : "Escuchar comando"}
      </button>
      <small>
        No mostramos ni guardamos la transcripción. El navegador puede usar su
        proveedor de reconocimiento.
      </small>
    </div>
  );
}
