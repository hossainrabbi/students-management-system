import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        'rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md shadow-2xl shadow-black/45 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div className={twMerge('p-6 pb-4 border-b border-zinc-800/30', className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }: CardProps) {
  return (
    <div className={twMerge('p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: CardProps) {
  return (
    <div className={twMerge('p-6 pt-4 border-t border-zinc-800/30 flex items-center justify-end', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: CardProps) {
  return (
    <h3 className={twMerge('text-lg font-semibold leading-none tracking-tight text-zinc-150', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }: CardProps) {
  return (
    <p className={twMerge('text-sm text-zinc-450', className)} {...props}>
      {children}
    </p>
  );
}
