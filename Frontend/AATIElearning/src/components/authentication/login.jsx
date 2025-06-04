/*import React, { useState } from 'react';
import logo from './assets/logo.jpg';

export default function Login() {
  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Submitted', form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primaryGreen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        {/* Logo *}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-16 w-16 rounded-full shadow-md" />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

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
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
}

<p className="text-sm mt-4 text-center">
  Don't have an account? <a href="/" className="text-blue-600 hover:underline">Register</a>
</p>
*/

import React, { useState } from 'react'; //import logo from './assets/logo.jpg';
import logo from '../../assets/logo.jpg';
export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleSubmit = (e) => { e.preventDefault(); console.log('Logging in with', form); };

  return (<div className="min-h-screen flex items-center justify-center bg-[#58B440] px-4"> <form
    onSubmit={handleSubmit}
    className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm sm:max-w-md"
  > <div className="flex justify-center mb-4"> <img src={logo} alt="Logo" className="h-16 sm:h-20 object-contain" /> </div>

    <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800">
      Login
    </h2>

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
      className="mb-4 w-full p-2 border rounded text-sm"
      required
    />

    <button
      type="submit"
      className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded text-sm sm:text-base"
    >
      Login
    </button>
  </form>
  </div>

  );
}