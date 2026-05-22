'use client';

import React from 'react';
import { useBatches, useAlerts, useWarehouses } from '@/services/entityHooks';
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

// Mock data for charts
const chartData = [
  { name: 'Mon', revenue: 4000, batches: 240 },
  { name: 'Tue', revenue: 3000, batches: 221 },
  { name: 'Wed', revenue: 2000, batches: 229 },
  { name: 'Thu', revenue: 2780, batches: 200 },
  { name: 'Fri', revenue: 1890, batches: 228 },
  { name: 'Sat', revenue: 2390, batches: 250 },
  { name: 'Sun', revenue: 3490, batches: 210 },
];

const statusData = [
  { name: 'Active', value: 65, color: '#10b981' },
  { name: 'Dispatched', value: 25, color: '#3b82f6' },
  { name: 'Expired', value: 8, color: '#ef4444' },
  { name: 'Quarantined', value: 2, color: '#f59e0b' },
];

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
  const { data: batches, isLoading: batchesLoading } = useBatches({ limit: 1000 });
  const { data: alerts, isLoading: alertsLoading } = useAlerts({ limit: 100 });
  const { data: warehouses, isLoading: warehousesLoading } = useWarehouses({ limit: 100 });

  const totalBatches = batches?.meta?.total || 0;
  const activeBatches = batches?.data?.filter((b) => b.status === 'active').length || 0;
  const totalAlerts = alerts?.meta?.total || 0;
  const unresolvedAlerts = alerts?.data?.filter((a) => !a.resolved).length || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your pharmacy overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Batches"
          value={totalBatches}
          icon={<Package className="w-6 h-6 text-primary" />}
          trend="12% increase"
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
          trend="Requires attention"
          loading={alertsLoading}
        />
        <StatCard
          title="Warehouses"
          value={warehouses?.meta?.total || 0}
          icon={<WarehouseIcon className="w-6 h-6 text-success" />}
          loading={warehousesLoading}
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
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Batch Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts?.data?.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-warning" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.batch?.drug?.name}</p>
                  </div>
                </div>
                <Badge
                  variant={alert.resolved ? 'default' : 'warning'}
                >
                  {alert.resolved ? 'Resolved' : alert.alertType}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
