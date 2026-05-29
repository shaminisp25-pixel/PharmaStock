'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Pill,
  LayoutDashboard,
  Package,
  Boxes,
  Truck,
  AlertCircle,
  FileText,
  Settings,
  Users,
  LogOut,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '@/store';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Batches', href: '/batches', icon: Boxes },
  { name: 'Dispatch', href: '/dispatch', icon: Truck },
  { name: 'Alerts', href: '/alerts', icon: AlertCircle },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Integration', href: '/integration', icon: Zap },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  return (
    <aside className="w-64 bg-card border-r border-border shrink-0">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <Pill className="w-8 h-8 text-primary flex-shrink-0" />
            <span className="font-bold text-foreground">PharmaStock</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors text-sm',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-border">
          <button
            onClick={() => {
              logout();
              localStorage.removeItem('accessToken');
              window.location.href = '/auth/login';
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
