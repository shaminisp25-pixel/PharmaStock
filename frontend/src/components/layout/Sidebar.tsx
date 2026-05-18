'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  AlertCircle,
  Users,
  Users2,
  Pill,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Zap,
  Home,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, href, isActive }) => (
  <Link href={href}>
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden
        ${isActive
          ? 'bg-gradient-to-r from-primary via-primary to-accent text-white shadow-lg'
          : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
        }
      `}
    >
      {/* Glow effect for active */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
      )}
      
      {/* Icon */}
      <span className="flex-shrink-0 relative z-10 w-5 h-5">{icon}</span>
      
      {/* Label */}
      <span className="text-sm font-semibold relative z-10 flex-1">{label}</span>
      
      {/* Active indicator */}
      {isActive && (
        <ChevronRight className="ml-auto w-4 h-4 relative z-10" />
      )}
    </div>
  </Link>
);

interface SidebarSectionProps {
  title: string;
  items: Array<{
    icon: React.ReactNode;
    label: string;
    href: string;
  }>;
  pathname: string;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, items, pathname }) => (
  <div className="space-y-2">
    {/* Section Label */}
    <h3 className="px-4 text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
      <span>{title}</span>
      <div className="h-px flex-1 bg-border"></div>
    </h3>
    
    {/* Items */}
    <div className="space-y-1">
      {items.map((item) => (
        <SidebarItem
          key={item.href}
          icon={item.icon}
          label={item.label}
          href={item.href}
          isActive={pathname === item.href}
        />
      ))}
    </div>
  </div>
);

export const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navigationItems = [
    {
      section: 'Main',
      items: [
        { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', href: '/dashboard' },
      ],
    },
    {
      section: 'Operations',
      items: [
        { icon: <ShoppingCart className="w-5 h-5" />, label: 'Purchase', href: '/batches' },
        { icon: <Package className="w-5 h-5" />, label: 'Sales', href: '/drugs' },
        { icon: <Pill className="w-5 h-5" />, label: 'Products', href: '/drugs' },
      ],
    },
    {
      section: 'Management',
      items: [
        { icon: <Users2 className="w-5 h-5" />, label: 'Suppliers', href: '/users' },
        { icon: <Users className="w-5 h-5" />, label: 'Customers', href: '/users' },
        { icon: <AlertCircle className="w-5 h-5" />, label: 'Alerts', href: '/alerts' },
      ],
    },
    {
      section: 'Reports & Admin',
      items: [
        { icon: <FileText className="w-5 h-5" />, label: 'Reports', href: '/reports' },
        { icon: <FileText className="w-5 h-5" />, label: 'Import', href: '/import' },
        { icon: <Users className="w-5 h-5" />, label: 'Users', href: '/users' },
        { icon: <Pill className="w-5 h-5" />, label: 'Audits', href: '/audit' },
      ],
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white/60 glass border-r border-border/40 flex flex-col overflow-hidden shadow-premium">
      {/* === SIDEBAR HEADER === */}
      <div className="relative px-6 py-6 border-b border-border/30 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Logo Badge */}
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg transform hover:scale-110 transition-transform duration-300">
            P
          </div>
          
          {/* Logo Text */}
          <div className="flex-1">
            <h1 className="text-base font-bold text-text-primary">PharmaStock</h1>
            <p className="text-xs text-text-muted font-medium">Management System</p>
          </div>
        </div>
      </div>

      {/* === NAVIGATION SECTIONS === */}
      <div className="relative flex-1 overflow-y-auto px-3 py-6 space-y-6">
        {navigationItems.map((section) => (
          <SidebarSection
            key={section.section}
            title={section.section}
            items={section.items}
            pathname={pathname}
          />
        ))}

        {/* === PREMIUM UPGRADE CARD === */}
        <div className="mt-auto pt-6 border-t border-border/30">
          <div className="p-5 rounded-lg bg-gradient-to-br from-primary via-accent to-primary overflow-hidden relative group cursor-pointer hover:shadow-lg transition-all duration-300">
            {/* Animated overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>

            {/* Glass border */}
            <div className="absolute inset-0 rounded-lg border border-white/20 group-hover:border-white/40 transition-all duration-300"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-3 p-2.5 bg-white/20 backdrop-blur-md rounded-lg group-hover:bg-white/30 transition-all duration-300">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1">Upgrade Pro</h3>
              <p className="text-white/80 text-xs leading-snug mb-4">
                Advanced analytics & detailed reports
              </p>
              <button className="w-full px-4 py-2 bg-white/95 hover:bg-white text-primary font-semibold text-xs rounded-md transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === SIDEBAR FOOTER === */}
      <div className="relative px-3 py-4 border-t border-border/30 flex-shrink-0 space-y-2">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-all duration-200 group font-medium text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

