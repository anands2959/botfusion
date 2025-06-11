"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full py-4 px-6 md:px-12 flex items-center justify-between bg-white shadow-sm">
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <Image 
            src="/botfusion-logo.png" 
            alt="BotFusion Logo" 
            width={140} 
            height={30} 
            priority 
          />
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex md:items-center md:space-x-6">
        <Link href="#features" className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors">
          Features
        </Link>
        <Link href="#how-it-works" className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors">
          How It Works
        </Link>
        <Link href="#demo" className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors">
          Live Demo
        </Link>
        
      </div>

      {/* CTA Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        <Link 
          href="/signin" 
          className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors"
        >
          Sign In
        </Link>
        <Link 
          href="/signup" 
          className="px-5 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>
      </div>

      {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-gray-700" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
     
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-md py-4 px-6 md:hidden z-50">
          <div className="flex flex-col space-y-4">
            <Link 
              href="/#features" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/#how-it-works" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            
            <Link 
              href="/demo" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Demo
            </Link>
            
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-2 flex flex-col space-y-3">
              <Link 
                href="/signin" 
                className="px-4 py-2 text-center text-gray-700 font-medium border border-gray-300 rounded-full hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="px-4 py-2 text-center bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}