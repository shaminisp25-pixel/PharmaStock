import Image from 'next/image';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Image
          src="/logo.png"
          alt="PharmaStock"
          width={220}
          height={60}
          priority
          className="object-contain"
        />

        {/* NAVIGATION */}
        <nav className="hidden md:flex gap-8 text-sm font-semibold text-gray-700">
          <a href="#features">Features</a>
          <a href="#analytics">Analytics</a>
          <a href="#reports">Reports</a>
          <a href="#compliance">Compliance</a>
        </nav>

        {/* BUTTON */}
        <button className="bg-[#052c65] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-[#0a4db3] transition">
          Get Started
        </button>
      </div>
    </header>
  );
}