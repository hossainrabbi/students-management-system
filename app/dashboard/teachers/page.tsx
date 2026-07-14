'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  useGetTeachersQuery,
  useAddTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
  useGetDepartmentsQuery,
  useGetSubjectsQuery
} from '@/features/erp/erpApi';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

function TeachersPageContent() {
  const searchParams = useSearchParams();
  const { data: teachers = [], isLoading } = useGetTeachersQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();
  const { data: subjects = [] } = useGetSubjectsQuery();

  const [addTeacher, { isLoading: isAdding }] = useAddTeacherMutation();
  const [updateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();
  const [deleteTeacher, { isLoading: isDeleting }] = useDeleteTeacherMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<any>(null);

  // Form State
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [status, setStatus] = useState('active');

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setEmployeeId(`TCH${1000 + teachers.length + 1}`);
    setName('');
    setEmail('');
    setPhone('');
    setDepartmentId(departments[0]?._id || '');
    setSelectedSubjects([]);
    setStatus('active');
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      handleOpenAdd();
    }
  }, [searchParams, teachers, departments]);

  const handleOpenEdit = (tch: any) => {
    setEditingTeacher(tch);
    setEmployeeId(tch.employeeId);
    setName(tch.user?.name || '');
    setEmail(tch.user?.email || '');
    setPhone(tch.phone || '');
    setDepartmentId(tch.department?._id || '');
    setSelectedSubjects(tch.assignedSubjects?.map((s: any) => s._id) || []);
    setStatus(tch.status);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (tch: any) => {
    setDeletingTeacher(tch);
    setIsConfirmOpen(true);
  };

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !name || !email || !phone || !departmentId) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const payload = {
      employeeId,
      name,
      email,
      phone,
      department: departmentId,
      assignedSubjects: selectedSubjects,
      status,
    };

    try {
      if (editingTeacher) {
        await updateTeacher({
          id: editingTeacher._id,
          body: payload,
        }).unwrap();
        toast.success('Teacher updated successfully.');
      } else {
        await addTeacher(payload).unwrap();
        toast.success('Teacher profile created successfully.');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.data?.message || 'Action failed.');
    }
  };

  const handleDelete = async () => {
    if (!deletingTeacher) return;
    try {
      await deleteTeacher(deletingTeacher._id).unwrap();
      toast.success('Teacher profile deleted.');
      setIsConfirmOpen(false);
    } catch (err: any) {
      toast.error(err.data?.message || 'Delete failed.');
    }
  };

  const columns: Column<any>[] = [
    { header: 'Employee ID', accessor: 'employeeId', className: 'font-mono' },
    { header: 'Full Name', accessor: (item) => item.user?.name || 'N/A' },
    { header: 'Email Address', accessor: (item) => item.user?.email || 'N/A' },
    { header: 'Phone Number', accessor: 'phone' },
    { header: 'Department', accessor: (item) => item.department?.name || 'N/A' },
    {
      header: 'Assigned Subjects',
      accessor: (item) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {item.assignedSubjects && item.assignedSubjects.length > 0 ? (
            item.assignedSubjects.map((sub: any) => (
              <span key={sub._id} className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-semibold">
                {sub.name}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-zinc-650">None</span>
          )}
        </div>
      ),
    },
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
          <span className="text-zinc-350">Teachers</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">Teachers</h1>
        <p className="text-sm text-zinc-450 mt-1">Manage faculty staff members, departments, and course assignments.</p>
      </div>

      <DataTable
        data={teachers}
        columns={columns}
        searchField="employeeId"
        searchPlaceholder="Search employee ID (e.g. TCH1001)..."
        addButtonLabel="Add Teacher"
        onAddClick={handleOpenAdd}
        onEditClick={handleOpenEdit}
        onDeleteClick={handleOpenDelete}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTeacher ? 'Edit Teacher Details' : 'Add New Teacher'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Employee ID"
              placeholder="e.g. TCH1001"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. john@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              placeholder="e.g. 555-0199"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-405 uppercase tracking-wider mb-2">Department</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-sm text-zinc-205 focus:outline-none"
                required
              >
                <option value="" disabled>Select Department</option>
                {departments.map((d: any) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-405 uppercase tracking-wider mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-sm text-zinc-205 focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-405 uppercase tracking-wider mb-2">Assigned Subjects</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-3 border border-zinc-900 bg-zinc-950 rounded-xl">
              {subjects.map((sub: any) => (
                <label key={sub._id} className="flex items-center space-x-2 text-xs text-zinc-300 hover:text-zinc-150 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(sub._id)}
                    onChange={() => handleSubjectToggle(sub._id)}
                    className="rounded bg-zinc-950 border-zinc-900 text-emerald-500 focus:ring-emerald-500/20"
                  />
                  <span>{sub.name}</span>
                </label>
              ))}
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

export default function TeachersPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-zinc-900 rounded-2xl" />}>
      <TeachersPageContent />
    </Suspense>
  );
}
