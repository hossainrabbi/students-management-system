'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordInput } from '@/lib/validations/auth';
import { useResetPasswordMutation } from '../authApi';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      toast.error('Reset token is missing from the URL. Please request a new reset link.');
      return;
    }
    try {
      const response = await resetPassword({ token, body: { password: data.password, confirmPassword: data.confirmPassword } }).unwrap();
      if (response.success) {
        toast.success(response.message);
        router.push('/login');
      }
    } catch (err: any) {
      console.error('Reset password submit error:', err);
      toast.error(err?.data?.message || 'Password reset failed. Token may be invalid or expired.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="New Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        icon={<Lock className="h-4 w-4" />}
        {...register('password')}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        icon={<Lock className="h-4 w-4" />}
        {...register('confirmPassword')}
      />

      <Button type="submit" variant="primary" className="w-full mt-2 py-3" loading={isLoading}>
        Reset Password
      </Button>

      <div className="text-center pt-2">
        <Link
          href="/login"
          className="inline-flex items-center text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
          Back to login
        </Link>
      </div>
    </form>
  );
}
