import { Link } from 'react-router-dom';

export default function AccountActivated() {
  localStorage.removeItem('email')
  return (
    <div className="min-h-screen max-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F2FBF3' }}>
      <div className="max-w-xl text-center bg-white p-10 rounded-xl shadow-lg" style={{ borderTop: '4px solid #58B440' }}>
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#0F6317' }}>
          Congratulations 🎉🎉
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Your account has just been activated. You can now log in to your account.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-3 bg-[#58B440] text-white rounded-lg text-lg font-semibold hover:bg-[#4DA337] transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
