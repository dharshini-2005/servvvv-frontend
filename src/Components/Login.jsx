import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/Login.css";

const API = "https://servease-backend-870h.onrender.com/api/auth";

const fieldIcon = (type) => {
  if (type === "email")
    return (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    );
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
};

export default function Login() {
  const [mode, setMode]           = useState("login");   // "login" | "register"
  const [role, setRole]           = useState("customer"); // "customer" | "provider"
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const navigate = useNavigate();

  const reset = () => { setEmail(""); setPassword(""); setConfirm(""); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (mode === "register") {
      if (password !== confirm) { setError("Passwords do not match."); return; }
      if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    }

    setLoading(true);
    try {
      const endpoint = mode === "register" ? "/register" : "/login";
      const payload  = mode === "register"
        ? { email, password, role, name: email.split("@")[0] }
        : { email, password };

      const { data } = await axios.post(`${API}${endpoint}`, payload);

      if (data.error) { setError(data.error); return; }

      localStorage.setItem("user", JSON.stringify(data));

      if (mode === "register") {
        setMode("login");
        reset();
        setError(""); // clear any state
        // Show inline success hint
        alert("Registered successfully! Please log in.");
        return;
      }

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* ---- Left panel ---- */}
      <div className="login-left">
        <Link to="/" className="login-brand">
          ⚡ Service<span className="login-brand-x">X</span>
        </Link>

        <h1 className="login-left-heading">
          Home services,<br />
          made simple.
        </h1>
        <p className="login-left-sub">
          Join thousands of customers and service providers on India's
          fastest-growing home services platform.
        </p>

        <div className="login-feature-list">
          {[
            ["✅", "Verified & background-checked professionals"],
            ["⚡", "Book in under 2 minutes"],
            ["⭐", "4.8 average service rating"],
            ["🔒", "Secure payments & data protection"],
          ].map(([icon, text]) => (
            <div className="login-feature-item" key={text}>
              <span className="login-feature-icon">{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* ---- Right panel ---- */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <h2>{mode === "login" ? "Welcome back 👋" : "Create account"}</h2>
            <p>
              {mode === "login"
                ? "Sign in to manage your bookings."
                : "Get started with ServiceX today."}
            </p>
          </div>

          {/* Login / Register tabs */}
          <div className="login-tabs">
            <button
              type="button"
              className={`login-tab${mode === "login" ? " login-tab--active" : ""}`}
              onClick={() => { setMode("login"); reset(); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`login-tab${mode === "register" ? " login-tab--active" : ""}`}
              onClick={() => { setMode("register"); reset(); }}
            >
              Register
            </button>
          </div>

          {/* Role selection (register only) */}
          {mode === "register" && (
            <div className="login-role-group">
              <button
                type="button"
                className={`login-role-pill${role === "customer" ? " login-role-pill--active" : ""}`}
                onClick={() => setRole("customer")}
              >
                <span>👤</span>
                Customer
              </button>
              <button
                type="button"
                className={`login-role-pill${role === "provider" ? " login-role-pill--active" : ""}`}
                onClick={() => setRole("provider")}
              >
                <span>🔧</span>
                Provider
              </button>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="login-error">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <span className="login-field-icon">{fieldIcon("email")}</span>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
                required
              />
            </div>

            <div className="login-field">
              <span className="login-field-icon">{fieldIcon("password")}</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                required
              />
            </div>

            {mode === "register" && (
              <div className="login-field">
                <span className="login-field-icon">{fieldIcon("password")}</span>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                  required
                />
              </div>
            )}

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? (
                "Please wait…"
              ) : mode === "login" ? (
                <>
                  Sign In
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="login-footer-note">
            {mode === "login" ? (
              <>Don't have an account? <a onClick={() => { setMode("register"); reset(); }} style={{cursor:"pointer"}}>Register</a></>
            ) : (
              <>Already have an account? <a onClick={() => { setMode("login"); reset(); }} style={{cursor:"pointer"}}>Sign In</a></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
