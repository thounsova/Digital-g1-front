import React from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center   font-inter">
      {/* Logo */}
   

      {/* Login Card */}
      <div className=" w-full max-w-md  shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-amber-400 text-white text-center mt-1 p-6 rounded-l-full">
          <h2 className="text-xl font-bold">Hello, Welcome!</h2>
          <p className="text-sm">Don't have an account?</p>
          <a href="/auth/Register">
   
             <button className="mt-2 px-6 py-2 bg-yellow-400 border border-gray-200 text-gray-800 font-medium  hover:bg-blue-100 hover:text-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-300">
      Register
          </button>
          </a>
        </div>

        {/* Login Form */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-center mb-6 text-gray-500">Login</h3>

          {/* Username */}
          <div className="mb-4 relative">
            <input
              id="username"
              type="text"
              placeholder="Username"
              className="w-full px-10 py-3  border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <FaUser className="absolute left-3 top-3.5 text-gray-950" />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full px-10 py-3 border  rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <FaLock className="absolute left-3 top-3.5 text-gray-950" />
          </div>

          {/* Forgot Password */}
          <button
            className="text-center text-sm mb-4 text-blue-500 hover:underline w-full"
            type="button"
          >
            Forgot password?
          </button>

          {/* Login Button */}
          <button className="w-full bg-amber-400 text-white py-3 rounded-full hover:bg-blue-600 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-300">
            Login
          </button>

          {/* Social Login */}
          <div className="text-center mt-6 text-sm text-gray-500">
            or login with social platforms
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button className="p-3 bg-gray-100 rounded-full hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-300" aria-label="Login with Google">
              <FcGoogle size={22} />
            </button>
            <button className="p-3 bg-gray-100 rounded-full hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-300" aria-label="Login with Facebook">
              <FaFacebookF size={22} className="text-blue-600" />
            </button>
            <button className="p-3 bg-gray-100 rounded-full hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-300" aria-label="Login with GitHub">
              <FaGithub size={22} className="text-gray-700" />
            </button>
            <button className="p-3 bg-gray-100 rounded-full hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-300" aria-label="Login with LinkedIn">
              <FaLinkedinIn size={22} className="text-blue-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
