interface OrdersPageProps {
  isDarkMode: boolean;
  subPage?: string;
}

export default function OrdersPage({ isDarkMode, subPage }: OrdersPageProps) {
  const getPageTitle = () => {
    switch (subPage) {
      case 'Pending':
        return 'Pending Orders';
      case 'Completed':
        return 'Completed Orders';
      default:
        return 'All Orders';
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-purple-50 to-white text-gray-900'}`}>
      <div className={`border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className={`text-3xl mb-2 ${
            isDarkMode
              ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'
          }`}>
            {getPageTitle()}
          </h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Manage and track pharmaceutical orders
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className={`p-6 rounded-xl border mb-6 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'
        }`}>
          <h3 className={`text-lg mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Orders Overview
          </h3>
          <div className={`h-96 rounded-lg border-2 border-dashed flex items-center justify-center ${
            isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-purple-300 bg-purple-50'
          }`}>
            <div className="text-center">
              <svg className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-purple-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-purple-400'}`}>Orders Table Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
