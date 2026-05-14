// Button Component
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus-visible:outline-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark focus-visible:outline-secondary',
    accent: 'bg-accent text-white hover:bg-accent-dark focus-visible:outline-accent',
    outline: 'border-2 border-primary text-primary hover:bg-primary-light',
    ghost: 'text-primary hover:bg-primary-light',
    danger: 'bg-danger text-white hover:bg-red-600',
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {isLoading && <span className="inline-block animate-spin">⟳</span>}
      {children}
    </button>
  );
};

// Card Component
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ hoverable = false, children, className, ...props }) => {
  return (
    <div
      {...props}
      className={`bg-card-bg rounded-xl border border-border shadow-sm ${
        hoverable ? 'hover:shadow-md transition-shadow' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Badge Component
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'sm',
  children,
  className,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary-light text-primary',
    secondary: 'bg-secondary-light text-secondary-dark',
    success: 'bg-success-light text-success',
    warning: 'bg-warning-light text-warning',
    danger: 'bg-danger-light text-danger',
    default: 'bg-border text-text-secondary',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      {...props}
      className={`inline-flex items-center font-semibold rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

// Input Component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  error,
  label,
  icon,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-text-primary mb-2">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">{icon}</div>}
        <input
          {...props}
          className={`w-full px-4 py-2 rounded-lg border border-border bg-white text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary-light transition-all ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-danger' : ''} ${className}`}
        />
      </div>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
};

// Select Component
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string | number; label: string }>;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-text-primary mb-2">{label}</label>}
      <select
        {...props}
        className={`w-full px-4 py-2 rounded-lg border border-border bg-white text-text-primary focus:border-primary focus:ring-1 focus:ring-primary-light transition-all appearance-none cursor-pointer ${
          error ? 'border-danger' : ''
        } ${className}`}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
};

// Modal Component
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <Card className="relative w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card-bg">
          <h2 className="text-lg font-bold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="p-6 border-t border-border flex gap-3 justify-end">{footer}</div>}
      </Card>
    </div>
  );
};

// Alert Component
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
  const styles = {
    success: 'bg-success-light border-success text-success',
    warning: 'bg-warning-light border-warning text-warning',
    danger: 'bg-danger-light border-danger text-danger',
    info: 'bg-primary-light border-primary text-primary',
  };

  return (
    <div
      {...props}
      className={`border-l-4 rounded-lg p-4 flex items-start justify-between gap-4 ${styles[type]} ${className}`}
    >
      <div>
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <p className="text-sm">{children}</p>
      </div>
      {dismissible && (
        <button onClick={onDismiss} className="text-lg leading-none hover:opacity-70">
          ✕
        </button>
      )}
    </div>
  );
};

// Skeleton Component
export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={`bg-gray-200 rounded-md animate-pulse ${className}`}
  />
);

// Spinner Component
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizes[size]} border-4 border-primary-light border-t-primary rounded-full animate-spin`} />
  );
};
