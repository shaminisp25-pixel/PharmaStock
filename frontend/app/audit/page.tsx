'use client';

import React from 'react';
import { Card, Button, Badge, Select, Input } from '@/components/ui';
import { AppLayout, PageHeader, Section, Sidebar, SidebarItem } from '@/components/layout';

export default function AuditPage() {
  const [filters, setFilters] = React.useState({
    action: 'all',
    user: '',
    dateRange: '30days',
  });

  const auditLogs = [
    {
      id: 1,
      timestamp: '2024-05-12 14:35',
      user: 'John Manager',
      action: 'DISPATCH',
      resource: 'Batch #BT-2024-0542',
      details: 'Dispatched 500 units of Paracetamol',
      status: 'success',
      ipAddress: '192.168.1.100',
    },
    {
      id: 2,
      timestamp: '2024-05-12 13:20',
      user: 'Sarah Officer',
      action: 'IMPORT',
      resource: 'Import #IMP-0089',
      details: '250 drug entries imported from Excel',
      status: 'success',
      ipAddress: '192.168.1.105',
    },
    {
      id: 3,
      timestamp: '2024-05-12 12:15',
      user: 'Mike Admin',
      action: 'USER_UPDATE',
      resource: 'User: Lisa Inspector',
      details: 'Changed role from Officer to Inspector',
      status: 'success',
      ipAddress: '192.168.1.50',
    },
    {
      id: 4,
      timestamp: '2024-05-12 11:45',
      user: 'Tom Operator',
      action: 'DRUG_UPDATE',
      resource: 'Drug: Aspirin',
      details: 'Updated stock quantity: 1000 → 950',
      status: 'success',
      ipAddress: '192.168.1.110',
    },
    {
      id: 5,
      timestamp: '2024-05-12 10:30',
      user: 'Sarah Officer',
      action: 'UNAUTHORIZED_ACCESS',
      resource: 'Reports',
      details: 'Attempted to access restricted reports section',
      status: 'failed',
      ipAddress: '192.168.1.105',
    },
    {
      id: 6,
      timestamp: '2024-05-12 09:15',
      user: 'John Manager',
      action: 'EXPORT',
      resource: 'Drug Catalog',
      details: 'Exported 284 drugs as CSV',
      status: 'success',
      ipAddress: '192.168.1.100',
    },
    {
      id: 7,
      timestamp: '2024-05-11 16:45',
      user: 'Mike Admin',
      action: 'CONFIG_UPDATE',
      resource: 'System Settings',
      details: 'Updated rate limit threshold: 1000 → 500',
      status: 'success',
      ipAddress: '192.168.1.50',
    },
    {
      id: 8,
      timestamp: '2024-05-11 15:20',
      user: 'Lisa Inspector',
      action: 'REPORT_VIEW',
      resource: 'Expiry Report',
      details: 'Generated expiry report for all warehouses',
      status: 'success',
      ipAddress: '192.168.1.120',
    },
  ];

  const getActionColor = (action: string) => {
    if (action.includes('UNAUTHORIZED') || action === 'EXPORT') return 'warning';
    if (action.includes('UPDATE') || action.includes('DELETE')) return 'primary';
    if (action.includes('CREATE') || action.includes('IMPORT')) return 'success';
    return 'secondary';
  };

  const getActionIcon = (action: string) => {
    const icons: Record<string, string> = {
      DISPATCH: '📤',
      IMPORT: '📥',
      USER_UPDATE: '👤',
      DRUG_UPDATE: '💊',
      UNAUTHORIZED_ACCESS: '🚫',
      EXPORT: '📊',
      CONFIG_UPDATE: '⚙️',
      REPORT_VIEW: '📋',
      CREATE: '✨',
      DELETE: '🗑️',
    };
    return icons[action] || '•';
  };

  const getStatusBadgeVariant = (status: string) => {
    return status === 'success' ? 'success' : 'danger';
  };

  const filteredLogs = auditLogs.filter((log) => {
    if (filters.action !== 'all' && log.action !== filters.action) return false;
    if (filters.user && !log.user.toLowerCase().includes(filters.user.toLowerCase()))
      return false;
    return true;
  });

  return (
    <AppLayout
      sidebar={
        <Sidebar>
          <SidebarItem label="Dashboard" icon="📊" href="/dashboard" />
          <SidebarItem label="Drugs" icon="💊" href="/drugs" />
          <SidebarItem label="Batches" icon="🎫" href="/batches" />
          <SidebarItem label="Reports" icon="📋" href="/reports" />
          <SidebarItem label="Audit" active icon="📝" href="/audit" />
        </Sidebar>
      }
      header={
        <div className="flex items-center justify-between px-8 py-4">
          <h1 className="text-xl font-bold text-text-primary">PharmaStock</h1>
          <Badge variant="accent">Inspector Only</Badge>
        </div>
      }
    >
      <PageHeader
        title="Audit Logs"
        subtitle="Comprehensive system activity and access logs (Read-only)"
        actions={
          <Button variant="outline">📥 Export Logs</Button>
        }
      />

      {/* Summary Cards */}
      <Section title="Activity Summary">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Activities', count: auditLogs.length, icon: '📊' },
            {
              label: 'Successful',
              count: auditLogs.filter(l => l.status === 'success').length,
              icon: '✓',
            },
            {
              label: 'Failed',
              count: auditLogs.filter(l => l.status === 'failed').length,
              icon: '✗',
            },
            {
              label: 'Users Active',
              count: new Set(auditLogs.map(l => l.user)).size,
              icon: '👥',
            },
          ].map((stat, idx) => (
            <Card key={idx} className="p-4 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-primary-500 mb-1">{stat.count}</div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Filters */}
      <Section title="Filter Logs">
        <Card className="p-6">
          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Action Type"
              options={[
                { value: 'all', label: 'All Actions' },
                { value: 'DISPATCH', label: 'Dispatch' },
                { value: 'IMPORT', label: 'Import' },
                { value: 'USER_UPDATE', label: 'User Update' },
                { value: 'DRUG_UPDATE', label: 'Drug Update' },
                { value: 'UNAUTHORIZED_ACCESS', label: 'Unauthorized Access' },
                { value: 'EXPORT', label: 'Export' },
              ]}
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            />
            <Input
              label="User"
              placeholder="Filter by user name..."
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
            />
            <Select
              label="Date Range"
              options={[
                { value: '7days', label: 'Last 7 days' },
                { value: '30days', label: 'Last 30 days' },
                { value: '90days', label: 'Last 90 days' },
              ]}
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            />
          </div>
        </Card>
      </Section>

      {/* Audit Log Table */}
      <Section title="Activity Timeline">
        <div className="space-y-2">
          {filteredLogs.map((log) => (
            <Card
              key={log.id}
              className="p-6 hover:shadow-md transition-shadow hover:border-slate-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{getActionIcon(log.action)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(log.status)}>
                        {log.status.toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-text-primary mb-1">
                      {log.resource}
                    </h3>
                    <p className="text-sm text-text-secondary mb-2">{log.details}</p>
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                      <span>👤 {log.user}</span>
                      <span>⏱️ {log.timestamp}</span>
                      <span>🌐 {log.ipAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Data Info */}
      <Section>
        <Card className="p-4 bg-secondary-50 border border-secondary-200">
          <div className="text-xs text-text-secondary">
            <strong>Note:</strong> Audit logs are maintained for compliance and security purposes. Only users
            with Inspector role or above can access this page. All system activities including CRUD operations,
            user access, and configuration changes are logged with timestamps and IP addresses for
            accountability and audit trail requirements.
          </div>
        </Card>
      </Section>
    </AppLayout>
  );
}
