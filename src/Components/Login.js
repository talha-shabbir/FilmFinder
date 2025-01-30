import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Authentication.css'; 

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
  
    const validUser = storedUsers.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );
  
    if (validUser) {
      localStorage.setItem("token", "authenticated");
      localStorage.setItem("currentUserEmail", credentials.email); // Set logged-in user's email
      setError(""); // Clear error
      navigate("/home");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };
  
  

  return (
    <div className="auth-container"> {}
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <p>
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
    </div>
  );
};

export default Login;
