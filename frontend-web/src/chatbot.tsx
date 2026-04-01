import { useState, useRef, useEffect, useMemo } from "react";
import { Send, LogOut, Plus, User, Bot, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { AppLogo } from "./AppLogo";
import {
  getTemperatureColor,
  getDecimalColor,
  getUrgencyColor,
  getAccessibleTextColor,
  parseCityTemperature,
  parseDecimal,
} from "./colorUtils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  bgColor?: string;
  textColor?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

interface ChatResponse {
  reply: string;
  urgency?: number;
  nativeText?: string;
  englishText?: string;
}

function createSession(): ChatSession {
  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  return { id, title: "New chat", messages: [], updatedAt: Date.now() };
}

function sessionTitleFromMessages(messages: Message[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "New chat";
  const t = firstUser.content.trim();
  if (!t) return "New chat";
  return t.length > 44 ? `${t.slice(0, 44)}…` : t;
}

const API_ENDPOINT = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1/chat";
const STARTER_PROMPTS = ["Dubai 32C", "3.14159", "I am very worried about tomorrow"];

function splitReply(content: string, nativeText?: string, englishText?: string) {
  if (nativeText && englishText) return { native: nativeText, english: englishText };
  const parts = content.split("\n\n").filter(Boolean);
  if (parts.length >= 2) return { native: parts[0].trim(), english: parts.slice(1).join("\n\n").trim() };
  return { native: "", english: content };
}

export function ChatInterface({ userEmail, onLogout }: { userEmail: string; onLogout: () => void }) {
  const bootstrap = useMemo(() => {
    const s = createSession();
    return { session: s };
  }, []);

  const [sessions, setSessions] = useState<ChatSession[]>(() => [bootstrap.session]);
  const [activeSessionId, setActiveSessionId] = useState<string>(() => bootstrap.session.id);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messages = sessions.find((s) => s.id === activeSessionId)?.messages ?? [];

  const patchSessionMessages = (sessionId: string, fn: (prev: Message[]) => Message[]) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        const nextMessages = fn(s.messages);
        return {
          ...s,
          messages: nextMessages,
          updatedAt: Date.now(),
          title: sessionTitleFromMessages(nextMessages),
        };
      })
    );
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeSessionId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const sessionId = activeSessionId;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    patchSessionMessages(sessionId, (prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          email: userEmail,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data: ChatResponse = await response.json();
      let bgColor = "#444654";

      const cityTemp = parseCityTemperature(userMessage.content);
      if (cityTemp) {
        bgColor = getTemperatureColor(cityTemp.temp);
      } else {
        const decimal = parseDecimal(userMessage.content);
        if (decimal !== null) bgColor = getDecimalColor(decimal);
        else if (data.urgency !== undefined) bgColor = getUrgencyColor(data.urgency);
      }

      const textColor = getAccessibleTextColor(bgColor);
      const parsed = splitReply(data.reply, data.nativeText, data.englishText);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: parsed.native ? `${parsed.native}\n\n${parsed.english}` : parsed.english,
        bgColor,
        textColor,
      };

      patchSessionMessages(sessionId, (prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Error: Could not connect to the server.",
        bgColor: "#8b0000",
        textColor: "#ffffff",
      };
      patchSessionMessages(sessionId, (prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const startNewChat = () => {
    const next = createSession();
    setSessions((prev) => [...prev, next]);
    setActiveSessionId(next.id);
    setInput("");
  };

  const selectSession = (id: string) => {
    setActiveSessionId(id);
  };

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <AppLogo variant="sidebar" />
              {!sidebarCollapsed && <h2 className="sidebar-title">Petasight AI</h2>}
            </div>
            <button 
              className="sidebar-collapse" 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <button className="sidebar-btn" type="button" onClick={startNewChat}>
            <Plus size={18} />
            {!sidebarCollapsed && <span>New Chat</span>}
          </button>

          {!sidebarCollapsed && (
            <div className="session-list" role="navigation" aria-label="Chat history">
              <h3 className="session-list-heading">Chats</h3>
              <ul className="session-list-items">
                {[...sessions]
                  .sort((a, b) => b.updatedAt - a.updatedAt)
                  .map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        className={`session-item ${s.id === activeSessionId ? "active" : ""}`}
                        onClick={() => selectSession(s.id)}
                        aria-current={s.id === activeSessionId ? "true" : undefined}
                      >
                        <span className="session-item-title">{s.title}</span>
                        <span className="session-item-meta">{s.messages.length} msgs</span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          {!sidebarCollapsed && (
            <div className="user-info">
              <div aria-hidden>
                <User size={18} />
              </div>
              <span>{userEmail}</span>
            </div>
          )}
          <button className="logout-btn" onClick={onLogout} title="Logout">
            <LogOut size={18} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="chat-header">
          <div className="chat-header-brand">
            <AppLogo variant="header" />
            <h1 className="chat-title">Petasight AI Assistant</h1>
          </div>
          <button className="logout-btn-mobile" onClick={onLogout} aria-label="Logout">
            <LogOut size={20} />
          </button>
        </header>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <div className="welcome-icon">
                <AppLogo variant="hero" />
              </div>
              <h2>How can I help you today?</h2>
              <p>Type in English. Replies return in Arabic script followed by English translation.</p>
              <div className="welcome-cards">
                {STARTER_PROMPTS.map((prompt) => (
                  <button key={prompt} className="welcome-card" type="button" onClick={() => sendQuickPrompt(prompt)}>
                    <h3>{prompt}</h3>
                    <p>Tap to insert this prompt</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {messages.map((msg) => {
                const parsed = splitReply(msg.content);
                return (
                  <div key={msg.id} className={`message ${msg.role}`}>
                    <div className="message-avatar">{msg.role === "user" ? <User size={20} /> : <Bot size={20} />}</div>
                    {msg.role === "assistant" ? (
                      <div className="message-bubble" style={{ backgroundColor: msg.bgColor, color: msg.textColor }} aria-live="polite">
                        {parsed.native && (
                          <p className="native-line" lang="ar" dir="rtl">
                            {parsed.native}
                          </p>
                        )}
                        <p>{parsed.english}</p>
                      </div>
                    ) : (
                      <div className="message-bubble">{msg.content}</div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="message assistant">
                  <div className="message-avatar">
                    <Bot size={20} />
                  </div>
                  <div className="message-bubble loading" aria-label="Assistant is typing">
                    <span className="loading-dots" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              className="message-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              disabled={isLoading}
            />
            <button className="send-button" onClick={sendMessage} disabled={!input.trim() || isLoading} aria-label="Send message">
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
