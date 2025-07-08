import React from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";

const App = () => {
  // Renamed from Login to App for React default export
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100 px-4 font-inter">
      {" "}
      {/* Added font-inter */}
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-lg overflow-hidden">
        <div className="bg-blue-400 text-white text-center p-6 rounded-b-3xl">
          <h2 className="text-xl font-bold">Hello, Welcome!</h2>
          <p className="text-sm">Don't have an account?</p>
          <a href="/auth/Register">
            <button className="mt-2 px-4 py-1 bg-white text-blue-500 rounded-full font-medium hover:bg-blue-100 transition focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75">
              Register
            </button>
          </a>
        </div>

        {/* Login Form */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-center mb-4 text-gray-500">
            Login
          </h3>

          <div className="mb-4 relative text-gray-500">
            {/* Added label for accessibility */}
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              id="username" // Added id to link with label
              type="text"
              placeholder="Username"
              className="w-full px-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75"
            />
            <FaUser
              className="absolute left-3 top-3 text-gray-400"
              aria-hidden="true"
            />{" "}
            {/* Added aria-hidden */}
          </div>

          <div className="mb-2 relative text-gray-500">
            {/* Added label for accessibility */}
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password" // Added id to link with label
              type="password"
              placeholder="Password"
              className="w-full px-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75"
            />
            <FaLock
              className="absolute left-3 top-3 text-gray-400"
              aria-hidden="true"
            />{" "}
            {/* Added aria-hidden */}
          </div>

          <button
            className="text-center text-sm mb-4 text-blue-500 hover:underline cursor-pointer w-full"
            type="button"
          >
            {" "}
            {/* Changed to button for semantic correctness and added type */}
            Forgot password?
          </button>

          <button className="w-full bg-blue-500 text-white py-3 rounded-full hover:bg-blue-600 transition font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75">
            Login
          </button>

          {/* Social Logins */}
          <div className="text-center mt-4 text-sm text-gray-500">
            or login with social platforms
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <button
              className="p-2 bg-gray-100 rounded-full hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75"
              aria-label="Login with Google"
            >
              {" "}
              {/* Added aria-label */}
              <FcGoogle size={20} aria-hidden="true" />{" "}
              {/* Added aria-hidden */}
            </button>
            <button
              className="p-2 bg-gray-100 rounded-full hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75"
              aria-label="Login with Facebook"
            >
              {" "}
              {/* Added aria-label */}
              <FaFacebookF
                size={20}
                className="text-blue-600"
                aria-hidden="true"
              />{" "}
              {/* Added aria-hidden */}
            </button>
            <button
              className="p-2 bg-gray-100 rounded-full hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75"
              aria-label="Login with GitHub"
            >
              {" "}
              {/* Added aria-label */}
              <FaGithub
                size={20}
                className="text-blue-600"
                aria-hidden="true"
              />{" "}
              {/* Added aria-hidden */}
            </button>
            <button
              className="p-2 bg-gray-100 rounded-full hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75"
              aria-label="Login with LinkedIn"
            >
              {" "}
              {/* Added aria-label */}
              <FaLinkedinIn
                size={20}
                className="text-blue-700"
                aria-hidden="true"
              />{" "}
              {/* Added aria-hidden */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
