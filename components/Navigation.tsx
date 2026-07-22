'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          PM Arsenal
        </Link>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className={`${isOpen ? 'block' : 'hidden'} md:flex gap-8 md:gap-6 absolute md:relative top-full left-0 right-0 md:top-auto bg-white md:bg-transparent p-4 md:p-0 flex-col md:flex-row`}>
          <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
            Home
          </Link>
          <Link href="/resources" className="text-gray-700 hover:text-blue-600 transition">
            Resources
          </Link>
          <Link href="/tools" className="text-gray-700 hover:text-blue-600 transition">
            Tools
          </Link>
          <Link href="/portfolio-guide" className="text-gray-700 hover:text-blue-600 transition">
            Portfolio Guide
          </Link>
        </div>
      </div>
    </nav>
  );
}
