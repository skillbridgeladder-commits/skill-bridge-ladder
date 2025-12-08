'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="absolute w-full z-50 top-0 left-0 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        
        {/* LEFT: LOGO & MAIN NAV */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="relative w-9 h-9 md:w-10 md:h-10">
               <Image 
                src="/logo.png" 
                alt="SkillBridgeLadder" 
                fill 
                className="object-contain rounded-full" 
              />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight text-slate-900 leading-none hidden sm:block">
              SkillBridge<span className="text-blue-600">Ladder</span>
            </span>
          </Link>

          {/* Upwork-Style Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/find-talent" className="hover:text-blue-600">Find Talent</Link>
            <Link href="/find-work" className="hover:text-blue-600">Find Work</Link>
            <Link href="/company/why-us" className="hover:text-blue-600">Why Us</Link>
            <Link href="/company/about" className="hover:text-blue-600">About</Link>
          </div>
        </div>

        {/* RIGHT: SEARCH & AUTH */}
        <div className="flex items-center gap-4">
          
          {/* Search Bar (Hidden on mobile) */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-500" />
          </div>

          <Link href="/login" className="hidden md:block px-5 py-2 rounded-full text-slate-900 text-sm font-bold hover:text-blue-600 transition-colors">
            Log In
          </Link>
          <Link href="/signup" className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
            Sign Up
          </Link>
        </div>

      </div>
    </nav>
  )
}