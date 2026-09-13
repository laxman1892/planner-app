"use client";

import { AtSign, CalendarDays, Eye, Lock, Mail, Monitor, User, UserCircle2 } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function AuthScreen({
  mode,
  visualVariant,
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
  const isLogin = mode === "login";
  const visualImage = isLogin ? "/auth/login-side.png" : "/auth/register-side.png";

  return (
    <main className={`auth-page auth-page--${visualVariant}`} data-mode={mode}>
      <section className={`auth-visual auth-visual--${visualVariant}`} aria-label="Product preview">
        <div
          className="auth-visual-image"
          style={{ backgroundImage: `url('${visualImage}')` }}
        />
        <div className="auth-visual-overlay">
          <div className="auth-brand-lockup">
            <div className="auth-brand-mark">
              <CalendarDays size={18} />
            </div>
            <span>PlanQuest</span>
          </div>

          {isLogin ? (
            <>
              <div className="auth-preview-cards">
                <article>
                  <div className="auth-preview-icon auth-preview-icon--amber">5</div>
                  <div>
                    <span>ACTIVE STREAK</span>
                    <strong>5 Days Strong</strong>
                  </div>
                </article>
                <article>
                  <div className="auth-preview-icon auth-preview-icon--blue">2</div>
                  <div>
                    <span>LATEST ACHIEVEMENT</span>
                    <strong>Planner Starter</strong>
                  </div>
                </article>
              </div>
              <blockquote className="auth-quote">
                &ldquo;The journey of a thousand quests begins with a single logged task.&rdquo;
              </blockquote>
            </>
          ) : (
            <div className="auth-register-copy">
              <h1>Your next legendary achievement starts here.</h1>
              <p>
                Embark on a personal odyssey of focus and discipline. Map your goals, conquer your habits, and claim your peak.
              </p>
              <button type="button" className="auth-secondary-cta">Begin your solo journey today</button>
            </div>
          )}
        </div>
      </section>

      <section className="auth-panel" aria-label="Authentication">
        <div className="auth-copy">
          <h1>{isLogin ? "Welcome Back, Adventurer" : "Create an account"}</h1>
          <p>{isLogin ? "Your next quest awaits. Log in to continue your progress." : "Start your accountability journey today."}</p>
        </div>

        {isLogin ? (
          <div className="segmented-control" role="tablist" aria-label="Authentication mode">
            <button type="button" className={mode === "login" ? "active" : ""} onClick={() => onModeChange("login")}>
              LOG IN
            </button>
            <button type="button" className={mode === "register" ? "active" : ""} onClick={() => onModeChange("register")}>
              REGISTER
            </button>
          </div>
        ) : null}

        <div className="auth-social-grid" aria-label="Social sign-in placeholders">
          <button type="button" className="auth-social-button" disabled>
            <Monitor size={18} />
            <span>{isLogin ? "GOOGLE" : "Google"}</span>
          </button>
          <button type="button" className="auth-social-button" disabled>
            <UserCircle2 size={18} />
            <span>{isLogin ? "FACEBOOK" : "Facebook"}</span>
          </button>
        </div>

        <div className="auth-divider">
          <span>{isLogin ? "OR CONTINUE WITH" : "OR CONTINUE WITH EMAIL"}</span>
        </div>

        {mode === "login" ? (
          <LoginForm
            loginForm={loginForm}
            isLoading={isLoading}
            error={error}
            successMessage={successMessage}
            onSubmit={onLoginSubmit}
            onChange={onLoginChange}
            icons={{ Mail, Lock, Eye }}
          />
        ) : (
          <RegisterForm
            registerForm={registerForm}
            isLoading={isLoading}
            error={error}
            successMessage={successMessage}
            onSubmit={onRegisterSubmit}
            onChange={onRegisterChange}
            icons={{ User, AtSign, Mail, Lock, Eye }}
          />
        )}

        <p className="auth-switch-copy">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button type="button" className="auth-inline-button" onClick={() => onModeChange(isLogin ? "register" : "login")}>
            {isLogin ? "Start your adventure today." : "Log in."}
          </button>
        </p>
      </section>
    </main>
  );
}
