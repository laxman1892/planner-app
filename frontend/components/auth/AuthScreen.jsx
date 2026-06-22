"use client";

import { CalendarDays, Medal, Sparkles } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { authPreviewItems, createAuthPreviewIcons, getAuthHeading } from "@/components/auth/auth-screen-content";

export const authPreviewIcons = {
  ...createAuthPreviewIcons({
    calendar: CalendarDays,
    medal: Medal,
    sparkles: Sparkles,
  }),
};

export default function AuthScreen({
  mode,
  loginForm,
  registerForm,
  isLoading,
  error,
  successMessage,
  onLoginSubmit,
  onLoginChange,
  onRegisterSubmit,
  onRegisterChange,
  onModeChange,
}) {
  return (
    <main className="auth-page">
      <section className="auth-visual" aria-label="Product preview">
        <div className="brand auth-brand">
          <CalendarDays size={28} />
          <span>PlanQuest</span>
        </div>
        <div className="preview-stack">
          {authPreviewItems.map((item) => {
            const PreviewIcon = authPreviewIcons[item.icon];

            return (
              <article key={item.key}>
                <PreviewIcon />
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            );
          })}
        </div>
      </section>

      <section className="auth-panel" aria-label="Authentication">
        <div className="auth-copy">
          <p className="eyebrow">Start with auth</p>
          <h1>{getAuthHeading(mode)}</h1>
        </div>

        <div className="segmented-control" role="tablist" aria-label="Authentication mode">
          <button type="button" className={mode === "login" ? "active" : ""} onClick={() => onModeChange("login")}>
            Login
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => onModeChange("register")}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <LoginForm
            loginForm={loginForm}
            isLoading={isLoading}
            error={error}
            successMessage={successMessage}
            onSubmit={onLoginSubmit}
            onChange={onLoginChange}
          />
        ) : (
          <RegisterForm
            registerForm={registerForm}
            isLoading={isLoading}
            error={error}
            successMessage={successMessage}
            onSubmit={onRegisterSubmit}
            onChange={onRegisterChange}
          />
        )}
      </section>
    </main>
  );
}
