'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordInput } from '@/lib/validations/auth';
import { useForgotPasswordMutation } from '../authApi';
import { toast } from 'sonner';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      const response = await forgotPassword(data).unwrap();
      if (response.success) {
        toast.success(response.message);
      }
    } catch (err: any) {
      console.error('Forgot password submit error:', err);
      toast.error(err?.data?.message || 'Failed to send password reset request.');
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

      <Button type="submit" variant="primary" className="w-full mt-2 py-3" loading={isLoading}>
        Send Reset Link
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
