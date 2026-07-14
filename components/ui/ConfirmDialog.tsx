import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone. This record will be permanently deleted from the database.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isLoading = false,
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-955/80 backdrop-blur-md animate-fadeIn">
      {/* Overlay backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Box */}
      <div className="relative w-full max-w-md border border-zinc-900 bg-zinc-950 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertTriangle className="h-5.5 w-5.5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-150 tracking-tight">{title}</h3>
            <p className="text-xs text-zinc-450 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex justify-end items-center space-x-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="border-zinc-800"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onConfirm}
            loading={isLoading}
            className="bg-red-650 hover:bg-red-555 text-white px-4"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
