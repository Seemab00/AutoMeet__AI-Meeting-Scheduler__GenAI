import React from 'react';
import { cn } from '../lib/utils';

export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn('bg-white rounded-[24px] border border-lavender-200 shadow-sm hover:-translate-y-1 hover:shadow-[0_20px_35px_-12px_rgba(155,89,182,0.15)] transition-all duration-300 overflow-hidden', className)}>
    {children}
  </div>
);

export const CardHeader = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn('p-6 border-b border-lavender-100', className)}>{children}</div>
);

export const CardContent = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn('p-6', className)}>{children}</div>
);

export const CardFooter = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn('p-6 bg-lavender-50 border-t border-lavender-100', className)}>{children}</div>
);
