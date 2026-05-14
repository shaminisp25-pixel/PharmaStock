'use client';

import React, { useEffect, useState } from 'react';
import { Card, Button, Badge, Stat } from '@/components/ui';
import { AppLayout, PageHeader, Section, Sidebar, SidebarItem } from '@/components/layout';
import { useAuth, useRequireAuth } from '@/lib/auth-context';
import { BatchService, AlertService, DrugService } from '@/lib/api-services';

export default function Dashboard() {
  const user = useRequireAuth();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState({
    expirySoon: 0,
    alertsCount: 0,
    stockOverview: 0,
    totalDrugs: 0,
  });

  React.useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const [expiryStats, alertsStats, drugsData] = await Promise.all([
          BatchService.getExpiryStats(),
          AlertService.getStats(),
          DrugService.getAll(1, 1),
        ]);

        setStats({
          expirySoon: expiryStats?.expiringSoon || 0,
          alertsCount:
            (alertsStats?.critical || 0) +
            (alertsStats?.error || 0) +
            (alertsStats?.warning || 0),
          stockOverview: drugsData?.total || 0,
          totalDrugs: drugsData?.total || 0,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load dashboard data',
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <AppLayout
      sidebar={
        <Sidebar>
          <SidebarItem label="Dashboard" active icon="📊" href="/dashboard" />
          <SidebarItem label="Inventory" icon="📦" href="/inventory" />
          <SidebarItem label="Drugs" icon="💊" href="/drugs" />
          <SidebarItem label="Batches" icon="🎫" href="/batches" />
          <SidebarItem label="Import" icon="📥" href="/import" />
          <SidebarItem label="Reports" icon="📋" href="/reports" />
          <SidebarItem label="Alerts" icon="⚠️" href="/alerts" />
          <hr className="my-4 border-border" />
          <SidebarItem label="Users" icon="👥" href="/admin/users" />
          <SidebarItem label="Audit Logs" icon="🔍" href="/audit" />
          <SidebarItem label="Settings" icon="⚙️" href="/settings" />
        </Sidebar>
      }
      header={
        <div className="flex items-center justify-between px-8 py-4">
          <h1 className="text-xl font-bold text-text-primary">PharmaStock</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-off-white rounded-lg">🔔</button>
            <button className="p-2 hover:bg-off-white rounded-lg">👤</button>
          </div>
        </div>
      }
    >
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's your warehouse overview"
        actions={
          <Button variant="primary" onClick={() => setIsLoading(true)}>
            Refresh
          </Button>
        }
      />

      {/* Key Metrics */}
      <Section title="Quick Stats" subtitle="Overview of key metrics">
        <div className="grid grid-cols-4 gap-4">
          <Stat
            title="Expiry Alerts"
            value={stats.expirySoon}
            icon="⏰"
            color="danger"
          />
          <Stat
            title="Total Alerts"
            value={stats.alertsCount}
            icon="⚠️"
            color="warning"
          />
          <Stat
            title="Active Drugs"
            value={stats.totalDrugs}
            icon="💊"
            color="primary"
          />
          <Stat
            title="Stock Items"
            value={stats.stockOverview}
            icon="📦"
            color="secondary"
          />
        </div>
      </Section>
        <Grid cols={4} gap="md">
          <Stat
            label="Total Drugs"
            value="284"
            unit="items"
            icon="💊"
            trend="up"
            trendValue="+12 this month"
          />
          <Stat
            label="Active Batches"
            value="156"
            unit="batches"
            icon="📦"
            trend="down"
            trendValue="-5 this month"
          />
          <Stat
            label="Expiry Alerts"
            value="23"
            unit="critical"
            icon="⚠️"
            trend="up"
            trendValue="+8 this week"
          />
          <Stat
            label="Warehouse Stock"
            value="89%"
            unit="capacity"
            icon="🏭"
            trend="down"
            trendValue="-2% this week"
          />
        </Grid>
      </Section>

      {/* Recent Activity */}
      <Section title="Recent Activity" subtitle="Latest updates and changes">
        <Card className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-4 hover:bg-off-white rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary">
                    📦
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">Batch #BT{1000 + item} Updated</p>
                    <p className="text-sm text-text-secondary">Status changed to Dispatched</p>
                  </div>
                </div>
                <Badge variant="success">Completed</Badge>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      {/* Near Expiry Drugs */}
      <Section title="Near Expiry Alert" subtitle="Drugs expiring within 30 days">
        <Card className="p-6">
          <div className="space-y-3">
            {[
              { name: 'Aspirin 500mg', batch: 'BT2024001', expiryDays: 5 },
              { name: 'Ibuprofen 200mg', batch: 'BT2024002', expiryDays: 12 },
              { name: 'Paracetamol 1000mg', batch: 'BT2024003', expiryDays: 23 },
            ].map((drug) => (
              <div
                key={drug.batch}
                className="flex items-center justify-between p-3 bg-off-white rounded-lg"
              >
                <div>
                  <p className="font-medium text-text-primary">{drug.name}</p>
                  <p className="text-xs text-text-secondary">{drug.batch}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={drug.expiryDays <= 7 ? 'danger' : 'warning'}
                  >
                    {drug.expiryDays} days
                  </Badge>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      {/* Chart Placeholder */}
      <Section title="Stock Trend" subtitle="Last 30 days">
        <Card className="p-6 h-64 flex items-center justify-center bg-gradient-to-br from-primary-light to-secondary-light">
          <div className="text-center">
            <p className="text-text-secondary mb-2">Chart visualization</p>
            <Spinner size="md" />
          </div>
        </Card>
      </Section>
    </AppLayout>
  );
}
