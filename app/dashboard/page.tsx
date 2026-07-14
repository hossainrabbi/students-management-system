'use client';

import React from 'react';
import { useGetDashboardStatsQuery } from '@/features/erp/erpApi';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import {
  Users,
  GraduationCap,
  Layers,
  BookOpen,
  CalendarCheck,
  UserCheck,
  TrendingUp,
  User as UserIcon
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function DashboardPage() {
  const { data: stats, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-zinc-900 rounded-lg" />
          <div className="h-4 w-96 bg-zinc-900 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-zinc-900/60 border border-zinc-900 rounded-2xl" />
          ))}
        </div>
        <div className="h-96 bg-zinc-900/60 border border-zinc-900 rounded-2xl" />
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Students',
      value: stats?.totalStudents || 0,
      trend: '+8 this month',
      desc: 'Enrolled pupils',
      icon: GraduationCap,
      color: 'text-emerald-450 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5',
    },
    {
      title: 'Teachers',
      value: stats?.totalTeachers || 0,
      trend: '+2 this term',
      desc: 'Faculty staff',
      icon: Users,
      color: 'text-blue-450 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5',
    },
    {
      title: 'Classes',
      value: stats?.totalClasses || 0,
      trend: 'Allocated classes',
      desc: 'Grade levels',
      icon: Layers,
      color: 'text-purple-450 bg-purple-500/10 border-purple-500/20 shadow-purple-500/5',
    },
    {
      title: 'Subjects',
      value: stats?.totalSubjects || 0,
      trend: 'Active subjects',
      desc: 'Curriculum courses',
      icon: BookOpen,
      color: 'text-amber-450 bg-amber-500/10 border-amber-500/20 shadow-amber-500/5',
    },
    {
      title: 'Student Attd.',
      value: stats?.todayStudentAttendance || 0,
      trend: '92% avg rate',
      desc: 'Logged today',
      icon: CalendarCheck,
      color: 'text-pink-450 bg-pink-500/10 border-pink-500/20 shadow-pink-500/5',
    },
    {
      title: 'Teacher Attd.',
      value: stats?.todayTeacherAttendance || 0,
      trend: '98% avg rate',
      desc: 'Logged today',
      icon: UserCheck,
      color: 'text-cyan-450 bg-cyan-500/10 border-cyan-500/20 shadow-cyan-500/5',
    },
  ];

  return (
    <div className="space-y-10 md:space-y-12">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">Overview Dashboard</h1>
        <p className="text-sm font-semibold text-zinc-455 mt-1.5">Here is your university capstone analytics summary for today.</p>
      </div>

      {/* Row 1: Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {metricCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="border border-zinc-900/80 bg-zinc-900/15 p-5 rounded-2xl flex flex-col justify-between hover:scale-[1.01] hover:border-zinc-805 hover:bg-zinc-900/25 hover:shadow-lg hover:shadow-black/20 transition-all duration-150">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider select-none">{card.title}</span>
                <div className={`flex h-8.5 w-8.5 items-center justify-center rounded-xl border shadow-sm ${card.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-black text-zinc-100 tracking-tight leading-none">{card.value}</h3>
                <p className="text-[10px] font-bold text-emerald-440 mt-3 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {card.trend}
                </p>
                <p className="text-[10px] text-zinc-550 font-semibold mt-1">{card.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Row 2: Attendance Trend Area Chart */}
      <Card className="border border-zinc-900/80 bg-zinc-900/15 p-6 rounded-2xl">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-xl font-bold tracking-tight text-zinc-205">Student Attendance Trend</CardTitle>
          <CardDescription className="text-xs font-semibold text-zinc-550">Daily attendance trends representing the last 7 active logs.</CardDescription>
        </CardHeader>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats?.trendData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
              <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} />
              <YAxis stroke="#52525b" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#18181b', borderRadius: '12px' }}
                labelStyle={{ color: '#a1a1aa', fontWeight: 'bold', fontSize: '11px' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area name="Present" type="monotone" dataKey="Present" stroke="#10b981" fillOpacity={1} fill="url(#colorPresent)" strokeWidth={2} />
              <Area name="Absent" type="monotone" dataKey="Absent" stroke="#ef4444" fillOpacity={1} fill="url(#colorAbsent)" strokeWidth={2} />
              <Area name="Late" type="monotone" dataKey="Late" stroke="#f59e0b" fillOpacity={1} fill="url(#colorLate)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Row 3: Recent Students & Recent Teachers registries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <Card className="border border-zinc-900/80 bg-zinc-900/15 p-6 rounded-2xl">
          <CardHeader className="p-0 border-b border-zinc-900 pb-4.5 mb-5">
            <CardTitle className="text-xl font-bold tracking-tight text-zinc-205">Recent Students</CardTitle>
            <CardDescription className="text-xs font-semibold text-zinc-550">Latest student enrollment profiles logged in the system.</CardDescription>
          </CardHeader>
          <div className="overflow-x-auto rounded-xl border border-zinc-900">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 bg-zinc-900/20 text-zinc-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Photo</th>
                  <th className="px-4">Student ID</th>
                  <th className="px-4">Name</th>
                  <th className="px-4">Class</th>
                  <th className="text-right px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/30">
                {stats?.recentStudents?.map((std: any, idx: number) => (
                  <tr key={idx} className="hover:bg-zinc-900/10 transition-colors duration-150">
                    <td className="py-3.5 px-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-355 shadow-sm font-extrabold uppercase">
                        {std.user?.name ? std.user.name[0] : 'S'}
                      </div>
                    </td>
                    <td className="font-mono text-zinc-450 px-4">{std.studentId}</td>
                    <td className="font-bold text-zinc-200 px-4">{std.user?.name}</td>
                    <td className="px-4 font-semibold text-zinc-400">{std.class ? `${std.class.name} (${std.class.section})` : 'N/A'}</td>
                    <td className="text-right px-4">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] uppercase font-extrabold tracking-wider ${std.status === 'active' ? 'bg-emerald-500/10 text-emerald-440 border border-emerald-500/20 shadow-sm shadow-emerald-500/5' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}>
                        {std.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Teachers */}
        <Card className="border border-zinc-900/80 bg-zinc-900/15 p-6 rounded-2xl">
          <CardHeader className="p-0 border-b border-zinc-900 pb-4.5 mb-5">
            <CardTitle className="text-xl font-bold tracking-tight text-zinc-205">Recent Teachers</CardTitle>
            <CardDescription className="text-xs font-semibold text-zinc-550">Latest teacher enrollment profiles logged in the system.</CardDescription>
          </CardHeader>
          <div className="overflow-x-auto rounded-xl border border-zinc-900">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 bg-zinc-900/20 text-zinc-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Photo</th>
                  <th className="px-4">Teacher ID</th>
                  <th className="px-4">Name</th>
                  <th className="px-4">Department</th>
                  <th className="text-right px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/30">
                {stats?.recentTeachers?.map((tch: any, idx: number) => (
                  <tr key={idx} className="hover:bg-zinc-900/10 transition-colors duration-150">
                    <td className="py-3.5 px-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-355 shadow-sm font-extrabold uppercase">
                        {tch.user?.name ? tch.user.name[0] : 'T'}
                      </div>
                    </td>
                    <td className="font-mono text-zinc-450 px-4">{tch.employeeId}</td>
                    <td className="font-bold text-zinc-200 px-4">{tch.user?.name}</td>
                    <td className="px-4 font-semibold text-zinc-400">{tch.department?.name || 'General'}</td>
                    <td className="text-right px-4">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] uppercase font-extrabold tracking-wider ${tch.status === 'active' ? 'bg-emerald-500/10 text-emerald-440 border border-emerald-500/20 shadow-sm shadow-emerald-500/5' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}>
                        {tch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
