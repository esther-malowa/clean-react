// src/components/Layout.jsx
import { Link } from "react-router-dom";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import useProtectPage from "../utils/ProtectPage";
import Cookies from 'js-cookie'

const Layout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useProtectPage({ validateToken: true, enableLoading: false , redirectPath: null})

  const handleLogout = () => {
    Cookies.remove("access_token")
  }
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false)
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header
        className={`bg-[#5EB74B] sticky top-0 z-10 transition-all duration-300 ${scrolled ? "py-1" : "py-2"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between transition-all duration-300">
          {/* Logo */}
          <div
            className={`items-center space-x-2 transition-opacity duration-300 ${scrolled ? "opacity-0 hidden md:flex" : "opacity-100 flex"
              }`}
          >
            <img
              src="/images/Logo.png"
              alt="Logo"
              className="w-12 h-12 bg-transparent"
            />
          </div>
          <nav className="hidden md:flex space-x-6 font-medium">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            {/* <Link to="/courses" className="hover:text-blue-600">Courses</Link> */}
            <Link to="/books" className="hover:text-blue-600">Books</Link>
            {/* <Link to="/contact" className="hover:text-blue-600">Contact</Link> */}
            <Link to="/checkout" className="hover:text-blue-600">Checkout</Link>
            {isAuthenticated ?
              (<div className="hidden md:block">

                <Link to="" className="bg-orange-600 text-white px-4 py-2 rounded-xl hover:bg-orange-700 transition" onClick={handleLogout}>
                  Logout
                </Link>
              </div>) :
              (
                <div className="hidden md:block">
                  <Link to="/login" className="bg-orange-600 text-white mx-4 px-4 py-2 rounded-xl hover:bg-orange-700 transition">
                    Sign In
                  </Link>

                  <Link to="/register" className="bg-orange-600 text-white px-4 py-2 rounded-xl hover:bg-orange-700 transition">
                    Sign Up
                  </Link>
                </div>
              )
            }
          </nav>
          <button className="md:hidden text-gray-800" onClick={() => setMenuOpen(!menuOpen)}>
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t text-center py-4 space-y-3">
            <Link to="/" className="block hover:text-blue-600" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/courses" className="block hover:text-blue-600" onClick={() => setMenuOpen(false)}>Courses</Link>
            <Link to="/books" className="block hover:text-blue-600" onClick={() => setMenuOpen(false)}>Books</Link>
            <Link to="/contact" className="block hover:text-blue-600" onClick={() => setMenuOpen(false)}>Contact</Link>
            <Link to="/checkout" className="block hover:text-blue-600" onClick={() => setMenuOpen(false)}>Checkout</Link>

            {isAuthenticated ? (
              <Link to="" className="block text-orange-600 hover:text-orange-800" onClick={() => { setMenuOpen(false); handleLogout }}>
                Logout
              </Link>
            ) : (
              <>
                <Link to="/login" className="block text-orange-600 hover:text-orange-800" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link to="/register" className="block text-orange-600 hover:text-orange-800" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}

      </header>

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
