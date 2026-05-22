'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useERPSync, usePrescriptionVerify } from '@/services/reportHooks';
import { usePermission } from '@/services/hooks';
import { Database, Pill, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface SyncStatus {
  syncId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  message: string;
}

export default function IntegrationPage() {
  // Permission checks
  const canAccessERP = usePermission('integration:erp');
  const canAccessPrescription = usePermission('integration:prescription');

  // State
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [prescriptionId, setPrescriptionId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [medicineIds, setMedicineIds] = useState<string[]>([]);

  // Mutations
  const { mutate: syncERP, isPending: isSyncing } = useERPSync();
  const { mutate: verifyPrescription, isPending: isVerifying } = usePrescriptionVerify();

  // Handlers
  const handleERPSync = (syncType: 'INVENTORY' | 'ORDERS' | 'BATCHES') => {
    syncERP(
      {
        syncType,
        data: {},
      },
      {
        onSuccess: (data) => {
          setSyncStatus(data);
          toast.success(`${syncType} sync initiated`);
        },
        onError: (error: any) => {
          const message = error.response?.data?.message || 'Sync failed';
          toast.error(message);
        },
      }
    );
  };

  const handlePrescriptionVerify = () => {
    if (!prescriptionId || !patientId || medicineIds.length === 0) {
      toast.error('Please fill all prescription fields');
      return;
    }

    verifyPrescription(
      {
        prescriptionId,
        patientId,
        medicineIds,
      },
      {
        onSuccess: () => {
          toast.success('Prescription verified successfully');
          setPrescriptionId('');
          setPatientId('');
          setMedicineIds([]);
        },
        onError: (error: any) => {
          const message = error.response?.data?.message || 'Verification failed';
          toast.error(message);
        },
      }
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
        <p className="text-muted-foreground mt-1">Connect with external systems and services.</p>
      </div>

      {/* Permission Check */}
      {!canAccessERP && !canAccessPrescription && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-sm text-destructive">
                You don't have permission to access integrations. Contact an administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ERP Integration */}
      {canAccessERP && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              <div>
                <CardTitle>ERP System Integration</CardTitle>
                <CardDescription>Sync data with your ERP system</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {syncStatus && (
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">Sync Status</p>
                    <p className="text-xs text-muted-foreground mt-1">ID: {syncStatus.syncId}</p>
                  </div>
                  <Badge
                    variant={
                      syncStatus.status === 'completed'
                        ? 'default'
                        : syncStatus.status === 'failed'
                          ? 'destructive'
                          : 'warning'
                    }
                  >
                    {syncStatus.status}
                  </Badge>
                </div>
                <p className="text-sm mt-2">{syncStatus.message}</p>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Select what to sync:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleERPSync('INVENTORY')}
                  disabled={isSyncing}
                  className="h-auto py-3 flex flex-col items-center gap-2"
                >
                  {isSyncing ? <Loader className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                  <span className="text-xs">Inventory Sync</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleERPSync('ORDERS')}
                  disabled={isSyncing}
                  className="h-auto py-3 flex flex-col items-center gap-2"
                >
                  {isSyncing ? <Loader className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                  <span className="text-xs">Orders Sync</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleERPSync('BATCHES')}
                  disabled={isSyncing}
                  className="h-auto py-3 flex flex-col items-center gap-2"
                >
                  {isSyncing ? <Loader className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                  <span className="text-xs">Batches Sync</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prescription Verification */}
      {canAccessPrescription && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5" />
              <div>
                <CardTitle>Prescription Verification</CardTitle>
                <CardDescription>Verify prescriptions from external prescription systems</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Prescription ID</label>
                <Input
                  placeholder="Enter prescription ID"
                  value={prescriptionId}
                  onChange={(e) => setPrescriptionId(e.target.value)}
                  disabled={isVerifying}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Patient ID</label>
                <Input
                  placeholder="Enter patient ID"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  disabled={isVerifying}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Medicine IDs (comma separated)</label>
                <Input
                  placeholder="Enter medicine IDs, separated by commas"
                  value={medicineIds.join(', ')}
                  onChange={(e) =>
                    setMedicineIds(e.target.value.split(',').map(id => id.trim()).filter(Boolean))
                  }
                  disabled={isVerifying}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handlePrescriptionVerify}
              disabled={isVerifying || !prescriptionId || !patientId || medicineIds.length === 0}
              isLoading={isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify Prescription'}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Integration Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Integration Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              ERP System Integration
            </h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>Synchronize inventory data with your ERP system</li>
              <li>Sync purchase orders and batch information</li>
              <li>Ensure data consistency across systems</li>
              <li>Real-time sync status monitoring</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              Prescription Verification
            </h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>Verify prescriptions from external prescription systems</li>
              <li>Check medicine validity and availability</li>
              <li>Automated compliance checks</li>
              <li>Integration with pharmacy network systems</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}