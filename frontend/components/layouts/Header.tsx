'use client';

import React from 'react';
import { useAuthStore } from '@/store';
import { Bell, Settings, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const { user } = useAuthStore();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      <div className="flex-1" />
      
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role.replace('_', ' ')}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
