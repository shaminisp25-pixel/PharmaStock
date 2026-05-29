'use client';

import React, { useState, useEffect } from 'react';
import { useCreateDrug, useUpdateDrug } from '@/services/entityHooks';
import { Drug } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface DrugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  drug?: Drug;
}

export function DrugModal({ isOpen, onClose, onSuccess, drug }: DrugModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    category: '',
    tempMin: 2,
    tempMax: 8,
    composition: '',
    storageNotes: '',
  });

  const createMutation = useCreateDrug();
  const updateMutation = useUpdateDrug();

  useEffect(() => {
    if (drug) {
      setFormData({
        name: drug.name || '',
        manufacturer: drug.manufacturer || '',
        category: drug.category || '',
        tempMin: drug.tempMin || 2,
        tempMax: drug.tempMax || 8,
        composition: drug.composition || '',
        storageNotes: drug.storageNotes || '',
      });
    } else {
      setFormData({
        name: '',
        manufacturer: '',
        category: '',
        tempMin: 2,
        tempMax: 8,
        composition: '',
        storageNotes: '',
      });
    }
  }, [drug, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (drug) {
        await updateMutation.mutateAsync({
          id: drug.id,
          data: formData,
        });
        toast.success('Drug updated successfully');
      } else {
        await createMutation.mutateAsync(formData as any);
        toast.success('Drug created successfully');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Error saving drug';
      toast.error(message);
      console.error('Error saving drug:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card shadow-2xl border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-foreground">{drug ? 'Edit Drug' : 'Add New Drug'}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Drug Name</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Drug name"
                className="mt-1 bg-card text-foreground border-border"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Manufacturer</label>
              <Input
                required
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                placeholder="Manufacturer"
                className="mt-1 bg-card text-foreground border-border"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Category</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Antibiotic"
                className="mt-1 bg-card text-foreground border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Min Temp (°C)</label>
                <Input
                  type="number"
                  value={formData.tempMin}
                  onChange={(e) => setFormData({ ...formData, tempMin: parseFloat(e.target.value) })}
                  className="mt-1 bg-card text-foreground border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Max Temp (°C)</label>
                <Input
                  type="number"
                  value={formData.tempMax}
                  onChange={(e) => setFormData({ ...formData, tempMax: parseFloat(e.target.value) })}
                  className="mt-1 bg-card text-foreground border-border"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Composition</label>
              <textarea
                value={formData.composition}
                onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                placeholder="Drug composition details"
                className="w-full mt-1 p-2 border border-border rounded-md text-foreground bg-card"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Storage Notes</label>
              <textarea
                value={formData.storageNotes}
                onChange={(e) => setFormData({ ...formData, storageNotes: e.target.value })}
                placeholder="Storage and handling notes"
                className="w-full mt-1 p-2 border border-border rounded-md text-foreground bg-card"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Drug'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
