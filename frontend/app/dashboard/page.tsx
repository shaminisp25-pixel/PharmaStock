'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Badge, Input, Skeleton, Spinner, Alert } from '@/components/ui';
import { Stat, Grid, PageHeader, AppLayout, Sidebar, SidebarItem, Table, Section } from '@/components/layout';
import { useAuth, useRequireAuth } from '@/lib/auth-context';
import { BatchService, AlertService, DrugService } from '@/lib/api-services';

export default function Dashboard() {
  const router = useRouter();
  const user = useRequireAuth();
  const { logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalDrugs: 0,
    expirySoon: 0,
    totalAlerts: 0,
    activeWarehouses: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [nearExpiry, setNearExpiry] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [drugsData, alertsData, batchesData] = await Promise.all([
        DrugService.getAll(1, 100).catch(() => ({ data: [], total: 0 })),
        AlertService.getAll(1, 10).catch(() => ({ data: [], total: 0 })),
        BatchService.getAll(1, 10).catch(() => ({ data: [], total: 0 })),
      ]);

      setStats({
        totalDrugs: drugsData?.total || 0,
        expirySoon: Math.floor(Math.random() * 15) + 5,
        totalAlerts: alertsData?.total || 0,
        activeWarehouses: 3,
      });

      // Mock recent activity
      setRecentActivity([
        {
          id: 1,
          title: 'Batch #BT2024001 Dispatched',
          description: 'Status changed to Dispatched',
          time: '2 hours ago',
          icon: '📦',
        },
        {
          id: 2,
          title: 'New Drug Added',
          description: 'Aspirin 500mg batch added',
          time: '4 hours ago',
          icon: '💊',
        },
        {
          id: 3,
          title: 'Warehouse Updated',
          description: 'Storage A temperature normalized',
          time: '6 hours ago',
          icon: '🏭',
        },
      ]);

      // Mock near expiry drugs
      setNearExpiry([
        { name: 'Aspirin 500mg', batch: 'BT2024001', expiryDays: 5 },
        { name: 'Ibuprofen 200mg', batch: 'BT2024002', expiryDays: 12 },
        { name: 'Paracetamol 1000mg', batch: 'BT2024003', expiryDays: 23 },
      ]);
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Failed to load dashboard data';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  // Sidebar navigation
  const sidebarContent = (
    <Sidebar>
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white px-4 mb-4">Pharmacy</h2>
        <div className="space-y-1">
          <SidebarItem
            icon="📊"
            label="Dashboard"
            active={true}
            onClick={() => router.push('/dashboard')}
          />
          <SidebarItem
            icon="💊"
            label="Products"
            onClick={() => router.push('/drugs')}
          />
          <SidebarItem
            icon="📁"
            label="Categories"
            onClick={() => router.push('/batches')}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xs font-semibold uppercase text-gray-400 px-4 mb-3">LEADS</h3>
        <div className="space-y-1">
          <SidebarItem
            icon="🛒"
            label="Orders"
            onClick={() => router.push('/import')}
          />
          <SidebarItem
            icon="📈"
            label="Sales"
            onClick={() => router.push('/reports')}
          />
          <SidebarItem
            icon="👥"
            label="Customers"
            onClick={() => router.push('/users')}
          />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase text-gray-400 px-4 mb-3">COMMS</h3>
        <div className="space-y-1">
          <SidebarItem
            icon="💳"
            label="Payments"
            onClick={() => router.push('/audit')}
          />
          <SidebarItem
            icon="📋"
            label="Reports"
            onClick={() => router.push('/reports')}
          />
          <SidebarItem
            icon="⚙️"
            label="Settings"
            onClick={() => {}}
          />
        </div>
      </div>
    </Sidebar>
  );

  // Header navigation
  const headerContent = (
    <div className="px-6 py-4 flex items-center justify-between">
      <div className="flex items-center flex-1 gap-4">
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search"
            icon="🔍"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">⚙️</button>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-text">{user.name}</p>
            <p className="text-xs text-text-secondary">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout sidebar={sidebarContent} header={headerContent}>
      {/* Page Title */}
      <PageHeader
        title="Welcome Code Astrol!"
        subtitle="Pharmaceutical Warehouse Management System"
      />

      {/* Error Alert */}
      {error && (
        <Alert type="danger" title="Error" dismissible onDismiss={() => setError(null)} className="mb-6">
          {error}
        </Alert>
      )}

      {/* Stats Section - With pastel colors */}
      <Section title="Pharmacy Sales Results">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        ) : (
          <Grid cols={4} gap="md">
            <Stat
              label="Todays Sales"
              value="$95.00"
              trend="up"
              trendValue="+2.5%"
              bgColor="green"
              icon="💰"
            />
            <Stat
              label="Available Categories"
              value="1,457%"
              trend="up"
              trendValue="+2.5%"
              bgColor="cyan"
              icon="📊"
            />
            <Stat
              label="Expired Medicines"
              value="0.00%"
              trend="up"
              trendValue="+2.5%"
              bgColor="pink"
              icon="⚠️"
            />
            <Stat
              label="System Users"
              value="255K"
              trend="up"
              trendValue="+2.5%"
              bgColor="blue"
              icon="👥"
            />
          </Grid>
        )}
      </Section>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Graph Report */}
        <Card className="p-6" hoverable>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-text">Graph Report</h3>
            <button className="text-text-secondary hover:text-text">⋯</button>
          </div>
          <div className="h-64 flex items-center justify-center bg-stat-cyan rounded-lg p-6">
            <div className="text-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Simple donut chart SVG */}
                <circle cx="50" cy="50" r="45" fill="none" stroke="#D1FAE5" strokeWidth="15" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#CFFAFE" strokeWidth="15" strokeDasharray="70.7 282.7" transform="rotate(-90 50 50)" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#FCE7F3" strokeWidth="15" strokeDasharray="42.4 282.7" strokeDashoffset="-70.7" transform="rotate(-90 50 50)" />
                <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold" fill="#1F2937">
                  755K
                </text>
                <text x="50" y="65" textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#6B7280">
                  Total
                </text>
              </svg>
            </div>
          </div>
          <div className="flex gap-6 mt-6 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-stat-green" />
              <span className="text-text-secondary">Purchases 42%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-stat-cyan" />
              <span className="text-text-secondary">Suppliers 29%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-stat-pink" />
              <span className="text-text-secondary">Sales 18%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <span className="text-text-secondary">No Sales 12%</span>
            </div>
          </div>
        </Card>

        {/* Total Sales Overview */}
        <Card className="p-6" hoverable>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-text">Total Sales Overview</h3>
            <div className="flex items-center gap-2">
              <select className="px-3 py-1 rounded-lg border border-border text-sm bg-white text-text">
                <option>Apr 2025</option>
              </select>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="flex items-end gap-4 w-full h-full px-4 pt-4">
              {[65, 45, 75, 85, 55, 95, 70].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg transition-all hover:opacity-80"
                    style={{
                      height: `${(height / 100) * 200}px`,
                      background: ['#D1FAE5', '#CFFAFE', '#FCE7F3', '#E0E7FF', '#FCD34D', '#FECACA', '#DBEAFE'][i % 7],
                    }}
                  />
                  <span className="text-xs text-text-secondary">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 p-3 bg-sidebar text-white rounded-lg flex items-center justify-between">
            <span className="font-semibold">Apr 2025</span>
            <span className="text-lg font-bold">$298.00K</span>
          </div>
        </Card>
      </div>

      {/* Recent Sales List */}
      <Section title="Recent Sales List" className="mt-8">
        <Card className="p-6" hoverable>
          <Table
            headers={['Name', 'Modeline', 'User Email', 'Quantity', 'Total Price', 'Date']}
            rows={[
              [
                <span key="1" className="font-medium">John Doe</span>,
                'Aspirin 500mg',
                'john@example.com',
                '100 units',
                '$1,500.00',
                '2025-04-15',
              ],
              [
                <span key="2" className="font-medium">Jane Smith</span>,
                'Ibuprofen 200mg',
                'jane@example.com',
                '50 units',
                '$750.00',
                '2025-04-14',
              ],
              [
                <span key="3" className="font-medium">Mike Johnson</span>,
                'Paracetamol 1000mg',
                'mike@example.com',
                '200 units',
                '$2,800.00',
                '2025-04-13',
              ],
            ]}
          />
        </Card>
      </Section>
    </AppLayout>
  );
}
