interface AlertsPageProps {
  isDarkMode: boolean;
  subPage?: string;
}

export default function AlertsPage({ isDarkMode, subPage }: AlertsPageProps) {
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className={`text-3xl mb-2 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>Alerts & Notifications</h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Real-time alerts for critical warehouse events
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className={`p-6 rounded-xl border mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>Active Alerts</h3>
          <div className="space-y-3">
            {['Low Stock Alert - Paracetamol 500mg', 'Expiring Soon - Batch #B2024-123', 'Compliance Check Required'].map((alert, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${
                isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-amber-50 border-amber-200'
              }`}>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>{alert}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
