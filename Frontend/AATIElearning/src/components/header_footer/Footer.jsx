import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faLinkedinIn, faGooglePlusG } from '@fortawesome/free-brands-svg-icons';


const Footer = () => {
  return (
    <footer className="bg-[#58B440] text-white pt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-8 pb-10 border-b border-gray-700">
        {/* Newsletter */}
        <div>
          <h3 className="font-semibold text-lg mb-4 uppercase">Sign Up For A Newsletter</h3>
          <p className="text-sm mb-4">
            Weekly Breaking News Analysis And Cutting Edge Advices On AATI.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your Email Address"
              className="px-4 py-2 w-full bg-gray-900 text-white focus:outline-none"
            />
            <button className="bg-yellow-400 px-4 text-black">
              ➜
            </button>
          </div>
        </div>

        {/* Links Section */}
        <div>
          <h3 className="font-semibold text-lg mb-4 uppercase">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>Home</li>
            <li>About</li>
            <li>FAQs</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4 uppercase">Get In Touch</h3>
          <ul className="space-y-2 text-sm">
            <li>Dashboard</li>
            <li>Blog</li>
            <li>Portfolio</li>
            <li>Event</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-4 uppercase">Courses</h3>
          <ul className="space-y-2 text-sm">
            <li>Courses</li>
            <li>Details</li>
            <li>Membership</li>
            <li>Profile</li>
          </ul>
        </div>

        {/* Gallery */}
        <div>
  <h3 className="font-semibold text-lg mb-4 uppercase">Our Gallery</h3>
  <div className="grid grid-cols-3 gap-2">
    {["hero1", "hero2", "hero3"].map((name) => (
      <div key={name} className="w-full h-32 overflow-hidden">
        <img
          src={`/images/${name}.jpg`}
          alt={`Gallery image ${name}`}
          className="w-full h-full object-cover rounded"
        />
      </div>
    ))}

        
       
    
  </div>
</div>

      </div>

      {/* Footer Bottom */}
      <div className="flex flex-col md:flex-row justify-between items-center px-4 py-6 max-w-7xl mx-auto text-sm">
        <p className="text-white-400">© 2021 <span className="font-semibold text-white">AATI</span> All Rights Reserved.</p>
        <div className="flex items-center gap-4 mt-4 md:mt-0 cursor-pointer">
          <FontAwesomeIcon icon= {faFacebookF}/>
          <FontAwesomeIcon icon={faTwitter} />
          <FontAwesomeIcon icon={faLinkedinIn} />
          <FontAwesomeIcon icon={faGooglePlusG} />
          <button className="ml-4 bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-300">Join Now</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
