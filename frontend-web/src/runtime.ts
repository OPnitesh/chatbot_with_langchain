import type { ChatModelAdapter } from "@assistant-ui/react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const STREAM_ENDPOINT = `${API_BASE_URL}/chat/stream`;
const SESSION_KEY = "assistant_ui_session_id";

type SseEvent = {
  type: "token" | "end" | "error";
  content: string;
};

function getSessionId(): string {
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) {
    return existing;
  }

  const created =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `session-${Date.now()}`;
  window.localStorage.setItem(SESSION_KEY, created);
  return created;
}

function readTextContent(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .filter((part) => part && typeof part === "object")
    .map((part) => {
      const maybeText = (part as { text?: unknown }).text;
      return typeof maybeText === "string" ? maybeText : "";
    })
    .join("");
}

function getLatestUserText(messages: unknown[]): string {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i] as { role?: unknown; content?: unknown };
    if (message.role === "user") {
      return readTextContent(message.content).trim();
    }
  }

  return "";
}

async function* parseSseResponse(
  response: Response,
  abortSignal: AbortSignal | undefined,
): AsyncGenerator<SseEvent> {
  if (!response.body) {
    throw new Error("Streaming response has no body.");
  }

  const decoder = new TextDecoder();
  const reader = response.body.getReader();
  let buffer = "";

  while (true) {
    if (abortSignal?.aborted) {
      reader.cancel();
      return;
    }

    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    let eventEnd = buffer.indexOf("\n\n");
    while (eventEnd !== -1) {
      const rawEvent = buffer.slice(0, eventEnd);
      buffer = buffer.slice(eventEnd + 2);

      for (const line of rawEvent.split("\n")) {
        if (!line.startsWith("data: ")) {
          continue;
        }

        const payload = JSON.parse(line.slice(6)) as SseEvent;
        yield payload;
      }

      eventEnd = buffer.indexOf("\n\n");
    }
  }
}

export const modelAdapter: ChatModelAdapter = {
  async *run({ messages, abortSignal, unstable_threadId }) {
    const userMessage = getLatestUserText(messages as unknown[]);
    if (!userMessage) {
      yield { content: [{ type: "text", text: "Type a message to begin." }] };
      return;
    }

    const sessionId = (unstable_threadId ?? getSessionId()).slice(0, 128);

    const response = await fetch(STREAM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        session_id: sessionId,
      }),
      signal: abortSignal,
    });

    if (!response.ok) {
      throw new Error(`Request failed (${response.status}).`);
    }

    let fullText = "";

    for await (const event of parseSseResponse(response, abortSignal)) {
      if (event.type === "token") {
        fullText += event.content || "";
        yield { content: [{ type: "text", text: fullText }] };
      } else if (event.type === "end") {
        const finalText = event.content?.trim() ? event.content : fullText;
        yield { content: [{ type: "text", text: finalText }] };
        return;
      } else if (event.type === "error") {
        throw new Error(event.content || "Streaming failed.");
      }
    }

    if (fullText.trim()) {
      yield { content: [{ type: "text", text: fullText }] };
    }
  },
};
