// src/components/Layout.jsx
import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import  { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faTwitter, faLinkedinIn, faGooglePlusG } from '@fortawesome/free-brands-svg-icons';



const Layout = ({ children}) => {
const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
            <header className="bg-[#5EB74B] shadow-none sticky top-0 z-10">
              <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                  <img src="/images/Logo.png" alt="Logo" className="w-20 h-20 bg-transparent" />
                </div>
                <nav className="hidden md:flex space-x-6 font-medium">
                  <Link to="/" className="hover:text-blue-600">Home</Link>
                  <Link to="/courses" className="hover:text-blue-600">Courses</Link>
                  <Link to="/books" className="hover:text-blue-600">Books</Link>
                  <Link to="/contact" className="hover:text-blue-600">Contact</Link>
                  <Link to="/checkout" className="hover:text-blue-600">Checkout</Link>
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
                </div>
              )}
            </header>
            
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
