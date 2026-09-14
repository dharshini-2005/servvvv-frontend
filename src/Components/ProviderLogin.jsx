import React, { useState } from "react";
import axios from "axios";
import "../Styles/ProviderLogin.css";

const API = "https://servease-backend-870h.onrender.com/api/auth";

const ProviderLogin = ({ onLogin }) => {
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName]             = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState("");

  const reset = () => { setPassword(""); setConfirmPassword(""); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password || (isRegistering && (!confirmPassword || !name))) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }
    if (isRegistering && password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    const endpoint = isRegistering ? "/register" : "/login";
    try {
      const { data } = await axios.post(`${API}${endpoint}`, {
        email,
        password,
        role: "provider",
        name: isRegistering ? name : email.split("@")[0],
      });

      if (data.error) { setError(data.error); return; }

      if (!isRegistering && data.role !== "provider") {
        setError("This account is not registered as a service provider.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));

      if (isRegistering) {
        setIsRegistering(false);
        reset();
        alert("Registration successful! Please log in.");
      } else {
        onLogin({ email: data.email, role: data.role, name: data.name, _id: data._id });
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="provider-login-wrapper">
      {/* Left panel */}
      <div className="login-left-panel">
        <h1>Grow your business with ServiceX 🔧</h1>
        <p>List your services, reach thousands of customers, and manage bookings — all in one place.</p>
        <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem", position: "relative", zIndex: 1 }}>
          {["📋 Easy service listing", "📊 Booking management dashboard", "💰 Transparent earnings", "⭐ Build your reputation"].map((f) => (
            <div key={f} style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {f}
            </div>
          ))}
        </div>
        <footer>© {new Date().getFullYear()} ServiceX. All rights reserved.</footer>
      </div>

      {/* Right panel */}
      <div className="login-right-panel">
        <div className="form-box">
          <h2>{isRegistering ? "Join as Provider" : "Provider Login"}</h2>
          <p>
            {isRegistering ? "Already have an account?" : "New to ServiceX?"}{" "}
            <span
              onClick={() => { setIsRegistering(!isRegistering); reset(); }}
              style={{ cursor: "pointer", color: "#059669", fontWeight: 600 }}
            >
              {isRegistering ? "Sign In" : "Register"}
            </span>
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            {isRegistering && (
              <input
                type="text"
                placeholder="Your full name / business name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete={isRegistering ? "new-password" : "current-password"}
            />
            {isRegistering && (
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
            )}
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Please wait…" : isRegistering ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="forgot-link">Forgot password? <a href="#">Reset here</a></p>
        </div>
      </div>
    </div>
  );
};

export default ProviderLogin;
