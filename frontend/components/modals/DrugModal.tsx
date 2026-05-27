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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-md bg-white shadow-lg border border-gray-200">
        <CardHeader className="bg-white border-b border-gray-200">
          <CardTitle className="text-gray-900">{drug ? 'Edit Drug' : 'Add New Drug'}</CardTitle>
        </CardHeader>
        <CardContent className="bg-white pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Drug Name</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Drug name"
                className="mt-1 bg-white text-gray-900 border-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Manufacturer</label>
              <Input
                required
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                placeholder="Manufacturer"
                className="mt-1 bg-white text-gray-900 border-gray-300"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Category</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Antibiotic"
                className="mt-1 bg-white text-gray-900 border-gray-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Min Temp (°C)</label>
                <Input
                  type="number"
                  value={formData.tempMin}
                  onChange={(e) => setFormData({ ...formData, tempMin: parseFloat(e.target.value) })}
                  className="mt-1 bg-white text-gray-900 border-gray-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Max Temp (°C)</label>
                <Input
                  type="number"
                  value={formData.tempMax}
                  onChange={(e) => setFormData({ ...formData, tempMax: parseFloat(e.target.value) })}
                  className="mt-1 bg-white text-gray-900 border-gray-300"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Composition</label>
              <textarea
                value={formData.composition}
                onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                placeholder="Drug composition details"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Storage Notes</label>
              <textarea
                value={formData.storageNotes}
                onChange={(e) => setFormData({ ...formData, storageNotes: e.target.value })}
                placeholder="Storage and handling notes"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={onClose} type="button" className="text-gray-700 border-gray-300">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-blue-600 text-white hover:bg-blue-700"
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
