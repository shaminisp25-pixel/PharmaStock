import { ImageWithFallback } from './figma/ImageWithFallback';
import { useEffect, useState } from 'react';

interface HomePageProps {
  isDarkMode: boolean;
}

export default function HomePage({ isDarkMode }: HomePageProps) {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}>
      {/* Hero Section */}
      <section className={`relative py-16 overflow-hidden ${
        isDarkMode ? 'bg-gradient-to-b from-gray-900 via-gray-800/30 to-gray-900' : 'bg-gradient-to-b from-white via-gray-50/30 to-gray-50'
      }`}>
        {/* Background Capsule Image */}
        <div className="absolute inset-0 pointer-events-none">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1761361413429-f9044b300694?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxwaGFybWFjZXV0aWNhbCUyMHBpbGxzJTIwY2Fwc3VsZXMlMjBtZWRpY2luZXxlbnwxfHx8fDE3Nzc1NzI1NDR8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Pharmaceutical capsules"
            className="w-full h-full object-cover"
            style={{ filter: 'blur(6px)' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: isDarkMode
                ? 'linear-gradient(to right, rgba(17, 24, 39, 1) 0%, rgba(17, 24, 39, 0.95) 25%, rgba(17, 24, 39, 0.85) 50%, rgba(17, 24, 39, 0.8) 100%)'
                : 'linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 25%, rgba(255, 255, 255, 0.85) 50%, rgba(255, 255, 255, 0.8) 100%)'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-xl animate-fade-in">
            <div className="inline-block bg-[#14b8a6]/10 text-[#14b8a6] px-3.5 py-1.5 rounded-full mb-5 text-xs tracking-widest">
              SMARTER INVENTORY, SAFER HEALTHCARE
            </div>

            <h1 className="text-4xl leading-snug mb-5">
              <span className={`block mb-1 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>
                Pharmaceutical Warehouse
              </span>
              <span className="text-[#14b8a6]">Management</span>
            </h1>

            <p className={`mb-7 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Real-time inventory tracking, automated compliance monitoring, and intelligent alerts to ensure medication safety while optimizing warehouse efficiency.
            </p>

            <div className="flex gap-3">
              <button className="bg-[#1e3a5f] text-white px-6 py-2.5 rounded-lg hover:bg-[#2d4a6f] transition-all hover:shadow-md text-sm flex items-center gap-2 shadow-sm">
                View Dashboard
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className={`px-6 py-2.5 rounded-lg border-2 transition-all text-sm flex items-center gap-2 shadow-sm ${
                isDarkMode
                  ? 'bg-gray-800 text-white border-gray-600 hover:border-[#14b8a6]'
                  : 'bg-white text-[#1e3a5f] border-gray-300 hover:border-[#1e3a5f] hover:bg-gray-50'
              }`}>
                Upload Data
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        id="stats"
        data-animate
        className={`py-10 border-t transition-all duration-700 ${
          visibleSections.has('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className={`p-5 rounded-xl border shadow-sm hover:shadow-md transition-all ${
              isDarkMode ? 'bg-gradient-to-br from-cyan-900/20 to-gray-800 border-cyan-800' : 'bg-gradient-to-br from-cyan-50 to-white border-cyan-100'
            }`}>
              <div className="w-11 h-11 bg-cyan-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Products</div>
              <div className={`text-3xl ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>12,540</div>
            </div>

            <div className={`p-5 rounded-xl border shadow-sm hover:shadow-md transition-all ${
              isDarkMode ? 'bg-gradient-to-br from-blue-900/20 to-gray-800 border-blue-800' : 'bg-gradient-to-br from-blue-50 to-white border-blue-100'
            }`}>
              <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Active Batches</div>
              <div className={`text-3xl ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>8,320</div>
            </div>

            <div className={`p-5 rounded-xl border shadow-sm hover:shadow-md transition-all ${
              isDarkMode ? 'bg-gradient-to-br from-amber-900/20 to-gray-800 border-amber-800' : 'bg-gradient-to-br from-amber-50 to-white border-amber-100'
            }`}>
              <div className="w-11 h-11 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Expiring Soon</div>
              <div className={`text-3xl ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>340</div>
            </div>

            <div className={`p-5 rounded-xl border shadow-sm hover:shadow-md transition-all ${
              isDarkMode ? 'bg-gradient-to-br from-purple-900/20 to-gray-800 border-purple-800' : 'bg-gradient-to-br from-purple-50 to-white border-purple-100'
            }`}>
              <div className="w-11 h-11 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Transactions</div>
              <div className={`text-3xl ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>24,680</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section
        id="features"
        data-animate
        className={`py-20 transition-all duration-700 ${
          visibleSections.has('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className={`text-3xl mb-3 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>Core Features</h2>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Comprehensive tools for pharmaceutical warehouse management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl border shadow-sm hover:shadow-lg transition-all ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="w-12 h-12 bg-[#14b8a6]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#14b8a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className={`text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>Inventory Tracking</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Real-time monitoring of stock levels, batch numbers, and expiration dates across all warehouse locations
              </p>
            </div>

            <div className={`p-6 rounded-xl border shadow-sm hover:shadow-lg transition-all ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="w-12 h-12 bg-[#14b8a6]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#14b8a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className={`text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>Compliance Management</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Automated compliance checks for GMP, CDSCO, and FDA regulations with audit-ready documentation
              </p>
            </div>

            <div className={`p-6 rounded-xl border shadow-sm hover:shadow-lg transition-all ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="w-12 h-12 bg-[#14b8a6]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#14b8a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className={`text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>Intelligent Alerts</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Smart notifications for low stock, expiring medications, and critical compliance issues
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* System Workflow Section */}
      <section
        id="workflow"
        data-animate
        className={`py-20 transition-all duration-700 ${
          visibleSections.has('workflow') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className={`text-3xl mb-3 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>System Workflow</h2>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Streamlined processes for efficient warehouse operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className={`p-8 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`text-xl mb-4 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>Batch Tracking</h3>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Complete visibility into batch movements, from receiving to dispatch
              </p>
              <div className={`h-48 rounded-lg border-2 border-dashed flex items-center justify-center ${
                isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-100'
              }`}>
                <div className="text-center">
                  <svg className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Visual Placeholder</p>
                </div>
              </div>
            </div>

            <div className={`p-8 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`text-xl mb-4 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>Import/Export</h3>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Seamless data exchange with ERP systems and third-party platforms
              </p>
              <div className={`h-48 rounded-lg border-2 border-dashed flex items-center justify-center ${
                isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-100'
              }`}>
                <div className="text-center">
                  <svg className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Visual Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why PharmaStock Section */}
      <section
        id="why"
        data-animate
        className={`py-20 transition-all duration-700 ${
          visibleSections.has('why') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } ${isDarkMode ? 'bg-gradient-to-b from-gray-800 to-gray-900' : 'bg-gradient-to-b from-gray-50 to-white'}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className={`text-3xl mb-3 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>Why PharmaStock?</h2>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Trusted by leading pharmaceutical companies worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Enterprise Security', desc: 'Bank-grade encryption and role-based access control' },
              { title: 'Scalable Infrastructure', desc: 'Built to grow with your business needs' },
              { title: '24/7 Support', desc: 'Dedicated customer success team always ready to help' }
            ].map((item, index) => (
              <div
                key={index}
                className={`text-center p-6 rounded-xl border ${
                  isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                } shadow-sm hover:shadow-lg transition-all`}
              >
                <div className="w-16 h-16 bg-[#14b8a6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#14b8a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className={`text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>{item.title}</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-[#1e3a5f]'}`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl text-white mb-4">Ready to Transform Your Warehouse?</h2>
          <p className="text-gray-200 mb-8">
            Join hundreds of pharmaceutical companies using PharmaStock
          </p>
          <button className="bg-[#14b8a6] text-white px-8 py-3 rounded-lg hover:bg-[#0d9488] transition-all shadow-lg">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
}
