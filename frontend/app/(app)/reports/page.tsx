'use client';

import React, { useState } from 'react';
import { useBatches, useAlerts, useDrugs, useWarehouses } from '@/services/entityHooks';
import { useAuditLogs, useImportLogs } from '@/services/reportHooks';
import { useStockReport } from '@/services/reportHooks';
import { Batch, Drug, Alert, ImportLog, AuditLog } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, FileText, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { generateCSV, generatePDF, generateExcel, downloadFile, ExportData } from '@/lib/exportUtils';

export default function ReportsPage() {
  const [exportingReport, setExportingReport] = useState<string | null>(null);

  // Helper to safely format dates
  const formatDate = (date: any) => {
    try {
      if (!date) return 'N/A';
      const d = new Date(date);
      if (isNaN(d.getTime())) return 'N/A';
      return d.toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  // Helper to safely format datetime
  const formatDateTime = (date: any) => {
    try {
      if (!date) return 'N/A';
      const d = new Date(date);
      if (isNaN(d.getTime())) return 'N/A';
      return d.toLocaleString();
    } catch {
      return 'N/A';
    }
  };

  // Fetch all necessary data
  const { data: batches, isLoading: batchesLoading } = useBatches({ limit: 1000 });
  const { data: alerts, isLoading: alertsLoading } = useAlerts({ limit: 1000 });
  const { data: drugs, isLoading: drugsLoading } = useDrugs({ limit: 1000 });
  const { data: warehouses, isLoading: warehousesLoading } = useWarehouses({ limit: 1000 });
  const { data: auditLogs, isLoading: auditLoading } = useAuditLogs({ limit: 1000 });
  const { data: importLogs, isLoading: importLoading } = useImportLogs({ limit: 1000 });
  const { data: stockReport, isLoading: stockLoading } = useStockReport();

  // Generate Expiry Report
  const generateExpiryReport = async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      setExportingReport(`expiry-${format}`);
      
      const expiringBatches = batches?.data?.filter((b: Batch) => {
        try {
          const expDate = new Date(b.expiryDate);
          if (isNaN(expDate.getTime())) return false;
          const daysToExpiry = Math.ceil((expDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          return daysToExpiry <= 30 && daysToExpiry > 0;
        } catch {
          return false;
        }
      }) || [];

      const expiredBatches = batches?.data?.filter((b: Batch) => b.status === 'expired') || [];

      const data: ExportData = {
        headers: ['Batch No', 'Drug Name', 'Manufacturer', 'Warehouse', 'Quantity', 'Expiry Date', 'Status', 'Days to Expiry'],
        rows: [
          ...expiringBatches.map((b: Batch) => {
            const expDate = new Date(b.expiryDate);
            const daysToExpiry = isNaN(expDate.getTime()) ? 0 : Math.ceil((expDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            return [
              b.batchNo,
              b.drug?.name || 'N/A',
              b.drug?.manufacturer || 'N/A',
              b.warehouse?.name || 'N/A',
              b.quantity,
              formatDate(b.expiryDate),
              'Expiring Soon',
              daysToExpiry,
            ];
          }),
          ...expiredBatches.map((b: Batch) => [
            b.batchNo,
            b.drug?.name || 'N/A',
            b.drug?.manufacturer || 'N/A',
            b.warehouse?.name || 'N/A',
            b.quantity,
            formatDate(b.expiryDate),
            'Expired',
            0,
          ]),
        ],
      };

      let blob: Blob;
      if (format === 'csv') {
        blob = generateCSV(data);
      } else if (format === 'pdf') {
        blob = await generatePDF(data, 'Expiry Report');
      } else {
        blob = await generateExcel(data, 'Expiry Report');
      }

      downloadFile(blob, `expiry-report-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : format}`);
      toast.success(`Expiry report exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export expiry report');
      console.error(error);
    } finally {
      setExportingReport(null);
    }
  };

  // Generate Stock Report
  const generateStockReportExport = async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      setExportingReport(`stock-${format}`);

      const data: ExportData = {
        headers: ['Drug Name', 'Manufacturer', 'Total Batches', 'Total Quantity', 'Warehouses', 'Category'],
        rows: (drugs?.data || []).map((drug: Drug) => [
          drug.name,
          drug.manufacturer,
          batches?.data?.filter((b: Batch) => b.drugId === drug.id).length || 0,
          batches?.data?.filter((b: Batch) => b.drugId === drug.id).reduce((sum: number, b: Batch) => sum + b.quantity, 0) || 0,
          warehouses?.data?.length || 0,
          drug.category || 'N/A',
        ]),
      };

      let blob: Blob;
      if (format === 'csv') {
        blob = generateCSV(data);
      } else if (format === 'pdf') {
        blob = await generatePDF(data, 'Stock Report');
      } else {
        blob = await generateExcel(data, 'Stock Report');
      }

      downloadFile(blob, `stock-report-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : format}`);
      toast.success(`Stock report exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export stock report');
      console.error(error);
    } finally {
      setExportingReport(null);
    }
  };

  // Generate Alerts Report
  const generateAlertsReport = async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      setExportingReport(`alerts-${format}`);

      const data: ExportData = {
        headers: ['Alert Type', 'Batch No', 'Drug Name', 'Message', 'Status', 'Created At'],
        rows: (alerts?.data || []).map((alert: Alert) => [
          alert.alertType,
          alert.batch?.batchNo || 'N/A',
          alert.batch?.drug?.name || 'N/A',
          alert.message || 'N/A',
          alert.resolved ? 'Resolved' : 'Active',
          new Date(alert.createdAt).toLocaleString(),
        ]),
      };

      let blob: Blob;
      if (format === 'csv') {
        blob = generateCSV(data);
      } else if (format === 'pdf') {
        blob = await generatePDF(data, 'Alerts Report');
      } else {
        blob = await generateExcel(data, 'Alerts Report');
      }

      downloadFile(blob, `alerts-report-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : format}`);
      toast.success(`Alerts report exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export alerts report');
      console.error(error);
    } finally {
      setExportingReport(null);
    }
  };

  // Generate Audit Report
  const generateAuditReport = async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      setExportingReport(`audit-${format}`);

      const data: ExportData = {
        headers: ['User', 'Action', 'Entity Type', 'Entity ID', 'Changes', 'Timestamp'],
        rows: (auditLogs?.data || []).map((log: AuditLog & { user?: { name: string } }) => [
          log.user?.name || 'N/A',
          log.action,
          log.entityType,
          log.entityId,
          JSON.stringify(log.changes || {}),
          new Date(log.createdAt).toLocaleString(),
        ]),
      };

      let blob: Blob;
      if (format === 'csv') {
        blob = generateCSV(data);
      } else if (format === 'pdf') {
        blob = await generatePDF(data, 'Audit Report');
      } else {
        blob = await generateExcel(data, 'Audit Report');
      }

      downloadFile(blob, `audit-report-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : format}`);
      toast.success(`Audit report exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export audit report');
      console.error(error);
    } finally {
      setExportingReport(null);
    }
  };

  const isExporting = exportingReport !== null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground mt-1">Generate and download comprehensive system reports in multiple formats</p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              Get a list of expiring and expired batches with days to expiry
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                icon={isExporting && exportingReport?.startsWith('expiry') ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                disabled={isExporting}
                onClick={() => generateExpiryReport('csv')}
              >
                Download as CSV
              </Button>
              <Button
                variant="outline"
                className="w-full"
                icon={isExporting && exportingReport?.startsWith('expiry') ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                disabled={isExporting}
                onClick={() => generateExpiryReport('pdf')}
              >
                Download as PDF
              </Button>
              <Button
                variant="outline"
                className="w-full"
                icon={isExporting && exportingReport?.startsWith('expiry') ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                disabled={isExporting}
                onClick={() => generateExpiryReport('excel')}
              >
                Download as Excel
              </Button>
            </div>
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
              Current stock status and inventory levels by drug
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                icon={isExporting && exportingReport?.startsWith('stock') ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                disabled={isExporting || drugsLoading}
                onClick={() => generateStockReportExport('csv')}
              >
                Download as CSV
              </Button>
              <Button
                variant="outline"
                className="w-full"
                icon={isExporting && exportingReport?.startsWith('stock') ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                disabled={isExporting || drugsLoading}
                onClick={() => generateStockReportExport('pdf')}
              >
                Download as PDF
              </Button>
              <Button
                variant="outline"
                className="w-full"
                icon={isExporting && exportingReport?.startsWith('stock') ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                disabled={isExporting || drugsLoading}
                onClick={() => generateStockReportExport('excel')}
              >
                Download as Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Alerts Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              All system alerts with status and creation dates
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                icon={isExporting && exportingReport?.startsWith('alerts') ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                disabled={isExporting || alertsLoading}
                onClick={() => generateAlertsReport('csv')}
              >
                Download as CSV
              </Button>
              <Button
                variant="outline"
                className="w-full"
                icon={isExporting && exportingReport?.startsWith('alerts') ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                disabled={isExporting || alertsLoading}
                onClick={() => generateAlertsReport('pdf')}
              >
                Download as PDF
              </Button>
              <Button
                variant="outline"
                className="w-full"
                icon={isExporting && exportingReport?.startsWith('alerts') ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                disabled={isExporting || alertsLoading}
                onClick={() => generateAlertsReport('excel')}
              >
                Download as Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audit Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Audit Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              System activity and user action history
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                icon={isExporting && exportingReport?.startsWith('audit') ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                disabled={isExporting || auditLoading}
                onClick={() => generateAuditReport('csv')}
              >
                Download as CSV
              </Button>
              <Button
                variant="outline"
                className="w-full"
                icon={isExporting && exportingReport?.startsWith('audit') ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                disabled={isExporting || auditLoading}
                onClick={() => generateAuditReport('pdf')}
              >
                Download as PDF
              </Button>
              <Button
                variant="outline"
                className="w-full"
                icon={isExporting && exportingReport?.startsWith('audit') ? <Loader className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                disabled={isExporting || auditLoading}
                onClick={() => generateAuditReport('excel')}
              >
                Download as Excel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Batches</p>
              {batchesLoading ? (
                <Skeleton className="h-8 w-20 mt-2" />
              ) : (
                <p className="text-2xl font-bold text-foreground mt-2">{batches?.meta?.total || 0}</p>
              )}
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">Active Alerts</p>
              {alertsLoading ? (
                <Skeleton className="h-8 w-20 mt-2" />
              ) : (
                <p className="text-2xl font-bold text-warning mt-2">
                  {alerts?.data?.filter((a: Alert) => !a.resolved).length || 0}
                </p>
              )}
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Drugs</p>
              {drugsLoading ? (
                <Skeleton className="h-8 w-20 mt-2" />
              ) : (
                <p className="text-2xl font-bold text-primary mt-2">{drugs?.meta?.total || 0}</p>
              )}
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">Warehouses</p>
              {warehousesLoading ? (
                <Skeleton className="h-8 w-20 mt-2" />
              ) : (
                <p className="text-2xl font-bold text-success mt-2">{warehouses?.meta?.total || 0}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
