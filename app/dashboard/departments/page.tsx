'use client';

import React, { useState } from 'react';
import {
  useGetDepartmentsQuery,
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation
} from '@/features/erp/erpApi';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

export default function DepartmentsPage() {
  const { data: departments = [], isLoading } = useGetDepartmentsQuery();
  const [addDepartment, { isLoading: isAdding }] = useAddDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();
  const [deleteDepartment, { isLoading: isDeleting }] = useDeleteDepartmentMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [deletingDept, setDeletingDept] = useState<any>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  const handleOpenAdd = () => {
    setEditingDept(null);
    setName('');
    setCode('');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept: any) => {
    setEditingDept(dept);
    setName(dept.name);
    setCode(dept.code);
    setDescription(dept.description || '');
    setIsModalOpen(true);
  };

  const handleOpenDelete = (dept: any) => {
    setDeletingDept(dept);
    setIsConfirmOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const payload = {
      name,
      code: code.toUpperCase(),
      description,
    };

    try {
      if (editingDept) {
        await updateDepartment({
          id: editingDept._id,
          body: payload,
        }).unwrap();
        toast.success('Department updated successfully.');
      } else {
        await addDepartment(payload).unwrap();
        toast.success('Department created successfully.');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.data?.message || 'Action failed.');
    }
  };

  const handleDelete = async () => {
    if (!deletingDept) return;
    try {
      await deleteDepartment(deletingDept._id).unwrap();
      toast.success('Department deleted successfully.');
      setIsConfirmOpen(false);
    } catch (err: any) {
      toast.error(err.data?.message || 'Delete failed.');
    }
  };

  const columns: Column<any>[] = [
    { header: 'Department Code', accessor: 'code', className: 'font-mono' },
    { header: 'Department Name', accessor: 'name' },
    { header: 'Description', accessor: (item) => item.description || '-' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-zinc-550 flex items-center space-x-1.5 mb-1.5">
          <span>Dashboard</span>
          <span>/</span>
          <span>Management</span>
          <span>/</span>
          <span className="text-zinc-350">Departments</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">Departments</h1>
        <p className="text-sm text-zinc-400">Manage academic department codes, names, and descriptions.</p>
      </div>

      <DataTable
        data={departments}
        columns={columns}
        searchField="name"
        searchPlaceholder="Search department name..."
        addButtonLabel="Add Department"
        onAddClick={handleOpenAdd}
        onEditClick={handleOpenEdit}
        onDeleteClick={handleOpenDelete}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDept ? 'Edit Department' : 'Add New Department'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Department Name"
              placeholder="e.g. Computer Science"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Department Code"
              placeholder="e.g. CS"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Description</label>
            <textarea
              placeholder="Provide a brief description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50"
            />
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
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
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
