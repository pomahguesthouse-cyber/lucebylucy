const AGENT_TIMEOUT_MS = 50_000;

type AgentMode = "chat" | "design";

interface AgentResponse {
  answer: string;
  mode: AgentMode;
}

async function askAgent(
  mode: AgentMode,
  message: string,
  externalSignal?: AbortSignal,
): Promise<AgentResponse> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), AGENT_TIMEOUT_MS);
  const abortFromCaller = () => controller.abort();

  externalSignal?.addEventListener("abort", abortFromCaller, { once: true });

  try {
    const response = await fetch(`/api/agent/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message.trim() }),
      signal: controller.signal,
    });

    const payload = (await response.json().catch(() => null)) as
      | Partial<AgentResponse> & { error?: string }
      | null;

    if (!response.ok) {
      throw new Error(payload?.error || "LUCE Assistant sementara tidak tersedia.");
    }

    if (!payload?.answer || typeof payload.answer !== "string") {
      throw new Error("Respons LUCE Assistant tidak valid.");
    }

    return { answer: payload.answer, mode };
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error("Respons LUCE Assistant terlalu lama. Silakan coba lagi.");
    }

    throw error instanceof Error
      ? error
      : new Error("LUCE Assistant sementara tidak tersedia.");
  } finally {
    window.clearTimeout(timeout);
    externalSignal?.removeEventListener("abort", abortFromCaller);
  }
}

export function askLuceAssistant(message: string, signal?: AbortSignal) {
  return askAgent("chat", message, signal);
}

export function askLuceDesigner(message: string, signal?: AbortSignal) {
  return askAgent("design", message, signal);
}
