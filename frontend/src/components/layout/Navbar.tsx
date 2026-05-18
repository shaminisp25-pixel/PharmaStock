'use client';

import React, { useState } from 'react';
import { Search, Bell, Settings, LogOut, ChevronDown, Calendar, Zap, HelpCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/70 glass border-b border-border/30 backdrop-blur-md">
      <div className="h-16 px-8 flex items-center justify-between gap-6">
        
        {/* === LEFT: GREETING & TITLE === */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Welcome back,</p>
          <h1 className="text-sm font-bold text-text-primary truncate">{user?.name || 'User'}</h1>
        </div>

        {/* === CENTER: SEARCH BAR === */}
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-10 pr-10 py-2 bg-bg-secondary border border-border/50 rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
            />
            {/* Keyboard shortcut indicator */}
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-bg-tertiary border border-border rounded text-xs text-text-muted font-mono group-hover:bg-border transition-colors">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* === RIGHT: ACTIONS & PROFILE === */}
        <div className="flex items-center gap-2">
          
          {/* Calendar Icon */}
          <button 
            className="p-2.5 hover:bg-bg-secondary rounded-lg transition-colors duration-200 text-text-secondary hover:text-text-primary"
            title="Calendar"
          >
            <Calendar className="w-4 h-4" />
          </button>

          {/* Notifications Icon */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 hover:bg-bg-secondary rounded-lg transition-colors duration-200 text-text-secondary hover:text-text-primary relative group"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full animate-pulse"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-border/50 rounded-lg shadow-premium-lg overflow-hidden animate-slide-down z-50">
                <div className="p-4 border-b border-border/30">
                  <h3 className="font-bold text-text-primary text-sm">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 hover:bg-bg-secondary transition-colors cursor-pointer border-b border-border/30">
                    <p className="text-sm font-medium text-text-primary mb-1">New expiry alert</p>
                    <p className="text-xs text-text-muted">3 medicines expiring soon</p>
                    <p className="text-xs text-text-muted mt-1">2 minutes ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings Icon */}
          <button 
            className="p-2.5 hover:bg-bg-secondary rounded-lg transition-colors duration-200 text-text-secondary hover:text-text-primary"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-border/30 mx-2"></div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-bg-secondary rounded-lg transition-colors duration-200 group"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-all duration-200">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              {/* User Info - Hidden on small screens */}
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-text-primary">{user?.name || 'User'}</p>
                <p className="text-xs text-text-muted">{user?.role?.toLowerCase() || 'User'}</p>
              </div>
              
              {/* Chevron */}
              <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-border/50 rounded-lg shadow-premium-lg overflow-hidden animate-slide-down z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-border/30 bg-bg-secondary">
                  <p className="text-sm font-bold text-text-primary">{user?.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">{user?.email}</p>
                  <p className="text-xs text-primary font-semibold mt-1 capitalize">{user?.role?.toLowerCase()}</p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors text-left">
                    <Settings className="w-4 h-4" />
                    Account Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors text-left">
                    <HelpCircle className="w-4 h-4" />
                    Help & Support
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:text-primary font-semibold hover:bg-primary/5 transition-colors text-left">
                    <Zap className="w-4 h-4" />
                    Go Pro
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-border/30 p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:text-danger hover:bg-danger/5 transition-colors rounded-md text-left font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
