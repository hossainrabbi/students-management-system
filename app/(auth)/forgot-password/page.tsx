import React from 'react';
import ForgotPasswordForm from '../../../features/auth/components/ForgotPasswordForm';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { GraduationCap } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4">
      {/* Background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Subtle grid backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370e_1px,transparent_1px),linear-gradient(to_bottom,#1f29370e_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 mb-4 shadow-2xl">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">School ERP System</h1>
        </div>

        <Card className="border-zinc-800/80 bg-zinc-900/40">
          <CardHeader className="text-center pt-8 border-b-0 pb-0">
            <h2 className="text-xl font-semibold text-zinc-200">Forgot Password?</h2>
            <p className="text-xs text-zinc-500 mt-1">Enter your email and we will send you a reset link</p>
          </CardHeader>
          <CardContent className="pt-6">
            <ForgotPasswordForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
