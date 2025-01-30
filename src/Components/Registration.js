import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Authentication.css'; // Import the CSS file

const Register = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
  
    const userExists = storedUsers.some(
      (u) => u.email.toLowerCase() === user.email.toLowerCase()
    );
  
    if (userExists) {
      setError("Account already exists with this email.");
      return;
    }
  
    localStorage.setItem("users", JSON.stringify([...storedUsers, user]));
    setError(""); // Clear error
    navigate("/login"); // Redirect user to login page after registration
  };
  

  return (
    <div className="auth-container"> {/* Updated class */}
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <p>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
};

export default Register;
