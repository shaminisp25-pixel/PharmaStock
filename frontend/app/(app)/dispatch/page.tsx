'use client';

import React, { useState } from 'react';
import { useDispatchRecords } from '@/services/reportHooks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Truck, Plus } from 'lucide-react';
import { DispatchRecord } from '@/types';
import { format } from 'date-fns';

export default function DispatchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useDispatchRecords({ page, limit: 20 });

  const formatDispatchDate = (dateStr?: string) => {
    if (!dateStr) return 'Unknown date';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return 'Unknown date';
    return format(date, 'dd MMM yyyy');
  };

  const dispatches = response?.data || [];
  const filteredRecords = dispatches.filter(
    (record: DispatchRecord) =>
      record.batch?.batchNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.batch?.drug?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.destination.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dispatch Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage batch dispatches</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
          New Dispatch
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Dispatched</p>
            <p className="text-2xl font-bold mt-2">{response?.meta?.total || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold mt-2">
              {dispatches.filter((d: DispatchRecord) => {
                const dispatchDate = new Date(d.dispatchedAt);
                const now = new Date();
                return dispatchDate.getMonth() === now.getMonth() &&
                  dispatchDate.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Page</p>
            <p className="text-2xl font-bold mt-2">{page} of {response?.meta?.totalPages || 1}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search batch or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Dispatch Records */}
      <Card>
        <CardHeader>
          <CardTitle>Dispatch Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left text-muted-foreground font-medium">
                  <th className="pb-3 px-4">Batch No.</th>
                  <th className="pb-3 px-4">Drug</th>
                  <th className="pb-3 px-4">Destination</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
                    </tr>
                  ))
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No dispatch records found
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record: DispatchRecord) => (
                    <tr key={record.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-foreground">{record.batch?.batchNo || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-foreground">{record.batch?.drug?.name || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">{record.batch?.drug?.manufacturer || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-foreground">{record.destination}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {formatDispatchDate(record.dispatchedAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button size="sm" variant="ghost" icon={<Truck className="w-4 h-4" />}>
                          Track
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
