'use client';

import React, { useState } from 'react';
import { useUIStore, useAuthStore } from '@/store';
import { useChangePassword, useLogout } from '@/services/hooks';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Moon, Sun, Monitor, Lock, LogOut, Copy, Check, User, Bell, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface NotificationSettings {
  expiryAlerts: boolean;
  lowStockAlerts: boolean;
  temperatureAlerts: boolean;
  dispatchNotifications: boolean;
  auditAlerts: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useUIStore();
  const { user, logout } = useAuthStore();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [notifications, setNotifications] = useState<NotificationSettings>({
    expiryAlerts: true,
    lowStockAlerts: true,
    temperatureAlerts: true,
    dispatchNotifications: true,
    auditAlerts: true,
  });
  const [copiedKey, setCopiedKey] = useState(false);
  const changePasswordMutation = useChangePassword();
  const logoutMutation = useLogout();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      logout();
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (error) {
      logout();
      router.push('/auth/login');
    }
  };

  const handleCopyApiKey = () => {
    const apiKey = 'sk_live_' + Math.random().toString(36).substring(2, 15);
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    toast.success('API key copied to clipboard');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success('Notification preference updated');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure application preferences and account settings</p>
      </div>

      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription>View your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-foreground mt-1">{user?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-foreground mt-1">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Role</label>
              <Badge className="mt-1">{user?.role?.replace('_', ' ') || 'N/A'}</Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Badge className="mt-1" variant={user?.isActive ? 'success' : 'default'}>
                {user?.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the application looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm font-medium text-foreground mb-3">Theme</p>
            <div className="flex gap-3 flex-wrap">
              {['light', 'dark', 'system'].map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => setTheme(themeOption as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    theme === themeOption
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-input'
                  }`}
                >
                  {themeOption === 'light' && <Sun className="w-4 h-4" />}
                  {themeOption === 'dark' && <Moon className="w-4 h-4" />}
                  {themeOption === 'system' && <Monitor className="w-4 h-4" />}
                  {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Manage how you receive alerts and updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'expiryAlerts', label: 'Expiry Alerts', description: 'Get notified about expiring batches' },
            { key: 'lowStockAlerts', label: 'Low Stock Alerts', description: 'Get notified about low inventory levels' },
            { key: 'temperatureAlerts', label: 'Temperature Alerts', description: 'Get notified about warehouse temperature issues' },
            { key: 'dispatchNotifications', label: 'Dispatch Notifications', description: 'Get notified when batches are dispatched' },
            { key: 'auditAlerts', label: 'Audit Alerts', description: 'Get notified about system activity changes' },
          ].map((notif) => (
            <div
              key={notif.key}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div>
                <p className="font-medium text-foreground">{notif.label}</p>
                <p className="text-sm text-muted-foreground">{notif.description}</p>
              </div>
              <button
                onClick={() => handleNotificationToggle(notif.key as keyof NotificationSettings)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  notifications[notif.key as keyof NotificationSettings]
                    ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                {notifications[notif.key as keyof NotificationSettings] ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security
          </CardTitle>
          <CardDescription>Manage your account security and access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showPasswordForm ? (
            <Button
              variant="outline"
              onClick={() => setShowPasswordForm(true)}
              icon={<Lock className="w-4 h-4" />}
              className="w-full"
            >
              Change Password
            </Button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Password</label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  placeholder="Enter current password"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">New Password</label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  placeholder="Enter new password"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Confirm Password</label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm new password"
                  className="mt-1"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="flex-1"
                >
                  Update Password
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-border">
            <p className="text-sm font-medium text-foreground mb-3">API Key</p>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <code className="text-xs font-mono text-muted-foreground flex-1 truncate">
                sk_live_{Math.random().toString(36).substring(2, 15)}
              </code>
              <button
                onClick={handleCopyApiKey}
                className="p-1 hover:bg-input rounded transition-colors"
              >
                {copiedKey ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session */}
      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
          <CardDescription>Manage your active session</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            icon={<LogOut className="w-4 h-4" />}
            className="w-full"
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
