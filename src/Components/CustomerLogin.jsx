import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/CustomerLogin.css';

const CustomerLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password || (isRegistering && !confirmPassword)) {
      setError('Please fill all fields');
      setIsLoading(false);
      return;
    }

    if (isRegistering && password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    const endpoint = isRegistering ? '/register' : '/login';

    try {
      const response = await axios.post(
        `https://servvvv.onrender.com/api/auth${endpoint}`,
        {
          email,
          password,
          role: 'customer',
          name: email.split('@')[0]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      localStorage.setItem('user', JSON.stringify(response.data));

      alert(isRegistering ? 'Registration successful! Please login.' : 'Login successful!');

      if (isRegistering) {
        setIsRegistering(false);
        setPassword('');
        setConfirmPassword('');
      } else {
        const userData = {
          email: response.data.email,
          role: response.data.role,
          name: response.data.name,
          _id: response.data._id
        };
        onLogin(userData);
      }
    } catch (error) {
      console.error('Login/Register error:', error);
      setError(
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="customer-login-wrapper">
      <div className="login-left-panel">
        <h1>Welcome<br />to ServEase 👋</h1>
        <p>Find and book<br />services easily!</p>
        <footer>© 2025 ServEase. All rights reserved.</footer>
      </div>
      <div className="login-right-panel">
        <div className="form-box">
          <h2>{isRegistering ? "Register" : "Hello Customer!"}</h2>
          <p>
            {isRegistering ? "Already have an account?" : "New here?"}{" "}
            <span
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setPassword('');
                setConfirmPassword('');
              }}
              style={{ cursor: 'pointer', color: '#007bff' }}
            >
              {isRegistering ? "Login" : "Register"}
            </span>
          </p>
          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            {isRegistering && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            )}
            <button
              type="submit"
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Please wait...' : (isRegistering ? 'Register' : 'Login Now')}
            </button>
          </form>
          <p className="forgot-link">Forgot password? <a href="#">Click here</a></p>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
