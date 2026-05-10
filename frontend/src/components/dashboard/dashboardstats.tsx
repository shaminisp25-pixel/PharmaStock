interface DashboardPageProps {
  isDarkMode: boolean;
  subPage?: string;
  userRole?: string;
}

export default function DashboardPage({ isDarkMode, subPage, userRole }: DashboardPageProps) {
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

  const getDescription = () => {
    switch (subPage) {
      case 'Analytics':
        return 'Comprehensive analytics and business insights';
      case 'Alerts':
        return 'Real-time system alerts and notifications';
      default:
        return 'Comprehensive insights into your pharmaceutical warehouse operations';
    }
  };

  const getBreadcrumbItems = () => {
    const items = [{ label: 'Home', href: '#' }, { label: 'Dashboard' }];
    if (subPage) {
      items.push({ label: subPage });
    }
    return items;
  };

  return (
    <div className={`min-h-screen ${
      isDarkMode
        ? 'bg-gradient-to-b from-gray-900 to-gray-800'
        : 'bg-gradient-to-b from-violet-50/30 to-white'
    }`}>
      <PageHeader
        isDarkMode={isDarkMode}
        title={getPageTitle()}
        description={getDescription()}
        breadcrumbItems={getBreadcrumbItems()}
        actions={
          <>
            <button className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}>
              Export
            </button>
            <button className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              isDarkMode
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500'
            }`}>
              Refresh Data
            </button>
          </>
        }
      />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Revenue', value: '$1.2M', change: '+12.5%', positive: true },
            { label: 'Active Orders', value: '342', change: '+8.2%', positive: true },
            { label: 'Low Stock Items', value: '28', change: '-15.3%', positive: true },
            { label: 'Expiring Soon', value: '45', change: '+3.1%', positive: false }
          ].map((metric, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border transition-all hover:shadow-lg ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-violet-200'
              }`}
            >
              <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {metric.label}
              </div>
              <div className={`text-2xl mb-2 ${
                isDarkMode
                  ? 'text-white'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'
              }`}>
                {metric.value}
              </div>
              <div className={metric.positive ? 'text-emerald-500' : 'text-rose-500'}>
                <span className="text-sm">{metric.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className={`p-6 rounded-xl border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-violet-200'
          }`}>
            <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Inventory Trends
            </h3>
            <div className={`h-64 rounded-lg border-2 border-dashed flex items-center justify-center ${
              isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-violet-300 bg-violet-50'
            }`}>
              <div className="text-center">
                <svg className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-violet-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-violet-400'}`}>Chart Placeholder</p>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-violet-200'
          }`}>
            <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Order Distribution
            </h3>
            <div className={`h-64 rounded-lg border-2 border-dashed flex items-center justify-center ${
              isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-violet-300 bg-violet-50'
            }`}>
              <div className="text-center">
                <svg className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-violet-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-violet-400'}`}>Chart Placeholder</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions / Recent Activity */}
        <div className={`p-6 rounded-xl border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-violet-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Activity
            </h3>
            <button className={`text-sm ${
              isDarkMode ? 'text-violet-400 hover:text-violet-300' : 'text-indigo-600 hover:text-indigo-700'
            }`}>
              View All
            </button>
          </div>
          <div className="space-y-3">
            {[
              { action: 'Batch #B2024-156 received', time: '5 minutes ago', type: 'success' },
              { action: 'Low stock alert: Paracetamol 500mg', time: '1 hour ago', type: 'warning' },
              { action: 'Compliance report generated', time: '3 hours ago', type: 'info' }
            ].map((item, idx) => (
              <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    item.type === 'success' ? 'bg-emerald-500' :
                    item.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                  }`}></div>
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>{item.action}</span>
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
