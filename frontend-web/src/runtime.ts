import type { ChatModelAdapter } from "@assistant-ui/react";

const CHAT_ENDPOINT =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1/chat";
const SESSION_KEY = "assistant_ui_session_id";

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

export const modelAdapter: ChatModelAdapter = {
  async *run({ messages, abortSignal, unstable_threadId }) {
    const userMessage = getLatestUserText(messages as unknown[]);
    if (!userMessage) {
      yield { content: [{ type: "text", text: "Type a message to begin." }] };
      return;
    }

    const sessionId = (unstable_threadId ?? getSessionId()).slice(0, 128);

    const response = await fetch(CHAT_ENDPOINT, {
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

    const data = (await response.json()) as { reply?: string };
    const reply = data.reply?.trim() || "No response from server.";
    yield { content: [{ type: "text", text: reply }] };
  },
};
