'use client';

import React, { useState } from 'react';
import { ChevronDown, Loader2, AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

/* ============================================
   BUTTON COMPONENT
   ============================================ */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'outline-primary' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  icon,
  children,
  disabled,
  className,
  ...props
}) => {
  const baseStyles = 'btn font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2';

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    outline: 'btn-outline',
    'outline-primary': 'btn-outline-primary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
    success: 'btn-success',
  };

  const sizes = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
    xl: 'btn-xl',
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {children}
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

/* ============================================
   CARD COMPONENT
   ============================================ */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  elevated?: boolean;
  flat?: boolean;
  divided?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  hoverable = false, 
  elevated = false, 
  flat = false,
  divided = false,
  children, 
  className, 
  ...props 
}) => {
  const baseClass = 'card';
  const variantClass = elevated ? 'card-elevated' : flat ? 'card-flat' : '';
  const hoverClass = hoverable ? 'hover:shadow-premium-lg hover:border-border transition-all duration-200 cursor-pointer hover:-translate-y-1' : '';
  const dividedClass = divided ? 'card-divided' : '';

  return (
    <div
      {...props}
      className={`${baseClass} ${variantClass} ${hoverClass} ${dividedClass} ${className}`}
    >
      {children}
    </div>
  );
};

/* ============================================
   BADGE COMPONENT
   ============================================ */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default' | 'info';
  size?: 'sm' | 'md';
  isDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'sm',
  isDot = false,
  children,
  className,
  ...props
}) => {
  const variants = {
    primary: 'badge-primary',
    secondary: 'badge bg-primary/10 text-primary border-primary/20',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    default: 'badge-default',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs font-medium',
    md: 'px-3.5 py-1.5 text-sm font-semibold',
  };

  return (
    <span
      {...props}
      className={`inline-flex items-center gap-2 rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {isDot && <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0"></span>}
      {children}
    </span>
  );
};

/* ============================================
   INPUT COMPONENT
   ============================================ */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  icon?: React.ReactNode;
  helper?: string;
}

export const Input: React.FC<InputProps> = ({
  error,
  label,
  icon,
  helper,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-text-primary mb-2">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none flex-shrink-0">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`input ${icon ? 'pl-10' : ''} ${error ? 'error' : ''} ${className}`}
        />
      </div>
      {error && <p className="text-danger text-xs mt-1.5 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
      {helper && !error && <p className="text-text-muted text-xs mt-1.5">{helper}</p>}
    </div>
  );
};

/* ============================================
   SELECT COMPONENT
   ============================================ */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  options: Array<{ value: string | number; label: string }>;
  icon?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helper,
  options,
  icon,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-text-primary mb-2">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none flex-shrink-0">
            {icon}
          </div>
        )}
        <select
          {...props}
          className={`select ${icon ? 'pl-10' : ''} ${error ? 'error' : ''} appearance-none cursor-pointer pr-10 ${className}`}
        >
          <option value="">Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted w-4 h-4" />
      </div>
      {error && <p className="text-danger text-xs mt-1.5 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
      {helper && !error && <p className="text-text-muted text-xs mt-1.5">{helper}</p>}
    </div>
  );
};

/* ============================================
   TEXTAREA COMPONENT
   ============================================ */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  helper?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  error,
  label,
  helper,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-text-primary mb-2">
          {label}
          {props.required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <textarea
        {...props}
        className={`input resize-none min-h-24 ${error ? 'error' : ''} ${className}`}
      />
      {error && <p className="text-danger text-xs mt-1.5 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
      {helper && !error && <p className="text-text-muted text-xs mt-1.5">{helper}</p>}
    </div>
  );
};

/* ============================================
   MODAL COMPONENT
   ============================================ */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  size = 'md',
  closeButton = true,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      {/* Modal */}
      <div className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-premium-xl border border-border/40 overflow-hidden animate-scale-in`}>
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border/30 bg-gradient-to-r from-white via-primary/2 to-white">
          <h2 className="text-lg font-bold text-text-primary">{title}</h2>
          {closeButton && (
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary transition-colors p-2 hover:bg-bg-secondary rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-border/30 bg-bg-secondary flex gap-3 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================
   ALERT COMPONENT
   ============================================ */
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  dismissible,
  onDismiss,
  children,
  className,
  ...props
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const styles = {
    success: 'bg-success/5 border border-success/30 text-success-700',
    warning: 'bg-warning/5 border border-warning/30 text-warning-700',
    danger: 'bg-danger/5 border border-danger/30 text-danger-700',
    info: 'bg-info/5 border border-info/30 text-info-700',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 flex-shrink-0" />,
    danger: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
    info: <Info className="w-5 h-5 flex-shrink-0" />,
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      {...props}
      className={`rounded-lg p-4 flex items-start justify-between gap-4 ${styles[type]} animate-slide-down ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="text-current mt-0.5 flex-shrink-0">{icons[type]}</div>
        <div>
          {title && <h4 className="font-bold mb-1 text-current">{title}</h4>}
          <p className="text-sm opacity-90 text-current">{children}</p>
        </div>
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="text-current hover:opacity-70 flex-shrink-0 transition-opacity p-1 hover:bg-black/5 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

/* ============================================
   SKELETON COMPONENT
   ============================================ */
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-gradient-to-r from-bg-secondary via-bg-tertiary to-bg-secondary rounded-lg animate-shimmer ${className}`} />
);

/* ============================================
   SPINNER COMPONENT
   ============================================ */
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ 
  size = 'md',
  className = '',
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizes[size]} ${className}`}>
      <Loader2 className="w-full h-full animate-spin text-primary" />
    </div>
  );
};

/* ============================================
   PROGRESS COMPONENT
   ============================================ */
export interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'primary',
  showLabel = false,
  animated = true,
  size = 'md',
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colors = {
    primary: 'bg-gradient-primary',
    success: 'bg-gradient-success',
    warning: 'bg-gradient-warning',
    danger: 'bg-gradient-danger',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full space-y-2">
      <div className={`w-full ${heights[size]} bg-bg-secondary rounded-full overflow-hidden border border-border/40`}>
        <div
          className={`h-full transition-all duration-500 ${colors[variant]} ${animated ? 'animate-pulse-soft' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-text-muted font-medium">{Math.round(percentage)}%</p>
      )}
    </div>
  );
};
