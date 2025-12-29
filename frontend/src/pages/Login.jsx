import React, { useState } from "react";
import { loginUser, fetchCurrentUser } from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      await loginUser({ email, password });
      await fetchCurrentUser();
      window.location.href = "/Dashboard";
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <h1 className="app-title">Login</h1>
        <p className="app-subtitle">Sign in to your account</p>
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
              </div>
            </div>

            {error && <div className="error-box inline-error">{error}</div>}

            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Login;
