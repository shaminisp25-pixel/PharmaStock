import AnalyticsChart from '@/src/components/dashboard/AnalyticsChart';

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>
      <AnalyticsChart />
    </div>
  );
}