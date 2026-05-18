'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Alert, Input } from '@/components/ui/index';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'WAREHOUSE_STAFF',
  });

  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setLocalError('All fields are required');
      return false;
    }

    if (formData.name.length < 3) {
      setLocalError('Name must be at least 3 characters');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setLocalError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return false;
    }

    if (!/(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) {
      setLocalError('Password must contain uppercase letter and number');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return false;
    }

    if (!agreeTerms) {
      setLocalError('You must agree to the terms');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!validateForm()) return;

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );

      setSuccess(true);

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : error || 'Registration failed';
      setLocalError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg via-bg-secondary to-bg p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">PharmaStock</h1>
          <p className="text-text-secondary">Create your account</p>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Sign Up</h2>

          {success && (
            <Alert type="success" title="Success">
              Account created! Redirecting...
            </Alert>
          )}

          {(localError || error) && (
            <Alert type="danger" title="Error">
              {localError || error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />

            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            <div className="relative">
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-sm"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="WAREHOUSE_STAFF">Warehouse Staff</option>
              <option value="PHARMACIST">Pharmacist</option>
              <option value="INSPECTOR">Inspector</option>
            </select>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              I agree to Terms & Privacy Policy
            </label>

            <Button
              type="submit"
              disabled={isLoading || !agreeTerms}
              className="w-full"
            >
              {isLoading ? 'Creating...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-primary">
              Login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}