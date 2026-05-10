'use client';

import AuthForm from './AuthForm';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass-card relative w-full max-w-md rounded-3xl p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl opacity-70 hover:opacity-100"
        >
          ×
        </button>

        <h2 className="mb-6 text-3xl font-bold">
          Login to PharmaStock
        </h2>

        <AuthForm />
      </div>
    </div>
  );
}