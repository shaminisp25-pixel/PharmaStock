'use client';

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-card text-card-foreground rounded-lg border border-border shadow-sm p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = 'Card';

export const CardHeader = ({ children, className = '' }: CardProps) => (
  <div className={`mb-6 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }: CardProps) => (
  <h3 className={`text-lg font-semibold text-foreground ${className}`}>{children}</h3>
);

export const CardDescription = ({ children, className = '' }: CardProps) => (
  <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
);

export const CardContent = ({ children, className = '' }: CardProps) => (
  <div className={`${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }: CardProps) => (
  <div className={`flex justify-end gap-2 mt-6 pt-6 border-t border-border ${className}`}>
    {children}
  </div>
);
