import { useState } from "react";
import Button from "../form/Button";
import BackendConnection from '../services/services'
import StatusMessage from "../Messages/StatusMessage";

export default function ActivateAccount() {
  const email = localStorage.getItem('email', '')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setSuccess('')
    setError('')
    setIsLoading(true)

    if (!email) {
      setError('Error getting your email. Please try again or contact us.')
      return;
    }

    try {
      const response = await BackendConnection.resendEmail(email)
      setSuccess(response.success)
    } catch (error) {
      setError(error.message || "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen max-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F2FBF3' }}>
      <div className="max-w-xl text-center bg-white p-10 rounded-xl shadow-lg" style={{ borderTop: '4px solid #58B440' }}>
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#0F6317' }}>
          Check your email
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Your account has been created. We’ve sent an activation link to your email. Please follow the link to activate your account.
        </p>
        {success ? (
          < StatusMessage type="success" message={success} autoDismiss={false} />
        ) : (
          <Button title="Resend Email" handleSubmit={handleSubmit} formValid={email} loading={isLoading} />)}
        {error && (
          <StatusMessage message={error} type="error" duration={7000} />
        )}

      </div>
    </div>
  );
}
