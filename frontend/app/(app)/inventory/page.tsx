'use client';

import React, { useState } from 'react';
import { useDrugs, useWarehouses, useCreateDrug, useUpdateDrug, useDeleteDrug } from '@/services/entityHooks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { PaginationParams, Drug } from '@/types';
import { DrugModal } from '@/components/modals/DrugModal';

export default function InventoryPage() {
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, limit: 20 });
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<Drug | undefined>();

  const { data: drugs, isLoading: drugsLoading, refetch } = useDrugs(pagination);
  const { data: warehouses } = useWarehouses({ limit: 1000 });
  const createDrugMutation = useCreateDrug();
  const deleteDrugMutation = useDeleteDrug();

  const filteredDrugs = drugs?.data?.filter(
    (drug: Drug) =>
      drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">Manage your pharmaceutical inventory</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedDrug(undefined);
            setShowCreateForm(true);
          }}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Drug
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search drugs by name or manufacturer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Drugs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Drugs ({drugs?.meta?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left text-muted-foreground font-medium">
                  <th className="pb-3 px-4">Name</th>
                  <th className="pb-3 px-4">Manufacturer</th>
                  <th className="pb-3 px-4">Category</th>
                  <th className="pb-3 px-4">Temp Range</th>
                  <th className="pb-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drugsLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
                    </tr>
                  ))
                ) : filteredDrugs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No drugs found
                    </td>
                  </tr>
                ) : (
                  filteredDrugs.map((drug: Drug) => (
                    <tr key={drug.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-foreground">{drug.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{drug.manufacturer}</td>
                      <td className="py-3 px-4">
                        {drug.category && <Badge>{drug.category}</Badge>}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {drug.tempMin}°C to {drug.tempMax}°C
                      </td>
                      <td className="py-3 px-4 text-right flex justify-end gap-2">
                        <button
                          className="p-1 hover:bg-muted rounded transition-colors"
                          onClick={() => {
                            setSelectedDrug(drug);
                            setShowCreateForm(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          className="p-1 hover:bg-destructive/10 rounded transition-colors"
                          onClick={() => deleteDrugMutation.mutate(drug.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {drugs && drugs.meta?.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {drugs.meta?.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination({ ...pagination, page: (pagination.page || 1) - 1 })}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === drugs.meta?.totalPages}
                  onClick={() => setPagination({ ...pagination, page: (pagination.page || 1) + 1 })}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <DrugModal
        isOpen={showCreateForm}
        onClose={() => {
          setShowCreateForm(false);
          setSelectedDrug(undefined);
        }}
        onSuccess={() => {
          refetch();
        }}
        drug={selectedDrug}
      />
    </div>
  );
}
