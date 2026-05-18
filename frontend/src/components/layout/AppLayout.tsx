'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* === ANIMATED BACKGROUND ELEMENTS === */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Soft purple glow - top right */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200/15 rounded-full blur-3xl opacity-60 animate-float-slow"></div>
        
        {/* Soft lavender glow - bottom left */}
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/15 rounded-full blur-3xl opacity-50 animate-float"></div>
        
        {/* Subtle pink accent - center */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-pink-200/10 rounded-full blur-3xl opacity-40 animate-pulse-soft"></div>

        {/* Blue glow - top left */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl opacity-30"></div>
      </div>

      {/* === MAIN CONTAINER === */}
      <div className="relative flex h-screen overflow-hidden">
        
        {/* === SIDEBAR === */}
        <Sidebar />

        {/* === MAIN CONTENT AREA === */}
        <div className="ml-64 flex flex-col flex-1 overflow-hidden">
          
          {/* === NAVBAR === */}
          <Navbar />

          {/* === PAGE CONTENT === */}
          <main className="flex-1 overflow-y-auto relative">
            {/* Content wrapper with premium floating design */}
            <div className="relative p-8 h-full bg-gradient-to-b from-transparent via-white/5 to-transparent">
              
              {/* Floating content container - Premium SaaS shell */}
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto rounded-3xl bg-white/85 glass shadow-premium-xl border border-white/60 relative group">
                  
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 bg-gradient-to-b from-white via-transparent to-transparent pointer-events-none transition-opacity duration-500"></div>
                  
                  {/* Inner content with proper padding */}
                  <div className="relative p-8 max-w-7xl mx-auto w-full h-full overflow-y-auto">
                    <div className="space-y-6">
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

