import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/pngwing.com (18).png";
import { FaLinkedin, FaGithub, FaSquareXTwitter, FaInstagram } from "react-icons/fa6";
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative h-24 flex items-center">

          {/* Logo LEFT - Updated with Link to home */}
          <div className="flex items-center space-x-3 absolute left-0">
            <Link to="/">
              <img 
                src={logo} 
                alt="logo" 
                className="cursor-pointer h-16 w-auto" 
              />
            </Link>
            <Link to="/">
              <h1 className="text-2xl font-bold text-black">ConstructionXpert Services</h1>
            </Link>
          </div>

          {/* Centered Navigation */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex space-x-8">
              <li className="cursor-pointer transition-colors duration-200 text-black hover:text-gray-400">
                <Link to="/">Home</Link>
              </li>
              <li className="cursor-pointer transition-colors duration-200 text-black hover:text-gray-400">
                <Link to="/about-us">About us</Link>
              </li>
              <li className="cursor-pointer transition-colors duration-200 text-black hover:text-gray-400">
                <Link to="/projects">Projects</Link>
              </li>
            </ul>
          </div>

          {/* Social Icons RIGHT */}
          <div className="hidden md:flex items-center gap-4 text-2xl absolute right-0">
            <a href="#" className="text-black hover:text-gray-400"><FaLinkedin /></a>
            <a href="#" className="text-black hover:text-gray-400"><FaGithub /></a>
            <a href="#" className="text-black hover:text-gray-400"><FaSquareXTwitter /></a>
            <a href="#" className="text-black hover:text-gray-400"><FaInstagram /></a>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden absolute right-0">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black hover:text-gray-400 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-24 left-0 right-0 bg-white shadow-md z-40 py-4">
          <ul className="flex flex-col items-center space-y-4">
            <li className="cursor-pointer transition-colors duration-200 text-black hover:text-gray-400">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            </li>
            <li className="cursor-pointer transition-colors duration-200 text-black hover:text-gray-400">
              <Link to="/about-us" onClick={() => setIsMenuOpen(false)}>About us</Link>
            </li>
            <li className="cursor-pointer transition-colors duration-200 text-black hover:text-gray-400">
              <Link to="/projects" onClick={() => setIsMenuOpen(false)}>Projects</Link>
            </li>
          </ul>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-24"></div>
    </>
  );
};

export default Navbar;