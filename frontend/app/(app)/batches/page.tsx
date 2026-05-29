'use client';

import React, { useState } from 'react';
import { useBatches, useUpdateBatchStatus, useDispatchBatch, useDeleteBatch } from '@/services/entityHooks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, AlertCircle, Truck } from 'lucide-react';
import { BatchFilters, BatchStatus, Batch } from '@/types';
import { format, formatDistance } from 'date-fns';
import { BatchModal } from '@/components/modals/BatchModal';

export default function BatchesPage() {
  const [filters, setFilters] = useState<BatchFilters>({ page: 1, limit: 20 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<BatchStatus | 'all'>('all');
  const [showBatchModal, setShowBatchModal] = useState(false);

  const { data: batches, isLoading, refetch } = useBatches(filters);
  const updateStatusMutation = useUpdateBatchStatus();
  const dispatchMutation = useDispatchBatch();
  const deleteMutation = useDeleteBatch();

  const statuses: BatchStatus[] = ['active', 'dispatched', 'expired', 'quarantined'];
  const statusColors: Record<BatchStatus, string> = {
    active: 'bg-success/10 text-success',
    dispatched: 'bg-info/10 text-info',
    expired: 'bg-destructive/10 text-destructive',
    quarantined: 'bg-warning/10 text-warning',
  };

  const formatBatchDate = (dateStr?: string) => {
    if (!dateStr) return 'Unknown date';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return 'Unknown date';
    return format(date, 'dd MMM yyyy');
  };

  const filteredBatches = batches?.data?.filter((batch: Batch) => {
    const matchesSearch =
      batch.batchNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.drug?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || batch.status === selectedStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  const isExpiring = (expiryDate: string) => {
    const days = Math.ceil(
      (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return days < 30 && days > 0;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Batch Management</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage pharmaceutical batches</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowBatchModal(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Batch
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search batch number or drug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-4 py-2 rounded-md border border-input bg-background text-foreground"
            >
              <option value="all">All Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Batches Table */}
      <Card>
        <CardHeader>
          <CardTitle>Batches ({batches?.meta?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left text-muted-foreground font-medium">
                  <th className="pb-3 px-4">Batch No.</th>
                  <th className="pb-3 px-4">Drug</th>
                  <th className="pb-3 px-4">Quantity</th>
                  <th className="pb-3 px-4">Expiry</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
                    </tr>
                  ))
                ) : filteredBatches.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No batches found
                    </td>
                  </tr>
                ) : (
                  filteredBatches.map((batch: Batch) => (
                    <tr key={batch.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-foreground">{batch.batchNo}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-foreground">{batch.drug?.name}</p>
                          <p className="text-xs text-muted-foreground">{batch.drug?.manufacturer}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-foreground">{batch.quantity}</td>
                      <td className="py-3 px-4">
                        <div className="text-foreground">
                          {formatBatchDate(batch.expiryDate)}
                          {isExpiring(batch.expiryDate) && (
                            <p className="text-xs text-warning flex items-center gap-1 mt-1">
                              <AlertCircle className="w-3 h-3" />
                              Expiring soon
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={batch.status as any}>
                          {batch.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {batch.status === 'active' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            icon={<Truck className="w-3 h-3" />}
                            onClick={() => dispatchMutation.mutate({ id: batch.id, data: { quantity: batch.quantity, destination: 'Default Warehouse', prescriptionRef: '' } })}
                          >
                            Dispatch
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {batches && batches.meta?.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Page {filters.page} of {batches.meta?.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filters.page === 1}
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filters.page === batches.meta?.totalPages}
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <BatchModal
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
}
