'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, Select } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'officer',
    warehouse: 'main',
  });
  const [localError, setLocalError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccess(false);

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      setLocalError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.warehouse === 'main' ? undefined : formData.warehouse,
      );
      setSuccess(true);
      // Redirect to dashboard after successful registration
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      setLocalError(error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 mb-2">
            💊
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">PharmaStock</h1>
          <p className="text-text-secondary">
            Create your account to get started
          </p>
        </div>

        {/* Register Card */}
        <Card className="p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-text-primary mb-1">Create Account</h2>
          <p className="text-text-secondary text-sm mb-6">
            Join our warehouse management system
          </p>

          {success && (
            <div className="p-4 bg-success-50 border border-success-200 rounded-lg mb-6">
              <p className="text-sm text-success-700 font-medium">
                ✓ Registration successful! Redirecting to login...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <Input
              label="Full Name"
              placeholder="John Doe"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              placeholder="john@pharmastock.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            {/* Role Selection */}
            <Select
              label="Role"
              name="role"
              options={[
                { value: 'officer', label: 'Store Officer' },
                { value: 'manager', label: 'Pharmacy Manager' },
                { value: 'inspector', label: 'Inspector' },
              ]}
              value={formData.role}
              onChange={handleChange}
            />

            {/* Warehouse Selection */}
            <Select
              label="Assigned Warehouse"
              name="warehouse"
              options={[
                { value: 'main', label: 'Main Warehouse' },
                { value: 'storage-a', label: 'Storage A' },
                { value: 'storage-b', label: 'Storage B' },
              ]}
              value={formData.warehouse}
              onChange={handleChange}
            />

            {/* Error Message */}
            {(localError || error) && (
              <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
                <p className="text-sm text-danger-700">{localError || error}</p>
              </div>
            )}

            {/* Terms and Conditions */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border cursor-pointer mt-1"
                required
              />
              <span className="text-xs text-text-secondary">
                I agree to the{' '}
                <Link href="#" className="text-primary-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="text-primary-600 hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <Button
              variant="primary"
              type="submit"
              isLoading={isLoading}
              className="w-full mt-6"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-text-muted text-xs">OR</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in here
            </Link>
          </p>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-text-muted">
          <p>© 2024 PharmaStock. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
