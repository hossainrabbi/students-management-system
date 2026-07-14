'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  useGetStudentsQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetClassesQuery
} from '@/features/erp/erpApi';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

function StudentsPageContent() {
  const searchParams = useSearchParams();
  const { data: students = [], isLoading } = useGetStudentsQuery();
  const { data: classes = [] } = useGetClassesQuery();

  const [addStudent, { isLoading: isAdding }] = useAddStudentMutation();
  const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [deletingStudent, setDeletingStudent] = useState<any>(null);

  // Form State
  const [studentId, setStudentId] = useState('');
  const [roll, setRoll] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('male');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [classId, setClassId] = useState('');
  const [section, setSection] = useState('');
  const [status, setStatus] = useState('active');

  // Automatically update section when class changes
  useEffect(() => {
    const selectedClass = classes.find((c) => c._id === classId);
    if (selectedClass) {
      setSection(selectedClass.section);
    }
  }, [classId, classes]);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setStudentId(`STD${10000 + students.length + 1}`);
    setRoll('');
    setName('');
    setEmail('');
    setPhone('');
    setGender('male');
    setDateOfBirth('');
    setClassId(classes[0]?._id || '');
    setSection(classes[0]?.section || '');
    setStatus('active');
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      handleOpenAdd();
    }
  }, [searchParams, students, classes]);

  const handleOpenEdit = (std: any) => {
    setEditingStudent(std);
    setStudentId(std.studentId);
    setRoll(String(std.roll));
    setName(std.user?.name || '');
    setEmail(std.user?.email || '');
    setPhone(std.phone || '');
    setGender(std.gender || 'male');
    setDateOfBirth(std.dateOfBirth ? new Date(std.dateOfBirth).toISOString().split('T')[0] : '');
    setClassId(std.class?._id || '');
    setSection(std.section || '');
    setStatus(std.status);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (std: any) => {
    setDeletingStudent(std);
    setIsConfirmOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !roll || !name || !email || !phone || !classId || !gender) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const payload = {
      studentId,
      roll: Number(roll),
      name,
      email,
      phone,
      gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      class: classId,
      section,
      status,
    };

    try {
      if (editingStudent) {
        await updateStudent({
          id: editingStudent._id,
          body: payload,
        }).unwrap();
        toast.success('Student updated successfully.');
      } else {
        await addStudent(payload).unwrap();
        toast.success('Student profile created successfully.');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.data?.message || 'Action failed.');
    }
  };

  const handleDelete = async () => {
    if (!deletingStudent) return;
    try {
      await deleteStudent(deletingStudent._id).unwrap();
      toast.success('Student profile deleted.');
      setIsConfirmOpen(false);
    } catch (err: any) {
      toast.error(err.data?.message || 'Delete failed.');
    }
  };

  const columns: Column<any>[] = [
    { header: 'Student ID', accessor: 'studentId', className: 'font-mono' },
    { header: 'Roll No', accessor: 'roll', className: 'font-mono text-center' },
    { header: 'Full Name', accessor: (item) => item.user?.name || 'N/A' },
    { header: 'Email Address', accessor: (item) => item.user?.email || 'N/A' },
    { header: 'Phone Number', accessor: 'phone' },
    { header: 'Class', accessor: (item) => item.class?.name || 'N/A' },
    { header: 'Section', accessor: 'section', className: 'font-mono text-center' },
    {
      header: 'Status',
      accessor: (item) => (
        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${item.status === 'active' ? 'bg-emerald-500/10 text-emerald-455 border border-emerald-500/25' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-zinc-555 flex items-center space-x-1.5 mb-1.5">
          <span>Dashboard</span>
          <span>/</span>
          <span>Management</span>
          <span>/</span>
          <span className="text-zinc-350">Students</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">Students Directory</h1>
        <p className="text-sm text-zinc-450 mt-1">Manage student directories, rolls, profiles, and active classes.</p>
      </div>

      <DataTable
        data={students}
        columns={columns}
        searchField="studentId"
        searchPlaceholder="Search student ID (e.g. STD10001)..."
        addButtonLabel="Add Student"
        onAddClick={handleOpenAdd}
        onEditClick={handleOpenEdit}
        onDeleteClick={handleOpenDelete}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? 'Edit Student Details' : 'Add New Student'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. James Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Student ID"
              placeholder="e.g. STD10001"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. james@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              placeholder="e.g. 555-0210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-405 uppercase tracking-wider mb-2">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-sm text-zinc-205 focus:outline-none"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Input
              label="Date Of Birth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
            <Input
              label="Roll Number"
              type="number"
              placeholder="e.g. 1"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-405 uppercase tracking-wider mb-2">Class</label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-sm text-zinc-205 focus:outline-none"
                required
              >
                <option value="" disabled>Select Class</option>
                {classes.map((cls: any) => (
                  <option key={cls._id} value={cls._id}>{cls.name} ({cls.section})</option>
                ))}
              </select>
            </div>
            <Input
              label="Section"
              value={section}
              readOnly
              className="bg-zinc-900/50 text-zinc-400 cursor-not-allowed"
            />
            <div>
              <label className="block text-xs font-semibold text-zinc-405 uppercase tracking-wider mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-zinc-955 border border-zinc-900 rounded-xl px-4 py-2.5 text-sm text-zinc-205 focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
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
              loading={isAdding || isUpdating}
              className="bg-emerald-655 hover:bg-emerald-555 text-white"
            >
              Save
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function StudentsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-zinc-900 rounded-2xl" />}>
      <StudentsPageContent />
    </Suspense>
  );
}
