'use client';

import React, { useState, useEffect } from 'react';
import { useCreateWarehouse, useUpdateWarehouse } from '@/services/entityHooks';
import { Warehouse } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  warehouse?: Warehouse;
}

export function WarehouseModal({ isOpen, onClose, onSuccess, warehouse }: WarehouseModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: 0,
    tempMin: 2,
    tempMax: 8,
    contactPerson: '',
  });

  const createMutation = useCreateWarehouse();
  const updateMutation = useUpdateWarehouse();

  useEffect(() => {
    if (warehouse) {
      setFormData({
        name: warehouse.name || '',
        location: warehouse.location || '',
        capacity: warehouse.capacity || 0,
        tempMin: warehouse.tempMin || 2,
        tempMax: warehouse.tempMax || 8,
        contactPerson: warehouse.contactPerson || '',
      });
    } else {
      setFormData({
        name: '',
        location: '',
        capacity: 0,
        tempMin: 2,
        tempMax: 8,
        contactPerson: '',
      });
    }
  }, [warehouse, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (warehouse) {
        await updateMutation.mutateAsync({
          id: warehouse.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData as any);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving warehouse:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border shadow-2xl">
        <CardHeader className="border-b border-border">
          <CardTitle>{warehouse ? 'Edit Warehouse' : 'Add New Warehouse'}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Warehouse Name</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Warehouse name"
                className="mt-1 bg-card"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Location</label>
              <Input
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City/Address"
                className="mt-1 bg-card"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Capacity (units)</label>
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                placeholder="Storage capacity"
                className="mt-1 bg-card"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Min Temp (°C)</label>
                <Input
                  type="number"
                  value={formData.tempMin}
                  onChange={(e) => setFormData({ ...formData, tempMin: parseFloat(e.target.value) })}
                  className="mt-1 bg-card"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Max Temp (°C)</label>
                <Input
                  type="number"
                  value={formData.tempMax}
                  onChange={(e) => setFormData({ ...formData, tempMax: parseFloat(e.target.value) })}
                  className="mt-1 bg-card"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Contact Person</label>
              <Input
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Contact person name"
                className="mt-1 bg-card"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Warehouse'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
