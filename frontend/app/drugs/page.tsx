'use client';

import React, { useEffect, useState } from 'react';
import { Card, Button, Badge, Select, Input } from '@/components/ui';
import { AppLayout, PageHeader, Section, Sidebar, SidebarItem } from '@/components/layout';
import { useRequireAuth } from '@/lib/auth-context';
import { DrugService, Paginated, Drug } from '@/lib/api-services';

export default function DrugsPage() {
  const user = useRequireAuth();
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    temperature: '',
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        setIsLoading(true);
        const data = await DrugService.getAll(page, 10, searchTerm);
        setDrugs(data?.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load drugs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrugs();
  }, [page, searchTerm]);

  return (
    <AppLayout
      sidebar={
        <Sidebar>
          <SidebarItem label="Dashboard" icon="📊" href="/dashboard" />
          <SidebarItem label="Drugs" active icon="💊" href="/drugs" />
          <SidebarItem label="Batches" icon="🎫" href="/batches" />
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
        title="Drug Catalog"
        subtitle="Manage pharmaceutical drugs and inventory"
        actions={
          <Button variant="primary">+ Add Drug</Button>
        }
      />

      {/* Filters */}
      <Section>
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Search"
            placeholder="Search drugs by name or manufacturer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            label="Category"
            options={[
              { value: '', label: 'All Categories' },
              { value: 'analgesic', label: 'Analgesic' },
              { value: 'antibiotic', label: 'Antibiotic' },
              { value: 'anti-inflammatory', label: 'Anti-inflammatory' },
            ]}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setCategory('');
            setPage(1);
          }}>Clear Filters</Button>
        </div>
      </Section>

      {/* Drugs Table */}
      <Section>
        {error ? (
          <Card className="p-6 bg-danger-50">
            <p className="text-danger-700">{error}</p>
          </Card>
        ) : isLoading ? (
          <Card className="p-6 text-center">
            <p className="text-text-secondary">Loading drugs...</p>
          </Card>
        ) : drugs.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-text-secondary">No drugs found</p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-off-white border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Drug Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Manufacturer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Temperature</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drugs.map((drug) => (
                  <tr key={drug.id} className="border-b border-border hover:bg-off-white">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-text-primary">{drug.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-primary">{drug.manufacturer}</td>
                    <td className="px-6 py-4 text-sm">
                      <Badge variant="secondary">{drug.category}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-primary">
                      {drug.temperature}°C
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </Section>

      {/* Pagination */}
      {drugs.length > 0 && (
        <Section>
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} drugs
            </p>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                ← Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page * 10 >= total}
              >
                Next →
              </Button>
            </div>
          </div>
        </Section>
      )}
    </AppLayout>
  );
}
