'use client';

import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../services/store';
import { Toaster } from 'sonner';
import { useGetMeQuery } from '../features/auth/authApi';

function AppInitializer({ children }: { children: ReactNode }) {
  // Automatically loads user profile on mount if token cookie exists
  const { isLoading } = useGetMeQuery();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-955 text-white">
        <div className="flex flex-col items-center space-y-4">
          {/* A sleek, modern custom spinner */}
          <div className="relative flex h-12 w-12 items-center justify-center">
            <div className="absolute h-12 w-12 animate-ping rounded-full bg-emerald-500/20" />
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          </div>
          <p className="text-sm font-medium text-zinc-400 tracking-wider">LOADING SCHOOL ERP...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AppInitializer>
        {children}
      </AppInitializer>
      <Toaster position="top-right" richColors closeButton theme="dark" />
    </Provider>
  );
}
