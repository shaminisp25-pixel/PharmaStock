'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Card } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [localError, setLocalError] = React.useState('');

  React.useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setLocalError('Please enter a valid email address');
      return;
    }

    try {
      await login(email, password);
      // Redirect to dashboard on successful login
      router.push('/dashboard');
    } catch (err) {
      setLocalError(error || 'Login failed');
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
            Pharmaceutical Warehouse Management System
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-text-primary mb-1">Welcome Back</h2>
          <p className="text-text-secondary text-sm mb-6">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              placeholder="john@pharmastock.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Error Message */}
            {(localError || error) && (
              <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
                <p className="text-sm text-danger-700">{localError || error}</p>
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border cursor-pointer"
                />
                <span className="text-text-secondary">Remember me</span>
              </label>
              <Link
                href="#"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              variant="primary"
              type="submit"
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-text-muted text-xs">OR</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Demo Logins */}
          <div className="space-y-2 mb-6">
            <p className="text-xs text-text-muted text-center mb-3">Demo Accounts</p>
            {[
              { role: 'Manager', email: 'john@pharmastock.com', pwd: 'password123' },
              { role: 'Officer', email: 'sarah@pharmastock.com', pwd: 'password123' },
            ].map((demo, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setEmail(demo.email);
                  setPassword(demo.pwd);
                }}
                className="w-full p-2 text-xs border border-border rounded-lg hover:bg-off-white transition-colors text-text-secondary"
              >
                Try as {demo.role}
              </button>
            ))}
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign up here
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
