import Breadcrumb from './Breadcrumb';

interface PageHeaderProps {
  isDarkMode: boolean;
  title: string;
  description?: string;
  breadcrumbItems: { label: string; href?: string }[];
  actions?: React.ReactNode;
}

export default function PageHeader({
  isDarkMode,
  title,
  description,
  breadcrumbItems,
  actions
}: PageHeaderProps) {
  return (
    <div className={`border-b ${
      isDarkMode
        ? 'bg-gray-800/50 border-gray-700'
        : 'bg-white border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Breadcrumb isDarkMode={isDarkMode} items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <div>
            <h1 className={`text-3xl mb-2 ${
              isDarkMode
                ? 'bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent'
            }`}>
              {title}
            </h1>
            {description && (
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
