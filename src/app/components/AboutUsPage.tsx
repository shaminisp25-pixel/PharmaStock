interface AboutUsPageProps {
  isDarkMode: boolean;
  subPage?: string;
}

export default function AboutUsPage({ isDarkMode, subPage }: AboutUsPageProps) {
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className={`text-3xl mb-2 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>About PharmaStock</h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Leading pharmaceutical warehouse management platform
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className={`p-8 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-xl mb-4 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>Our Mission</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              To revolutionize pharmaceutical warehouse management through innovative technology and unwavering commitment to safety and compliance.
            </p>
          </div>

          <div className={`p-8 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-xl mb-4 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>Our Vision</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              To be the global standard for pharmaceutical inventory management, ensuring medication safety and operational excellence worldwide.
            </p>
          </div>
        </div>

        <div className={`p-8 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-xl mb-4 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>Our Team</h3>
          <div className={`h-64 rounded-lg border-2 border-dashed flex items-center justify-center ${
            isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-100'
          }`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Team Photos Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}
