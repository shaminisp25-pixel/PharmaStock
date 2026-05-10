interface CompliancePageProps {
  isDarkMode: boolean;
  subPage?: string;
}

export default function CompliancePage({ isDarkMode, subPage }: CompliancePageProps) {
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-emerald-50 to-white text-gray-900'}`}>
      <div className={`border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-emerald-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className={`text-3xl mb-2 ${
            isDarkMode
              ? 'bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent'
          }`}>
            Compliance Management
          </h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Regulatory compliance and documentation
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-6">
          {['GMP Standards', 'CDSCO Requirements', 'Documentation'].map((title, idx) => (
            <div key={idx} className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-emerald-200'}`}>
              <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
              <div className={`h-48 rounded-lg border-2 border-dashed flex items-center justify-center ${
                isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-emerald-300 bg-emerald-50'
              }`}>
                <div className="text-center">
                  <svg className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-emerald-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-emerald-400'}`}>Content Placeholder</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
