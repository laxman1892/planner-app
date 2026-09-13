"use client";

export default function RegisterForm({
  registerForm,
  isLoading,
  error,
  successMessage,
  onSubmit,
  onChange,
  icons,
}) {
  const { User, AtSign, Mail, Lock, Eye } = icons;

  return (
    <form onSubmit={onSubmit} className="auth-form">
      <label>
        Full name
        <div className="auth-input-wrap">
          <User size={18} />
          <input
            name="first_name"
            value={registerForm.first_name}
            onChange={onChange}
            placeholder="E.g. Arthur Pendragon"
            required
          />
        </div>
      </label>
      <label>
        Username
        <div className="auth-input-wrap">
          <AtSign size={18} />
          <input
            name="username"
            value={registerForm.username}
            onChange={onChange}
            placeholder="adventurer_24"
            required
          />
        </div>
      </label>
      <label>
        Email Address
        <div className="auth-input-wrap">
          <Mail size={18} />
          <input
            name="email"
            type="email"
            value={registerForm.email}
            onChange={onChange}
            placeholder="name@company.com"
            required
          />
        </div>
      </label>
      <label>
        Password
        <div className="auth-input-wrap">
          <Lock size={18} />
          <input
            name="password"
            type="password"
            minLength={8}
            value={registerForm.password}
            onChange={onChange}
            placeholder="........"
            required
          />
          <Eye size={18} />
        </div>
        <span className="auth-helper-copy">Must be at least 8 characters with one number.</span>
      </label>

      {error && <p className="form-error">{error}</p>}
      {successMessage && <p className="form-success">{successMessage}</p>}

      <button type="submit" className="submit-button auth-submit-button" disabled={isLoading}>
        {isLoading ? "Working..." : "Sign Up ->"}
      </button>
    </form>
  );
}
