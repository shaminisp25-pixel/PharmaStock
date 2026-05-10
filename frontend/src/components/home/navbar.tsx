"use client";

import Link from "next/link";
import Image from "next/image";


export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/70 dark:bg-[#0B1120]/70 border-b border-white/20 dark:border-white/10">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="PharmaStock Logo"
            width={180}
            height={50}
            priority
            className="object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          <Link
            href="/"
            className="text-slate-700 dark:text-slate-200 hover:text-cyan-500 transition-all duration-300 font-medium"
          >
            Home
          </Link>

          <Link
            href="/features"
            className="text-slate-700 dark:text-slate-200 hover:text-cyan-500 transition-all duration-300 font-medium"
          >
            Features
          </Link>

          <Link
            href="/pricing"
            className="text-slate-700 dark:text-slate-200 hover:text-cyan-500 transition-all duration-300 font-medium"
          >
            Pricing
          </Link>

          <Link
            href="/about"
            className="text-slate-700 dark:text-slate-200 hover:text-cyan-500 transition-all duration-300 font-medium"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="text-slate-700 dark:text-slate-200 hover:text-cyan-500 transition-all duration-300 font-medium"
          >
            Contact
          </Link>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex px-5 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 font-medium">
            Login
          </button>

          <button className="neon-button text-white px-6 py-3 rounded-2xl font-semibold">
            Get Started
          </button>
        </div>
      </nav>
    </header>
  );
}