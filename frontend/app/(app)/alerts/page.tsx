'use client';

import React, { useState } from 'react';
import { useAlerts, useResolveAlert } from '@/services/entityHooks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { AlertFilters, AlertType, Alert } from '@/types';
import { format } from 'date-fns';

export default function AlertsPage() {
  const [filters, setFilters] = useState<AlertFilters>({ page: 1, limit: 50 });
  const [selectedType, setSelectedType] = useState<AlertType | 'all'>('all');
  const [showResolved, setShowResolved] = useState(false);

  const { data: alerts, isLoading, refetch } = useAlerts(filters);
  const resolveAlertMutation = useResolveAlert();

  const alertTypes: AlertType[] = ['near_expiry', 'expired', 'low_stock', 'temp_breach'];
  const typeIcons: Record<AlertType, React.ReactNode> = {
    near_expiry: <Clock className="w-5 h-5 text-warning" />,
    expired: <AlertCircle className="w-5 h-5 text-destructive" />,
    low_stock: <AlertCircle className="w-5 h-5 text-warning" />,
    temp_breach: <AlertCircle className="w-5 h-5 text-destructive" />,
  };

  const typeLabels: Record<AlertType, string> = {
    near_expiry: 'Near Expiry',
    expired: 'Expired',
    low_stock: 'Low Stock',
    temp_breach: 'Temperature Breach',
  };

  const formatAlertDate = (dateStr?: string) => {
    if (!dateStr) return 'Unknown time';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return 'Unknown time';
    return format(date, 'dd MMM yyyy, HH:mm');
  };

  const filteredAlerts = alerts?.data?.filter((alert: Alert) => {
    const matchesType = selectedType === 'all' || alert.alertType === selectedType;
    const matchesResolved = showResolved ? alert.resolved : !alert.resolved;
    return matchesType && matchesResolved;
  }) || [];

  const handleResolve = async (alertId: string) => {
    await resolveAlertMutation.mutateAsync(alertId);
    refetch();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Alerts</h1>
        <p className="text-muted-foreground mt-1">Monitor system alerts and take action</p>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!showResolved ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowResolved(false)}
            >
              Active ({alerts?.data?.filter((a: Alert) => !a.resolved).length || 0})
            </Button>
            <Button
              variant={showResolved ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowResolved(true)}
            >
              Resolved ({alerts?.data?.filter((a: Alert) => a.resolved).length || 0})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alert Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => setSelectedType('all')}
        >
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">All Alerts</p>
            <p className="text-2xl font-bold mt-2">{alerts?.meta?.total || 0}</p>
          </CardContent>
        </Card>
        {alertTypes.map((type) => (
          <Card
            key={type}
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setSelectedType(type)}
          >
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{typeLabels[type]}</p>
              <p className="text-2xl font-bold mt-2">
                {alerts?.data?.filter((a: Alert) => a.alertType === type).length || 0}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 p-4 border border-border rounded-lg">
                  <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
            ) : filteredAlerts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground">No alerts to display</p>
              </div>
            ) : (
              filteredAlerts.map((alert: Alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-4 p-4 border rounded-lg transition-colors ${
                    alert.resolved ? 'border-border bg-muted/30' : 'border-warning/30 bg-warning/5'
                  }`}
                >
                  <div className="p-2 rounded-lg flex-shrink-0">
                    {typeIcons[alert.alertType]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{alert.message}</p>
                      <Badge variant={alert.resolved ? 'default' : alert.alertType.includes('expired') ? 'destructive' : 'warning'}>
                        {typeLabels[alert.alertType]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {alert.batch?.drug?.name} • Batch: {alert.batch?.batchNo}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatAlertDate(alert.createdAt)}
                    </p>
                  </div>
                  {!alert.resolved && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleResolve(alert.id)}
                      icon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
