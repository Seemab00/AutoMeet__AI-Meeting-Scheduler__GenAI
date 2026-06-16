import React from 'react';
import { cn } from '../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && <label className="text-sm font-semibold text-lavender-900">{label}</label>}
        <input
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-xl border border-lavender-200 bg-white px-4 py-2 text-sm text-lavender-950 transition-all duration-200 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-lavender-400 focus-visible:outline-none focus:border-lavender-400 focus:shadow-[0_0_15px_rgba(192,132,252,0.3)] disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus-visible:ring-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.3)]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);
