import { useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import logo from '../../assets/logo.jpg';
import { Link } from 'react-router-dom';
import Button from '../form/Button';

export default function AATISignUpForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      validatePassword(value);
      // Also check confirm password again because password changed
      validateConfirmPassword(formData.confirmPassword, value);
    }
    if (name === 'confirmPassword') {
      validateConfirmPassword(value, formData.password);
    }
  };

  const validatePassword = (password) => {
    let error = '';

    if (password.length < 8) {
      error = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      error = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    setPasswordErrors(prev => ({ ...prev, password: error }));
    return error === ''; // return true if no error
  };


  const validateConfirmPassword = (confirmPassword, currentPassword) => {
    let error = '';
    if (confirmPassword !== currentPassword) {
      error = 'Passwords do not match';
    }
    setPasswordErrors(prev => ({ ...prev, confirmPassword: error }));
  };

  const isFormValid =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim() &&
    formData.mobile.trim() &&
    formData.password &&
    formData.confirmPassword &&
    !passwordErrors.password &&
    !passwordErrors.confirmPassword;

  const handleSubmit = async () => {
    validatePassword(formData.password);
    validateConfirmPassword(formData.confirmPassword, formData.password);

    try {
      setIsLoading(true)
      const res = await fetch('/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usernameOrEmail: formData.usernameOrEmail.trim(),
          password: formData.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMsg(data.message || 'Login successful!');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#F2FBF3' }}>
      <div className="max-w-4xl max-sm:max-w-lg mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <div className="mb-4 flex justify-center">
            <img
              src={logo}
              alt="Logo"
              className="w-24 h-24 rounded-full object-cover shadow-md"
            />
          </div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#0F6317' }}>
            Sign up into your account
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8" style={{ borderTop: '4px solid #58B440' }}>
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <label className="text-lg font-semibold mb-3 block" style={{ color: '#0F6317' }}>
                First Name
              </label>
              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full text-base px-4 py-4 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:border-opacity-80"
                style={{
                  backgroundColor: '#FBFEFA',
                  color: '#0F6317',
                  borderColor: '#58B440'
                }}
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label className="text-lg font-semibold mb-3 block" style={{ color: '#0F6317' }}>
                Last Name
              </label>
              <input
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full text-base px-4 py-4 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:border-opacity-80"
                style={{
                  backgroundColor: '#FBFEFA',
                  color: '#0F6317',
                  borderColor: '#58B440'
                }}
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <label className="text-lg font-semibold mb-3 block" style={{ color: '#0F6317' }}>
                Email Id
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full text-base px-4 py-4 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:border-opacity-80"
                style={{
                  backgroundColor: '#FBFEFA',
                  color: '#0F6317',
                  borderColor: '#58B440'
                }}
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="text-lg font-semibold mb-3 block" style={{ color: '#0F6317' }}>
                Mobile No.
              </label>
              <input
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full text-base px-4 py-4 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:border-opacity-80"
                style={{
                  backgroundColor: '#FBFEFA',
                  color: '#0F6317',
                  borderColor: '#58B440'
                }}
                placeholder="Enter your mobile number"
              />
            </div>

            <div>
              <label className="text-lg font-semibold mb-3 block" style={{ color: '#0F6317' }}>
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full text-base px-4 py-4 pr-12 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:border-opacity-80"
                  style={{
                    backgroundColor: '#FBFEFA',
                    color: '#0F6317',
                    borderColor: passwordErrors.password ? '#DB5260' : '#58B440'
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                  style={{ color: '#6B9F70' }}
                >
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
              {passwordErrors.password && (
                <p className="text-sm mt-2" style={{ color: '#DB5260' }}>
                  {passwordErrors.password}
                </p>
              )}
            </div>

            <div>
              <label className="text-lg font-semibold mb-3 block" style={{ color: '#0F6317' }}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full text-base px-4 py-4 pr-12 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:border-opacity-80"
                  style={{
                    backgroundColor: '#FBFEFA',
                    color: '#0F6317',
                    borderColor: passwordErrors.confirmPassword ? '#DB5260' : '#58B440'
                  }}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                  style={{ color: '#6B9F70' }}
                >
                  {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-sm mt-2" style={{ color: '#DB5260' }}>
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>
           {error && (
            <p className="text-sm mt-4 text-center font-semibold" style={{ color: '#DB5260' }}>{error}</p>
          )}
          

          <Button title="Sign up" handleSubmit={handleSubmit} formValid={isFormValid} loading={isLoading} />

          <div className="mt-8 text-center">
            <p className="text-lg" style={{ color: '#6B9F70' }}>
              Already have an account?
              <Link to='/login' className="ml-2 font-semibold cursor-pointer hover:underline transition-colors duration-300" style={{ color: '#F18233' }}>
                Sign in
              </Link>
            </p>
            <p className="text-lg" style={{ color: '#6B9F70' }}>
              Forgot your password?
              <Link to='/reset-password' className="ml-2 font-semibold cursor-pointer hover:underline transition-colors duration-300" style={{ color: '#F18233' }}>
                Reset password
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}