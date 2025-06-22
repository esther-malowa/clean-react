import { HiOutlineRefresh } from 'react-icons/hi';

const Button = ({ title, handleSubmit, formValid = true, loading = false }) => {
  return (
    <div className="mt-12">
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!formValid || loading}
        className={`mx-auto block py-4 px-12 text-lg font-semibold tracking-wider rounded-lg text-white transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-opacity-50 transform ${
          !formValid || loading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 cursor-pointer'
        }`}
        style={{ backgroundColor: '#58B440' }}
        onMouseEnter={(e) => {
          if (formValid && !loading) e.target.style.backgroundColor = '#428358';
        }}
        onMouseLeave={(e) => {
          if (formValid && !loading) e.target.style.backgroundColor = '#58B440';
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <HiOutlineRefresh className="animate-spin" size={20} />
            Loading...
          </div>
        ) : (
          title
        )}
      </button>
    </div>
  );
};

export default Button;