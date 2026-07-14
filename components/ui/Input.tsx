import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="text-[11px] font-bold tracking-wide text-zinc-450 select-none">
            {label}
            {props.required && <span className="text-red-500 ml-1 font-bold">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
              {icon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={twMerge(
              'w-full bg-zinc-900/40 border border-zinc-900 rounded-xl px-4 py-3 text-sm text-zinc-150 placeholder:text-zinc-550 focus:outline-none focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-150',
              icon && 'pl-11',
              error && 'border-red-500/60 focus:border-red-500/60 focus:ring-red-500/10',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs font-semibold text-red-500 mt-1.5 pl-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
