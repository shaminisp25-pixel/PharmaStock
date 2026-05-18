import React from 'react';

export interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}

export const AppLayout: React.FC<LayoutProps> = ({ children, sidebar, header }) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Sidebar */}
      {sidebar && (
        <aside className="w-64 bg-slate-900 text-white border-r border-slate-800 shadow-xl overflow-y-auto">
          {sidebar}
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {header && (
          <header className="bg-white border-b border-slate-200 shadow-sm">
            {header}
          </header>
        )}

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-50">
          <div className="container-main py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export const PageHeader: React.FC<{
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}> = ({ title, subtitle, actions }) => (
  <div className="flex items-start justify-between gap-4 mb-8">
    <div>
      <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
      {subtitle && <p className="text-slate-600 mt-2 text-sm">{subtitle}</p>}
    </div>
    {actions && <div className="flex gap-3">{actions}</div>}
  </div>
);

export const Section: React.FC<{
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, children, className }) => (
  <div className={`mb-8 ${className}`}>
    {(title || subtitle) && (
      <div className="mb-6">
        {title && <h2 className="text-2xl font-bold text-slate-900">{title}</h2>}
        {subtitle && <p className="text-slate-600 text-sm mt-2">{subtitle}</p>}
      </div>
    )}
    {children}
  </div>
);

export const Grid: React.FC<{
  children: React.ReactNode;
  cols?: number;
  gap?: 'sm' | 'md' | 'lg';
}> = ({ children, cols = 3, gap = 'md' }) => {
  const gapSizes = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  const colClass = colClasses[cols as keyof typeof colClasses] || colClasses[3];

  return (
    <div className={`grid ${colClass} ${gapSizes[gap]}`}>
      {children}
    </div>
  );
};

export const Sidebar: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <nav className="p-6 space-y-2">
    {children}
  </nav>
);

export const SidebarItem: React.FC<{
  href?: string;
  active?: boolean;
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
}> = ({ href, active, icon, label, onClick }) => {
  const content = (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200">
      {icon && <span className="text-lg">{icon}</span>}
      <span className="font-medium text-sm">{label}</span>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`block transition-all duration-200 rounded-lg ${
          active
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left transition-all duration-200 rounded-lg ${
        active
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {content}
    </button>
  );
};

export const Stat: React.FC<{
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  icon?: React.ReactNode;
  bgColor?: 'green' | 'cyan' | 'pink' | 'blue';
}> = ({ label, value, unit, trend, trendValue, icon, bgColor = 'green' }) => {
  const bgColors = {
    green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
    cyan: 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200',
    pink: 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200',
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
  };

  return (
    <div className={`p-6 ${bgColors[bgColor]} rounded-lg border shadow-sm hover:shadow-md transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-slate-600 text-sm font-medium">{label}</h3>
        {icon && <span className="text-2xl opacity-80">{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        {unit && <span className="text-slate-600 text-sm">{unit}</span>}
      </div>
      {trend && trendValue && (
        <div className={`mt-3 text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? '↑' : '↓'} {trendValue} <span className="text-slate-600">This Month</span>
        </div>
      )}
    </div>
  );
};

export const Table: React.FC<{
  headers: string[];
  rows: React.ReactNode[][];
  actions?: (rowIndex: number) => React.ReactNode;
}> = ({ headers, rows, actions }) => (
  <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
    <table className="w-full">
      <thead>
        <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          {headers.map((header, i) => (
            <th
              key={i}
              className="px-6 py-4 text-left text-sm font-semibold text-slate-900"
            >
              {header}
            </th>
          ))}
          {actions && <th className="px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="px-6 py-4 text-sm text-slate-700">
                {cell}
              </td>
            ))}
            {actions && (
              <td className="px-6 py-4 text-sm">
                {actions(rowIndex)}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const Form: React.FC<{
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
}> = ({ children, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    {children}
  </form>
);

export const FormGroup: React.FC<{
  label?: string;
  children: React.ReactNode;
  help?: string;
}> = ({ label, children, help }) => (
  <div>
    {label && <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>}
    {children}
    {help && <p className="text-xs text-slate-600 mt-1">{help}</p>}
  </div>
);

export const Tabs: React.FC<{
  tabs: Array<{ label: string; content: React.ReactNode }>;
}> = ({ tabs }) => {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div>
      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-3 font-medium text-sm transition-all border-b-2 ${
              activeTab === i
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs[activeTab]?.content}
    </div>
  );
};
