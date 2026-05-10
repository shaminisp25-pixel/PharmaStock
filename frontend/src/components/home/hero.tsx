"use client";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24">
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-purple-500/20 blur-3xl rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Content */}
        <div>
          <p className="inline-flex px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
            Smart Pharmaceutical SaaS Platform
          </p>

          <h1 className="mt-8 text-5xl lg:text-6xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
            Revolutionize Your
            <span className="text-cyan-500 dark:text-cyan-400">
              Pharmacy Inventory
            </span>
          </h1>

          <p className="mt-8 text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Manage stock, expiry dates, suppliers, warehouse operations,
            realtime analytics, and compliance — all in one intelligent system.
          </p>

          <div className="mt-10 flex flex-wrap gap-5">
            <button className="neon-button text-white px-8 py-4 rounded-2xl font-bold">
              Get Started
            </button>

            <button className="px-8 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 font-semibold">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="glass-card rounded-[32px] p-8 shadow-2xl">
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow">
              <p className="text-sm text-slate-500">Medicines</p>
              <h3 className="text-2xl font-bold mt-2">12.5K</h3>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow">
              <p className="text-sm text-slate-500">Expired</p>
              <h3 className="text-2xl font-bold mt-2 text-red-500">48</h3>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow">
              <p className="text-sm text-slate-500">Revenue</p>
              <h3 className="text-2xl font-bold mt-2 text-green-600">
                ₹8.2L
              </h3>
            </div>
          </div>

         <div className="mt-6 h-72 rounded-3xl bg-gradient-to-br from-cyan-500 to-purple-600 relative overflow-hidden p-6 shadow-inner">

  {/* Sidebar */}
  <div className="absolute left-6 top-6 w-16 h-56 rounded-2xl bg-white/10 backdrop-blur-md"></div>

  {/* Top Stats */}
  <div className="absolute left-28 right-6 top-6 h-20 rounded-2xl bg-white/10"></div>

  {/* Main Chart */}
  <div className="absolute left-28 right-6 top-32 h-28 rounded-2xl bg-white/10"></div>

  {/* Bottom Analytics */}
  <div className="absolute left-28 right-6 bottom-6 h-14 rounded-2xl bg-white/10"></div>

</div>
        </div>
      </div>
    </section>
  );
}