interface BreadcrumbProps {
  isDarkMode: boolean;
  items: { label: string; href?: string }[];
}

export default function Breadcrumb({ isDarkMode, items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <svg className={`w-4 h-4 mx-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {index === items.length - 1 ? (
            <span className={isDarkMode ? 'text-violet-400' : 'text-indigo-600'}>
              {item.label}
            </span>
          ) : (
            <a
              href={item.href || '#'}
              className={`transition-colors ${
                isDarkMode
                  ? 'text-gray-400 hover:text-violet-400'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              {item.label}
            </a>
          )}
        </div>
      ))}
    </nav>
  );
}
