interface InventoryPageProps {
  isDarkMode: boolean;
  subPage?: string;
}

export default function InventoryPage({ isDarkMode, subPage }: InventoryPageProps) {
  const getPageTitle = () => {
    switch (subPage) {
      case 'Batch':
        return 'Batch Tracking';
      case 'Barcode':
        return 'Barcode Scanner';
      case 'Expiry':
        return 'Expiry Monitoring';
      default:
        return 'Inventory Stock List';
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
            Real-time visibility into all pharmaceutical products and batches
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className={`p-6 rounded-xl border mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
          <h3 className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Inventory Table</h3>
          <div className={`h-96 rounded-lg border-2 border-dashed flex items-center justify-center ${
            isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-purple-300 bg-purple-50'
          }`}>
            <div className="text-center">
              <svg className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-purple-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-purple-400'}`}>Data Table Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
