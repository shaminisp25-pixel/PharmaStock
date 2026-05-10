import PageHeader from '@/src/components/layout/PageHeader';
import InventoryTable from '@/src/components/dashboard/InventoryTable';

export default function InventoryPage() {
  return (
    <div className="p-6">
      <PageHeader title="Inventory Overview" />
      <InventoryTable />
    </div>
  );
}