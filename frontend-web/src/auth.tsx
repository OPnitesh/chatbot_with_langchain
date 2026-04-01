import { useState, useEffect } from "react";
import { AppLogo } from "./AppLogo";

interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    email: null,
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem("user_email");
    if (storedEmail && storedEmail.endsWith("@petasight.com")) {
      setAuthState({ isAuthenticated: true, email: storedEmail });
    }
  }, []);

  const login = (email: string): boolean => {
    if (email.endsWith("@petasight.com")) {
      localStorage.setItem("user_email", email);
      setAuthState({ isAuthenticated: true, email });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("user_email");
    setAuthState({ isAuthenticated: false, email: null });
  };

  return { ...authState, login, logout };
}

export function LoginScreen({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith("@petasight.com")) {
      setError("Only @petasight.com emails are allowed");
      return;
    }
    onLogin(email);
  };

  return (
    <div className="login-container" role="main">
      <div className="login-card">
        <div className="login-brand">
          <AppLogo variant="hero" />
        </div>
        <h1 className="login-title">Petasight AI</h1>
        <p className="login-subtitle">Enter your Petasight email to continue</p>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email-input" className="visually-hidden">
            Email Address
          </label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="your.name@petasight.com"
            className="login-input"
            required
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={error ? "email-error" : undefined}
            autoFocus
          />
          {error && (
            <div id="email-error" className="login-error" role="alert">
              {error}
            </div>
          )}
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
