'use client';

import React from 'react';
import { useExpiryReport, useDispatchReport, useStockReport } from '@/services/reportHooks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, FileText } from 'lucide-react';

export default function ReportsPage() {
  const expiryReportMutation = useExpiryReport();
  const dispatchReportMutation = useDispatchReport();
  const { data: stockReport, isLoading: stockLoading } = useStockReport();

  const handleDownloadReport = async (mutationFn: () => Promise<any>, filename: string) => {
    try {
      const blob = await mutationFn();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground mt-1">Generate and download system reports</p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Expiry Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Expiry Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Get a comprehensive list of all expiring and expired batches
            </p>
            <Button
              variant="primary"
              className="w-full"
              icon={<Download className="w-4 h-4" />}
              isLoading={expiryReportMutation.isPending}
              onClick={() => handleDownloadReport(() => expiryReportMutation.mutateAsync(), 'expiry-report.csv')}
            >
              Download CSV
            </Button>
          </CardContent>
        </Card>

        {/* Dispatch Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Dispatch Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View all dispatch records and transaction history
            </p>
            <Button
              variant="primary"
              className="w-full"
              icon={<Download className="w-4 h-4" />}
              isLoading={dispatchReportMutation.isPending}
              onClick={() => handleDownloadReport(() => dispatchReportMutation.mutateAsync(), 'dispatch-report.csv')}
            >
              Download CSV
            </Button>
          </CardContent>
        </Card>

        {/* Stock Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Stock Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Current stock status and inventory levels
            </p>
            <Button variant="primary" className="w-full" icon={<Download className="w-4 h-4" />}>
              View Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stock Summary */}
      {stockReport && (
        <Card>
          <CardHeader>
            <CardTitle>Stock Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {stockLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Stock Value</p>
                  <p className="text-2xl font-bold mt-2">$125,430</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground">Low Stock Items</p>
                  <p className="text-2xl font-bold mt-2 text-warning">12</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                  <p className="text-2xl font-bold mt-2 text-destructive">5</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
