'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Alert, Input } from '@/components/ui/index';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    if (!email || !password) {
      setLocalError('All fields are required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
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
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setLocalError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-bg-secondary to-bg flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10" />
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4 shadow-lg">
            <span className="text-3xl">💊</span>
          </div>
          <h1 className="text-4xl font-bold text-text mb-2">PharmaStock</h1>
          <p className="text-text-secondary text-lg">Professional Pharmacy Management</p>
        </div>

        {/* Main card */}
        <Card className="p-8 mb-6 border-2 border-primary/10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text mb-2">Welcome Back</h2>
            <p className="text-text-secondary">Sign in to access your account</p>
          </div>

          {/* Alerts */}
          {(localError || error) && (
            <Alert type="danger" title="Login Error" dismissible onDismiss={() => setLocalError('')} className="mb-4">
              {localError || error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">Email Address</label>
              <Input
                type="email"
                placeholder="admin@pharmastock.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLocalError('');
                }}
                className="w-full"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLocalError('');
                  }}
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-text-secondary hover:text-text transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" />
                <span className="text-sm text-text-secondary">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary hover:text-primary-light font-semibold">
                Forgot password?
              </a>
            </div>

            {/* Submit button */}
            <Button
              onClick={handleSubmit}
              variant="primary"
              className="w-full h-12 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-text-secondary">Demo Credentials</span>
            </div>
          </div>

          {/* Demo credentials hint */}
          <div className="bg-stat-cyan rounded-lg p-4 mb-4 border border-primary/20">
            <p className="text-xs text-text-secondary font-semibold mb-2">📧 Email</p>
            <p className="text-sm font-mono text-text mb-3">admin@pharmastock.com</p>
            <p className="text-xs text-text-secondary font-semibold mb-2">🔐 Password</p>
            <p className="text-sm font-mono text-text">SecurePass123!</p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-text-secondary mb-4">
            Don't have an account?{' '}
            <a href="/register" className="text-primary hover:text-primary-light font-semibold transition-colors">
              Sign up here
            </a>
          </p>
          <p className="text-xs text-text-tertiary">
            © 2026 PharmaStock. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
