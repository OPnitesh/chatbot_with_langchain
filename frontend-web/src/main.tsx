import React from "react";
import ReactDOM from "react-dom/client";
import { AssistantRuntimeProvider, useLocalRuntime } from "@assistant-ui/react";

import { modelAdapter } from "./runtime";
import { ChatClone } from "./ui";

import "./styles.css";

function App() {
  const runtime = useLocalRuntime(modelAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ChatClone />
    </AssistantRuntimeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
