import React from "react";
import ReactDOM from "react-dom/client";
import { useAuth, LoginScreen } from "./auth";
import { ChatInterface } from "./chatbot";
import "./styles.css";

function App() {
  const { isAuthenticated, email, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  return <ChatInterface userEmail={email!} onLogout={logout} />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
