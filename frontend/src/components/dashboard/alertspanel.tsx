interface AlertsPageProps {
  isDarkMode: boolean;
  subPage?: string;
}

export default function AlertsPage({ isDarkMode, subPage }: AlertsPageProps) {
  const getPageTitle = () => {
    switch (subPage) {
      case 'Expired':
        return 'Expired Items Alerts';
      case 'NearExpiry':
        return 'Near Expiry Warnings';
      case 'LowStock':
        return 'Low Stock Alerts';
      default:
        return 'Alerts & Notifications';
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-red-50 to-white text-gray-900'}`}>
      <div className={`border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-red-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className={`text-3xl mb-2 ${
            isDarkMode
              ? 'bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent'
          }`}>
            {getPageTitle()}
          </h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Real-time alerts for critical warehouse events
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className={`p-6 rounded-xl border mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-red-200'}`}>
          <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Active Alerts</h3>
          <div className="space-y-3">
            {[
              { text: 'Expired - Batch #B2024-089', type: 'error' },
              { text: 'Near Expiry - Paracetamol 500mg (5 days)', type: 'warning' },
              { text: 'Low Stock Alert - Amoxicillin 250mg', type: 'info' }
            ].map((alert, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${
                isDarkMode
                  ? alert.type === 'error'
                    ? 'bg-red-900/20 border-red-700'
                    : alert.type === 'warning'
                    ? 'bg-yellow-900/20 border-yellow-700'
                    : 'bg-orange-900/20 border-orange-700'
                  : alert.type === 'error'
                  ? 'bg-red-50 border-red-200'
                  : alert.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-orange-50 border-orange-200'
              }`}>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>{alert.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
