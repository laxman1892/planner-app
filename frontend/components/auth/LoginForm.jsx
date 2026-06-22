"use client";

export default function LoginForm({
  loginForm,
  isLoading,
  error,
  successMessage,
  onSubmit,
  onChange,
}) {
  return (
    <form onSubmit={onSubmit}>
      <label>
        Username or email
        <input
          name="login"
          type="text"
          value={loginForm.login}
          onChange={onChange}
          required
        />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          minLength={8}
          value={loginForm.password}
          onChange={onChange}
          required
        />
      </label>

      {error && <p className="form-error">{error}</p>}
      {successMessage && <p className="form-success">{successMessage}</p>}

      <button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading ? "Working..." : "Log in"}
      </button>
    </form>
  );
}
