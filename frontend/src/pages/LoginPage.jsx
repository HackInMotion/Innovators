import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient/apiClient";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await apiClient.post("/auth/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const token = response.data.data.token;
      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.message || "Invalid username or password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 mb-4">
          Please enter your credentials
        </p>

        {errorMessage && (
          <div className="text-red-500 bg-red-100 border border-red-300 p-3 rounded text-sm text-center mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
              aria-label="Username"
              className="w-full bg-gray-50 border border-gray-300 rounded-md py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              aria-label="Password"
              className="w-full bg-gray-50 border border-gray-300 rounded-md py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-3.5 text-gray-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-gray-700 text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((prev) => !prev)}
                className="rounded bg-gray-100 border-gray-300 text-indigo-500 focus:ring-indigo-500 mr-2"
              />
              Remember me
            </label>
            <a
              href="#"
              className="text-sm text-indigo-500 hover:underline transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-4 rounded-md font-medium transition-all transform ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:from-indigo-600 hover:to-purple-600"
            }`}
          >
            {isLoading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
