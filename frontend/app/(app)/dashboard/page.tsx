'use client';

import React, { useEffect, useMemo } from 'react';
import { useBatches, useAlerts, useWarehouses, useDrugs } from '@/services/entityHooks';
import { Batch, Alert } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { AlertCircle, TrendingUp, Package, Warehouse as WarehouseIcon } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  loading,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-20 mt-2" />
            ) : (
              <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
            )}
            {trend && (
              <p className="text-xs text-success mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {trend}
              </p>
            )}
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">{Icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  // Fetch paginated data with optimized limits
  const { data: batches, isLoading: batchesLoading, refetch: refetchBatches } = useBatches({ limit: 20, page: 1 });
  const { data: alerts, isLoading: alertsLoading, refetch: refetchAlerts } = useAlerts({ limit: 10, page: 1 });
  const { data: warehouses, isLoading: warehousesLoading, refetch: refetchWarehouses } = useWarehouses({ limit: 20, page: 1 });
  const { data: drugs, isLoading: drugsLoading } = useDrugs({ limit: 20, page: 1 });

  // Set up real-time data sync - refetch every 2 minutes (reduced from 30s)
  useEffect(() => {
    const interval = setInterval(() => {
      refetchBatches();
      refetchAlerts();
      refetchWarehouses();
    }, 120000); // 2 minutes - reduced request frequency

    return () => clearInterval(interval);
  }, [refetchBatches, refetchAlerts, refetchWarehouses]);

  // Calculate statistics
  const totalBatches = batches?.meta?.total || 0;
  const activeBatches = batches?.data?.filter((b: Batch) => b.status === 'active').length || 0;
  const expiredBatches = batches?.data?.filter((b: Batch) => b.status === 'expired').length || 0;
  const dispatchedBatches = batches?.data?.filter((b: Batch) => b.status === 'dispatched').length || 0;
  const totalAlerts = alerts?.meta?.total || 0;
  const unresolvedAlerts = alerts?.data?.filter((a: Alert) => !a.resolved).length || 0;
  const totalDrugs = drugs?.meta?.total || 0;
  const warehouseCount = warehouses?.meta?.total || 0;
  const expiringSoonCount = batches?.data?.filter((b: Batch) => {
    const expiry = new Date(b.expiryDate);
    if (Number.isNaN(expiry.getTime())) return false;
    const daysToExpiry = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysToExpiry > 0 && daysToExpiry <= 30;
  }).length || 0;
  const totalQuantity = batches?.data?.reduce((sum: number, batch: Batch) => sum + batch.quantity, 0) || 0;
  const averageBatchSize = batches?.data?.length ? Math.round(totalQuantity / batches.data.length) : 0;
  const activeAlertRate = totalAlerts ? Math.round((unresolvedAlerts / totalAlerts) * 100) : 0;

  // Helper function to validate dates
  const isValidDate = (date: any) => {
    if (!date) return false;
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  };

  // Generate weekly activity data based on alert creation dates
  const weeklyData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayName = format(date, 'EEE');
      
      const alertsCount = alerts?.data?.filter((a: Alert) => {
        if (!isValidDate(a.createdAt)) return false;
        const alertDate = new Date(a.createdAt);
        try {
          return format(alertDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
        } catch {
          return false;
        }
      }).length || 0;

      const batchesCount = batches?.data?.filter((b: Batch) => {
        if (!isValidDate(b.importedAt)) return false;
        const batchDate = new Date(b.importedAt);
        try {
          return format(batchDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
        } catch {
          return false;
        }
      }).length || 0;

      data.push({
        name: dayName,
        alerts: alertsCount,
        batches: batchesCount,
      });
    }
    return data;
  }, [alerts?.data, batches?.data]);

  // Generate batch status data
  const statusData = useMemo(() => {
    return [
      { name: 'Active', value: activeBatches || 0, color: '#10b981' },
      { name: 'Dispatched', value: dispatchedBatches || 0, color: '#3b82f6' },
      { name: 'Expired', value: expiredBatches || 0, color: '#ef4444' },
      { name: 'Quarantined', value: (batches?.data?.filter((b: Batch) => b.status === 'quarantined').length || 0), color: '#f59e0b' },
    ];
  }, [activeBatches, dispatchedBatches, expiredBatches, batches?.data]);

  const inventoryByDrug = useMemo(() => {
    return (drugs?.data || [])
      .slice(0, 6)
      .map((drug) => ({
        name: drug.name,
        quantity: batches?.data?.filter((batch: Batch) => batch.drugId === drug.id).reduce((sum: number, batch: Batch) => sum + batch.quantity, 0) || 0,
      }))
      .sort((a, b) => b.quantity - a.quantity);
  }, [drugs?.data, batches?.data]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your pharmacy overview with real-time data.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Batches"
          value={totalBatches}
          icon={<Package className="w-6 h-6 text-primary" />}
          trend={`${activeBatches} active`}
          loading={batchesLoading}
        />
        <StatCard
          title="Active Batches"
          value={activeBatches}
          icon={<WarehouseIcon className="w-6 h-6 text-primary" />}
          trend="In stock"
          loading={batchesLoading}
        />
        <StatCard
          title="Active Alerts"
          value={unresolvedAlerts}
          icon={<AlertCircle className="w-6 h-6 text-warning" />}
          trend={`${totalAlerts} total`}
          loading={alertsLoading}
        />
        <StatCard
          title="Warehouses"
          value={warehouseCount}
          icon={<WarehouseIcon className="w-6 h-6 text-success" />}
          trend={`${totalDrugs} drugs`}
          loading={warehousesLoading}
        />
      </div>

      {/* Secondary Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Expiring Soon"
          value={expiringSoonCount}
          icon={<AlertCircle className="w-6 h-6 text-warning" />}
          trend="Next 30 days"
          loading={batchesLoading}
        />
        <StatCard
          title="Average Batch Size"
          value={averageBatchSize}
          icon={<Package className="w-6 h-6 text-primary" />}
          trend={`${totalQuantity} total units`}
          loading={batchesLoading}
        />
        <StatCard
          title="Alert Rate"
          value={`${activeAlertRate}%`}
          icon={<AlertCircle className="w-6 h-6 text-destructive" />}
          trend="Unresolved alerts"
          loading={alertsLoading}
        />
        <StatCard
          title="Inventory Coverage"
          value={inventoryByDrug.length}
          icon={<WarehouseIcon className="w-6 h-6 text-success" />}
          trend="Top tracked drugs"
          loading={drugsLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {batchesLoading || alertsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="batches"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="alerts"
                    stroke="hsl(var(--warning))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--warning))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Batch Status</CardTitle>
          </CardHeader>
          <CardContent>
            {batchesLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Inventory by Drug */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Drug</CardTitle>
          </CardHeader>
          <CardContent>
            {batchesLoading || drugsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={inventoryByDrug} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="name" width={100} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Bar dataKey="quantity" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts ({unresolvedAlerts} Unresolved)</CardTitle>
        </CardHeader>
        <CardContent>
          {alertsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : alerts?.data && alerts.data.length > 0 ? (
            <div className="space-y-3">
              {alerts.data.slice(0, 5).map((alert: Alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-2 h-2 rounded-full ${alert.resolved ? 'bg-success' : 'bg-warning'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{alert.message || alert.alertType.replace('_', ' ')}</p>
                      <p className="text-xs text-muted-foreground truncate">{alert.batch?.drug?.name || 'N/A'}</p>
                    </div>
                  </div>
                  <Badge
                    variant={alert.resolved ? 'success' : 'warning'}
                    className="ml-2 whitespace-nowrap"
                  >
                    {alert.resolved ? 'Resolved' : 'Active'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No alerts found</p>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Expired Batches</p>
            <p className="text-2xl font-bold text-destructive mt-2">{expiredBatches}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Drugs</p>
            <p className="text-2xl font-bold text-primary mt-2">{totalDrugs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Dispatched Batches</p>
            <p className="text-2xl font-bold text-success mt-2">{dispatchedBatches}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Operational Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">Urgent Alerts</p>
              <p className="mt-2 text-2xl font-bold text-destructive">{unresolvedAlerts}</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">Total Quantity</p>
              <p className="mt-2 text-2xl font-bold text-primary">{totalQuantity}</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">Drugs Tracked</p>
              <p className="mt-2 text-2xl font-bold text-success">{totalDrugs}</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">Warehouses Active</p>
              <p className="mt-2 text-2xl font-bold text-warning">{warehouseCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
