'use client';

import React, { useState } from 'react';

/* ==================== MODERN BUTTON COMPONENT ==================== */
interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-600 transition-all duration-300 rounded-lg';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-glow disabled:opacity-50',
    secondary: 'bg-gradient-to-r from-accent to-primary text-white hover:shadow-glow disabled:opacity-50',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white disabled:opacity-50',
    ghost: 'text-primary hover:bg-primary hover:bg-opacity-10 disabled:opacity-50',
    danger: 'bg-danger text-white hover:shadow-glow disabled:opacity-50',
    success: 'bg-success text-white hover:shadow-glow disabled:opacity-50',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && <span className="spinner w-4 h-4" />}
      {icon}
      {children}
    </button>
  );
};

/* ==================== MODERN INPUT COMPONENT ==================== */
interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helper?: string;
}

export const ModernInput: React.FC<ModernInputProps> = ({
  label,
  error,
  icon,
  helper,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-600 text-text mb-2">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-60">{icon}</div>}
        <input
          {...props}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          className={`w-full px-4 py-3 rounded-lg bg-bg-secondary border-2 transition-all duration-300 text-text placeholder-text-tertiary focus:outline-none ${
            icon ? 'pl-12' : ''
          } ${
            focused ? 'border-primary shadow-glow' : 'border-border'
          } ${
            error ? 'border-danger' : ''
          } ${className}`}
        />
      </div>
      {error && <p className="text-sm text-danger mt-1">{error}</p>}
      {helper && !error && <p className="text-sm text-text-tertiary mt-1">{helper}</p>}
    </div>
  );
};

/* ==================== MODERN CARD COMPONENT ==================== */
interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  interactive?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  glow,
  interactive,
  header,
  footer,
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      {...props}
      className={`card ${glow ? 'card-glow' : ''} ${interactive ? 'card-interactive' : ''} ${className}`}
    >
      {header && <div className="mb-4">{header}</div>}
      {children}
      {footer && <div className="mt-4 pt-4 border-t border-border">{footer}</div>}
    </div>
  );
};

/* ==================== MODERN BADGE COMPONENT ==================== */
interface ModernBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  icon?: React.ReactNode;
}

export const ModernBadge: React.FC<ModernBadgeProps> = ({
  variant = 'primary',
  icon,
  children,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
  };

  return (
    <span {...props} className={`badge ${variants[variant]} ${className}`}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};

/* ==================== MODERN MODAL COMPONENT ==================== */
interface ModernModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const ModernModal: React.FC<ModernModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  footer,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'w-full max-w-md',
    md: 'w-full max-w-xl',
    lg: 'w-full max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative glass p-6 rounded-2xl ${sizeClasses[size]} animate-scale`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-text">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">{children}</div>
        {footer && <div className="mt-6 flex gap-3 justify-end border-t border-border pt-4">{footer}</div>}
      </div>
    </div>
  );
};

/* ==================== MODERN SELECT COMPONENT ==================== */
interface ModernSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string | number; label: string }>;
}

export const ModernSelect: React.FC<ModernSelectProps> = ({
  label,
  error,
  options,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-600 text-text mb-2">{label}</label>}
      <select
        {...props}
        className={`w-full px-4 py-3 rounded-lg bg-bg-secondary border-2 border-border transition-all duration-300 text-text focus:outline-none focus:border-primary focus:shadow-glow appearance-none cursor-pointer ${
          error ? 'border-danger' : ''
        } ${className}`}
      >
        <option value="">Select option...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-danger mt-1">{error}</p>}
    </div>
  );
};

/* ==================== MODERN ALERT COMPONENT ==================== */
interface ModernAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  closable?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
}

export const ModernAlert: React.FC<ModernAlertProps> = ({
  type = 'info',
  title,
  closable,
  onClose,
  icon,
  children,
  className = '',
  ...props
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const typeStyles = {
    success: 'bg-success/10 border-success/30 text-success',
    warning: 'bg-warning/10 border-warning/30 text-warning',
    danger: 'bg-danger/10 border-danger/30 text-danger',
    info: 'bg-primary/10 border-primary/30 text-primary',
  };

  const typeIcons = {
    success: '✓',
    warning: '⚠',
    danger: '✕',
    info: 'ℹ',
  };

  return (
    <div {...props} className={`border-l-4 rounded-lg p-4 flex gap-4 ${typeStyles[type]} ${className}`}>
      <div className="flex-shrink-0 text-xl">{icon || typeIcons[type]}</div>
      <div className="flex-1">
        {title && <h4 className="font-600 mb-1">{title}</h4>}
        <p className="text-sm opacity-90">{children}</p>
      </div>
      {closable && (
        <button
          onClick={() => setVisible(false)}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
};

/* ==================== MODERN STAT COMPONENT ==================== */
interface ModernStatProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
  loading?: boolean;
}

export const ModernStat: React.FC<ModernStatProps> = ({
  label,
  value,
  unit,
  icon,
  trend,
  trendValue,
  loading,
}) => {
  return (
    <ModernCard>
      <div className="flex items-start justify-between mb-4">
        <h4 className="text-sm font-600 text-text-secondary">{label}</h4>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      {loading ? (
        <div className="spinner w-8 h-8" />
      ) : (
        <>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-3xl font-bold text-gradient">{value}</span>
            {unit && <span className="text-sm text-text-secondary mb-1">{unit}</span>}
          </div>
          {trend && trendValue && (
            <div className={`text-sm font-600 ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </div>
          )}
        </>
      )}
    </ModernCard>
  );
};

/* ==================== MODERN TABLE COMPONENT ==================== */
interface ModernTableProps {
  headers: string[];
  rows: React.ReactNode[][];
  loading?: boolean;
  emptyState?: React.ReactNode;
}

export const ModernTable: React.FC<ModernTableProps> = ({
  headers,
  rows,
  loading,
  emptyState,
}) => {
  if (loading) {
    return (
      <div className="flex-center p-8">
        <div className="spinner w-10 h-10" />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex-center p-8 text-text-secondary">
        {emptyState || 'No data available'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-6 py-4 text-left text-sm font-700 text-text-secondary bg-bg-secondary/50"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border hover:bg-bg-secondary/50 transition-colors">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 text-sm text-text">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ==================== MODERN LOADING SKELETON ==================== */
export const ModernSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 1,
  className = '',
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-bg-secondary rounded-lg animate-pulse h-12 mb-3 ${className}`}
        />
      ))}
    </>
  );
};

/* ==================== MODERN DROPDOWN COMPONENT ==================== */
interface ModernDropdownProps {
  trigger: React.ReactNode;
  items: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'normal' | 'danger';
  }>;
}

export const ModernDropdown: React.FC<ModernDropdownProps> = ({ trigger, items }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>{trigger}</button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 glass rounded-lg shadow-xl p-2 z-50 animate-scale">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                item.variant === 'danger'
                  ? 'hover:bg-danger/20 text-danger'
                  : 'hover:bg-primary/20 text-text'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default {
  ModernButton,
  ModernInput,
  ModernCard,
  ModernBadge,
  ModernModal,
  ModernSelect,
  ModernAlert,
  ModernStat,
  ModernTable,
  ModernSkeleton,
  ModernDropdown,
};
