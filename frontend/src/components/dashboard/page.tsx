import DashboardStats from '@/src/components/dashboard/DashboardStats';
import AnalyticsChart from '@/src/components/dashboard/AnalyticsChart';
import InventoryTable from '@/src/components/dashboard/InventoryTable';
import AlertsPanel from '@/src/components/dashboard/AlertsPanel';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f5f9ff] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-5xl font-black text-[#02152f]">
          Pharma Dashboard
        </h1>

        <DashboardStats />

        <AnalyticsChart />

        <InventoryTable />

        <AlertsPanel />
      </div>
    </main>
  );
}