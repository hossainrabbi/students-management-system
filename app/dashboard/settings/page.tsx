'use client';

import React, { useState } from 'react';
import { useAppSelector } from '@/hooks/redux';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user } = useAppSelector((state) => state.auth);

  // General Settings State
  const [schoolName, setSchoolName] = useState('Modern Elementary School');
  const [phone, setPhone] = useState('555-0100');
  const [address, setAddress] = useState('123 Education Way, Springfield');
  const [systemEmail, setSystemEmail] = useState('info@school.com');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('System settings saved successfully.');
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-zinc-550 flex items-center space-x-1.5 mb-1.5">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-zinc-350">Settings</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">Settings</h1>
        <p className="text-sm text-zinc-400">Configure school organization profile and parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-zinc-900 bg-zinc-900/40 p-6 space-y-4 lg:col-span-2">
          <CardHeader className="p-0 border-b border-zinc-900 pb-3">
            <CardTitle>School Information</CardTitle>
            <CardDescription>Update general institutional profile parameters.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <Input
              label="School Name"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="System Email Address"
                value={systemEmail}
                onChange={(e) => setSystemEmail(e.target.value)}
                required
              />
              <Input
                label="Phone Contact"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <Input
              label="Physical Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <div className="flex justify-end pt-2">
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                Save Settings
              </Button>
            </div>
          </form>
        </Card>

        <Card className="border-zinc-900 bg-zinc-900/40 p-6 space-y-4 lg:col-span-1">
          <CardHeader className="p-0 border-b border-zinc-900 pb-3">
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Your current login profile details.</CardDescription>
          </CardHeader>
          <div className="space-y-3 pt-2">
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Account Role</p>
              <p className="text-sm font-semibold text-emerald-450 uppercase tracking-wide mt-1">{user?.role}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Name</p>
              <p className="text-xs text-zinc-200 mt-1">{user?.name}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Email Address</p>
              <p className="text-xs text-zinc-200 mt-1">{user?.email}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
