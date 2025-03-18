import React, { useState } from 'react';
import logo from "../assets/pngwing.com (18).png";
import { FaLinkedin, FaGithub, FaSquareXTwitter, FaInstagram } from "react-icons/fa6";
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img 
                src={logo} 
                alt="logo" 
                className="cursor-pointer h-16 w-auto" 
              />
           
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <ul className="flex space-x-6">
                <li className="cursor-pointer transition-colors duration-200 text-black hover:text-gray-400">
                  Home
                </li>
                <li className="cursor-pointer transition-colors duration-200 text-black hover:text-gray-400">
                  About us
                </li>
              </ul>
            </div>

            {/* Desktop Social Icons */}
            <div className="hidden md:flex items-center justify-center gap-4 text-2xl">
              <a 
                href="https://linkedin.com/in/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-400 transition-colors duration-200"
              >
                <FaLinkedin />
              </a>
              <a 
                href="https://github.com/your-username"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-400 transition-colors duration-200"
              >
                <FaGithub />
              </a>
              <a 
                href="https://twitter.com/your-handle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-400 transition-colors duration-200"
              >
                <FaSquareXTwitter />
              </a>
              <a 
                href="https://instagram.com/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-400 transition-colors duration-200"
              >
                <FaInstagram />
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-black hover:text-gray-400 p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800">
            <div className="block px-3 py-2 rounded-md text-base font-medium cursor-pointer text-white hover:text-gray-300">
              Home
            </div>

            <div className="block px-3 py-2 rounded-md text-base font-medium cursor-pointer text-white hover:text-gray-300">
              About us
            </div>
            
            {/* Mobile Social Icons */}
            <div className="flex items-center justify-center gap-4 text-2xl pt-4 border-t border-gray-700">
              <a 
                href="https://linkedin.com/in/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                <FaLinkedin />
              </a>
              <a 
                href="https://github.com/your-username"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                <FaGithub />
              </a>
              <a 
                href="https://twitter.com/your-handle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                <FaSquareXTwitter />
              </a>
              <a 
                href="https://instagram.com/your-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-24"></div>
    </>
  );
};

export default Navbar;