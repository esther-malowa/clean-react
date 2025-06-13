import { useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import logo from '../../assets/logo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../form/Button';
import Backendconnection from '../services/services'
import StatusMessage from '../Messages/StatusMessage';
import Cookies from'js-cookie';


export default function Login() {
  const [formData, setFormData] = useState({
    username_or_email: '',
    password: ''
  });
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = formData.username_or_email.trim() && formData.password;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value? value.trim() : value;

    setFormData(prev => ({
      ...prev,
      [name]: trimmedValue
    }));
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!formData.username_or_email.trim()) {
      setError('Username or email is required');
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      return;
    }

    try {
      setIsLoading(true);
      const response = await Backendconnection.login(formData)
      setSuccess(response.success)

      // set the tokens in cookies.
      Cookies.set(
        "access_token", response.tokens.access, {
          secure: false,
          sameSite: "strict"
        }
      )

      Cookies.set(
        "refresh_token", response.tokens.refresh,{
          secure: false,
          sameSite: "strict"
        }
      )

      setTimeout(() => {
        navigate('/books')
      }, 1500)      
      
    } catch (err) {
      setError(err.message);
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#F2FBF3' }}>
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex justify-center">
            <img
              src={logo}
              alt="Logo"
              className="w-24 h-24 rounded-full object-cover shadow-md"
            />
          </div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#0F6317' }}>
            Sign in to your account
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8" style={{ borderTop: '4px solid #58B440' }}>
          <div className="grid gap-8">
            <div>
              <label className="text-lg font-semibold mb-3 block" style={{ color: '#0F6317' }}>
                Username or Email
              </label>
              <input 
                name="username_or_email" 
                type="text" 
                value={formData.username_or_email}
                onChange={handleInputChange}
                className="w-full text-base px-4 py-4 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:border-opacity-80" 
                style={{ 
                  backgroundColor: '#FBFEFA', 
                  color: '#0F6317',
                  borderColor: '#58B440'
                }}
                placeholder="Enter your username or email" 
              />
            </div>

            <div>
              <label className="text-lg font-semibold mb-3 block" style={{ color: '#0F6317' }}>
                Password
              </label>
              <div className="relative">
                <input 
                  name="password" 
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full text-base px-4 py-4 pr-12 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:border-opacity-80" 
                  style={{ 
                    backgroundColor: '#FBFEFA', 
                    color: '#0F6317',
                    borderColor: '#58B440'
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
            </div>
          </div>

          {error && (
           <StatusMessage message={error} type='error' duration={7000} />
          )}
          {success && (
            <StatusMessage message={success} type='success' duration={7000} />
          )}

          <Button title={"Sign in"} handleSubmit={handleSubmit} formValid={isFormValid} loading={isLoading} />

          <div className="mt-8 text-center">
            <p className="text-lg" style={{ color: '#6B9F70' }}>
              Don’t have an account?
              <Link to='/register' className="ml-2 font-semibold cursor-pointer hover:underline transition-colors duration-300" style={{ color: '#F18233' }}>
                Sign up
              </Link>
            </p>
            <p className="text-lg" style={{ color: '#6B9F70' }}>
              Forgot your password?
              <Link to='/forgot-password' className="ml-2 font-semibold cursor-pointer hover:underline transition-colors duration-300" style={{ color: '#F18233' }}>
                Reset password
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
