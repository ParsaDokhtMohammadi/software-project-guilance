import React, { useEffect, useState } from "react";
import { loginUser, fetchCurrentUser, getStoredTokens } from "../api";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const { access } = getStoredTokens();
    if (access) {
      navigate("/Dashboard", { replace: true });
    }
  }, [navigate]);

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
      navigate("/Dashboard", { replace: true });
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
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field full-width">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
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
