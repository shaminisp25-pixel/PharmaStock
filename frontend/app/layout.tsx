import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { RootLayoutClient } from './layout-client';

export const metadata: Metadata = {
  title: 'PharmaStock - Pharmaceutical Warehouse Management',
  description: 'Professional pharmaceutical warehouse inventory management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
