'use client';

import React, { useEffect, useState } from 'react';
import { Card, Button, Badge, Select } from '@/components/ui';
import { AppLayout, PageHeader, Section, Sidebar, SidebarItem } from '@/components/layout';
import { useRequireAuth } from '@/lib/auth-context';
import { BatchService, Batch } from '@/lib/api-services';

export default function BatchesPage() {
  const user = useRequireAuth();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    warehouse: 'all',
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setIsLoading(true);
        const filterParams = {
          ...(filters.status !== 'all' && { status: filters.status }),
          ...(filters.warehouse !== 'all' && { warehouseId: filters.warehouse }),
        };
        const data = await BatchService.getAll(page, 10, filterParams);
        setBatches(data?.data || []);
        setTotal(data?.total || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load batches');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBatches();
  }, [page, filters]);

  return (
    <AppLayout
      sidebar={
        <Sidebar>
          <SidebarItem label="Dashboard" icon="📊" href="/dashboard" />
          <SidebarItem label="Batches" active icon="🎫" href="/batches" />
          <SidebarItem label="Drugs" icon="💊" href="/drugs" />
          <SidebarItem label="Import" icon="📥" href="/import" />
          <SidebarItem label="Reports" icon="📋" href="/reports" />
          <SidebarItem label="Alerts" icon="⚠️" href="/alerts" />
        </Sidebar>
      }
      header={
        <div className="flex items-center justify-between px-8 py-4">
          <h1 className="text-xl font-bold text-text-primary">PharmaStock</h1>
        </div>
      }
    >
      <PageHeader
        title="Batch Management"
        subtitle="Track and manage drug batches"
        actions={
          <>
            <Input placeholder="Scan barcode..." size="sm" className="w-48" icon="📱" />
            <Button variant="primary">+ New Batch</Button>
          </>
        }
      />

      {/* Filters */}
      <Section>
        <div className="grid grid-cols-4 gap-4">
          <Select
            label="Status"
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'dispatched', label: 'Dispatched' },
              { value: 'expired', label: 'Expired' },
            ]}
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
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
          <Button variant="outline">More Filters</Button>
          <div />
        </div>
      </Section>

      {/* Batches */}
      <Section>
        {error ? (
          <Card className="p-6 bg-danger-50">
            <p className="text-danger-700">{error}</p>
          </Card>
        ) : isLoading ? (
          <Card className="p-6 text-center">
            <p className="text-text-secondary">Loading batches...</p>
          </Card>
        ) : batches.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-text-secondary">No batches found</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {batches.map((batch) => {
              const expiryDate = new Date(batch.expiryDate);
              const today = new Date();
              const daysLeft = Math.floor(
                (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
              );

              const getExpiryColor = () => {
                if (daysLeft < 0) return 'danger';
                if (daysLeft < 30) return 'warning';
                return 'success';
              };

              return (
                <Card key={batch.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-text-primary">
                          #{batch.batchNumber}
                        </h3>
                        <Badge
                          variant={
                            batch.status === 'active'
                              ? 'success'
                              : batch.status === 'dispatched'
                              ? 'secondary'
                              : 'danger'
                          }
                        >
                          {batch.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-secondary mb-3">
                        {batch.drug?.name || 'Unknown Drug'}
                      </p>
                      <div className="grid grid-cols-4 gap-8">
                        <div>
                          <p className="text-xs text-text-muted">Quantity</p>
                          <p className="font-semibold text-text-primary">
                            {batch.quantity} units
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-text-muted">Expiry Date</p>
                          <p className="font-semibold text-text-primary">
                            {new Date(batch.expiryDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-text-muted">Temperature</p>
                          <p className="font-semibold text-text-primary">
                            {batch.temperature}°C
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-text-muted">Days Left</p>
                          <Badge variant={getExpiryColor() as any}>
                            {daysLeft} days
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Dispatch</Button>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Section>
    </AppLayout>
  );
}
