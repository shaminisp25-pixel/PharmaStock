'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store';
import { Bell, Settings, User as UserIcon } from 'lucide-react';
import { useAlerts } from '@/services/entityHooks';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Header() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { data: alerts } = useAlerts({ limit: 5, page: 1 });
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadAlerts = alerts?.data?.filter((alert) => !alert.resolved) || [];

  return (
    <header className="relative flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      <div className="flex-1" />
      
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          onClick={() => setShowNotifications((open) => !open)}
          className="relative p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Open notifications"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadAlerts.length > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          )}
        </button>

        {showNotifications && (
          <Card className="absolute right-6 top-16 z-50 w-[360px] shadow-2xl border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                Notifications
                <Badge variant="warning">{unreadAlerts.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-80 overflow-auto">
              {alerts?.data?.length ? (
                alerts.data.map((alert) => (
                  <button
                    key={alert.id}
                    onClick={() => {
                      setShowNotifications(false);
                      router.push('/alerts');
                    }}
                    className="w-full text-left rounded-lg border border-border bg-background px-3 py-2 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-foreground line-clamp-2">
                        {alert.message || alert.alertType.replace('_', ' ')}
                      </p>
                      <Badge variant={alert.resolved ? 'success' : 'warning'}>
                        {alert.resolved ? 'Read' : 'New'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {alert.batch?.drug?.name || 'Batch alert'}
                    </p>
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No notifications yet.</p>
              )}
              <button
                onClick={() => {
                  setShowNotifications(false);
                  router.push('/alerts');
                }}
                className="w-full rounded-lg border border-border bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                View all alerts
              </button>
            </CardContent>
          </Card>
        )}

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
