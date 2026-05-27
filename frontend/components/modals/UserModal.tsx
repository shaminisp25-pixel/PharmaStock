'use client';

import React, { useState, useEffect } from 'react';
import { useCreateUser, useUpdateUser } from '@/services/hooks';
import { User, UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: User;
}

const ROLES: UserRole[] = ['admin', 'pharmacist', 'warehouse_staff', 'inspector'];

export function UserModal({ isOpen, onClose, onSuccess, user }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'warehouse_staff' as UserRole,
  });

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'warehouse_staff',
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user) {
        await updateMutation.mutateAsync({
          id: user.id,
          data: {
            name: formData.name,
            email: formData.email,
            role: formData.role,
          },
        });
      } else {
        if (!formData.password) {
          alert('Password is required for new users');
          return;
        }
        await createMutation.mutateAsync({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{user ? 'Edit User' : 'Add New User'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full name"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email address"
                className="mt-1"
              />
            </div>

            {!user && (
              <div>
                <label className="text-sm font-medium text-foreground">Password</label>
                <Input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Password"
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full mt-1 p-2 border border-input rounded-md text-foreground bg-background"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role.replace('_', ' ')}
                  </option>
                ))}
              </select>
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
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save User'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
