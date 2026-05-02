interface DashboardPageProps {
  isDarkMode: boolean;
  subPage?: string;
}

export default function DashboardPage({ isDarkMode, subPage }: DashboardPageProps) {
  const getPageTitle = () => {
    switch (subPage) {
      case 'Analytics':
        return 'Analytics Dashboard';
      case 'Alerts':
        return 'Dashboard Alerts';
      default:
        return 'Dashboard Overview';
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Page Header */}
      <div className={`border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className={`text-3xl mb-2 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>{getPageTitle()}</h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Comprehensive insights into your pharmaceutical warehouse operations
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Metric Cards */}
          {[
            { label: 'Total Revenue', value: '$1.2M', change: '+12.5%' },
            { label: 'Active Orders', value: '342', change: '+8.2%' },
            { label: 'Avg. Processing Time', value: '2.4 hrs', change: '-5.3%' }
          ].map((metric, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border shadow-sm ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {metric.label}
              </div>
              <div className={`text-2xl mb-2 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>
                {metric.value}
              </div>
              <div className={metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                {metric.change}
              </div>
            </div>
          ))}
        </div>

        {/* Chart Placeholders */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>
              Inventory Trends
            </h3>
            <div className={`h-64 rounded-lg border-2 border-dashed flex items-center justify-center ${
              isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-100'
            }`}>
              <div className="text-center">
                <svg className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Chart Placeholder</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>
              Order Distribution
            </h3>
            <div className={`h-64 rounded-lg border-2 border-dashed flex items-center justify-center ${
              isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-100'
            }`}>
              <div className="text-center">
                <svg className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Chart Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
