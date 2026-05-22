'use client';

import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'rectangular', className = '', ...props }, ref) => {
    const variantStyles = {
      text: 'h-4 rounded',
      circular: 'h-10 w-10 rounded-full',
      rectangular: 'h-10 rounded',
    };

    return (
      <div
        ref={ref}
        className={`bg-gradient-to-r from-muted to-muted/50 animate-shimmer ${variantStyles[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export const TableSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4 p-4 border border-border rounded-lg">
        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);
