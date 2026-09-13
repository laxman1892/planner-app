"use client";

export default function LoginForm({
  loginForm,
  isLoading,
  error,
  successMessage,
  onSubmit,
  onChange,
  icons,
}) {
  const { Mail, Lock, Eye } = icons;

  return (
    <form onSubmit={onSubmit} className="auth-form">
      <label>
        Username or email
        <div className="auth-input-wrap">
          <Mail size={18} />
          <input
            name="login"
            type="text"
            value={loginForm.login}
            onChange={onChange}
            placeholder="Enter your credentials"
            required
          />
        </div>
      </label>
      <div className="auth-password-label">
        <label>
          Password
          <div className="auth-input-wrap">
            <Lock size={18} />
            <input
              name="password"
              type="password"
              minLength={8}
              value={loginForm.password}
              onChange={onChange}
              placeholder="........"
              required
            />
            <Eye size={18} />
          </div>
        </label>
        <button type="button" className="auth-inline-button auth-inline-button--muted">
          Forgot password?
        </button>
      </div>

      <label className="auth-checkbox-row">
        <input type="checkbox" />
        <span>Keep me signed in for 30 days</span>
      </label>

      {error && <p className="form-error">{error}</p>}
      {successMessage && <p className="form-success">{successMessage}</p>}

      <button type="submit" className="submit-button auth-submit-button" disabled={isLoading}>
        {isLoading ? "Working..." : "Log In ->"}
      </button>
    </form>
  );
}
