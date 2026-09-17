import { parseVoiceCommand, type VoiceCommand } from "../domain/actions";
import type { DecisionId } from "../domain/types";

type RecognitionAlternativeLike = Readonly<{ transcript: string }>;
type RecognitionResultLike = Readonly<{ [index: number]: RecognitionAlternativeLike | undefined }>;
type RecognitionResultListLike = Readonly<{ [index: number]: RecognitionResultLike | undefined }>;

type RecognitionResultEventLike = Readonly<{
  results: RecognitionResultListLike;
}>;

type RecognitionErrorEventLike = Readonly<{
  error: string;
}>;

export type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: RecognitionResultEventLike) => void) | null;
  onerror: ((event: RecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechWindow = Window &
  Readonly<{
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }>;

export type VoiceErrorReason =
  | "unsupported"
  | "permission"
  | "network"
  | "recognition";

export type VoiceListenResult =
  | Readonly<{ status: "command"; command: VoiceCommand }>
  | Readonly<{ status: "unrecognized" }>
  | Readonly<{ status: "error"; reason: VoiceErrorReason }>;

function recognitionConstructor(): SpeechRecognitionConstructor | undefined {
  const speechWindow = window as SpeechWindow;
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
}

export function isSpeechRecognitionSupported(): boolean {
  return recognitionConstructor() !== undefined;
}

function errorReason(error: string): VoiceErrorReason {
  if (error === "not-allowed" || error === "service-not-allowed") {
    return "permission";
  }
  if (error === "network") {
    return "network";
  }
  return "recognition";
}

export function listenForDecisionCommand(
  decisionId: DecisionId,
): Promise<VoiceListenResult> {
  const Recognition = recognitionConstructor();
  if (!Recognition) {
    return Promise.resolve({ status: "error", reason: "unsupported" });
  }

  return new Promise((resolve) => {
    const recognition = new Recognition();
    let settled = false;

    const finish = (result: VoiceListenResult) => {
      if (settled) {
        return;
      }
      settled = true;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      resolve(result);
    };

    recognition.lang = "es-MX";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const recognizedText = event.results[0]?.[0]?.transcript ?? "";
      const command = parseVoiceCommand(decisionId, recognizedText);
      finish(command ? { status: "command", command } : { status: "unrecognized" });
      recognition.stop();
    };
    recognition.onerror = (event) => {
      finish({ status: "error", reason: errorReason(event.error) });
    };
    recognition.onend = () => {
      finish({ status: "unrecognized" });
    };

    try {
      recognition.start();
    } catch {
      finish({ status: "error", reason: "recognition" });
    }
  });
}
