interface CompliancePageProps {
  isDarkMode: boolean;
  subPage?: string;
}

export default function CompliancePage({ isDarkMode, subPage }: CompliancePageProps) {
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className={`text-3xl mb-2 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>Compliance Management</h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Regulatory compliance and documentation
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-6">
          {['GMP Standards', 'CDSCO Requirements', 'Documentation'].map((title, idx) => (
            <div key={idx} className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>{title}</h3>
              <div className={`h-48 rounded-lg border-2 border-dashed flex items-center justify-center ${
                isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-100'
              }`}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Content Placeholder</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
