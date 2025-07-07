"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic frontend validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      setIsLoading(false);
      return;
    }

    try {
      // In a real application, you'd send a request to your backend:
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, password }),
      // });

      // const data = await response.json();

      // For demonstration purposes, keeping your mock logic:
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      if (email === 'admin@example.com' && password === '123') {
        localStorage.setItem('mock-token', 'demo-token');
        router.push('/card');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
      <div>
        <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your email"
          required
          aria-required="true"
        />
      </div>

      <div>
        <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 pr-10 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
            required
            aria-required="true"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414L5.586 8H4a1 1 0 000 2h3.586l1.707 1.707a1 1 0 001.414-1.414L10.414 10H16a1 1 0 000-2h-5.586l-1.707-1.707a1 1 0 00-1.414 1.414L9.586 10H4a1 1 0 000 2h5.586l-1.707 1.707a1 1 0 001.414 1.414L10.414 12H16a1 1 0 000-2h-5.586l-1.707-1.707a1 1 0 00-1.414 1.414L9.586 10H4a1 1 0 000 2h5.586l-1.707 1.707a1 1 0 001.414 1.414L10.414 12H16a1 1 0 000-2h-5.586l-1.707-1.707a1 1 0 00-1.414 1.414L9.586 10H4a1 1 0 000 2h5.586l-1.707 1.707a1 1 0 001.414 1.414L10.414 12H16a1 1 0 000-2h-5.586l-1.707-1.707a1 1 0 00-1.414 1.414L9.586 10H4a1 1 0 000 2h5.586l-1.707 1.707a1 1 0 001.414 1.414L10.414 12H16a1 1 0 000-2h-5.586l-1.707-1.707a1 1 0 00-1.414 1.414L9.586 10H4a1 1 0 000 2h5.586l-1.707 1.707a1 1 0 001.414 1.414L10.414 12H16a1 1 0 000-2h-5.586l-1.707-1.707a1 1 0 00-1.414 1.414L9.586 10H4a1 1 0 000 2h5.586l-1.707 1.707a1 1 0 001.414 1.414L10.414 12H16a1 1 0 000-2h-5.586l-1.707-1.707a1 1 0 00-1.414 1.414L9.586 10H4a1 1 0 000 2h5.586l-1.707 1.707a1 1 0 001.414 1.414L10.414 12H16a1 1 0 000-2h-5.586l-1.707-1.707a1 1 0 00-1.414 1.414L9.586 10H4a1 1 0 000 2h5.586l-1.707 1.707a1 1 0 001.414 1.414L10.414 12H16a1 1 0 000-2h-5.586l-1.707-1.707a1 1 0 00-1.414 1.414L9.586 10H4a1 1 0 000 2h5.586l-1.707 1.707a1 1 0 001.414 1.414L10.414 12H16a1 1 0 000-2h-5.586z" clipRule="evenodd" />
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mt-3 text-center">{error}</p>}

      <button
        type="submit"
        className={`w-full py-2 rounded transition ${
          isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        } text-white font-semibold`}
        disabled={isLoading}
      >
        {isLoading ? 'Logging In...' : 'Log In'}
      </button>

      <div className="text-center mt-4 text-sm">
        <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
      </div>
    </form>
  );
}