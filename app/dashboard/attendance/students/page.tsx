'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  useGetStudentAttendanceQuery,
  useTakeStudentAttendanceMutation,
  useGetStudentsQuery,
  useGetClassesQuery
} from '@/features/erp/erpApi';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

function StudentAttendancePageContent() {
  const searchParams = useSearchParams();
  const { data: logs = [], isLoading, refetch } = useGetStudentAttendanceQuery();
  const { data: students = [] } = useGetStudentsQuery();
  const { data: classes = [] } = useGetClassesQuery();

  const [takeStudentAttendance, { isLoading: isSaving }] = useTakeStudentAttendanceMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Take Attendance Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState<{
    [studentId: string]: 'Present' | 'Absent' | 'Late';
  }>({});

  // Filter students based on selected class
  const classStudents = React.useMemo(() => {
    if (!selectedClass) return [];
    return students.filter((s) => s.class?._id === selectedClass);
  }, [students, selectedClass]);

  // Pre-populate records state when classStudents changes
  useEffect(() => {
    const records: typeof attendanceRecords = {};
    classStudents.forEach((student) => {
      records[student._id] = 'Present';
    });
    setAttendanceRecords(records);
  }, [classStudents]);

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleOpenTake = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setSelectedClass(classes[0]?._id || '');
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (searchParams.get('take') === 'true') {
      handleOpenTake();
    }
  }, [searchParams, classes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !selectedClass) {
      toast.error('Please specify date and class.');
      return;
    }

    const payloadLogs = Object.keys(attendanceRecords).map((studentId) => ({
      studentId,
      classId: selectedClass,
      status: attendanceRecords[studentId],
    }));

    if (payloadLogs.length === 0) {
      toast.error('No students found in the selected class.');
      return;
    }

    try {
      await takeStudentAttendance({
        date,
        logs: payloadLogs,
      }).unwrap();
      toast.success('Attendance records saved successfully.');
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to save attendance.');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Student Name',
      accessor: (item) => item.student?.user?.name || 'N/A',
    },
    {
      header: 'Student ID',
      accessor: (item) => item.student?.studentId || 'N/A',
      className: 'font-mono',
    },
    {
      header: 'Class',
      accessor: (item) => item.class ? `${item.class.name} (${item.class.section})` : 'N/A',
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
          <span className="text-zinc-350">Student Attendance</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">Student Attendance</h1>
        <p className="text-sm text-zinc-450 mt-1">Track and manage student daily attendance records.</p>
      </div>

      <DataTable
        data={logs}
        columns={columns}
        addButtonLabel="Take Student Attendance"
        onAddClick={handleOpenTake}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Take Student Attendance"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Attendance Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <div>
              <label className="block text-xs font-semibold text-zinc-405 uppercase tracking-wider mb-2">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-sm text-zinc-205"
                required
              >
                <option value="" disabled>Select Class</option>
                {classes.map((cls: any) => (
                  <option key={cls._id} value={cls._id}>{cls.name} ({cls.section})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-zinc-900 pt-4 mt-6">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Students List</h4>
            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {classStudents.length === 0 ? (
                <p className="text-zinc-650 text-center py-6 text-xs">No students matching selection.</p>
              ) : (
                classStudents.map((student) => (
                  <div
                    key={student._id}
                    className="flex items-center justify-between gap-4 p-3 border border-zinc-900 bg-zinc-900/10 rounded-xl"
                  >
                    <div>
                      <p className="text-xs font-bold text-zinc-200">{student.user?.name}</p>
                      <p className="text-[10px] text-zinc-550 mt-0.5">Roll No: {student.roll} | Student ID: {student.studentId}</p>
                    </div>
                    <div className="shrink-0">
                      <select
                        value={attendanceRecords[student._id] || 'Present'}
                        onChange={(e) => handleStatusChange(student._id, e.target.value as any)}
                        className="bg-zinc-955 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-200 focus:outline-none"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
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

export default function StudentAttendancePage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-zinc-900 rounded-2xl" />}>
      <StudentAttendancePageContent />
    </Suspense>
  );
}
