interface ImportExportPageProps {
  isDarkMode: boolean;
  subPage?: string;
}

export default function ImportExportPage({ isDarkMode, subPage }: ImportExportPageProps) {
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className={`text-3xl mb-2 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>Import / Export</h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Manage data exchange with external systems
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`p-8 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-xl mb-4 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>Upload Data</h3>
            <div className={`h-48 rounded-lg border-2 border-dashed flex items-center justify-center ${
              isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-100'
            }`}>
              <div className="text-center">
                <svg className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Upload Component Placeholder</p>
              </div>
            </div>
          </div>

          <div className={`p-8 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-xl mb-4 ${isDarkMode ? 'text-white' : 'text-[#1e3a5f]'}`}>Export Reports</h3>
            <div className={`h-48 rounded-lg border-2 border-dashed flex items-center justify-center ${
              isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-100'
            }`}>
              <div className="text-center">
                <svg className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Export Component Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
