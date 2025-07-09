import React from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

const Register = () => {
  return (
    <div className="flex items-center  justify-center min-h-screen bg-gray-100  font-sans">
      <div className=" w-full max-w-md rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-amber-400 text-white text-center mt-1 p-6 rounded-l-full">
          <h2 className="text-xl font-bold">Create Your Account</h2>
          <p className="text-sm"> Already have an account?{" "}</p>
          <a href="/auth/Login">
          
                <button className="mt-2 px-6 py-2 bg-yellow-400 border border-gray-200 text-gray-900 font-medium  hover:bg-blue-100 hover:text-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-300">
              Log in
          </button>
          </a>
        </div>


        {/* Registration Form */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-center mb-6 text-gray-500">
            Register
          </h3>

          {/* Username */} 
          <div className="mb-4 text-gray-500 relative">
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              className="w-full px-10 py-3 text-gray-950 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <FaUser className="absolute left-3 top-3.5 text-gray-400" aria-hidden="true" />
          </div>

          {/* Email */}
          <div className="mb-4 relative">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full px-10 py-3 text-gray-950 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" aria-hidden="true" />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full px-10 py-3 border text-gray-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <FaLock className="absolute left-3 top-3.5 text-gray-400" aria-hidden="true" />
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative">
            <label htmlFor="confirm-password" className="sr-only">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm Password"
              className="w-full px-10 py-3 text-gray-950 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <FaLock className="absolute left-3 top-3.5 text-gray-400" aria-hidden="true" />
          </div>

          {/* Register Button */}
          <button className="w-full bg-amber-400 text-white py-3 rounded-md hover:bg-blue-700 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-400">
            Register
          </button>

          {/* Social Logins */}
          <div className="text-center mt-6 text-sm text-gray-500">
            or register with social platforms
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="p-3 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Register with Google"
            >
              <FcGoogle size={22} aria-hidden="true" />
            </button>
            <button
              className="p-3 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Register with Facebook"
            >
              <FaFacebookF size={22} className="text-blue-600" aria-hidden="true" />
            </button>
            <button
              className="p-3 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Register with GitHub"
            >
              <FaGithub size={22} className="text-gray-700" aria-hidden="true" />
            </button>
            <button
              className="p-3 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Register with LinkedIn"
            >
              <FaLinkedinIn size={22} className="text-blue-700" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
