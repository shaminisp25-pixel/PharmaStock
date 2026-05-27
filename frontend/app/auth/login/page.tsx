'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/services/hooks';
import { useAuthStore } from '@/store';
import { AuthManager } from '@/lib/authManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Pill } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login: loginUser } = useAuthStore();
  const loginMutation = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    const isAuthenticated = AuthManager.hasValidSession();
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [router]);

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      
      // Update Zustand store
      loginUser(response);
      
      // Store token using AuthManager
      AuthManager.setTokens(response.accessToken);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Pill className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">PharmaStock</span>
          </div>
        </div>

        {/* Card */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your pharmacy account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="admin@pharmastock.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={loginMutation.isPending}
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Demo credentials: admin@pharmastock.com / SecurePass123!
        </p>
      </div>
    </div>
  );
}
