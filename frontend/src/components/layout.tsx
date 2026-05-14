import React from 'react';

export interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}

export const AppLayout: React.FC<LayoutProps> = ({ children, sidebar, header }) => {
  return (
    <div className="flex h-screen bg-off-white">
      {/* Sidebar */}
      {sidebar && (
        <aside className="w-64 bg-card-bg border-r border-border shadow-sm overflow-y-auto">
          {sidebar}
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {header && (
          <header className="bg-card-bg border-b border-border shadow-sm">
            {header}
          </header>
        )}

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto">
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
      <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
      {subtitle && <p className="text-text-secondary mt-2">{subtitle}</p>}
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
      <div className="mb-4">
        {title && <h2 className="text-xl font-bold text-text-primary">{title}</h2>}
        {subtitle && <p className="text-text-secondary text-sm mt-1">{subtitle}</p>}
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

  return (
    <div className={`grid grid-cols-${cols} ${gapSizes[gap]}`}>
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
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all">
      {icon && <span className="text-lg">{icon}</span>}
      <span className="font-medium">{label}</span>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`block ${
          active
            ? 'bg-primary-light text-primary'
            : 'text-text-secondary hover:bg-off-white'
        }`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left ${
        active
          ? 'bg-primary-light text-primary'
          : 'text-text-secondary hover:bg-off-white'
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
}> = ({ label, value, unit, trend, trendValue, icon }) => (
  <div className="p-6 bg-card-bg rounded-xl border border-border">
    <div className="flex items-start justify-between mb-4">
      <h3 className="text-text-secondary text-sm font-medium">{label}</h3>
      {icon && <span className="text-2xl">{icon}</span>}
    </div>
    <div className="flex items-end gap-2">
      <span className="text-3xl font-bold text-text-primary">{value}</span>
      {unit && <span className="text-text-secondary text-sm">{unit}</span>}
    </div>
    {trend && trendValue && (
      <div className={`mt-3 text-sm font-medium ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
        {trend === 'up' ? '↑' : '↓'} {trendValue}
      </div>
    )}
  </div>
);

export const Table: React.FC<{
  headers: string[];
  rows: React.ReactNode[][];
  actions?: (rowIndex: number) => React.ReactNode;
}> = ({ headers, rows, actions }) => (
  <div className="overflow-x-auto bg-card-bg rounded-xl border border-border">
    <table className="w-full">
      <thead>
        <tr className="border-b border-border">
          {headers.map((header, i) => (
            <th
              key={i}
              className="px-6 py-4 text-left text-sm font-semibold text-text-primary"
            >
              {header}
            </th>
          ))}
          {actions && <th className="px-6 py-4 text-sm font-semibold text-text-primary">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-b border-border hover:bg-off-white transition-colors">
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="px-6 py-4 text-sm text-text-primary">
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
    {label && <label className="block text-sm font-medium text-text-primary mb-2">{label}</label>}
    {children}
    {help && <p className="text-xs text-text-secondary mt-1">{help}</p>}
  </div>
);

export const Tabs: React.FC<{
  tabs: Array<{ label: string; content: React.ReactNode }>;
}> = ({ tabs }) => {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div>
      <div className="flex gap-1 border-b border-border mb-6">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-3 font-medium text-sm transition-all border-b-2 ${
              activeTab === i
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
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
