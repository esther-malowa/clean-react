import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Button from "../form/Button";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true)
      const res = await fetch("/api/reset-password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      setMsg(data.message);
    } catch (error) {
      setError("An error has occured.")
    } finally {
      setIsLoading(false)
    }

  }
  const isDisabled = !password || !confirmPassword || password !== confirmPassword;

  return (
    <div className="px-4 py-12 sm:max-h-screen sm:min-h-screen" style={{ backgroundColor: "#F2FBF3" }}>
      <div className="w-full max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg " style={{ borderTop: "4px solid #58B440" }}>
        <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: "#0F6317" }}>
          Reset Password
        </h2>
        <p className="mb-8 text-center" style={{ color: "#6B9F70" }}>Enter your new password below.</p>

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
            <label className="block mb-2 text-lg font-semibold" style={{ color: "#0F6317" }} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full p-4 pr-12 border-2 rounded-lg focus:outline-none transition-all ${confirmPassword && password !== confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "focus:border-opacity-80"
                  }`}
                style={{
                  backgroundColor: "#FBFEFA",
                  color: "#0F6317",
                  borderColor: confirmPassword && password !== confirmPassword ? "#DB5260" : "#58B440"
                }}
              />
              <span className="absolute right-3 top-4 text-green-500 select-none">
                <FontAwesomeIcon icon={faLock} />
              </span>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
            )}
          </div>
          
          {(msg || error) && (
          <p
            className={`mt-6 text-center font-semibold ${error ? "text-red-600" : "text-green-600"
              }`}
          >
            {error || msg}
          </p>
        )}

          <Button title="Reset Password" handleSubmit={handleReset} formValid={!isDisabled} loading={isLoading} />
        </form>
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
