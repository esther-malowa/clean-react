/**import React, { useState } from 'react';
import logo from './assets/logo.jpg';

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Form Submitted', form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primaryGreen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        
        {/* Logo Section *}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-16 w-16 rounded-full shadow-md" />
        </div>
        
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <input
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded"
          required
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded"
          required
        />
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded"
          required
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Sign Up
        </button>
      </form>
    </div>
  );
}
<p className="text-sm mt-4 text-center">
  Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
</p>**/

import React, { useState } from 'react';
//import logo from './assets/logo.jpg';
import logo from '../../assets/logo.jpg';
export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Form Submitted', form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#58B440] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md"
      >
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-16 sm:h-20 object-contain" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800">
          Register
        </h2>

        <input
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded text-sm"
          required
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded text-sm"
          required
        />
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded text-sm"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded text-sm"
          required
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="mb-4 w-full p-2 border rounded text-sm"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded text-sm sm:text-base"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

