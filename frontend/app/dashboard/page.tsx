import DashboardStats from '@/src/components/dashboard/DashboardStats';
import InventoryTable from '@/src/components/dashboard/InventoryTable';
import AlertsPanel from '@/src/components/dashboard/AlertsPanel';
import AnalyticsChart from '@/src/components/dashboard/AnalyticsChart';

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <DashboardStats />
      <AnalyticsChart />
      <InventoryTable />
      <AlertsPanel />
    </div>
  );
}