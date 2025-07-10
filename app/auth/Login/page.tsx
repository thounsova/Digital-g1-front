"use client";
import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
    setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const response = await fetch("{{baseUrl}}/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        
        alert("Login successful!");
        console.log("Login response data:", data);
       
      } else {
        setServerError(data.message || "Login failed");
      }
    } catch (error) {
      setServerError("Network error. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-inter">
      <div className="w-full max-w-md shadow-lg overflow-hidden bg-white">
        <div className="bg-blue-800 text-white text-center mt-1 p-6 rounded-l-full">
          <h2 className="text-xl font-bold">Hello, Welcome!</h2>
          <p className="text-sm">Don't have an account?</p>
          <a href="/auth/Register">
            <button className="bg-blue-500 mt-4 text-white hover:bg-blue-400 font-semibold py-2 px-6 rounded-full shadow-md transition duration-300">
              Register
            </button>
          </a>
        </div>

        <form className="p-6" onSubmit={handleSubmit}>
          <h3 className="text-xl font-semibold text-center mb-6 text-gray-500">Login</h3>

          
          <div className="mb-4 relative">
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-8 py-2 border rounded-full focus:outline-none focus:ring-2 ${
                errors.username ? "border-red-500" : "focus:ring-blue-300"
              }`}
              disabled={loading}
            />
            <FaUser className="absolute left-3 top-3.5 text-gray-400" />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          
          <div className="mb-4 relative">
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-8 py-2 border rounded-full focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500" : "focus:ring-blue-300"
              }`}
              disabled={loading}
            />
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

        
          <a
            href="/auth/ForgotPassword"
            className="text-center text-sm mb-4 text-blue-500 hover:underline w-full block"
          >
            Forgot password?
          </a>

          
          {serverError && (
            <p className="text-red-600 text-center mb-4 font-semibold">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-800 text-white py-3 rounded-full hover:bg-blue-600 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center mt-6 text-sm text-gray-500">
            or login with social platforms
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <button
              className="p-3 bg-gray-100 rounded-full hover:shadow"
              aria-label="Login with Google"
              disabled={loading}
            >
              <FcGoogle size={22} />
            </button>
            <button
              className="p-3 bg-gray-100 rounded-full hover:shadow"
              aria-label="Login with Facebook"
              disabled={loading}
            >
              <FaFacebookF size={22} className="text-blue-600" />
            </button>
            <button
              className="p-3 bg-gray-100 rounded-full hover:shadow"
              aria-label="Login with GitHub"
              disabled={loading}
            >
              <FaGithub size={22} className="text-gray-700" />
            </button>
            <button
              className="p-3 bg-gray-100 rounded-full hover:shadow"
              aria-label="Login with LinkedIn"
              disabled={loading}
            >
              <FaLinkedinIn size={22} className="text-blue-700" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
