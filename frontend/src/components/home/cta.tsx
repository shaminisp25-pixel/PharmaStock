"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative py-24 overflow-hidden">
      
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 opacity-95"></div>

      {/* Blur Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-cyan-300/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        
        {/* Heading */}
        <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
          Transform Your Pharmacy Inventory
          <span className="block mt-2 text-cyan-200">
            Into a Smart Digital System
          </span>
        </h2>

        {/* Description */}
        <p className="mt-8 text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
          Streamline medicine tracking, expiry management, stock analytics,
          billing, and supplier coordination with PharmaStock’s modern SaaS
          platform.
        </p>

        {/* Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
          
          <Link
            href="/dashboard"
            className="px-8 py-4 rounded-2xl bg-white text-blue-700 font-semibold shadow-xl hover:scale-105 transition-all duration-300"
          >
            Launch Dashboard
          </Link>

          <Link
            href="/demo"
            className="px-8 py-4 rounded-2xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300"
          >
            Watch Demo
          </Link>
        </div>

        {/* Small Note */}
        <p className="mt-6 text-sm text-blue-100/80">
          No credit card required • Free 14-day trial • Cancel anytime
        </p>
      </div>
    </section>
  );
}