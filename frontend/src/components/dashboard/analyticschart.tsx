interface ReportsPageProps {
  isDarkMode: boolean;
  subPage?: string;
}

export default function ReportsPage({ isDarkMode, subPage }: ReportsPageProps) {
  const getPageTitle = () => {
    switch (subPage) {
      case 'Stock':
        return 'Stock Summary Reports';
      case 'Expiry':
        return 'Expiry Reports';
      case 'Audit':
        return 'Audit Logs';
      default:
        return 'Reports & Analytics';
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-blue-50 to-white text-gray-900'}`}>
      <div className={`border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className={`text-3xl mb-2 ${
            isDarkMode
              ? 'bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'
          }`}>
            {getPageTitle()}
          </h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Comprehensive reporting and analytics
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid gap-6">
          {['Stock Summary', 'Expiry Analysis', 'Audit Trail'].map((title, idx) => (
            <div key={idx} className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-200'}`}>
              <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
              <div className={`h-64 rounded-lg border-2 border-dashed flex items-center justify-center ${
                isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-blue-300 bg-blue-50'
              }`}>
                <div className="text-center">
                  <svg className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-blue-400'}`}>Report Placeholder</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
