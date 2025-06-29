import React, { useState } from "react";
import { useNavigate } from "react-router";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isEmailValid) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isPasswordValid) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }
      // Save token to localStorage
      localStorage.setItem("adminToken", data.token);
      navigate("/admin");
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <div className="mb-4">
          <a href="/" className="text-blue-600 hover:text-blue-800 flex items-center font-medium mb-4">
            ← Back to Home
          </a>
        </div>
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          Admin Sign In
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-2 text-blue-900 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              email && !isEmailValid ? "border-red-500" : "border-blue-200"
            }`}
            placeholder="admin@example.com"
            autoComplete="username"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-blue-900 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              password && !isPasswordValid ? "border-red-500" : "border-blue-200"
            }`}
            placeholder="Enter password"
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default SignInPage; 