'use client';

import React, { useEffect, useState } from 'react';
import { Card, Button, Badge, Select } from '@/components/ui';
import { AppLayout, PageHeader, Section, Sidebar, SidebarItem } from '@/components/layout';
import { useRequireAuth } from '@/lib/auth-context';
import { AlertService, Alert } from '@/lib/api-services';

export default function AlertsPage() {
  const user = useRequireAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ critical: 0, error: 0, warning: 0, info: 0 });
  const [filters, setFilters] = useState({
    type: 'all',
    warehouse: 'all',
    status: 'unresolved',
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setIsLoading(true);
        const [alertsData, statsData] = await Promise.all([
          AlertService.getAll(page, 10, {
            ...(filters.type !== 'all' && { type: filters.type }),
            ...(filters.status !== 'unresolved' && { resolved: filters.status === 'resolved' }),
          }),
          AlertService.getStats(),
        ]);
        setAlerts(alertsData?.data || []);
        setTotal(alertsData?.total || 0);
        setStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load alerts');
      } finally {
        setIsLoading(false);
      }
    };

    loadAlerts();
  }, [page, filters]);

  const alerts = [
    {
      id: 1,
      title: 'High Expiry Rate Detected',
      message: '15 drugs expiring within 30 days',
      type: 'expiry',
      severity: 'critical',
      warehouse: 'Main',
      timestamp: '2 hours ago',
      actions: ['View Drugs', 'Plan Dispatch'],
    },
    {
      id: 2,
      title: 'Stock Below Threshold',
      message: 'Paracetamol stock at 5% capacity',
      type: 'stock',
      severity: 'warning',
      warehouse: 'Storage A',
      timestamp: '4 hours ago',
      actions: ['Reorder', 'View Details'],
    },
    {
      id: 3,
      title: 'Temperature Deviation',
      message: 'Cold storage unit temperature fluctuation detected',
      type: 'temperature',
      severity: 'warning',
      warehouse: 'Main',
      timestamp: '6 hours ago',
      actions: ['Check Equipment', 'Investigate'],
    },
    {
      id: 4,
      title: 'Batch Dispatch Completed',
      message: 'Batch #BT-2024-0542 dispatched successfully',
      type: 'dispatch',
      severity: 'info',
      warehouse: 'Storage A',
      timestamp: '1 day ago',
      actions: ['View Invoice'],
    },
    {
      id: 5,
      title: 'Import Validation Error',
      message: '3 rows failed validation in import #IMP-0089',
      type: 'import',
      severity: 'error',
      warehouse: 'Main',
      timestamp: '2 days ago',
      actions: ['Review Errors', 'Retry'],
    },
  ];

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'danger',
      error: 'danger',
      warning: 'warning',
      info: 'secondary',
    };
    return colors[severity] || 'secondary';
  };

  const getSeverityIcon = (severity: string) => {
    const icons: Record<string, string> = {
      critical: '🔴',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
    };
    return icons[severity] || 'ℹ️';
  };

  const handleResolve = (id: number) => {
    setResolving(id);
    setTimeout(() => setResolving(null), 500);
  };

  return (
    <AppLayout
      sidebar={
        <Sidebar>
          <SidebarItem label="Dashboard" icon="📊" href="/dashboard" />
          <SidebarItem label="Import" icon="📥" href="/import" />
          <SidebarItem label="Drugs" icon="💊" href="/drugs" />
          <SidebarItem label="Batches" icon="🎫" href="/batches" />
          <SidebarItem label="Alerts" active icon="⚠️" href="/alerts" />
        </Sidebar>
      }
      header={
        <div className="flex items-center justify-between px-8 py-4">
          <h1 className="text-xl font-bold text-text-primary">PharmaStock</h1>
        </div>
      }
    >
      <PageHeader
        title="Alerts"
        subtitle="View and manage system alerts and notifications"
        actions={
          <Button variant="outline">Mark All as Read</Button>
        }
      />

      {/* Alert Statistics */}
      <Section title="Quick Stats">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Critical', count: 1, color: 'danger' },
            { label: 'Errors', count: 1, color: 'danger' },
            { label: 'Warnings', count: 2, color: 'warning' },
            { label: 'Info', count: 1, color: 'secondary' },
          ].map((stat, idx) => (
            <Card key={idx} className="p-4 text-center">
              <div className={`text-3xl font-bold text-${stat.color}-500 mb-2`}>
                {stat.count}
              </div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Filters */}
      <Section title="Filter Alerts">
        <Card className="p-6">
          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Alert Type"
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'expiry', label: 'Expiry' },
                { value: 'stock', label: 'Stock' },
                { value: 'temperature', label: 'Temperature' },
                { value: 'dispatch', label: 'Dispatch' },
              ]}
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            />
            <Select
              label="Warehouse"
              options={[
                { value: 'all', label: 'All Warehouses' },
                { value: 'main', label: 'Main' },
                { value: 'storage-a', label: 'Storage A' },
              ]}
              value={filters.warehouse}
              onChange={(e) => setFilters({ ...filters, warehouse: e.target.value })}
            />
            <Select
              label="Status"
              options={[
                { value: 'unresolved', label: 'Unresolved' },
                { value: 'resolved', label: 'Resolved' },
                { value: 'all', label: 'All' },
              ]}
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            />
          </div>
        </Card>
      </Section>

      {/* Alerts Feed */}
      <Section title="Alert Feed">
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              className={`p-6 border-l-4 hover:shadow-md transition-shadow ${
                alert.severity === 'critical'
                  ? 'border-l-danger-500 bg-danger-50'
                  : alert.severity === 'error'
                  ? 'border-l-danger-500 bg-danger-50'
                  : alert.severity === 'warning'
                  ? 'border-l-warning-500 bg-warning-50'
                  : 'border-l-secondary-500'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{getSeverityIcon(alert.severity)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-text-primary">
                        {alert.title}
                      </h3>
                      <Badge variant={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-text-secondary mb-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                      <span>📍 {alert.warehouse}</span>
                      <span>⏱️ {alert.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                {alert.actions.map((action, idx) => (
                  <Button
                    key={idx}
                    variant={idx === 0 ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleResolve(alert.id)}
                    isLoading={resolving === alert.id}
                  >
                    {action}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => handleResolve(alert.id)}
                >
                  ✓ Resolve
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </AppLayout>
  );
}
