"use client";
import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

function useRegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.id]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch(
        "https://your-api-domain.com/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: "Bearer YOUR_API_TOKEN", // if needed
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        console.log("User registered:", data);
        // Redirect here if needed
      } else {
        alert(data.message || "Registration failed.");
        console.error("Server error:", data);
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { formData, errors, loading, handleChange, handleSubmit };
}

const Register = () => {
  const { formData, errors, loading, handleChange, handleSubmit } =
    useRegisterForm();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="w-full max-w-md rounded-lg shadow-lg overflow-hidden bg-white">
        <div className="bg-blue-800 text-white text-center mt-1 p-6 rounded-l-full">
          <h2 className="text-xl font-bold">Create Your Account</h2>
          <p className="text-sm">Already have an account?</p>
          <a href="/auth/Login">
            <button className="bg-blue-500 mt-4 text-white hover:bg-blue-400 font-semibold py-2 px-6 rounded-full shadow-md transition duration-300">
              Log in
            </button>
          </a>
        </div>

        <form className="p-6" onSubmit={handleSubmit}>
          <h3 className="text-xl font-semibold text-center mb-6 text-gray-500">
            Register
          </h3>

          {/* Username */}
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
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4 relative">
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-8 py-2 border rounded-full focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500" : "focus:ring-blue-300"
              }`}
              disabled={loading}
            />
            <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
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
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative">
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-8 py-2 border rounded-full focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? "border-red-500"
                  : "focus:ring-blue-300"
              }`}
              disabled={loading}
            />
            <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-blue-800 text-white py-3 rounded-full hover:bg-blue-600 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Social Login */}
          <div className="text-center mt-6 text-sm text-gray-500">
            or register with social platforms
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="p-3 bg-gray-100 rounded-full hover:shadow"
              aria-label="Google"
              disabled={loading}
            >
              <FcGoogle size={22} />
            </button>
            <button
              className="p-3 bg-gray-100 rounded-full hover:shadow"
              aria-label="Facebook"
              disabled={loading}
            >
              <FaFacebookF size={22} className="text-blue-600" />
            </button>
            <button
              className="p-3 bg-gray-100 rounded-full hover:shadow"
              aria-label="GitHub"
              disabled={loading}
            >
              <FaGithub size={22} className="text-gray-700" />
            </button>
            <button
              className="p-3 bg-gray-100 rounded-full hover:shadow"
              aria-label="LinkedIn"
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

export default Register;
