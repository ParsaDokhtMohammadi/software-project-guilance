import React, { useState } from "react";


const API_BASE = "http://localhost:8000/api";

async function registerUser(payload) {
  const res = await fetch(`${API_BASE}/auth/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data?.detail || "Registration failed");
    error.data = data;
    throw error;
  }
  window.location.href = "/";
  return data;
}


const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setFieldErrors({});
    setSuccess(false);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        email,
        username: username || email,
        password,
      });

      setSuccess(true);
      setEmail("");
      setUsername("");
      setPassword("");
    } catch (err) {
      const data = err.data || {};
      const errs = {};

      if (data.email) errs.email = data.email.join(" ");
      if (data.username) errs.username = data.username.join(" ");
      if (data.password) errs.password = data.password.join(" ");
      if (data.detail) errs.general = data.detail;

      setFieldErrors(errs);
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <h1 className="app-title">Register</h1>
        <p className="app-subtitle">Create a new account</p>
      </header>

      <main className="app-main">
        <section className="panel auth-panel">
          <form className="task-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field full-width">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {fieldErrors.email && (
                  <div className="error-text">{fieldErrors.email}</div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field full-width">
                <label>Username (optional)</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {fieldErrors.username && (
                  <div className="error-text">{fieldErrors.username}</div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field full-width">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {fieldErrors.password && (
                  <div className="error-text">{fieldErrors.password}</div>
                )}
              </div>
            </div>

            {(error || fieldErrors.general) && (
              <div className="error-box inline-error">
                {fieldErrors.general || error}
              </div>
            )}

            {success && (
              <div className="success-box">
                Account created successfully. You can now log in.
              </div>
            )}

            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Register;
