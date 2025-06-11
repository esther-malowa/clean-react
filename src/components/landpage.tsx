
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faClock, faCertificate } from '@fortawesome/free-solid-svg-icons';

const heroImages = [
  '/images/hero1.jpg',
  '/images/hero2.jpg',
  '/images/hero3.jpg',
]; 

const LandingPage: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {heroImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* Header */}
        <header className="relative z-20 flex items-center justify-between px-6 py-4 bg-transparent">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/images/Logo.png" alt="Logo" className="w-20 h-20 bg-transparent" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6">
            <a href="#home" className="text-white hover:text-blue-200">Home</a>
            <a href="#pages" className="text-white hover:text-blue-200">Pages</a>
            <a href="#our-courses" className="text-white hover:text-blue-200">Our Courses</a>
            <a href="#blog" className="text-white hover:text-blue-200">Blog</a>
            <a href="#dashboard" className="text-white hover:text-blue-200">Dashboard</a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a href="#get-started" className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
              Get Started
            </a>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile Nav Menu */}
        {menuOpen && (
          <nav className="md:hidden absolute top-20 left-0 right-0 bg-black bg-opacity-80 z-30 text-white flex flex-col space-y-4 px-6 py-4">
            <a href="#home" className="hover:text-blue-300" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#pages" className="hover:text-blue-300" onClick={() => setMenuOpen(false)}>Pages</a>
            <a href="#our-courses" className="hover:text-blue-300" onClick={() => setMenuOpen(false)}>Our Courses</a>
            <a href="#blog" className="hover:text-blue-300" onClick={() => setMenuOpen(false)}>Blog</a>
            <a href="#dashboard" className="hover:text-blue-300" onClick={() => setMenuOpen(false)}>Dashboard</a>
            <a href="#get-started" className="bg-blue-600 px-4 py-2 rounded-xl hover:bg-blue-700 text-center" onClick={() => setMenuOpen(false)}>
              Get Started
            </a>
          </nav>
        )}

        {/* Hero Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full bg- bg-opacity-50 text-white text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Learn Anytime, Anywhere</h1>
          <p className="text-lg md:text-xl mb-6 max-w-xl">
            Online courses from top instructors — build skills, get certified, and advance your career.
          </p>
          <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-100 transition">
            Start Learning for Free
          </button>
        </div>
      </section>

       {/* Features Section */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl mb-4">
              <FontAwesomeIcon icon={faGraduationCap} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
            <p>Learn from industry leaders with hands-on experience.</p>
          </div>
          <div>
            <div className="text-5xl mb-4">
              <FontAwesomeIcon icon={faClock} />

            </div>
            <h3 className="text-xl font-semibold mb-2">Flexible Learning</h3>
            <p>Study at your own pace — anytime, from any device.</p>
          </div>
          <div>
            <div className="text-5xl mb-4">
              <FontAwesomeIcon icon={faCertificate} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Certification</h3>
            <p>Get certified and showcase your skills on your resume.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Students Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p>"This platform helped me land a job in tech! The courses are practical and easy to follow."</p>
            <div className="mt-4 font-semibold">— Sarah K.</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p>"I love how I can learn on my own schedule. The instructors are very supportive."</p>
            <div className="mt-4 font-semibold">— James L.</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p>"The certificate I earned gave me the confidence to apply for better opportunities."</p>
            <div className="mt-4 font-semibold">— Anita M.</div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 text-center bg-green-600 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
        <p className="mb-6">Join thousands of students building their future with us.</p>
        <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-100 transition">
          Enroll Now
        </button>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} LearnOnline. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;



  
