import { useState, useRef, useCallback } from "react";
interface EvaluationRequest {
  agentEndpoint: string;
  claudeApiKey: string;
  agentDescription: string;
  customHeaders?: Record<string, string>;
  requestTemplate?: string;
  agentPrompt?: string;
}

export type EvaluationStatus = "idle" | "running" | "complete" | "error";

export interface EvaluationResult {
  trustScore: number;
  maturityLevel: string;
  passed: number;
  failed: number;
  total: number;
}

export interface EvaluationProgress {
  completed: number;
  total: number;
  scenarioName?: string;
  passed?: boolean;
}

export function useEvaluation() {
  const [status, setStatus] = useState<EvaluationStatus>("idle");
  const [progress, setProgress] = useState<EvaluationProgress>({ completed: 0, total: 20 });
  const [currentMessage, setCurrentMessage] = useState<string>("Initializing...");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const start = useCallback(async (data: EvaluationRequest) => {
    setStatus("running");
    setProgress({ completed: 0, total: 20 });
    setCurrentMessage("Preparing evaluation environment...");
    setError(null);
    setResult(null);

    abortControllerRef.current = new AbortController();

    let receivedResult = false;

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error((errData as Record<string, string>).error || `HTTP Error: ${response.status}`);
      }

      if (!response.body) throw new Error("No response stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() || "";

        for (const block of chunks) {
          const linesInBlock = block.split("\n");
          let eventType = "message";
          let eventData = "";

          for (const line of linesInBlock) {
            if (line.startsWith("event:")) {
              eventType = line.substring(6).trim();
            } else if (line.startsWith("data:")) {
              eventData += line.substring(5).trim();
            }
          }

          if (!eventData) continue;

          if (eventType === "error") {
            const parsed = JSON.parse(eventData) as Record<string, string>;
            throw new Error(parsed.error || "Evaluation failed");
          }

          try {
            const parsed = JSON.parse(eventData);

            if (eventType === "status") {
              setCurrentMessage(parsed.message);
            } else if (eventType === "progress") {
              setProgress({
                completed: parsed.completed,
                total: parsed.total || 100,
                scenarioName: parsed.scenarioName,
                passed: parsed.passed,
              });
              setCurrentMessage(`Testing scenario: ${parsed.scenarioName || `Task ${parsed.completed}`}`);
            } else if (eventType === "result") {
              setResult(parsed);
              setStatus("complete");
              receivedResult = true;
            }
          } catch (parseErr: unknown) {
            if (parseErr instanceof Error && parseErr.message.includes("Evaluation failed")) {
              throw parseErr;
            }
            console.error("Failed to parse SSE event:", eventData, parseErr);
          }
        }
      }

      if (!receivedResult) {
        throw new Error("Evaluation stream ended without producing results");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        setStatus("idle");
      } else {
        const message = err instanceof Error ? err.message : "An unexpected error occurred";
        setError(message);
        setStatus("error");
      }
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStatus("idle");
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
    setProgress({ completed: 0, total: 20 });
  }, []);

  return {
    status,
    progress,
    currentMessage,
    result,
    error,
    start,
    cancel,
    reset,
  };
}
