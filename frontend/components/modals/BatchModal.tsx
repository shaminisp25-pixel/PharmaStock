'use client';

import React, { useState, useEffect } from 'react';
import { useCreateBatch } from '@/services/entityHooks';
import { useDrugs, useWarehouses } from '@/services/entityHooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BatchModal({ isOpen, onClose, onSuccess }: BatchModalProps) {
  const [formData, setFormData] = useState({
    batchNo: '',
    drugId: '',
    warehouseId: '',
    quantity: 0,
    expiryDate: '',
    tempMin: 2,
    tempMax: 8,
    storageNotes: '',
  });

  const { data: drugs } = useDrugs({ limit: 1000 });
  const { data: warehouses } = useWarehouses({ limit: 1000 });
  const createMutation = useCreateBatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        batchNo: formData.batchNo,
        drugId: formData.drugId,
        warehouseId: formData.warehouseId,
        quantity: formData.quantity,
        expiryDate: formData.expiryDate,
        tempMin: formData.tempMin,
        tempMax: formData.tempMax,
        storageNotes: formData.storageNotes,
      } as any);
      setFormData({
        batchNo: '',
        drugId: '',
        warehouseId: '',
        quantity: 0,
        expiryDate: '',
        tempMin: 2,
        tempMax: 8,
        storageNotes: '',
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating batch:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center overflow-y-auto p-4">
      <Card className="w-full max-w-md my-8 bg-card border-border shadow-2xl">
        <CardHeader className="border-b border-border">
          <CardTitle>Add New Batch</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Batch Number</label>
              <Input
                required
                value={formData.batchNo}
                onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })}
                placeholder="e.g., B001"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Drug</label>
              <select
                required
                value={formData.drugId}
                onChange={(e) => setFormData({ ...formData, drugId: e.target.value })}
                className="w-full mt-1 p-2 border border-input rounded-md text-foreground bg-card"
              >
                <option value="">Select a drug</option>
                {drugs?.data?.map((drug) => (
                  <option key={drug.id} value={drug.id}>
                    {drug.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Warehouse</label>
              <select
                required
                value={formData.warehouseId}
                onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                className="w-full mt-1 p-2 border border-input rounded-md text-foreground bg-card"
              >
                <option value="">Select a warehouse</option>
                {warehouses?.data?.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Quantity</label>
              <Input
                required
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                placeholder="Quantity"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Expiry Date</label>
              <Input
                required
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Min Temp (°C)</label>
                <Input
                  type="number"
                  value={formData.tempMin}
                  onChange={(e) => setFormData({ ...formData, tempMin: parseFloat(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Max Temp (°C)</label>
                <Input
                  type="number"
                  value={formData.tempMax}
                  onChange={(e) => setFormData({ ...formData, tempMax: parseFloat(e.target.value) })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Storage Notes</label>
              <textarea
                value={formData.storageNotes}
                onChange={(e) => setFormData({ ...formData, storageNotes: e.target.value })}
                placeholder="Storage instructions"
                className="w-full mt-1 p-2 border border-input rounded-md text-foreground bg-card"
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating...' : 'Create Batch'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
