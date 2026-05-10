import React from 'react';

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({
  children,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className="rounded-2xl bg-primary px-5 py-3 text-white transition-all hover:opacity-90"
    >
      {children}
    </button>
  );
}