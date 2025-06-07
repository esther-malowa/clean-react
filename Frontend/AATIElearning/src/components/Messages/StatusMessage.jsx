import { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";

export default function StatusMessage({
  message,
  type = "error", // 'success' or 'error'
  duration = 5000,
  autoDismiss = true,
  className = ""
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!message) return;

    setVisible(true);

    let timer;
    if (autoDismiss) {
      timer = setTimeout(() => setVisible(false), duration);
    }

    return () => clearTimeout(timer);
  }, [message, duration, autoDismiss]);

  if (!message || !visible) return null;

  const bgColor = type === "success" ? "bg-emerald-100" : "bg-red-100";
  const textColor = type === "success" ? "text-emerald-700" : "text-red-700";
  const borderColor = type === "success" ? "border-emerald-700" : "border-red-400";

  return (
    <div
      className={`w-full flex items-center justify-between px-4 mt-5 py-3 rounded-md border ${bgColor} ${textColor} ${borderColor} ${className}`}
    >
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={() => setVisible(false)}
        className="text-xl focus:outline-none"
      >
        <HiX />
      </button>
    </div>
  );
}
