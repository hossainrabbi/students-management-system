import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md transition-all duration-200 animate-fadeIn">
      {/* Backdrop overlay closer */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Content Box */}
      <div
        className={`relative w-full ${sizeClasses[size]} border border-zinc-900 bg-zinc-950 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transform scale-100 transition-transform duration-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 px-6 py-5 bg-zinc-900/10">
          <h3 className="text-lg font-bold text-zinc-100 tracking-tight leading-none">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent bg-zinc-950">
          {children}
        </div>
      </div>
    </div>
  );
}
