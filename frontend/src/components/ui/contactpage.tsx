interface ContactPageProps {
  isDarkMode: boolean;
  subPage?: string;
}

export default function ContactPage({ isDarkMode, subPage }: ContactPageProps) {
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-purple-50 to-white text-gray-900'}`}>
      <div className={`border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className={`text-3xl mb-2 ${
            isDarkMode
              ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'
          }`}>
            Contact Us
          </h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Get in touch with our team
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { title: 'Support', desc: 'Technical assistance and help', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
            { title: 'Sales', desc: 'Pricing and enterprise plans', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
            { title: 'Feedback', desc: 'Share your thoughts', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' }
          ].map((item, idx) => (
            <div key={idx} className={`p-6 rounded-xl border text-center ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'
              }`}>
                <svg className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              </div>
              <h3 className={`text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div className={`p-8 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
          <h3 className={`text-xl mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Send us a message</h3>
          <div className={`h-64 rounded-lg border-2 border-dashed flex items-center justify-center ${
            isDarkMode ? 'border-gray-600 bg-gray-700/30' : 'border-purple-300 bg-purple-50'
          }`}>
            <div className="text-center">
              <svg className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-purple-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-purple-400'}`}>Contact Form Placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
