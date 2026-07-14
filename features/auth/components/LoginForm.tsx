'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/validations/auth';
import { useLoginMutation } from '../authApi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await login(data).unwrap();
      if (response.success) {
        toast.success(`Welcome back, ${response.user.name}!`);
        router.refresh();
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Login submit error:', err);
      toast.error(err?.data?.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Email Address"
        type="email"
        placeholder="e.g. admin@school.com"
        error={errors.email?.message}
        icon={<Mail className="h-4 w-4" />}
        {...register('email')}
      />

      <div className="space-y-2">
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          icon={<Lock className="h-4 w-4" />}
          {...register('password')}
        />
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      <Button type="submit" variant="primary" className="w-full mt-2 py-3" loading={isLoading}>
        Sign In
      </Button>
    </form>
  );
}
