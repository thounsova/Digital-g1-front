import React from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

const Register = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100 px-4 font-inter">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-lg overflow-hidden">
        {/* Left Panel */}
        <div className="bg-blue-400 text-white text-center p-6 rounded-b-3xl">
          <h2 className="text-xl font-bold">Welcome Back!</h2>
          <p className="text-sm">Already have an account?</p>
          <button className="mt-2 px-4 py-1 bg-white text-blue-500 rounded-full font-medium hover:bg-blue-100 transition focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75">
            Login
          </button>
        </div>

        {/* Registration Form */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-center mb-4 text-gray-500">
            Register
          </h3>

          {/* Username */}
          <div className="mb-4 relative text-gray-500">
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              className="w-full px-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75"
            />
            <FaUser
              className="absolute left-3 top-3 text-gray-400"
              aria-hidden="true"
            />
          </div>

          {/* Email */}
          <div className="mb-4 relative text-gray-500">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full px-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75"
            />
            <FaEnvelope
              className="absolute left-3 top-3 text-gray-400"
              aria-hidden="true"
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative text-gray-500">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full px-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75"
            />
            <FaLock
              className="absolute left-3 top-3 text-gray-400"
              aria-hidden="true"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative text-gray-500">
            <label htmlFor="confirm-password" className="sr-only">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm Password"
              className="w-full px-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75"
            />
            <FaLock
              className="absolute left-3 top-3 text-gray-400"
              aria-hidden="true"
            />
          </div>

          {/* Register Button */}
          <button className="w-full bg-blue-500 text-white py-3 rounded-full hover:bg-blue-600 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75">
            Register
          </button>

          {/* Social Logins */}
          <div className="text-center mt-4 text-sm text-gray-500">
            or register with social platforms
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <button
              className="p-2 bg-gray-100 rounded-full hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Register with Google"
            >
              <FcGoogle size={20} aria-hidden="true" />
            </button>
            <button
              className="p-2 bg-gray-100 rounded-full hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Register with Facebook"
            >
              <FaFacebookF
                size={20}
                className="text-blue-600"
                aria-hidden="true"
              />
            </button>
            <button
              className="p-2 bg-gray-100 rounded-full hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Register with GitHub"
            >
              <FaGithub
                size={20}
                className="text-blue-600"
                aria-hidden="true"
              />
            </button>
            <button
              className="p-2 bg-gray-100 rounded-full hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Register with LinkedIn"
            >
              <FaLinkedinIn
                size={20}
                className="text-blue-700"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
