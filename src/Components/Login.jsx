import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulated login check (you can replace with real API call)
    if (email === "test@example.com" && password === "123456") {
      alert("Login Successful!");
      navigate("/"); // Redirect to homepage
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="servease-container">
      <div className="left-panel">
        <h1>Hello Servease! 👋</h1>
        <p className="tagline">
          Simplifying home services with smart automation.
        </p>
        <p className="copyright">© 2025 Servease. All rights reserved.</p>
      </div>

      <div className="right-panel">
        <div className="login-box">
          <h2>Welcome Back!</h2>
          <p>Use test@example.com / 123456</p>

          <input
            type="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-btn" onClick={handleLogin}>
            Login Now
          </button>
        </div>
      </div>
    </div>
  );
}
