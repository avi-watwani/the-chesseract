"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">The Chesseract</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/play" className="text-white hover:text-blue-400 transition-colors">
              Play
            </Link>
            <div className="relative group">
              <button className="flex items-center text-white hover:text-blue-400 transition-colors">
                Learn <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <Link href="/coaches" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">
                    Find your Coach
                  </Link>
                  <Link href="/analysis" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">
                    Analysis Board
                  </Link>
                  <Link href="/board-editor" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">
                    Board Editor
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/shop" className="text-white hover:text-blue-400 transition-colors">
              Shop
            </Link>
            <Link href="/blog" className="text-white hover:text-blue-400 transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-white hover:text-blue-400 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-white hover:text-blue-400 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Login/ Signup */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login"
              className="text-white hover:text-blue-400 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden bg-gray-900 ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link 
            href="/"
            className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md"
          >
            Home
          </Link>
          <Link 
            href="/about"
            className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md"
          >
            About
          </Link>
          <button
            className="flex items-center justify-between w-full px-3 py-2 text-white hover:bg-gray-800 rounded-md"
            onClick={() => {}}
          >
            Courses
            <ChevronDown className="h-4 w-4" />
          </button>
          <div className="pl-4">
            <Link 
              href="/courses/beginner-fundamentals"
              className="block px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md"
            >
              Beginner Fundamentals
            </Link>
            <Link 
              href="/courses/opening-mastery"
              className="block px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md"
            >
              Opening Mastery
            </Link>
            <Link 
              href="/courses/tactical-patterns"
              className="block px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md"
            >
              Tactical Patterns
            </Link>
            <Link 
              href="/courses/advanced-analysis"
              className="block px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md"
            >
              Advanced Analysis
            </Link>
          </div>
          <Link 
            href="/play"
            className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md"
          >
            Play
          </Link>
          <Link 
            href="/coaches"
            className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md"
          >
            Coaches
          </Link>
          <Link 
            href="/blog"
            className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md"
          >
            Blog
          </Link>
          <Link 
            href="/contact"
            className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md"
          >
            Contact
          </Link>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <Link 
              href="#login"
              className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md"
            >
              Log In
            </Link>
            <Link 
              href="#signup"
              className="block px-3 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md mt-2"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 