import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Button from "../form/Button";
import Backendconnection from '../services/services'
import StatusMessage from "../Messages/StatusMessage";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const uid = params.get("uid")

  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm_password) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true)
      const formData = {
        "password": password,
        "confirm_password": confirm_password
      }

      const response = await Backendconnection.resetPassword(uid, token, formData)
      setSuccess(response.success)
    } catch (error){
      setError(error.message || "Something went wrong. Please try again later.")
    } finally {
      setIsLoading(false)
    }

  }
  const isDisabled = !password || !confirm_password || password !== confirm_password;

  return (
    <div className="px-4 py-12 sm:max-h-screen sm:min-h-screen" style={{ backgroundColor: "#F2FBF3" }}>
      <div className="w-full max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg " style={{ borderTop: "4px solid #58B440" }}>
        <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: "#0F6317" }}>
          Reset Password
        </h2>
        <p className="mb-8 text-center" style={{ color: "#6B9F70" }}>Enter your new password below.</p>

        {success ? (
          <StatusMessage message={success} autoDismiss={false} type="success" />
        ) : (
        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="block mb-2 text-lg font-semibold" style={{ color: "#0F6317" }} htmlFor="password">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 pr-12 border-2 rounded-lg focus:outline-none focus:border-opacity-80 transition-all"
                style={{
                  backgroundColor: "#FBFEFA",
                  color: "#0F6317",
                  borderColor: "#58B440"
                }}
              />
              <span className="absolute right-3 top-4 text-green-500 select-none">
                <FontAwesomeIcon icon={faLock} />
              </span>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-lg font-semibold" style={{ color: "#0F6317" }} htmlFor="confirm_password">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm_password"
                type="password"
                placeholder="Confirm new password"
                value={confirm_password}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full p-4 pr-12 border-2 rounded-lg focus:outline-none transition-all ${confirm_password && password !== confirm_password
                    ? "border-red-500 focus:border-red-500"
                    : "focus:border-opacity-80"
                  }`}
                style={{
                  backgroundColor: "#FBFEFA",
                  color: "#0F6317",
                  borderColor: confirm_password && password !== confirm_password ? "#DB5260" : "#58B440"
                }}
              />
              <span className="absolute right-3 top-4 text-green-500 select-none">
                <FontAwesomeIcon icon={faLock} />
              </span>
            </div>
            {confirm_password && password !== confirm_password && (
              <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
            )}
          </div>
          
          {(error) && (
          <StatusMessage message={error} type="error" duration={7000} />
        )}

          <Button title="Reset Password" handleSubmit={handleReset} formValid={!isDisabled} loading={isLoading} />
        </form>)}
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
}