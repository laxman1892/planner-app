"use client";

export default function RegisterForm({
  registerForm,
  isLoading,
  error,
  successMessage,
  onSubmit,
  onChange,
}) {
  return (
    <form onSubmit={onSubmit}>
      <label>
        Username
        <input
          name="username"
          value={registerForm.username}
          onChange={onChange}
          required
        />
      </label>
      <div className="field-grid">
        <label>
          First name
          <input
            name="first_name"
            value={registerForm.first_name}
            onChange={onChange}
          />
        </label>
        <label>
          Last name
          <input
            name="last_name"
            value={registerForm.last_name}
            onChange={onChange}
          />
        </label>
      </div>
      <label>
        Email
        <input
          name="email"
          type="email"
          value={registerForm.email}
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
          value={registerForm.password}
          onChange={onChange}
          required
        />
      </label>

      {error && <p className="form-error">{error}</p>}
      {successMessage && <p className="form-success">{successMessage}</p>}

      <button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading ? "Working..." : "Create account"}
      </button>
    </form>
  );
}
