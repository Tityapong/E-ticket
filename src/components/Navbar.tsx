"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="container mx-auto py-4 px-4 flex items-center justify-between relative z-50">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-slate-700">Tix</span>
          <span className="text-teal-500">'Central</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        <Link
          href="/products"
          className="text-slate-700 hover:text-teal-500 transition-colors"
        >
          Products
        </Link>
        <Link
          href="/developers"
          className="text-slate-700 hover:text-teal-500 transition-colors"
        >
          Services
        </Link>
        <Link
          href="/about"
          className="text-slate-700 hover:text-teal-500 transition-colors"
        >
          About Us
        </Link>
        <Link
          href="/apply"
          className="text-slate-700 hover:text-teal-500 transition-colors"
        >
          Apply Now
        </Link>
      </nav>

      {/* Desktop Login Button */}
      <div className="hidden md:flex items-center">
        <Link
          href="/login"
          className="px-6 py-2 border border-teal-500 rounded-md text-teal-500 hover:bg-teal-500 hover:text-white transition-colors"
        >
          Login
        </Link>
      </div>

      {/* Mobile Controls (Login + Menu Trigger) */}
      <div className="md:hidden flex items-center space-x-3">
        <Link
          href="/login"
          className="px-4 py-1 border border-teal-500 rounded-md text-teal-500 hover:bg-teal-500 hover:text-white transition-colors text-sm"
        >
          Login
        </Link>
        <button
          onClick={toggleMobileMenu}
          className="text-slate-700 focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md border-t">
          <nav className="flex flex-col items-center py-4 space-y-4">
            <Link
              href="/products"
              className="text-slate-700 hover:text-teal-500 transition-colors"
              onClick={toggleMobileMenu}
            >
              Products
            </Link>
            <Link
              href="/developers"
              className="text-slate-700 hover:text-teal-500 transition-colors"
              onClick={toggleMobileMenu}
            >
              Developers
            </Link>
            <Link
              href="/about"
              className="text-slate-700 hover:text-teal-500 transition-colors"
              onClick={toggleMobileMenu}
            >
              About Us
            </Link>
            <Link
              href="/apply"
              className="text-slate-700 hover:text-teal-500 transition-colors"
              onClick={toggleMobileMenu}
            >
              Apply Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}