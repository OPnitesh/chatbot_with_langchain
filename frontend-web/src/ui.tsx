import {
  ComposerPrimitive,
  MessagePrimitive,
  ThreadListItemPrimitive,
  ThreadListPrimitive,
  ThreadPrimitive,
  useThreadViewportAutoScroll,
} from "@assistant-ui/react";
import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown";
import type { ReactNode } from "react";

function SidebarThreadItem() {
  return (
    <ThreadListItemPrimitive.Root className="thread-item-row">
      <ThreadListItemPrimitive.Trigger className="thread-item">
        <ThreadListItemPrimitive.Title fallback="New Chat" />
      </ThreadListItemPrimitive.Trigger>
    </ThreadListItemPrimitive.Root>
  );
}

function ThreadListPanel() {
  return (
    <ThreadListPrimitive.Root className="sidebar">
      <div className="sidebar-header">ChatGPT AWS</div>
      <ThreadListPrimitive.New className="sidebar-btn">
        + New Chat
      </ThreadListPrimitive.New>
      <div className="thread-list">
        <ThreadListPrimitive.Items
          components={{
            ThreadListItem: SidebarThreadItem,
          }}
        />
      </div>
    </ThreadListPrimitive.Root>
  );
}

function TextPart() {
  return (
    <MarkdownTextPrimitive
      className="part-text markdown"
      components={{
        p: ({ children }) => <p>{children}</p>,
      }}
    />
  );
}

function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="message-row assistant">
      <div className="bubble assistant-bubble">
        <MessagePrimitive.Parts components={{ Text: TextPart }} />
      </div>
    </MessagePrimitive.Root>
  );
}

function UserMessage() {
  return (
    <MessagePrimitive.Root className="message-row user">
      <div className="bubble user-bubble">
        <MessagePrimitive.Parts components={{ Text: TextPart }} />
      </div>
    </MessagePrimitive.Root>
  );
}

function EditComposer() {
  return (
    <ComposerPrimitive.Root className="edit-composer">
      <ComposerPrimitive.Input placeholder="Edit your message..." />
      <div className="composer-actions">
        <ComposerPrimitive.Cancel className="composer-btn secondary" />
        <ComposerPrimitive.Send className="composer-btn primary" />
      </div>
    </ComposerPrimitive.Root>
  );
}

function AutoScrollViewport({ children }: { children: ReactNode }) {
  const viewportRef = useThreadViewportAutoScroll({
    autoScroll: true,
    scrollToBottomOnRunStart: true,
    scrollToBottomOnInitialize: true,
    scrollToBottomOnThreadSwitch: true,
  });

  return (
    <ThreadPrimitive.Viewport className="thread-viewport" ref={viewportRef}>
      {children}
    </ThreadPrimitive.Viewport>
  );
}

function MainThread() {
  return (
    <main className="chat-panel">
      <ThreadPrimitive.Root className="thread-root">
        <div className="chat-topbar">
          <div className="chat-title">ChatGPT AWS</div>
        </div>
        <AutoScrollViewport>
          <ThreadPrimitive.Empty>
            <div className="empty-state">
              <h1>Build Better AWS Systems</h1>
              <p>Get architecture guidance, trade-offs, and implementation advice in real time.</p>
            </div>
          </ThreadPrimitive.Empty>
          <ThreadPrimitive.Messages
            components={{
              UserMessage,
              AssistantMessage,
              EditComposer,
            }}
          />
        </AutoScrollViewport>
        <ComposerPrimitive.Root className="composer">
          <div className="composer-input-wrap">
            <ComposerPrimitive.Input
              className="composer-input"
              placeholder="Message ChatGPT..."
              rows={1}
              autoFocus
            />
            <ComposerPrimitive.Send className="composer-icon-btn primary">
              Send
            </ComposerPrimitive.Send>
          </div>
        </ComposerPrimitive.Root>
      </ThreadPrimitive.Root>
    </main>
  );
}

export function ChatClone() {
  return (
    <div className="app-shell">
      <ThreadListPanel />
      <MainThread />
    </div>
  );
}
