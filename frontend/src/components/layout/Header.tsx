'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { Search, Bell, Settings, Calendar, ChevronDown } from 'lucide-react';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery = '',
  onSearchChange,
  title = 'Welcome back',
  subtitle = 'Good to see you again',
}) => {
  const { user } = useAuth() || { user: null };
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  return (
    <header className="bg-white/60 backdrop-blur-md border-b border-white/40 h-20 flex items-center shadow-sm relative">
      <div className="w-full px-8 flex items-center justify-between gap-6">
        {/* Left side - Greeting and Page Title */}
        <div className="flex-shrink-0">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
        </div>

        {/* Center - Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
            <input
              type="text"
              placeholder="Search everything..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white/70 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:bg-white focus:ring-1 focus:ring-purple-400/50 transition-all text-sm font-medium shadow-sm hover:shadow-md"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">⌘K</span>
          </div>
        </div>

        {/* Right side - Action Buttons and User Profile */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Icon Buttons - Clean and minimal */}
          <button 
            className="p-2.5 rounded-lg hover:bg-slate-100/60 text-slate-600 hover:text-slate-900 transition-all duration-200 group relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          <button 
            className="p-2.5 rounded-lg hover:bg-slate-100/60 text-slate-600 hover:text-slate-900 transition-all duration-200"
            title="Calendar"
          >
            <Calendar className="w-5 h-5" />
          </button>

          <button 
            className="p-2.5 rounded-lg hover:bg-slate-100/60 text-slate-600 hover:text-slate-900 transition-all duration-200"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-slate-200/60" />

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100/60 transition-all duration-200 group"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-md">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              {/* User info */}
              <div className="hidden sm:flex flex-col items-start">
                <p className="text-xs font-bold text-slate-900 leading-none">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500 leading-none">{user?.email || 'user@example.com'}</p>
              </div>

              {/* Dropdown chevron */}
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-premium-lg border border-slate-200/60 py-2 z-50 animate-fade-in">
                <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium">
                  Profile Settings
                </button>
                <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium">
                  Account
                </button>
                <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium">
                  Billing
                </button>
                <div className="h-px bg-slate-200/40 my-2"></div>
                <button className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
