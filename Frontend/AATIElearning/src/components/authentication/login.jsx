import React, { useState } from 'react';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in with', form);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left side - Image */}
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: 'url(your-image-url.jpg)' }}
      >
        {/* Replace 'your-image-url.jpg' with the actual image URL */}
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 h-screen lg:h-auto flex items-start lg:items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md flex flex-col">
          <h2 className="text-2xl font-bold text-center mb-4">Welcome Back</h2>
          <p className="text-center mb-6">Sign in to continue your journey</p>
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md flex flex-col flex-grow">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition mt-auto"
            >
              Sign In
            </button>
            <div className="text-center mt-4">
              Don't have an account?{' '}
              <a href="#" className="text-green-500 hover:underline">
                Sign up here
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

