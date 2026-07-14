'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  useGetTeacherAttendanceQuery,
  useTakeTeacherAttendanceMutation,
  useGetTeachersQuery
} from '@/features/erp/erpApi';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

function TeacherAttendancePageContent() {
  const searchParams = useSearchParams();
  const { data: logs = [], isLoading, refetch } = useGetTeacherAttendanceQuery();
  const { data: teachers = [] } = useGetTeachersQuery();

  const [takeTeacherAttendance, { isLoading: isSaving }] = useTakeTeacherAttendanceMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Take Attendance Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<{
    [teacherId: string]: 'Present' | 'Absent' | 'Late';
  }>({});

  // Pre-populate records state when teachers changes
  useEffect(() => {
    const records: typeof attendanceRecords = {};
    teachers.forEach((teacher) => {
      records[teacher._id] = 'Present';
    });
    setAttendanceRecords(records);
  }, [teachers]);

  const handleStatusChange = (teacherId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [teacherId]: status,
    }));
  };

  const handleOpenTake = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (searchParams.get('take') === 'true') {
      handleOpenTake();
    }
  }, [searchParams, teachers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error('Please specify date.');
      return;
    }

    const payloadLogs = Object.keys(attendanceRecords).map((teacherId) => ({
      teacherId,
      status: attendanceRecords[teacherId],
    }));

    if (payloadLogs.length === 0) {
      toast.error('No teachers found.');
      return;
    }

    try {
      await takeTeacherAttendance({
        date,
        logs: payloadLogs,
      }).unwrap();
      toast.success('Teacher attendance logged.');
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to save attendance.');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Teacher Name',
      accessor: (item) => item.teacher?.user?.name || 'N/A',
    },
    {
      header: 'Employee ID',
      accessor: (item) => item.teacher?.employeeId || 'N/A',
      className: 'font-mono',
    },
    {
      header: 'Date',
      accessor: (item) => new Date(item.date).toLocaleDateString(),
      className: 'font-mono',
    },
    {
      header: 'Attendance Status',
      accessor: (item) => {
        const colors = {
          Present: 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20',
          Absent: 'bg-red-500/10 text-red-400 border border-red-500/20',
          Late: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        };
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${colors[item.status as keyof typeof colors]}`}>
            {item.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-zinc-555 flex items-center space-x-1.5 mb-1.5">
          <span>Dashboard</span>
          <span>/</span>
          <span>Attendance</span>
          <span>/</span>
          <span className="text-zinc-350">Teacher Attendance</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">Teacher Attendance</h1>
        <p className="text-sm text-zinc-450 mt-1">Track and manage teacher daily attendance records.</p>
      </div>

      <DataTable
        data={logs}
        columns={columns}
        addButtonLabel="Take Teacher Attendance"
        onAddClick={handleOpenTake}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Take Teacher Attendance"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Attendance Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div className="border-t border-zinc-900 pt-4 mt-6">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Teachers List</h4>
            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {teachers.map((teacher) => (
                <div
                  key={teacher._id}
                  className="flex items-center justify-between gap-4 p-3 border border-zinc-900 bg-zinc-900/10 rounded-xl"
                >
                  <div>
                    <p className="text-xs font-bold text-zinc-200">{teacher.user?.name}</p>
                    <p className="text-[10px] text-zinc-550 mt-0.5">{teacher.employeeId} | {teacher.phone}</p>
                  </div>
                  <div className="shrink-0">
                    <select
                      value={attendanceRecords[teacher._id] || 'Present'}
                      onChange={(e) => handleStatusChange(teacher._id, e.target.value as any)}
                      className="bg-zinc-955 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-200 focus:outline-none"
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-6 border-t border-zinc-900">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="border-zinc-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSaving}
              className="bg-emerald-655 hover:bg-emerald-555 text-white"
            >
              Save Attendance
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function TeacherAttendancePage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-zinc-900 rounded-2xl" />}>
      <TeacherAttendancePageContent />
    </Suspense>
  );
}
