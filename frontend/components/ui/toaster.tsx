'use client';

import React from 'react';
import { useToast } from './use-toast';
import { X } from 'lucide-react';

interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  onDismiss: () => void;
}

function Toast({ id, title, description, variant = 'default', onDismiss }: ToastProps) {
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg animate-in fade-in slide-in-from-right-full ${
        variant === 'destructive'
          ? 'bg-destructive/10 border-destructive text-destructive'
          : 'bg-card border-border'
      }`}
    >
      <div className="flex-1">
        {title && <div className="font-medium">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-0 right-0 flex flex-col gap-2 p-4 z-50 max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={() => {}} />
      ))}
    </div>
  );
}
