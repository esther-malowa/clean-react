import { useState } from 'react';
import { HiMail, HiOutlineRefresh } from 'react-icons/hi';
import Button from '../form/Button';
import Backendconnection from '../services/services'
import StatusMessage from '../Messages/StatusMessage';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      setLoading(true)
      const response = await Backendconnection.forgotPasword(email)
      setSuccess(response.success)
    } catch(error){
      console.log(error)
      setError(error.message || "Something went Wrong")
    } finally {
      setLoading(false)
    }
    
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2FBF3] px-4">
      <div className="w-full max-w-lg rounded-lg border border-green-200 bg-white p-6 sm:p-10 shadow-lg">
        {/* Replace DummyLogo with your actual logo */}
        <div className="mb-6 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <HiMail size={32} className="text-green-600" />
          </div>
        </div>

        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">Forgot Password?</h2>

        {success ? (
          <StatusMessage message={success} type='success' autoDismiss={false} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600">
                  <HiMail size={20} />
                </span>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            <Button loading={loading} title='Send Password Reset Link' handleSubmit={handleSubmit} formValid={email} />
          </form>
        )}

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
