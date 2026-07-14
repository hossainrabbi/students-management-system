'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  useGetSubjectsQuery,
  useAddSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
  useGetClassesQuery,
  useGetTeachersQuery
} from '@/features/erp/erpApi';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

function SubjectsPageContent() {
  const searchParams = useSearchParams();
  const { data: subjects = [], isLoading } = useGetSubjectsQuery();
  const { data: classes = [] } = useGetClassesQuery();
  const { data: teachers = [] } = useGetTeachersQuery();

  const [addSubject, { isLoading: isAdding }] = useAddSubjectMutation();
  const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation();
  const [deleteSubject, { isLoading: isDeleting }] = useDeleteSubjectMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [deletingSubject, setDeletingSubject] = useState<any>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [assignedClass, setAssignedClass] = useState('');
  const [assignedTeacher, setAssignedTeacher] = useState('');
  const [status, setStatus] = useState('active');

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setName('');
    setCode('');
    setAssignedClass(classes[0]?._id || '');
    setAssignedTeacher('');
    setStatus('active');
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      handleOpenAdd();
    }
  }, [searchParams, classes]);

  const handleOpenEdit = (sub: any) => {
    setEditingSubject(sub);
    setName(sub.name);
    setCode(sub.code);
    setAssignedClass(sub.assignedClass?._id || '');
    setAssignedTeacher(sub.assignedTeacher?._id || '');
    setStatus(sub.status);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (sub: any) => {
    setDeletingSubject(sub);
    setIsConfirmOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !assignedClass) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const payload = {
      name,
      code: code.toUpperCase(),
      assignedClass,
      assignedTeacher: assignedTeacher || undefined,
      status,
    };

    try {
      if (editingSubject) {
        await updateSubject({
          id: editingSubject._id,
          body: payload,
        }).unwrap();
        toast.success('Subject updated successfully.');
      } else {
        await addSubject(payload).unwrap();
        toast.success('Subject created successfully.');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.data?.message || 'Action failed.');
    }
  };

  const handleDelete = async () => {
    if (!deletingSubject) return;
    try {
      await deleteSubject(deletingSubject._id).unwrap();
      toast.success('Subject deleted successfully.');
      setIsConfirmOpen(false);
    } catch (err: any) {
      toast.error(err.data?.message || 'Delete failed.');
    }
  };

  const columns: Column<any>[] = [
    { header: 'Subject Code', accessor: 'code', className: 'font-mono' },
    { header: 'Subject Name', accessor: 'name' },
    {
      header: 'Assigned Class',
      accessor: (item) => item.assignedClass ? `${item.assignedClass.name} (${item.assignedClass.section})` : 'N/A',
    },
    {
      header: 'Assigned Teacher',
      accessor: (item) => item.assignedTeacher?.name || <span className="text-zinc-650">Not Assigned</span>,
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
          <span>Academic</span>
          <span>/</span>
          <span className="text-zinc-350">Subjects</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">Subjects Management</h1>
        <p className="text-sm text-zinc-450 mt-1">Manage course codes, names, classes, and assigned teachers.</p>
      </div>

      <DataTable
        data={subjects}
        columns={columns}
        searchField="name"
        searchPlaceholder="Search subject name..."
        addButtonLabel="Add Subject"
        onAddClick={handleOpenAdd}
        onEditClick={handleOpenEdit}
        onDeleteClick={handleOpenDelete}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? 'Edit Subject' : 'Add New Subject'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Subject Name"
              placeholder="e.g. Calculus I"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Subject Code"
              placeholder="e.g. MATH101"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-405 uppercase tracking-wider mb-2">Assigned Class</label>
            <select
              value={assignedClass}
              onChange={(e) => setAssignedClass(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-sm text-zinc-205 focus:outline-none"
              required
            >
              <option value="" disabled>Select Class</option>
              {classes.map((cls: any) => (
                <option key={cls._id} value={cls._id}>{cls.name} ({cls.section})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-405 uppercase tracking-wider mb-2">Assigned Teacher</label>
            <select
              value={assignedTeacher}
              onChange={(e) => setAssignedTeacher(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-sm text-zinc-205 focus:outline-none"
            >
              <option value="">No Teacher Assigned</option>
              {teachers.map((tch: any) => (
                <option key={tch.user?._id} value={tch.user?._id}>
                  {tch.user?.name} ({tch.employeeId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-405 uppercase tracking-wider mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-sm text-zinc-205"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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

export default function SubjectsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-zinc-900 rounded-2xl" />}>
      <SubjectsPageContent />
    </Suspense>
  );
}
