import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-lavender-500 text-white hover:bg-lavender-400 shadow-[0_10px_20px_-8px_rgba(155,89,182,0.3)] hover:shadow-[0_25px_40px_-12px_rgba(155,89,182,0.25)] hover:scale-105',
      secondary: 'bg-lavender-50 text-lavender-900 border border-lavender-200 hover:bg-lavender-100 hover:border-lavender-300 hover:scale-105',
      outline: 'border-2 border-lavender-500 bg-transparent text-lavender-600 hover:bg-lavender-50 hover:scale-105 hover:shadow-[0_10px_20px_-8px_rgba(155,89,182,0.1)]',
      ghost: 'hover:bg-lavender-100 text-lavender-700 hover:text-lavender-800 hover:scale-105',
      danger: 'bg-red-500 text-white hover:bg-red-400 shadow-sm hover:scale-105',
    };

    const sizes = {
      sm: 'h-8 px-4 text-xs',
      md: 'h-10 px-6 py-2.5',
      lg: 'h-12 px-8 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-400 disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100 disabled:hover:shadow-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
