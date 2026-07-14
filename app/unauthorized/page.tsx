import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-500 mb-6 shadow-lg shadow-red-500/5">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">Access Denied</h1>
      <p className="text-zinc-400 mt-2 max-w-md text-sm">
        You do not have the required privileges to view this section. If you believe this is an error, please contact your administrator.
      </p>
      <div className="mt-8">
        <Link href="/dashboard">
          <Button variant="primary">Return to Dashboard</Button>
        </Link>
      </div>
    </main>
  );
}
