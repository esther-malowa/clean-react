import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch("/api/reset-password.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setMsg(data.message);
  };

  const isDisabled = !password || !confirmPassword || password !== confirmPassword;

  return (
    <div className="max-w-md mx-auto mt-24 p-8 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-3xl font-extrabold mb-2 text-gray-800 tracking-wide">
        Reset Password
      </h2>
      <p className="mb-6 text-gray-600">Enter your new password below.</p>
      <form onSubmit={handleReset} className="space-y-5">
        <div>
          <label className="block mb-1 font-semibold text-gray-700" htmlFor="password">
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
              className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
            />
            <span className="absolute right-3 top-3 text-green-400 select-none">
              <FontAwesomeIcon icon={faLock} />
            </span>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700" htmlFor="confirmPassword">
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
              className={`w-full p-3 pr-10 border rounded-lg focus:outline-none transition ${
                confirmPassword && password !== confirmPassword
                  ? "border-red-500 focus:ring-red-400 focus:border-red-400"
                  : "focus:ring-green-400 focus:border-transparent"
              }`}
            />
            <span className="absolute right-3 top-3 text-green-400 select-none">
                <FontAwesomeIcon icon={faLock} />
            </span>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            isDisabled
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Reset Password
        </button>
      </form>

      {(msg || error) && (
        <p
          className={`mt-6 text-center font-semibold ${
            error ? "text-red-600" : "text-green-600"
          }`}
        >
          {error || msg}
        </p>
      )}
    </div>
  );
}