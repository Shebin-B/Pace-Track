import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
  
    try {
      const response = await axios.post("http://localhost:5004/api/loginuser/login", { email, password });
  
      if (response.data.token) {
        const { token, role, userId } = response.data;
  
        // Store token and userId in both localStorage and sessionStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userId", userId);
  
        // Define role-based paths
        const rolePaths = {
          admin: "/adminpage",
          client: `/clientdash/${userId}`,
          project_manager: `/managerdash/${userId}`,
          site_supervisor: `/ss_dash/${userId}`,
        };
  
        if (rolePaths[role]) {
          navigate(rolePaths[role]); // Redirect user based on role
        } else {
          setError("Unknown user role.");
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-image-section">
          <img src="/assets/login.png" alt="Login" className="login-image" />
        </div>
        <div className="login-form-section">
          <h2 className="login-heading">Login</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="login-input-group">
              <label className="login-label">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input"
              />
            </div>
            <div className="login-input-group">
              <label className="login-label">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
              />
            </div>
            <button type="submit" className="login-button" disabled={!email || !password}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
